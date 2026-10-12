-- Events テーブル削除（ロールバック）SQL
-- 日付: 2026-10-13

DROP TABLE IF EXISTS event_participants CASCADE;
DROP TABLE IF EXISTS events CASCADE;
