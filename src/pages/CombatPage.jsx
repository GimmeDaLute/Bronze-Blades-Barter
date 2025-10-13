import React, { useState } from "react";

export default function CombatPage() {
  const [result, setResult] = useState(null);

  function roll() { return (Math.random() * 6 | 0) + 1; }

  function fight() {
    const you = roll();
    const foe = roll();
    let outcome = "It’s a draw!";
    if (you > foe) outcome = "You win!";
    else if (foe > you) outcome = "Enemy wins!";
    setResult({ you, foe, outcome });
  }

  return (
    <div className="page">
      <h1>⚔️ Simple Combat</h1>

      {result ? (
        <div className="card">
          <div>You rolled: <b>{result.you}</b></div>
          <div>Enemy rolled: <b>{result.foe}</b></div>
          <div className="outcome">{result.outcome}</div>
        </div>
      ) : (
        <p className="muted">Click the button to roll.</p>
      )}

      <button className="btn" onClick={fight}>{result ? "Fight again" : "Start fight"}</button>
    </div>
  );
}
