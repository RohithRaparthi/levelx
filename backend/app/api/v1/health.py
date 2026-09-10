from fastapi import APIRouter
from datetime import datetime, timezone
from pydantic import BaseModel
from typing import Dict, Any

from app.core.config import settings

router = APIRouter()


class HealthResponse(BaseModel):
    status: str
    platform: str
    version: str
    environment: str
    timestamp: str
    services: Dict[str, Any]


@router.get("/health", response_model=HealthResponse)
async def health_check() -> HealthResponse:
    """
    Health check endpoint for LEVELX platform.
    Returns status, version, platform identifier, and service availability.
    """
    return HealthResponse(
        status="healthy",
        platform=f"{settings.PROJECT_NAME} × {settings.PROJECT_SUBTITLE}",
        version=settings.VERSION,
        environment=settings.ENVIRONMENT,
        timestamp=datetime.now(timezone.utc).isoformat(),
        services={
            "api": "online",
            "database_driver": "postgresql+asyncpg (configured)",
            "cors": "enabled",
        }
    )
