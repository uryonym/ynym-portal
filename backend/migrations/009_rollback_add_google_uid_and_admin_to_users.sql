-- users テーブルの google_uid, is_admin, deleted_at 削除（ロールバック）SQL
-- 日付: 2026-09-13

DROP INDEX IF EXISTS idx_users_google_uid;
DROP INDEX IF EXISTS idx_users_deleted_at;

ALTER TABLE users DROP COLUMN IF EXISTS google_uid;
ALTER TABLE users DROP COLUMN IF EXISTS is_admin;
ALTER TABLE users DROP COLUMN IF EXISTS deleted_at;
