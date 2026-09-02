import Background from "./components/Background.jsx";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import LiveLeaderboard from "./components/LiveLeaderboard.jsx";
import RaceControlTicker from "./components/RaceControlTicker.jsx";
import Weather from "./components/Weather.jsx";
import NextRace from "./components/NextRace.jsx";
import Standings from "./components/Standings.jsx";
import { useLiveData, useStandings } from "./hooks/useLiveData.js";

export default function App() {
  const live = useLiveData();
  const standings = useStandings();

  return (
    <>
      <Background />
      <Navbar connection={live.connection} />
      <main>
        <Hero session={live.session} nextRace={live.nextRace} leader={live.leaderboard?.rows?.[0]} />
        <RaceControlTicker messages={live.raceControl} />

        <section id="live" className="container section">
          <div className="grid-live">
            <LiveLeaderboard session={live.session} leaderboard={live.leaderboard} error={live.error} />
            <div className="stack">
              <Weather weather={live.weather} />
              <NextRace race={live.nextRace} />
            </div>
          </div>
        </section>

        <section id="standings" className="container section">
          <Standings drivers={standings.drivers} constructors={standings.constructors} />
        </section>
      </main>
      <footer className="footer container">
        <span>FORMULA FAN</span>
        <span>Data: OpenF1 · Jolpica · Node.js API</span>
      </footer>
    </>
  );
}
