import {
  Match,
  Innings,
  Delivery,
  BatsmanStats,
  BowlerStats,
} from "./types";

/* =====================================================
   CRICSCORE MATCH ENGINE
   -----------------------------------------------------
   This file:
   - Contains ONLY match rules & calculations
   - Does NOT create players
   - Does NOT handle UI
   - Is format-independent (gully cricket friendly)
   ===================================================== */

/* =====================================================
   PUBLIC API — UI CALLS ONLY THIS
   ===================================================== */

export function addBall(
  match: Match,
  input: Omit<Delivery, "over" | "ballInOver" | "timestamp">
): Match {
  const innings = getCurrentInnings(match);

  validateBall(match, innings, input);

  const delivery = buildDelivery(innings, input);

  applyDelivery(innings, delivery);

  postBallUpdates(match, innings, delivery);

  return { ...match };
}

/* =====================================================
   VALIDATION RULES
   ===================================================== */

function validateBall(
  match: Match,
  innings: Innings,
  d: Omit<Delivery, "over" | "ballInOver" | "timestamp">
) {
  // All-out check
  if (innings.wickets >= getMaxWickets(match, innings)) {
    throw new Error("All players are out");
  }

  // Bat runs must be 0–6
  if (d.runsOffBat < 0 || d.runsOffBat > 6) {
    throw new Error("Invalid runs off bat");
  }

  // Wide cannot have bat runs
  if (d.extras?.wide && d.runsOffBat > 0) {
    throw new Error("Wide cannot have bat runs");
  }
}

/* =====================================================
   DELIVERY BUILDER
   ===================================================== */

function buildDelivery(
  innings: Innings,
  d: Omit<Delivery, "over" | "ballInOver" | "timestamp">
): Delivery {
  const legalBalls = innings.balls;

  return {
    ...d,
    over: Math.floor(legalBalls / 6),
    ballInOver: d.countsAsBall ? (legalBalls % 6) + 1 : legalBalls % 6,
    timestamp: Date.now(),
  };
}

/* =====================================================
   APPLY DELIVERY TO INNINGS
   ===================================================== */

function applyDelivery(innings: Innings, d: Delivery) {
  // Calculate all extras
  const extraRuns =
    (d.extras.wide ?? 0) +
    (d.extras.noBall ?? 0) +
    (d.extras.bye ?? 0) +
    (d.extras.legBye ?? 0) +
    (d.extras.overthrow ?? 0) +
    (d.extras.penalty ?? 0);

  const totalRuns = d.runsOffBat + extraRuns;
  innings.totalRuns += totalRuns;

  /* ---------- BATSMAN UPDATE ---------- */
  if (d.countsAsBall) {
    const bat: BatsmanStats = innings.batsmen[d.strikerId];
    bat.runs += d.runsOffBat;
    bat.balls += 1;

    if (d.runsOffBat === 4) bat.fours++;
    if (d.runsOffBat === 6) bat.sixes++;

    bat.strikeRate = calculateStrikeRate(bat);
  }

  /* ---------- BOWLER UPDATE ---------- */
  const bowler: BowlerStats = innings.bowlers[d.bowlerId];
  bowler.runs += totalRuns;

  if (d.countsAsBall) {
    bowler.balls += 1;
    bowler.economy = calculateEconomy(bowler);
  }

  /* ---------- WICKET ---------- */
  if (d.dismissal) {
    innings.wickets += 1;
    innings.batsmen[d.dismissal.playerOutId].isOut = true;

    // Run-out does NOT count to bowler
    if (
      d.dismissal.type !== "RUN_OUT" &&
      d.dismissal.type !== "RETIRED"
    ) {
      bowler.wickets += 1;
    }
  }

  /* ---------- PARTNERSHIP ---------- */
  updatePartnership(innings, totalRuns, d.countsAsBall);

  innings.deliveries.push(d);

  if (d.countsAsBall) {
    innings.balls += 1;
  }
}

/* =====================================================
   POST BALL LOGIC
   ===================================================== */

function postBallUpdates(
  match: Match,
  innings: Innings,
  d: Delivery
) {
  if (!d.countsAsBall) return;

  // Strike rotates on odd runs
  if (d.runsOffBat % 2 === 1) {
    swapStrike(innings);
  }

  // End of over strike change
  if (innings.balls % 6 === 0) {
    swapStrike(innings);
  }

  checkInningsEnd(match, innings);
}

/* =====================================================
   INNINGS & MATCH END LOGIC
   ===================================================== */

function checkInningsEnd(match: Match, innings: Innings) {
  const oversCompleted = innings.balls >= match.oversLimit * 6;
  const allOut = innings.wickets >= getMaxWickets(match, innings);

  // Second innings chase completed
  if (match.currentInnings === 2) {
    const target = match.innings[0].totalRuns + 1;
    if (innings.totalRuns >= target) {
      match.status = "COMPLETED";
      return;
    }
  }

  if (!oversCompleted && !allOut) return;

  // Switch innings
  if (match.currentInnings === 1) {
    match.currentInnings = 2;
    return;
  }

  match.status = "COMPLETED";
}

/* =====================================================
   HELPERS
   ===================================================== */

function getCurrentInnings(match: Match): Innings {
  return match.innings[match.currentInnings - 1];
}

function getMaxWickets(match: Match, innings: Innings): number {
  const players = match.teams[innings.battingTeam].players.length;
  return Math.max(players - 1, 1);
}

function swapStrike(innings: Innings) {
  const p = innings.partnerships[innings.partnerships.length - 1];
  if (!p) return;
  [p.batsman1Id, p.batsman2Id] = [p.batsman2Id, p.batsman1Id];
}

function updatePartnership(
  innings: Innings,
  runs: number,
  ball: boolean
) {
  let p = innings.partnerships[innings.partnerships.length - 1];

  if (!p) {
    p = { batsman1Id: "", batsman2Id: "", runs: 0, balls: 0 };
    innings.partnerships.push(p);
  }

  p.runs += runs;
  if (ball) p.balls += 1;
}

function calculateStrikeRate(b: BatsmanStats): number {
  return b.balls === 0 ? 0 : Number(((b.runs / b.balls) * 100).toFixed(2));
}

function calculateEconomy(b: BowlerStats): number {
  return b.balls === 0 ? 0 : Number(((b.runs * 6) / b.balls).toFixed(2));
}
