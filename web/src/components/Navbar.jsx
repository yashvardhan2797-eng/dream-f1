import { motion } from "framer-motion";

const LABEL = { live: "LIVE FEED", connecting: "CONNECTING", reconnecting: "RECONNECTING" };

export default function Navbar({ connection }) {
  return (
    <motion.header
      className="navbar"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container navbar-inner">
        <a href="#top" className="logo">
          <span className="logo-mark" />
          FORMULA <span>FAN</span>
        </a>
        <nav className="nav-links">
          <a href="#live">Live</a>
          <a href="#calendar">Circuits</a>
          <a href="#standings">Standings</a>
          <a href="#next">Next Race</a>
        </nav>
        <div className={`status-badge status-${connection}`}>
          <span className="status-dot" />
          {LABEL[connection] ?? connection.toUpperCase()}
        </div>
      </div>
    </motion.header>
  );
}
