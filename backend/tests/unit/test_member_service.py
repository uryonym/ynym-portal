"""メンバーサービス単体テスト."""

from unittest.mock import MagicMock
from uuid import uuid4

import pytest

from app.models.user import User
from app.services.member_service import MemberService
from app.utils.exceptions import NotFoundException


@pytest.fixture
def mock_user_repo() -> MagicMock:
    return MagicMock()


@pytest.fixture
def member_service(mock_user_repo: MagicMock) -> MemberService:
    return MemberService(mock_user_repo)


class TestMemberService:
    """MemberService のテスト."""

    def test_list_members_returns_all_active_users(
        self, member_service: MemberService, mock_user_repo: MagicMock
    ) -> None:
        """メンバー一覧が取得される."""
        u1 = User(id=uuid4(), name="パパ", color="#3b82f6")
        u2 = User(id=uuid4(), name="ママ", color="#ec4899")
        mock_user_repo.list_users.return_value = [u1, u2]

        members = member_service.list_members()
        assert len(members) == 2
        mock_user_repo.list_users.assert_called_once_with(
            skip=0, limit=1000, include_deleted=False
        )

    def test_update_my_color_success(
        self, member_service: MemberService, mock_user_repo: MagicMock
    ) -> None:
        """自分の色が更新される."""
        user_id = uuid4()
        user = User(id=user_id, name="太郎", color=None)
        mock_user_repo.get_by_id.return_value = user
        mock_user_repo.save.side_effect = lambda u: u

        updated = member_service.update_my_color(user_id, "#10b981")
        assert updated.color == "#10b981"
        mock_user_repo.save.assert_called_once_with(user)

    def test_update_my_color_user_not_found_raises(
        self, member_service: MemberService, mock_user_repo: MagicMock
    ) -> None:
        """ユーザーが存在しない場合は NotFoundException."""
        user_id = uuid4()
        mock_user_repo.get_by_id.return_value = None

        with pytest.raises(NotFoundException):
            member_service.update_my_color(user_id, "#10b981")
