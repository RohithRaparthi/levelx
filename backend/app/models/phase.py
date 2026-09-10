from typing import TYPE_CHECKING, List, Optional
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.team import Team


class Phase(Base):
    __tablename__ = "phases"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    theme: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    status: Mapped[str] = mapped_column(String(50), nullable=False, default="upcoming")
    date: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)

    # Relationships
    teams: Mapped[List["Team"]] = relationship(
        "Team",
        back_populates="phase",
        cascade="all, delete-orphan",
        order_by="Team.rank"
    )

    def __repr__(self) -> str:
        return f"<Phase(id={self.id}, name='{self.name}', status='{self.status}')>"
