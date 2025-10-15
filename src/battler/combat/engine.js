import { rollWithMode } from "../core/dice.js";
import { Outcome, Reason, RollMode } from "./constants.js";
import { generalBonus } from "./generals.js";

/**
 * Runs one round of combat.
 * Options:
 *  - rng: () => number
 *  - playerMod, enemyMod: integer modifiers (stackable)
 *  - playerGeneral, enemyGeneral: "none" | "veteran" | "elite" | "legend"
 *  - playerMode, enemyMode: "normal" | "advantage" | "disadvantage"
 *  - criticals: { nat6Win?: boolean, nat1Lose?: boolean }
 */
export function fightOnce(opts = {}) {
  const rng = opts.rng ?? Math.random;
  const playerMode = opts.playerMode ?? RollMode.Normal;
  const enemyMode  = opts.enemyMode  ?? RollMode.Normal;

  // Flat modifiers = explicit mod + general bonus
  const pm = toInt(opts.playerMod ?? 0) + generalBonus(opts.playerGeneral);
  const em = toInt(opts.enemyMod ?? 0) + generalBonus(opts.enemyGeneral);

  const crit = { nat6Win: true, nat1Lose: true, ...(opts.criticals || {}) };

  const pr = rollWithMode(playerMode, rng);
  const er = rollWithMode(enemyMode, rng);

  // Criticals by *natural* die
  if (crit.nat6Win && pr === 6 && er !== 6) return result(pr, er, Outcome.Player, Reason.CriticalWin, pm, em, playerMode, enemyMode);
  if (crit.nat6Win && er === 6 && pr !== 6) return result(pr, er, Outcome.Enemy,  Reason.CriticalWin, pm, em, playerMode, enemyMode);
  if (crit.nat1Lose && pr === 1 && er !== 1) return result(pr, er, Outcome.Enemy,  Reason.CriticalLoss, pm, em, playerMode, enemyMode);
  if (crit.nat1Lose && er === 1 && pr !== 1) return result(pr, er, Outcome.Player, Reason.CriticalLoss, pm, em, playerMode, enemyMode);

  // Compare totals with modifiers
  const pTotal = pr + pm;
  const eTotal = er + em;

  if (pTotal > eTotal) return result(pr, er, Outcome.Player, Reason.HigherRoll, pm, em, playerMode, enemyMode);
  if (eTotal > pTotal) return result(pr, er, Outcome.Enemy,  Reason.HigherRoll, pm, em, playerMode, enemyMode);
  return result(pr, er, Outcome.Draw, Reason.ExactDraw, pm, em, playerMode, enemyMode);
}

function result(pr, er, outcome, reason, pm, em, pMode, eMode) {
  return {
    playerRoll: pr,
    enemyRoll: er,
    playerMod: pm,
    enemyMod: em,
    playerTotal: pr + pm,
    enemyTotal: er + em,
    outcome,
    reason,
    modes: { player: pMode, enemy: eMode },
  };
}

function toInt(n) {
  const v = parseInt(n, 10);
  return Number.isNaN(v) ? 0 : v;
}

/** unchanged */
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
