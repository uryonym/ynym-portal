"""初期管理者ユーザー作成スクリプト.

使用方法:
    uv run python scripts/create_admin.py --google-uid <GOOGLE_UID> --email <EMAIL> --name <NAME>
"""

import argparse
import sys
from pathlib import Path

# backend ルートを sys.path に追加して app をインポート可能にする
backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from app.core.db import transactional_session  # noqa: E402
from app.models.user import User  # noqa: E402
from app.repositories.user_repository import UserRepository  # noqa: E402


def create_or_promote_admin(google_uid: str, email: str, name: str) -> None:
    with transactional_session() as session:
        repo = UserRepository(session)
        user = repo.get_by_google_uid(google_uid, include_deleted=True)
        if user:
            user.is_admin = True
            user.name = name
            user.email = email
            user.deleted_at = None
            repo.save(user)
            print(f"既存のユーザー (ID: {user.id}) を管理者に昇格しました。")
            return

        user_by_email = repo.get_by_email(email, include_deleted=True)
        if user_by_email:
            user_by_email.google_uid = google_uid
            user_by_email.is_admin = True
            user_by_email.name = name
            user_by_email.deleted_at = None
            repo.save(user_by_email)
            print(
                f"既存のメールユーザー (ID: {user_by_email.id}) を管理者に昇格しました。"
            )
            return

        new_user = User(
            google_uid=google_uid,
            email=email,
            name=name,
            is_admin=True,
        )
        repo.save(new_user)
        print(f"新規管理者ユーザー (ID: {new_user.id}) を作成しました。")


def main() -> None:
    parser = argparse.ArgumentParser(description="管理者ユーザーを作成または昇格")
    parser.add_argument(
        "--google-uid", required=True, help="Google アカウントの UID (sub)"
    )
    parser.add_argument("--email", required=True, help="メールアドレス")
    parser.add_argument("--name", required=True, help="ユーザー名")

    args = parser.parse_args()

    try:
        create_or_promote_admin(
            google_uid=args.google_uid,
            email=args.email,
            name=args.name,
        )
    except Exception as e:
        print(f"エラーが発生しました: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
