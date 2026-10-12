-- users.color カラム検証 SQL
-- 日付: 2026-10-13

SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'users' AND column_name = 'color';
