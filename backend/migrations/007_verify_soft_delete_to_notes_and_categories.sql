-- NoteCategory および Notes テーブル論理削除カラム検証 SQL
-- 日付: 2026-09-12
-- 説明: note_categories および notes テーブルの deleted_at カラムとインデックスを確認

SELECT
    table_name,
    column_name,
    data_type,
    is_nullable
FROM
    information_schema.columns
WHERE
    table_name IN ('note_categories', 'notes')
    AND column_name = 'deleted_at'
ORDER BY
    table_name;

-- インデックス確認
SELECT
    tablename,
    indexname
FROM
    pg_indexes
WHERE
    tablename IN ('note_categories', 'notes')
    AND indexname LIKE '%deleted_at%'
ORDER BY
    tablename;
