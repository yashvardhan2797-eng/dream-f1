import { useEffect, useState } from "react";
import { api, subscribeLive } from "../api.js";

/**
 * Loads the aggregated dashboard payload once, then keeps leaderboard,
 * weather and race-control fresh via the SSE stream.
 */
export function useLiveData() {
  const [state, setState] = useState({
    session: null,
    leaderboard: null,
    weather: null,
    raceControl: [],
    nextRace: null,
    connection: "connecting",
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    api
      .dashboard()
      .then((data) => !cancelled && setState((s) => ({ ...s, ...data, error: null })))
      .catch((err) => !cancelled && setState((s) => ({ ...s, error: err.message })));

    const unsubscribe = subscribeLive({
      open: () => setState((s) => ({ ...s, connection: "live" })),
      error: () => setState((s) => ({ ...s, connection: "reconnecting" })),
      leaderboard: (leaderboard) => setState((s) => ({ ...s, leaderboard })),
      weather: (weather) => setState((s) => ({ ...s, weather })),
      raceControl: (raceControl) => setState((s) => ({ ...s, raceControl })),
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  return state;
}

export function useStandings() {
  const [drivers, setDrivers] = useState(null);
  const [constructors, setConstructors] = useState(null);

  useEffect(() => {
    api.driverStandings().then(setDrivers).catch(() => setDrivers({ standings: [] }));
    api.constructorStandings().then(setConstructors).catch(() => setConstructors({ standings: [] }));
  }, []);

  return { drivers, constructors };
}
