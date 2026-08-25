import { Link } from "react-router-dom";
import { useArenaStore } from "../store/arenaStore";
import { EmptyState } from "../components/EmptyState";
import { StatusChip } from "../components/StatusChip";
import { Icon } from "../components/Icon";

const STATUS_VARIANT = {
  queued: "neutral",
  running: "cyan",
  judging: "warning",
  concluded: "success",
} as const;

function formatDate(ts: number) {
  return new Date(ts).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ArchivePage() {
  const order = useArenaStore((s) => s.order);
  const runs = useArenaStore((s) => s.runs);

  if (order.length === 0) {
    return <EmptyState icon="inventory_2" message="Archive is empty. Concluded and active sessions will appear here." />;
  }

  return (
    <main className="flex-1 p-stack-md md:p-margin-desktop flex flex-col gap-stack-lg">
      <h1 className="text-2xl font-bold text-deep-slate uppercase tracking-tight">Archive</h1>

      <div className="flex flex-col gap-stack-sm">
        {order.map((id) => {
          const run = runs[id];
          if (!run) return null;
          const winner = run.result ? run.fighters.find((f) => f.id === run.result!.winnerId) : null;
          return (
            <Link
              key={id}
              to={`/arena/${id}`}
              className="bg-surface-lab border border-outline-variant rounded-lg p-stack-md flex flex-col md:flex-row md:items-center gap-stack-sm md:gap-stack-md hover:border-accent-cyan transition-colors"
            >
              <div className="flex items-center gap-stack-sm md:w-40 shrink-0">
                <StatusChip variant={STATUS_VARIANT[run.status]}>{run.status}</StatusChip>
                <span className="font-mono text-[10px] text-secondary">{formatDate(run.createdAt)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-mono text-[10px] text-secondary uppercase tracking-widest mb-0.5">
                  {run.tag} · {run.id}
                </div>
                <p className="text-sm text-deep-slate truncate">{run.problem}</p>
              </div>
              <div className="flex items-center gap-stack-md shrink-0">
                {winner && (
                  <div className="flex items-center gap-1.5 font-mono text-xs text-primary-container">
                    <Icon name="workspace_premium" size={16} />
                    {winner.name}
                  </div>
                )}
                <span className="font-mono text-[10px] text-secondary">
                  {run.fighters.length} fighters · round {run.round}/{run.maxRounds}
                </span>
                <Icon name="chevron_right" size={18} className="text-secondary" />
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
