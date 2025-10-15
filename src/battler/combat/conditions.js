// Core list of tactical conditions. Tweak effects here only.
export const Conditions = Object.freeze([
    // Mutually-exclusive posture (handled in UI via mutex for each side)
    { key: "attacker",   label: "Attacker",      bonus: 1, mode: null },
    { key: "defender",   label: "Defender",      bonus: 1, mode: null },
  
    // Surprise/tempo
    { key: "ambushed",   label: "Ambushed",      bonus: 0, mode: "disadvantage" },
    { key: "ambusher",   label: "Ambusher",      bonus: 0, mode: "advantage" },
  
    // Terrain/fortification
    { key: "high_ground",label: "High Ground",   bonus: 1, mode: null },
    { key: "fortified",  label: "Fortified",     bonus: 2, mode: null },
  
    // Weather (keep simple; applies to all for now)
    { key: "rain",       label: "Rain",          bonus: 0, mode: "disadvantage" },
  ]);
  
  const priority = { disadvantage: 2, advantage: 1, normal: 0 };
  
  // Reduce a set of condition keys to a flat bonus + a roll-mode hint.
  export function summarizeConditions(keys = []) {
    let bonus = 0;
    let pickedMode = null; // "advantage" | "disadvantage" | null
    for (const k of keys) {
      const c = Conditions.find(x => x.key === k);
      if (!c) continue;
      bonus += Number(c.bonus) || 0;
      if (c.mode) {
        if (!pickedMode || priority[c.mode] > priority[pickedMode]) {
          pickedMode = c.mode;
        }
      }
    }
    return { bonus, mode: pickedMode }; // mode may be null (means "no override")
  }
