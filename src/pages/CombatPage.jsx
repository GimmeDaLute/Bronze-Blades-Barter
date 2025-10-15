import React, { useMemo, useState } from "react";
import { createCombat, Outcome, GeneralLevels } from "../battler/index.js";

export default function CombatPage() {
  const combat = useMemo(() => createCombat(), []);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  // new: chosen generals (keys)
  const [playerGen, setPlayerGen] = useState("none");
  const [enemyGen,  setEnemyGen]  = useState("none");

  function fight() {
    const r = combat.fightOnce({
      playerGeneral: playerGen,
      enemyGeneral:  enemyGen,
    });
    setResult(r);
    setHistory(h => [{ t: Date.now(), ...r }, ...h].slice(0, 20));
  }

  return (
    <div className="page">
      <h1>⚔️ Combat (d6 vs d6)</h1>

      {/* General selectors */}
      <div className="card">
        <div className="row">
          <label>Player General:&nbsp;</label>
          <select className="input" value={playerGen} onChange={e => setPlayerGen(e.target.value)}>
            {GeneralLevels.map(g => <option key={g.key} value={g.key}>{g.label}</option>)}
          </select>

          <label style={{ marginLeft: 12 }}>Enemy General:&nbsp;</label>
          <select className="input" value={enemyGen} onChange={e => setEnemyGen(e.target.value)}>
            {GeneralLevels.map(g => <option key={g.key} value={g.key}>{g.label}</option>)}
          </select>
        </div>
      </div>

      {result ? (
        <div className="card">
          <div>You rolled: <b>{result.playerRoll}</b> (mod {signed(result.playerMod)}) = <b>{result.playerTotal}</b></div>
          <div>Enemy rolled: <b>{result.enemyRoll}</b> (mod {signed(result.enemyMod)}) = <b>{result.enemyTotal}</b></div>
          <OutcomeBadge outcome={result.outcome} />
        </div>
      ) : (
        <p className="muted">Pick generals and click fight.</p>
      )}

      <button className="btn" onClick={fight}>{result ? "Fight again" : "Start fight"}</button>

      <div className="card">
        <h3 style={{margin:0}}>Recent Rounds</h3>
        {history.length === 0 && <div className="muted">No rounds yet.</div>}
        {history.map((h, i) => (
          <div key={i} className="row" style={{justifyContent:"space-between"}}>
            <span>{new Date(h.t).toLocaleTimeString()}</span>
            <span>Y:{h.playerTotal} (roll {h.playerRoll}) • E:{h.enemyTotal} (roll {h.enemyRoll})</span>
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
const signed = (n) => (n >= 0 ? `+${n}` : `${n}`);
