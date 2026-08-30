/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import {useEffect,useState} from "react";
import {RefreshCw} from "lucide-react";
import {AppShell} from "@/components/app-shell";
import {EmptyState,Section} from "@/components/ui";
import {getResearchAnalytics,ResearchAnalytics} from "@/lib/api";
import {environmentBadge} from "@/lib/environment";

const yen=(value:number)=>new Intl.NumberFormat("ja-JP",{style:"currency",currency:"JPY",maximumFractionDigits:0}).format(value);
const provider=(value:string)=>value.replace("-discovery","").replace("yahoo","Yahoo!").replace("rakuten","楽天").replace("kaitori_1chome","買取1丁目").replace("kaitori_shouten","買取商店").replace("morimori","森森買取");
const horizon=(value:number)=>value===168?"7日":`${value}時間`;

export default function AnalyticsPage(){
 const[data,setData]=useState<ResearchAnalytics|null>(null),[loading,setLoading]=useState(true),[error,setError]=useState("");
 const load=async()=>{setLoading(true);setError("");try{setData(await getResearchAnalytics())}catch(e){setError(e instanceof Error?e.message:"分析データを取得できませんでした")}finally{setLoading(false)}};
 useEffect(()=>{void load()},[]);
 const comparison=data?.discoveryComparison;
 return <AppShell title="分析" description="探索結果と将来評価から、利益案件が生まれる条件を確認します。" badge={environmentBadge} actions={<button className="tool-button" onClick={()=>void load()} disabled={loading}><RefreshCw/>更新</button>}>
  {error&&<div className="notice error" role="alert">{error}<button onClick={()=>void load()}>再試行</button></div>}
  <section className="analytics-hero"><article><small>分析対象商品</small><strong>{comparison?.products.toLocaleString("ja-JP")??"—"}</strong><span>探索前後を比較可能</span></article><article><small>探索前の平均不足額</small><strong>{comparison?yen(comparison.beforeAverageGap):"—"}</strong><span>利益5,000円まで</span></article><article><small>現在の平均不足額</small><strong>{comparison?yen(comparison.afterAverageGap):"—"}</strong><span>小さいほどBUYに近い</span></article><article><small>探索による改善</small><strong className={(comparison?.averageImprovement??0)>0?"positive":""}>{comparison?yen(comparison.averageImprovement):"—"}</strong><span>平均不足額の減少</span></article></section>
  <Section title="将来価格の評価状況" description="Opportunity生成から24時間・48時間・72時間・7日後の販売価格と買取価格を自動評価します。">
   {data?.evaluationCoverage.length?<div className="analytics-grid four">{data.evaluationCoverage.map(x=><article key={x.horizon}><small>{horizon(x.horizon)}後</small><strong>{x.completed.toLocaleString("ja-JP")} / {x.total.toLocaleString("ja-JP")}</strong><span>評価完了</span><i style={{width:`${x.total?Math.min(x.completed/x.total*100,100):0}%`}}/><small>価格不足で保留 {x.pendingData.toLocaleString("ja-JP")}件</small></article>)}</div>:<EmptyState>評価時刻に到達すると、ここへ結果が蓄積されます。</EmptyState>}
  </Section>
  <Section title="Sprea Score別・48時間成功率" description="48時間後も利益5,000円以上を維持した割合です。母数と一緒に判断してください。">
   {data?.scoreSuccess.length?<div className="analytics-grid">{data.scoreSuccess.map(x=><article key={x.bucket}><small>Score {x.bucket}</small><strong>{x.successRate.toFixed(1)}%</strong><span>{x.evaluated.toLocaleString("ja-JP")}件を評価</span><i style={{width:`${Math.min(x.successRate,100)}%`}}/></article>)}</div>:<EmptyState>48時間評価が完了するとScore別成功率を表示します。</EmptyState>}
  </Section>
  <Section title="販売・買取Provider別の価格維持率" description="案件発見時の価格を100%として、各時点でどの程度維持されたかを示します。">
   {data?.providerRetention.length?<div className="analytics-table"><div className="analytics-head"><span>区分・Provider</span><span>経過</span><span>評価数</span><span>維持率</span></div>{data.providerRetention.map((x,index)=><div className="analytics-row" key={`${x.side}-${x.provider}-${x.horizon}-${index}`}><b>{x.side==="retail"?"販売":"買取"}・{provider(x.provider)}</b><span>{horizon(x.horizon)}後</span><span>{x.evaluated.toLocaleString("ja-JP")}件</span><strong>{x.retentionRate.toFixed(1)}%</strong></div>)}</div>:<EmptyState>将来価格が取得できるとProvider別に表示します。</EmptyState>}
  </Section>
  <Section title="商品カテゴリ別の利益" description="カテゴリごとのOpportunity数、平均利益、最大利益です。">
   {data?.categories.length?<div className="analytics-table"><div className="analytics-head"><span>カテゴリ</span><span>案件 / BUY</span><span>平均利益</span><span>最大利益</span></div>{data.categories.map(x=><div className="analytics-row" key={x.category}><b>{x.category}</b><span>{x.opportunities.toLocaleString("ja-JP")}件 / {x.buys.toLocaleString("ja-JP")}件</span><span>{yen(x.averageProfit)}</span><strong>{yen(x.maximumProfit)}</strong></div>)}</div>:<EmptyState>Opportunityが生成されるとカテゴリ別に表示します。</EmptyState>}
  </Section>
  <Section title="Provider別・平均利益不足額" description="必要利益5,000円まで平均でいくら不足しているかを比較します。">
   {data?.providerProfitGaps.length?<div className="analytics-grid">{data.providerProfitGaps.map(x=><article key={x.provider}><small>{provider(x.provider)}</small><strong>{yen(x.averageProfitGap)}</strong><span>{x.products.toLocaleString("ja-JP")}商品・{x.listings.toLocaleString("ja-JP")}件</span><small>利益5,000円以上 {x.thresholdCount.toLocaleString("ja-JP")}件</small></article>)}</div>:<EmptyState>販売商品が発見されるとProvider別に比較します。</EmptyState>}
  </Section>
  <Section title="BUYに近い商品ランキング" description="利益5,000円までの不足額が小さい順です。リンク先で価格と商品条件を確認できます。">
   {data?.nearBuy.length?<div className="near-buy-list">{data.nearBuy.map((x,index)=><a href={x.productUrl} target="_blank" rel="noreferrer" key={`${x.candidateId}-${x.retailProvider}`}><em>{index+1}</em><div><b>{x.productName}</b><small>{provider(x.retailProvider)} → {provider(x.buybackProvider)} ・ 現在利益 {yen(x.estimatedProfit)}</small></div><span>BUYまであと<strong>{yen(x.profitGap)}</strong></span></a>)}</div>:<EmptyState>利益5,000円未満の販売候補が見つかるとランキングを表示します。</EmptyState>}
  </Section>
 </AppShell>;
}
