import { Link, useLocation } from "react-router-dom";
import clsx from "clsx";
import { Icon } from "./Icon";

const LINKS: { to: string; label: string; match: (path: string) => boolean }[] = [
  { to: "/", label: "ARENA", match: (p) => p === "/" || p.startsWith("/arena") },
  { to: "/logic-graph", label: "LOGIC_GRAPH", match: (p) => p.startsWith("/logic-graph") },
  { to: "/terminal", label: "TERMINAL", match: (p) => p.startsWith("/terminal") },
  { to: "/archive", label: "ARCHIVE", match: (p) => p.startsWith("/archive") },
];

export function TopNav() {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full h-16 bg-surface-lab border-b border-outline-variant">
      <div className="max-w-(--breakpoint-container-max) mx-auto h-full flex items-center justify-between px-gutter md:px-margin-desktop">
        <div className="flex items-center gap-stack-lg">
          <Link to="/" className="flex items-center gap-2 select-none">
            <span className="w-7 h-7 rounded-md bg-deep-slate flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-accent-cyan" />
            </span>
            <span className="text-2xl font-bold tracking-tight text-deep-slate">ARENA</span>
          </Link>
          <nav className="hidden md:flex gap-stack-lg font-mono text-xs tracking-widest">
            {LINKS.map((link) => {
              const active = link.match(location.pathname);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={clsx(
                    "pb-1 h-16 flex items-center border-b-2 transition-colors uppercase",
                    active
                      ? "text-primary-container border-primary-container"
                      : "text-secondary border-transparent hover:text-primary-container"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-stack-sm text-secondary">
          <button
            type="button"
            className="p-2 hover:text-primary-container transition-colors"
            aria-label="Settings"
          >
            <Icon name="settings" />
          </button>
          <button
            type="button"
            className="p-2 hover:text-primary-container transition-colors"
            aria-label="Notifications"
          >
            <Icon name="notifications" />
          </button>
          <div className="w-8 h-8 rounded-full bg-deep-slate border border-outline-variant ml-stack-sm flex items-center justify-center">
            <span className="font-mono text-[10px] text-accent-cyan">LB</span>
          </div>
        </div>
      </div>
    </header>
  );
}
