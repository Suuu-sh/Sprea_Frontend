"use client";
import {useEffect,useState} from "react";
import {getCollectorStatus,CollectorRun} from "@/lib/api";
import {AppShell} from "@/components/app-shell";import {PageHeader} from "@/components/ui";
import {CollectorHealth,SourceList} from "@/components/pages/source-list";
const sources=[{name:"Local Mock Store",side:"販売",method:"組み込みモック",status:"稼働中",kind:"active",note:"ローカル開発専用。外部通信なし"},{name:"Local Mock Buyback",side:"買取",method:"組み込みモック",status:"稼働中",kind:"active",note:"複数店舗の価格差を再現"},{name:"Yahoo!ショッピング",side:"販売",method:"公式API",status:"本番のみ",kind:"ready",note:"Client ID登録済み。ローカルでは無効"},{name:"楽天市場",side:"販売",method:"公式API",status:"本番のみ",kind:"ready",note:"アクセスキーがある環境だけで利用"},{name:"Amazon.co.jp",side:"販売",method:"Creators API",status:"未接続",kind:"pending",note:"ページのスクレイピングは禁止"},{name:"Apple.com",side:"販売",method:"自動取得なし",status:"使用禁止",kind:"blocked",note:"規約に基づきスクレイピングしない"}];
export default function Sources(){const[last,setLast]=useState<CollectorRun|null>(null);useEffect(()=>{getCollectorStatus().then(x=>setLast(x.lastRun))},[]);return <AppShell><PageHeader title="データ取得元" description="取得方法・利用可否・環境分離を一か所で管理します。" badge="SAFE MODE"/><CollectorHealth run={last}/><SourceList sources={sources}/></AppShell>}
