/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import {useCallback,useEffect,useMemo,useState} from "react";
import {RefreshCw,Search} from "lucide-react";
import {AppShell} from "@/components/app-shell";
import {EmptyState,Section,StatCard,StatGrid} from "@/components/ui";
import {DiscoveryTarget,getDiscoveryTargets} from "@/lib/api";
import {environmentBadge} from "@/lib/environment";

const yen=(value:number)=>new Intl.NumberFormat("ja-JP",{style:"currency",currency:"JPY",maximumFractionDigits:0}).format(value);
const categories=["すべて","iPhone","iPad","AirPods","Apple Watch","PlayStation","Nintendo Switch","その他"] as const;
function family(item:DiscoveryTarget){const value=`${item.productName} ${item.category??""}`.toLowerCase();if(value.includes("iphone"))return "iPhone";if(value.includes("ipad"))return "iPad";if(value.includes("airpods"))return "AirPods";if(value.includes("apple watch"))return "Apple Watch";if(value.includes("playstation")||value.includes("ps5")||value.includes("ps4"))return "PlayStation";if(value.includes("switch"))return "Nintendo Switch";return "その他"}
function providerLabel(value:string){return value==="kaitori_1chome"?"買取1丁目":value==="morimori"?"森森買取":value==="kaitori_shouten"?"買取商店":value}
function stateLabel(state:{status:string;lastSearchedAt:string|null;failureCount:number}){if(state.status==="failed")return `失敗 ${state.failureCount}回`;if(state.lastSearchedAt)return state.status==="succeeded"?"検索済み":"実行中";return "未検索"}

export default function TargetsPage(){
 const[items,setItems]=useState<DiscoveryTarget[]>([]),[total,setTotal]=useState(0),[loading,setLoading]=useState(true),[error,setError]=useState(""),[query,setQuery]=useState(""),[category,setCategory]=useState<(typeof categories)[number]>("すべて");
 const load=useCallback(async()=>{setLoading(true);setError("");try{const data=await getDiscoveryTargets();setItems(Array.isArray(data.items)?data.items:[]);setTotal(data.total)}catch(e){setError(e instanceof Error?e.message:"探索対象商品を取得できませんでした")}finally{setLoading(false)}},[]);
 useEffect(()=>{void load()},[load]);
 const counts=useMemo(()=>Object.fromEntries(categories.map(name=>[name,name==="すべて"?items.length:items.filter(item=>family(item)===name).length])),[items]);
 const filtered=useMemo(()=>{const needle=query.trim().toLowerCase();return items.filter(item=>(category==="すべて"||family(item)===category)&&(!needle||[item.productName,item.jan,item.modelNumber,item.searchQuery,item.bestBuybackProvider].some(value=>String(value??"").toLowerCase().includes(needle))))},[items,query,category]);
 const searched=items.filter(item=>item.yahoo.lastSearchedAt||item.rakuten.lastSearchedAt).length,found=items.filter(item=>item.retailResultCount>0).length,multiStore=items.filter(item=>item.buybackProviderCount>1).length;
 return <AppShell title="探索対象商品" description="買取価格を起点に、販売サイトで安い商品を探索する対象一覧です。" badge={environmentBadge} actions={<button className="tool-button" onClick={()=>void load()} disabled={loading}><RefreshCw/>更新</button>}>
  <StatGrid columns={4}><StatCard label="探索対象" value={`${total.toLocaleString("ja-JP")}商品`} help="JAN・型番違いを別商品として管理"/><StatCard label="販売サイト検索済み" value={`${searched.toLocaleString("ja-JP")}商品`} help="Yahoo! または楽天"/><StatCard label="販売商品を発見" value={`${found.toLocaleString("ja-JP")}商品`} help="一致した販売Listingあり"/><StatCard label="複数買取店あり" value={`${multiStore.toLocaleString("ja-JP")}商品`} help="買取価格を比較可能"/></StatGrid>
  {error&&<div className="notice error" role="alert">{error}<button onClick={()=>void load()}>再試行</button></div>}
  <Section title="商品一覧" description="同じ機種でも容量・色・JANが異なる商品は、誤紐付け防止のため別々に表示します。">
   <div className="target-controls"><label className="search-field"><Search/><input value={query} onChange={event=>setQuery(event.target.value)} placeholder="商品名・JAN・型番・買取店で検索"/></label><div className="target-tabs">{categories.map(name=><button key={name} className={category===name?"selected":""} onClick={()=>setCategory(name)}>{name}<b>{Number(counts[name]??0).toLocaleString("ja-JP")}</b></button>)}</div></div>
   {loading?<div className="table-message">読み込み中です…</div>:filtered.length?<div className="target-table"><div className="target-head"><span>商品</span><span>最高買取</span><span>仕入目標</span><span>Yahoo!</span><span>楽天</span><span>販売発見</span></div>{filtered.map(item=><article className="target-row" key={item.id}><div className="target-product"><b>{item.productName}</b><small>JAN {item.jan||"未取得"} ・ 型番 {item.modelNumber||"未取得"}</small><small>検索語: {item.searchQuery}</small></div><div><strong>{yen(item.bestBuybackPrice)}</strong><small>{providerLabel(item.bestBuybackProvider)} ・ {item.buybackProviderCount}店舗</small></div><div><strong>{yen(item.targetPurchasePrice)}</strong><small>探索上限 {yen(item.discoveryCeiling)}</small></div><div><span className={`status-pill ${item.yahoo.status==="failed"?"blocked":item.yahoo.lastSearchedAt?"active":"ready"}`}>{stateLabel(item.yahoo)}</span><small>{item.yahoo.lastSearchedAt?new Date(item.yahoo.lastSearchedAt).toLocaleString("ja-JP"):"順次検索予定"}</small></div><div><span className={`status-pill ${item.rakuten.status==="failed"?"blocked":item.rakuten.lastSearchedAt?"active":"ready"}`}>{stateLabel(item.rakuten)}</span><small>{item.rakuten.lastSearchedAt?new Date(item.rakuten.lastSearchedAt).toLocaleString("ja-JP"):"順次検索予定"}</small></div><div><strong>{item.retailResultCount.toLocaleString("ja-JP")}件</strong><small>{item.latestResultAt?`最終 ${new Date(item.latestResultAt).toLocaleString("ja-JP")}`:"未発見"}</small></div></article>)}</div>:<EmptyState>条件に一致する探索対象商品はありません。</EmptyState>}
   {!loading&&<div className="table-footer">{filtered.length.toLocaleString("ja-JP")}件を表示</div>}
  </Section>
 </AppShell>
}
