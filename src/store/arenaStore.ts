import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type { ArenaRun } from "../types";
import { createArena, stepArena } from "../engine/arena";

interface ArenaStoreState {
  runs: Record<string, ArenaRun>;
  order: string[];
  paused: Record<string, boolean>;
  launch: (problem: string, tag?: string) => string;
  tick: (id: string) => void;
  pause: (id: string) => void;
  resume: (id: string) => void;
}

export const useArenaStore = create<ArenaStoreState>()(
  persist(
    immer((set, get) => ({
      runs: {},
      order: [],
      paused: {},
      launch: (problem: string, tag = "CUSTOM") => {
        const run = createArena(problem, tag);
        set((state) => {
          state.runs[run.id] = run;
          state.order.unshift(run.id);
        });
        return run.id;
      },
      tick: (id: string) => {
        const state = get();
        if (state.paused[id]) return;
        const run = state.runs[id];
        if (!run || run.status === "concluded") return;
        set((s) => {
          const target = s.runs[id];
          if (target) stepArena(target);
        });
      },
      pause: (id: string) =>
        set((s) => {
          s.paused[id] = true;
        }),
      resume: (id: string) =>
        set((s) => {
          s.paused[id] = false;
        }),
    })),
    {
      name: "colloseum-arena-store",
      version: 1,
      partialize: (state) => ({ runs: state.runs, order: state.order }),
    }
  )
);
