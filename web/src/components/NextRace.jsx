import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { circuitImage } from "../circuits.js";

function useCountdown(target) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, (target ? Date.parse(target) : now) - now);
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function Digit({ value, label }) {
  const text = String(value).padStart(2, "0");
  return (
    <div className="digit">
      <div className="digit-window">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={text}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            {text}
          </motion.span>
        </AnimatePresence>
      </div>
      <small>{label}</small>
    </div>
  );
}

export default function NextRace({ race }) {
  const nextSession = race?.sessions.find((s) => Date.parse(s.start) > Date.now()) ?? race?.sessions.at(-1);
  const cd = useCountdown(nextSession?.start);
  const layout = race ? circuitImage(race.circuitId, race.locality, race.country) : null;

  return (
    <motion.div
      id="next"
      className="panel next-race"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className="panel-head">
        <h2>NEXT RACE</h2>
        {race && <span className="chip">ROUND {race.round}</span>}
      </div>
      {!race ? (
        <div className="skeleton-list short" />
      ) : (
        <>
          <h3 className="next-name">{race.name}</h3>
          <p className="next-circuit">
            {race.circuit} · {race.locality}, {race.country}
          </p>
          {layout && (
            <motion.img
              className="circuit-layout"
              src={layout}
              alt={`${race.circuit} layout`}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
            />
          )}
          <p className="next-session">{nextSession?.label ?? "Race"}</p>
          <div className="countdown">
            <Digit value={cd.days} label="DAYS" />
            <Digit value={cd.hours} label="HRS" />
            <Digit value={cd.minutes} label="MIN" />
            <Digit value={cd.seconds} label="SEC" />
          </div>
          <ul className="session-list">
            {race.sessions.map((s) => (
              <li key={s.label} className={s === nextSession ? "is-next" : Date.parse(s.start) < Date.now() ? "is-done" : ""}>
                <span>{s.label}</span>
                <span>{new Date(s.start).toLocaleString(undefined, { weekday: "short", hour: "2-digit", minute: "2-digit" })}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </motion.div>
  );
}
