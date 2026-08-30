# Sprea Frontend

> 画面や判定仕様を変更する場合は、`app/guide/page.tsx` と `docs/usage-guide-maintenance.md` も同じPull Requestで確認・更新してください。

Sprea Researchの個人利用向けWebフロントエンドです。案件、商品・価格履歴、Paper Trading、Evaluator、Collector実行状態、研究設定をバックエンドの表示・操作APIへ接続します。

## 環境

環境名とAPI URLはファイルを分けて管理します。

- `.env`: 本番ビルドの既定値（`PRODUCTION DATA`）
- `.env.local`: ローカル専用の上書き（Git管理外、`LOCAL MOCK DATA`）
- `.env.example`: ローカル設定の雛形

秘密情報を `NEXT_PUBLIC_*` へ入れないでください。これらはブラウザへ公開されます。

ログイン画面の管理トークンは `sessionStorage` にだけ保持し、すべてのResearch APIリクエストにBearer tokenとして付与します。`localStorage` のユーザーセッションには保存しません。タブを閉じるかログアウトすると管理トークンは失われます。ローカル開発時だけ `.env.local` に `NEXT_PUBLIC_API_TOKEN=local-dev-token` を設定してfallbackにできますが、本番 `.env` にはtokenを置きません。

```bash
cp .env.example .env.local # 未作成の場合のみ
npm install
npm run dev
```

ローカルAPIのポートが異なる場合は `.env.local` の `NEXT_PUBLIC_API_URL` を変更します。画面はAPI未起動、空データ、タイムアウト、HTTPエラーをそれぞれ案内します。

## 画面

- `/`: 案件一覧と商品検索
- `/products/?key=...`: 商品同定情報、販売・買取価格履歴、判定・評価イベント
- `/paper-trading`: 保有・終了済みPaper Tradeと手動終了
- `/evaluations`: 24h / 48h / 72h / 7日評価、Evaluator実行履歴、手動実行
- `/sources`: Collector最終状態と直近20件の実行履歴
- `/settings`: 資金、最低利益、信頼度、送料、手数料、評価時間

フロントエンドから収集・ingestは行いません。Collectorの実行状態は `GET /api/collector/status` で表示します。

## 品質確認

```bash
npm run lint
npm test
npm run build
```

テストは表示APIのURL、Paper Trade終了のHTTPメソッド、バックエンドエラーの伝達を検証します。ブラウザQAの記録は `design-qa.md` にあります。

## 本番公開

静的exportをCloudflare Pagesへ公開します。

```bash
npm run build
npm run deploy:pages
```

GitHub Actionsには `CLOUDFLARE_API_TOKEN`、`CLOUDFLARE_ACCOUNT_ID` をSecrets、`NEXT_PUBLIC_API_URL`をRepository Variableとして設定します。デプロイワークフローは `NEXT_PUBLIC_APP_ENV=production` を明示し、ローカル用設定の混入を防ぎます。
