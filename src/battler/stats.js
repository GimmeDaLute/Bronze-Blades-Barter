import { Outcome } from "./combat/constants.js";

export function accumulate(series) {
  const out = { player: 0, enemy: 0, draws: 0 };
  for (const r of series) {
    if (r.outcome === Outcome.Player) out.player++;
    else if (r.outcome === Outcome.Enemy) out.enemy++;
    else out.draws++;
  }
  return out;
}
