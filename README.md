# Sprea Frontend

価格差とポイント還元を比較し、利益商品を見つけるSpreaのWebフロントエンドです。

## ローカル起動

```bash
cp .env.example .env.local
npm install
npm run dev
```

Backendは既定で `http://localhost:8080` を利用します。

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
