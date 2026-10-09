-- notes テーブルの is_pinned カラム存在確認 SQL

SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'notes' AND column_name = 'is_pinned';
