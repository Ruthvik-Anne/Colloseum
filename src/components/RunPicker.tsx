import type { ArenaRun } from "../types";
import { Icon } from "./Icon";
import { StatusChip } from "./StatusChip";

const STATUS_VARIANT = {
  queued: "neutral",
  running: "cyan",
  judging: "warning",
  concluded: "success",
} as const;

export function RunPicker({
  runs,
  selectedId,
  onSelect,
}: {
  runs: ArenaRun[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon name="dns" size={16} className="text-secondary" />
      <select
        value={selectedId ?? ""}
        onChange={(e) => onSelect(e.target.value)}
        className="bg-surface-lab border border-outline-variant rounded-md font-mono text-xs px-2 py-1.5 text-deep-slate focus:outline-none input-glow"
      >
        {runs.map((run) => (
          <option key={run.id} value={run.id}>
            {run.tag} · {run.id} · {run.status}
          </option>
        ))}
      </select>
      {selectedId && (
        <StatusChip variant={STATUS_VARIANT[runs.find((r) => r.id === selectedId)?.status ?? "queued"]}>
          {runs.find((r) => r.id === selectedId)?.status}
        </StatusChip>
      )}
    </div>
  );
}
