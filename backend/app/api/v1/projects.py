from typing import Optional, List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_, desc, asc, func

from app.db.session import get_db
from app.models import Team, Phase
from app.schemas import ProjectListResponse, ProjectResponse

router = APIRouter(prefix="/projects", tags=["Projects"])


@router.get("", response_model=ProjectListResponse)
def get_projects(
    phase_id: Optional[int] = Query(None, description="Filter projects by phase ID"),
    college: Optional[str] = Query(None, description="Filter projects by college"),
    search: Optional[str] = Query(None, description="Search by project name or description"),
    limit: int = Query(50, ge=1, le=100, description="Page size"),
    offset: int = Query(0, ge=0, description="Offset"),
    db: Session = Depends(get_db),
) -> ProjectListResponse:
    """
    Retrieve list of projects derived from teams with active project names.
    """
    query = (
        db.query(Team)
        .options(joinedload(Team.phase), joinedload(Team.members))
        .filter(Team.project_name.isnot(None), Team.project_name != "")
    )

    if phase_id is not None:
        query = query.filter(Team.phase_id == phase_id)

    if college:
        query = query.filter(func.lower(Team.college) == college.strip().lower())

    if search:
        search_term = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Team.project_name.ilike(search_term),
                Team.project_description.ilike(search_term),
                Team.team_name.ilike(search_term),
                Team.department.ilike(search_term),
            )
        )

    # Order by rank, then score
    query = query.order_by(asc(Team.rank).nullslast(), desc(Team.score).nullslast())

    total = query.count()
    teams = query.offset(offset).limit(limit).all()

    items = []
    for t in teams:
        items.append(
            ProjectResponse(
                team_id=t.id,
                team_name=t.team_name,
                phase_id=t.phase_id,
                phase_name=t.phase.name if t.phase else None,
                project_name=t.project_name,
                project_description=t.project_description,
                score=t.score,
                rank=t.rank,
                award=t.award,
                github_url=t.github_url,
                demo_url=t.demo_url,
                college=t.college,
                department=t.department,
                members_count=len(t.members),
            )
        )

    return ProjectListResponse(
        total=total,
        limit=limit,
        offset=offset,
        items=items,
    )
