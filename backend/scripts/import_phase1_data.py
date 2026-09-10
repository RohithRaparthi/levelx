"""
LEVELX Phase 1 Data Importer
----------------------------
Reads Excel / CSV / JSON files containing Phase 1 hackathon data,
validates structure, normalizes records, and safely imports into PostgreSQL database.

Usage:
    python scripts/import_phase1_data.py --file <path_to_excel_or_csv> [--dry-run]
"""

import os
import sys
import argparse
import pandas as pd
from typing import List, Dict, Any, Optional
from dataclasses import dataclass, field

# Ensure backend root is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from sqlalchemy import select
from sqlalchemy.orm import Session
from app.db.session import SyncSessionLocal, sync_engine
from app.models import Phase, Team, Student, TeamMember, Highlight, Base


@dataclass
class ImportReport:
    total_rows_read: int = 0
    teams_created: int = 0
    teams_updated: int = 0
    students_created: int = 0
    memberships_created: int = 0
    duplicate_students: int = 0
    duplicate_teams: int = 0
    errors: List[str] = field(default_factory=list)
    warnings: List[str] = field(default_factory=list)


def clean_str(val: Any) -> Optional[str]:
    """Clean and strip string values."""
    if pd.isna(val) or val is None:
        return None
    val_str = str(val).strip()
    return val_str if val_str else None


def clean_score(val: Any) -> Optional[float]:
    """Clean and parse numerical score (0 to 100)."""
    if pd.isna(val) or val is None:
        return None
    try:
        score = float(val)
        if 0.0 <= score <= 100.0:
            return round(score, 2)
        elif score > 100.0:
            # Normalize if scaled differently
            return round(score, 2)
        return None
    except (ValueError, TypeError):
        return None


def clean_rank(val: Any) -> Optional[int]:
    """Clean and parse integer rank."""
    if pd.isna(val) or val is None:
        return None
    try:
        return int(float(val))
    except (ValueError, TypeError):
        return None


def inspect_data_file(filepath: str) -> Dict[str, Any]:
    """Inspect and return schema summary of an input file."""
    if not os.path.exists(filepath):
        return {"error": f"File not found: {filepath}"}

    ext = os.path.splitext(filepath)[-1].lower()
    try:
        if ext in [".xlsx", ".xls"]:
            df = pd.read_excel(filepath)
        elif ext == ".csv":
            df = pd.read_csv(filepath)
        elif ext == ".json":
            df = pd.read_json(filepath)
        else:
            return {"error": f"Unsupported format: {ext}"}

        summary = {
            "file": filepath,
            "shape": df.shape,
            "columns": list(df.columns),
            "missing_values": df.isna().sum().to_dict(),
            "sample": df.head(3).to_dict(orient="records"),
        }
        return summary
    except Exception as e:
        return {"error": str(e)}


def import_phase1_dataset(filepath: str, db: Session, dry_run: bool = False) -> ImportReport:
    """Import and validate Phase 1 data into PostgreSQL."""
    report = ImportReport()
    
    if not os.path.exists(filepath):
        report.errors.append(f"File not found: {filepath}")
        return report

    ext = os.path.splitext(filepath)[-1].lower()
    try:
        if ext in [".xlsx", ".xls"]:
            df = pd.read_excel(filepath)
        elif ext == ".csv":
            df = pd.read_csv(filepath)
        else:
            report.errors.append(f"Unsupported format: {ext}")
            return report
    except Exception as e:
        report.errors.append(f"Failed to read file {filepath}: {str(e)}")
        return report

    report.total_rows_read = len(df)
    print(f"\n[+] Loaded {len(df)} rows from {filepath}")
    print(f"[+] Identified columns: {list(df.columns)}")

    # 1. Ensure Phase 1 entry exists
    phase = db.query(Phase).filter(Phase.name.ilike("%Phase 1%")).first()
    if not phase and not dry_run:
        phase = Phase(
            name="Phase 1",
            theme="Retrieval-Augmented Generation (RAG)",
            status="completed",
            date="2026-08-22"
        )
        db.add(phase)
        db.flush()
        print(f"[+] Created Phase 1 record (ID: {phase.id})")
    elif phase:
        print(f"[+] Linked to existing Phase: {phase.name} (ID: {phase.id})")

    # Column Mapping Dictionary (supports various naming styles in Excel)
    col_map = {col.lower().strip().replace(" ", "_"): col for col in df.columns}

    def get_val(row, *aliases):
        for alias in aliases:
            cleaned_alias = alias.lower().strip().replace(" ", "_")
            if cleaned_alias in col_map:
                val = row[col_map[cleaned_alias]]
                if not pd.isna(val):
                    return val
        return None

    # Cache existing records in memory to prevent duplicate queries
    existing_students = {s.participant_id: s for s in db.query(Student).all() if s.participant_id}
    existing_teams = {t.team_name.lower(): t for t in db.query(Team).all()}

    # Iterate through records
    for idx, row in df.iterrows():
        row_num = idx + 2 # Excel 1-based index with header

        # Extract fields
        team_name_raw = get_val(row, "team_name", "team", "team name", "group_name")
        project_name_raw = get_val(row, "project_name", "project", "project title", "title")
        score_raw = get_val(row, "score", "credits", "total_score", "marks")
        rank_raw = get_val(row, "rank", "position")
        award_raw = get_val(row, "award", "prize", "recognition")
        desc_raw = get_val(row, "project_description", "description", "abstract", "summary")
        github_raw = get_val(row, "github_url", "github", "repo", "repository")
        demo_raw = get_val(row, "demo_url", "demo", "link", "video_url")

        # Student fields
        student_name_raw = get_val(row, "student_name", "name", "member_name", "participant_name")
        email_raw = get_val(row, "email", "mail", "student_email")
        college_raw = get_val(row, "college", "institution", "university", "campus")
        participant_id_raw = get_val(row, "participant_id", "roll_no", "id", "student_id")

        team_name = clean_str(team_name_raw)
        if not team_name:
            report.warnings.append(f"Row {row_num}: Missing team_name, skipped.")
            continue

        # Process Team
        team = existing_teams.get(team_name.lower())
        if not team:
            if not dry_run and phase:
                team = Team(
                    phase_id=phase.id,
                    team_name=team_name,
                    project_name=clean_str(project_name_raw),
                    score=clean_score(score_raw),
                    rank=clean_rank(rank_raw),
                    award=clean_str(award_raw),
                    project_description=clean_str(desc_raw),
                    github_url=clean_str(github_raw),
                    demo_url=clean_str(demo_raw),
                )
                db.add(team)
                db.flush()
                existing_teams[team_name.lower()] = team
            report.teams_created += 1
        else:
            report.duplicate_teams += 1

        # Process Student (if present on row)
        student_name = clean_str(student_name_raw)
        if student_name:
            participant_id = clean_str(participant_id_raw) or f"PART-{idx+1:04d}"
            student = existing_students.get(participant_id)
            if not student:
                if not dry_run:
                    student = Student(
                        name=student_name,
                        email=clean_str(email_raw),
                        college=clean_str(college_raw) or "KIET",
                        participant_id=participant_id,
                    )
                    db.add(student)
                    db.flush()
                    existing_students[participant_id] = student
                report.students_created += 1
            else:
                report.duplicate_students += 1

            # Process Membership
            if not dry_run and team and student:
                existing_membership = db.query(TeamMember).filter_by(
                    team_id=team.id, student_id=student.id
                ).first()
                if not existing_membership:
                    membership = TeamMember(team_id=team.id, student_id=student.id)
                    db.add(membership)
                    report.memberships_created += 1

    if not dry_run:
        db.commit()
        print("[+] Transaction committed successfully.")
    else:
        print("[!] Dry-run mode: No database changes were committed.")

    return report


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="LEVELX Phase 1 Data Importer")
    parser.add_argument("--file", type=str, help="Path to Excel/CSV file to import")
    parser.add_argument("--inspect", action="store_true", help="Inspect file schema only")
    parser.add_argument("--dry-run", action="store_true", help="Validate without committing")
    args = parser.parse_args()

    if not args.file:
        print("LEVELX Data Importer v1.0.0")
        print("No file specified. Use --file <filepath> [--inspect] [--dry-run]")
        sys.exit(0)

    if args.inspect:
        result = inspect_data_file(args.file)
        import json
        print(json.dumps(result, indent=2, default=str))
    else:
        db = SyncSessionLocal()
        try:
            report = import_phase1_dataset(args.file, db, dry_run=args.dry_run)
            print("\n=== IMPORT REPORT ===")
            print(f"Total Rows:          {report.total_rows_read}")
            print(f"Teams Created:       {report.teams_created}")
            print(f"Students Created:    {report.students_created}")
            print(f"Memberships Linked:  {report.memberships_created}")
            print(f"Duplicate Teams:     {report.duplicate_teams}")
            print(f"Duplicate Students:  {report.duplicate_students}")
            if report.errors:
                print(f"Errors ({len(report.errors)}): {report.errors}")
            if report.warnings:
                print(f"Warnings ({len(report.warnings)}): {report.warnings[:5]}")
        finally:
            db.close()
