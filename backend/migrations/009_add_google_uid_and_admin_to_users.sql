-- users テーブルへの google_uid, is_admin, deleted_at 追加 SQL
-- 日付: 2026-09-13
-- 説明: ユーザー管理機能対応（Google UID 事前登録制、管理者フラグ、論理削除）

-- 1. google_uid カラム追加
ALTER TABLE users
ADD COLUMN IF NOT EXISTS google_uid VARCHAR(255);

-- 既存の google_uid インデックス作成
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_google_uid ON users(google_uid);
COMMENT ON COLUMN users.google_uid IS 'Google アカウントの一意識別子 (sub)';

-- 2. is_admin カラム追加
ALTER TABLE users
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT FALSE;
COMMENT ON COLUMN users.is_admin IS '管理者権限フラグ';

-- 3. deleted_at カラム追加
ALTER TABLE users
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;

-- deleted_at インデックス作成
CREATE INDEX IF NOT EXISTS idx_users_deleted_at ON users(deleted_at);
COMMENT ON COLUMN users.deleted_at IS '論理削除日時（JST、NULLの場合は有効）';
