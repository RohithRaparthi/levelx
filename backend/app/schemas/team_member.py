from pydantic import BaseModel, ConfigDict
from app.schemas.student import StudentResponse


class TeamMemberBase(BaseModel):
    team_id: int
    student_id: int


class TeamMemberCreate(TeamMemberBase):
    pass


class TeamMemberResponse(BaseModel):
    id: int
    team_id: int
    student_id: int
    student: StudentResponse

    model_config = ConfigDict(from_attributes=True)
