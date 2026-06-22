from contextlib import asynccontextmanager

from fastapi import APIRouter, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.core.database import engine
from src.core.exceptions import (
    AppException,
    app_exception_handler,
    unhandled_exception_handler,
)
from src.core.settings import settings
from src.features.staff.models import Base as StaffBase
from src.features.staff.route import router as staff_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    StaffBase.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    description=settings.PROJECT_DESCRIPTION,
    version=settings.PROJECT_VERSION,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=settings.CORS_METHODS,
    allow_headers=settings.CORS_HEADERS,
)

# Routes
router = APIRouter()
router.include_router(staff_router)
app.include_router(router, prefix=settings.API_STR)

# Global Handlers
app.add_exception_handler(AppException, app_exception_handler)
app.add_exception_handler(Exception, unhandled_exception_handler)
