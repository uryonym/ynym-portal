"""ゴミ箱関連スキーマ."""

from typing import Literal

from pydantic import BaseModel, Field

TrashResourceType = Literal[
    "tasks",
    "notes",
    "note_categories",
    "vehicles",
    "fuel_records",
]


class TrashSummary(BaseModel):
    """ゴミ箱サマリースキーマ."""

    tasks: int = Field(default=0, description="タスクのゴミ箱件数")
    notes: int = Field(default=0, description="ノートのゴミ箱件数")
    note_categories: int = Field(default=0, description="ノートカテゴリのゴミ箱件数")
    vehicles: int = Field(default=0, description="車両のゴミ箱件数")
    fuel_records: int = Field(default=0, description="燃費記録のゴミ箱件数")
    total: int = Field(default=0, description="合計件数")
