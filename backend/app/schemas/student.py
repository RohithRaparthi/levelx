from typing import Optional, List
from pydantic import BaseModel, ConfigDict


class StudentBase(BaseModel):
    name: str
    college: Optional[str] = None
    participant_id: Optional[str] = None


class StudentCreate(StudentBase):
    email: Optional[str] = None


class StudentUpdate(BaseModel):
    name: Optional[str] = None
    college: Optional[str] = None
    participant_id: Optional[str] = None


class StudentResponse(StudentBase):
    id: int

    model_config = ConfigDict(from_attributes=True)


class StudentTeamItem(BaseModel):
    id: int
    phase_id: int
    phase_name: Optional[str] = None
    team_name: str
    project_name: Optional[str] = None
    score: Optional[float] = None
    rank: Optional[int] = None
    award: Optional[str] = None


class StudentDetailResponse(StudentBase):
    id: int
    teams: List[StudentTeamItem] = []

    model_config = ConfigDict(from_attributes=True)
