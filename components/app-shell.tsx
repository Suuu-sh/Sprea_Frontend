"use client";
import Link from "next/link";
import {ArrowLeft,BarChart3,Bell,CircleHelp,Database,FlaskConical,History,ListFilter,Menu,PackageSearch,Settings,TrendingUp,WalletCards,X} from "lucide-react";
import {usePathname,useRouter} from "next/navigation";
import {ReactNode,useState} from "react";
import {dataLabel,isProduction} from "@/lib/environment";

const nav=[{href:"/",label:"案件リサーチ",icon:TrendingUp},{href:"/targets",label:"探索対象商品",icon:ListFilter},{href:"/opportunities",label:"該当商品",icon:PackageSearch},{href:"/analytics",label:"分析",icon:BarChart3},{href:"/paper-trading",label:"Paper Trading",icon:WalletCards},{href:"/evaluations",label:"自動評価",icon:History},{href:"/sources",label:"データ取得元",icon:Database},{href:"/settings",label:"設定",icon:Settings},{href:"/guide",label:"使い方",icon:CircleHelp}];

export function AppShell({children,capital=300000,title="案件リサーチ",description="個人用リサーチ環境",badge,actions}:{children:ReactNode;capital?:number;title?:string;description?:string;badge?:string;actions?:ReactNode}){
 const pathname=usePathname(),router=useRouter(),[menuOpen,setMenuOpen]=useState(false);
 const yen=new Intl.NumberFormat("ja-JP",{style:"currency",currency:"JPY",maximumFractionDigits:0}).format(capital);
 const item=(x:(typeof nav)[number])=>{const Icon=x.icon;const selected=x.href==="/"?pathname==="/":pathname.startsWith(x.href);return <Link aria-current={selected?"page":undefined} className={selected?"selected":""} href={x.href} key={x.href} onClick={()=>setMenuOpen(false)}><Icon/>{x.label}</Link>};
 const mobilePrimary=nav.slice(0,4);
 return <div className="app-layout">
  <aside className="sidebar"><div className="wordmark">Sprea<span>RESEARCH</span></div><nav className="side-nav" aria-label="メインナビゲーション">{nav.map(item)}</nav><div className="account-rate"><span>研究資金</span><strong>{yen}</strong><small>Allocation base</small></div><div className="help"><FlaskConical/>{dataLabel}専用</div></aside>
  <header className="global-header">{pathname!=="/"&&<button className="mobile-back-button" aria-label="前の画面に戻る" onClick={()=>window.history.length>1?router.back():router.push("/")}><ArrowLeft/></button>}<div className="global-title"><b>{title}</b><span>{description}</span></div><div className="header-actions">{badge&&<span className={`header-badge${isProduction?"":" local"}`}>{badge}</span>}{actions}<button aria-label="通知"><Bell/></button></div></header>
  <main className="workspace" data-route={pathname}>{children}</main>
  <nav className="mobile-nav" aria-label="モバイルナビゲーション">{mobilePrimary.map(item)}<button className={menuOpen?"selected":""} aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={()=>setMenuOpen(open=>!open)}><Menu/>その他</button></nav>
  {menuOpen&&<div className="mobile-sheet-backdrop" onClick={()=>setMenuOpen(false)}><section id="mobile-menu" className="mobile-sheet" role="dialog" aria-modal="true" aria-label="すべてのページ" onClick={event=>event.stopPropagation()}><header><div><small>SPREA NAVIGATION</small><b>すべてのページ</b></div><button aria-label="メニューを閉じる" onClick={()=>setMenuOpen(false)}><X/></button></header><nav>{nav.map(item)}</nav><footer><span>研究資金</span><b>{yen}</b><small>{dataLabel}</small></footer></section></div>}
 </div>;
}
