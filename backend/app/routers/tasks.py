"""タスク関連エンドポイント."""

from uuid import UUID

from fastapi import APIRouter, Depends, Query, Response, status

from app.core.db import SessionDep
from app.repositories.task_repository import TaskRepository
from app.schemas.base import SuccessResponse
from app.schemas.task import TaskCreate, TaskResponse, TaskUpdate
from app.security.deps import CurrentUser
from app.services.task_service import TaskService

router = APIRouter(prefix="/tasks", tags=["tasks"])


def _get_task_service(db: SessionDep) -> TaskService:
    return TaskService(TaskRepository(db))


@router.get("", response_model=SuccessResponse[list[TaskResponse]])
def list_tasks(
    current_user: CurrentUser,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    is_completed: bool | None = Query(None),
    service: TaskService = Depends(_get_task_service),
) -> dict:
    """タスク一覧を取得."""
    tasks = service.list_tasks(
        user_id=current_user.id, skip=skip, limit=limit, is_completed=is_completed
    )
    return {
        "data": [TaskResponse.model_validate(t) for t in tasks],
        "message": "タスク一覧を取得しました",
    }


@router.post(
    "",
    response_model=SuccessResponse[TaskResponse],
    status_code=status.HTTP_201_CREATED,
)
def create_task(
    current_user: CurrentUser,
    payload: TaskCreate,
    service: TaskService = Depends(_get_task_service),
) -> dict:
    """新規タスクを作成."""
    created_task = service.create_task(payload, current_user.id)
    return {
        "data": TaskResponse.model_validate(created_task),
        "message": "タスクが作成されました",
    }


@router.get("/{task_id}", response_model=SuccessResponse[TaskResponse])
def get_task(
    current_user: CurrentUser,
    task_id: UUID,
    service: TaskService = Depends(_get_task_service),
) -> dict:
    """タスクを取得."""
    task = service.get_task(task_id, current_user.id)
    return {
        "data": TaskResponse.model_validate(task),
        "message": "タスクが取得されました",
    }


@router.put("/{task_id}", response_model=SuccessResponse[TaskResponse])
def update_task(
    current_user: CurrentUser,
    task_id: UUID,
    payload: TaskUpdate,
    service: TaskService = Depends(_get_task_service),
) -> dict:
    """タスクを更新."""
    updated_task = service.update_task(task_id, payload, current_user.id)
    return {
        "data": TaskResponse.model_validate(updated_task),
        "message": "タスクが更新されました",
    }


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(
    current_user: CurrentUser,
    task_id: UUID,
    service: TaskService = Depends(_get_task_service),
) -> Response:
    """タスクを削除."""
    service.delete_task(task_id, current_user.id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
