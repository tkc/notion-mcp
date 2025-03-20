# Notion MCP Server

Notion MCP (Model Context Protocol) Serverは、NotionのAPIを通じてNotionのデータや機能にアクセスできるようにするサーバーです。このサーバーを使用することで、AIモデルはNotionのワークスペース、データベース、ページなどを操作できます。

## 機能

このサーバーは以下のNotionの機能にアクセスできます：

### ブロック操作

- ブロックの子要素の追加 (`notion_append_block_children`)
- ブロックの取得 (`notion_retrieve_block`)
- ブロックの子要素の取得 (`notion_retrieve_block_children`)
- ブロックの更新 (`notion_update_block`)
- ブロックの削除 (`notion_delete_block`)

### ページ操作

- ページの取得 (`notion_retrieve_page`)
- ページのプロパティの更新 (`notion_update_page_properties`)

### ユーザー操作

- すべてのユーザーのリスト取得 (`notion_list_all_users`)
- 特定ユーザーの取得 (`notion_retrieve_user`)
- ボットユーザーの取得 (`notion_retrieve_bot_user`)

### データベース操作

- データベースの作成 (`notion_create_database`)
- データベースのクエリ (`notion_query_database`)
- データベースの取得 (`notion_retrieve_database`)
- データベースの更新 (`notion_update_database`)
- データベースアイテムの作成 (`notion_create_database_item`)

### コメント操作

- コメントの作成 (`notion_create_comment`)
- コメントの取得 (`notion_retrieve_comments`)

### 検索

- Notionの検索 (`notion_search`)

### 拡張機能

- ワークフローの作成 (`notion_create_workflow`)
- CSVからのインポート (`notion_import_from_csv`)
- CSVへのエクスポート (`notion_export_to_csv`)
- 定期タスクの作成 (`notion_create_recurring_task`)

## サーバーの改良点

このサーバーは以下の機能を提供します：

### エラーハンドリング

- 包括的なエラー捕捉と詳細なエラーメッセージ
- スタックトレースのログ記録

### パフォーマンスと信頼性

- API リクエストのレート制限
- 失敗したリクエストの自動再試行
- 指数バックオフとジッター

### ロギング

- 構造化ログ出力
- リクエスト/レスポンスの詳細ログ

## セットアップ

1. Notion APIのインテグレーションを作成し、APIトークンを取得します。

   - [Notion Developers](https://developers.notion.com/)にアクセスします。
   - 「Create new integration」をクリックします。
   - 必要な権限を設定します。
   - トークンをコピーします。

2. サーバーを直接起動する場合（テスト用）：

   ```
   # トークンを引数で渡す
   bun run /path/to/index.ts your_notion_api_token

   # または
   node dist/index.js your_notion_api_token
   ```

## Claude Desktop との統合

Claude Desktop アプリケーションとNotionサーバーを連携するには、`claude_desktop_config.json`ファイルを設定する必要があります。

### claude_desktop_config.jsonの設定方法

1. ファイルの場所: Claude Desktopアプリケーションのインストールディレクトリまたはユーザーホームディレクトリに配置します。

2. Notionサーバーを登録するための設定例:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "/Users/username/.bun/bin/bun",
      "args": ["run", "/path/to/filesystem.ts", "/path/to/allowed/directory"]
    },
    "shell": {
      "command": "/Users/username/.bun/bin/bun",
      "args": ["run", "/path/to/shell.ts"]
    },
    "notion": {
      "command": "/Users/username/.bun/bin/bun",
      "args": [
        "run",
        "/Users/username/Desktop/demo/src/notion/index.ts",
        "your_notion_integration_key_here"
      ]
    }
  }
}
```

3. 設定の説明:

   - `command`: Bunの実行パス (通常は `~/.bun/bin/bun` または `which bun` で確認できます)
   - `args`: サーバー起動のための引数
     - 最初の引数: index.tsファイルへのパス
     - 二番目の引数: Notion API トークン (統合キー)

4. Claude Desktopアプリを再起動すると、Notionツールが利用可能になります。

## 使い方

このサーバーはModel Context Protocolに準拠しており、標準入出力を介して通信します。

### ツールの一覧取得

```json
{
  "id": "123",
  "method": "list_tools",
  "params": {}
}
```

### ツールの実行

例えば、ページを取得する場合：

```json
{
  "id": "456",
  "method": "call_tool",
  "params": {
    "name": "notion_retrieve_page",
    "arguments": {
      "page_id": "your-page-id"
    }
  }
}
```

## アーキテクチャ

このプロジェクトは次のコンポーネントで構成されています：

- **`server.ts`**: MCPサーバーの実装とリクエストハンドリング
- **`client.ts`**: Notion APIクライアントラッパー
- **`tools.ts`**: ツール定義（名前、説明、入力スキーマ）
- **`types.ts`**: 型定義
- **`schemas.ts`**: JSONスキーマ定義
- **`utils/`**: ユーティリティモジュール
  - **`logger.ts`**: 構造化ロギング
  - **`rate-limiter.ts`**: APIレート制限
  - **`api-client.ts`**: ベースAPIクライアント（再試行、エラーハンドリング）

## カスタマイズ

プロジェクトの構成や追加の機能が必要な場合は、以下のファイルを編集してください：

- `types.ts`: 型定義
- `schemas.ts`: JSONスキーマ定義
- `tools.ts`: ツール定義
- `client.ts`: Notion APIクライアント
- `server.ts`: MCPサーバー実装

## トラブルシューティング

### Claude Desktopでツールが表示されない

- `claude_desktop_config.json`の設定パスが正しいか確認してください
- Notion APIトークンが正しく設定されているか確認してください
- ログ出力を確認して、サーバーが正常に起動しているか確認してください

### APIエラーが発生する

- Notion APIトークンが有効であることを確認してください
- トークンに必要な権限が付与されているか確認してください
- レート制限に達していないか確認してください

## 注意事項

拡張機能の一部（ワークフローの作成、CSVのインポート/エクスポート、定期タスクの作成など）は、Notion APIで直接サポートされていない機能を実装したものです。これらの機能は、既存のAPI機能を組み合わせて実現しています。

## ライセンス

このプロジェクトはMITライセンスの下で提供されています。
