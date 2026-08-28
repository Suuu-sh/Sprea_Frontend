/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import {useCallback,useEffect,useMemo,useState} from "react";
import {RefreshCw} from "lucide-react";
import {AppShell} from "@/components/app-shell";
import {TradeList} from "@/components/pages/trade-list";
import {StatCard,StatGrid} from "@/components/ui";
import {closePaperTrade,getResearchDashboard,listPaperTrades,PaperTrade,ResearchDashboard} from "@/lib/api";
import {dataLabel,environmentBadge} from "@/lib/environment";
const yen=(n:number)=>new Intl.NumberFormat("ja-JP",{style:"currency",currency:"JPY",maximumFractionDigits:0}).format(n);
export default function PaperTrading(){
 const[d,setD]=useState<ResearchDashboard|null>(null),[trades,setTrades]=useState<PaperTrade[]>([]),[loading,setLoading]=useState(true),[error,setError]=useState(""),[notice,setNotice]=useState("");
 const load=useCallback(async()=>{setLoading(true);setError("");try{const[dashboard,items]=await Promise.all([getResearchDashboard(),listPaperTrades()]);setD(dashboard);setTrades(Array.isArray(items)?items:[])}catch(e){setError(e instanceof Error?e.message:"仮想取引を取得できませんでした")}finally{setLoading(false)}},[]);
 useEffect(()=>{void load()},[load]);
 const close=async(id:number)=>{if(!window.confirm("この仮想取引を終了しますか？"))return;setNotice("");try{await closePaperTrade(id);setNotice("取引を終了しました");await load()}catch(e){setError(e instanceof Error?e.message:"取引を終了できませんでした")}};
 const p=d?.portfolio??{initialCapital:300000,lockedCapital:0,availableCash:300000,openTrades:0};
 const closed=useMemo(()=>trades.filter(x=>x.status!=="open").length,[trades]);
 return <AppShell capital={p.initialCapital} title="Paper Trading" description={`${dataLabel}から検出した案件を仮想取引します。`} badge={environmentBadge} actions={<button className="tool-button" onClick={()=>void load()} disabled={loading}><RefreshCw size={16}/>更新</button>}>
 <StatGrid><StatCard label="利用可能資金" value={yen(p.availableCash)}/><StatCard label="拘束中" value={yen(p.lockedCapital)} help={`${p.openTrades}件を保有中`}/><StatCard label="初期資金" value={yen(p.initialCapital)}/><StatCard label="終了済み" value={`${closed}件`}/></StatGrid>
 {notice&&<div className="notice success" role="status">{notice}</div>}{error&&<div className="notice error" role="alert">{error}<button onClick={()=>void load()}>再試行</button></div>}
 {loading?<div className="table-message">取引を読み込んでいます</div>:!error&&<TradeList trades={trades} onClose={close}/>}</AppShell>;
}
