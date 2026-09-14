/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import {useCallback,useEffect,useMemo,useState} from "react";
import {RefreshCw} from "lucide-react";
import {AppShell} from "@/components/app-shell";
import {CollectorHealth,SourceList,SourceItem} from "@/components/pages/source-list";
import {EmptyState,Section} from "@/components/ui";
import {CollectorRun,DiscoveryQueueStatus,KaitorixCsvStatus,getCollectorStatus,getDiscoveryQueueStatus,getKaitorixCsvStatus,SourceConnection} from "@/lib/api";
import {dataLabel,environmentBadge,isProduction} from "@/lib/environment";

const catalog:SourceItem[]=[
 {key:"mock",name:"Mock Collector",side:"販売・買取",method:"ローカルfixture",status:"ローカル専用",kind:"active",note:"本番環境では実行されません"},
 {key:"yahoo-discovery",name:"Yahoo!ショッピング",side:"販売",method:"公式API",status:"未取得",kind:"pending",note:"公式APIから動的に取得状況を確認します"},
 {key:"rakuten-discovery",name:"楽天市場",side:"販売",method:"公式API",status:"未取得",kind:"pending",note:"公式APIから動的に取得状況を確認します"},
 {key:"kaitori_1chome",name:"買取1丁目",side:"買取",method:"Public Collector / Ingest API",status:"未取得",kind:"pending",note:"取込データから動的に接続状況を確認します"},
 {key:"morimori",name:"森森買取",side:"買取",method:"Public Collector / Ingest API",status:"未取得",kind:"pending",note:"取込データから動的に接続状況を確認します"},
 {key:"kaitori_shouten",name:"買取商店",side:"買取",method:"Public Collector / Ingest API",status:"未取得",kind:"pending",note:"取込データから動的に接続状況を確認します"},
 {key:"amazon-discovery",name:"Amazon.co.jp",side:"販売",method:"Creators API",status:"未接続",kind:"pending",note:"公式APIのみ使用。Webページのスクレイピングは禁止"},
 {key:"apple",name:"Apple.com",side:"販売",method:"自動取得なし",status:"使用禁止",kind:"blocked",note:"規約に基づきスクレイピングしません"}
];

const date=(x:string)=>new Date(x).toLocaleString("ja-JP");
const formatBytes=(value:number|undefined)=>value==null?"—":value<1024*1024?`${Math.round(value/1024)} KB`:`${(value/1024/1024).toFixed(1)} MB`;

export default function Sources(){
 const[last,setLast]=useState<CollectorRun|null>(null);
 const[runs,setRuns]=useState<CollectorRun[]>([]);
 const[connections,setConnections]=useState<SourceConnection[]>([]);
 const[csvStatus,setCsvStatus]=useState<KaitorixCsvStatus|null>(null);
 const[queueStatus,setQueueStatus]=useState<DiscoveryQueueStatus|null>(null);
 const[loading,setLoading]=useState(true);
 const[error,setError]=useState("");
 const[csvError,setCsvError]=useState("");

 const load=useCallback(async()=>{
  setLoading(true);setError("");setCsvError("");
  const[collectorResult,csvResult,queueResult]=await Promise.allSettled([getCollectorStatus(),getKaitorixCsvStatus(),getDiscoveryQueueStatus()]);
  if(collectorResult.status==="fulfilled"){
   const x=collectorResult.value;
   setLast(x.lastRun);setRuns(Array.isArray(x.runs)?x.runs:[]);setConnections(Array.isArray(x.sources)?x.sources:[]);
  }else setError(collectorResult.reason instanceof Error?collectorResult.reason.message:"Collector状態を取得できませんでした");
  if(csvResult.status==="fulfilled")setCsvStatus(csvResult.value);
  else setCsvError(csvResult.reason instanceof Error?csvResult.reason.message:"CSV状態を取得できませんでした");
  if(queueResult.status==="fulfilled")setQueueStatus(queueResult.value);
  setLoading(false);
 },[]);

 useEffect(()=>{void load()},[load]);

 const sources=useMemo(()=>catalog.filter(x=>!isProduction||x.key!=="mock").map(item=>{
  const connection=connections.find(value=>value.source===item.key);
  if(!connection)return item;
  const lastSuccess=connection.lastSuccessAt?date(connection.lastSuccessAt):"取得待ち";
  return{...item,status:connection.status==="connected"?"接続済み":"設定済み",kind:connection.status==="connected"?"active":"ready",note:`${connection.itemCount.toLocaleString("ja-JP")}件 ・ 最終成功 ${lastSuccess}`};
 }),[connections]);

 const progress=csvStatus?.progress;
 const csvState=progress?.status??(csvStatus?.archivedToday?"archived":"waiting");
 const totalCandidates=progress?.totalCandidates??0;
 const importedCandidates=progress?.importedCandidates??0;
 const progressPercent=totalCandidates>0?Math.min(100,Math.round(importedCandidates*100/totalCandidates)):csvState==="completed"?100:0;
 const csvStateLabel=csvState==="completed"?"候補取り込み完了":csvState==="importing"?"取り込み中":csvState==="archived"?"CSV保存済み":"取得待ち";
 const nextStep=csvState==="completed"?"販売APIを順番に探索中":csvState==="importing"?"候補をD1へ取り込み中":"次回のCSV取得を待機";
 const queueStateLabel=queueStatus?.state==="running"?"探索中":queueStatus?.state==="rebuild_pending"?"キュー更新待ち":queueStatus?.state==="failed"?"直近実行失敗":"待機中";
 const queueRun=queueStatus?.lastRun;
 const queueDeferred=Boolean(queueRun?.message.includes("deferred"));

 return <AppShell title="データ取得元" description={`${dataLabel}の取得元と実稼働状況を表示します。`} badge={environmentBadge} actions={<button className="tool-button" onClick={()=>void load()} disabled={loading}><RefreshCw/>更新</button>}>
  {loading&&!last?<div className="collector-health"><div><span>最終実行</span><b>読み込み中</b></div></div>:error?<div className="notice error" role="alert">{error}<button onClick={()=>void load()}>再試行</button></div>:<CollectorHealth run={last}/>}<SourceList sources={sources}/>
  <Section title="KaitoriX CSV・探索キュー" description="CSV原本はR2に保存し、候補だけをD1へ取り込みます。画面の更新時だけ状態を確認します。">
   <div className="csv-sync-grid">
    <div><span>CSV</span><b>{csvStatus?.archivedToday?"取得済み":"未取得"}</b><small>{csvStatus?.today??"—"} ・ {formatBytes(progress?.bytes)}</small></div>
    <div><span>候補取り込み</span><b>{totalCandidates>0?`${importedCandidates.toLocaleString("ja-JP")} / ${totalCandidates.toLocaleString("ja-JP")}件`:csvState==="completed"?"0件":"待機中"}</b><small>{csvStateLabel}{progress?.rowsRead?` ・ ${progress.rowsRead.toLocaleString("ja-JP")}行読込`:""}</small></div>
    <div><span>次の処理</span><b>{nextStep}</b><small>失敗しても途中から再開</small></div>
   </div>
   {totalCandidates>0&&<div className="csv-sync-progress" aria-label={`候補取り込み ${progressPercent}%`}><i style={{width:`${progressPercent}%`}}/></div>}
   {csvError&&<div className="csv-sync-error" role="status">CSV状態を取得できませんでした。次の更新で再試行します。</div>}
  </Section>
  <Section title="販売API探索キュー" description="キュー全体を再集計せず、メタ情報と直近の実行結果だけを表示します。画面更新時に数件の軽い読み取りを行います。">
   <div className="csv-sync-grid">
    <div><span>状態</span><b>{queueStateLabel}</b><small>{queueStatus?`世代 ${queueStatus.generation} ・ ${queueStatus.providerCount} Provider`:"—"}</small></div>
    <div><span>探索対象</span><b>{queueStatus?`${queueStatus.candidates.toLocaleString("ja-JP")}件`:"—"}</b><small>{queueStatus?`${queueStatus.totalPairs.toLocaleString("ja-JP")} Providerペア` : "—"}</small></div>
    <div><span>直近実行</span><b>{queueRun?`${queueRun.searchedPairs.toLocaleString("ja-JP")} Providerペア処理`:"まだ実行されていません"}</b><small>{queueRun?`${date(queueRun.startedAt)} ・ ${queueRun.searched.toLocaleString("ja-JP")}商品 ・ 失敗 ${queueRun.failures}件${queueDeferred?" ・ 次回へ繰越":""}` : "—"}</small></div>
   </div>
  </Section>
  <Section title="Collector実行履歴" description="APIが記録した直近20件の実状態です。"><div className="run-list">{runs.map(x=><article key={`${x.id}-${x.runId}`}><span className={`status-dot ${x.status==="succeeded"?"active":x.status==="running"?"pending":"blocked"}`}/><div><b>{x.source}</b><small>{date(x.startedAt)} · {x.runId}</small></div><strong>{x.itemCount}件</strong><span>{x.message||x.status}</span></article>)}{!runs.length&&<EmptyState>Collectorの実行履歴はまだありません。</EmptyState>}</div></Section>
 </AppShell>;
}
