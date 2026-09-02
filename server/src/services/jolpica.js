import { fetchJson, buildUrl } from "../lib/http.js";
import { cache, TTL } from "../lib/cache.js";

const BASE = process.env.JOLPICA_BASE_URL || "https://api.jolpi.ca/ergast/f1";

async function ergast(path) {
  const data = await fetchJson(buildUrl(BASE, `${path}.json`));
  return data.MRData;
}

export function getDriverStandings(season = "current") {
  return cache.get(`jolpica:drivers:${season}`, TTL.STANDINGS, async () => {
    const mr = await ergast(`${season}/driverStandings`);
    const list = mr.StandingsTable.StandingsLists[0] || {};
    return {
      season: list.season,
      round: list.round,
      standings: (list.DriverStandings || []).map((row) => ({
        position: Number(row.position),
        points: Number(row.points),
        wins: Number(row.wins),
        driverId: row.Driver.driverId,
        code: row.Driver.code,
        number: row.Driver.permanentNumber ? Number(row.Driver.permanentNumber) : null,
        givenName: row.Driver.givenName,
        familyName: row.Driver.familyName,
        nationality: row.Driver.nationality,
        team: row.Constructors[0]?.name ?? "Unknown",
        teamId: row.Constructors[0]?.constructorId ?? null,
      })),
    };
  });
}

export function getConstructorStandings(season = "current") {
  return cache.get(`jolpica:constructors:${season}`, TTL.STANDINGS, async () => {
    const mr = await ergast(`${season}/constructorStandings`);
    const list = mr.StandingsTable.StandingsLists[0] || {};
    return {
      season: list.season,
      round: list.round,
      standings: (list.ConstructorStandings || []).map((row) => ({
        position: Number(row.position),
        points: Number(row.points),
        wins: Number(row.wins),
        teamId: row.Constructor.constructorId,
        team: row.Constructor.name,
        nationality: row.Constructor.nationality,
      })),
    };
  });
}

function mapRace(race) {
  if (!race) return null;
  const sessions = [];
  const push = (label, s) => s && sessions.push({ label, start: `${s.date}T${s.time ?? "00:00:00Z"}` });
  push("Practice 1", race.FirstPractice);
  push("Practice 2", race.SecondPractice);
  push("Practice 3", race.ThirdPractice);
  push("Sprint Qualifying", race.SprintQualifying ?? race.SprintShootout);
  push("Sprint", race.Sprint);
  push("Qualifying", race.Qualifying);
  push("Race", { date: race.date, time: race.time });
  sessions.sort((a, b) => a.start.localeCompare(b.start));
  return {
    season: race.season,
    round: Number(race.round),
    name: race.raceName,
    circuitId: race.Circuit.circuitId,
    circuit: race.Circuit.circuitName,
    locality: race.Circuit.Location.locality,
    country: race.Circuit.Location.country,
    lat: Number(race.Circuit.Location.lat),
    lng: Number(race.Circuit.Location.long),
    date: race.date,
    time: race.time ?? null,
    sessions,
  };
}

export function getNextRace() {
  return cache.get("jolpica:next", TTL.SCHEDULE, async () => {
    const mr = await ergast("current/next");
    return mapRace(mr.RaceTable.Races[0]);
  });
}

export function getSchedule(season = "current") {
  return cache.get(`jolpica:schedule:${season}`, TTL.SCHEDULE, async () => {
    const mr = await ergast(season);
    return { season: mr.RaceTable.season, races: mr.RaceTable.Races.map(mapRace) };
  });
}
