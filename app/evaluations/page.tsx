/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import Link from "next/link";
import {useCallback,useEffect,useMemo,useState} from "react";
import {Play,RefreshCw} from "lucide-react";
import {AppShell} from "@/components/app-shell";
import {EmptyState,Section,StatCard,StatGrid} from "@/components/ui";
import {EvaluationSchedule,EvaluatorRun,getEvaluatorStatus,getResearchDashboard,ResearchDashboard,runEvaluator} from "@/lib/api";
import {dataLabel,environmentBadge} from "@/lib/environment";
const pct=(n:number)=>`${(n*100).toFixed(1)}%`,yen=(n:number)=>new Intl.NumberFormat("ja-JP",{style:"currency",currency:"JPY",maximumFractionDigits:0}).format(n),date=(x:string)=>new Date(x).toLocaleString("ja-JP");
const horizon=(h:number)=>h===168?"7日":`${h}h`;
const statusLabel=(status:string)=>status==="completed"?"評価済み":status==="pending_data"?"データ待ち":status==="due"?"評価期限到来":"待機中";
export default function Evaluations(){
 const[d,setD]=useState<ResearchDashboard|null>(null),[schedules,setSchedules]=useState<EvaluationSchedule[]>([]),[runs,setRuns]=useState<EvaluatorRun[]>([]),[loading,setLoading]=useState(true),[running,setRunning]=useState(false),[error,setError]=useState(""),[notice,setNotice]=useState("");
 const load=useCallback(async()=>{setLoading(true);setError("");try{const[dashboard,status]=await Promise.all([getResearchDashboard(),getEvaluatorStatus()]);setD(dashboard);setSchedules(Array.isArray(status.schedules)?status.schedules:[]);setRuns(Array.isArray(status.runs)?status.runs:[])}catch(e){setError(e instanceof Error?e.message:`${dataLabel}の評価データを取得できませんでした`)}finally{setLoading(false)}},[]);
 useEffect(()=>{void load()},[load]);const m=d?.metrics48h;
 const pending=useMemo(()=>schedules.filter(x=>x.status!=="completed").length,[schedules]);
 const execute=async()=>{setRunning(true);setNotice("");setError("");try{const result=await runEvaluator();setNotice(`Evaluatorを実行しました（${result.evaluatedCount}件を評価）`);await load()}catch(e){setError(e instanceof Error?e.message:"Evaluatorを実行できませんでした")}finally{setRunning(false)}};
 return <AppShell capital={d?.portfolio.initialCapital} title="自動評価" description={`${dataLabel}の価格履歴を24h・48h・72h・7日後に評価します。`} badge={environmentBadge} actions={<><button className="tool-button" onClick={()=>void load()} disabled={loading}><RefreshCw/>更新</button><button className="tool-button primary" onClick={()=>void execute()} disabled={running}><Play/>{running?"実行中":"手動実行"}</button></>}>
 <StatGrid columns={5}><StatCard label="評価済み" value={`${m?.evaluated??0}件`}/><StatCard label="評価待ち" value={`${pending}件`}/><StatCard label="48h Precision" value={pct(m?.precision??0)} tone="positive"/><StatCard label="48h Recall" value={pct(m?.recall??0)}/><StatCard label="平均利益" value={yen(m?.averageProfit??0)} tone={(m?.averageProfit??0)>=0?"positive":"negative"}/></StatGrid>
 {notice&&<div className="notice success" role="status">{notice}</div>}{error&&<div className="notice error" role="alert">{error}<button onClick={()=>void load()}>再試行</button></div>}
 {loading?<div className="table-message">評価状態を読み込んでいます</div>:!error&&<><Section title="評価スケジュール" description="案件ごとの評価期限と結果です。"><div className="evaluation-table"><div className="evaluation-head"><span>商品</span><span>期限</span><span>状態</span><span>結果</span><span>利益・減衰</span></div>{schedules.map((x,i)=><div className="evaluation-row" key={`${x.decisionId}-${x.horizonHours}-${i}`}><span><Link href={`/products/?key=${encodeURIComponent(x.canonicalKey)}`}>{x.title}</Link><small>{horizon(x.horizonHours)}</small></span><span>{date(x.dueAt)}</span><span><b className={`status-pill ${x.status==="completed"?"active":"ready"}`}>{statusLabel(x.status)}</b></span><span>{x.outcome||"—"}</span><strong className={(x.profit??0)>=0?"positive":"negative"}>{x.profit===undefined?"—":yen(x.profit)}<small>{x.decay===undefined?"":`減衰 ${yen(x.decay)} (${((x.decayRate??0)*100).toFixed(1)}%)`}</small></strong></div>)}{!schedules.length&&<EmptyState>評価スケジュールはまだありません。</EmptyState>}</div></Section>
 <Section title="実行履歴" description="手動・自動Evaluatorの直近実行です。"><div className="run-list">{runs.slice(0,20).map(x=><article key={x.id}><span className={`status-dot ${x.status==="succeeded"?"active":"blocked"}`}/><div><b>{x.trigger==="manual"?"手動実行":x.trigger}</b><small>{date(x.startedAt)}</small></div><strong>{x.evaluatedCount}件</strong><span>{x.message||"正常終了"}</span></article>)}{!runs.length&&<EmptyState>実行履歴はまだありません。</EmptyState>}</div></Section></>}</AppShell>;
}
