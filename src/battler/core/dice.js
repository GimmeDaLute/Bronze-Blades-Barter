export function rollDie(sides, rng) {
    const r = rng();
    return Math.max(1, Math.min(sides, (r * sides | 0) + 1));
  }
  
  export function d6(rng) { return rollDie(6, rng); }
  
  export function rollWithMode(mode, rng) {
    const a = d6(rng);
    if (mode === "advantage") {
      const b = d6(rng);
      return Math.max(a, b);
    }
    if (mode === "disadvantage") {
      const b = d6(rng);
      return Math.min(a, b);
    }
    return a; // normal
  }
  