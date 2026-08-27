export type FighterStatus =
  | "idle"
  | "computing"
  | "listening"
  | "speaking"
  | "eliminated";

export type FighterRole =
  | "generalist"
  | "counterexample_hunter"
  | "assumption_assassin"
  | "boundary_hunter"
  | "simplifier"
  | "red_team"
  | "alternative_framing"
  | "wildcard";

export interface CombatBudget {
  majorAttacks: number;
  minorAttacks: number;
  evidenceChallenges: number;
  crossExaminations: number;
  toolChallenges: number;
  counterattacks: number;
}

export interface Fighter {
  id: string;
  name: string;
  model: string;
  role: FighterRole;
  status: FighterStatus;
  thesis: string;
  health: number;
  attacksLaunched: number;
  attacksLanded: number;
  defensesWon: number;
  revisions: number;
  toolWins: number;
  contradictions: number;
  budget: CombatBudget;
  angle: number;
  eliminated: boolean;
}

export type ClaimStatus =
  | "alive"
  | "attacked"
  | "defended"
  | "disputed"
  | "revised"
  | "destroyed";

export type ClaimType = "empirical" | "logical" | "assumption" | "design";

export interface Claim {
  id: string;
  fighterId: string;
  statement: string;
  type: ClaimType;
  importance: number;
  dependencies: string[];
  status: ClaimStatus;
  round: number;
}

export type AttackType =
  | "logical"
  | "assumption"
  | "counterexample"
  | "empirical"
  | "calculation"
  | "execution"
  | "experiment"
  | "alternative"
  | "consistency"
  | "boundary"
  | "dependency";

export type AttackStatus = "pending" | "defended" | "landed" | "conceded";

export interface Attack {
  id: string;
  round: number;
  attackerId: string;
  targetFighterId: string;
  targetClaimId: string;
  type: AttackType;
  argument: string;
  severity: "minor" | "major" | "critical";
  status: AttackStatus;
}

export type TerminalKind = "sys" | "core" | "agent" | "tool" | "referee" | "judge";

export interface TerminalLine {
  id: string;
  t: number;
  kind: TerminalKind;
  actor?: string;
  text: string;
  highlight?: boolean;
}

export type ToolKind = "search" | "python" | "shell";

export interface ToolRun {
  id: string;
  tool: ToolKind;
  requestedBy: string;
  input: string;
  output: string;
  round: number;
}

export type ArenaStatus = "queued" | "running" | "judging" | "concluded";

export interface ArenaResult {
  winnerId: string;
  runnerUpId: string;
  destroyedIds: string[];
  survivalScore: number;
  unresolved: string[];
  strongestAttack: string;
  strongestDefense: string;
}

export interface ArenaRun {
  id: string;
  problem: string;
  tag: string;
  mode: "duel" | "battle_royale" | "boss_raid";
  createdAt: number;
  status: ArenaStatus;
  round: number;
  maxRounds: number;
  elapsedMs: number;
  fighters: Fighter[];
  claims: Claim[];
  attacks: Attack[];
  toolRuns: ToolRun[];
  terminal: TerminalLine[];
  activeFighterId: string | null;
  speakingBubble: { fighterId: string; text: string } | null;
  result: ArenaResult | null;
}
