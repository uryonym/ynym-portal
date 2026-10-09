-- notes テーブルからの is_pinned カラム削除ロールバック SQL

DROP INDEX IF EXISTS idx_notes_is_pinned;

ALTER TABLE notes
DROP COLUMN IF EXISTS is_pinned;
