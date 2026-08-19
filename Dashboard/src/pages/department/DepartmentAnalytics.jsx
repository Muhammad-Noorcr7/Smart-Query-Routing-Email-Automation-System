import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, Clock3, Gauge } from "lucide-react";
import { getTickets } from "../../api";
import { useAuth } from "../../hooks/useAuth";
import { getDepartmentLabel } from "../../utils/auth";
import StatCard from "../../components/dashboard/StatCard";
import Card, { CardHeader } from "../../components/ui/Card";

const STATUS_COLORS = {
  Open: "bg-status-open",
  Routed: "bg-status-routed",
  Escalated: "bg-status-escalated",
  Resolved: "bg-status-resolved",
};

export default function DepartmentAnalytics() {
  const { user } = useAuth();
  const department = getDepartmentLabel(user);
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    getTickets().then((allTickets) =>
      setTickets(allTickets.filter((ticket) => ticket.department === department))
    );
  }, [department]);

  const count = (status) => tickets.filter((ticket) => ticket.status === status).length;
  const resolutionRate = tickets.length ? Math.round((count("Resolved") / tickets.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Resolution rate" value={`${resolutionRate}%`} icon={Gauge} trend={`${department} completion rate`} />
        <StatCard label="Resolved tickets" value={count("Resolved")} icon={CheckCircle2} accent="resolved" trend="All completed queries" />
        <StatCard label="Needs attention" value={count("Escalated")} icon={AlertTriangle} accent="escalated" trend="Escalated department queries" />
      </div>

      <Card>
        <CardHeader title="Ticket status distribution" subtitle={`Current workload for ${department}`} />
        <div className="mt-6 space-y-5">
          {Object.keys(STATUS_COLORS).map((status) => {
            const value = count(status);
            const percentage = tickets.length ? Math.round((value / tickets.length) * 100) : 0;
            return (
              <div key={status}>
                <div className="mb-2 flex justify-between text-xs">
                  <span className="font-medium text-ink-muted">{status}</span>
                  <span className="tabular-nums text-ink-faint">{value} · {percentage}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-surface-sunken">
                  <div className={`h-full rounded-full ${STATUS_COLORS[status]}`} style={{ width: `${percentage}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card className="flex items-start gap-3">
        <Clock3 size={18} className="mt-0.5 text-primary" />
        <div>
          <p className="text-sm font-semibold text-ink">Department-scoped analytics</p>
          <p className="mt-1 text-xs leading-5 text-ink-faint">
            These figures are calculated only from tickets assigned to department ID {user.department_id ?? "—"}.
          </p>
        </div>
      </Card>
    </div>
  );
}
