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
export default function Home(){
 const[data,setData]=useState<ResearchDashboard|null>(null),[query,setQuery]=useState(""),[loading,setLoading]=useState(true),[error,setError]=useState("");
 const load=()=>{setLoading(true);setError("");getResearchDashboard().then(setData).catch(e=>setError(e instanceof Error?e.message:"読み込みに失敗しました")).finally(()=>setLoading(false))};
 useEffect(()=>{getResearchDashboard().then(setData).catch(e=>setError(e instanceof Error?e.message:"読み込みに失敗しました")).finally(()=>setLoading(false))},[]);
 const shown=useMemo(()=>(data?.opportunities??[]).filter(x=>(x.title+x.category+x.canonicalKey+x.purchaseSource+x.buybackSource+x.bestBuybackProvider).toLowerCase().includes(query.toLowerCase())),[data,query]);
 const total=shown.reduce((s,x)=>s+x.marketProfit,0),portfolio=data?.portfolio??{initialCapital:300000,lockedCapital:0,availableCash:300000,openTrades:0};
 return <AppShell capital={portfolio.initialCapital} title="案件リサーチ" description={`${dataLabel}で、検出・判定・資金配分を行います。`} badge={environmentBadge} actions={<button className="tool-button" aria-label="更新" onClick={load}><RefreshCw size={16}/></button>}>
 <StatGrid columns={5}><StatCard label="監視商品" value={`${shown.length}件`}/><StatCard label="利用可能資金" value={yen(portfolio.availableCash)}/><StatCard label="拘束中" value={yen(portfolio.lockedCapital)}/><StatCard label="48h Precision" value={percent((data?.metrics48h.precision??0)*100)}/><StatCard label="検出利益合計" value={yen(total)} tone={total>=0?"positive":"negative"}/></StatGrid>
 <section className="filters"><label className="search-field"><Search/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="商品名・JAN・型番・取得元で検索"/></label><span className="filter-spacer"/></section>
 <OpportunityList items={shown} loading={loading} error={error}/><footer className="table-footer"><span>{shown.length}件を表示</span></footer></AppShell>}
