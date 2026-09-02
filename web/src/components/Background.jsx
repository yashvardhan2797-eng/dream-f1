import { motion } from "framer-motion";

const LINES = Array.from({ length: 14 }, (_, i) => ({
  top: `${6 + i * 6.5}%`,
  delay: i * 0.37,
  duration: 2.6 + (i % 5) * 0.55,
  width: 120 + (i % 4) * 90,
}));

export default function Background() {
  return (
    <div className="bg" aria-hidden="true">
      <div className="bg-grid" />
      <motion.div
        className="bg-glow bg-glow-red"
        animate={{ x: [0, 120, -60, 0], y: [0, -80, 60, 0], scale: [1, 1.15, 0.95, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="bg-glow bg-glow-cyan"
        animate={{ x: [0, -140, 80, 0], y: [0, 90, -70, 0], scale: [1, 0.9, 1.2, 1] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />
      {LINES.map((line, i) => (
        <motion.span
          key={i}
          className="bg-speedline"
          style={{ top: line.top, width: line.width }}
          initial={{ x: "-30vw", opacity: 0 }}
          animate={{ x: "130vw", opacity: [0, 0.8, 0] }}
          transition={{ duration: line.duration, delay: line.delay, repeat: Infinity, ease: "linear" }}
        />
      ))}
    </div>
  );
}
