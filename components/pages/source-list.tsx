import { CollectorRun } from "@/lib/api";
import { Section } from "@/components/ui";

export type SourceItem = { name: string; side: string; method: string; status: string; kind: string; note: string };

export function CollectorHealth({ run }: { run: CollectorRun | null }) {
  return <section className="collector-health"><div><span>最終実行</span><b>{run ? new Date(run.finishedAt).toLocaleString("ja-JP") : "未実行"}</b></div><div><span>状態</span><b className={run?.status === "failed" ? "danger" : "green"}>{run?.status ?? "待機中"}</b></div><div><span>取得件数</span><b>{run?.itemCount ?? 0}件</b></div><div><span>異常メッセージ</span><b>{run?.message || "なし"}</b></div></section>;
}

export function SourceList({ sources }: { sources: SourceItem[] }) {
  return <Section title="接続状況" description="A: 公式API / B: 低頻度候補 / C: 禁止 / D: 回避しない">
    <div className="source-grid">{sources.map(source => <article className="source-card" key={source.name}><div><span className={`status-dot ${source.kind}`} /><strong>{source.name}</strong><small>{source.side}</small></div><dl><div><dt>取得方法</dt><dd>{source.method}</dd></div><div><dt>状態</dt><dd><span className={`status-pill ${source.kind}`}>{source.status}</span></dd></div></dl><p>{source.note}</p></article>)}</div>
  </Section>;
}
