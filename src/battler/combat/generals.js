// General skill levels and their flat bonuses.
export const GeneralLevels = Object.freeze([
    { key: "woeful",   label: "Woeful (- 2)",  bonus: -2},
    { key: "incompetant",   label: "Incompetant (- 1)",  bonus: -1},
    { key: "green",    label: "Green (+0)",    bonus: 0 },
    { key: "regular",  label: "Regular (+1)",  bonus: 1 },
    { key: "veteran",  label: "Veteran (+2)",  bonus: 2 },
    { key: "elite",    label: "Elite (+3)",    bonus: 3 },
    { key: "legend",   label: "Legend (+4)",   bonus: 4 },
    { key: "master",   label: "Master of Battle (+5)",   bonus: 5 },
  ]);
  
  const map = Object.fromEntries(GeneralLevels.map(g => [g.key, g.bonus]));
  
  /** Get flat bonus for a given general key; unknown keys = 0. */
  export function generalBonus(key) {
    return map[key] ?? 0;
  }
