import Link from "next/link";
import { PackageSearch } from "lucide-react";
import { ResearchOpportunity } from "@/lib/api";

const yen = (value: number) => new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY", maximumFractionDigits: 0 }).format(value);

export function OpportunityList({ items, loading, error }: { items: ResearchOpportunity[]; loading: boolean; error: string }) {
  return <section className="data-table" aria-label="検出した利益案件">
    <div className="data-head"><span>#</span><span>商品</span><span>仕入</span><span>最高買取</span><span>次点買取</span><span>店舗数</span><span>実質利益</span><span>利益率</span><span>Score</span><span>在庫・更新</span></div>
    {loading && <div className="table-message">データを読み込んでいます</div>}
    {error && <div className="table-message">{error}</div>}
    {!loading && !error && items.map((item, index) => {
      return <div className="data-row" key={`${item.canonicalKey}-${item.detectedAt}-${index}`}>
        <span className="rank">{index + 1}</span>
        <div className="product-cell"><span><b><Link href={`/products/?key=${encodeURIComponent(item.canonicalKey)}`}>{item.title}</Link></b><small>{item.category || "カテゴリ未設定"}<br />{item.canonicalKey}</small></span></div>
        <span className="buyer"><b className="numeric">{yen(item.purchasePrice + item.purchaseShipping)}</b><small>{item.purchaseSource}</small></span>
        <span className="buyer"><b className="numeric">{yen(item.buybackPrice)}</b><small>{item.bestBuybackProvider || item.buybackSource}</small></span>
        <span className="buyer"><b className="numeric">{item.secondBuybackPrice == null ? "—" : yen(item.secondBuybackPrice)}</b><small>{item.secondBuybackProvider ?? "次点なし"}</small></span>
        <span className="numeric">{item.buybackStoreCount}</span>
        <strong className={item.marketProfit >= 0 ? "profit" : ""}>{yen(item.marketProfit)}</strong>
        <strong>{item.profitRate.toFixed(1)}%</strong><strong>{item.spreaScore}</strong>
        <span className="buyer"><b>{item.stockStatus}</b><small>{new Date(item.lastUpdated).toLocaleString("ja-JP")}</small></span>
      </div>;
    })}
    {!loading && !error && !items.length && <div className="table-message"><PackageSearch />該当商品がありません</div>}
  </section>;
}
