import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";

async function withApi(handler, run) {
  const server = http.createServer(handler);
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address();
  process.env.NEXT_PUBLIC_API_URL = `http://127.0.0.1:${port}/`;
  globalThis.window = {};
  try {
    const api = await import(`../lib/api.ts?case=${Math.random()}`);
    await run(api);
  } finally { delete globalThis.window; await new Promise(resolve => server.close(resolve)); }
}

test("dashboard uses the display API and accepts its payload", async () => {
  const payload = { portfolio: { initialCapital: 300000, lockedCapital: 0, availableCash: 300000, openTrades: 0 }, opportunities: [], decisions: [], metrics48h: { evaluated: 0, buyCount: 0, precision: 0, recall: 0, missedOpportunities: 0, averageProfit: 0, maximumLoss: 0 } };
  await withApi((req, res) => { assert.equal(req.url, "/api/research/dashboard"); assert.equal(req.headers.authorization, undefined); res.setHeader("content-type", "application/json"); res.end(JSON.stringify(payload)); }, async api => assert.deepEqual(await api.getResearchDashboard(), payload));
});

test("paper trade close posts to the dedicated action endpoint", async () => {
  await withApi((req, res) => { assert.equal(req.method, "POST"); assert.equal(req.url, "/api/research/paper-trades/42/close"); assert.equal(req.headers.authorization, undefined); res.setHeader("content-type", "application/json"); res.end(JSON.stringify({ id: 42, status: "closed" })); }, async api => assert.equal((await api.closePaperTrade(42)).status, "closed"));
});

test("401 errors retain the backend message", async () => {
  await withApi((_req, res) => { res.statusCode = 401; res.setHeader("content-type", "application/json"); res.end(JSON.stringify({ error: "unauthorized" })); }, async api => await assert.rejects(api.runEvaluator(), error => error.status === 401 && error.message === "unauthorized"));
});

test("API errors retain the backend message and status", async () => {
  await withApi((_req, res) => { res.statusCode = 400; res.setHeader("content-type", "application/json"); res.end(JSON.stringify({ error: "invalid settings" })); }, async api => await assert.rejects(api.getResearchSettings(), error => error.name === "ApiError" && error.status === 400 && error.message === "invalid settings"));
});
