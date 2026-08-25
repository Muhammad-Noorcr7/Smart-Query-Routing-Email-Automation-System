import { useEffect, useMemo, useState } from "react";
import { MessageSquareReply, Search } from "lucide-react";
import { getTickets } from "../../api";
import { useAuth } from "../../hooks/useAuth";
import { getDepartmentLabel } from "../../utils/auth";
import Card from "../../components/ui/Card";
import StatusBadge from "../../components/ui/StatusBadge";
import { timeAgo } from "../../utils/format";

const STATUSES = ["Open", "Routed", "Escalated", "Resolved"];

export default function DepartmentTickets() {
  const { user } = useAuth();
  const department = getDepartmentLabel(user);
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  useEffect(() => {
    getTickets().then((allTickets) =>
      setTickets(allTickets.filter((ticket) => ticket.department === department))
    );
  }, [department]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return tickets.filter((ticket) => {
      const matchesText =
        !query || ticket.subject.toLowerCase().includes(query) || ticket.sender.toLowerCase().includes(query);
      return matchesText && (status === "All" || ticket.status === status);
    });
  }, [tickets, search, status]);

  function updateStatus(ticketId, nextStatus) {
    setTickets((current) =>
      current.map((ticket) => ticket.id === ticketId ? { ...ticket, status: nextStatus } : ticket)
    );
  }

  return (
    <div className="space-y-4">
      <Card className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
          <input value={search} onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by student or subject..."
            className="h-10 w-full rounded-lg border border-border bg-surface pl-10 pr-3 text-sm outline-none focus:border-primary focus:ring-3 focus:ring-primary-soft" />
        </div>
        <select value={status} onChange={(event) => setStatus(event.target.value)}
          className="h-10 rounded-lg border border-border bg-surface px-3 text-sm text-ink outline-none focus:border-primary">
          <option>All</option>
          {STATUSES.map((item) => <option key={item}>{item}</option>)}
        </select>
      </Card>

      {filtered.map((ticket) => (
        <Card key={ticket.id}>
          <div className="flex flex-col gap-5 xl:flex-row xl:items-start">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs text-ink-faint">{ticket.id}</span>
                <StatusBadge status={ticket.status} />
                <span className="rounded-full bg-surface-sunken px-2.5 py-1 text-xs text-ink-muted">{ticket.priority} priority</span>
              </div>
              <h3 className="mt-3 font-display text-base font-semibold text-ink">{ticket.subject}</h3>
              <p className="mt-1 text-xs text-ink-faint">{ticket.sender} · {timeAgo(ticket.createdAt)}</p>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-ink-muted">{ticket.snippet}</p>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              <button className="inline-flex h-9 items-center gap-2 rounded-lg border border-border px-3 text-xs font-semibold text-ink-muted hover:bg-surface-sunken">
                <MessageSquareReply size={15} />
                Reply
              </button>
              <select value={ticket.status} onChange={(event) => updateStatus(ticket.id, event.target.value)}
                className="h-9 rounded-lg border border-border bg-surface px-3 text-xs font-medium text-ink outline-none focus:border-primary">
                {STATUSES.map((item) => <option key={item}>{item}</option>)}
              </select>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
