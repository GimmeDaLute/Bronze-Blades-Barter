import { d6 } from "../core/dice.js";
import { Outcome } from "./constants.js";

/**
 * Runs one round of d6 vs d6.
 * @param {{ rng: ()=>number, player?:object, enemy?:object }} opts
 * @returns {{ playerRoll:number, enemyRoll:number, outcome:string, meta:{player?:object, enemy?:object} }}
 */
export function fightOnce(opts) {
  const rng = opts?.rng ?? Math.random;
  const playerRoll = d6(rng);
  const enemyRoll  = d6(rng);
  let outcome = Outcome.Draw;
  if (playerRoll > enemyRoll) outcome = Outcome.Player;
  else if (enemyRoll > playerRoll) outcome = Outcome.Enemy;

  return {
    playerRoll,
    enemyRoll,
    outcome,
    meta: { player: opts?.player, enemy: opts?.enemy },
  };
}
