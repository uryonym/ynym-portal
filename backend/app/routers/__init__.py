"""API エンドポイントパッケージ."""

from .auth import router as auth_router
from .events import router as events_router
from .fuel_records import router as fuel_records_router
from .health import router as health_router
from .members import router as members_router
from .note_categories import router as note_categories_router
from .notes import router as notes_router
from .tasks import router as tasks_router
from .trash import router as trash_router
from .users import router as users_router
from .vehicles import router as vehicles_router

__all__ = [
    "auth_router",
    "events_router",
    "fuel_records_router",
    "health_router",
    "members_router",
    "note_categories_router",
    "notes_router",
    "tasks_router",
    "trash_router",
    "users_router",
    "vehicles_router",
]
