-- NoteCategory および Notes テーブルへの論理削除（deleted_at）追加 SQL
-- 日付: 2026-09-12
-- 説明: note_categories および notes テーブルに deleted_at カラムとインデックスを追加

-- 1. note_categories テーブルへの deleted_at カラム追加
ALTER TABLE note_categories
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;

-- note_categories の deleted_at インデックス作成
CREATE INDEX IF NOT EXISTS idx_note_categories_deleted_at ON note_categories(deleted_at);

COMMENT ON COLUMN note_categories.deleted_at IS '削除日時（JST、論理削除）';

-- 2. notes テーブルへの deleted_at カラム追加
ALTER TABLE notes
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;

-- notes の deleted_at インデックス作成
CREATE INDEX IF NOT EXISTS idx_notes_deleted_at ON notes(deleted_at);

COMMENT ON COLUMN notes.deleted_at IS '削除日時（JST、論理削除）';
