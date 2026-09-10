from typing import Optional, List
from pydantic import BaseModel, ConfigDict


class AchievementResponse(BaseModel):
    team_id: int
    team_name: str
    phase_id: int
    phase_name: Optional[str] = None
    project_name: Optional[str] = None
    award: Optional[str] = None
    rank: Optional[int] = None
    score: Optional[float] = None
    college: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class AchievementListResponse(BaseModel):
    total: int
    items: List[AchievementResponse]
