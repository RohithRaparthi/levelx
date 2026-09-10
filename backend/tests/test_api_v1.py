import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.db.base import Base
from app.db.session import get_db
from app.models import Phase, Team, Student, TeamMember, Highlight

# Setup in-memory SQLite for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_database():
    """Create fresh tables and seed test data before each test."""
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()

    # Seed test phase
    phase1 = Phase(
        name="Phase 1",
        theme="Retrieval-Augmented Generation (RAG)",
        status="completed",
        date="2026-08-22"
    )
    phase2 = Phase(
        name="Phase 2",
        theme="Autonomous Agents",
        status="upcoming",
        date="2026-09-20"
    )
    db.add_all([phase1, phase2])
    db.flush()

    # Seed test students
    s1 = Student(name="Rohith Raparthi", email="rohith@example.com", college="KIET", participant_id="PART-0001")
    s2 = Student(name="Aravind Kumar", email="aravind@example.com", college="KIET", participant_id="PART-0002")
    s3 = Student(name="Bhavya Sri", email="bhavya@example.com", college="KIET", participant_id="PART-0003")
    db.add_all([s1, s2, s3])
    db.flush()

    # Seed test teams
    t1 = Team(
        phase_id=phase1.id,
        team_name="NeuralNexus",
        project_name="DocuQuery RAG",
        score=94.5,
        rank=1,
        award="Champion - Gold",
        project_description="High precision multi-document contextual search engine.",
        github_url="https://github.com/levelx/docuquery",
        demo_url="https://docuquery.demo.levelx.dev",
    )
    t2 = Team(
        phase_id=phase1.id,
        team_name="VectorVanguard",
        project_name="BioSearch Engine",
        score=89.0,
        rank=2,
        award="Runner Up - Silver",
        project_description="Domain-specific biomedical document retrieval system.",
        github_url="https://github.com/levelx/biosearch",
        demo_url=None,
    )
    t3 = Team(
        phase_id=phase1.id,
        team_name="OpenInnovators",
        project_name="AudioRAG",
        score=78.0,
        rank=3,
        award="Special Mention",
        project_description="Audio transcript vector indexing.",
        github_url=None,
        demo_url=None,
    )
    db.add_all([t1, t2, t3])
    db.flush()

    # Seed memberships
    m1 = TeamMember(team_id=t1.id, student_id=s1.id)
    m2 = TeamMember(team_id=t1.id, student_id=s2.id)
    m3 = TeamMember(team_id=t2.id, student_id=s3.id)
    db.add_all([m1, m2, m3])

    # Seed highlight
    h1 = Highlight(
        title="LevelX Phase 1 Launch at KIET",
        media_url="https://levelx.dev/media/phase1_kickoff.jpg",
        media_type="image",
        description="Over 200 student builders attended the RAG Masterclass."
    )
    db.add(h1)
    db.commit()

    yield

    db.close()
    Base.metadata.drop_all(bind=engine)


# --- 1. HEALTH TEST ---
def test_health_check():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "LEVELX" in data["platform"]


# --- 2. PHASES TESTS ---
def test_get_phases():
    response = client.get("/api/v1/phases")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert data[0]["name"] == "Phase 1"
    assert data[0]["teams_count"] == 3
    assert data[1]["name"] == "Phase 2"
    assert data[1]["teams_count"] == 0


def test_get_phase_by_id_success():
    response = client.get("/api/v1/phases/1")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == 1
    assert data["name"] == "Phase 1"
    assert len(data["teams"]) == 3
    assert data["teams"][0]["team_name"] == "NeuralNexus"


def test_get_phase_by_id_not_found():
    response = client.get("/api/v1/phases/999")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"]


# --- 3. TEAMS TESTS ---
def test_get_teams_list():
    response = client.get("/api/v1/teams")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 3
    assert len(data["items"]) == 3
    assert data["items"][0]["team_name"] == "NeuralNexus"
    assert data["items"][0]["members_count"] == 2


def test_get_teams_filtered_by_phase():
    response = client.get("/api/v1/teams?phase_id=2")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 0
    assert len(data["items"]) == 0


def test_get_teams_search():
    response = client.get("/api/v1/teams?search=BioSearch")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 1
    assert data["items"][0]["team_name"] == "VectorVanguard"


def test_get_teams_pagination():
    response = client.get("/api/v1/teams?limit=1&offset=1")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 3
    assert len(data["items"]) == 1
    assert data["items"][0]["team_name"] == "VectorVanguard"


def test_get_team_detail_success():
    response = client.get("/api/v1/teams/1")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == 1
    assert data["team_name"] == "NeuralNexus"
    assert data["score"] == 94.5
    assert data["rank"] == 1
    assert len(data["members"]) == 2
    assert data["members"][0]["name"] == "Rohith Raparthi"


def test_get_team_detail_not_found():
    response = client.get("/api/v1/teams/999")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"]


# --- 4. STUDENTS TESTS ---
def test_get_student_detail_success():
    response = client.get("/api/v1/students/1")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == 1
    assert data["name"] == "Rohith Raparthi"
    assert data["participant_id"] == "PART-0001"
    assert len(data["teams"]) == 1
    assert data["teams"][0]["team_name"] == "NeuralNexus"


def test_get_student_detail_not_found():
    response = client.get("/api/v1/students/999")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"]


# --- 5. PROJECTS TESTS ---
def test_get_projects():
    response = client.get("/api/v1/projects")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 3
    assert len(data["items"]) == 3
    assert data["items"][0]["project_name"] == "DocuQuery RAG"
    assert data["items"][0]["team_name"] == "NeuralNexus"


def test_get_projects_search():
    response = client.get("/api/v1/projects?search=Audio")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 1
    assert data["items"][0]["project_name"] == "AudioRAG"


# --- 6. HIGHLIGHTS TESTS ---
def test_get_highlights():
    response = client.get("/api/v1/highlights")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["title"] == "LevelX Phase 1 Launch at KIET"


# --- 7. ACHIEVEMENTS TESTS ---
def test_get_achievements():
    response = client.get("/api/v1/achievements")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 3
    assert data["items"][0]["award"] == "Champion - Gold"
    assert data["items"][0]["team_name"] == "NeuralNexus"


def test_get_achievements_filtered():
    response = client.get("/api/v1/achievements?phase_id=2")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 0
