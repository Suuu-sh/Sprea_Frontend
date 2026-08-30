# 使い方ページ更新ルール

`app/guide/page.tsx` はユーザー向け仕様書として扱う。

次の変更を行うPull Requestでは、同じPull Request内で使い方ページを必ず確認し、必要なら更新する。

- 画面、ナビゲーション、表示項目の追加・削除・名称変更
- BUY / SKIP条件、利益計算、Confidence、Sprea Scoreの変更
- Retail / Buyback Freshnessや在庫条件の変更
- Collector、販売Provider、買取Providerの追加・停止
- Paper Trading、Evaluator、評価時間の変更
- 定期実行間隔、探索件数、再試行方針の変更
- ユーザー操作やトラブルシューティング手順の変更

更新時はページ最下部の「最終更新」も変更する。
