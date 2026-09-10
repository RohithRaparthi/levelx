"""
Production Readiness Audit: Live Neon Backend API Audit (READ-ONLY)
Tests all API endpoints against the live database without modifying any data.
Checks status codes, response shapes, data integrity, and privacy (no PII leakage).
"""
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def run_neon_audit():
    print("--- 1. Health Check Endpoint ---")
    resp = client.get("/api/v1/health")
    assert resp.status_code == 200, f"Health check failed: {resp.status_code}"
    health_data = resp.json()
    assert health_data["status"] == "healthy"
    print("Health check OK:", health_data)

    print("\n--- 2. Phases Endpoints ---")
    resp = client.get("/api/v1/phases")
    assert resp.status_code == 200
    phases = resp.json()
    print(f"Phases found: {len(phases)}")
    assert len(phases) > 0, "No phases found in DB"
    phase_id = phases[0]["id"]
    print(f"Phase 0: ID={phase_id}, Name='{phases[0]['name']}', TeamsCount={phases[0]['teams_count']}")

    resp = client.get(f"/api/v1/phases/{phase_id}")
    assert resp.status_code == 200
    phase_detail = resp.json()
    assert phase_detail["id"] == phase_id
    print(f"Phase detail OK: {phase_detail['name']}, Teams returned: {len(phase_detail['teams'])}")

    resp = client.get("/api/v1/phases/99999")
    assert resp.status_code == 404
    print("Phase 404 test OK")

    print("\n--- 3. Teams Endpoints ---")
    resp = client.get("/api/v1/teams?limit=10")
    assert resp.status_code == 200
    teams_data = resp.json()
    total_teams = teams_data["total"]
    print(f"Teams total: {total_teams}, returned: {len(teams_data['items'])}")
    assert total_teams > 0, "Expected teams in DB"
    first_team = teams_data["items"][0]
    team_id = first_team["id"]

    # Filter by college
    resp = client.get("/api/v1/teams?college=kiet")
    assert resp.status_code == 200
    print(f"Filtered by college=kiet: {resp.json()['total']} teams")

    # Search
    resp = client.get("/api/v1/teams?search=system")
    assert resp.status_code == 200
    print(f"Search 'system': {resp.json()['total']} teams")

    # Sorting
    resp = client.get("/api/v1/teams?sort=score&limit=5")
    assert resp.status_code == 200
    resp_desc = client.get("/api/v1/teams?sort=-score&limit=5")
    assert resp_desc.status_code == 200

    # Team detail & roster
    resp = client.get(f"/api/v1/teams/{team_id}")
    assert resp.status_code == 200
    team_detail = resp.json()
    print(f"Team {team_id} ({team_detail['team_name']}) member count: {len(team_detail['members'])}")

    # Privacy check on team members
    for m in team_detail["members"]:
        assert "email" not in m or m["email"] is None, f"Privacy violation: email exposed in team member {m}"
        assert "phone" not in m, f"Privacy violation: phone exposed in team member {m}"

    # Team 404
    resp = client.get("/api/v1/teams/99999")
    assert resp.status_code == 404
    print("Team 404 test OK")

    print("\n--- 4. Students Endpoints ---")
    if team_detail["members"]:
        student_id = team_detail["members"][0]["id"]
        resp = client.get(f"/api/v1/students/{student_id}")
        assert resp.status_code == 200
        student_detail = resp.json()
        print(f"Student {student_id} lookup OK: Name='{student_detail['name']}', Teams={len(student_detail['teams'])}")
        assert "email" not in student_detail or student_detail["email"] is None, "Privacy violation: email exposed in student detail"

    resp = client.get("/api/v1/students/99999")
    assert resp.status_code == 404
    print("Student 404 test OK")

    print("\n--- 5. Projects Endpoints ---")
    resp = client.get("/api/v1/projects?limit=10")
    assert resp.status_code == 200
    projects_data = resp.json()
    print(f"Projects total: {projects_data['total']}, returned: {len(projects_data['items'])}")

    print("\n--- 6. Highlights Endpoints ---")
    resp = client.get("/api/v1/highlights")
    assert resp.status_code == 200
    print(f"Highlights returned: {len(resp.json())}")

    print("\n--- 7. Achievements Endpoints ---")
    resp = client.get("/api/v1/achievements")
    assert resp.status_code == 200
    achievements_data = resp.json()
    print(f"Achievements total: {achievements_data['total']}")

    print("\n--- 8. Validation / Edge Cases ---")
    resp = client.get("/api/v1/teams/invalid-id")
    assert resp.status_code == 422, f"Expected 422, got {resp.status_code}"
    print("Invalid param type 422 test OK")

    print("\nALL NEON BACKEND AUDIT CHECKS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    run_neon_audit()
