import Card from "../ui/Card";

export default function StatCard({ label, value, icon: Icon, accent = "primary", trend }) {
  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-start justify-between">
        <p className="text-[13px] font-medium text-ink-muted">{label}</p>
        {Icon && (
          <div
            className={`flex h-7 w-7 items-center justify-center rounded-md ${
              accent === "primary"
                ? "bg-primary-soft text-primary"
                : accent === "escalated"
                ? "bg-status-escalated-soft text-status-escalated"
                : accent === "resolved"
                ? "bg-status-resolved-soft text-status-resolved"
                : "bg-teal-soft text-teal"
            }`}
          >
            <Icon size={14} strokeWidth={2.25} />
          </div>
        )}
      </div>
      <p className="mt-3 font-display text-[28px] font-bold leading-none tracking-tight text-ink tabular-nums">
        {value}
      </p>
      {trend && <p className="mt-2 text-xs text-ink-faint">{trend}</p>}
    </Card>
  );
}
