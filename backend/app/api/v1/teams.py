from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import select, func, or_, desc, asc

from app.db.session import get_db
from app.models import Team, Phase, TeamMember, Student
from app.schemas import TeamSummaryResponse, TeamDetailResponse, TeamListResponse, StudentResponse

router = APIRouter(prefix="/teams", tags=["Teams"])


@router.get("", response_model=TeamListResponse)
def get_teams(
    phase_id: Optional[int] = Query(None, description="Filter teams by phase ID"),
    college: Optional[str] = Query(None, description="Filter teams by college"),
    status: Optional[str] = Query(None, description="Filter teams by status (e.g. 'evaluated', 'disqualified')"),
    search: Optional[str] = Query(None, description="Search by team name or project name"),
    sort: Optional[str] = Query("rank", description="Sort field: 'rank', '-rank', 'score', '-score', 'team_name'"),
    limit: int = Query(50, ge=1, le=100, description="Page size"),
    offset: int = Query(0, ge=0, description="Offset"),
    db: Session = Depends(get_db),
) -> TeamListResponse:
    """
    Retrieve list of teams with filtering, search, sorting, and pagination.
    """
    query = db.query(Team).options(joinedload(Team.phase), joinedload(Team.members))

    if phase_id is not None:
        query = query.filter(Team.phase_id == phase_id)

    if college:
        query = query.filter(func.lower(Team.college) == college.strip().lower())

    if status:
        query = query.filter(Team.status == status.strip().lower())

    if search:
        search_term = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Team.team_name.ilike(search_term),
                Team.project_name.ilike(search_term),
                Team.award.ilike(search_term),
                Team.department.ilike(search_term)
            )
        )

    # Sorting
    if sort == "score":
        query = query.order_by(asc(Team.score).nullslast())
    elif sort == "-score":
        query = query.order_by(desc(Team.score).nullslast())
    elif sort == "-rank":
        query = query.order_by(desc(Team.rank).nullslast())
    elif sort == "team_name":
        query = query.order_by(asc(Team.team_name))
    else:  # Default rank asc
        query = query.order_by(asc(Team.rank).nullslast(), desc(Team.score).nullslast())

    total = query.count()
    teams = query.offset(offset).limit(limit).all()

    items = []
    for t in teams:
        items.append(
            TeamSummaryResponse(
                id=t.id,
                phase_id=t.phase_id,
                phase_name=t.phase.name if t.phase else None,
                team_name=t.team_name,
                project_name=t.project_name,
                score=t.score,
                rank=t.rank,
                award=t.award,
                project_description=t.project_description,
                github_url=t.github_url,
                demo_url=t.demo_url,
                college=t.college,
                status=t.status,
                department=t.department,
                evaluator_notes=t.evaluator_notes,
                members_count=len(t.members),
            )
        )

    return TeamListResponse(
        total=total,
        limit=limit,
        offset=offset,
        items=items,
    )


@router.get("/{team_id}", response_model=TeamDetailResponse)
def get_team_by_id(team_id: int, db: Session = Depends(get_db)) -> TeamDetailResponse:
    """
    Retrieve detailed team information including roster members and project links.
    """
    team = (
        db.query(Team)
        .options(
            joinedload(Team.phase),
            joinedload(Team.members).joinedload(TeamMember.student),
        )
        .filter(Team.id == team_id)
        .first()
    )

    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Team with ID {team_id} not found",
        )

    members_list = [
        StudentResponse.model_validate(tm.student)
        for tm in team.members
        if tm.student is not None
    ]

    return TeamDetailResponse(
        id=team.id,
        phase_id=team.phase_id,
        phase_name=team.phase.name if team.phase else None,
        team_name=team.team_name,
        project_name=team.project_name,
        score=team.score,
        rank=team.rank,
        award=team.award,
        project_description=team.project_description,
        github_url=team.github_url,
        demo_url=team.demo_url,
        college=team.college,
        status=team.status,
        department=team.department,
        evaluator_notes=team.evaluator_notes,
        members=members_list,
    )
