import { motion } from "framer-motion";

const FLAG_CLASS = {
  GREEN: "flag-green",
  CLEAR: "flag-green",
  YELLOW: "flag-yellow",
  "DOUBLE YELLOW": "flag-yellow",
  RED: "flag-red",
  CHEQUERED: "flag-cheq",
  BLUE: "flag-blue",
  "BLACK AND WHITE": "flag-white",
};

export default function RaceControlTicker({ messages }) {
  if (!messages?.length) return null;
  const items = [...messages, ...messages];

  return (
    <div className="ticker" aria-label="Race control messages">
      <span className="ticker-label">RACE CONTROL</span>
      <div className="ticker-window">
        <motion.div
          className="ticker-track"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: Math.max(30, messages.length * 6), repeat: Infinity, ease: "linear" }}
        >
          {items.map((m, i) => (
            <span key={i} className={`ticker-item ${FLAG_CLASS[m.flag] ?? ""}`}>
              {m.lap != null && <b>L{m.lap}</b>} {m.message}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
