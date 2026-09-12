-- Task テーブル名および関連インデックス・制約の検証 SQL
-- 日付: 2026-09-12
-- 説明: tasks テーブルの存在、インデックス、制約を確認

-- 1. テーブル存在確認（tasks が存在し、task が存在しないこと）
SELECT
    table_name,
    CASE
        WHEN table_name = 'tasks' THEN '✓ 新テーブル名 tasks が存在します'
        WHEN table_name = 'task' THEN '✗ 旧テーブル名 task が残っています'
    END AS status
FROM
    information_schema.tables
WHERE
    table_name IN ('task', 'tasks')
    AND table_schema = 'public';

-- 2. カラム定義確認
SELECT
    column_name,
    data_type,
    is_nullable
FROM
    information_schema.columns
WHERE
    table_name = 'tasks'
ORDER BY
    ordinal_position;

-- 3. インデックス確認
SELECT
    tablename,
    indexname
FROM
    pg_indexes
WHERE
    tablename = 'tasks'
ORDER BY
    indexname;

-- 4. 制約確認
SELECT
    constraint_name,
    constraint_type
FROM
    information_schema.table_constraints
WHERE
    table_name = 'tasks'
ORDER BY
    constraint_name;
