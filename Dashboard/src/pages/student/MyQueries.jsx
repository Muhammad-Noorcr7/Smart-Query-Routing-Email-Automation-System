import { useEffect, useState } from "react";
import { Inbox } from "lucide-react";
import { getTickets } from "../../api";
import { useAuth } from "../../hooks/useAuth";
import Card from "../../components/ui/Card";
import StatusBadge from "../../components/ui/StatusBadge";
import DepartmentBadge from "../../components/ui/DepartmentBadge";
import { timeAgo } from "../../utils/format";

export default function MyQueries() {
  const { user } = useAuth();
  const [queries, setQueries] = useState([]);

  useEffect(() => {
    getTickets().then((tickets) =>
      setQueries(tickets.filter((ticket) => ticket.sender.toLowerCase() === user.email.toLowerCase()))
    );
  }, [user.email]);

  return (
    <div className="space-y-4">
      {queries.map((query) => (
        <Card key={query.id}>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs text-ink-faint">{query.id}</span>
                <DepartmentBadge department={query.department} />
                <StatusBadge status={query.status} />
              </div>
              <h3 className="mt-3 font-display text-base font-semibold text-ink">{query.subject}</h3>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-ink-muted">{query.snippet}</p>
            </div>
            <p className="shrink-0 text-xs text-ink-faint">{timeAgo(query.createdAt)}</p>
          </div>
        </Card>
      ))}
      {queries.length === 0 && (
        <Card className="py-14 text-center">
          <Inbox size={30} className="mx-auto text-ink-faint" />
          <h3 className="mt-3 text-sm font-semibold text-ink">No submitted queries</h3>
          <p className="mt-1 text-xs text-ink-faint">When you submit a query, its progress will appear here.</p>
        </Card>
      )}
    </div>
  );
}
