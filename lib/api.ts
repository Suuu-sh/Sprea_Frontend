export type ResearchOpportunity = { canonicalKey: string; title: string; category: string; purchaseSource: string; buybackSource: string; bestBuybackProvider: string; secondBuybackProvider: string | null; purchasePrice: number; purchaseShipping: number; buybackPrice: number; secondBuybackPrice: number | null; marketProfit: number; profitRate: number; buybackStoreCount: number; topTwoSpreadRate: number; return30Days: number; spreaScore: number; scoreVersion: string; scoreReason: Record<string, unknown>; stockStatus: string; lastUpdated: string; detectedAt: string };
export type ResearchDecision = { id: number; canonicalKey: string; decision: "buy" | "skip"; reason: string; strategy: string; entryProfit: number; spreaScore: number; decidedAt: string };
export type DecisionSkip = { id: number; canonicalKey: string; title: string; profit: number; requiredProfit: number; profitGap: number; confidence: number; requiredConfidence: number; confidenceGap: number; reasons: string[]; detectedAt: string };
export type DecisionObservability = { today: { opportunities: number; buys: number; skips: number }; skipReasons: Array<{ reason: string; count: number }>; averageProfitGap: number; closestSkipProfit: number | null; recentSkips: DecisionSkip[] };
export type DiscoveryFunnel = { buybackQuotes: number; candidates: number; canonicalProducts: number; yahooFound: number; purchasable: number; profitable: number; threshold: number; buys: number; lastRun: Record<string, unknown> | null };
export type ResearchDashboard = { portfolio: { initialCapital: number; lockedCapital: number; availableCash: number; openTrades: number }; opportunities: ResearchOpportunity[]; decisions: ResearchDecision[]; decisionObservability: DecisionObservability; discoveryFunnel: DiscoveryFunnel; metrics48h: { evaluated: number; buyCount: number; precision: number; recall: number; missedOpportunities: number; averageProfit: number; maximumLoss: number } };
export type Evaluation = { decisionId: number; horizonHours: number; buybackPrice: number; profit: number; targetMet: boolean; outcome: "buy_correct" | "buy_failed" | "skip_correct" | "missed_opportunity"; evaluatedAt: string };
export type ProductHistoryPoint = { source: string; side: "purchase" | "buyback"; price: number; stock: boolean; capturedAt: string; confidence: number; matchReason: string };
export type ProductDetail = { canonicalKey: string; title: string; jan: string; model: string; capacity: string; color: string; history: ProductHistoryPoint[]; decisions: ResearchDecision[]; evaluations: Evaluation[] };
export type PaperTrade = { id: number; canonicalKey: string; title: string; purchaseSource: string; buybackSource: string; purchasePrice: number; lockedCapital: number; entryBuybackPrice: number; entryProfit: number; openedAt: string; closedAt?: string; status: string };
export type ResearchSettings = { initialCapital: number; minimumProfit: number; minimumConfidence: number; saleShipping: number; fees: number; evaluationHours: number[] };
export type EvaluationSchedule = { decisionId: number; canonicalKey: string; title: string; horizonHours: number; dueAt: string; status: string; outcome?: string; profit?: number; decay?: number; decayRate?: number };
export type EvaluatorRun = { id: number; trigger: string; status: string; evaluatedCount: number; message: string; startedAt: string; finishedAt: string };
export type CollectorRun = { id: number; runId: string; source: string; status: string; itemCount: number; message: string; startedAt: string; finishedAt: string };
export type SourceConnection = { source: string; side: "retail" | "buyback"; itemCount: number; lastSuccessAt: string | null; status: "connected" | "configured" };
export type CollectorStatus = { lastRun: CollectorRun | null; runs: CollectorRun[]; sources: SourceConnection[] };

const API = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8787").replace(/\/$/, "");
export class ApiError extends Error { constructor(message: string, public readonly status?: number) { super(message); this.name = "ApiError"; } }

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);
  try {
    const headers = new Headers(init?.headers);
    const response = await fetch(`${API}${path}`, { cache: "no-store", ...init, headers, signal: controller.signal });
    if (!response.ok) {
      let detail = "";
      try { detail = String((await response.json() as { error?: string }).error ?? ""); } catch { /* non-JSON response */ }
      throw new ApiError(detail || `APIがエラーを返しました（${response.status}）`, response.status);
    }
    return await response.json() as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof DOMException && error.name === "AbortError") throw new ApiError("APIの応答がタイムアウトしました");
    throw new ApiError("APIに接続できませんでした。接続先と起動状態を確認してください。");
  } finally { clearTimeout(timeout); }
}
function mutation(method: "POST" | "PUT", body?: unknown): RequestInit {
  const headers: Record<string,string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  return { method, headers, body: body === undefined ? undefined : JSON.stringify(body) };
}
export const getResearchDashboard = () => request<ResearchDashboard>("/api/research/dashboard");
export const getProductDetail = (key: string) => request<ProductDetail>(`/api/research/products/${encodeURIComponent(key)}`);
export const listPaperTrades = () => request<PaperTrade[]>("/api/research/paper-trades");
export const closePaperTrade = (id: number) => request<PaperTrade>(`/api/research/paper-trades/${id}/close`, mutation("POST"));
export const getResearchSettings = () => request<ResearchSettings>("/api/research/settings");
export const saveResearchSettingsData = (settings: ResearchSettings) => request<ResearchSettings>("/api/research/settings", mutation("PUT", settings));
export const getEvaluatorStatus = () => request<{ schedules: EvaluationSchedule[]; runs: EvaluatorRun[] }>("/api/research/evaluator");
export const runEvaluator = () => request<EvaluatorRun>("/api/research/evaluator/run", mutation("POST"));
export const getCollectorStatus = () => request<CollectorStatus>("/api/collector/status?limit=20");
