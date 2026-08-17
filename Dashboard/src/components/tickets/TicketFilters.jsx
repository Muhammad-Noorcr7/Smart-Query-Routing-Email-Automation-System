import { Search } from "lucide-react";
import { DEPARTMENTS, STATUSES } from "../../utils/constants";

export default function TicketFilters({
  search,
  onSearch,
  department,
  onDepartment,
  status,
  onStatus,
  count,
  total,
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-xs">
          <Search
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint"
          />
          <input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search sender or subject…"
            className="w-full rounded-lg border border-border bg-surface py-2 pl-9 pr-3 text-[13px] text-ink placeholder:text-ink-faint focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-ring"
          />
        </div>

        <select
          value={department}
          onChange={(e) => onDepartment(e.target.value)}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-[13px] text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-ring"
        >
          <option value="All">All departments</option>
          {DEPARTMENTS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        <select
          value={status}
          onChange={(e) => onStatus(e.target.value)}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-[13px] text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-ring"
        >
          <option value="All">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <p className="shrink-0 text-xs text-ink-faint">
        Showing <span className="font-medium text-ink">{count}</span> of {total} tickets
      </p>
    </div>
  );
}
