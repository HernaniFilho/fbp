import asyncio
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import APIRouter, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.core.database import Base, SessionLocal, engine
from src.core.exceptions import (
    AppException,
    app_exception_handler,
    unhandled_exception_handler,
)
from src.core.settings import settings
from src.features.board.route import router as board_router
from src.features.ml.service import get_model
from src.features.staff.route import router as staff_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # 1. Cria tabelas
    Base.metadata.create_all(bind=engine)

    # 2. Seed — roda em thread
    def _maybe_seed():
        from src.features.staff.crud import get_staff_members
        from src.features.staff.scripts.seed_staff import seed as seed_staff

        with SessionLocal() as db:
            count = len(get_staff_members(db))
            should_seed = settings.FORCE_SEED or count == 0

            if should_seed:
                if settings.FORCE_SEED and count > 0:
                    print(
                        f"[!] FORCE_SEED={settings.FORCE_SEED}. Re-seeding {settings.SEED_COUNT} members..."
                    )
                else:
                    print(
                        f"[!] Database empty. Seeding {settings.SEED_COUNT} staff members..."
                    )

                seed_staff(settings.SEED_COUNT)
                print("[@] Seed complete.")
            else:
                print(f"[!] Database already has {count} members. Skipping seed.")

    await asyncio.to_thread(_maybe_seed)

    # 3. Train — roda em thread
    def _maybe_train():
        from src.features.ml.train import train as train_model

        model_path = Path(settings.MODEL_PATH)

        if settings.FORCE_TRAIN:
            print(f"[@] FORCE_TRAIN={settings.FORCE_TRAIN}. Re-training model...")
            train_model()
            print("[@] Training complete.")
        elif not model_path.exists():
            print("[@] Model not found. Training...")
            train_model()
            print("[@] Training complete.")
        else:
            print(f"[@] Model found at {model_path}. Skipping training.")

    await asyncio.to_thread(_maybe_train)

    # 4. Pré-carrega modelo em memória
    get_model()
    print("[!] Application ready.")

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
router.include_router(board_router)
app.include_router(router, prefix=settings.API_STR)

# Global Handlers
app.add_exception_handler(AppException, app_exception_handler)
app.add_exception_handler(Exception, unhandled_exception_handler)
