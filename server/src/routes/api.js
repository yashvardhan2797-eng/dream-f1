import { Router } from "express";
import * as jolpica from "../services/jolpica.js";
import * as openf1 from "../services/openf1.js";

export const api = Router();

/** Wrap a cache-backed loader into an express handler with stale-flag headers. */
const send = (loader) => async (req, res, next) => {
  try {
    const { data, stale } = await loader(req);
    if (stale) res.set("x-data-stale", "true");
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const season = (req) => req.query.season || "current";
const sessionKey = (req) => req.query.session || "latest";

api.get("/health", (_req, res) =>
  res.json({ application: "Formula Fan", runtime: "node", status: "ok", version: "0.1.0", time: new Date().toISOString() }),
);

api.get("/standings/drivers", send((req) => jolpica.getDriverStandings(season(req))));
api.get("/standings/constructors", send((req) => jolpica.getConstructorStandings(season(req))));
api.get("/schedule", send((req) => jolpica.getSchedule(season(req))));
api.get("/schedule/next", send(() => jolpica.getNextRace()));

api.get("/session/latest", send(() => openf1.getLatestSession()));
api.get("/session/drivers", send((req) => openf1.getDrivers(sessionKey(req))));
api.get("/live/leaderboard", send((req) => openf1.getLeaderboard(sessionKey(req))));
api.get("/live/weather", send((req) => openf1.getWeather(sessionKey(req))));
api.get("/live/race-control", send((req) => openf1.getRaceControl(sessionKey(req))));

/** Aggregated payload for the dashboard first paint. */
api.get(
  "/dashboard",
  send(async () => {
    const [session, leaderboard, weather, raceControl, nextRace] = await Promise.allSettled([
      openf1.getLatestSession(),
      openf1.getLeaderboard(),
      openf1.getWeather(),
      openf1.getRaceControl(),
      jolpica.getNextRace(),
    ]);
    const pick = (r) => (r.status === "fulfilled" ? r.value.data : null);
    return {
      data: {
        session: pick(session),
        leaderboard: pick(leaderboard),
        weather: pick(weather),
        raceControl: pick(raceControl) ?? [],
        nextRace: pick(nextRace),
      },
      stale: [session, leaderboard, weather, raceControl, nextRace].some(
        (r) => r.status === "rejected" || r.value?.stale,
      ),
    };
  }),
);

/**
 * Server-Sent Events stream. Pushes leaderboard/weather/race-control snapshots
 * every LIVE_INTERVAL_MS so the frontend can animate position changes.
 */
const LIVE_INTERVAL_MS = Number(process.env.LIVE_INTERVAL_MS || 5000);

api.get("/live/stream", (req, res) => {
  res.set({
    "content-type": "text/event-stream",
    "cache-control": "no-cache, no-transform",
    connection: "keep-alive",
    "x-accel-buffering": "no",
  });
  res.flushHeaders();

  const key = sessionKey(req);
  let closed = false;

  const emit = (event, payload) => {
    if (closed) return;
    res.write(`event: ${event}\ndata: ${JSON.stringify(payload)}\n\n`);
  };

  const tick = async () => {
    const [leaderboard, weather, raceControl] = await Promise.allSettled([
      openf1.getLeaderboard(key),
      openf1.getWeather(key),
      openf1.getRaceControl(key),
    ]);
    if (leaderboard.status === "fulfilled") emit("leaderboard", leaderboard.value.data);
    if (weather.status === "fulfilled") emit("weather", weather.value.data);
    if (raceControl.status === "fulfilled") emit("raceControl", raceControl.value.data);
    emit("heartbeat", { at: new Date().toISOString() });
  };

  tick();
  const timer = setInterval(tick, LIVE_INTERVAL_MS);

  req.on("close", () => {
    closed = true;
    clearInterval(timer);
  });
});
