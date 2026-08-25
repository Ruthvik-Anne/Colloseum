import type { AttackType, ClaimType, FighterRole } from "../types";

export const MODEL_POOL = [
  "claude-sonnet-5",
  "gpt-5.2",
  "gemini-3-pro",
  "grok-5",
  "llama-4-405b",
  "mistral-large-3",
];

export const FIGHTER_NAMES = [
  "AGENT_A",
  "AGENT_B",
  "AGENT_C",
  "AGENT_D",
  "AGENT_E",
  "AGENT_F",
  "AGENT_G",
  "AGENT_H",
];

export const SPECIALIST_ROLES: FighterRole[] = [
  "counterexample_hunter",
  "assumption_assassin",
  "boundary_hunter",
  "simplifier",
  "red_team",
  "alternative_framing",
  "wildcard",
];

export const ROLE_LABEL: Record<FighterRole, string> = {
  generalist: "GENERALIST",
  counterexample_hunter: "COUNTEREXAMPLE HUNTER",
  assumption_assassin: "ASSUMPTION ASSASSIN",
  boundary_hunter: "BOUNDARY HUNTER",
  simplifier: "SIMPLIFIER",
  red_team: "RED TEAM",
  alternative_framing: "ALT-FRAMING",
  wildcard: "WILDCARD",
};

const CLAIM_TEMPLATES: Record<ClaimType, string[]> = {
  design: [
    "Proposes a {noun}-first architecture to resolve the core constraint.",
    "Solution decomposes into independently verifiable components.",
    "Recommends staged rollout to bound blast radius of failure.",
    "Chooses {noun} as the primary mechanism over alternatives.",
  ],
  assumption: [
    "Assumes {noun} remains stable under adversarial load.",
    "Assumes available resources scale linearly with demand.",
    "Assumes actors behave rationally within the stated constraints.",
    "Assumes the {noun} boundary condition holds at scale.",
  ],
  empirical: [
    "Claims a measurable improvement of 20-40% over the baseline {noun}.",
    "Predicts failure rate below 1% under simulated load.",
    "Predicts convergence within a bounded number of iterations.",
    "Cites comparable {noun} deployments as supporting precedent.",
  ],
  logical: [
    "If the premise holds, the proposed {noun} strictly dominates alternatives.",
    "Correctness follows from the invariant established in the root thesis.",
    "The reduction to a known {noun} problem preserves optimality.",
    "No valid counterexample exists within the stated constraint set.",
  ],
};

const NOUNS = [
  "system",
  "protocol",
  "allocation",
  "consensus",
  "pipeline",
  "network",
  "market",
  "control loop",
  "schema",
  "trajectory",
  "ledger",
  "reward function",
];

export function pick<T>(arr: readonly T[], rng: () => number = Math.random): T {
  return arr[Math.floor(rng() * arr.length)];
}

export function fillTemplate(t: string, rng: () => number = Math.random): string {
  return t.replace(/\{noun\}/g, () => pick(NOUNS, rng));
}

export function randomClaimStatement(type: ClaimType, rng: () => number = Math.random) {
  return fillTemplate(pick(CLAIM_TEMPLATES[type], rng), rng);
}

export const ATTACK_VERBS: Record<AttackType, string[]> = {
  logical: ["shows the conclusion does not follow from stated premises."],
  assumption: ["challenges the unstated assumption underpinning this claim."],
  counterexample: ["produces a case where this rule breaks down."],
  empirical: ["demands external evidence supporting this figure."],
  calculation: ["requests deterministic numeric verification."],
  execution: ["requests code execution to verify the claimed behavior."],
  experiment: ["requests a simulation to settle the dispute."],
  alternative: ["demonstrates a dominating alternative solution."],
  consistency: ["exposes an internal contradiction with an earlier claim."],
  boundary: ["pushes the claim into an extreme edge condition."],
  dependency: ["targets this claim because many others depend on it."],
};

export const ATTACK_TYPES: AttackType[] = [
  "logical",
  "assumption",
  "counterexample",
  "empirical",
  "calculation",
  "execution",
  "experiment",
  "alternative",
  "consistency",
  "boundary",
  "dependency",
];

export const DEFENSE_LINES = {
  defend: [
    "holds the line: the claim survives under the stated constraints.",
    "provides a tightened justification and the claim survives.",
    "shows the attack relies on an out-of-scope assumption.",
  ],
  concede: [
    "concedes the point — the claim does not hold as stated.",
    "acknowledges the flaw and withdraws the claim.",
  ],
  revise: [
    "revises the claim to a narrower, defensible form.",
    "patches the assumption and restates the claim.",
  ],
  counterattack: [
    "counterattacks: the challenge itself rests on a false premise.",
    "turns the attack back — the attacker's model is inconsistent.",
  ],
};

export const TOOL_QUERIES: Record<"search" | "python" | "shell", string[]> = {
  search: [
    "search literature for precedent on {noun} performance",
    "search for known failure modes of this {noun}",
  ],
  python: [
    "simulate {noun} under adversarial load (n=10^5)",
    "compute complexity bound for the proposed {noun}",
  ],
  shell: [
    "run static benchmark harness against the {noun} spec",
    "execute stress test against the {noun} boundary case",
  ],
};

export const SAMPLE_BATTLES = [
  {
    id: "agi-safety",
    tag: "AGI_SAFETY",
    icon: "psychology",
    title: "Alignment Optimization",
    description:
      "Evaluate divergent reward functions in multi-agent environments to prevent instrumental convergence.",
    problem:
      "Design a reward-modeling scheme for multi-agent systems that prevents instrumental convergence toward power-seeking behavior, while remaining sample-efficient enough for real deployment.",
  },
  {
    id: "mars-transit",
    tag: "MARS_TRANSIT",
    icon: "rocket_launch",
    title: "Orbital Trajectory Conflict",
    description:
      "Resolve resource allocation disputes between automated transport vessels during Hohmann transfer phases.",
    problem:
      "Propose a decentralized coordination protocol for autonomous transport vessels sharing limited delta-v budgets during overlapping Hohmann transfer windows, without a central arbiter.",
  },
  {
    id: "econ-consensus",
    tag: "ECON_CONSENSUS",
    icon: "account_balance",
    title: "Distributed Ledger Split",
    description:
      "Simulate Byzantine fault tolerance failure modes in global high-frequency trading networks.",
    problem:
      "Design a Byzantine-fault-tolerant settlement layer for global high-frequency trading that stays live under network partition and remains resistant to coordinated validator collusion.",
  },
];
