import { useState } from "react";
import { useArenaStore } from "../store/arenaStore";
import { useArenaTicker } from "../store/useArenaTicker";
import { EmptyState } from "../components/EmptyState";
import { RunPicker } from "../components/RunPicker";
import { TerminalPanel } from "../components/TerminalPanel";
import { Icon } from "../components/Icon";

export function TerminalPage() {
  const order = useArenaStore((s) => s.order);
  const runs = useArenaStore((s) => s.runs);
  const [selected, setSelected] = useState<string | null>(null);

  const effectiveId = selected ?? order[0];
  const run = effectiveId ? runs[effectiveId] : undefined;
  useArenaTicker(run && run.status !== "concluded" ? run.id : undefined);

  if (order.length === 0) {
    return <EmptyState message="No transmissions logged yet. Launch an arena to open a live feed." />;
  }

  const runList = order.map((id) => runs[id]).filter(Boolean);

  return (
    <main className="flex-1 p-stack-md md:p-margin-desktop flex flex-col gap-stack-lg">
      <div className="flex flex-wrap items-center justify-between gap-stack-md">
        <h1 className="text-2xl font-bold text-deep-slate uppercase tracking-tight">Terminal</h1>
        <RunPicker runs={runList} selectedId={effectiveId ?? null} onSelect={setSelected} />
      </div>

      {!run && <EmptyState message="Select a session to view its terminal output." />}

      {run && (
        <div className="flex-1 bg-surface-code border border-outline-variant rounded-lg overflow-hidden shadow-sm flex flex-col min-h-[420px]">
          <div className="px-stack-md py-stack-sm border-b border-outline-variant flex justify-between items-center bg-surface-lab">
            <div className="font-mono text-xs text-deep-slate flex items-center gap-2 uppercase tracking-widest">
              <Icon name="terminal" size={16} />
              {run.tag} :: {run.id}
            </div>
            <div className="font-mono text-[10px] text-secondary">{run.terminal.length} lines</div>
          </div>
          <TerminalPanel lines={run.terminal} />
        </div>
      )}
    </main>
  );
}
