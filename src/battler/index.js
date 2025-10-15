import { defaultRng, makeSeededRng } from "./core/rng.js";
import { fightOnce, fightSeries } from "./combat/engine.js";
import { Outcome, RollMode, Reason } from "./combat/constants.js";
import { GeneralLevels, generalBonus } from "./combat/generals.js";

export function createCombat(options = {}) {
  const rng = options.rng ?? defaultRng;
  const base = (extra = {}) => ({ rng, ...extra });

  return {
    Outcome, RollMode, Reason,
    GeneralLevels, generalBonus,

    fightOnce: (args = {}) => fightOnce(base(args)),
    fightSeries: (n, args = {}) => fightSeries(n, base(args)),
  };
}

export { Outcome, RollMode, Reason, GeneralLevels, generalBonus, makeSeededRng };
