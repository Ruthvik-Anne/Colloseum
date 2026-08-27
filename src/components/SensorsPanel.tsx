import type { ArenaRun } from "../types";
import { CLAIM_STATUS_COLOR, CLAIM_STATUS_ICON } from "../lib/fighterUi";
import type { ClaimStatus } from "../types";

const STATUSES: ClaimStatus[] = ["alive", "attacked", "defended", "disputed", "revised", "destroyed"];

export function SensorsPanel({ run }: { run: ArenaRun }) {
  const alive = run.fighters.filter((f) => !f.eliminated).length;
  const claimCounts = STATUSES.map((status) => ({
    status,
    count: run.claims.filter((c) => c.status === status).length,
  }));

  return (
    <div className="flex-1 overflow-y-auto p-stack-md space-y-stack-md">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-stack-sm">
        <SensorTile label="ROUND" value={`${run.round}/${run.maxRounds}`} />
        <SensorTile label="FIGHTERS ALIVE" value={`${alive}/${run.fighters.length}`} />
        <SensorTile label="ATTACKS" value={run.attacks.length} />
        <SensorTile label="TOOL RUNS" value={run.toolRuns.length} />
      </div>

      <div>
        <h4 className="font-mono text-[10px] text-secondary uppercase tracking-widest mb-stack-sm">
          Claim Status Distribution
        </h4>
        <div className="space-y-1.5">
          {claimCounts.map(({ status, count }) => (
            <div key={status} className="flex items-center gap-2">
              <span className={`font-mono text-sm w-4 ${CLAIM_STATUS_COLOR[status]}`}>
                {CLAIM_STATUS_ICON[status]}
              </span>
              <span className="font-mono text-[10px] text-secondary uppercase tracking-widest w-20">{status}</span>
              <div className="flex-1 h-1.5 rounded-full bg-surface-container-highest overflow-hidden">
                <div
                  className="h-full bg-primary-container rounded-full"
                  style={{ width: `${run.claims.length ? (count / run.claims.length) * 100 : 0}%` }}
                />
              </div>
              <span className="font-mono text-[10px] text-deep-slate w-5 text-right">{count}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-mono text-[10px] text-secondary uppercase tracking-widest mb-stack-sm">
          Combat Budgets Remaining
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-[10px]">
            <thead>
              <tr className="text-secondary uppercase tracking-widest">
                <th className="pb-1 pr-3">Fighter</th>
                <th className="pb-1 pr-3">Major</th>
                <th className="pb-1 pr-3">Minor</th>
                <th className="pb-1 pr-3">Tool</th>
                <th className="pb-1 pr-3">X-Exam</th>
              </tr>
            </thead>
            <tbody>
              {run.fighters.map((f) => (
                <tr key={f.id} className="border-t border-outline-variant/60 text-deep-slate">
                  <td className="py-1 pr-3">{f.name}</td>
                  <td className="py-1 pr-3">{f.budget.majorAttacks}</td>
                  <td className="py-1 pr-3">{f.budget.minorAttacks}</td>
                  <td className="py-1 pr-3">{f.budget.toolChallenges}</td>
                  <td className="py-1 pr-3">{f.budget.crossExaminations}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SensorTile({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-surface-lab border border-outline-variant rounded-md p-stack-sm">
      <div className="font-mono text-[9px] text-secondary uppercase tracking-widest mb-1">{label}</div>
      <div className="font-mono text-lg text-deep-slate">{value}</div>
    </div>
  );
}
