import logging
from enum import Enum

from fastapi.requests import Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel

error_logger = logging.getLogger("uvicorn.error")
info_logger = logging.getLogger(__name__)


# --- Error codes ----------------------------------------
class ErrorCode(str, Enum):
    # ============================================================
    # ERROS DE VALIDAÇÃO (VAL) - 422 Unprocessable Entity
    # ============================================================
    VALIDATION_ERROR = "VAL_VALIDATION_ERROR"

    # ============================================================
    # ERROS DE NEGÓCIO (BIZ) - 400/404/409/422
    # ============================================================
    NOT_FOUND = "BIZ_NOT_FOUND"
    ALREADY_EXISTS = "BIZ_ALREADY_EXISTS"

    # ============================================================
    # ERROS DE AUTENTICAÇÃO/AUTORIZAÇÃO (AUTH) - 401/403
    # ============================================================
    UNAUTHORIZED = "AUTH_UNAUTHORIZED"

    # ============================================================
    # ERROS DE SISTEMA (SYS) - 500/502/503
    # ============================================================
    INTERNAL_SERVER_ERROR = "SYS_INTERNAL_SERVER_ERROR"


# --- Error Response schema ----------------------------------------
class ErrorResponse(BaseModel):
    error_code: ErrorCode
    message: str


# --- Custom exception classes ----------------------------------------
class AppException(Exception):
    def __init__(self, status_code: int, error_code: ErrorCode, message: str):
        super().__init__(message)
        self.status_code = status_code
        self.error_code = error_code
        self.message = message


class NotFoundException(AppException):
    def __init__(self, entity: str = "Resource", entity_id: str | None = None):
        resource = f"{entity} {entity_id}" if entity_id else entity
        super().__init__(
            status_code=404,
            error_code=ErrorCode.NOT_FOUND,
            message=f"{resource} not found",
        )
        error_logger.warning(f"{resource} not found")


class AlreadyExistsException(AppException):
    def __init__(self, entity: str = "Resource", entity_id: str | None = None):
        resource = f"{entity} {entity_id}" if entity_id else entity
        super().__init__(
            status_code=409,
            error_code=ErrorCode.ALREADY_EXISTS,
            message=f"{resource} already exists",
        )
        error_logger.warning(f"{resource} already exists")


class UnauthorizedException(AppException):
    def __init__(self, message: str = "Not authenticated"):
        super().__init__(
            status_code=401,
            error_code=ErrorCode.UNAUTHORIZED,
            message=message,
        )
        error_logger.warning(f"Unauthorized: {message}")


# --- Global exception handlers ----------------------------------------
async def app_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    assert isinstance(exc, AppException)
    error_logger.warning(
        "Application error",
        extra={
            "status_code": exc.status_code,
            "error_code": exc.error_code,
            "message": exc.message,
            "method": request.method,
            "path": str(request.url),
        },
    )
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": exc.message, "error_code": exc.error_code},
    )


async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    error_logger.error(
        "Unhandled exception",
        extra={
            "error": str(exc),
            "method": request.method,
            "path": str(request.url),
            "client": request.client.host if request.client else None,
        },
        exc_info=True,
    )
    return JSONResponse(
        status_code=500,
        content={
            "message": "Unknown Internal server error",
            "error_code": ErrorCode.INTERNAL_SERVER_ERROR,
        },
    )
