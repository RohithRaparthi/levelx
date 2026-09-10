from fastapi import APIRouter
from app.api.v1.health import router as health_router
from app.api.v1.phases import router as phases_router
from app.api.v1.teams import router as teams_router
from app.api.v1.students import router as students_router
from app.api.v1.projects import router as projects_router
from app.api.v1.highlights import router as highlights_router
from app.api.v1.achievements import router as achievements_router

api_router = APIRouter()

# Mount all endpoint groups
api_router.include_router(health_router, tags=["Health"])
api_router.include_router(phases_router)
api_router.include_router(teams_router)
api_router.include_router(students_router)
api_router.include_router(projects_router)
api_router.include_router(highlights_router)
api_router.include_router(achievements_router)
