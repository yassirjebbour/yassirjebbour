# BAWSALA — Performance report (2026-11-02)

Environment: production build (`next start`), local PostgreSQL 16, same machine (no network latency to the DB),
Chromium via Playwright. Page metrics on a Pixel-sized viewport (390×844) with throttling of 150 ms latency,
1.6 Mbit/s down, 750 kbit/s up ("fast 3G"), fresh browser context per page (no cache).

## Pages

| Page | TTFB | FCP | LCP | JS transferred | Total transferred |
|---|---|---|---|---|---|
| `/` (landing) | 31 ms | 436 ms | 436 ms | 151 KB | 398 KB |
| `/app` (dashboard) | 40 ms | 408 ms | 408 ms | 152 KB | 335 KB |
| `/app/passport` | 22 ms | 404 ms | 404 ms | 154 KB | 338 KB |
| `/app/assistant` | 35 ms | 408 ms | 408 ms | 199 KB | 383 KB |

Total transfer includes the self-hosted IBM Plex / Plex Arabic / Noto Tifinagh subsets (only the scripts used on the
page are downloaded thanks to `unicode-range`). Built static chunks: 960 KB uncompressed in total, code-split per route.

## API (median of 5, warm, signed-in)

| Endpoint | Median |
|---|---|
| `GET /api/v1/opportunities` (ranking with fit) | 7 ms |
| `GET /api/v1/passport` | 5 ms |
| `GET /api/v1/progress` | 5 ms |
| `GET /api/v1/conversations` | 5 ms |
| `POST /api/v1/try` (rules engine) | 4–8 ms (20 ms first call) |
| `GET /api/v1/search` (hybrid RAG, warm) | 29–59 ms |
| `GET /api/v1/search` (first call after start: loads the embedding model) | 1,054 ms |
| `POST /api/v1/chat` basic engine, complete SSE stream | 39 ms |

Server memory after the embedding model is loaded: ~650 MB RSS.

## Objectives for the pilot (set, not yet monitored in production)

| Objective | Target |
|---|---|
| LCP on mobile, fast 3G | < 2.5 s (measured 0.40–0.44 s locally; add real network/DB latency in production) |
| API p95 for non-AI endpoints | < 300 ms |
| Retrieval p95 | < 250 ms |
| Assistant time-to-first-token (LLM) | < 2.5 s — **not measured (no key)** |

## Optimisations in place

Server components by default (small client islands); route-level code splitting; self-hosted subset fonts with
`font-display: swap`; no image-heavy UI (SVG brand assets); database indexes for every per-user list query, HNSW for
vectors, GIN for full-text/trigram; skill catalogue cached in memory (5 min); feature flags cached (15 s); embedding
model loaded once per process; prompt caching on the LLM system prompt; SSE streaming for the assistant.

## Known performance risks

- Cold start of the embedding model (~1 s) on the first search after deploy — mitigate by a warm-up request in the
  release step (`curl /api/v1/search?q=warmup`).
- The model and ONNX runtime need ~650 MB RAM; choose an instance with ≥1 GB.
- Ranking loads all published opportunities per request — fine up to a few thousand; add SQL-side pre-filtering by
  skills beyond that.
- Not measured: real network latency to a managed database, concurrency/load, LLM latency.
