import { motion } from "framer-motion";

function Gauge({ label, value, unit, max, colour }) {
  const pct = value == null ? 0 : Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="gauge">
      <div className="gauge-head">
        <span>{label}</span>
        <motion.b key={value} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}>
          {value == null ? "—" : `${value}${unit}`}
        </motion.b>
      </div>
      <div className="gauge-track">
        <motion.div
          className="gauge-fill"
          style={{ background: colour }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 60, damping: 18 }}
        />
      </div>
    </div>
  );
}

export default function Weather({ weather }) {
  return (
    <motion.div
      className="panel weather"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className="panel-head">
        <h2>TRACK CONDITIONS</h2>
        {weather && (
          <span className={`chip ${weather.rainfall ? "chip-wet" : "chip-dry"}`}>
            {weather.rainfall ? "WET" : "DRY"}
          </span>
        )}
      </div>
      <Gauge label="Track temp" value={weather?.trackTemp} unit="°C" max={60} colour="#ff5a36" />
      <Gauge label="Air temp" value={weather?.airTemp} unit="°C" max={45} colour="#ffb020" />
      <Gauge label="Humidity" value={weather?.humidity} unit="%" max={100} colour="#00b4ff" />
      <Gauge label="Wind" value={weather?.windSpeed} unit=" m/s" max={15} colour="#27f4d2" />
      {weather && (
        <div className="wind">
          <motion.span
            className="wind-arrow"
            animate={{ rotate: weather.windDirection ?? 0 }}
            transition={{ type: "spring", stiffness: 40 }}
          >
            ➤
          </motion.span>
          <span>{weather.windDirection}° · {weather.pressure} hPa</span>
        </div>
      )}
    </motion.div>
  );
}
