import { motion } from "framer-motion";

/** Closed-loop circuit path (viewBox 0 0 600 400). Cars animate along it with offsetPath. */
const TRACK =
  "M 90 200 C 90 110, 170 70, 260 80 S 400 40, 470 90 S 540 210, 480 260 S 400 330, 320 300 S 200 330, 150 300 S 90 280, 90 200 Z";

const CARS = [
  { colour: "#FF8000", duration: 9, delay: 0 },
  { colour: "#27F4D2", duration: 9.4, delay: -1.6 },
  { colour: "#E8002D", duration: 9.8, delay: -3.1 },
  { colour: "#3671C6", duration: 10.3, delay: -4.9 },
  { colour: "#64C4FF", duration: 10.7, delay: -6.2 },
];

export default function RaceTrack({ leader }) {
  const leadColour = leader?.teamColour ?? CARS[0].colour;

  return (
    <div className="racetrack">
      <svg viewBox="0 0 600 400" className="racetrack-svg">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path d={TRACK} className="track-outer" />
        <motion.path
          d={TRACK}
          className="track-inner"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.2, ease: "easeInOut" }}
        />
        <motion.path
          d={TRACK}
          className="track-pulse"
          style={{ stroke: leadColour }}
          animate={{ strokeDashoffset: [0, -1200] }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        />
        <line x1="86" y1="180" x2="94" y2="220" className="start-line" />
      </svg>

      {CARS.map((car, i) => (
        <motion.span
          key={i}
          className="car"
          style={{
            offsetPath: `path("${TRACK}")`,
            background: i === 0 ? leadColour : car.colour,
            boxShadow: `0 0 14px ${i === 0 ? leadColour : car.colour}`,
          }}
          initial={{ offsetDistance: "0%" }}
          animate={{ offsetDistance: "100%" }}
          transition={{ duration: car.duration, delay: car.delay, repeat: Infinity, ease: "linear" }}
        />
      ))}

      {leader && (
        <motion.div
          className="racetrack-leader"
          key={leader.number}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="label">LEADER</span>
          <span className="value" style={{ color: leadColour }}>
            {leader.code} · {leader.team}
          </span>
        </motion.div>
      )}
    </div>
  );
}
