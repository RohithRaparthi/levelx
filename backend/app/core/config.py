import json
import os
from pathlib import Path
from typing import List
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

BACKEND_DIR = Path(__file__).resolve().parent.parent.parent
ENV_FILE = BACKEND_DIR / ".env"
WORKSPACE_ROOT = BACKEND_DIR.parent
DEFAULT_SQLITE_PATH = (WORKSPACE_ROOT / "levelx.db").as_posix()

class Settings(BaseSettings):
    PROJECT_NAME: str = "LEVELX"
    PROJECT_SUBTITLE: str = "by XFACTOR"
    API_V1_STR: str = "/api/v1"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    
    # CORS Configuration
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v):
        if isinstance(v, str):
            if v.startswith("["):
                try:
                    return json.loads(v)
                except Exception:
                    pass
            return [origin.strip() for origin in v.split(",") if origin.strip()]
        return v
    
    # Database connection URLs (loaded from .env)
    DATABASE_URL: str = f"sqlite+aiosqlite:///{DEFAULT_SQLITE_PATH}"
    SYNC_DATABASE_URL: str = f"sqlite:///{DEFAULT_SQLITE_PATH}"

    model_config = SettingsConfigDict(
        env_file=ENV_FILE.as_posix() if ENV_FILE.exists() else ".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )


settings = Settings()
