-- notes テーブルへのピン留め（is_pinned）追加 SQL
-- 日付: 2026-10-10
-- 説明: notes テーブルに is_pinned カラムとインデックスを追加

ALTER TABLE notes
ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_notes_is_pinned ON notes(is_pinned);

COMMENT ON COLUMN notes.is_pinned IS 'ピン留めフラグ（重要・お気に入りノート最上位固定）';
