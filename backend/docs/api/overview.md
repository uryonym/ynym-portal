# API 概要

ynym Portal バックエンドシステムの API 仕様概要です。

## ベース URL

- 開発環境: `http://localhost:8000/api`
- 本番環境: （設定予定）

## 認証

本 API では認証に JWT（JSON Web Tokens）を使用しています。

保護されたすべてのエンドポイントでは、`Authorization` ヘッダーが必要です:

```
Authorization: Bearer <token>
```

## レスポンス形式

### 成功レスポンス (2xx)

```json
{
  "data": {},
  "message": "Success"
}
```

### エラーレスポンス (4xx, 5xx)

```json
{
  "detail": "Error message",
  "status_code": 400,
  "error_type": "ValidationException"
}
```

## エンドポイント一覧

詳細なエンドポイント仕様は [endpoints.md](endpoints.md) を参照してください。
