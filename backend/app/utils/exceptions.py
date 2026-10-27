"""アプリケーション用のカスタム例外クラス."""

from typing import ClassVar


class ApplicationException(Exception):
    """アプリケーション用の基本例外クラス."""

    def __init__(self, message: str, status_code: int = 500):
        """例外を初期化.

        Args:
            message: 例外メッセージ
            status_code: HTTP ステータスコード
        """
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)

    @property
    def detail(self) -> str:
        """FastAPI HTTPException 互換プロパティ."""
        return self.message


class BadRequestException(ApplicationException):
    """不正なリクエストの場合に発生 (400)."""

    def __init__(self, message: str = "不正なリクエストです"):
        """不正リクエスト例外を初期化."""
        super().__init__(message, status_code=400)


class ValidationException(ApplicationException):
    """バリデーションに失敗した場合に発生 (422 または指定ステータスコード)."""

    def __init__(self, message: str, status_code: int = 422):
        """検証例外を初期化."""
        super().__init__(message, status_code=status_code)


class NotFoundException(ApplicationException):
    """リソースが見つからない場合に発生 (404)."""

    RESOURCE_MESSAGES: ClassVar[dict[str, str]] = {
        "タスク": "タスクが見つかりません",
        "カテゴリ": "カテゴリが見つかりません",
        "車": "車が見つかりません",
        "車両": "車が見つかりません",
        "ノート": "ノートが見つかりません",
        "燃費記録": "燃費記録が見つかりません",
        "予定": "予定が見つかりません",
        "ユーザー": "ユーザーが見つかりません",
    }

    def __init__(
        self,
        message: str = "リソースが見つかりません",
        resource_name: str | None = None,
    ):
        """見つからない例外を初期化."""
        self.resource_name = resource_name
        if resource_name and resource_name in self.RESOURCE_MESSAGES:
            self.formatted_message = self.RESOURCE_MESSAGES[resource_name]
        else:
            self.formatted_message = self._resolve_message(message)
        super().__init__(message, status_code=404)

    @classmethod
    def _resolve_message(cls, detail: str) -> str:
        for key, val in cls.RESOURCE_MESSAGES.items():
            if key in detail:
                return val
        return detail


class ConflictException(ApplicationException):
    """リソースの競合または関連データの制約により処理できない場合に発生 (409)."""

    def __init__(self, message: str = "リソースが競合しています"):
        """競合例外を初期化."""
        super().__init__(message, status_code=409)


class AuthenticationException(ApplicationException):
    """認証に失敗した場合に発生 (401)."""

    def __init__(self, message: str = "認証に失敗しました"):
        """認証例外を初期化."""
        super().__init__(message, status_code=401)


class AuthorizationException(ApplicationException):
    """認可に失敗した場合に発生 (403)."""

    def __init__(self, message: str = "アクセス権限が不足しています"):
        """認可例外を初期化."""
        super().__init__(message, status_code=403)


def register_exception_handlers(app) -> None:
    """FastAPI アプリケーションにグローバル例外ハンドラーを登録."""
    from fastapi import Request, status
    from fastapi.exceptions import RequestValidationError
    from fastapi.responses import JSONResponse

    @app.exception_handler(NotFoundException)
    async def not_found_handler(
        request: Request, exc: NotFoundException
    ) -> JSONResponse:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={
                "error": exc.message,
                "message": exc.formatted_message,
            },
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(
        request: Request, exc: RequestValidationError
    ) -> JSONResponse:
        errors = [f"{err['loc'][-1]}: {err['msg']}" for err in exc.errors()]
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                "errors": errors,
                "message": "入力データが正しくありません",
            },
        )

    @app.exception_handler(ApplicationException)
    async def application_exception_handler(
        request: Request, exc: ApplicationException
    ) -> JSONResponse:
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "error": exc.message,
                "message": exc.message,
            },
        )
