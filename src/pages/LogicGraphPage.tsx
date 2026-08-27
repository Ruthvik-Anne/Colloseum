import { useState } from "react";
import clsx from "clsx";
import { useArenaStore } from "../store/arenaStore";
import { useArenaTicker } from "../store/useArenaTicker";
import { EmptyState } from "../components/EmptyState";
import { RunPicker } from "../components/RunPicker";
import { ClaimNodeCard } from "../components/ClaimNodeCard";
import { Icon } from "../components/Icon";
import { CLAIM_STATUS_ICON, CLAIM_STATUS_COLOR } from "../lib/fighterUi";
import type { ClaimStatus } from "../types";

const LEGEND: { status: ClaimStatus; label: string }[] = [
  { status: "alive", label: "Alive" },
  { status: "attacked", label: "Attacked" },
  { status: "defended", label: "Defended" },
  { status: "disputed", label: "Disputed" },
  { status: "revised", label: "Revised" },
  { status: "destroyed", label: "Destroyed" },
];

export function LogicGraphPage() {
  const order = useArenaStore((s) => s.order);
  const runs = useArenaStore((s) => s.runs);
  const [selected, setSelected] = useState<string | null>(null);

  const effectiveId = selected ?? order[0];
  const run = effectiveId ? runs[effectiveId] : undefined;
  useArenaTicker(run && run.status !== "concluded" ? run.id : undefined);

  if (order.length === 0) {
    return <EmptyState message="No claim graphs yet. Launch an arena to begin decomposing positions into claims." />;
  }

  const runList = order.map((id) => runs[id]).filter(Boolean);

  return (
    <main className="flex-1 p-stack-md md:p-margin-desktop flex flex-col gap-stack-lg">
      <div className="flex flex-wrap items-center justify-between gap-stack-md">
        <h1 className="text-2xl font-bold text-deep-slate uppercase tracking-tight">Logic Graph</h1>
        <RunPicker runs={runList} selectedId={effectiveId ?? null} onSelect={setSelected} />
      </div>

      {run && (
        <>
          <div className="flex flex-wrap gap-stack-md bg-surface-container-low border border-outline-variant rounded-lg px-stack-md py-stack-sm">
            {LEGEND.map((l) => (
              <div key={l.status} className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest">
                <span className={clsx("text-sm", CLAIM_STATUS_COLOR[l.status])}>{CLAIM_STATUS_ICON[l.status]}</span>
                <span className="text-secondary">{l.label}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-stack-lg">
            {run.fighters.map((fighter) => {
              const claims = run.claims.filter((c) => c.fighterId === fighter.id);
              const thesis = claims.find((c) => c.importance === 1);
              const rest = claims.filter((c) => c.importance !== 1);
              return (
                <div
                  key={fighter.id}
                  className={clsx(
                    "bg-surface-lab border rounded-lg overflow-hidden shadow-sm flex flex-col",
                    fighter.eliminated ? "border-outline-variant opacity-60" : "border-outline-variant"
                  )}
                >
                  <div className="px-stack-md py-stack-sm bg-surface-code border-b border-outline-variant flex items-center justify-between">
                    <span className="font-mono text-xs text-deep-slate uppercase tracking-widest flex items-center gap-2">
                      <Icon name="hub" size={14} />
                      {fighter.name}
                    </span>
                    <span className="font-mono text-[10px] text-secondary">{claims.length} claims</span>
                  </div>
                  <div className="p-stack-md space-y-stack-sm">
                    {thesis && <ClaimNodeCard claim={thesis} />}
                    <div className="pl-stack-md border-l-2 border-outline-variant/60 ml-2 space-y-stack-sm">
                      {rest.map((c) => (
                        <ClaimNodeCard key={c.id} claim={c} />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </main>
  );
}
