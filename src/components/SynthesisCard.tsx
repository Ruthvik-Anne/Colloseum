import type { ArenaRun } from "../types";
import { Icon } from "./Icon";

export function SynthesisCard({ run }: { run: ArenaRun }) {
  const result = run.result;
  if (!result) return null;
  const winner = run.fighters.find((f) => f.id === result.winnerId);
  const runnerUp = run.fighters.find((f) => f.id === result.runnerUpId);
  const destroyed = run.fighters.filter((f) => result.destroyedIds.includes(f.id));

  return (
    <section className="w-full bg-surface-lab border border-accent-cyan/50 rounded-lg shadow-[0_0_20px_rgba(0,209,255,0.1)] overflow-hidden">
      <div className="px-stack-md py-stack-sm border-b border-outline-variant flex items-center justify-between bg-surface-code">
        <div className="font-mono text-xs text-deep-slate flex items-center gap-2 uppercase tracking-widest">
          <Icon name="verified" size={16} className="text-accent-cyan" />
          Final Synthesis :: {run.tag}
        </div>
        <span className="font-mono text-xs text-secondary">SURVIVAL {result.survivalScore}/100</span>
      </div>
      <div className="p-stack-md grid grid-cols-1 md:grid-cols-2 gap-stack-lg">
        <div className="space-y-stack-md">
          <div>
            <div className="font-mono text-[10px] text-accent-cyan uppercase tracking-widest mb-1">Winner</div>
            <div className="text-xl font-bold text-deep-slate">{winner?.name}</div>
            <p className="text-sm text-on-surface-variant mt-1">{winner?.thesis}</p>
          </div>
          <div>
            <div className="font-mono text-[10px] text-secondary uppercase tracking-widest mb-1">Runner-up</div>
            <div className="text-sm font-semibold text-deep-slate">{runnerUp?.name}</div>
            <p className="text-xs text-on-surface-variant mt-1">{runnerUp?.thesis}</p>
          </div>
          {destroyed.length > 0 && (
            <div>
              <div className="font-mono text-[10px] text-error uppercase tracking-widest mb-1">Destroyed</div>
              <ul className="text-xs text-on-surface-variant space-y-0.5">
                {destroyed.map((f) => (
                  <li key={f.id}>{f.name} — root thesis collapsed under attack.</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="space-y-stack-md">
          <div>
            <div className="font-mono text-[10px] text-secondary uppercase tracking-widest mb-1">
              Strongest Attack
            </div>
            <p className="text-xs text-on-surface-variant">{result.strongestAttack}</p>
          </div>
          <div>
            <div className="font-mono text-[10px] text-secondary uppercase tracking-widest mb-1">
              Strongest Defense
            </div>
            <p className="text-xs text-on-surface-variant">{result.strongestDefense}</p>
          </div>
          {result.unresolved.length > 0 && (
            <div>
              <div className="font-mono text-[10px] text-warning uppercase tracking-widest mb-1">Unresolved</div>
              <ul className="text-xs text-on-surface-variant space-y-0.5 list-disc list-inside">
                {result.unresolved.map((u, i) => (
                  <li key={i}>{u}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
