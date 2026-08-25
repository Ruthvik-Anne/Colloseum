import { useEffect, useRef } from "react";
import clsx from "clsx";
import type { TerminalLine } from "../types";
import { TERMINAL_KIND_COLOR, TERMINAL_KIND_PREFIX } from "../lib/fighterUi";

export function TerminalPanel({ lines, dense = false }: { lines: TerminalLine[]; dense?: boolean }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines.length]);

  return (
    <div
      ref={scrollRef}
      className={clsx(
        "flex-1 overflow-y-auto font-mono text-terminal-text space-y-1.5",
        dense ? "text-[11px] p-stack-sm" : "text-xs md:text-sm p-stack-md"
      )}
    >
      {lines.length === 0 && <div className="opacity-50">&gt; awaiting first transmission...</div>}
      {lines.map((line) => (
        <div
          key={line.id}
          className={clsx(
            line.highlight && "bg-primary-fixed/20 px-2 -mx-2 py-1 rounded",
            TERMINAL_KIND_COLOR[line.kind]
          )}
        >
          <span className="opacity-70">
            [{TERMINAL_KIND_PREFIX[line.kind]}
            {line.actor ? `:${line.actor}` : ""}]
          </span>{" "}
          {line.text}
        </div>
      ))}
      <div className="opacity-70 animate-pulse">&gt; _</div>
    </div>
  );
}
