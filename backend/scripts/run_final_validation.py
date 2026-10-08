import os
from sqlalchemy import create_engine, func
from sqlalchemy.orm import sessionmaker
import sys
sys.path.insert(0, os.path.abspath('.'))
from dotenv import load_dotenv

load_dotenv('.env')
from app.models import Phase, Team, Student, TeamMember

neon_url = os.environ.get('SYNC_DATABASE_URL')
engine = create_engine(neon_url)
Session = sessionmaker(bind=engine)
session = Session()

# Phase 1 metrics
p1 = session.query(Phase).filter(Phase.name.ilike('%Phase 1%')).first()
p1_teams = session.query(Team).filter(Team.phase_id == p1.id).all()
p1_team_ids = [t.id for t in p1_teams]
p1_team_count = len(p1_teams)
p1_evaluated = len([t for t in p1_teams if t.score is not None and t.status != 'disqualified'])
p1_disqualified = len([t for t in p1_teams if t.status == 'disqualified'])
p1_members = session.query(TeamMember).filter(TeamMember.team_id.in_(p1_team_ids)).count()

# Students associated with Phase 1
p1_student_ids = session.query(TeamMember.student_id).filter(TeamMember.team_id.in_(p1_team_ids)).distinct().all()
p1_student_count = len(p1_student_ids)

# Phase 2 metrics
p2 = session.query(Phase).filter(Phase.name.ilike('%Phase 2%')).first()
p2_teams = session.query(Team).filter(Team.phase_id == p2.id).all()
p2_team_count = len(p2_teams)
p2_evaluated = len([t for t in p2_teams if t.score is not None])
p2_top = len([t for t in p2_teams if t.grade == 'Top Performer'])
p2_passed = len([t for t in p2_teams if t.grade == 'Passed'])
p2_needs_improvement = len([t for t in p2_teams if t.grade == 'Needs Improvement'])

# Missing leader/project fields
p2_missing_leader = [t for t in p2_teams if not t.leader_name]
p2_missing_project = [t for t in p2_teams if not t.project_name]

# Check anomalies and mismatches
anomalies = 0
total_mismatches = 0
for t in p2_teams:
    scores = [
        t.score_real_business or 0,
        t.score_chatbot_rag or 0,
        t.score_database or 0,
        t.score_platform or 0,
        t.score_team_understanding or 0,
        t.score_presentation or 0
    ]
    # Check Real Business max 15
    if (t.score_real_business or 0) > 15:
        anomalies += 1
    # Check sum vs total
    if any(s > 0 for s in scores):
        calc_sum = sum(scores)
        if t.score is not None and round(calc_sum, 1) != round(t.score, 1):
            total_mismatches += 1

# Duplicate source IDs handled
from collections import Counter
source_id_counts = Counter([t.source_team_id for t in p2_teams if t.source_team_id])
duplicate_ids = {k: v for k, v in source_id_counts.items() if v > 1}

# Global metrics
total_phases = session.query(Phase).count()
total_teams = session.query(Team).count()
total_students = session.query(Student).count()
total_team_members = session.query(TeamMember).count()

print("==================== VALIDATION REPORT ====================")
print("PHASE 1 BEFORE / AFTER (STRICT INVARIANT AUDIT):")
print(f"  Phase 1 Team count: {p1_team_count}")
print(f"  Phase 1 Student count: {p1_student_count}")
print(f"  Phase 1 Team-member count: {p1_members}")
print(f"  Phase 1 Evaluated count: {p1_evaluated}")
print(f"  Phase 1 Disqualified count: {p1_disqualified}")
print("\nPHASE 2 INGESTION METRICS:")
print(f"  Number of imported teams: {p2_team_count}")
print(f"  Number of evaluated teams: {p2_evaluated}")
print(f"  Number of Top Performers: {p2_top}")
print(f"  Number of Passed: {p2_passed}")
print(f"  Number of Needs Improvement: {p2_needs_improvement}")
print(f"  Missing leader fields: {len(p2_missing_leader)} (Teams: {[t.team_name for t in p2_missing_leader]})")
print(f"  Missing project fields: {len(p2_missing_project)} (Teams: {[t.team_name for t in p2_missing_project]})")
print(f"  Score anomalies (> max): {anomalies}")
print(f"  Total-score mismatches: {total_mismatches}")
print(f"  Duplicate source IDs handled by room context: {len(duplicate_ids)} distinct IDs repeating ({sum(duplicate_ids.values())} occurrences)")
print(f"    Repeated IDs: {duplicate_ids}")
print("\nGLOBAL METRICS:")
print(f"  Total phases: {total_phases}")
print(f"  Total teams: {total_teams}")
print(f"  Total students: {total_students}")
print(f"  Total team-member relationships: {total_team_members}")
print("===========================================================")
session.close()
