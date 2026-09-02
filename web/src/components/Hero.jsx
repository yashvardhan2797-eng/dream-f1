import { motion } from "framer-motion";
import RaceTrack from "./RaceTrack.jsx";

const words = ["THE", "ULTIMATE", "MOTORSPORT", "INTELLIGENCE", "PLATFORM"];

export default function Hero({ session, nextRace, leader }) {
  const statusLabel = session
    ? session.status === "live"
      ? `LIVE · ${session.meeting?.name ?? session.circuit} · ${session.name}`
      : session.status === "upcoming"
        ? `NEXT UP · ${session.meeting?.name ?? session.circuit} · ${session.name}`
        : `LAST SESSION · ${session.meeting?.name ?? session.circuit} · ${session.name}`
    : "CONNECTING TO TIMING…";

  return (
    <section id="top" className="hero container">
      <div className="hero-copy">
        <motion.p
          className="hero-tag"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          REAL-TIME MOTORSPORT ANALYTICS
        </motion.p>

        <h1 className="hero-title">
          {words.map((w, i) => (
            <motion.span
              key={w}
              className={i === 2 || i === 4 ? "accent" : undefined}
              initial={{ opacity: 0, y: 40, skewX: -12 }}
              animate={{ opacity: 1, y: 0, skewX: 0 }}
              transition={{ delay: 0.35 + i * 0.09, type: "spring", stiffness: 140, damping: 16 }}
            >
              {w}
            </motion.span>
          ))}
        </h1>

        <motion.p
          className="hero-description"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          Live timing, standings, track conditions and race control — streamed from a Node.js
          backend and animated in real time.
        </motion.p>

        <motion.div
          className="hero-status"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05 }}
        >
          <span className={`pulse ${session?.status === "live" ? "pulse-live" : ""}`} />
          {statusLabel}
        </motion.div>

        <motion.div
          className="hero-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <motion.a href="#live" className="btn btn-primary" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            ENTER MISSION CONTROL
          </motion.a>
          {nextRace && (
            <a href="#next" className="btn btn-ghost">
              NEXT: {nextRace.name.toUpperCase()}
            </a>
          )}
        </motion.div>
      </div>

      <motion.div
        className="hero-visual"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <RaceTrack leader={leader} />
      </motion.div>
    </section>
  );
}
