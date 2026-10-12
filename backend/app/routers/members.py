"""家族メンバーエンドポイント."""

from fastapi import APIRouter, Depends

from app.core.db import SessionDep
from app.repositories.user_repository import UserRepository
from app.schemas.base import SuccessResponse
from app.schemas.member import MemberColorUpdate, MemberResponse
from app.security.deps import CurrentUser
from app.services.member_service import MemberService

router = APIRouter(prefix="/members", tags=["members"])


def _get_member_service(db: SessionDep) -> MemberService:
    return MemberService(UserRepository(db))


@router.get("", response_model=SuccessResponse[list[MemberResponse]])
def list_members(
    _: CurrentUser,
    service: MemberService = Depends(_get_member_service),
) -> dict:
    """家族メンバー一覧を取得（全ログインユーザーが利用可能）."""
    members = service.list_members()
    return {
        "data": [MemberResponse.model_validate(m) for m in members],
        "message": "家族メンバー一覧を取得しました",
    }


@router.put("/me/color", response_model=SuccessResponse[MemberResponse])
def update_my_color(
    current_user: CurrentUser,
    payload: MemberColorUpdate,
    service: MemberService = Depends(_get_member_service),
) -> dict:
    """自分の表示色を更新."""
    user = service.update_my_color(current_user.id, payload.color)
    return {
        "data": MemberResponse.model_validate(user),
        "message": "メンバー色を更新しました",
    }
