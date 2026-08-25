import { useEffect } from "react";
import { useArenaStore } from "./arenaStore";

/** Drives the simulation for a given arena run while a component is mounted. */
export function useArenaTicker(runId: string | undefined, intervalMs = 1100) {
  const tick = useArenaStore((s) => s.tick);

  useEffect(() => {
    if (!runId) return;
    const handle = window.setInterval(() => tick(runId), intervalMs);
    return () => window.clearInterval(handle);
  }, [runId, intervalMs, tick]);
}
