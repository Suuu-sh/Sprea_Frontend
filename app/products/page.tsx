"use client";
import Link from "next/link";
import {Suspense,useEffect,useState} from "react";
import {useSearchParams} from "next/navigation";
import {AppShell} from "@/components/app-shell";
import {ProductHistory,ProductIdentity} from "@/components/pages/product-detail";
import {getProductDetail,ProductDetail} from "@/lib/api";

function ProductContent(){
 const params=useSearchParams(),key=params.get("key")??"",[d,setD]=useState<ProductDetail|null>(null),[error,setError]=useState("");
 useEffect(()=>{if(key)getProductDetail(key).then(setD).catch(()=>setError("商品履歴を取得できませんでした"))},[key]);
 if(!key)return <AppShell title="商品詳細" description=""><div className="table-message">商品が指定されていません</div></AppShell>;
 if(error)return <AppShell title="商品詳細" description={key}><div className="table-message">{error}</div></AppShell>;
 if(!d)return <AppShell title="商品詳細" description="商品履歴を読み込んでいます"><div className="table-message">商品履歴を読み込んでいます</div></AppShell>;
 return <AppShell title={d.title} description={d.canonicalKey} badge="RESOLVED" actions={<Link className="tool-button" href="/">← 案件一覧</Link>}><ProductIdentity product={d}/><ProductHistory product={d}/></AppShell>;
}
export default function ProductPage(){return <Suspense fallback={<div className="table-message">読み込んでいます</div>}><ProductContent/></Suspense>}
