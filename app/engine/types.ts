/* =====================================================
   CRICSCORE – GULLY / LOCAL CRICKET DATA MODELS
   ===================================================== */

/* ---------- BASIC TYPES ---------- */

export type TeamSide = "A" | "B";

export type TossDecision = "BAT" | "FIELD";

/* ---------- PLAYER ---------- */

export type Player = {
  id: string;
  name: string;
  isSubstitute?: boolean;
};

/* ---------- MATCH ---------- */

export type Match = {
  id: string;
  oversLimit: number;               // User-defined (2,5,6,10,20…)
  teams: {
    A: Team;
    B: Team;
  };
  toss: {
    winner: TeamSide;
    decision: TossDecision;
  };
  innings: Innings[];
  currentInnings: 1 | 2;
  status: "LIVE" | "COMPLETED";
  createdAt: number;
};

/* ---------- TEAM ---------- */

export type Team = {
  id: TeamSide;
  name: string;
  players: Player[];                // Any count (gully cricket)
};

/* ---------- INNINGS ---------- */

export type Innings = {
  battingTeam: TeamSide;
  bowlingTeam: TeamSide;

  totalRuns: number;
  wickets: number;
  balls: number;                    // Legal balls only

  deliveries: Delivery[];

  batsmen: Record<string, BatsmanStats>;
  bowlers: Record<string, BowlerStats>;

  partnerships: Partnership[];
};

/* ---------- DELIVERY (MOST IMPORTANT) ---------- */

export type Delivery = {
  over: number;                     // 0-based over index
  ballInOver: number;               // 1–6 (legal balls only)

  strikerId: string;
  nonStrikerId: string;
  bowlerId: string;

  runsOffBat: number;               // 0–6

  extras: {
    wide?: number;                  // includes automatic 1 + runs
    noBall?: number;                // includes automatic 1 + runs
    bye?: number;
    legBye?: number;
    overthrow?: number;
    penalty?: number;
  };

  dismissal?: {
    type:
      | "BOWLED"
      | "CAUGHT"
      | "LBW"
      | "RUN_OUT"
      | "STUMPED"
      | "HIT_WICKET"
      | "RETIRED";
    playerOutId: string;
    fielderId?: string;
  };

  countsAsBall: boolean;             // false for wide / no-ball
  timestamp: number;
};

/* ---------- BATSMAN STATS ---------- */

export type BatsmanStats = {
  playerId: string;
  name: string;        // 
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
  isOut: boolean;
};


/* ---------- BOWLER STATS ---------- */

export type BowlerStats = {
  playerId: string;
  name: string;        //
  balls: number;
  runs: number;
  wickets: number;
  maidens: number;
  economy: number;
};


/* ---------- PARTNERSHIP ---------- */

export type Partnership = {
  batsman1Id: string;
  batsman2Id: string;
  runs: number;
  balls: number;
};

/* ---------- MATCH RESULT ---------- */

export type MatchResult = {
  winner?: TeamSide;
  margin?: string;                  // "Won by 12 runs"
  isTie: boolean;
};
