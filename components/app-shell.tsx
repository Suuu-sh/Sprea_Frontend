"use client";
import Link from "next/link";
import {Bell,Database,FlaskConical,History,PackageSearch,Settings,TrendingUp,WalletCards} from "lucide-react";
import {usePathname} from "next/navigation";
import {ReactNode} from "react";
import {dataLabel,isProduction} from "@/lib/environment";

const nav=[{href:"/",label:"案件リサーチ",icon:TrendingUp},{href:"/opportunities",label:"該当商品",icon:PackageSearch},{href:"/paper-trading",label:"Paper Trading",icon:WalletCards},{href:"/evaluations",label:"自動評価",icon:History},{href:"/sources",label:"データ取得元",icon:Database},{href:"/settings",label:"設定",icon:Settings}];

export function AppShell({children,capital=300000,title="案件リサーチ",description="個人用リサーチ環境",badge,actions}:{children:ReactNode;capital?:number;title?:string;description?:string;badge?:string;actions?:ReactNode}){
 const pathname=usePathname();
 const yen=new Intl.NumberFormat("ja-JP",{style:"currency",currency:"JPY",maximumFractionDigits:0}).format(capital);
 return <div className="app-layout"><aside className="sidebar"><div className="wordmark">Sprea</div><nav className="side-nav">{nav.map(x=>{const Icon=x.icon;const selected=x.href==="/"?pathname==="/":pathname.startsWith(x.href);return <Link className={selected?"selected":""} href={x.href} key={x.href}><Icon/>{x.label}</Link>})}</nav><div className="account-rate"><span>研究資金</span><strong>{yen}</strong></div><div className="help"><FlaskConical/>{dataLabel}専用</div></aside><header className="global-header"><div className="global-title"><b>{title}</b><span>{description}</span></div><div className="header-actions">{badge&&<span className={`header-badge${isProduction?"":" local"}`}>{badge}</span>}{actions}<button aria-label="通知"><Bell/></button></div></header><main className="workspace">{children}</main></div>;
}
