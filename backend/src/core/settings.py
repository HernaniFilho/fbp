from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", extra="ignore"
    )

    PROJECT_NAME: str = ""
    PROJECT_DESCRIPTION: str = ""
    PROJECT_VERSION: str = ""

    POSTGRES_USER: str = ""
    POSTGRES_PASSWORD: str = ""
    POSTGRES_DB: str = ""
    DATABASE_URL: str = ""

    BACKEND_CORS_ORIGINS: list[str] = ["http://localhost:5173"]
    API_V1_STR: str = "/api/v1"


settings = Settings()  # type: ignore
