import React, { useMemo, useState } from "react";
import { createCombat, Outcome } from "../battler/index.js";

export default function CombatPage() {
  // Create the game API once; UI never sees internals.
  const combat = useMemo(() => createCombat(), []);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  function fight() {
    const r = combat.fightOnce();
    setResult(r);
    setHistory(h => [{ t: Date.now(), ...r }, ...h].slice(0, 20));
  }

  return (
    <div className="page">
      <h1>⚔️ Combat (d6 vs d6)</h1>

      {result ? (
        <div className="card">
          <div>You rolled: <b>{result.playerRoll}</b></div>
          <div>Enemy rolled: <b>{result.enemyRoll}</b></div>
          <OutcomeBadge outcome={result.outcome} />
        </div>
      ) : (
        <p className="muted">Click fight to roll the dice.</p>
      )}

      <button className="btn" onClick={fight}>{result ? "Fight again" : "Start fight"}</button>

      <div className="card">
        <h3 style={{margin:0}}>Recent Rounds</h3>
        {history.length === 0 && <div className="muted">No rounds yet.</div>}
        {history.map((h, i) => (
          <div key={i} className="row" style={{justifyContent:"space-between"}}>
            <span>{new Date(h.t).toLocaleTimeString()}</span>
            <span>Y:{h.playerRoll} • E:{h.enemyRoll}</span>
            <span><small><OutcomeLabel o={h.outcome} /></small></span>
          </div>
        ))}
      </div>
    </div>
  );
}

function OutcomeBadge({ outcome }) {
  const text = outcome === Outcome.Player ? "You win!" :
               outcome === Outcome.Enemy ? "Enemy wins!" : "It’s a draw!";
  return <div className="outcome">{text}</div>;
}
function OutcomeLabel({ o }) {
  return o === Outcome.Player ? "Player" : o === Outcome.Enemy ? "Enemy" : "Draw";
}
