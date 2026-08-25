import { useEffect, useState } from "react";
import { CheckCircle2, Clock3, Inbox, MessageSquarePlus } from "lucide-react";
import { Link } from "react-router-dom";
import { getTickets } from "../../api";
import { useAuth } from "../../hooks/useAuth";
import StatCard from "../../components/dashboard/StatCard";
import Card, { CardHeader } from "../../components/ui/Card";
import StatusBadge from "../../components/ui/StatusBadge";
import DepartmentBadge from "../../components/ui/DepartmentBadge";
import { timeAgo } from "../../utils/format";

export default function StudentDashboard() {
  const { user, token } = useAuth();
  const [queries, setQueries] = useState([]);

  useEffect(() => {
    getTickets(token).then((tickets) =>
      setQueries(tickets.filter((ticket) => ticket.sender.toLowerCase() === user.email.toLowerCase()))
    );
  }, [token, user.email]);

  const open = queries.filter((query) => query.status === "Open" || query.status === "Routed").length;
  const resolved = queries.filter((query) => query.status === "Resolved").length;

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm text-white/70">Welcome back</p>
            <h2 className="mt-1 font-display text-2xl font-semibold">
              {user.full_name || user.email.split("@")[0]}
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-white/70">
              Submit questions and follow every response from the university teams.
            </p>
          </div>
          <Link
            to="/student/submit-query"
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-primary shadow-sm"
          >
            <MessageSquarePlus size={17} />
            New query
          </Link>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total queries" value={queries.length} icon={Inbox} trend="Queries submitted by you" />
        <StatCard label="In progress" value={open} icon={Clock3} accent="teal" trend="Open or routed to a team" />
        <StatCard label="Resolved" value={resolved} icon={CheckCircle2} accent="resolved" trend="Completed department replies" />
      </div>

      <Card>
        <CardHeader
          title="Recent queries"
          subtitle="Your latest submissions and their current status"
          action={<Link to="/student/queries" className="text-xs font-semibold text-primary">View all</Link>}
        />
        <div className="mt-4 divide-y divide-border">
          {queries.slice(0, 5).map((query) => (
            <div key={query.id} className="flex flex-col gap-3 py-4 first:pt-0 sm:flex-row sm:items-center">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink">{query.subject}</p>
                <p className="mt-1 text-xs text-ink-faint">{query.id} · Submitted {timeAgo(query.createdAt)}</p>
              </div>
              <div className="flex items-center gap-2">
                <DepartmentBadge department={query.department} />
                <StatusBadge status={query.status} />
              </div>
            </div>
          ))}
          {queries.length === 0 && (
            <div className="py-12 text-center">
              <Inbox size={28} className="mx-auto text-ink-faint" />
              <p className="mt-3 text-sm font-medium text-ink">No queries yet</p>
              <p className="mt-1 text-xs text-ink-faint">Your submitted queries will appear here.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
