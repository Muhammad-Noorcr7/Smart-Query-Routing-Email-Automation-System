import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import { DEPARTMENT_HEX } from "../../utils/constants";
import { SkeletonBlock } from "../ui/Skeleton";

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { department, avgHours } = payload[0].payload;
  return (
    <div className="rounded-lg border border-border bg-surface px-3 py-2 text-xs shadow-[var(--shadow-popover)]">
      <p className="font-medium text-ink">{department}</p>
      <p className="mt-0.5 text-ink-faint">{avgHours}h average resolution</p>
    </div>
  );
}

export default function ResolutionTimeChart({ data, loading }) {
  if (loading) return <SkeletonBlock className="h-72" />;

  const sorted = [...data].sort((a, b) => a.avgHours - b.avgHours);

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart
        data={sorted}
        layout="vertical"
        margin={{ top: 8, right: 28, left: 8, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 5" stroke="#E5E7F0" horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 11, fill: "#9297AE" }} axisLine={false} tickLine={false} />
        <YAxis
          type="category"
          dataKey="department"
          tick={{ fontSize: 12, fill: "#565C79" }}
          axisLine={false}
          tickLine={false}
          width={78}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "#F1F2F7" }} />
        <Bar dataKey="avgHours" radius={[0, 6, 6, 0]} maxBarSize={22}>
          {sorted.map((entry) => (
            <Cell key={entry.department} fill={DEPARTMENT_HEX[entry.department] || "#64748B"} />
          ))}
          <LabelList
            dataKey="avgHours"
            position="right"
            formatter={(v) => `${v}h`}
            style={{ fill: "#565C79", fontSize: 11, fontFamily: "JetBrains Mono, monospace" }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
