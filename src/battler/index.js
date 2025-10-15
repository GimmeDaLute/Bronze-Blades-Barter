import { defaultRng, makeSeededRng } from "./core/rng.js";
import { fightOnce } from "./combat/engine.js";
import { Outcome } from "./combat/constants.js";

/**
 * Create a Combat API instance with a stable surface for the UI.
 * You can expand this without changing UI imports.
 */
export function createCombat(options = {}) {
  const rng = options.rng ?? defaultRng;

  return {
    Outcome,
    fightOnce: (args = {}) => fightOnce({ rng, ...args }),
    // room for future: fightSeries, applyModifiers, log, etc.
  };
}

// re-export useful pieces for tests or tools
export { Outcome, makeSeededRng };
