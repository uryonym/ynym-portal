# 論理削除（Soft Delete）ポリシーおよび実装記録

**作成日**: 2026-09-12  
**関連 Issue**: 
- [#3: [Refactor] 論理削除（Soft Delete）ポリシーの実装・整理](https://github.com/uryonym/ynym-portal/issues/3)
- [#8: ユーザー管理機能およびアカウント退会時の論理削除・データ取り扱いポリシーの実装](https://github.com/uryonym/ynym-portal/issues/8)
- [#9: 論理削除データのゴミ箱機能（一覧・復元・完全削除）の実装](https://github.com/uryonym/ynym-portal/issues/9)  
**対応ブランチ**: `refactor/issue-3-soft-delete`

---

## 1. 概要・背景

当初、`Task` モデルには `deleted_at` カラムが存在し、リポジトリの検索クエリでも論理削除を前提とした除外フィルタ（`Task.deleted_at.is_(None)`）が適用されていたにもかかわらず、`TaskService.delete_task` では `session.delete()` による物理削除が行われていました。  
また、プロジェクト内の他のエンティティ（`Vehicle`, `FuelRecord`, `Note`, `NoteCategory`）間でも、論理削除を採用しているものと物理削除のままのものが混在しており、削除ポリシーに不整合が生じていました。

これらを解消するため、**すべての主導データに対して論理削除ポリシーを統一**し、併せて親子関係を持つデータについては**子データが存在する場合に親データの削除を防止する安全制約**を導入しました。

---

## 2. 対象スコープと削除ポリシー

### 対象スコープ
- **対象エンティティ（主導データ）**:
  - `Task`（タスク）
  - `Vehicle`（車両）
  - `FuelRecord`（給油記録）
  - `Note`（ノート）
  - `NoteCategory`（ノートカテゴリ）
- **対象外（将来検討タスクとして Issue 化）**:
  - `User`（ユーザー）: 退会機能およびユーザーデータの取り扱い方針策定時に別途実装（[#8](https://github.com/uryonym/ynym-portal/issues/8)）
  - ゴミ箱（Trash）/ 復元（Restore）/ 完全削除（Purge）: 今回は削除時の論理削除化のみを実装し、復元機能等は別途実装（[#9](https://github.com/uryonym/ynym-portal/issues/9)）

### 親子関係の削除制約ポリシー
親子関係を持つエンティティについては、意図しないデータの孤立や誤削除を防ぐため、**子データが存在する場合は削除を拒否（エラー）**するポリシー（方針C）を採用しました。

| 親エンティティ | 子エンティティ | 削除制約動作 | 返却ステータス |
| :--- | :--- | :--- | :--- |
| **車両 (`Vehicle`)** | 給油記録 (`FuelRecord`) | 有効な給油記録が 1 件以上存在する場合、車両の削除を拒否 | `409 Conflict` |
| **カテゴリ (`NoteCategory`)** | ノート (`Note`) | 有効なノートが 1 件以上存在する場合、カテゴリの削除を拒否 | `409 Conflict` |

※ 旧仕様にあった「カテゴリ削除時に配下ノートの `category_id` を NULL（未分類）に更新する」処理は廃止されました。

---

## 3. アーキテクチャと設計方針

### ① 共通基底モデル `SoftDeleteMixin`
各モデルに散在していた `deleted_at` カラム定義を一元化するため、`backend/app/models/base.py` に `SoftDeleteMixin` を導入しました。

```python
class SoftDeleteMixin:
    """論理削除フィールドを持つ Mixin."""

    deleted_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        index=True,
        default=None,
    )
```
すべての対象モデル（`Task`, `Vehicle`, `FuelRecord`, `Note`, `NoteCategory`）がこの Mixin を継承します。

### ② DB マイグレーション
`notes` および `note_categories` テーブルに対して `deleted_at TIMESTAMP WITH TIME ZONE` カラムと検索高速化のためのインデックスを追加するマイグレーション SQL を作成しました。
- 適用 SQL: `backend/migrations/007_add_soft_delete_to_notes_and_categories.sql`
- ロールバック SQL: `backend/migrations/007_rollback_soft_delete_to_notes_and_categories.sql`
- 検証 SQL: `backend/migrations/007_verify_soft_delete_to_notes_and_categories.sql`

### ③ Repository 層のクエリ設計
- 一覧取得 (`list_by_user`) および詳細取得 (`get_by_id_and_user`) では、必ず `Model.deleted_at.is_(None)` を適用し、論理削除済みレコードを完全に除外。
- 親エンティティ削除時の制約チェック用として、子レコード件数を返す以下のメソッドを実装：
  - `FuelRecordRepository.count_by_vehicle(user_id, vehicle_id) -> int`
  - `NoteRepository.count_by_category(user_id, category_id) -> int`

### ④ Service 層のビジネスロジックと例外
- 削除処理では `entity.deleted_at = datetime.now(JST)` を設定し、`repository.save(entity)` を実行。
- 制約違反時はカスタム例外 `ConflictException`（HTTP 409）を送出：
  - `給油記録が存在するため車両を削除できません`
  - `ノートが存在するためカテゴリを削除できません`

---

## 4. 段階的実施ステップとコミット履歴

作業は 1 ステップずつテスト・検証を挟みながら着実に実施されました。

| ステップ | コミットID | コミットメッセージ | 主な変更内容 |
| :--- | :--- | :--- | :--- |
| **Step 1** | `89675df` | `refactor: SoftDeleteMixinの定義と既存モデルへの適用` | `SoftDeleteMixin` 作成、`Task`, `Vehicle`, `FuelRecord` への適用 |
| **Step 2** | `f11cd68` | `fix: タスク削除処理を物理削除から論理削除に修正` | `TaskService.delete_task` の論理削除化、単体・統合テスト更新 |
| **Step 3** | `80d24db` | `feature: 車両削除時に給油記録存在チェックの制約を追加` | `ConflictException` (409) 追加、車両削除制約と単体テスト実装 |
| **Step 4** | `745c7a3` | `feature: ノート・カテゴリの論理削除用マイグレーション追加` | `007` マイグレーション SQL（作成・ロールバック・検証）作成 |
| **Step 5** | `fdf9a10` | `feature: ノート削除処理の論理削除化と除外フィルタの実装` | `Note` モデル/リポジトリ/サービスの論理削除対応、テスト拡充 |
| **Step 6** | `e42786e` | `feature: ノートカテゴリの論理削除化とノート存在チェックの制約追加` | `NoteCategory` の論理削除化、ノート存在時の削除制約、テスト拡充 |
| **Step 7** | `1311682` | `refactor: コードフォーマットの適用` | `ruff format` 適用、全テスト・リント・ビルド検証完了 |

---

## 5. テストと検証結果

- **単体テスト (`pytest tests/unit/`)**:
  - 各サービスでの `deleted_at` タイムスタンプ設定検証
  - 子データ存在時の `ConflictException` 送出検証
  - 子データ不在時の正常論理削除検証
- **エンドポイント統合テスト (`pytest tests/integration/`)**:
  - `DELETE` 実行時に `204 No Content` が返ること
  - 削除後に `GET /{id}` で `404 Not Found` が返ること
  - 削除後に一覧 `GET /` のレスポンスに対象 ID が含まれないこと
  - 制約違反時に `409 Conflict` と適切なエラーメッセージが返ること
- **総合結果**: **143 件全テスト合格**、型チェック・ビルド・リント（Python / TypeScript）すべて正常
