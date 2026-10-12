-- users テーブルへのメンバー表示色（color）追加 SQL
-- 日付: 2026-10-13
-- 説明: 家族メンバーの予定表示色（#RRGGBB 形式）を保存するカラムを追加

ALTER TABLE users
ADD COLUMN IF NOT EXISTS color VARCHAR(7);

COMMENT ON COLUMN users.color IS 'メンバー表示色（#RRGGBB 形式のカラーコード、任意）';
