"use client";
import {useEffect,useMemo,useState} from "react";
import {RefreshCw,Search} from "lucide-react";
import {getResearchDashboard,ResearchDashboard} from "@/lib/api";
import {AppShell} from "@/components/app-shell";
import {StatCard,StatGrid} from "@/components/ui";
import {OpportunityList} from "@/components/pages/opportunity-list";
import {dataLabel,environmentBadge} from "@/lib/environment";
const yen=(n:number)=>new Intl.NumberFormat("ja-JP",{style:"currency",currency:"JPY",maximumFractionDigits:0}).format(n);
const percent=(n:number)=>`${n.toFixed(1)}%`;
const reasonLabels:Record<string,string>={profit_below_threshold:"利益 < ¥5,000",confidence_below_threshold:"Confidence < 0.95",insufficient_buyback_providers:"買取店舗不足",insufficient_funds:"資金不足",duplicate_holding:"同一商品を保有中",stale_listing:"販売価格が古い",stale_buyback:"買取価格が古い",out_of_stock:"在庫なし",buyback_closed:"買取停止",unresolved_product:"商品未解決",other:"その他"};
export default function Home(){
 const[data,setData]=useState<ResearchDashboard|null>(null),[query,setQuery]=useState(""),[loading,setLoading]=useState(true),[error,setError]=useState("");
 const load=()=>{setLoading(true);setError("");getResearchDashboard().then(setData).catch(e=>setError(e instanceof Error?e.message:"読み込みに失敗しました")).finally(()=>setLoading(false))};
 useEffect(()=>{getResearchDashboard().then(setData).catch(e=>setError(e instanceof Error?e.message:"読み込みに失敗しました")).finally(()=>setLoading(false))},[]);
 const shown=useMemo(()=>(data?.opportunities??[]).filter(x=>(x.title+x.category+x.canonicalKey+x.purchaseSource+x.buybackSource+x.bestBuybackProvider).toLowerCase().includes(query.toLowerCase())),[data,query]);
 const total=shown.reduce((s,x)=>s+x.marketProfit,0),portfolio=data?.portfolio??{initialCapital:300000,lockedCapital:0,availableCash:300000,openTrades:0},observability=data?.decisionObservability;
 return <AppShell capital={portfolio.initialCapital} title="案件リサーチ" description={`${dataLabel}で、検出・判定・資金配分を行います。`} badge={environmentBadge} actions={<button className="tool-button" aria-label="更新" onClick={load}><RefreshCw size={16}/></button>}>
 <StatGrid columns={5}><StatCard label="監視商品" value={`${shown.length}件`}/><StatCard label="利用可能資金" value={yen(portfolio.availableCash)}/><StatCard label="拘束中" value={yen(portfolio.lockedCapital)}/><StatCard label="48h Precision" value={percent((data?.metrics48h.precision??0)*100)}/><StatCard label="検出利益合計" value={yen(total)} tone={total>=0?"positive":"negative"}/></StatGrid>
 <section className="decision-observability" aria-label="本日の判定分析"><div className="observability-title"><div><b>本日の判定分析</b><small>BUYが出ない理由と、判定閾値までの差を表示します。</small></div><span>平均利益差 {yen(observability?.averageProfitGap??0)}</span></div><div className="observability-grid"><div className="decision-counts"><article><small>Opportunity</small><b>{observability?.today.opportunities??0}</b></article><article><small>BUY</small><b className="profit">{observability?.today.buys??0}</b></article><article><small>SKIP</small><b>{observability?.today.skips??0}</b></article></div><div className="reason-list"><b>SKIP理由</b>{(observability?.skipReasons??[]).map(item=><div key={item.reason}><span>{reasonLabels[item.reason]??item.reason}</span><strong>{item.count}件</strong></div>)}{!observability?.skipReasons.length&&<small>本日のSKIPはまだありません。</small>}</div></div>{Boolean(observability?.recentSkips.length)&&<div className="skip-gap-list"><b>直近のSKIPとBUYまでの差</b>{observability?.recentSkips.slice(0,8).map(item=><article key={item.id}><span><strong>{item.title}</strong><small>{item.reasons.map(reason=>reasonLabels[reason]??reason).join("・")}</small></span><span><small>利益</small><b>{yen(item.profit)}</b></span><span><small>必要利益</small><b>{yen(item.requiredProfit)}</b></span><span><small>あと</small><b>{yen(item.profitGap)}</b></span><span><small>Confidence</small><b>{item.confidence.toFixed(2)} / {item.requiredConfidence.toFixed(2)}</b></span></article>)}</div>}</section>
 <section className="filters"><label className="search-field"><Search/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="商品名・JAN・型番・取得元で検索"/></label><span className="filter-spacer"/></section>
 <OpportunityList items={shown} loading={loading} error={error}/><footer className="table-footer"><span>{shown.length}件を表示</span></footer></AppShell>}
