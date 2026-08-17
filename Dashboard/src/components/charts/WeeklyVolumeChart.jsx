import {
  AreaChart,
  Area,
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
        Processed:{" "}
        <span className="font-mono font-medium text-ink">{payload[0].value}</span>
      </p>
      <p className="text-ink-muted">
        Escalated:{" "}
        <span className="font-mono font-medium text-status-escalated">
          {payload[1]?.value ?? 0}
        </span>
      </p>
    </div>
  );
}

export default function WeeklyVolumeChart({ data, loading }) {
  if (loading) return <SkeletonBlock className="h-64" />;

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="processedFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3538CD" stopOpacity={0.28} />
            <stop offset="100%" stopColor="#3538CD" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 5" stroke="#E5E7F0" vertical={false} />
        <XAxis
          dataKey="day"
          tick={{ fontSize: 12, fill: "#9297AE" }}
          axisLine={{ stroke: "#E5E7F0" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, fill: "#9297AE" }}
          axisLine={false}
          tickLine={false}
          width={32}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#D3D6E5", strokeWidth: 1 }} />
        <Area
          type="monotone"
          dataKey="processed"
          stroke="#3538CD"
          strokeWidth={2.25}
          fill="url(#processedFill)"
        />
        <Area
          type="monotone"
          dataKey="escalated"
          stroke="#DC2626"
          strokeWidth={1.75}
          fill="none"
          strokeDasharray="4 3"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
