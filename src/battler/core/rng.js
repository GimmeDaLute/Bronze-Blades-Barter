// Pluggable RNG so you can swap in seeds or deterministic tests later.
export function defaultRng() {
    return Math.random();
  }
  
  // Example deterministic RNG (optional):
  export function makeSeededRng(seed = 1) {
    // Tiny Mulberry32
    let t = seed >>> 0;
    return () => {
      t += 0x6D2B79F5;
      let r = Math.imul(t ^ (t >>> 15), 1 | t);
      r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  }
  