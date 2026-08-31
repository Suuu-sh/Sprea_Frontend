"use client";

import {useEffect,useMemo,useState} from "react";
import {AlertCircle,RefreshCw} from "lucide-react";
import {Bar,CartesianGrid,ComposedChart,Line,ReferenceLine,ResponsiveContainer,Tooltip,XAxis,YAxis} from "recharts";
import {getResearchDashboard,ResearchDashboard} from "@/lib/api";
import {AppShell} from "@/components/app-shell";
import {EmptyState,StatCard,StatGrid} from "@/components/ui";
import {dataLabel,environmentBadge} from "@/lib/environment";

const yen=(value:number)=>new Intl.NumberFormat("ja-JP",{style:"currency",currency:"JPY",maximumFractionDigits:0}).format(value);
const percent=(value:number)=>`${value.toFixed(1)}%`;
const time=(value:string)=>new Date(value).toLocaleTimeString("ja-JP",{timeZone:"Asia/Tokyo",hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:false});
const reasonLabels:Record<string,string>={profit_below_threshold:"利益不足",confidence_below_threshold:"Confidence不足",insufficient_buyback_providers:"買取店舗不足",insufficient_funds:"資金不足",duplicate_holding:"同一商品を保有中",stale_listing:"販売価格が古い",stale_buyback:"買取価格が古い",out_of_stock:"在庫なし",buyback_closed:"買取停止",unresolved_product:"商品未解決",other:"その他"};
type WatchlistRow={id:string;title:string;status:"BUY"|"SKIP";profit:number;gap:number;confidence:number|null;requiredConfidence:number;detail:string;at:string;score:number|null};

export default function Home(){
 const[data,setData]=useState<ResearchDashboard|null>(null),[loading,setLoading]=useState(true),[error,setError]=useState(""),[filter,setFilter]=useState<"all"|"buy"|"skip">("all");
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
 const watchlist=useMemo(()=>{
  const rows:WatchlistRow[]=opportunities.map((item,index)=>({id:`buy-${item.canonicalKey}-${index}`,title:item.title,status:"BUY",profit:item.marketProfit,gap:Math.max(5000-item.marketProfit,0),confidence:null,requiredConfidence:.95,detail:`${item.purchaseSource} → ${item.bestBuybackProvider||item.buybackSource}`,at:item.lastUpdated,score:item.spreaScore}));
  for(const item of observability?.recentSkips??[])rows.push({id:`skip-${item.id}`,title:item.title,status:"SKIP",profit:item.profit,gap:item.profitGap,confidence:item.confidence,requiredConfidence:item.requiredConfidence,detail:item.reasons.map(reason=>reasonLabels[reason]??reason).join("・"),at:item.detectedAt,score:null});
  return rows.sort((a,b)=>a.gap-b.gap).slice(0,10);
 },[opportunities,observability]);
 const visibleWatchlist=watchlist.filter(item=>filter==="all"||item.status.toLowerCase()===filter),buyCount=watchlist.filter(item=>item.status==="BUY").length,skipCount=watchlist.filter(item=>item.status==="SKIP").length;
 const plotValues=watchlist.slice(0,12).reverse();
 const chartData=plotValues.map((item,index,items)=>{const history=items.slice(0,index+1),recent=history.slice(-3);return{label:time(item.at),profit:item.profit,average:Math.round(history.reduce((sum,row)=>sum+row.profit,0)/history.length),moving:Math.round(recent.reduce((sum,row)=>sum+row.profit,0)/recent.length)}});
 const allocated=portfolio.initialCapital?portfolio.lockedCapital/portfolio.initialCapital*100:0,evaluated=data?.metrics48h.evaluated??0,precision=(data?.metrics48h.precision??0)*100;

 return <AppShell capital={portfolio.initialCapital} title="案件リサーチ" description={`${dataLabel}で、利益機会・判定精度・資金配分を監視します。`} badge={environmentBadge} actions={<button className="tool-button" onClick={load} disabled={loading}><RefreshCw/>更新</button>}>
  <div className="research-layout">
   <div className="research-primary">
    <StatGrid columns={5}>
     <StatCard label="該当商品" value={`${opportunities.length}件`} help="評価中"/>
     <StatCard label="利用可能資金" value={yen(portfolio.availableCash)} help={`残り ${percent(100-allocated)}`}/>
     <StatCard label="拘束中" value={yen(portfolio.lockedCapital)} help={`占有 ${percent(allocated)}`}/>
     <StatCard label="48h Precision" value={percent((data?.metrics48h.precision??0)*100)} help="モデル精度"/>
     <StatCard label="検出利益合計" value={yen(total)} help="全機会の合計" tone={total>=0?"positive":"negative"}/>
    </StatGrid>
    {error&&<div className="notice error" role="alert">{error}<button onClick={load}>再試行</button></div>}
    <section className="signal-panel" aria-label="直近判定の利益スナップショット">
     <div className="analytic-heading"><div><h2>利益機会トレンド（直近判定）</h2></div><div className="chart-legend"><span className="teal">検出利益</span><span>BUY基準</span><span className="dashed">基準線</span></div></div>
     {chartData.length?<div className="signal-plot"><ResponsiveContainer width="100%" height="100%"><ComposedChart data={chartData} margin={{top:3,right:8,bottom:0,left:0}}><CartesianGrid vertical={false} stroke="#e4e9ed"/><XAxis dataKey="label" axisLine={false} tickLine={false} tick={{fontSize:8,fill:"#718096"}}/><YAxis width={40} domain={[dataMin=>Math.min(0,Number(dataMin)),dataMax=>Math.max(5000,Number(dataMax))]} axisLine={false} tickLine={false} tick={{fontSize:8,fill:"#718096"}} tickFormatter={value=>`¥${Number(value).toLocaleString("ja-JP")}`}/><Tooltip formatter={value=>yen(Number(value))}/><ReferenceLine y={5000} stroke="#7c899a" strokeDasharray="4 4"/><ReferenceLine y={0} stroke="#b7c1cc"/><Bar dataKey="profit" name="検出利益" fill="#8ed0c9" barSize={18} isAnimationActive={false}/><Line dataKey="average" name="平均利益" type="monotone" stroke="#17314f" strokeWidth={2} dot={{r:2,fill:"#17314f"}}/><Line dataKey="moving" name="移動平均" type="monotone" stroke="#718096" strokeWidth={1.5} strokeDasharray="4 4" dot={false}/></ComposedChart></ResponsiveContainer></div>:<EmptyState>判定が蓄積されると利益分布を表示します。</EmptyState>}
    </section>

    <section className="watchlist-panel" aria-label="機会ウォッチリスト">
     <div className="analytic-heading"><div><h2>機会ウォッチリスト（ランキング）</h2><p>利益機会の高い順に並べています。行をクリックして詳細分析へ。</p></div><div className="watchlist-filters" aria-label="判定フィルター"><button className={filter==="all"?"selected":""} onClick={()=>setFilter("all")}>すべて <b>{watchlist.length}</b></button><button className={filter==="buy"?"selected":""} onClick={()=>setFilter("buy")}>BUY <b>{buyCount}</b></button><button className={filter==="skip"?"selected":""} onClick={()=>setFilter("skip")}>SKIP <b>{skipCount}</b></button></div></div>
     {visibleWatchlist.length?<div className="watchlist-table"><div className="watchlist-head"><span>順位</span><span>商品</span><span>状態</span><span>利益ギャップ</span><span>必要利益</span><span>利益</span><span>Confidence</span><span>検出時刻</span></div>{visibleWatchlist.map((item,index)=><article className="watchlist-row" key={item.id}><span className="watch-rank">{index+1}</span><span className="watch-product"><b>{item.title}</b><small>{item.detail||"判定理由なし"}</small></span><span><b className={`decision-pill ${item.status.toLowerCase()}`}>{item.status}</b></span><span><b>{item.gap?`あと ${yen(item.gap)}`:"あと ¥0"}</b></span><strong>{yen(5000)}</strong><strong className={item.profit>=5000?"positive":""}>{yen(item.profit)}</strong><span className="confidence-cell"><b>{item.confidence===null?`Score ${item.score}`:`${item.confidence.toFixed(2)} / ${item.requiredConfidence.toFixed(2)}`}</b><progress max="1" value={item.confidence??Math.min((item.score??0)/100,1)}/></span><time>{time(item.at)}</time></article>)}</div>:<EmptyState>この判定に該当する候補はありません。</EmptyState>}
     <footer className="watchlist-footer"><span>全{visibleWatchlist.length}件を表示</span><span>自動更新：オフ（手動）</span></footer>
    </section>
   </div>

   <aside className="analysis-brief" aria-label="分析ブリーフィング">
    <div className={`brief-overview${evaluated>=30?" ready":""}`}><AlertCircle/><p>{loading?<>分析データを読み込んでいます。</>:evaluated<10?<>48時間後の評価済みデータは<br/><b>{evaluated}件</b>です。安定的な評価には<br/>あと<b>{10-evaluated}件</b>必要です。</>:evaluated<30?<>評価済みデータは<b>{evaluated}件</b>です。<br/>現在の48h Precisionは<br/><b>{percent(precision)}</b>です。引き続き蓄積します。</>:<>評価済みデータが<b>{evaluated}件</b>蓄積され、<br/>分析可能な状態です。<br/>48h Precisionは<b>{percent(precision)}</b>です。</>}</p></div>
    <div className="brief-title"><span>ANALYST BRIEF</span><h2>分析ブリーフィング</h2></div>
    <section><h3>資金状況</h3><dl><div><dt>研究資金</dt><dd>{yen(portfolio.initialCapital)}</dd></div><div><dt>利用可能</dt><dd className="positive">{yen(portfolio.availableCash)}（{percent(100-allocated)}）</dd></div><div><dt>拘束中</dt><dd>{yen(portfolio.lockedCapital)}（{percent(allocated)}）</dd></div><div><dt>現在の平均利益</dt><dd>{opportunities.length?yen(total/opportunities.length):yen(0)}</dd></div></dl></section>
    <section><h3>モデル評価（48h Precision）</h3><strong className="brief-metric">{percent(precision)}</strong><p>評価済みサンプル: {evaluated}件</p>{evaluated<10&&<p className="brief-note"><AlertCircle/>サンプル不足のため、精度を断定できません。</p>}</section>
    <section><h3>SKIP理由トップ</h3>{observability?.skipReasons.length?<ol className="skip-ranking">{observability.skipReasons.slice(0,5).map((item,index)=><li key={item.reason}><span>{index+1}　{reasonLabels[item.reason]??item.reason}</span><b>{item.count}件</b></li>)}</ol>:<p>本日のSKIPはまだありません。</p>}</section>
    <section><h3>ディスカバリーファネル</h3><ol className="brief-funnel">{funnel.map(([label,value],index)=>{const previous=index?funnel[index-1][1]:0,conversion=index&&previous?value/previous*100:null;return <li key={label}><span><small>{label}</small><b>{value.toLocaleString("ja-JP")}件</b></span><em>{conversion===null?"—":percent(conversion)}</em></li>})}</ol><p className="brief-note"><AlertCircle/>各段階は処理タイミングにより一時的に前後する場合があります。</p></section>
   </aside>
  </div>
 </AppShell>;
}
