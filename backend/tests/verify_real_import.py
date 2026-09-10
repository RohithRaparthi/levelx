import os
import sys
import json

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.db.session import SyncSessionLocal
from app.models import Phase, Team, Student, TeamMember

def verify():
    session = SyncSessionLocal()
    try:
        phases = session.query(Phase).all()
        teams = session.query(Team).all()
        students = session.query(Student).all()
        memberships = session.query(TeamMember).all()
        
        print("=== DATABASE REAL DATA VERIFICATION ===")
        print(f"Phases in DB: {len(phases)}")
        for p in phases:
            print(f"  - Phase ID {p.id}: {p.name} | Status: {p.status}")
            
        print(f"\nTeams in DB: {len(teams)}")
        evaluated = [t for t in teams if t.status == "evaluated"]
        disqualified = [t for t in teams if t.status == "disqualified"]
        print(f"  - Evaluated: {len(evaluated)}")
        print(f"  - Disqualified: {len(disqualified)}")
        
        print(f"\nStudents in DB: {len(students)}")
        print(f"Team Memberships in DB: {len(memberships)}")
        
        print("\n=== TOP 5 TEAMS ===")
        top5 = sorted([t for t in teams if t.score is not None], key=lambda x: x.score, reverse=True)[:5]
        for t in top5:
            members = [tm.student.name for tm in t.members if tm.student]
            print(f"#{t.rank} | {t.team_name} ({t.department}) | Score: {t.score} | Proj: {t.project_name} | Members: {', '.join(members)}")
            
        print("\n=== DISQUALIFIED TEAMS ===")
        for t in disqualified:
            print(f"{t.team_name} ({t.department}) | Status: {t.status} | Reason: {t.evaluator_notes}")
            
    finally:
        session.close()

if __name__ == "__main__":
    verify()
