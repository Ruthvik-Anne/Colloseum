import clsx from "clsx";
import type { ArenaRun } from "../types";
import { ATTACK_TYPE_LABEL } from "../lib/fighterUi";
import { StatusChip } from "./StatusChip";

const OUTCOME_VARIANT = {
  pending: "neutral",
  defended: "success",
  landed: "error",
  conceded: "warning",
} as const;

export function ReasoningTimeline({ run }: { run: ArenaRun }) {
  const fighterMap = new Map(run.fighters.map((f) => [f.id, f]));

  if (run.attacks.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-secondary font-mono text-xs">
        combat has not begun
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-stack-md space-y-2">
      {[...run.attacks].reverse().map((atk) => {
        const claim = run.claims.find((c) => c.id === atk.targetClaimId);
        return (
          <div key={atk.id} className="bg-surface-lab border border-outline-variant rounded-md p-stack-sm">
            <div className="flex items-center justify-between mb-1 gap-2">
              <span className="font-mono text-xs text-deep-slate">
                <span className="text-primary-container">{fighterMap.get(atk.attackerId)?.name}</span>
                {" → "}
                <span className="text-secondary">{fighterMap.get(atk.targetFighterId)?.name}</span>
              </span>
              <StatusChip variant={OUTCOME_VARIANT[atk.status]}>{atk.status}</StatusChip>
            </div>
            <p className="text-xs text-on-surface-variant leading-snug">{atk.argument}</p>
            <div className="mt-1 flex items-center gap-2 flex-wrap">
              <span className="font-mono text-[9px] text-secondary uppercase tracking-widest">
                {ATTACK_TYPE_LABEL[atk.type]}
              </span>
              <span
                className={clsx(
                  "font-mono text-[9px] uppercase tracking-widest",
                  atk.severity === "critical" ? "text-error" : atk.severity === "major" ? "text-warning" : "text-secondary"
                )}
              >
                {atk.severity}
              </span>
              {claim && <span className="font-mono text-[9px] text-outline">target {claim.id}</span>}
              <span className="font-mono text-[9px] text-outline">round {atk.round}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
