from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models import Highlight
from app.schemas import HighlightResponse

router = APIRouter(prefix="/highlights", tags=["Highlights"])


@router.get("", response_model=List[HighlightResponse])
def get_highlights(db: Session = Depends(get_db)) -> List[HighlightResponse]:
    """
    Retrieve all platform and hackathon media highlights.
    """
    highlights = db.query(Highlight).order_by(Highlight.id.desc()).all()
    return highlights
