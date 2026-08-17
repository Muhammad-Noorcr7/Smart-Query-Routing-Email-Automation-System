import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { SkeletonBlock } from "../ui/Skeleton";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-surface px-3 py-2 text-xs shadow-[var(--shadow-popover)]">
      <p className="font-medium text-ink">{label}</p>
      <p className="mt-1 text-ink-muted">
        Escalation rate:{" "}
        <span className="font-mono font-medium text-status-escalated">
          {payload[0].value}%
        </span>
      </p>
    </div>
  );
}

export default function EscalationRateChart({ data, loading }) {
  if (loading) return <SkeletonBlock className="h-64" />;

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 5" stroke="#E5E7F0" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: "#9297AE" }}
          axisLine={{ stroke: "#E5E7F0" }}
          tickLine={false}
          tickFormatter={(d) => d.slice(5)}
          minTickGap={24}
        />
        <YAxis
          tick={{ fontSize: 12, fill: "#9297AE" }}
          axisLine={false}
          tickLine={false}
          width={36}
          tickFormatter={(v) => `${v}%`}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#D3D6E5", strokeWidth: 1 }} />
        <Line
          type="monotone"
          dataKey="rate"
          stroke="#DC2626"
          strokeWidth={2.25}
          dot={{ r: 2.5, fill: "#DC2626", strokeWidth: 0 }}
          activeDot={{ r: 4.5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
