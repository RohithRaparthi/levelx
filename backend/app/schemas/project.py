from typing import Optional, List
from pydantic import BaseModel, ConfigDict


class ProjectResponse(BaseModel):
    team_id: int
    team_name: str
    phase_id: int
    phase_name: Optional[str] = None
    project_name: str
    project_description: Optional[str] = None
    score: Optional[float] = None
    rank: Optional[int] = None
    award: Optional[str] = None
    github_url: Optional[str] = None
    demo_url: Optional[str] = None
    college: Optional[str] = "KIET Women"
    department: Optional[str] = None
    members_count: int = 0

    model_config = ConfigDict(from_attributes=True)


class ProjectListResponse(BaseModel):
    total: int
    limit: int
    offset: int
    items: List[ProjectResponse]
