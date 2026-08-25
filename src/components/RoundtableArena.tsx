import clsx from "clsx";
import type { ArenaRun } from "../types";
import { Icon } from "./Icon";
import { STATUS_ICON, STATUS_LABEL } from "../lib/fighterUi";

function polarPosition(angleDeg: number, radiusPct: number) {
  const rad = (angleDeg * Math.PI) / 180;
  const x = 50 + radiusPct * Math.cos(rad);
  const y = 50 + radiusPct * Math.sin(rad);
  return { x, y };
}

export function RoundtableArena({ run }: { run: ArenaRun }) {
  const radius = 38;

  return (
    <div className="relative w-full h-[420px] md:h-[460px] grid-fade overflow-hidden">
      {/* connection lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
        {run.fighters.map((f) => {
          const { x, y } = polarPosition(f.angle, radius);
          const active = run.activeFighterId === f.id || run.speakingBubble?.fighterId === f.id;
          return (
            <line
              key={f.id}
              x1={x}
              y1={y}
              x2={50}
              y2={50}
              vectorEffect="non-scaling-stroke"
              stroke={active ? "#00D1FF" : "#e0e2e7"}
              strokeWidth={active ? 2 : 1.2}
              className={active ? "data-stream" : ""}
              opacity={f.eliminated ? 0.15 : 1}
            />
          );
        })}
      </svg>

      {/* core */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full bg-surface-lab border-2 border-deep-slate flex items-center justify-center shadow-[0_0_20px_rgba(26,36,56,0.12)]">
          <Icon name="memory" size={36} className="text-deep-slate animate-pulse" />
          <div className="absolute inset-0 rounded-full border border-accent-cyan animate-pulse-ring" />
        </div>
      </div>

      {/* fighters */}
      {run.fighters.map((f) => {
        const { x, y } = polarPosition(f.angle, radius);
        const speaking = f.status === "speaking";
        const bubble = run.speakingBubble?.fighterId === f.id ? run.speakingBubble.text : null;
        return (
          <div
            key={f.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-20 transition-all duration-500"
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            {bubble && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-surface-lab border border-accent-cyan rounded-lg p-2 shadow-[0_4px_15px_rgba(0,209,255,0.15)] animate-fade-in-up">
                <p className="font-mono text-[10px] leading-tight text-deep-slate">{bubble}</p>
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-accent-cyan" />
              </div>
            )}
            <div
              className={clsx(
                "flex items-center gap-2 rounded-lg border p-2 w-32 shadow-sm relative overflow-hidden bg-surface-lab",
                f.eliminated && "opacity-30 grayscale",
                speaking
                  ? "border-2 border-accent-cyan shadow-[0_0_15px_rgba(0,209,255,0.3)]"
                  : "border-outline-variant"
              )}
            >
              {speaking && <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent-cyan" />}
              <div
                className={clsx(
                  "w-8 h-8 rounded flex items-center justify-center shrink-0",
                  speaking ? "bg-primary-fixed text-primary-container" : "bg-surface-code text-secondary"
                )}
              >
                <Icon name={STATUS_ICON[f.status]} size={18} className={speaking ? "animate-bounce" : ""} />
              </div>
              <div className="font-mono text-[11px] text-deep-slate leading-tight truncate">
                {f.name}
                <br />
                <span
                  className={clsx(
                    "text-[9px]",
                    speaking ? "text-primary-container font-bold" : "text-secondary"
                  )}
                >
                  {STATUS_LABEL[f.status]}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
