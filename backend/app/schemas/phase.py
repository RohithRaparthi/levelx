from typing import Optional, List
from pydantic import BaseModel, ConfigDict
from app.schemas.team import TeamSummaryResponse


class PhaseBase(BaseModel):
    name: str
    theme: Optional[str] = None
    status: str = "upcoming"
    date: Optional[str] = None


class PhaseCreate(PhaseBase):
    pass


class PhaseUpdate(BaseModel):
    name: Optional[str] = None
    theme: Optional[str] = None
    status: Optional[str] = None
    date: Optional[str] = None


class PhaseSummaryResponse(PhaseBase):
    id: int
    teams_count: int = 0

    model_config = ConfigDict(from_attributes=True)


class PhaseDetailResponse(PhaseBase):
    id: int
    teams: List[TeamSummaryResponse] = []

    model_config = ConfigDict(from_attributes=True)


PhaseResponse = PhaseDetailResponse
