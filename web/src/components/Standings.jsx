import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { teamColour } from "../teams.js";

const list = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = {
  hidden: { opacity: 0, x: -30 },
  show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 200, damping: 24 } },
};

function Bars({ rows, nameOf, subOf, colourOf }) {
  const max = rows[0]?.points || 1;
  return (
    <motion.ol className="st-list" variants={list} initial="hidden" animate="show" key={rows.length}>
      {rows.map((r) => (
        <motion.li key={r.driverId ?? r.teamId} className="st-row" variants={item} whileHover={{ x: 6 }}>
          <span className="st-pos">{r.position}</span>
          <div className="st-body">
            <div className="st-line">
              <span className="st-name" style={{ color: colourOf(r) }}>
                {nameOf(r)}
              </span>
              <span className="st-sub">{subOf(r)}</span>
              <span className="st-points">
                {r.points} <small>PTS</small>
              </span>
            </div>
            <div className="st-track">
              <motion.div
                className="st-fill"
                style={{ background: colourOf(r) }}
                initial={{ width: 0 }}
                animate={{ width: `${(r.points / max) * 100}%` }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </div>
          {r.wins > 0 && <span className="st-wins">{r.wins}W</span>}
        </motion.li>
      ))}
    </motion.ol>
  );
}

export default function Standings({ drivers, constructors }) {
  const [tab, setTab] = useState("drivers");
  const data = tab === "drivers" ? drivers : constructors;

  return (
    <div className="panel standings">
      <div className="panel-head">
        <h2>CHAMPIONSHIP {data?.season ?? ""}</h2>
        <div className="tabs">
          {["drivers", "constructors"].map((t) => (
            <button key={t} className={tab === t ? "active" : ""} onClick={() => setTab(t)}>
              {t.toUpperCase()}
              {tab === t && <motion.span layoutId="tab-underline" className="tab-underline" />}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          {!data ? (
            <div className="skeleton-list" />
          ) : tab === "drivers" ? (
            <Bars
              rows={data.standings}
              nameOf={(r) => `${r.givenName} ${r.familyName}`}
              subOf={(r) => r.team}
              colourOf={(r) => teamColour(r.teamId ?? r.team)}
            />
          ) : (
            <Bars
              rows={data.standings}
              nameOf={(r) => r.team}
              subOf={(r) => r.nationality}
              colourOf={(r) => teamColour(r.teamId ?? r.team)}
            />
          )}
        </motion.div>
      </AnimatePresence>
      {data?.round && <p className="panel-foot">After round {data.round}</p>}
    </div>
  );
}
