"use client";
import {useEffect,useMemo,useState} from "react";
import {RefreshCw,Search} from "lucide-react";
import {AppShell} from "@/components/app-shell";
import {OpportunityList} from "@/components/pages/opportunity-list";
import {StatCard,StatGrid} from "@/components/ui";
import {getResearchDashboard,ResearchDashboard} from "@/lib/api";
import {dataLabel,environmentBadge} from "@/lib/environment";

const yen=(value:number)=>new Intl.NumberFormat("ja-JP",{style:"currency",currency:"JPY",maximumFractionDigits:0}).format(value);

export default function OpportunitiesPage(){
 const[data,setData]=useState<ResearchDashboard|null>(null),[query,setQuery]=useState(""),[loading,setLoading]=useState(true),[error,setError]=useState("");
 const load=()=>{setLoading(true);setError("");getResearchDashboard().then(setData).catch(e=>setError(e instanceof Error?e.message:"読み込みに失敗しました")).finally(()=>setLoading(false))};
 useEffect(()=>{getResearchDashboard().then(setData).catch(e=>setError(e instanceof Error?e.message:"読み込みに失敗しました")).finally(()=>setLoading(false))},[]);
 const items=useMemo(()=>(data?.opportunities??[]).filter(item=>(item.title+item.category+item.canonicalKey+item.purchaseSource+item.buybackSource+item.bestBuybackProvider).toLowerCase().includes(query.trim().toLowerCase())),[data,query]);
 const profitable=items.filter(item=>item.marketProfit>0).length,buyable=items.filter(item=>item.marketProfit>=5000).length,best=items.length?Math.max(...items.map(item=>item.marketProfit)):0;
 return <AppShell capital={data?.portfolio.initialCapital} title="該当商品" description={`${dataLabel}から検出した販売・買取価格差の商品一覧です。`} badge={environmentBadge} actions={<button className="tool-button" aria-label="更新" onClick={load}><RefreshCw size={16}/></button>}>
  <StatGrid columns={4}><StatCard label="該当商品" value={`${items.length}件`}/><StatCard label="利益あり" value={`${profitable}件`} tone={profitable?"positive":undefined}/><StatCard label="BUY基準以上" value={`${buyable}件`} tone={buyable?"positive":undefined}/><StatCard label="最大利益" value={yen(best)} tone={best>=0?"positive":"negative"}/></StatGrid>
  <section className="filters"><label className="search-field"><Search/><input value={query} onChange={event=>setQuery(event.target.value)} placeholder="商品名・JAN・型番・取得元で検索"/></label></section>
  <OpportunityList items={items} loading={loading} error={error}/><footer className="table-footer"><span>{items.length}件を表示</span></footer>
 </AppShell>;
}
