import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { DEPARTMENT_CONFIG, DEPARTMENT_HEX } from "../../utils/constants";
import { SkeletonBlock } from "../ui/Skeleton";

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { department, count } = payload[0].payload;
  return (
    <div className="rounded-lg border border-border bg-surface px-3 py-2 text-xs shadow-[var(--shadow-popover)]">
      <p className="font-medium text-ink">{department}</p>
      <p className="mt-0.5 text-ink-faint">{count} tickets</p>
    </div>
  );
}

export default function DepartmentDonutChart({ data, loading }) {
  if (loading) return <SkeletonBlock className="h-64" />;

  const total = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row">
      <div className="relative h-52 w-52 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="department"
              innerRadius={62}
              outerRadius={92}
              paddingAngle={3}
              stroke="none"
            >
              {data.map((entry) => (
                <Cell key={entry.department} fill={DEPARTMENT_HEX[entry.department]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <p className="font-display text-2xl font-bold text-ink tabular-nums">{total}</p>
          <p className="text-[11px] text-ink-faint">tickets</p>
        </div>
      </div>

      <ul className="w-full space-y-2">
        {data.map((d) => {
          const config = DEPARTMENT_CONFIG[d.department];
          const pct = total ? Math.round((d.count / total) * 100) : 0;
          return (
            <li key={d.department} className="flex items-center gap-2.5 text-[13px]">
              <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${config.dot}`} />
              <span className="flex-1 text-ink-muted">{d.department}</span>
              <span className="font-mono text-xs tabular-nums text-ink-faint">{pct}%</span>
              <span className="w-6 text-right font-mono text-xs font-medium tabular-nums text-ink">
                {d.count}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
