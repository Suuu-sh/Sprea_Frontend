/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import {useCallback,useEffect,useMemo,useState} from "react";
import {RefreshCw} from "lucide-react";
import {AppShell} from "@/components/app-shell";
import {CollectorHealth,SourceList,SourceItem} from "@/components/pages/source-list";
import {EmptyState,Section} from "@/components/ui";
import {CollectorRun,getCollectorStatus} from "@/lib/api";
import {dataLabel,environmentBadge,isProduction} from "@/lib/environment";
const catalog:SourceItem[]=[
 {key:"mock",name:"Mock Collector",side:"販売・買取",method:"ローカルfixture",status:"ローカル専用",kind:"active",note:"本番環境では実行されません"},
 {key:"yahoo-discovery",name:"Yahoo!ショッピング",side:"販売",method:"公式API",status:"未取得",kind:"pending",note:"公式APIから動的に取得状況を確認します"},
 {key:"rakuten-discovery",name:"楽天市場",side:"販売",method:"公式API",status:"未取得",kind:"pending",note:"公式APIから動的に取得状況を確認します"},
 {key:"kaitori_1chome",name:"買取1丁目",side:"買取",method:"Public Collector / Ingest API",status:"未取得",kind:"pending",note:"取込データから動的に接続状況を確認します"},
 {key:"morimori",name:"森森買取",side:"買取",method:"Public Collector / Ingest API",status:"未取得",kind:"pending",note:"取込データから動的に接続状況を確認します"},
 {key:"kaitori_shouten",name:"買取商店",side:"買取",method:"Public Collector / Ingest API",status:"未取得",kind:"pending",note:"取込データから動的に接続状況を確認します"},
 {key:"amazon",name:"Amazon.co.jp",side:"販売",method:"Creators API",status:"未接続",kind:"pending",note:"Webページのスクレイピングは禁止"},
 {key:"apple",name:"Apple.com",side:"販売",method:"自動取得なし",status:"使用禁止",kind:"blocked",note:"規約に基づきスクレイピングしません"}
];
const date=(x:string)=>new Date(x).toLocaleString("ja-JP");
export default function Sources(){const[last,setLast]=useState<CollectorRun|null>(null),[runs,setRuns]=useState<CollectorRun[]>([]),[connections,setConnections]=useState<import("@/lib/api").SourceConnection[]>([]),[loading,setLoading]=useState(true),[error,setError]=useState("");const load=useCallback(async()=>{setLoading(true);setError("");try{const x=await getCollectorStatus();setLast(x.lastRun);setRuns(Array.isArray(x.runs)?x.runs:[]);setConnections(Array.isArray(x.sources)?x.sources:[])}catch(e){setError(e instanceof Error?e.message:"Collector状態を取得できませんでした")}finally{setLoading(false)}},[]);useEffect(()=>{void load()},[load]);const sources=useMemo(()=>catalog.filter(x=>!isProduction||x.key!=="mock").map(item=>{const connection=connections.find(value=>value.source===item.key);if(!connection)return item;const lastSuccess=connection.lastSuccessAt?date(connection.lastSuccessAt):"取得待ち";return{...item,status:connection.status==="connected"?"接続済み":"設定済み",kind:connection.status==="connected"?"active":"ready",note:`${connection.itemCount.toLocaleString("ja-JP")}件 ・ 最終成功 ${lastSuccess}`}}),[connections]);return <AppShell title="データ取得元" description={`${dataLabel}の取得元と実稼働状況を表示します。`} badge={environmentBadge} actions={<button className="tool-button" onClick={()=>void load()} disabled={loading}><RefreshCw/>更新</button>}>
{loading?<div className="collector-health"><div><span>最終実行</span><b>読み込み中</b></div></div>:error?<div className="notice error" role="alert">{error}<button onClick={()=>void load()}>再試行</button></div>:<CollectorHealth run={last}/>}<SourceList sources={sources}/>
<Section title="Collector実行履歴" description="APIが記録した直近20件の実状態です。"><div className="run-list">{runs.map(x=><article key={`${x.id}-${x.runId}`}><span className={`status-dot ${x.status==="succeeded"?"active":x.status==="running"?"pending":"blocked"}`}/><div><b>{x.source}</b><small>{date(x.startedAt)} · {x.runId}</small></div><strong>{x.itemCount}件</strong><span>{x.message||x.status}</span></article>)}{!runs.length&&<EmptyState>Collectorの実行履歴はまだありません。</EmptyState>}</div></Section></AppShell>}
