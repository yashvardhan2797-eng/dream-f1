import { fetchJson, buildUrl } from "../lib/http.js";
import { cache, TTL } from "../lib/cache.js";

const BASE = process.env.OPENF1_BASE_URL || "https://api.openf1.org/v1";

const get = (path, params) => fetchJson(buildUrl(BASE, path, params));

const asList = (value) => (Array.isArray(value) ? value : []);

export function getLatestSession() {
  return cache.get("openf1:session:latest", TTL.SESSION, async () => {
    const [session] = asList(await get("sessions", { session_key: "latest" }));
    if (!session) return null;
    const [meeting] = asList(await get("meetings", { meeting_key: session.meeting_key }));
    const now = Date.now();
    const start = Date.parse(session.date_start);
    const end = Date.parse(session.date_end);
    return {
      sessionKey: session.session_key,
      meetingKey: session.meeting_key,
      name: session.session_name,
      type: session.session_type,
      start: session.date_start,
      end: session.date_end,
      status: now < start ? "upcoming" : now <= end ? "live" : "finished",
      circuit: session.circuit_short_name,
      location: session.location,
      country: session.country_name,
      countryCode: session.country_code,
      year: session.year,
      meeting: meeting
        ? {
            name: meeting.meeting_name,
            officialName: meeting.meeting_official_name,
            circuit: meeting.circuit_short_name,
            start: meeting.date_start,
          }
        : null,
    };
  });
}

export function getDrivers(sessionKey = "latest") {
  return cache.get(`openf1:drivers:${sessionKey}`, TTL.DRIVERS, async () => {
    const drivers = asList(await get("drivers", { session_key: sessionKey }));
    const byNumber = new Map();
    for (const d of drivers) {
      if (d.driver_number == null) continue;
      byNumber.set(d.driver_number, {
        number: d.driver_number,
        code: d.name_acronym,
        fullName: d.full_name,
        firstName: d.first_name,
        lastName: d.last_name,
        broadcastName: d.broadcast_name,
        team: d.team_name,
        teamColour: d.team_colour ? `#${d.team_colour}` : null,
        headshot: d.headshot_url,
        country: d.country_code,
      });
    }
    return [...byNumber.values()].sort((a, b) => a.number - b.number);
  });
}

/** Latest record per driver_number from a time-ordered OpenF1 list. */
function latestPerDriver(rows) {
  const map = new Map();
  for (const row of rows) {
    const prev = map.get(row.driver_number);
    if (!prev || row.date > prev.date) map.set(row.driver_number, row);
  }
  return map;
}

export function getLeaderboard(sessionKey = "latest") {
  return cache.get(`openf1:leaderboard:${sessionKey}`, TTL.LIVE, async () => {
    const [positions, intervals, drivers] = await Promise.all([
      get("position", { session_key: sessionKey }).then(asList),
      get("intervals", { session_key: sessionKey }).then(asList).catch(() => []),
      getDrivers(sessionKey).then((r) => r.data),
    ]);

    const latestPos = latestPerDriver(positions);
    const latestInt = latestPerDriver(intervals);
    const driverMap = new Map(drivers.map((d) => [d.number, d]));

    const rows = [...latestPos.values()]
      .sort((a, b) => a.position - b.position)
      .map((p) => {
        const d = driverMap.get(p.driver_number) || {};
        const i = latestInt.get(p.driver_number) || {};
        return {
          position: p.position,
          number: p.driver_number,
          code: d.code ?? String(p.driver_number),
          name: d.fullName ?? `Car ${p.driver_number}`,
          team: d.team ?? "Unknown",
          teamColour: d.teamColour ?? "#00e5ff",
          headshot: d.headshot ?? null,
          gapToLeader: i.gap_to_leader ?? null,
          interval: i.interval ?? null,
          updatedAt: p.date,
        };
      });

    return { sessionKey, updatedAt: new Date().toISOString(), rows };
  });
}

export function getWeather(sessionKey = "latest") {
  return cache.get(`openf1:weather:${sessionKey}`, TTL.WEATHER, async () => {
    const rows = asList(await get("weather", { session_key: sessionKey }));
    const w = rows.at(-1);
    if (!w) return null;
    return {
      at: w.date,
      airTemp: w.air_temperature,
      trackTemp: w.track_temperature,
      humidity: w.humidity,
      pressure: w.pressure,
      windSpeed: w.wind_speed,
      windDirection: w.wind_direction,
      rainfall: Boolean(w.rainfall),
    };
  });
}

export function getRaceControl(sessionKey = "latest", limit = 25) {
  return cache.get(`openf1:racecontrol:${sessionKey}`, TTL.LIVE, async () => {
    const rows = asList(await get("race_control", { session_key: sessionKey }));
    return rows
      .slice(-limit)
      .reverse()
      .map((r) => ({
        at: r.date,
        lap: r.lap_number,
        category: r.category,
        flag: r.flag,
        scope: r.scope,
        sector: r.sector,
        driverNumber: r.driver_number,
        message: r.message,
      }));
  });
}
