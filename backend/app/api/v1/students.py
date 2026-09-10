from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.db.session import get_db
from app.models import Student, TeamMember, Team, Phase
from app.schemas import StudentDetailResponse, StudentTeamItem

router = APIRouter(prefix="/students", tags=["Students"])


@router.get("/{student_id}", response_model=StudentDetailResponse)
def get_student_by_id(student_id: int, db: Session = Depends(get_db)) -> StudentDetailResponse:
    """
    Retrieve student details and their team participations.
    """
    student = (
        db.query(Student)
        .options(
            joinedload(Student.team_memberships)
            .joinedload(TeamMember.team)
            .joinedload(Team.phase)
        )
        .filter(Student.id == student_id)
        .first()
    )

    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Student with ID {student_id} not found."
        )

    team_items = []
    for membership in student.team_memberships:
        if membership.team:
            t = membership.team
            team_items.append(
                StudentTeamItem(
                    id=t.id,
                    phase_id=t.phase_id,
                    phase_name=t.phase.name if t.phase else None,
                    team_name=t.team_name,
                    project_name=t.project_name,
                    score=t.score,
                    rank=t.rank,
                    award=t.award,
                )
            )

    return StudentDetailResponse(
        id=student.id,
        name=student.name,
        college=student.college,
        participant_id=student.participant_id,
        teams=team_items,
    )
