"use client";
import Link from "next/link";
import {BarChart3,Bell,CircleHelp,Database,FlaskConical,History,ListFilter,PackageSearch,Settings,TrendingUp,WalletCards} from "lucide-react";
import {usePathname} from "next/navigation";
import {ReactNode} from "react";
import {dataLabel,isProduction} from "@/lib/environment";

const nav=[{href:"/",label:"案件リサーチ",icon:TrendingUp},{href:"/targets",label:"探索対象商品",icon:ListFilter},{href:"/opportunities",label:"該当商品",icon:PackageSearch},{href:"/analytics",label:"分析",icon:BarChart3},{href:"/paper-trading",label:"Paper Trading",icon:WalletCards},{href:"/evaluations",label:"自動評価",icon:History},{href:"/sources",label:"データ取得元",icon:Database},{href:"/settings",label:"設定",icon:Settings},{href:"/guide",label:"使い方",icon:CircleHelp}];

export function AppShell({children,capital=300000,title="案件リサーチ",description="個人用リサーチ環境",badge,actions}:{children:ReactNode;capital?:number;title?:string;description?:string;badge?:string;actions?:ReactNode}){
 const pathname=usePathname();
 const yen=new Intl.NumberFormat("ja-JP",{style:"currency",currency:"JPY",maximumFractionDigits:0}).format(capital);
 const item=(x:(typeof nav)[number])=>{const Icon=x.icon;const selected=x.href==="/"?pathname==="/":pathname.startsWith(x.href);return <Link aria-current={selected?"page":undefined} className={selected?"selected":""} href={x.href} key={x.href}><Icon/>{x.label}</Link>};
 return <div className="app-layout">
  <aside className="sidebar"><div className="wordmark">Sprea<span>RESEARCH</span></div><nav className="side-nav" aria-label="メインナビゲーション">{nav.map(item)}</nav><div className="account-rate"><span>研究資金</span><strong>{yen}</strong><small>Allocation base</small></div><div className="help"><FlaskConical/>{dataLabel}専用</div></aside>
  <header className="global-header"><div className="global-title"><b>{title}</b><span>{description}</span></div><div className="header-actions">{badge&&<span className={`header-badge${isProduction?"":" local"}`}>{badge}</span>}{actions}<button aria-label="通知"><Bell/></button></div></header>
  <main className="workspace" data-route={pathname}>{children}</main>
  <nav className="mobile-nav" aria-label="モバイルナビゲーション">{nav.map(item)}</nav>
 </div>;
}
