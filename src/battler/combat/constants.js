export const Outcome = Object.freeze({
    Player: "player",
    Enemy: "enemy",
    Draw: "draw",
  });
  
  export const RollMode = Object.freeze({
    Normal: "normal",          // 1d6
    Advantage: "advantage",    // 2d6 keep high
    Disadvantage: "disadvantage", // 2d6 keep low
  });
  
  export const Reason = Object.freeze({
    HigherRoll: "higher_roll",
    CriticalWin: "critical_win",
    CriticalLoss: "critical_loss",
    ExactDraw: "draw",
  });
  