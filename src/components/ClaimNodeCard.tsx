import clsx from "clsx";
import type { Claim, Fighter } from "../types";
import { CLAIM_STATUS_COLOR, CLAIM_STATUS_ICON, CLAIM_TYPE_LABEL } from "../lib/fighterUi";

export function ClaimNodeCard({
  claim,
  fighter,
  active,
  compact = false,
}: {
  claim: Claim;
  fighter?: Fighter;
  active?: boolean;
  compact?: boolean;
}) {
  return (
    <div
      className={clsx(
        "relative bg-surface-lab border rounded-md p-stack-sm overflow-hidden",
        active ? "border-accent-cyan shadow-sm" : "border-outline-variant",
        claim.status === "destroyed" && "opacity-50",
        compact ? "min-w-[180px]" : "w-full"
      )}
    >
      {active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent-cyan" />}
      <div className={clsx("flex items-center justify-between gap-2 mb-1", active && "ml-1")}>
        <span className="font-mono text-[9px] text-secondary uppercase tracking-widest truncate">
          {fighter ? `${fighter.name} · ` : ""}
          {claim.id}
        </span>
        <span className={clsx("font-mono text-xs shrink-0", CLAIM_STATUS_COLOR[claim.status])} title={claim.status}>
          {CLAIM_STATUS_ICON[claim.status]}
        </span>
      </div>
      <p className={clsx("text-sm text-deep-slate leading-snug", active && "ml-1")}>{claim.statement}</p>
      <div className={clsx("mt-1.5 flex items-center gap-2", active && "ml-1")}>
        <span className="font-mono text-[9px] text-secondary uppercase tracking-widest">
          {CLAIM_TYPE_LABEL[claim.type]}
        </span>
        <span className="font-mono text-[9px] text-outline">imp {claim.importance.toFixed(2)}</span>
      </div>
    </div>
  );
}
