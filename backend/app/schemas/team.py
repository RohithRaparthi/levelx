from typing import Optional, List
from pydantic import BaseModel, ConfigDict
from app.schemas.student import StudentResponse


class TeamBase(BaseModel):
    team_name: str
    project_name: Optional[str] = None
    score: Optional[float] = None
    rank: Optional[int] = None
    award: Optional[str] = None
    project_description: Optional[str] = None
    github_url: Optional[str] = None
    demo_url: Optional[str] = None
    college: Optional[str] = "KIET Women"
    status: Optional[str] = "evaluated"
    department: Optional[str] = None
    evaluator_notes: Optional[str] = None


class TeamCreate(TeamBase):
    phase_id: int


class TeamUpdate(BaseModel):
    team_name: Optional[str] = None
    project_name: Optional[str] = None
    score: Optional[float] = None
    rank: Optional[int] = None
    award: Optional[str] = None
    project_description: Optional[str] = None
    github_url: Optional[str] = None
    demo_url: Optional[str] = None
    college: Optional[str] = None
    status: Optional[str] = None
    department: Optional[str] = None
    evaluator_notes: Optional[str] = None


class TeamSummaryResponse(TeamBase):
    id: int
    phase_id: int
    phase_name: Optional[str] = None
    members_count: int = 0

    model_config = ConfigDict(from_attributes=True)


class TeamDetailResponse(TeamBase):
    id: int
    phase_id: int
    phase_name: Optional[str] = None
    members: List[StudentResponse] = []

    model_config = ConfigDict(from_attributes=True)


class TeamListResponse(BaseModel):
    total: int
    limit: int
    offset: int
    items: List[TeamSummaryResponse]


TeamResponse = TeamDetailResponse
