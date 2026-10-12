-- Events（予定）および参加者テーブル作成 SQL
-- 日付: 2026-10-13
-- 説明: 家族カレンダーの予定管理テーブルと中間テーブル

CREATE TABLE IF NOT EXISTS events (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Foreign Key
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Core Fields
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    start_at TIMESTAMP WITH TIME ZONE NOT NULL,
    end_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_all_day BOOLEAN NOT NULL DEFAULT FALSE,
    is_private BOOLEAN NOT NULL DEFAULT FALSE,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,

    -- Constraints
    CONSTRAINT chk_events_end_after_start CHECK (end_at > start_at)
);

-- 参加者中間テーブル（0件 = 家族全員）
CREATE TABLE IF NOT EXISTS event_participants (
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (event_id, user_id)
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_events_created_by ON events(created_by);
CREATE INDEX IF NOT EXISTS idx_events_start_at ON events(start_at);
CREATE INDEX IF NOT EXISTS idx_events_end_at ON events(end_at);
CREATE INDEX IF NOT EXISTS idx_events_deleted_at ON events(deleted_at);
CREATE INDEX IF NOT EXISTS idx_events_is_private ON events(is_private);
CREATE INDEX IF NOT EXISTS idx_events_range ON events(start_at, end_at);
CREATE INDEX IF NOT EXISTS idx_event_participants_user_id ON event_participants(user_id);

-- コメント追加
COMMENT ON TABLE events IS '家族カレンダーの予定';
COMMENT ON COLUMN events.id IS '予定 ID（UUID、主キー）';
COMMENT ON COLUMN events.created_by IS '作成者ユーザー ID';
COMMENT ON COLUMN events.title IS 'タイトル（1-255文字）';
COMMENT ON COLUMN events.description IS '予定の説明・メモ';
COMMENT ON COLUMN events.location IS '場所';
COMMENT ON COLUMN events.start_at IS '開始日時（JST）';
COMMENT ON COLUMN events.end_at IS '終了日時（JST、end_at > start_at）';
COMMENT ON COLUMN events.is_all_day IS '終日フラグ';
COMMENT ON COLUMN events.is_private IS 'プライベートフラグ（true: 作成者本人のみ表示）';
COMMENT ON COLUMN events.deleted_at IS '論理削除日時';

COMMENT ON TABLE event_participants IS '予定の参加者中間テーブル（レコードなしは家族全員扱い）';
COMMENT ON COLUMN event_participants.event_id IS '予定 ID';
COMMENT ON COLUMN event_participants.user_id IS '参加ユーザー ID';
