-- Task テーブル名および関連インデックス・制約の変更 SQL
-- 日付: 2026-09-12
-- 説明: task テーブルを複数形命名規則に合わせて tasks へ変更

-- 1. テーブル名のリネーム
ALTER TABLE "task" RENAME TO "tasks";

-- 2. インデックス名のリネーム
ALTER INDEX idx_task_user_id RENAME TO idx_tasks_user_id;
ALTER INDEX idx_task_due_date RENAME TO idx_tasks_due_date;
ALTER INDEX idx_task_deleted_at RENAME TO idx_tasks_deleted_at;

-- 3. 主キー制約および CHECK 制約名のリネーム
ALTER TABLE "tasks" RENAME CONSTRAINT task_pkey TO tasks_pkey;
ALTER TABLE "tasks" RENAME CONSTRAINT task_order_check TO tasks_order_check;

-- コメント更新
COMMENT ON TABLE "tasks" IS 'ユーザーが作成・管理するタスク';
