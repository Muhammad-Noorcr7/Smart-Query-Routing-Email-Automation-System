import { ArrowUp, ArrowDown, ArrowUpDown, Inbox } from "lucide-react";
import DepartmentBadge from "../ui/DepartmentBadge";
import StatusBadge from "../ui/StatusBadge";
import { SkeletonRow } from "../ui/Skeleton";
import { formatDateTime, timeAgo } from "../../utils/format";

const COLUMNS = [
  { key: "id", label: "Ticket" },
  { key: "sender", label: "Sender" },
  { key: "subject", label: "Subject" },
  { key: "department", label: "Department" },
  { key: "status", label: "Status" },
  { key: "createdAt", label: "Created" },
  { key: "updatedAt", label: "Updated" },
];

function SortIcon({ active, direction }) {
  if (!active) return <ArrowUpDown size={12} className="text-ink-faint/60" />;
  return direction === "asc" ? (
    <ArrowUp size={12} className="text-primary" />
  ) : (
    <ArrowDown size={12} className="text-primary" />
  );
}

export default function TicketsTable({ tickets, loading, sortKey, sortDir, onSort }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-surface">
      <table className="w-full min-w-[880px] border-collapse text-left">
        <thead>
          <tr className="border-b border-border bg-surface-sunken/60">
            {COLUMNS.map((col) => (
              <th key={col.key} className="px-4 py-3">
                <button
                  onClick={() => onSort(col.key)}
                  className="flex items-center gap-1.5 text-[11.5px] font-semibold uppercase tracking-wide text-ink-faint hover:text-ink-muted"
                >
                  {col.label}
                  <SortIcon active={sortKey === col.key} direction={sortDir} />
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading &&
            Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} cols={7} />)}

          {!loading && tickets.length === 0 && (
            <tr>
              <td colSpan={7} className="px-4 py-16 text-center">
                <div className="flex flex-col items-center gap-2 text-ink-faint">
                  <Inbox size={28} strokeWidth={1.5} />
                  <p className="text-sm">No tickets match your filters</p>
                </div>
              </td>
            </tr>
          )}

          {!loading &&
            tickets.map((t) => (
              <tr
                key={t.id}
                className="border-b border-border text-[13px] last:border-0 hover:bg-surface-sunken/50"
              >
                <td className="whitespace-nowrap px-4 py-3.5 font-mono text-xs text-ink-muted">
                  {t.id}
                </td>
                <td className="max-w-[200px] truncate px-4 py-3.5 text-ink-muted">{t.sender}</td>
                <td className="max-w-[260px] truncate px-4 py-3.5 font-medium text-ink">
                  {t.subject}
                </td>
                <td className="whitespace-nowrap px-4 py-3.5">
                  <DepartmentBadge department={t.department} />
                </td>
                <td className="whitespace-nowrap px-4 py-3.5">
                  <StatusBadge status={t.status} />
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 text-ink-faint" title={formatDateTime(t.createdAt)}>
                  {timeAgo(t.createdAt)}
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 text-ink-faint" title={formatDateTime(t.updatedAt)}>
                  {timeAgo(t.updatedAt)}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
