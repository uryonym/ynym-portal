-- Events テーブル検証 SQL
-- 日付: 2026-10-13

SELECT table_name, column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name IN ('events', 'event_participants')
ORDER BY table_name, ordinal_position;
