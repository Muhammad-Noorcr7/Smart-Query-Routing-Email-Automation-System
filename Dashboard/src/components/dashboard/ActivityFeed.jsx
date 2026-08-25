import { DEPARTMENT_CONFIG } from "../../utils/constants";
import { timeAgo, initials } from "../../utils/format";
import StatusBadge from "../ui/StatusBadge";
import { SkeletonLine } from "../ui/Skeleton";

export default function ActivityFeed({ tickets, loading }) {
  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="skeleton h-8 w-8 shrink-0 rounded-full" />
            <div className="flex-1 space-y-2">
              <SkeletonLine className="h-3 w-2/3" />
              <SkeletonLine className="h-2.5 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!tickets.length) {
    return (
      <p className="py-8 text-center text-sm text-ink-faint">
        No activity yet — tickets will appear here as emails are routed.
      </p>
    );
  }

  return (
    <ul className="space-y-1">
      {tickets.map((t) => {
        const dept = DEPARTMENT_CONFIG[t.department];
        return (
          <li
            key={t.id}
            className="flex items-center gap-3 rounded-lg px-1.5 py-2.5 transition-colors hover:bg-surface-sunken"
          >
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${dept.soft} ${dept.softText}`}
            >
              {initials(t.sender)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium text-ink">{t.subject}</p>
              <p className="truncate text-xs text-ink-faint">{t.sender}</p>
            </div>
            <div className="hidden shrink-0 sm:block">
              <StatusBadge status={t.status} />
            </div>
            <span className="w-14 shrink-0 text-right font-mono text-[11px] text-ink-faint tabular-nums">
              {timeAgo(t.createdAt)}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
