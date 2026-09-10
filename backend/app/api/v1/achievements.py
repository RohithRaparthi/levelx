from typing import Optional, List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_, asc, desc, func

from app.db.session import get_db
from app.models import Team, Phase
from app.schemas import AchievementListResponse, AchievementResponse

router = APIRouter(prefix="/achievements", tags=["Achievements"])


@router.get("", response_model=AchievementListResponse)
def get_achievements(
    phase_id: Optional[int] = Query(None, description="Filter achievements by phase ID"),
    college: Optional[str] = Query(None, description="Filter achievements by college"),
    db: Session = Depends(get_db),
) -> AchievementListResponse:
    """
    Retrieve achievements derived from team awards and top leaderboard rankings.
    """
    query = (
        db.query(Team)
        .options(joinedload(Team.phase))
        .filter(
            or_(
                Team.award.isnot(None),
                Team.rank.in_([1, 2, 3])
            )
        )
    )

    if phase_id is not None:
        query = query.filter(Team.phase_id == phase_id)

    if college:
        query = query.filter(func.lower(Team.college) == college.strip().lower())

    # Order by rank, then score
    query = query.order_by(asc(Team.rank).nullslast(), desc(Team.score).nullslast())

    teams = query.all()

    items = []
    for t in teams:
        items.append(
            AchievementResponse(
                team_id=t.id,
                team_name=t.team_name,
                phase_id=t.phase_id,
                phase_name=t.phase.name if t.phase else None,
                project_name=t.project_name,
                award=t.award or (f"Rank #{t.rank}" if t.rank else "Honor Mention"),
                rank=t.rank,
                score=t.score,
                college=t.college,
            )
        )

    return AchievementListResponse(
        total=len(items),
        items=items,
    )
