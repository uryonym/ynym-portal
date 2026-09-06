"""アプリケーション用のカスタム例外クラス."""


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


class ValidationException(ApplicationException):
    """検証に失敗した場合に発生."""

    def __init__(self, message: str):
        """検証例外を初期化."""
        super().__init__(message, status_code=422)


class NotFoundException(ApplicationException):
    """リソースが見つからない場合に発生."""

    def __init__(self, message: str = "リソースが見つかりません"):
        """見つからない例外を初期化."""
        super().__init__(message, status_code=404)


class AuthenticationException(ApplicationException):
    """認証に失敗した場合に発生."""

    def __init__(self, message: str = "認証に失敗しました"):
        """認証例外を初期化."""
        super().__init__(message, status_code=401)


class AuthorizationException(ApplicationException):
    """認可に失敗した場合に発生."""

    def __init__(self, message: str = "アクセス権限が不足しています"):
        """認可例外を初期化."""
        super().__init__(message, status_code=403)


def _format_not_found_message(detail: str) -> str:
    """リソース固有の見つからないメッセージを生成."""
    if "タスク" in detail:
        return "タスクが見つかりません"
    if "カテゴリ" in detail:
        return "カテゴリが見つかりません"
    if "車" in detail or "車両" in detail:
        return "車が見つかりません"
    if "ノート" in detail:
        return "ノートが見つかりません"
    if "燃費記録" in detail:
        return "燃費記録が見つかりません"
    return detail


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
                "message": _format_not_found_message(exc.message),
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
