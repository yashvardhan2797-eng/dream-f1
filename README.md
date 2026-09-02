# 🏎️ Formula Fan

Formula Fan is a full-stack motorsport companion platform built to help Formula 1 fans understand, analyze, and follow races through live telemetry, AI-powered insights, analytics, and interactive visualizations.

## Status

🚧 Currently in Development

Version: v0.1.0

## Node.js Stack (server/ + web/)

A Node.js backend and an animated React frontend live alongside the original Flask API.

```bash
npm run install:all      # installs server/ and web/ dependencies
npm run dev:server       # Express API on http://localhost:4000 (auto-reload)
npm run dev:web          # Vite dev server on http://localhost:5173 (proxies /api → :4000)

npm run build && npm start   # production: Express serves web/dist + /api on :4000
```

API (all under `/api`):

| Endpoint | Source | Notes |
| --- | --- | --- |
| `GET /health` | – | liveness |
| `GET /standings/drivers?season=current` | Jolpica | normalised driver standings |
| `GET /standings/constructors?season=current` | Jolpica | normalised constructor standings |
| `GET /schedule`, `GET /schedule/next` | Jolpica | calendar + next round with session times |
| `GET /session/latest` | OpenF1 | latest session + meeting, `status` = upcoming/live/finished |
| `GET /session/drivers?session=latest` | OpenF1 | driver roster with team colours |
| `GET /live/leaderboard` | OpenF1 | positions merged with gaps/intervals |
| `GET /live/weather`, `GET /live/race-control` | OpenF1 | latest track conditions / RC messages |
| `GET /dashboard` | both | aggregated first-paint payload |
| `GET /live/stream` | both | Server-Sent Events: `leaderboard`, `weather`, `raceControl`, `heartbeat` |

Responses are cached per endpoint with a TTL; if an upstream API fails the last good
value is returned with an `x-data-stale: true` header. Env vars: `PORT`,
`LIVE_INTERVAL_MS`, `UPSTREAM_TIMEOUT_MS`, `OPENF1_BASE_URL`, `JOLPICA_BASE_URL`.

## Tech Stack

- Node.js / Express (API + SSE)
- React + Vite + Framer Motion (animated frontend)

- Python
- Flask
- HTML
- CSS
- JavaScript
- Bootstrap
- Chart.js
- OpenF1 API
- Jolpica API

Developer

Yashvardhan Rathore
