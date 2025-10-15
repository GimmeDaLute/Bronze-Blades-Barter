export function rollDie(sides, rng) {
    const r = rng();
    // clamp to [1..sides]
    return Math.max(1, Math.min(sides, (r * sides | 0) + 1));
  }
  
  export function d6(rng) {
    return rollDie(6, rng);
  }
  