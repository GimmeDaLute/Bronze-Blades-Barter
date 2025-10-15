import React, { useMemo, useState } from "react";
import {
  createCombat,
  Outcome,
  GeneralLevels,
  Conditions,
} from "../battler/index.js";

export default function CombatPage() {
  // Thin host: all rules live in /src/game/**
  const combat = useMemo(() => createCombat(), []);

  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  // Selections
  const [playerGen, setPlayerGen] = useState("none");
  const [enemyGen, setEnemyGen] = useState("none");
  const [pConds, setPConds] = useState([]); // player condition keys
  const [eConds, setEConds] = useState([]); // enemy condition keys

  // Mutual exclusion only for posture conditions
  const postureMutex = ["attacker", "defender"];

  function toggle(list, setList, key, { mutex } = {}) {
    setList((prev) => {
      let next = prev.includes(key)
        ? prev.filter((k) => k !== key)
        : [...prev, key];

      if (mutex && next.includes(key)) {
        // keep chosen key; drop its mutex peers
        next = next.filter((k) => !mutex.includes(k) || k === key);
      }
      return Array.from(new Set(next));
    });
  }

  function fight() {
    const r = combat.fightOnce({
      playerGeneral: playerGen,
      enemyGeneral: enemyGen,
      playerConditions: pConds,
      enemyConditions: eConds,
      // no criticals in engine now; totals decide outcome
    });
    setResult(r);
    setHistory((h) => [{ t: Date.now(), ...r }, ...h].slice(0, 20));
  }

  return (
    <div className="page">
      <h1>⚔️ Combat (d6 vs d6)</h1>

      {/* Generals */}
      <div className="card">
        <div className="row">
          <label>Player General:&nbsp;</label>
          <select
            className="input"
            value={playerGen}
            onChange={(e) => setPlayerGen(e.target.value)}
          >
            {GeneralLevels.map((g) => (
              <option key={g.key} value={g.key}>
                {g.label}
              </option>
            ))}
          </select>

          <label style={{ marginLeft: 12 }}>Enemy General:&nbsp;</label>
          <select
            className="input"
            value={enemyGen}
            onChange={(e) => setEnemyGen(e.target.value)}
          >
            {GeneralLevels.map((g) => (
              <option key={g.key} value={g.key}>
                {g.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Dynamic Conditions from game layer */}
      <div className="card">
        <h3 style={{ margin: 0 }}>Battle Conditions</h3>

        {/* Player side */}
        <div className="row wrap" style={{ gap: 8 }}>
          <strong>Player:</strong>
          {Conditions.map((c) => (
            <Toggle
              key={`p_${c.key}`}
              active={pConds.includes(c.key)}
              onClick={() =>
                toggle(pConds, setPConds, c.key, {
                  mutex: postureMutex.includes(c.key) ? postureMutex : undefined,
                })
              }
              title={effectLabel(c)}
            >
              {c.label}
              {effectSuffix(c)}
            </Toggle>
          ))}
        </div>

        {/* Enemy side */}
        <div className="row wrap" style={{ gap: 8, marginTop: 8 }}>
          <strong>Enemy:</strong>
          {Conditions.map((c) => (
            <Toggle
              key={`e_${c.key}`}
              active={eConds.includes(c.key)}
              onClick={() =>
                toggle(eConds, setEConds, c.key, {
                  mutex: postureMutex.includes(c.key) ? postureMutex : undefined,
                })
              }
              title={effectLabel(c)}
            >
              {c.label}
              {effectSuffix(c)}
            </Toggle>
          ))}
        </div>
      </div>

      {/* Result */}
      {result ? (
        <div className="card">
          <div>
            You rolled: <b>{result.playerRoll}</b> (mod {signed(result.playerMod)}) ={" "}
            <b>{result.playerTotal}</b>
          </div>
          <div>
            Enemy rolled: <b>{result.enemyRoll}</b> (mod {signed(result.enemyMod)}) ={" "}
            <b>{result.enemyTotal}</b>
          </div>
          <OutcomeBadge outcome={result.outcome} reason={result.reason} />
          <p className="muted small">
            Outcome is decided purely by modified totals — no critical auto-wins or losses.
          </p>
        </div>
      ) : (
        <p className="muted">Pick generals/conditions and click fight.</p>
      )}

      <button className="btn" onClick={fight}>
        {result ? "Fight again" : "Start fight"}
      </button>

      {/* History */}
      <div className="card">
        <h3 style={{ margin: 0 }}>Recent Rounds</h3>
        {history.length === 0 && <div className="muted">No rounds yet.</div>}
        {history.map((h, i) => (
          <div key={i} className="row" style={{ justifyContent: "space-between" }}>
            <span>{new Date(h.t).toLocaleTimeString()}</span>
            <span>
              Y:{h.playerTotal} (roll {h.playerRoll}) • E:{h.enemyTotal} (roll {h.enemyRoll})
            </span>
            <span>
              <small>
                <OutcomeLabel o={h.outcome} />
              </small>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- small UI helpers ---------- */

function Toggle({ active, onClick, children, title }) {
  return (
    <button
      onClick={onClick}
      className="btn"
      title={title}
      style={{
        background: active ? "#2563eb" : "#1f2937",
        border: "1px solid #1f2937",
      }}
    >
      {children}
    </button>
  );
}

function effectSuffix(c) {
  const parts = [];
  if (c.bonus) parts.push(c.bonus > 0 ? `+${c.bonus}` : `${c.bonus}`);
  if (c.mode === "advantage") parts.push("Adv.");
  if (c.mode === "disadvantage") parts.push("Disadv.");
  return parts.length ? ` (${parts.join(" · ")})` : "";
}
function effectLabel(c) {
  const b = c.bonus ? `Flat bonus ${c.bonus > 0 ? "+" : ""}${c.bonus}` : null;
  const m = c.mode
    ? c.mode === "advantage"
      ? "Roll with advantage"
      : "Roll with disadvantage"
    : null;
  return [b, m].filter(Boolean).join(" • ") || "No direct effect";
}

function OutcomeBadge({ outcome, reason }) {
  const text =
    outcome === Outcome.Player
      ? "You win!"
      : outcome === Outcome.Enemy
      ? "Enemy wins!"
      : "It’s a draw!";

  const why =
    reason === "higher_roll"
      ? " (higher total)"
      : reason === "draw"
      ? " (exact tie)"
      : "";

  return <div className="outcome">{text}{why}</div>;
}

function OutcomeLabel({ o }) {
  return o === Outcome.Player ? "Player" : o === Outcome.Enemy ? "Enemy" : "Draw";
}
const signed = (n) => (n >= 0 ? `+${n}` : `${n}`);
