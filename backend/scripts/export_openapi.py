"""OpenAPI スキーマを静的 JSON ファイルとして出力するスクリプト."""

import json
import sys
from pathlib import Path

# リポジトリの backend ルートを sys.path に追加して app をインポート可能にする
backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from app.main import app  # noqa: E402


def export_openapi() -> None:
    """FastAPI インスタンスから OpenAPI スキーマを抽出し、openapi.json に出力."""
    openapi_schema = app.openapi()
    output_path = backend_dir / "openapi.json"

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(openapi_schema, f, indent=2, ensure_ascii=False)
        f.write("\n")

    print(f"Successfully exported OpenAPI schema to {output_path}")


if __name__ == "__main__":
    export_openapi()
