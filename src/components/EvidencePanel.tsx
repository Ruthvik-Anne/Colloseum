import type { ArenaRun } from "../types";
import { Icon } from "./Icon";

const TOOL_ICON: Record<string, string> = {
  search: "travel_explore",
  python: "terminal",
  shell: "dns",
};

export function EvidencePanel({ run }: { run: ArenaRun }) {
  const fighterMap = new Map(run.fighters.map((f) => [f.id, f]));

  if (run.toolRuns.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-secondary font-mono text-xs">
        no tool evidence submitted yet
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-stack-md space-y-2">
      {[...run.toolRuns].reverse().map((tr) => (
        <div key={tr.id} className="bg-surface-lab border border-outline-variant rounded-md p-stack-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="flex items-center gap-1.5 font-mono text-[10px] text-secondary uppercase tracking-widest">
              <Icon name={TOOL_ICON[tr.tool] ?? "build"} size={14} />
              {tr.tool} · {tr.id} · round {tr.round}
            </span>
            <span className="font-mono text-[10px] text-secondary">{fighterMap.get(tr.requestedBy)?.name}</span>
          </div>
          <p className="font-mono text-xs text-terminal-text">$ {tr.input}</p>
          <p className="font-mono text-xs text-primary-container mt-1">{tr.output}</p>
        </div>
      ))}
    </div>
  );
}
