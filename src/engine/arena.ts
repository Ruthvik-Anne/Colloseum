import type {
  ArenaResult,
  ArenaRun,
  Attack,
  AttackType,
  Claim,
  ClaimType,
  Fighter,
  FighterRole,
  TerminalLine,
  ToolRun,
} from "../types";
import {
  ATTACK_TYPES,
  ATTACK_VERBS,
  DEFENSE_LINES,
  FIGHTER_NAMES,
  MODEL_POOL,
  ROLE_LABEL,
  SPECIALIST_ROLES,
  TOOL_QUERIES,
  fillTemplate,
  pick,
  randomClaimStatement,
} from "./content";

let uidCounter = 0;
function uid(prefix: string) {
  uidCounter += 1;
  return `${prefix}-${uidCounter.toString(36)}`;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const DEFAULT_BUDGET = {
  majorAttacks: 3,
  minorAttacks: 5,
  evidenceChallenges: 2,
  crossExaminations: 3,
  toolChallenges: 2,
  counterattacks: 3,
};

export function createArena(problem: string, tag = "CUSTOM"): ArenaRun {
  const fighterCount = 5;
  const roles: FighterRole[] = ["generalist", "generalist", "generalist"];
  const specialists = shuffle([...SPECIALIST_ROLES]).slice(0, fighterCount - roles.length);
  roles.push(...specialists);

  const models = shuffle([...MODEL_POOL]);
  const names = FIGHTER_NAMES.slice(0, fighterCount);

  const fighters: Fighter[] = names.map((name, i) => ({
    id: uid("F"),
    name,
    model: models[i % models.length],
    role: roles[i],
    status: "idle",
    thesis: fillTemplate(
      pick([
        "Solve via a staged {noun} that isolates failure domains before scaling.",
        "Solve via a decentralized {noun} with local fallback guarantees.",
        "Solve via a hybrid {noun} combining deterministic checks with learned policy.",
        "Solve via a minimal {noun} that trades some performance for provable safety.",
        "Solve via an incentive-aligned {noun} that removes the need for trust.",
      ])
    ),
    health: 100,
    attacksLaunched: 0,
    attacksLanded: 0,
    defensesWon: 0,
    revisions: 0,
    toolWins: 0,
    contradictions: 0,
    budget: { ...DEFAULT_BUDGET },
    angle: (360 / fighterCount) * i - 90,
    eliminated: false,
  }));

  const claims: Claim[] = [];
  fighters.forEach((f) => {
    const types: ClaimType[] = ["design", "assumption", "empirical", "logical"];
    types.forEach((type, idx) => {
      claims.push({
        id: uid("C"),
        fighterId: f.id,
        statement: idx === 0 ? f.thesis : randomClaimStatement(type),
        type,
        importance: idx === 0 ? 1 : Number((0.4 + Math.random() * 0.55).toFixed(2)),
        dependencies: idx === 0 ? [] : [claims[claims.length - 1]?.id].filter(Boolean) as string[],
        status: "alive",
        round: 0,
      });
    });
  });

  const terminal: TerminalLine[] = [
    { id: uid("T"), t: 0, kind: "sys", text: `Initializing Arena Instance ${uid("A").toUpperCase()}...` },
    { id: uid("T"), t: 0, kind: "sys", text: `Agents connected (${fighters.length}/${fighters.length}).` },
    { id: uid("T"), t: 0, kind: "core", text: "Distributing baseline logic vectors." },
    ...fighters.map((f) => ({
      id: uid("T"),
      t: 0,
      kind: "agent" as const,
      actor: f.name,
      text: `Position generated. Role: ${ROLE_LABEL[f.role]}. Standing by.`,
    })),
  ];

  return {
    id: uid("run"),
    problem,
    tag,
    mode: "battle_royale",
    createdAt: Date.now(),
    status: "running",
    round: 1,
    maxRounds: 5,
    elapsedMs: 0,
    fighters,
    claims,
    attacks: [],
    toolRuns: [],
    terminal,
    activeFighterId: null,
    speakingBubble: null,
    result: null,
  };
}

function aliveFighters(run: ArenaRun) {
  return run.fighters.filter((f) => !f.eliminated);
}

function aliveClaimsOf(run: ArenaRun, fighterId: string) {
  return run.claims.filter((c) => c.fighterId === fighterId && c.status !== "destroyed");
}

function log(run: ArenaRun, line: Omit<TerminalLine, "id" | "t">) {
  run.terminal.push({ id: uid("T"), t: run.elapsedMs, ...line });
  if (run.terminal.length > 400) run.terminal.splice(0, run.terminal.length - 400);
}

function collapseDependents(run: ArenaRun, claimId: string) {
  const queue = [claimId];
  const collapsed: string[] = [];
  while (queue.length) {
    const id = queue.shift()!;
    for (const c of run.claims) {
      if (c.dependencies.includes(id) && c.status !== "destroyed") {
        c.status = "destroyed";
        collapsed.push(c.id);
        queue.push(c.id);
      }
    }
  }
  return collapsed;
}

function setAllStatus(run: ArenaRun, status: Fighter["status"]) {
  run.fighters.forEach((f) => {
    if (!f.eliminated) f.status = status;
  });
}

function maybeEliminate(run: ArenaRun, fighter: Fighter) {
  if (fighter.eliminated) return;
  const claims = aliveClaimsOf(run, fighter.id);
  const rootDead = run.claims.find(
    (c) => c.fighterId === fighter.id && c.importance === 1 && c.status === "destroyed"
  );
  if (fighter.health <= 15 || rootDead || claims.length === 0) {
    fighter.eliminated = true;
    fighter.status = "eliminated";
    log(run, { kind: "referee", text: `${fighter.name} eliminated — root thesis collapsed.`, highlight: true });
  }
}

/** Advance the simulation by one discrete combat step. Mutates `run` in place (used inside immer). */
export function stepArena(run: ArenaRun) {
  if (run.status === "concluded") return;

  run.elapsedMs += 1400;

  const alive = aliveFighters(run);
  if (alive.length <= 1 || run.round > run.maxRounds) {
    concludeArena(run);
    return;
  }

  const attacker = pick(alive);
  const defendersPool = alive.filter((f) => f.id !== attacker.id);
  if (defendersPool.length === 0) {
    concludeArena(run);
    return;
  }
  const defender = pick(defendersPool);
  const defenderClaims = aliveClaimsOf(run, defender.id).filter((c) => c.status !== "destroyed");
  if (defenderClaims.length === 0) {
    maybeEliminate(run, defender);
    return;
  }

  setAllStatus(run, "listening");
  attacker.status = "computing";
  run.activeFighterId = attacker.id;

  const targetClaim = pick(defenderClaims);
  const attackType: AttackType = pick(ATTACK_TYPES);
  const useTool = attackType === "execution" || attackType === "experiment" || attackType === "calculation";

  attacker.status = "speaking";
  attacker.attacksLaunched += 1;
  const verb = pick(ATTACK_VERBS[attackType]);
  const attackArgument = `${attacker.name} ${verb}`;

  const attack: Attack = {
    id: uid("A"),
    round: run.round,
    attackerId: attacker.id,
    targetFighterId: defender.id,
    targetClaimId: targetClaim.id,
    type: attackType,
    argument: attackArgument,
    severity: pick(["minor", "major", "critical"] as const),
    status: "pending",
  };
  run.attacks.push(attack);
  targetClaim.status = "attacked";

  run.speakingBubble = {
    fighterId: attacker.id,
    text: `${attackType.toUpperCase()} ATTACK: ${verb}`,
  };
  log(run, {
    kind: "agent",
    actor: attacker.name,
    text: `Launches ${attackType} attack on ${defender.name} :: ${targetClaim.id} — "${targetClaim.statement}"`,
    highlight: true,
  });

  if (useTool) {
    const tool = pick(["search", "python", "shell"] as const);
    const query = fillTemplate(pick(TOOL_QUERIES[tool]));
    const toolRun: ToolRun = {
      id: uid("TR"),
      tool,
      requestedBy: attacker.id,
      input: query,
      output: pick([
        "Result: hypothesis rejected at p<0.05.",
        "Result: claim holds within tested bounds.",
        "Result: counterexample found at boundary n=10^6.",
        "Result: benchmark completed — no regression detected.",
      ]),
      round: run.round,
    };
    run.toolRuns.push(toolRun);
    log(run, { kind: "tool", text: `Tool run ${toolRun.id} (${tool}) :: ${query}` });
    log(run, { kind: "tool", text: toolRun.output, highlight: true });
  }

  defender.status = "computing";
  resolveAttack(run, attacker, defender, targetClaim, attack);

  if (run.round < run.maxRounds && Math.random() < 0.18) {
    run.round += 1;
    log(run, { kind: "core", text: `Advancing to round ${run.round}.` });
  }

  alive.forEach((f) => maybeEliminate(run, f));

  const stillAlive = aliveFighters(run);
  if (stillAlive.length <= 1 || run.round > run.maxRounds) {
    concludeArena(run);
  }
}

function resolveAttack(run: ArenaRun, attacker: Fighter, defender: Fighter, claim: Claim, attack: Attack) {
  const outcomeRoll = Math.random();
  let choice: "defend" | "concede" | "revise" | "counterattack";
  if (outcomeRoll < 0.45) choice = "defend";
  else if (outcomeRoll < 0.68) choice = "revise";
  else if (outcomeRoll < 0.85) choice = "counterattack";
  else choice = "concede";

  defender.status = "speaking";
  run.speakingBubble = { fighterId: defender.id, text: choice.toUpperCase() };

  const line = pick(DEFENSE_LINES[choice]);

  if (choice === "defend") {
    attack.status = "defended";
    claim.status = "defended";
    defender.defensesWon += 1;
    defender.health = Math.min(100, defender.health + 2);
    log(run, { kind: "agent", actor: defender.name, text: `${defender.name} ${line}` });
  } else if (choice === "concede") {
    attack.status = "landed";
    claim.status = "destroyed";
    attacker.attacksLanded += 1;
    defender.health = Math.max(0, defender.health - (attack.severity === "critical" ? 22 : attack.severity === "major" ? 14 : 7));
    log(run, { kind: "agent", actor: defender.name, text: `${defender.name} ${line}` });
    const collapsed = collapseDependents(run, claim.id);
    if (collapsed.length) {
      log(run, {
        kind: "referee",
        text: `Dependency collapse: ${collapsed.length} claim(s) invalidated beneath ${claim.id}.`,
        highlight: true,
      });
    }
  } else if (choice === "revise") {
    attack.status = "landed";
    claim.status = "revised";
    defender.revisions += 1;
    defender.health = Math.max(0, defender.health - 4);
    log(run, { kind: "agent", actor: defender.name, text: `${defender.name} ${line}` });
  } else {
    attack.status = "defended";
    claim.status = "disputed";
    defender.defensesWon += 1;
    attacker.health = Math.max(0, attacker.health - 6);
    attacker.contradictions += Math.random() < 0.3 ? 1 : 0;
    log(run, { kind: "agent", actor: defender.name, text: `${defender.name} ${line}` });
  }
}

function computeScore(run: ArenaRun, f: Fighter) {
  const claims = run.claims.filter((c) => c.fighterId === f.id);
  const alive = claims.filter((c) => c.status !== "destroyed").length;
  return (
    2 * alive +
    1.5 * f.defensesWon +
    1.5 * f.attacksLanded +
    1.2 * f.toolWins +
    f.revisions -
    2 * f.contradictions +
    f.health / 10
  );
}

function concludeArena(run: ArenaRun) {
  if (run.status === "concluded") return;
  run.status = "judging";
  setAllStatus(run, "idle");
  run.speakingBubble = null;
  run.activeFighterId = null;

  const ranked = [...run.fighters].sort((a, b) => {
    if (a.eliminated !== b.eliminated) return a.eliminated ? 1 : -1;
    return computeScore(run, b) - computeScore(run, a);
  });
  const winner = ranked[0];
  const runnerUp = ranked[1] ?? ranked[0];
  const destroyed = run.fighters
    .filter((f) => f.eliminated && f.id !== winner.id && f.id !== runnerUp.id)
    .map((f) => f.id);
  const unresolvedClaims = run.claims.filter((c) => c.status === "disputed").slice(0, 3);

  const maxScore = ranked.reduce((s, f) => s + Math.max(computeScore(run, f), 0), 0) || 1;
  const survivalScore = Math.round((Math.max(computeScore(run, winner), 0) / maxScore) * 100);

  const strongestAttack = run.attacks
    .filter((a) => a.status === "landed" && a.severity === "critical")
    .slice(-1)[0];
  const strongestDefense = run.attacks.filter((a) => a.status === "defended").slice(-1)[0];

  const result: ArenaResult = {
    winnerId: winner.id,
    runnerUpId: runnerUp.id,
    destroyedIds: destroyed,
    survivalScore: Math.min(99, Math.max(41, survivalScore)),
    unresolved: unresolvedClaims.map((c) => c.statement),
    strongestAttack: strongestAttack
      ? `${run.fighters.find((f) => f.id === strongestAttack.attackerId)?.name ?? "?"} — ${strongestAttack.argument}`
      : "No critical attacks landed this run.",
    strongestDefense: strongestDefense
      ? `${run.fighters.find((f) => f.id === strongestDefense.attackerId)?.name ?? "?"}'s target held under pressure.`
      : "No decisive defenses recorded.",
  };

  log(run, { kind: "judge", text: "Blind judge panel convened. Anonymizing surviving argument structures." });
  log(run, { kind: "judge", text: `Pairwise ranking complete. Winner: ${winner.name}.`, highlight: true });
  log(run, { kind: "sys", text: "Final synthesis generated." });

  run.result = result;
  run.status = "concluded";
}
