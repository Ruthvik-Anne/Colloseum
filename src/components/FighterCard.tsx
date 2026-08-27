import clsx from "clsx";
import type { ArenaRun, Fighter } from "../types";
import { Icon } from "./Icon";
import { StatusChip } from "./StatusChip";
import { ROLE_LABEL } from "../engine/content";
import { STATUS_ICON, STATUS_LABEL, attackRate, defenseRate, healthColor } from "../lib/fighterUi";

export function FighterCard({ fighter, run }: { fighter: Fighter; run: ArenaRun }) {
  const claimsTotal = run.claims.filter((c) => c.fighterId === fighter.id).length;
  const claimsAlive = run.claims.filter((c) => c.fighterId === fighter.id && c.status !== "destroyed").length;
  const isWinner = run.result?.winnerId === fighter.id;

  return (
    <div
      className={clsx(
        "bg-surface-lab border rounded-lg p-stack-md",
        fighter.eliminated ? "border-outline-variant opacity-60" : "border-outline-variant",
        isWinner && "border-accent-cyan shadow-[0_0_0_1px_rgba(0,209,255,0.4)]"
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-stack-sm">
        <div className="flex items-center gap-2">
          <div
            className={clsx(
              "w-9 h-9 rounded-md flex items-center justify-center shrink-0",
              fighter.status === "speaking" ? "bg-primary-fixed text-primary-container" : "bg-surface-code text-secondary"
            )}
          >
            <Icon name={STATUS_ICON[fighter.status]} size={18} />
          </div>
          <div>
            <div className="font-mono text-sm text-deep-slate font-semibold flex items-center gap-1.5">
              {fighter.name}
              {isWinner && <Icon name="workspace_premium" size={14} className="text-accent-cyan" />}
            </div>
            <div className="font-mono text-[9px] text-secondary uppercase tracking-widest">{fighter.model}</div>
          </div>
        </div>
        <StatusChip variant={fighter.eliminated ? "error" : fighter.status === "speaking" ? "cyan" : "neutral"}>
          {STATUS_LABEL[fighter.status]}
        </StatusChip>
      </div>

      <p className="text-xs text-on-surface-variant mb-stack-sm leading-snug">{fighter.thesis}</p>

      <StatusChip variant="neutral" className="mb-stack-sm">
        {ROLE_LABEL[fighter.role]}
      </StatusChip>

      <div className="mb-stack-sm">
        <div className="flex justify-between font-mono text-[10px] text-secondary mb-1">
          <span>HEALTH</span>
          <span>{fighter.health}</span>
        </div>
        <div className="h-1.5 rounded-full bg-surface-container-highest overflow-hidden">
          <div
            className={clsx("h-full rounded-full transition-all", healthColor(fighter.health))}
            style={{ width: `${fighter.health}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 font-mono text-[11px] text-on-surface-variant">
        <Stat label="CLAIMS" value={`${claimsAlive}/${claimsTotal}`} />
        <Stat label="ATTACK RATE" value={`${attackRate(fighter)}%`} />
        <Stat label="DEFENSE RATE" value={`${defenseRate(fighter)}%`} />
        <Stat label="REVISIONS" value={fighter.revisions} />
        <Stat label="TOOL WINS" value={fighter.toolWins} />
        <Stat label="CONTRADICTIONS" value={fighter.contradictions} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between border-b border-outline-variant/60 pb-1">
      <span className="text-secondary">{label}</span>
      <span className="text-deep-slate font-semibold">{value}</span>
    </div>
  );
}
