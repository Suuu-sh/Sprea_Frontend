import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Sprea — 価格差を、利益に。", description: "利益商品を見つける価格差ダッシュボード" };
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ja"><body>{children}</body></html>}

