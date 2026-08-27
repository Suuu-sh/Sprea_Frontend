"use client";
import Link from "next/link";
import {Database,FlaskConical,History,Settings,TrendingUp,WalletCards} from "lucide-react";
import {usePathname} from "next/navigation";
import {ReactNode} from "react";
const nav=[{href:"/",label:"案件リサーチ",icon:TrendingUp},{href:"/paper-trading",label:"Paper Trading",icon:WalletCards},{href:"/evaluations",label:"自動評価",icon:History},{href:"/sources",label:"データ取得元",icon:Database},{href:"/settings",label:"設定",icon:Settings}];
export function AppShell({children,capital=300000}:{children:ReactNode;capital?:number}){const pathname=usePathname();const yen=new Intl.NumberFormat("ja-JP",{style:"currency",currency:"JPY",maximumFractionDigits:0}).format(capital);return <div className="app-layout"><aside className="sidebar"><div className="wordmark">Sprea</div><nav className="side-nav">{nav.map(x=>{const Icon=x.icon;const selected=x.href==="/"?pathname==="/":pathname.startsWith(x.href);return <Link className={selected?"selected":""} href={x.href} key={x.href}><Icon/>{x.label}</Link>})}</nav><div className="account-rate"><span>研究資金</span><strong>{yen}</strong></div><div className="help"><FlaskConical/>ローカルモック環境</div></aside><main className="workspace">{children}</main></div>}
