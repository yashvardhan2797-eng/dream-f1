const BASE = import.meta.env.VITE_API_BASE || "/api";

async function getJson(path) {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`${res.status} ${path}`);
  return res.json();
}

export const api = {
  dashboard: () => getJson("/dashboard"),
  driverStandings: () => getJson("/standings/drivers"),
  constructorStandings: () => getJson("/standings/constructors"),
  nextRace: () => getJson("/schedule/next"),
  schedule: () => getJson("/schedule"),
};

/** Subscribe to the SSE live stream. Returns an unsubscribe function. */
export function subscribeLive(handlers) {
  const source = new EventSource(`${BASE}/live/stream`);
  const { open, error, ...events } = handlers;
  for (const [event, handler] of Object.entries(events)) {
    source.addEventListener(event, (e) => handler(JSON.parse(e.data)));
  }
  source.onerror = () => error?.();
  source.onopen = () => open?.();
  return () => source.close();
}
