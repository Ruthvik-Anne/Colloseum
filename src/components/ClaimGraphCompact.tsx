import type { ArenaRun } from "../types";
import { ClaimNodeCard } from "./ClaimNodeCard";

export function ClaimGraphCompact({ run }: { run: ArenaRun }) {
  const touched = run.claims.filter((c) => c.status !== "alive");
  const rest = run.claims.filter((c) => c.status === "alive").sort((a, b) => b.importance - a.importance);
  const visible = [...touched.slice(-4), ...rest].slice(0, 6);

  const fighterMap = new Map(run.fighters.map((f) => [f.id, f]));

  if (visible.length === 0) {
    return <div className="flex-1 flex items-center justify-center text-secondary font-mono text-xs">no claims yet</div>;
  }

  return (
    <div className="flex-1 p-stack-md overflow-y-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-stack-sm">
        {visible.map((claim) => (
          <ClaimNodeCard
            key={claim.id}
            claim={claim}
            fighter={fighterMap.get(claim.fighterId)}
            active={claim.status === "attacked" || claim.status === "disputed"}
          />
        ))}
      </div>
    </div>
  );
}
