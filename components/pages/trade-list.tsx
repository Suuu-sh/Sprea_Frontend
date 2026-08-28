import Link from "next/link";
import { PaperTrade } from "@/lib/api";
import { EmptyState, Section } from "@/components/ui";

const yen = (value: number) => new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY", maximumFractionDigits: 0 }).format(value);

export function TradeList({ trades, onClose }: { trades: PaperTrade[]; onClose: (id: number) => Promise<void> }) {
  return <Section title="保有・取引履歴" description="終了すると拘束資金が解放されます。">
    <div className="card-list">
      {trades.map(trade => <article className="trade-card" key={trade.id}>
        <div><span className={`status-pill ${trade.status === "open" ? "active" : "ready"}`}>{trade.status === "open" ? "保有中" : "終了"}</span><h3><Link href={`/products/${encodeURIComponent(trade.canonicalKey)}`}>{trade.title}</Link></h3><p>{trade.purchaseSource} → {trade.buybackSource}</p></div>
        <div className="trade-numbers"><span>拘束資金<strong>{yen(trade.lockedCapital)}</strong></span><span>入口利益<strong>{yen(trade.entryProfit)}</strong></span>{trade.status === "open" && <button className="tool-button" onClick={() => onClose(trade.id)}>取引終了</button>}</div>
      </article>)}
      {!trades.length && <EmptyState>取引はまだありません。</EmptyState>}
    </div>
  </Section>;
}
