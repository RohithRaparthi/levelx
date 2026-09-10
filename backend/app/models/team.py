from typing import TYPE_CHECKING, List, Optional
from sqlalchemy import String, Text, Float, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.phase import Phase
    from app.models.team_member import TeamMember


class Team(Base):
    __tablename__ = "teams"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    phase_id: Mapped[int] = mapped_column(
        ForeignKey("phases.id", ondelete="CASCADE"), nullable=False, index=True
    )
    team_name: Mapped[str] = mapped_column(String(150), nullable=False)
    project_name: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    score: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    rank: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    award: Mapped[Optional[str]] = mapped_column(String(150), nullable=True)
    project_description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    github_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    demo_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    
    # College-wise support
    college: Mapped[Optional[str]] = mapped_column(String(150), nullable=True, default="KIET Women", index=True)
    status: Mapped[str] = mapped_column(String(50), default="evaluated", server_default="evaluated")
    department: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    evaluator_notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Relationships
    phase: Mapped["Phase"] = relationship("Phase", back_populates="teams")
    members: Mapped[List["TeamMember"]] = relationship(
        "TeamMember",
        back_populates="team",
        cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<Team(id={self.id}, name='{self.team_name}', score={self.score}, rank={self.rank}, college='{self.college}')>"
