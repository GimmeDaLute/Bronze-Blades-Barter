import { rollWithMode } from "../core/dice.js";
import { Outcome, Reason, RollMode } from "./constants.js";
import { generalBonus } from "./generals.js";
import { summarizeConditions } from "./conditions.js";

/**
 * Runs one round of combat — no criticals.
 * Options:
 *  - rng: () => number
 *  - playerMod, enemyMod: integer modifiers
 *  - playerGeneral, enemyGeneral: "none" | "veteran" | ...
 *  - playerConditions, enemyConditions: string[] of condition keys
 *  - playerMode, enemyMode: "normal" | "advantage" | "disadvantage"
 */
export function fightOnce(opts = {}) {
  const rng = opts.rng ?? Math.random;

  // Base roll modes (can be overridden by conditions)
  const basePlayerMode = opts.playerMode ?? RollMode.Normal;
  const baseEnemyMode  = opts.enemyMode  ?? RollMode.Normal;

  // General + explicit modifiers
  const pmGeneral = generalBonus(opts.playerGeneral);
  const emGeneral = generalBonus(opts.enemyGeneral);
  const pmExplicit = toInt(opts.playerMod ?? 0);
  const emExplicit = toInt(opts.enemyMod ?? 0);

  // NEW: conditions summary (per side)
  const pCond = summarizeConditions(opts.playerConditions);
  const eCond = summarizeConditions(opts.enemyConditions);

  // Final flat modifiers (stack)
  const pm = pmGeneral + pmExplicit + pCond.bonus;
  const em = emGeneral + emExplicit + eCond.bonus;

  // Final roll modes (condition can override base)
  const playerMode = pCond.mode ?? basePlayerMode;
  const enemyMode  = eCond.mode ?? baseEnemyMode;

  const pr = rollWithMode(playerMode, rng);
  const er = rollWithMode(enemyMode, rng);

  // Compare totals with modifiers only — no criticals
  const pTotal = pr + pm;
  const eTotal = er + em;

  let outcome = Outcome.Draw;
  let reason = Reason.ExactDraw;
  if (pTotal > eTotal) {
    outcome = Outcome.Player;
    reason = Reason.HigherRoll;
  } else if (eTotal > pTotal) {
    outcome = Outcome.Enemy;
    reason = Reason.HigherRoll;
  }

  return {
    playerRoll: pr,
    enemyRoll: er,
    playerMod: pm,
    enemyMod: em,
    playerTotal: pTotal,
    enemyTotal: eTotal,
    outcome,
    reason,
    modes: { player: playerMode, enemy: enemyMode },
  };
}

function toInt(n) {
  const v = parseInt(n, 10);
  return Number.isNaN(v) ? 0 : v;
}

export function fightSeries(n, opts = {}) {
  const rounds = Math.max(1, toInt(n));
  let p = 0, e = 0, d = 0;
  const history = [];
  for (let i = 0; i < rounds; i++) {
    const r = fightOnce(opts);
    history.push(r);
    if (r.outcome === Outcome.Player) p++;
    else if (r.outcome === Outcome.Enemy) e++;
    else d++;
  }
  let winner = Outcome.Draw;
  if (p > e) winner = Outcome.Player;
  else if (e > p) winner = Outcome.Enemy;

  return { rounds, winner, tally: { player: p, enemy: e, draws: d }, history };
}
