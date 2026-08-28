# Sprea Frontend

価格差とポイント還元を比較し、利益商品を見つけるSpreaのWebフロントエンドです。

## ローカル起動

`.env` は本番の既定値、Git管理対象外の `.env.local` はローカル専用の上書き値です。
ローカルでは `LOCAL MOCK DATA` と表示され、`http://localhost:8787` のMock APIへ接続します。

```bash
cp .env.example .env.local # 未作成の場合のみ
npm install
npm run dev
```

## 確認

```bash
npm run lint
npm run build
```

## 本番公開

フロントエンドはCloudflare Workersではなく、静的exportをCloudflare Pagesへ公開します。

```bash
NEXT_PUBLIC_API_URL=https://sprea-api.example.workers.dev npm run build
npm run deploy:pages
```

GitHub Actionsには`CLOUDFLARE_API_TOKEN`、`CLOUDFLARE_ACCOUNT_ID`をSecrets、
`NEXT_PUBLIC_API_URL`をRepository Variableとして設定します。
