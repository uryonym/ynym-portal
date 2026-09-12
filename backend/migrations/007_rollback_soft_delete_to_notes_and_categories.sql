-- NoteCategory および Notes テーブル論理削除ロールバック SQL
-- 日付: 2026-09-12
-- 説明: note_categories および notes テーブルから deleted_at カラムとインデックスを削除

-- 1. notes テーブルのロールバック
DROP INDEX IF EXISTS idx_notes_deleted_at;
ALTER TABLE notes DROP COLUMN IF EXISTS deleted_at;

-- 2. note_categories テーブルのロールバック
DROP INDEX IF EXISTS idx_note_categories_deleted_at;
ALTER TABLE note_categories DROP COLUMN IF EXISTS deleted_at;
