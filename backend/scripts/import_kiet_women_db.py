import os
import sys
import json
from sqlalchemy.orm import Session

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.db.session import SyncSessionLocal, sync_engine
from app.models import Phase, Team, Student, TeamMember, Base

def import_kiet_women_data():
    # 1. Ensure schema is updated
    Base.metadata.create_all(bind=sync_engine)
    
    session: Session = SyncSessionLocal()
    try:
        # Load structured JSON
        with open('backend/scripts/kiet_women_structured.json', 'r', encoding='utf-8') as f:
            structured_teams = json.load(f)

        print(f"Loaded {len(structured_teams)} teams from structured dataset.")

        # 2. Get or create Phase 1
        phase1 = session.query(Phase).filter(Phase.name.ilike("%Phase 1%")).first()
        if not phase1:
            phase1 = Phase(
                name="Phase 1 — Retrieval-Augmented Generation (RAG)",
                theme="Retrieval-Augmented Generation (RAG)",
                status="completed",
                date="August 2026",
            )
            session.add(phase1)
            session.flush()
        else:
            phase1.theme = "Retrieval-Augmented Generation (RAG)"
            phase1.status = "completed"

        # 3. Clean any existing mock or previous Phase 1 teams for clean real insertion
        existing_teams = session.query(Team).filter(Team.phase_id == phase1.id).all()
        for t in existing_teams:
            session.delete(t)
        session.flush()
        print("Cleared previous records for clean production import.")

        teams_created = 0
        students_created = 0
        memberships_created = 0
        disqualified_count = 0
        evaluated_count = 0

        # Cache for students by roll_no
        students_by_roll = {}

        for t_data in structured_teams:
            # Create Team
            team = Team(
                phase_id=phase1.id,
                team_name=t_data["team_name"],
                project_name=t_data.get("project_name"),
                score=t_data.get("score"),
                rank=t_data.get("rank"),
                award=t_data.get("grade"),
                project_description=t_data.get("problem_statement"),
                college=t_data.get("college", "KIET Women"),
                status=t_data.get("status", "evaluated"),
                department=t_data.get("dept"),
                evaluator_notes=t_data.get("evaluator_notes"),
            )
            session.add(team)
            session.flush()
            teams_created += 1

            if t_data.get("status") == "disqualified":
                disqualified_count += 1
            else:
                evaluated_count += 1

            # Process Members
            for m in t_data.get("members", []):
                roll = m["roll_no"].strip()
                name = m["name"].strip()
                
                # Check if student already exists in cache or db
                student = students_by_roll.get(roll)
                if not student:
                    student = session.query(Student).filter(Student.participant_id == roll).first()
                
                if not student:
                    student = Student(
                        name=name,
                        email=f"{roll.lower()}@kietgroup.com",
                        college="KIET Women",
                        participant_id=roll,
                    )
                    session.add(student)
                    session.flush()
                    students_created += 1
                    students_by_roll[roll] = student
                
                # Create Membership
                member_entry = TeamMember(
                    team_id=team.id,
                    student_id=student.id,
                )
                session.add(member_entry)
                memberships_created += 1

        session.commit()
        print("\n=== KIET WOMEN IMPORT SUMMARY ===")
        print(f"Teams Imported: {teams_created}")
        print(f"  - Evaluated Teams: {evaluated_count}")
        print(f"  - Disqualified Teams: {disqualified_count}")
        print(f"Students Created: {students_created}")
        print(f"Team Memberships Created: {memberships_created}")
        print("Import completed successfully!")

    except Exception as e:
        session.rollback()
        print("Error during import:", e)
        raise e
    finally:
        session.close()

if __name__ == "__main__":
    import_kiet_women_data()
