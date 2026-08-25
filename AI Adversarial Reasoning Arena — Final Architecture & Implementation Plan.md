# AI Adversarial Reasoning Arena — Final Architecture & Implementation Plan

## 1. Product Definition

The system is an **AI reasoning combat platform** in which multiple independent agents construct competing solutions, attack one another's reasoning, defend their own claims, invoke external tools when disputes cannot be resolved verbally, and progressively eliminate weaker arguments.

The platform does **not** assume that agreement equals truth.

Its objective is:

> Produce the strongest surviving solution after structured adversarial pressure.

The primary mechanism is therefore not consensus, majority voting, or a linear verifier pipeline.

It is:

**independent generation → combat → falsification → defense → experimentation → elimination → evolution → judging → synthesis**

---

# 2. Core Design Principles

1. **Arguments compete; agents do not merely chat.**
2. Every important proposition becomes an addressable **claim**.
3. Every attack targets a specific claim, assumption, dependency, or conclusion.
4. Agents receive finite combat resources to prevent endless debate.
5. Agents can defend, concede, revise, or counterattack.
6. Tool execution overrides rhetorical persuasion where deterministic verification is possible.
7. Evidence discovered by tools becomes shared arena state.
8. Root assumptions propagate failure through dependent claims.
9. Consensus is never required.
10. Multiple valid solutions may survive simultaneously.
11. Judges evaluate surviving arguments, not model reputation.
12. Final synthesis may use only surviving or explicitly disputed arguments.
13. Agents are rewarded for correcting themselves rather than hiding errors.
14. New challengers can evolve from failed solutions.
15. Different problems dynamically receive different arena configurations.

---

# 3. High-Level Architecture

```text
                           USER
                            │
                            ▼
                  ┌───────────────────┐
                  │ Problem Analyzer  │
                  └─────────┬─────────┘
                            │
                  ┌─────────▼─────────┐
                  │ Arena Constructor │
                  └─────────┬─────────┘
                            │
               Generate independent fighters
                            │
           ┌────────────────┼─────────────────┐
           ▼                ▼                 ▼
      Fighter A        Fighter B         Fighter C...
           │                │                 │
           └─────────────┬──┴─────────────────┘
                         ▼
                  POSITION CLUSTERING
                         │
                         ▼
                CHAMPION SELECTION
                         │
                         ▼
       ┌──────────────── ARENA ────────────────┐
       │                                       │
       │ Claims ←→ Attacks ←→ Defenses         │
       │   │          │           │            │
       │   └──── Dependency Graph ─┘           │
       │                                       │
       │         Cross Examination             │
       │                                       │
       │             Tool Pit                  │
       └────────────────┬──────────────────────┘
                        │
                 Referee Engine
                        │
          ┌─────────────┼─────────────┐
          ▼             ▼             ▼
       survive        revise       eliminate
          │                           │
          │                      evolutionary
          │                        respawn
          └─────────────┬─────────────┘
                        ▼
                  BLIND JUDGES
                        │
                 pairwise ranking
                        │
                        ▼
                SURVIVOR RANKING
                        │
                        ▼
                    SYNTHESIS
                        │
                        ▼
                     RESULT
```

---

# 4. Main Runtime Components

## 4.1 Problem Analyzer

The Problem Analyzer determines:

- problem type
- complexity
- domain
- expected solution form
- whether external evidence is necessary
- whether code execution is useful
- whether simulation is useful
- whether multiple strategies are likely
- estimated debate depth
- risk level
- appropriate number of fighters

Example:

```json
{
  "problem_type": "system_design",
  "complexity": "high",
  "verification": ["reasoning", "benchmarking", "simulation"],
  "recommended_fighters": 6,
  "arena_mode": "battle_royale",
  "max_rounds": 5
}
```

---

# 5. Arena Constructor

The Arena Constructor dynamically creates the match.

It selects:

- fighter count
- models
- model families
- token budgets
- tool permissions
- combat move limits
- judge count
- maximum rounds
- elimination criteria
- mutation policy
- arena type

The system should avoid using the same model for every fighter whenever possible because correlated reasoning failures reduce adversarial diversity.

---

# 6. Fighter Generation

Initial fighters operate independently.

They cannot see:

- other fighter outputs
- judge preferences
- ranking
- previous match results

Each must independently generate:

```text
Position
├── thesis
├── reasoning
├── major claims
├── assumptions
├── dependencies
├── proposed solution
├── expected advantages
├── expected failure conditions
└── falsifiable predictions
```

This produces genuine solution diversity before combat begins.

---

# 7. Position Clustering

Raw generation may produce six agents but only two genuinely different solutions.

Therefore:

```text
6 Fighters
   ↓
Semantic + structural comparison
   ↓
Solution clusters
```

Example:

```text
Cluster A
F1 F3 F6

Cluster B
F2

Cluster C
F4 F5
```

One or more champions are selected from each distinct cluster.

This prevents wasting arena compute on duplicate arguments.

---

# 8. Fighter Types

Ordinary fighters should not receive artificial personalities.

They solve the same problem independently.

Specialized combat agents can additionally enter the arena.

## Counterexample Hunter

Mission:

> Find the smallest counterexample capable of invalidating an opponent's claim.

## Assumption Assassin

Builds an assumption dependency graph and targets high-centrality assumptions.

## Boundary Hunter

Tests solutions under extreme, edge, scale, adversarial, and degenerate conditions.

## Simplifier

Attempts to demonstrate that competing solutions are unnecessarily complicated.

## Red-Team Fighter

Targets:

- security
- misuse
- fault tolerance
- operational failure
- adversarial behaviour

## Alternative-Framing Fighter

Attempts to solve the problem under a fundamentally different formulation.

## Wildcard Fighter

Receives a larger exploration budget to discover unconventional solution families.

These agents act as **combat roles**, not theatrical personalities.

---

# 9. Claim Graph

Every fighter's position is decomposed into structured claims.

Example:

```text
THESIS A
│
├── C1
│   ├── C1.1
│   └── C1.2
│
├── C2
│   ├── C2.1
│   └── C2.2
│
└── C3
```

Each claim contains:

```json
{
  "claim_id": "F2-C7",
  "fighter_id": "F2",
  "statement": "...",
  "type": "empirical",
  "importance": 0.82,
  "dependencies": ["F2-C2", "F2-C5"],
  "status": "alive"
}
```

This Claim Graph becomes one of the core internal representations.

---

# 10. Attack Graph

Attacks are also structured objects.

```json
{
  "attack_id": "A-441",
  "attacker": "F3",
  "target": "F2-C7",
  "attack_type": "counterexample",
  "argument": "...",
  "severity": "critical",
  "status": "pending"
}
```

This allows the system to understand which parts of an argument are under pressure.

---

# 11. Combat Moves

Agents should not simply generate unlimited rebuttal text.

Each fighter receives a finite combat budget.

Possible moves include:

## Logical Attack

Shows that the conclusion does not follow from the premises.

## Assumption Attack

Challenges an unstated or weak assumption.

## Counterexample Attack

Produces a case where the opponent's rule or proposal breaks.

## Empirical Challenge

Demands external supporting evidence.

## Calculation Challenge

Requires deterministic numerical verification.

## Execution Challenge

Requires code or algorithm execution.

## Experiment Challenge

Requests an experiment or simulation.

## Alternative Attack

Demonstrates that another solution dominates the opponent.

## Consistency Trap

Exposes internal contradiction.

## Boundary Attack

Pushes the solution into scale or edge conditions.

## Dependency Attack

Targets a claim on which many downstream claims depend.

---

# 12. Combat Budget

Example fighter budget per round:

```text
Major attacks          3
Minor attacks          5
Evidence challenges    2
Cross examinations     3
Tool challenges        2
Counterattacks         3
```

Agents must choose **where to spend attacks**.

This turns debate into strategic reasoning rather than endless text generation.

---

# 13. Target Selection

Agents should identify opponent weaknesses using:

- claim importance
- uncertainty
- number of dependents
- weak evidence
- contradictory assumptions
- logical centrality
- potential knockout value

Priority can approximate:

\[
Priority(C_i)
=
Importance_i
\times
Weakness_i
\times
DependencyCentrality_i
\]

The agent can still override the ranking if it discovers a strategically better attack.

---

# 14. Defense Protocol

When attacked, the fighter has four valid responses.

## DEFEND

Show why the claim survives.

## CONCEDE

Accept that the claim failed.

## REVISE

Replace or modify the claim.

## COUNTERATTACK

Show that the attack relies on a false assumption or incorrect inference.

Example:

```json
{
  "response": "revise",
  "target_attack": "A-441",
  "old_claim": "F2-C7",
  "replacement_claim": "F2-C7-R1",
  "reason": "Original assumption does not hold for N > 10^6."
}
```

---

# 15. Rewarding Honest Correction

Agents must not be incentivized to defend nonsense.

Therefore:

```text
correct concession      → small positive score
successful revision     → positive score
failed bluff            → major penalty
fabricated evidence     → severe penalty
evasive response        → penalty
successful defense      → strong reward
```

A fighter that repairs its theory should beat a fighter that protects a false argument.

---

# 16. Cross-Examination Engine

Cross-examination forces narrow commitments.

Supported question modes:

```text
YES / NO
NUMBER
FORMULA
CHOOSE A / B
CODE OUTPUT
PRODUCE COUNTEREXAMPLE
PROVIDE EVIDENCE
STATE ASSUMPTION
```

Example:

```text
Fighter A:
Does your algorithm preserve O(n log n)
when memory is restricted to O(1)?

Required response:
YES or NO
+ maximum 3-line justification
```

This prevents rhetorical evasion.

---

# 17. Tool Pit

When argument alone is insufficient, fighters can invoke deterministic or external tools.

```text
                 TOOL BROKER
                      │
   ┌──────────────────┼─────────────────────┐
   │                  │                     │
 Search             Python                Shell
   │                  │                     │
 datasets           maths                  tests
 papers             simulations            builds
 docs               optimisation           benchmarks
 APIs               statistics             static analysis
```

Potential integrations:

- web search
- browser
- Python
- isolated shell
- compilers
- database queries
- symbolic mathematics
- SAT/SMT solvers
- optimization solvers
- simulation frameworks
- benchmark harnesses

---

# 18. Shared Evidence

Tool output becomes immutable shared arena evidence.

```text
Tool run T42
Input: ...
Output: ...
Hash: ...
Generated by: ...
Timestamp: ...
```

No fighter owns the result.

All remaining fighters may use it.

---

# 19. Tool Arbitration

The Referee can reject invalid tool challenges.

Examples:

- redundant experiment
- irrelevant benchmark
- excessive computation
- attempt to access unauthorized resource
- challenge already conclusively resolved

This prevents intentional resource exhaustion.

---

# 20. Claim Damage System

Each claim receives:

- structural importance
- attack pressure
- surviving defenses
- verified contradictions
- dependent claims

A conceptual damage function:

\[
D(C_i)
=
W_i
\sum_j
A_{ij}V_{ij}
-
R_i
\]

Where:

- \(W_i\) = structural importance
- \(A_{ij}\) = strength of attack \(j\)
- \(V_{ij}\) = validity of attack
- \(R_i\) = defense strength

The exact scoring function should later be calibrated experimentally rather than treated as absolute truth.

---

# 21. Dependency Collapse

This is one of the most important features.

Example:

```text
C2  ✗
│
├── C4  ✗
│   ├── C8  ✗
│   └── C9  ✗
│
└── C5  ✗
```

If the foundation of a proposal fails, dependent claims become invalid or require re-derivation.

This enables **argument knockouts**.

---

# 22. Fighter Health

Instead of scoring only writing quality, track structural health.

```text
Fighter A

Claims
21 total

17 alive
2 revised
1 disputed
1 destroyed

Critical assumptions
4 / 5 surviving

Attack success
63%

Defense success
81%

Tool-supported claims
7

Contradictions
0
```

The actual thesis graph determines survivability.

---

# 23. Elimination

A fighter may be eliminated when:

- root thesis collapses
- too many critical claims fail
- solution becomes dominated
- contradictions remain unresolved
- required constraints cannot be met
- argument becomes equivalent to a stronger surviving fighter
- judge panel determines it has lost pairwise

Elimination should not happen merely because another agent sounds better.

---

# 24. Evolutionary Respawning

Failed agents can contribute useful ideas.

Example:

```text
Fighter C
   │
   ├── useful idea 1
   ├── useful idea 2
   └── fatal flaw
         │
         ▼
mutation engine
         │
         ▼
Fighter C'
```

C' receives:

- strong components of C
- reason C failed
- selected useful ideas from surviving opponents
- new exploration strategy

But it should not receive irrelevant debate history.

---

# 25. Mutation Strategies

New challengers can be produced through:

```text
repair mutation
alternative-assumption mutation
simplification mutation
hybrid mutation
constraint inversion
architecture substitution
counterexample-driven redesign
high-risk exploration
```

This creates evolutionary improvement rather than repeated regeneration.

---

# 26. Arena Modes

## Duel

```text
2 fighters
lowest cost
```

Useful for:

- architecture A vs B
- algorithm comparison
- proposal comparison

## Battle Royale

```text
4–8 fighters
everyone may attack everyone
```

Useful for open-ended problems.

## Tournament

```text
16+ candidates
group stages
pairwise elimination
final
```

Useful when solution space is large.

## King of the Hill

```text
Champion
   ↑
continuous challengers
```

Useful for continuously improving a solution.

## Boss Raid

```text
          Proposed Solution
          ↑ ↑ ↑ ↑ ↑
        attacking agents
```

Useful for:

- security review
- architecture review
- design validation

## Team War

```text
Team A                 Team B
A1 A2 A3       VS      B1 B2 B3
```

Agents cooperate internally while fighting externally.

---

# 27. Arena Scheduler

Not every fighter should execute simultaneously forever.

The scheduler prioritizes turns based on:

- unresolved attacks
- high-centrality claims
- potential knockout
- information gain
- tool availability
- fighter health
- remaining combat budget

A useful scheduling objective is:

\[
Priority =
InformationGain
\times
Impact
\times
Urgency
/
ExpectedCost
\]

This should outperform simple round-robin scheduling.

---

# 28. Referee Engine

The Referee enforces protocol.

It does **not** decide which thesis is correct.

Responsibilities:

- enforce turn limits
- enforce combat budget
- enforce schemas
- identify illegal moves
- resolve duplicate attacks
- control tools
- detect evasion
- prevent circular debate
- terminate dead arguments
- invoke judges when appropriate
- maintain match state

---

# 29. Referee vs Judge

These roles must remain separate.

```text
REFEREE
"Was the move legal?"

JUDGE
"Which argument survived better?"
```

Mixing them introduces significant bias.

---

# 30. Blind Judge Panel

Use several judges.

Before judging:

```text
REMOVE
- fighter identity
- model identity
- previous Elo
- generation order
- vendor identity
```

The judges receive:

- surviving claims
- attacks
- successful defenses
- concessions
- revisions
- tool evidence
- unresolved issues

Not raw internal reasoning.

---

# 31. Pairwise Judging

For survivors:

```text
A vs B
A vs C
B vs C
```

Each comparison determines:

- correctness
- completeness
- robustness
- constraint satisfaction
- surviving attacks
- implementation quality
- evidence/tool support

---

# 32. Ranking

Use a probabilistic pairwise ranking model such as Bradley–Terry.

\[
P(A>B)
=
\frac{e^{r_A}}
{e^{r_A}+e^{r_B}}
\]

Then derive final rankings.

Long-term arena statistics can additionally maintain:

- Elo
- TrueSkill-style ratings
- domain-specific ratings
- attacker rating
- defender rating
- tool-use rating
- counterexample rating

---

# 33. Combat Scoring

Illustrative scoring:

\[
Score =
2R
+
1.5D
+
1.5A
+
1.2E
+
N
+
C
-
2F
-
1.5X
-
0.5V
\]

Where:

- \(R\) = reasoning
- \(D\) = successful defenses
- \(A\) = successful attacks
- \(E\) = tool/evidence support
- \(N\) = useful novel discoveries
- \(C\) = valid correction/concession
- \(F\) = false claims
- \(X\) = contradictions
- \(V\) = evasion

The initial values are configuration parameters only.

They must later be calibrated using benchmark results.

---

# 34. Final Synthesis

The synthesis engine receives:

```text
champion thesis
surviving claims
strong runner-up ideas
verified tool results
unresolved disputes
destroyed assumptions
minority surviving alternatives
```

It produces:

```text
Recommended solution

Why it survived

Major attacks it survived

Important revisions

Where alternative solutions were stronger

Remaining unresolved issues

Confidence / robustness indicators
```

It must not falsely turn disagreement into consensus.

---

# 35. Final Output Model

Example:

```text
WINNER
Architecture A

Survival score
87 / 100

Critical claims surviving
12 / 13

Strongest successful attack
...

Strongest successful defense
...

Runner-up
Architecture C

C is preferable if:
...

Destroyed solution
Architecture B

Reason:
root assumption B-C4 failed during simulation.

Unresolved:
...
```

---

# 36. Full Arena State

```python
class ArenaState:
    problem
    task_analysis

    arena_config
    round_number

    fighters
    fighter_configs
    teams

    positions
    clusters

    claims
    claim_dependencies

    attacks
    defenses
    concessions
    revisions
    counterattacks

    cross_examinations

    tool_requests
    tool_results
    evidence

    combat_budgets

    fighter_health
    claim_health

    eliminated_fighters
    surviving_fighters

    mutations
    descendants

    judge_votes
    pairwise_results
    rankings

    final_result
```

---

# 37. Storage Architecture

Use PostgreSQL as the system of record.

Core entities:

```text
arenas
fighters
rounds
claims
claim_dependencies
attacks
defenses
cross_examinations
tool_runs
evidence
mutations
judgements
rankings
outputs
```

Use JSONB for flexible structured payloads where schemas may evolve.

---

# 38. Runtime Infrastructure

Recommended stack:

| Component | Technology |
|---|---|
| Frontend | Next.js + TypeScript |
| API | FastAPI |
| Core arena runtime | custom Python engine |
| Workflow/state orchestration | LangGraph where useful |
| Database | PostgreSQL |
| Cache / temporary state | Redis |
| Object storage | S3-compatible |
| Model interface | LiteLLM-style abstraction |
| Schemas | Pydantic |
| Tool execution | ephemeral containers / microVMs |
| Telemetry | OpenTelemetry |
| Event streaming | SSE/WebSockets |
| Background execution | durable workflow engine when needed |

LangGraph should help with execution/state management but **must not define the conceptual architecture**.

The Arena Engine remains the domain core.

---

# 39. Arena Engine Internal Modules

```text
arena/
├── analyzer/
├── constructor/
├── matchmaking/
├── fighters/
├── clustering/
├── claims/
├── attacks/
├── defenses/
├── cross_exam/
├── tools/
├── referee/
├── scoring/
├── health/
├── elimination/
├── evolution/
├── judges/
├── ranking/
├── synthesis/
└── telemetry/
```

---

# 40. Model Gateway

Agents should never directly invoke model-provider SDKs.

```text
Arena
  │
  ▼
Model Gateway
  │
  ├── Provider A
  ├── Provider B
  ├── Local Model
  └── Provider C
```

Gateway responsibilities:

- provider abstraction
- routing
- retries
- quotas
- cost tracking
- latency tracking
- structured output validation
- model capability registry
- fallback
- tracing

---

# 41. Fighter Model Selection

Each model has capability metadata.

```json
{
  "model": "...",
  "reasoning": 0.91,
  "coding": 0.82,
  "tool_use": 0.88,
  "long_context": 0.95,
  "latency": 0.53,
  "cost": 0.64
}
```

The Arena Constructor assigns models based on the problem.

Model diversity should be intentionally maximized subject to cost and quality constraints.

---

# 42. Tool Sandbox Architecture

```text
Agent
  │
Tool Request
  │
  ▼
Tool Broker
  │
  ▼
Permission Engine
  │
  ▼
Ephemeral Sandbox
  ├── CPU quota
  ├── RAM quota
  ├── time limit
  ├── network policy
  ├── isolated filesystem
  └── no platform secrets
```

Every execution should be disposable.

---

# 43. Context Isolation

Agents should only see relevant arena information.

### Initial fighter

```text
problem
constraints
tool permissions
```

### Attacker

```text
target fighter's public claims
necessary dependencies
shared evidence
```

### Defender

```text
attack
own relevant claims
shared evidence
```

### Judge

```text
anonymized surviving argument structure
combat record
tool evidence
```

This reduces anchoring and irrelevant context growth.

---

# 44. Memory Architecture

Use three memory scopes.

## Match Memory

Exists only for current arena.

## Fighter Memory

Contains fighter's own relevant argument evolution.

## Global Arena Memory

Contains historical performance statistics:

```text
which strategies work
which model combinations diversify reasoning
which attack types expose failures
which judges show bias
which tools resolve disputes
```

Global memory should inform matchmaking without exposing previous answers to fighters.

---

# 45. UI Architecture

The UI should visually feel like an intellectual fighting arena.

Primary screen:

```text
┌────────────────────────────────────────────────────────────┐
│ Problem                                                    │
├──────────────┬─────────────────────────────┬───────────────┤
│ Fighters     │         ARENA               │ Claim Graph   │
│              │                             │               │
│ A  █████     │ A ─────⚔───── B             │ C1 ●          │
│ B  ████      │      ↘     ↙                │ ├─ C2 ●       │
│ C  ██        │        C                    │ └─ C3 ✕       │
│              │                             │               │
├──────────────┴─────────────────────────────┴───────────────┤
│ Timeline                                                   │
│ A attacked B-C4                                            │
│ B challenged A-C7                                          │
│ Python test disproved B-C4                                 │
│ B revised thesis                                           │
└────────────────────────────────────────────────────────────┘
```

---

# 46. Claim Graph UI

Represent claims as a live graph.

States:

```text
● alive
◐ attacked
◆ defended
△ disputed
↻ revised
✕ destroyed
```

When a root claim dies, dependent nodes visually collapse.

This should become one of the signature features of the platform.

---

# 47. Combat Timeline

Expose:

```text
Round 1
A attacked B-C4

B defended

C issued execution challenge

Tool T12 completed

B-C4 destroyed

B revised C4 → C4-R1
```

Avoid displaying hidden model chain-of-thought.

Expose structured moves and results instead.

---

# 48. Fighter Cards

Each fighter shows:

- thesis
- health
- claims alive
- attacks landed
- defenses won
- revisions
- tool wins
- remaining combat resources

Example:

```text
Fighter A
──────────
Health          87
Claims          18/20
Attack rate     71%
Defense rate    83%

Major attacks   1/3 remaining
Tool challenge  0/2 remaining
```

---

# 49. Arena Replay

Every match should be deterministic enough to inspect retrospectively.

Allow the user to replay:

- attack sequence
- claim destruction
- revisions
- tool runs
- elimination
- judging

This is useful for debugging and research.

---

# 50. Termination Conditions

The arena terminates when any combination of the following occurs:

```text
one dominant solution remains

maximum rounds reached

no meaningful new attacks found

all critical claims resolved

information gain falls below threshold

tool budget exhausted

judge ranking stabilizes
```

This prevents infinite fights.

---

# 51. Anti-Degeneration Measures

## Repetition Detection

Reject semantically duplicate attacks.

## Evasion Detection

Cross-examination answers must satisfy required format.

## Circular Debate Detection

Track repeated claim/attack cycles.

## Bluff Penalties

Claims contradicted by tools receive strong penalties.

## Argument Inflation Prevention

Agents cannot generate arbitrary numbers of claims merely to dilute damage.

## Attack Spam Prevention

Combat budgets constrain volume.

## Judge Bias Detection

Rotate presentation order and anonymize fighters.

---

# 52. Cost Control

Dynamic compute allocation:

```text
cheap first-pass fighters
        ↓
eliminate duplicates
        ↓
spend expensive reasoning only on survivors
        ↓
invoke tools only for consequential disputes
        ↓
expensive judges only at final stages
```

This is critical.

A 16-agent arena does not mean running 16 frontier models for the entire match.

---

# 53. Adaptive Arena Scaling

Simple question:

```text
2 fighters
1 round
1 judge
```

Complex architecture problem:

```text
6 fighters
4 rounds
3 specialized attackers
3 judges
tool access
mutation
```

Extreme research problem:

```text
12+ candidate generators
clustering
tournament
boss attacks
tool verification
evolution
5+ judges
```

---

# 54. Benchmarking Framework

The system itself must be tested adversarially.

Benchmarks should include:

- mathematical reasoning
- algorithm design
- architecture design
- coding
- scientific reasoning
- causal reasoning
- planning
- ambiguous problems
- adversarial questions
- questions containing false assumptions

Compare against:

```text
single-model baseline
best-of-N
majority vote
simple debate
reflection
multi-agent consensus
Arena Engine
```

---

# 55. Core Metrics

Track:

```text
final-answer accuracy
attack precision
attack usefulness
defense correctness
counterexample discovery
false-defense rate
successful self-correction
tool challenge usefulness
root-flaw discovery
solution diversity
judge consistency
judge bias
performance gain over best-of-N
compute cost
latency
```

Most important:

> **Does adversarial combat produce better solutions than simply spending the same compute on more independent samples?**

If the answer is no, the arena has failed regardless of how impressive the UI looks.

---

# 56. Ablation Testing

Remove individual components and measure impact:

```text
Arena without cross-examination
Arena without evolution
Arena without claim graphs
Arena without specialist fighters
Arena without tools
Arena without blind judging
Arena without dependency collapse
```

This determines which mechanisms actually produce value.

---

# 57. Development Phases

## Phase 1 — Core Arena

Build:

- FastAPI
- PostgreSQL
- model gateway
- fighter runtime
- claims
- attacks
- defenses
- referee
- two-fighter duel

Target:

A working structured adversarial duel.

---

## Phase 2 — Claim/Attack Graph

Build:

- atomic claim extraction
- dependencies
- claim health
- attacks
- revisions
- dependency collapse
- visualization

Target:

Arguments become machine-addressable structures.

---

## Phase 3 — Combat Mechanics

Add:

- limited combat resources
- attack strategies
- defense protocol
- cross-examination
- concessions
- counterattacks
- evasion detection

Target:

Debate becomes genuine structured combat.

---

## Phase 4 — Tool Pit

Add:

- Python
- shell
- search
- benchmark execution
- simulations
- shared evidence

Target:

Agents can settle disputes experimentally.

---

## Phase 5 — Multi-Fighter Arena

Add:

- 4–8 fighters
- clustering
- champion selection
- battle royale
- tournament
- scheduling

---

## Phase 6 — Judges & Ranking

Add:

- anonymization
- multiple judges
- pairwise comparison
- Bradley–Terry ranking
- persistent fighter ratings

---

## Phase 7 — Evolution

Add:

- failed-fighter analysis
- mutation
- respawning
- hybrid solutions
- King of the Hill

---

## Phase 8 — Advanced Arena

Add:

- specialist combat agents
- Boss Raid
- Team War
- automatic arena configuration
- adaptive compute
- historical meta-learning

---

# 58. Core MVP

The first serious MVP should already contain:

```text
Problem Analyzer
      ↓
4 independent fighters
      ↓
solution clustering
      ↓
3–4 distinct champions
      ↓
Claim Graph
      ↓
2 structured combat rounds
      ↓
cross examination
      ↓
Python + search Tool Pit
      ↓
claim destruction/revision
      ↓
3 blind judges
      ↓
pairwise ranking
      ↓
winner + runner-up + unresolved disputes
```

Do **not** postpone the fighting mechanics and build a generic chatbot first.

The arena itself is the product.

---

# 59. Final Core Pipeline

```text
INPUT
 │
 ▼
Problem Analysis
 │
 ▼
Arena Configuration
 │
 ▼
Independent Fighter Generation
 │
 ▼
Position Clustering
 │
 ▼
Champion Selection
 │
 ▼
Claim Graph Construction
 │
 ▼
═══════════════ ARENA ═══════════════
 │
 ├─ attack
 ├─ defense
 ├─ counterattack
 ├─ cross examination
 ├─ tool challenge
 ├─ concession
 └─ revision
 │
 ▼
Claim Damage + Dependency Propagation
 │
 ├─ survive
 ├─ revise
 └─ eliminate
 │
 ▼
Evolutionary Challenger Generation
 │
 ▼
Further Combat
 │
 ▼
Blind Pairwise Judging
 │
 ▼
Ranking
 │
 ▼
Final Synthesis
 │
 ▼
Winner
Runner-up
Surviving alternatives
Destroyed assumptions
Unresolved questions
Combat trace
```

---

# 60. Product Identity

The conceptual model should remain:

> **An adversarial search engine over reasoning space.**

LLMs are the fighters.

Claims are the combat surface.

Attacks are search operators.

Tools provide environmental feedback.

The Referee enforces the protocol.

The Claim Graph records structural damage.

Evolution explores improved variants.

Judges rank survivors.

The Synthesizer turns the strongest surviving argument structure into the final usable result.

The system therefore does not obtain quality by asking several models to agree.

It obtains quality by forcing competing solutions to **survive systematic attempts to destroy them**.