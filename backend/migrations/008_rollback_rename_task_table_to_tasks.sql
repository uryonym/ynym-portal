-- Task テーブル名および関連インデックス・制約の変更ロールバック SQL
-- 日付: 2026-09-12
-- 説明: tasks テーブルを元の単数形 task へロールバック

-- 1. CHECK 制約および主キー制約名のリネーム
ALTER TABLE "tasks" RENAME CONSTRAINT tasks_order_check TO task_order_check;
ALTER TABLE "tasks" RENAME CONSTRAINT tasks_pkey TO task_pkey;

-- 2. インデックス名のリネーム
ALTER INDEX idx_tasks_deleted_at RENAME TO idx_task_deleted_at;
ALTER INDEX idx_tasks_due_date RENAME TO idx_task_due_date;
ALTER INDEX idx_tasks_user_id RENAME TO idx_task_user_id;

-- 3. テーブル名のリネーム
ALTER TABLE "tasks" RENAME TO "task";

-- コメント更新
COMMENT ON TABLE "task" IS 'ユーザーが作成・管理するタスク';
