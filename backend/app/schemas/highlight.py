from typing import Optional
from pydantic import BaseModel, ConfigDict


class HighlightBase(BaseModel):
    title: str
    media_url: str
    media_type: str = "image"
    description: Optional[str] = None


class HighlightCreate(HighlightBase):
    pass


class HighlightUpdate(BaseModel):
    title: Optional[str] = None
    media_url: Optional[str] = None
    media_type: Optional[str] = None
    description: Optional[str] = None


class HighlightResponse(HighlightBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
