import json
import logging
import os
from datetime import UTC, datetime
from logging import Handler, LogRecord
from pathlib import Path
from typing import Any

LOG_DIR = Path(os.getenv("LOG_DIR", "logs"))


class JsonFormatter(logging.Formatter):
    """Format every log record into a JSON string."""

    def format(self, record: LogRecord) -> str:
        payload: dict[str, Any] = {
            "timestamp": datetime.fromtimestamp(record.created)
            .astimezone()
            .isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "module": record.module,
            "function": record.funcName,
            "line": record.lineno,
        }

        if record.exc_info:
            payload["exception"] = self.formatException(record.exc_info)

        extra = getattr(record, "extra_fields", None)
        if extra:
            payload.update(extra)

        return json.dumps(payload, ensure_ascii=False, default=str)


class DailyJsonlFileHandler(Handler):
    """Write JSON logs to logs/YYYY-MM-DD.jsonl, switching files automatically when the day changes."""

    def __init__(self, log_dir: Path = LOG_DIR):
        super().__init__()
        self.log_dir = log_dir
        self.log_dir.mkdir(parents=True, exist_ok=True)
        self.setFormatter(JsonFormatter())

    def _current_filepath(self) -> Path:
        today = datetime.now(tz=UTC).astimezone().strftime("%Y-%m-%d")
        return self.log_dir / f"{today}.jsonl"

    def emit(self, record: LogRecord) -> None:
        try:
            line = self.format(record) + "\n"
            with open(self._current_filepath(), "a", encoding="utf-8") as stream:
                stream.write(line)
        except RecursionError:
            # Nunca engolir RecursionError: deixa propagar como a stdlib faz.
            raise
        except Exception:  # noqa: BLE001 - emit() nunca pode derrubar a app por erro de log
            self.handleError(record)


def with_fields(**fields: Any) -> dict[str, dict[str, Any]]:
    """Helper for attaching structured fields to a log."""
    return {"extra_fields": fields}


def _console_label(logger_name: str) -> str:
    """Maps full logger names to short labels for console output."""
    if logger_name.startswith("uvicorn"):
        return "UVICORN"
    if logger_name.startswith("sqlalchemy"):
        return "SQLALCHEMY"
    # qualquer coisa da sua aplicação (src.*) vira "API"
    if logger_name.startswith("src."):
        return "API"
    return logger_name.upper()


class ConsoleFormatter(logging.Formatter):
    """Legible console formatter that uses short logger names."""

    def format(self, record: LogRecord) -> str:
        record.short_name = _console_label(record.name)
        return super().format(record)


def setup_logging(level: int = logging.INFO) -> None:
    """Configures the root logger once, on startup."""
    root_logger = logging.getLogger()
    root_logger.setLevel(level)

    if root_logger.handlers:
        # evita handlers duplicados em reload (uvicorn --reload)
        return

    console_handler = logging.StreamHandler()
    console_handler.setFormatter(
        ConsoleFormatter(
            "%(asctime)s | %(levelname)-8s | %(short_name)-10s | %(message)s"
        )
    )

    root_logger.addHandler(console_handler)
    root_logger.addHandler(DailyJsonlFileHandler())

    # redireciona os loggers do uvicorn pros mesmos handlers,
    # em vez de deixar o uvicorn configurar o próprio formato
    for name in ("uvicorn", "uvicorn.error", "uvicorn.access"):
        uv_logger = logging.getLogger(name)
        uv_logger.handlers = []
        uv_logger.propagate = True
