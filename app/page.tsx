"use client";

import {useEffect,useMemo,useState} from "react";
import {AlertCircle,RefreshCw} from "lucide-react";
import {getResearchDashboard,ResearchDashboard} from "@/lib/api";
import {AppShell} from "@/components/app-shell";
import {EmptyState,StatCard,StatGrid} from "@/components/ui";
import {dataLabel,environmentBadge} from "@/lib/environment";

const yen=(value:number)=>new Intl.NumberFormat("ja-JP",{style:"currency",currency:"JPY",maximumFractionDigits:0}).format(value);
const percent=(value:number)=>`${value.toFixed(1)}%`;
const time=(value:string)=>new Date(value).toLocaleTimeString("ja-JP",{hour:"2-digit",minute:"2-digit"});
const reasonLabels:Record<string,string>={profit_below_threshold:"利益不足",confidence_below_threshold:"Confidence不足",insufficient_buyback_providers:"買取店舗不足",insufficient_funds:"資金不足",duplicate_holding:"同一商品を保有中",stale_listing:"販売価格が古い",stale_buyback:"買取価格が古い",out_of_stock:"在庫なし",buyback_closed:"買取停止",unresolved_product:"商品未解決",other:"その他"};
type WatchlistRow={id:string;title:string;status:"BUY"|"SKIP";profit:number;gap:number;confidence:number|null;requiredConfidence:number;detail:string;at:string;score:number|null};

export default function Home(){
 const[data,setData]=useState<ResearchDashboard|null>(null),[loading,setLoading]=useState(true),[error,setError]=useState("");
 const load=()=>{setLoading(true);setError("");getResearchDashboard().then(setData).catch(error=>setError(error instanceof Error?error.message:"読み込みに失敗しました")).finally(()=>setLoading(false))};
 useEffect(()=>{getResearchDashboard().then(setData).catch(error=>setError(error instanceof Error?error.message:"読み込みに失敗しました")).finally(()=>setLoading(false))},[]);

 const opportunities=useMemo(()=>data?.opportunities??[],[data]),portfolio=data?.portfolio??{initialCapital:300000,lockedCapital:0,availableCash:300000,openTrades:0},observability=data?.decisionObservability;
 const total=opportunities.reduce((sum,item)=>sum+item.marketProfit,0);
 const funnel=[
  ["Buyback Quote",data?.discoveryFunnel.buybackQuotes??0],
  ["候補",data?.discoveryFunnel.candidates??0],
  ["Canonical",data?.discoveryFunnel.canonicalProducts??0],
  ["販売発見",data?.discoveryFunnel.yahooFound??0],
  ["購入可能",data?.discoveryFunnel.purchasable??0],
  ["利益あり",data?.discoveryFunnel.profitable??0],
  ["¥5,000以上",data?.discoveryFunnel.threshold??0],
  ["BUY",data?.discoveryFunnel.buys??0]
 ] as const;
 const providerMetrics=[...(data?.discoveryFunnel.providers??[])];
 for(const run of data?.discoveryFunnel.lastProviderRuns??[]){const provider=`${run.provider}-discovery`;if(!providerMetrics.some(item=>item.provider===provider))providerMetrics.push({provider,found:0,listings:0,profitable:0,threshold:0,averageProfitGap:0})}
 const watchlist=useMemo(()=>{
  const rows:WatchlistRow[]=opportunities.map((item,index)=>({id:`buy-${item.canonicalKey}-${index}`,title:item.title,status:"BUY",profit:item.marketProfit,gap:Math.max(5000-item.marketProfit,0),confidence:null,requiredConfidence:.95,detail:`${item.purchaseSource} → ${item.bestBuybackProvider||item.buybackSource}`,at:item.lastUpdated,score:item.spreaScore}));
  for(const item of observability?.recentSkips??[])rows.push({id:`skip-${item.id}`,title:item.title,status:"SKIP",profit:item.profit,gap:item.profitGap,confidence:item.confidence,requiredConfidence:item.requiredConfidence,detail:item.reasons.map(reason=>reasonLabels[reason]??reason).join("・"),at:item.detectedAt,score:null});
  return rows.sort((a,b)=>a.gap-b.gap).slice(0,10);
 },[opportunities,observability]);
 const plotValues=watchlist.slice(0,12).reverse(),plotMax=Math.max(5000,...plotValues.map(item=>Math.abs(item.profit)));
 const allocated=portfolio.initialCapital?portfolio.lockedCapital/portfolio.initialCapital*100:0;

 return <AppShell capital={portfolio.initialCapital} title="案件リサーチ" description={`${dataLabel}で、利益機会・判定精度・資金配分を監視します。`} badge={environmentBadge} actions={<button className="tool-button" onClick={load} disabled={loading}><RefreshCw/>更新</button>}>
  <StatGrid columns={5}>
   <StatCard label="該当商品" value={`${opportunities.length}件`} help="現在のOpportunity"/>
   <StatCard label="利用可能資金" value={yen(portfolio.availableCash)} help={`残り ${percent(100-allocated)}`}/>
   <StatCard label="拘束中" value={yen(portfolio.lockedCapital)} help={`${portfolio.openTrades}件・${percent(allocated)}`}/>
   <StatCard label="48h Precision" value={percent((data?.metrics48h.precision??0)*100)} help={`${data?.metrics48h.evaluated??0}件を評価`}/>
   <StatCard label="検出利益合計" value={yen(total)} help="現在の全機会" tone={total>=0?"positive":"negative"}/>
  </StatGrid>

  {error&&<div className="notice error" role="alert">{error}<button onClick={load}>再試行</button></div>}
  <div className="research-layout">
   <div className="research-primary">
    <section className="signal-panel" aria-label="直近判定の利益スナップショット">
     <div className="analytic-heading"><div><span>PROFIT SIGNAL</span><h2>直近判定の利益スナップショット</h2></div><small>基準利益 ¥5,000</small></div>
     {plotValues.length?<div className="signal-plot"><div className="signal-threshold" style={{top:`${Math.max(8,100-Math.min(5000/plotMax*100,92))}%`}}><span>BUY基準</span></div><div className="signal-bars">{plotValues.map(item=><div className="signal-bar-item" key={item.id} title={`${item.title}: ${yen(item.profit)}`}><i className={item.profit>=5000?"buy":"skip"} style={{height:`${Math.max(10,Math.min(item.profit/plotMax*100,100))}%`}}/><span>{time(item.at)}</span></div>)}</div><div className="signal-axis"><span>{yen(plotMax)}</span><span>¥0</span></div></div>:<EmptyState>判定が蓄積されると利益分布を表示します。</EmptyState>}
    </section>

    <section className="watchlist-panel" aria-label="機会ウォッチリスト">
     <div className="analytic-heading"><div><span>DECISION QUEUE</span><h2>機会ウォッチリスト</h2><p>BUYまで近い順に、判定根拠と利益差を比較します。</p></div><small>{watchlist.length}件</small></div>
     {watchlist.length?<div className="watchlist-table"><div className="watchlist-head"><span>#</span><span>商品・根拠</span><span>判定</span><span>利益</span><span>BUYまで</span><span>Confidence / Score</span><span>検出</span></div>{watchlist.map((item,index)=><article className="watchlist-row" key={item.id}><span className="watch-rank">{index+1}</span><span className="watch-product"><b>{item.title}</b><small>{item.detail||"判定理由なし"}</small></span><span><b className={`decision-pill ${item.status.toLowerCase()}`}>{item.status}</b></span><strong className={item.profit>=5000?"positive":""}>{yen(item.profit)}</strong><span><b>{yen(item.gap)}</b><i className="gap-meter"><i style={{width:`${Math.max(4,100-Math.min(item.gap/5000*100,100))}%`}}/></i></span><span><b>{item.confidence===null?`Score ${item.score}`:`${item.confidence.toFixed(2)} / ${item.requiredConfidence.toFixed(2)}`}</b></span><time>{time(item.at)}</time></article>)}</div>:<EmptyState>現在確認できる判定候補はありません。</EmptyState>}
    </section>

    <section className="provider-strip" aria-label="販売サイト別探索状況"><div className="analytic-heading"><div><span>PROVIDER HEALTH</span><h2>販売サイト別の探索状況</h2></div></div>{providerMetrics.length?<div>{providerMetrics.map(provider=>{const run=data?.discoveryFunnel.lastProviderRuns.find(item=>provider.provider.includes(item.provider));return <article key={provider.provider}><span><b>{provider.provider.replace("-discovery","").replace("yahoo","Yahoo!").replace("rakuten","楽天")}</b><small>検索 {run?.searched_count??0}・失敗 {run?.failure_count??0}</small></span><span><small>商品一致</small><b>{provider.found}</b></span><span><small>利益あり</small><b>{provider.profitable}</b></span><span><small>平均不足</small><b>{yen(provider.averageProfitGap)}</b></span></article>})}</div>:<EmptyState>Providerの探索結果はまだありません。</EmptyState>}</section>
   </div>

   <aside className="analysis-brief" aria-label="分析ブリーフィング">
    <div className="brief-title"><span>ANALYST BRIEF</span><h2>分析ブリーフィング</h2></div>
    <section><h3>資金状況</h3><dl><div><dt>研究資金</dt><dd>{yen(portfolio.initialCapital)}</dd></div><div><dt>利用可能</dt><dd className="positive">{yen(portfolio.availableCash)}（{percent(100-allocated)}）</dd></div><div><dt>拘束中</dt><dd>{yen(portfolio.lockedCapital)}（{percent(allocated)}）</dd></div><div><dt>現在の平均利益</dt><dd>{opportunities.length?yen(total/opportunities.length):yen(0)}</dd></div></dl></section>
    <section><h3>モデル評価（48h Precision）</h3><strong className="brief-metric">{percent((data?.metrics48h.precision??0)*100)}</strong><p>評価済みサンプル: {data?.metrics48h.evaluated??0}件</p>{(data?.metrics48h.evaluated??0)<10&&<p className="brief-note"><AlertCircle/>サンプル不足のため、精度を断定できません。</p>}</section>
    <section><h3>SKIP理由トップ</h3>{observability?.skipReasons.length?<ol className="skip-ranking">{observability.skipReasons.slice(0,5).map((item,index)=><li key={item.reason}><span>{index+1}　{reasonLabels[item.reason]??item.reason}</span><b>{item.count}件</b></li>)}</ol>:<p>本日のSKIPはまだありません。</p>}</section>
    <section><h3>ディスカバリーファネル</h3><ol className="brief-funnel">{funnel.map(([label,value],index)=>{const previous=index?funnel[index-1][1]:0,conversion=index&&previous?value/previous*100:null;return <li key={label}><span><small>{label}</small><b>{value.toLocaleString("ja-JP")}件</b></span><em>{conversion===null?"—":percent(conversion)}</em></li>})}</ol><p className="brief-note"><AlertCircle/>各段階は処理タイミングにより一時的に前後する場合があります。</p></section>
   </aside>
  </div>
 </AppShell>;
}
