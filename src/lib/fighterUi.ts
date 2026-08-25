import type { AttackType, ClaimStatus, ClaimType, Fighter, FighterStatus, TerminalKind } from "../types";

export const STATUS_ICON: Record<FighterStatus, string> = {
  idle: "smart_toy",
  computing: "memory",
  listening: "hearing",
  speaking: "graphic_eq",
  eliminated: "block",
};

export const STATUS_LABEL: Record<FighterStatus, string> = {
  idle: "IDLE",
  computing: "COMPUTING",
  listening: "LISTENING",
  speaking: "SPEAKING",
  eliminated: "ELIMINATED",
};

export const CLAIM_STATUS_ICON: Record<ClaimStatus, string> = {
  alive: "●",
  attacked: "◐",
  defended: "◆",
  disputed: "△",
  revised: "↻",
  destroyed: "✕",
};

export const CLAIM_STATUS_COLOR: Record<ClaimStatus, string> = {
  alive: "text-on-surface-variant",
  attacked: "text-warning",
  defended: "text-success",
  disputed: "text-warning",
  revised: "text-primary-container",
  destroyed: "text-error",
};

export const CLAIM_TYPE_LABEL: Record<ClaimType, string> = {
  design: "DESIGN",
  assumption: "ASSUMPTION",
  empirical: "EMPIRICAL",
  logical: "LOGICAL",
};

export const ATTACK_TYPE_LABEL: Record<AttackType, string> = {
  logical: "LOGICAL",
  assumption: "ASSUMPTION",
  counterexample: "COUNTEREXAMPLE",
  empirical: "EMPIRICAL",
  calculation: "CALCULATION",
  execution: "EXECUTION",
  experiment: "EXPERIMENT",
  alternative: "ALTERNATIVE",
  consistency: "CONSISTENCY",
  boundary: "BOUNDARY",
  dependency: "DEPENDENCY",
};

export const TERMINAL_KIND_COLOR: Record<TerminalKind, string> = {
  sys: "text-secondary",
  core: "text-secondary",
  agent: "text-terminal-text",
  tool: "text-warning",
  referee: "text-error",
  judge: "text-primary-container",
};

export const TERMINAL_KIND_PREFIX: Record<TerminalKind, string> = {
  sys: "SYS",
  core: "CORE",
  agent: "AGENT",
  tool: "TOOL",
  referee: "REF",
  judge: "JUDGE",
};

export function attackRate(f: Fighter) {
  if (f.attacksLaunched === 0) return 0;
  return Math.round((f.attacksLanded / f.attacksLaunched) * 100);
}

export function defenseRate(f: Fighter) {
  const total = f.defensesWon + f.revisions;
  if (total === 0) return 0;
  return Math.round((f.defensesWon / (f.defensesWon + f.revisions + 0.0001)) * 100);
}

export function healthColor(health: number) {
  if (health > 60) return "bg-success";
  if (health > 30) return "bg-warning";
  return "bg-error";
}
