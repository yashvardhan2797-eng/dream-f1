import { AnimatePresence, motion } from "framer-motion";
import { circuitImage } from "../circuits.js";

function formatGap(value, position) {
  if (position === 1) return "LEADER";
  if (value == null) return "—";
  if (typeof value === "string") return value;
  return `+${value.toFixed(3)}`;
}

export default function LiveLeaderboard({ session, leaderboard, error }) {
  const rows = leaderboard?.rows ?? [];
  const layout = session ? circuitImage(session.circuit, session.location, session.country) : null;

  return (
    <div className="panel leaderboard">
      <div className="panel-head">
        <h2>
          <span className="flag-icon" /> LIVE TIMING
        </h2>
        {session && (
          <span className="panel-sub">
            {session.meeting?.name ?? session.circuit} · {session.name}
          </span>
        )}
      </div>

      {layout && (
        <motion.div
          className="lb-circuit"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <img src={layout} alt={`${session.circuit} layout`} />
          <span>
            {session.circuit} · {session.country}
          </span>
        </motion.div>
      )}

      {error && rows.length === 0 && <p className="error">Timing unavailable: {error}</p>}
      {!error && rows.length === 0 && <div className="skeleton-list" />}

      <ol className="lb-list">
        <AnimatePresence initial={false}>
          {rows.map((row) => (
            <motion.li
              key={row.number}
              layout
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
              className="lb-row"
              style={{ "--team": row.teamColour }}
            >
              <span className="lb-pos">{row.position}</span>
              <span className="lb-bar" />
              <span className="lb-code">{row.code}</span>
              <span className="lb-name">
                {row.name}
                <small>{row.team}</small>
              </span>
              <motion.span
                className="lb-gap"
                key={`${row.number}-${row.gapToLeader}`}
                initial={{ opacity: 0.3 }}
                animate={{ opacity: 1 }}
              >
                {formatGap(row.gapToLeader, row.position)}
              </motion.span>
              <span className="lb-int">{row.position === 1 ? "" : formatGap(row.interval, 0)}</span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ol>

      {leaderboard && (
        <p className="panel-foot">Updated {new Date(leaderboard.updatedAt).toLocaleTimeString()}</p>
      )}
    </div>
  );
}
