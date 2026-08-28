import Link from "next/link";
import { PackageSearch } from "lucide-react";
import { ResearchDecision, ResearchOpportunity } from "@/lib/api";

const yen = (value: number) => new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY", maximumFractionDigits: 0 }).format(value);

export function OpportunityList({ items, decisions, loading, error }: { items: ResearchOpportunity[]; decisions: Map<string, ResearchDecision>; loading: boolean; error: string }) {
  return <section className="data-table" aria-label="検出した利益案件">
    <div className="data-head"><span>#</span><span>商品</span><span>仕入価格</span><span>最高買取</span><span>店舗数</span><span>実質利益</span><span>利益率</span><span>Sprea Score</span><span>判定</span></div>
    {loading && <div className="table-message">データを読み込んでいます</div>}
    {error && <div className="table-message">{error}</div>}
    {!loading && !error && items.map((item, index) => {
      const decision = decisions.get(item.canonicalKey);
      return <div className="data-row" key={`${item.canonicalKey}-${item.detectedAt}-${index}`}>
        <span className="rank">{index + 1}</span>
        <div className="product-cell"><span><b><Link href={`/products/?key=${encodeURIComponent(item.canonicalKey)}`}>{item.title}</Link></b><small>{item.canonicalKey}<br />{item.purchaseSource} → {item.buybackSource}</small></span></div>
        <span className="numeric">{yen(item.purchasePrice + item.purchaseShipping)}</span>
        <span className="numeric">{yen(item.buybackPrice)}</span>
        <span className="numeric">{item.buybackStoreCount}</span>
        <strong className={item.marketProfit >= 0 ? "profit" : ""}>{yen(item.marketProfit)}</strong>
        <strong>{item.profitRate.toFixed(1)}%</strong><strong>{item.spreaScore}</strong>
        <span className="buyer"><b>{decision?.decision.toUpperCase() ?? "未判定"}</b><small>{decision?.reason ?? ""}</small></span>
      </div>;
    })}
    {!loading && !error && !items.length && <div className="table-message"><PackageSearch />該当商品がありません</div>}
  </section>;
}
