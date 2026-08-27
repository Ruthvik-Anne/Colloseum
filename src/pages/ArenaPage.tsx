import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import clsx from "clsx";
import { useArenaStore } from "../store/arenaStore";
import { useArenaTicker } from "../store/useArenaTicker";
import { Icon } from "../components/Icon";
import { StatusChip } from "../components/StatusChip";
import { RoundtableArena } from "../components/RoundtableArena";
import { TerminalPanel } from "../components/TerminalPanel";
import { ClaimGraphCompact } from "../components/ClaimGraphCompact";
import { FighterCard } from "../components/FighterCard";
import { EvidencePanel } from "../components/EvidencePanel";
import { ReasoningTimeline } from "../components/ReasoningTimeline";
import { SensorsPanel } from "../components/SensorsPanel";
import { SynthesisCard } from "../components/SynthesisCard";

const TABS = [
  { id: "agents", label: "AGENTS", icon: "psychology" },
  { id: "claims", label: "CLAIMS", icon: "description" },
  { id: "evidence", label: "EVIDENCE", icon: "fact_check" },
  { id: "reasoning", label: "REASONING", icon: "account_tree" },
  { id: "sensors", label: "SENSORS", icon: "sensors" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const STATUS_VARIANT = {
  queued: "neutral",
  running: "cyan",
  judging: "warning",
  concluded: "success",
} as const;

function formatElapsed(ms: number) {
  const total = Math.floor(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return [h, m, s].map((n) => n.toString().padStart(2, "0")).join(":");
}

export function ArenaPage() {
  const { runId } = useParams<{ runId: string }>();
  const navigate = useNavigate();
  const run = useArenaStore((s) => (runId ? s.runs[runId] : undefined));
  const paused = useArenaStore((s) => (runId ? s.paused[runId] : false));
  const pause = useArenaStore((s) => s.pause);
  const resume = useArenaStore((s) => s.resume);
  const [tab, setTab] = useState<TabId>("agents");

  useArenaTicker(run?.status === "concluded" ? undefined : runId);

  if (!run) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center gap-stack-md p-margin-desktop text-center">
        <Icon name="error" size={40} className="text-secondary" />
        <p className="font-mono text-sm text-secondary max-w-sm">
          Arena session not found. It may have expired or this browser has no local record of it.
        </p>
        <Link
          to="/"
          className="bg-accent-cyan text-deep-slate font-mono text-xs px-stack-md py-stack-sm rounded-lg uppercase tracking-widest hover:bg-primary-fixed transition-colors"
        >
          Initialize New Protocol
        </Link>
      </main>
    );
  }

  return (
    <div className="flex flex-1">
      {/* Side rail */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-surface-container-low border-r border-outline-variant py-stack-md">
        <div className="px-stack-md pb-stack-md mb-stack-md border-b border-outline-variant">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-6 h-6 rounded bg-deep-slate flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan" />
            </span>
            <div className="font-semibold text-primary-container truncate">{run.tag}</div>
          </div>
          <div className="font-mono text-[10px] text-secondary uppercase tracking-widest mb-stack-md">
            <StatusChip variant={STATUS_VARIANT[run.status]}>{run.status}</StatusChip>
          </div>
          {run.status !== "concluded" && (
            <button
              type="button"
              onClick={() => (paused ? resume(run.id) : pause(run.id))}
              className="w-full bg-primary-container text-surface-lab font-mono text-[11px] py-stack-sm px-stack-md rounded-lg hover:bg-surface-tint transition-colors flex items-center justify-center gap-2 uppercase tracking-widest"
            >
              <Icon name={paused ? "play_arrow" : "pause"} size={16} />
              {paused ? "Resume Scan" : "Pause Scan"}
            </button>
          )}
          <button
            type="button"
            onClick={() => navigate("/")}
            className="w-full mt-stack-sm border border-outline-variant text-secondary font-mono text-[11px] py-stack-sm px-stack-md rounded-lg hover:border-accent-cyan hover:text-primary-container transition-colors flex items-center justify-center gap-2 uppercase tracking-widest"
          >
            <Icon name="add" size={16} />
            New Protocol
          </button>
        </div>
        <nav className="flex-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={clsx(
                "w-full flex items-center gap-stack-md px-stack-md py-stack-sm font-mono text-xs uppercase tracking-widest transition-all",
                tab === t.id
                  ? "bg-surface-lab text-primary-container border-l-4 border-accent-cyan"
                  : "text-secondary border-l-4 border-transparent hover:bg-surface-variant/50"
              )}
            >
              <Icon name={t.icon} size={18} />
              {t.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 p-stack-md md:p-margin-desktop flex flex-col gap-stack-lg">
        {run.status === "concluded" && <SynthesisCard run={run} />}

        <section className="w-full bg-surface-lab border border-outline-variant rounded-lg shadow-sm overflow-hidden flex flex-col">
          <div className="px-stack-md py-stack-sm border-b border-outline-variant flex flex-wrap gap-2 justify-between items-center bg-surface-code">
            <div className="font-mono text-xs text-deep-slate flex items-center gap-2 uppercase tracking-widest">
              <Icon name="view_in_ar" size={16} />
              Arena View :: {run.status === "concluded" ? "Concluded" : `Round ${run.round}/${run.maxRounds}`}
            </div>
            <div className="font-mono text-xs text-secondary px-stack-sm py-0.5 bg-surface-lab border border-outline-variant rounded">
              ELAPSED: {formatElapsed(run.elapsedMs)}
            </div>
          </div>
          <p className="px-stack-md pt-stack-sm text-xs text-on-surface-variant line-clamp-2">{run.problem}</p>
          <RoundtableArena run={run} />
        </section>

        <section className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-stack-lg min-h-[320px]">
          <div className="md:col-span-7 bg-surface-lab border border-outline-variant rounded-lg flex flex-col overflow-hidden shadow-sm min-h-[320px]">
            <div className="px-stack-md py-stack-sm border-b border-outline-variant flex justify-between items-center bg-surface-code">
              <div className="font-mono text-xs text-deep-slate flex items-center gap-2 uppercase tracking-widest">
                <Icon name={TABS.find((t) => t.id === tab)!.icon} size={16} />
                {tab === "agents" && `Agents :: ${run.fighters.filter((f) => !f.eliminated).length} active`}
                {tab === "claims" && `Claim Graph :: ${run.tag}`}
                {tab === "evidence" && "Tool Pit :: Evidence Log"}
                {tab === "reasoning" && "Combat Timeline"}
                {tab === "sensors" && "Arena Sensors"}
              </div>
            </div>
            {tab === "agents" && (
              <div className="flex-1 overflow-y-auto p-stack-md grid grid-cols-1 sm:grid-cols-2 gap-stack-sm">
                {run.fighters.map((f) => (
                  <FighterCard key={f.id} fighter={f} run={run} />
                ))}
              </div>
            )}
            {tab === "claims" && <ClaimGraphCompact run={run} />}
            {tab === "evidence" && <EvidencePanel run={run} />}
            {tab === "reasoning" && <ReasoningTimeline run={run} />}
            {tab === "sensors" && <SensorsPanel run={run} />}
          </div>

          <div className="md:col-span-5 bg-surface-code border border-outline-variant rounded-lg flex flex-col overflow-hidden shadow-sm min-h-[320px]">
            <div className="px-stack-md py-stack-sm border-b border-outline-variant flex justify-between items-center bg-surface-lab">
              <div className="font-mono text-xs text-deep-slate flex items-center gap-2 uppercase tracking-widest">
                <Icon name="terminal" size={16} />
                Terminal Output
              </div>
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-outline-variant" />
                <div className="w-2 h-2 rounded-full bg-outline-variant" />
                <div
                  className={clsx(
                    "w-2 h-2 rounded-full",
                    run.status === "running" ? "bg-accent-cyan animate-pulse" : "bg-outline-variant"
                  )}
                />
              </div>
            </div>
            <TerminalPanel lines={run.terminal} />
          </div>
        </section>
      </main>
    </div>
  );
}
