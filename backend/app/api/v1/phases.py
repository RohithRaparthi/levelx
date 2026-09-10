from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import select, func

from app.db.session import get_db
from app.models import Phase, Team
from app.schemas import PhaseSummaryResponse, PhaseDetailResponse, TeamSummaryResponse

router = APIRouter(prefix="/phases", tags=["Phases"])


@router.get("", response_model=List[PhaseSummaryResponse])
def get_phases(db: Session = Depends(get_db)) -> List[PhaseSummaryResponse]:
    """
    Retrieve all LEVELX phases with team counts.
    """
    phases = db.query(Phase).order_by(Phase.id).all()
    results = []
    for phase in phases:
        team_count = db.query(func.count(Team.id)).filter(Team.phase_id == phase.id).scalar() or 0
        results.append(
            PhaseSummaryResponse(
                id=phase.id,
                name=phase.name,
                theme=phase.theme,
                status=phase.status,
                date=phase.date,
                teams_count=team_count,
            )
        )
    return results


@router.get("/{phase_id}", response_model=PhaseDetailResponse)
def get_phase_by_id(phase_id: int, db: Session = Depends(get_db)) -> PhaseDetailResponse:
    """
    Retrieve details of a specific phase including its enrolled teams.
    """
    phase = db.query(Phase).filter(Phase.id == phase_id).first()
    if not phase:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Phase with ID {phase_id} not found."
        )

    teams = (
        db.query(Team)
        .options(joinedload(Team.members))
        .filter(Team.phase_id == phase.id)
        .order_by(Team.rank.asc().nullslast())
        .all()
    )
    team_items = []
    for t in teams:
        team_items.append(
            TeamSummaryResponse(
                id=t.id,
                phase_id=t.phase_id,
                phase_name=phase.name,
                team_name=t.team_name,
                project_name=t.project_name,
                score=t.score,
                rank=t.rank,
                award=t.award,
                project_description=t.project_description,
                github_url=t.github_url,
                demo_url=t.demo_url,
                members_count=len(t.members),
            )
        )

    return PhaseDetailResponse(
        id=phase.id,
        name=phase.name,
        theme=phase.theme,
        status=phase.status,
        date=phase.date,
        teams=team_items,
    )
