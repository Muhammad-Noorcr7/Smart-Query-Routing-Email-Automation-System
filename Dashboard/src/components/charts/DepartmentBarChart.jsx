import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { DEPARTMENT_HEX } from "../../utils/constants";
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

export default function DepartmentBarChart({ data, loading }) {
  if (loading) return <SkeletonBlock className="h-72" />;

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 5" stroke="#E5E7F0" vertical={false} />
        <XAxis
          dataKey="department"
          tick={{ fontSize: 11.5, fill: "#9297AE" }}
          axisLine={{ stroke: "#E5E7F0" }}
          tickLine={false}
          interval={0}
          angle={-15}
          textAnchor="end"
          height={50}
        />
        <YAxis tick={{ fontSize: 12, fill: "#9297AE" }} axisLine={false} tickLine={false} width={32} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "#F1F2F7" }} />
        <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={44}>
          {data.map((entry) => (
            <Cell key={entry.department} fill={DEPARTMENT_HEX[entry.department]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
