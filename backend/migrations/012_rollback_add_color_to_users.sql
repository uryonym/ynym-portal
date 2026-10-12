-- users.color カラム削除（ロールバック）SQL
-- 日付: 2026-10-13

ALTER TABLE users
DROP COLUMN IF EXISTS color;
