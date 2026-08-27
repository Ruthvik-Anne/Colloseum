import { Link } from "react-router-dom";
import { Icon } from "./Icon";

export function EmptyState({ icon = "hourglass_empty", message }: { icon?: string; message: string }) {
  return (
    <main className="flex-1 flex flex-col items-center justify-center gap-stack-md p-margin-desktop text-center">
      <Icon name={icon} size={40} className="text-secondary" />
      <p className="font-mono text-sm text-secondary max-w-sm">{message}</p>
      <Link
        to="/"
        className="bg-accent-cyan text-deep-slate font-mono text-xs px-stack-md py-stack-sm rounded-lg uppercase tracking-widest hover:bg-primary-fixed transition-colors"
      >
        Initialize New Protocol
      </Link>
    </main>
  );
}
