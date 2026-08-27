import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "../components/Icon";
import { useArenaStore } from "../store/arenaStore";
import { SAMPLE_BATTLES } from "../engine/content";

export function LandingPage() {
  const [prompt, setPrompt] = useState("");
  const [pendingTag, setPendingTag] = useState<string | null>(null);
  const navigate = useNavigate();
  const launch = useArenaStore((s) => s.launch);

  function execute(problem: string, tag = "CUSTOM") {
    const text = problem.trim();
    if (!text) return;
    const id = launch(text, tag);
    navigate(`/arena/${id}`);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    execute(prompt);
  }

  return (
    <main className="flex-1 w-full max-w-(--breakpoint-container-max) mx-auto px-gutter md:px-margin-desktop py-12 flex flex-col items-center">
      <div className="w-full max-w-3xl text-center mb-stack-lg">
        <h1 className="text-4xl md:text-5xl font-bold text-deep-slate glow-cyan mb-stack-sm uppercase tracking-tight">
          Initialize Arena Protocol
        </h1>
        <p className="text-secondary font-mono text-xs tracking-widest">
          Awaiting conflict parameters. Define the logical bounds below.
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="w-full max-w-2xl bg-surface-code rounded-lg p-stack-md border border-outline-variant mb-12 shadow-sm relative"
      >
        <div className="absolute top-0 left-0 h-full w-1 bg-accent-cyan rounded-l-lg" />
        <div className="flex items-center gap-stack-sm mb-stack-sm text-secondary">
          <Icon name="terminal" size={16} />
          <span className="font-mono text-xs tracking-widest uppercase">SYS.PROMPT_ENTRY</span>
        </div>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full bg-surface-lab border border-outline-variant rounded-lg p-stack-sm font-mono text-sm text-terminal-text input-glow focus:outline-none resize-none"
          placeholder="> Input conflict scenario..."
          rows={4}
        />
        <div className="flex justify-end mt-stack-md">
          <button
            type="submit"
            disabled={!prompt.trim()}
            className="bg-accent-cyan text-deep-slate font-mono text-xs tracking-widest px-stack-md py-stack-sm rounded-lg hover:bg-primary-fixed transition-colors flex items-center gap-1 uppercase disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Execute
            <Icon name="arrow_forward" size={16} />
          </button>
        </div>
      </form>

      <div className="w-full max-w-5xl">
        <h2 className="font-mono text-xs tracking-widest text-secondary mb-stack-md border-b border-outline-variant pb-1 uppercase">
          Sample Battles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-stack-lg">
          {SAMPLE_BATTLES.map((battle) => (
            <div
              key={battle.id}
              className="bg-surface-lab rounded-lg border border-outline-variant p-stack-md relative hover:border-accent-cyan transition-colors cursor-pointer group shadow-sm flex flex-col h-full"
              onClick={() => setPrompt(battle.problem)}
            >
              <div className="absolute left-0 top-stack-md bottom-stack-md w-0.5 bg-outline-variant group-hover:bg-accent-cyan transition-colors" />
              <div className="flex justify-between items-start mb-stack-sm pl-stack-sm">
                <span className="bg-surface-container-low text-deep-slate font-mono text-[10px] px-2 py-0.5 rounded-lg border border-outline-variant uppercase">
                  {battle.tag}
                </span>
                <Icon
                  name={battle.icon}
                  className="text-secondary group-hover:text-accent-cyan transition-colors"
                  size={18}
                />
              </div>
              <h3 className="text-xl font-semibold text-deep-slate mb-1 pl-stack-sm">{battle.title}</h3>
              <p className="text-secondary text-sm mb-stack-md pl-stack-sm flex-1">{battle.description}</p>
              <div className="pl-stack-sm">
                <button
                  type="button"
                  disabled={pendingTag === battle.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setPendingTag(battle.id);
                    execute(battle.problem, battle.tag);
                  }}
                  className="text-accent-cyan font-mono text-xs flex items-center gap-1 uppercase hover:underline"
                >
                  Load
                  <Icon name="download" size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
