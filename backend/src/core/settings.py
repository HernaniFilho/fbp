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

    CORS_ORIGINS: list[str] = ["http://localhost:3000"]
    CORS_METHODS: list[str] = ["*"]
    CORS_HEADERS: list[str] = ["*"]
    API_STR: str = "/api"


settings = Settings()  # type: ignore
