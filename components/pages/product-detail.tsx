import { ProductDetail } from "@/lib/api";
import { EmptyState, Section } from "@/components/ui";

const yen = (value: number) => new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY", maximumFractionDigits: 0 }).format(value);

export function ProductIdentity({ product }: { product: ProductDetail }) {
  const reason = product.history[0]?.matchReason || "未記録";
  return <section className="detail-metrics"><div><span>JAN</span><b>{product.jan || "—"}</b></div><div><span>型番</span><b>{product.model || "—"}</b></div><div><span>容量・色</span><b>{product.capacity} {product.color}</b></div><div><span>同定根拠</span><b>{reason}</b></div></section>;
}

export function ProductHistory({ product }: { product: ProductDetail }) {
  const max = Math.max(1, ...product.history.map(point => point.price));
  return <Section title="価格推移" description="販売・買取のスナップショットを時系列で保存しています。">
    {product.history.length ? <div className="price-chart">{product.history.map((point, index) => <div key={`${point.source}-${point.capturedAt}-${index}`} className={point.side}><span>{new Date(point.capturedAt).toLocaleString("ja-JP", { timeZone: "UTC" })}</span><i style={{ width: `${Math.max(8, point.price / max * 100)}%` }} /><b>{point.stock ? yen(point.price) : "在庫なし"}</b><small>{point.source}・信頼度 {(point.confidence * 100).toFixed(0)}%</small></div>)}</div> : <EmptyState>価格履歴はまだありません。</EmptyState>}
    <h2>BUY・評価イベント</h2>{product.decisions.length || product.evaluations.length ? <div className="event-list">{product.decisions.map(item => <div key={item.id}><b>{item.decision.toUpperCase()}</b><span>{item.reason}</span><strong>{yen(item.entryProfit)}</strong></div>)}{product.evaluations.map((item, index) => <div key={`evaluation-${index}`}><b>{item.horizonHours}h</b><span>{item.outcome}</span><strong>{yen(item.profit)}</strong></div>)}</div> : <EmptyState>判定・評価イベントはまだありません。</EmptyState>}
  </Section>;
}
