import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api } from "../api.js";
import { circuitImage } from "../circuits.js";

export default function Calendar() {
  const [schedule, setSchedule] = useState(null);

  useEffect(() => {
    api.schedule().then(setSchedule).catch(() => setSchedule({ races: [] }));
  }, []);

  const now = Date.now();
  const nextRound = schedule?.races.find((r) => Date.parse(`${r.date}T${r.time ?? "00:00:00Z"}`) > now)?.round;

  return (
    <div className="panel calendar">
      <div className="panel-head">
        <h2>{schedule?.season ?? ""} CALENDAR · CIRCUIT LAYOUTS</h2>
        {schedule && <span className="chip">{schedule.races.length} ROUNDS</span>}
      </div>
      {!schedule ? (
        <div className="skeleton-list" />
      ) : (
        <div className="cal-grid">
          {schedule.races.map((race, i) => {
            const img = circuitImage(race.circuitId, race.locality, race.country);
            const state = race.round === nextRound ? "is-next" : race.round < (nextRound ?? Infinity) ? "is-done" : "";
            return (
              <motion.article
                key={race.round}
                className={`cal-card ${state}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: (i % 4) * 0.06 }}
                whileHover={{ y: -6, scale: 1.02 }}
              >
                <div className="cal-img">
                  {img ? <img src={img} alt={`${race.circuit} layout`} loading="lazy" /> : <span className="cal-noimg">NO LAYOUT</span>}
                </div>
                <div className="cal-body">
                  <span className="cal-round">R{race.round}</span>
                  <h3>{race.name}</h3>
                  <p>{race.circuit}</p>
                  <small>
                    {new Date(`${race.date}T${race.time ?? "00:00:00Z"}`).toLocaleDateString(undefined, {
                      day: "numeric",
                      month: "short",
                    })}
                    {state === "is-next" && <b> · NEXT</b>}
                  </small>
                </div>
              </motion.article>
            );
          })}
        </div>
      )}
    </div>
  );
}
