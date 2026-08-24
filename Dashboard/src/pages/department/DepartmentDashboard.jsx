import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, Clock3, Inbox, FileText, Hash } from "lucide-react";
import { Link } from "react-router-dom";
import { getDepartments, getTickets } from "../../api";
import { useAuth } from "../../hooks/useAuth";
import { getDepartmentLabel } from "../../utils/auth";
import StatCard from "../../components/dashboard/StatCard";
import Card, { CardHeader } from "../../components/ui/Card";
import ActivityFeed from "../../components/dashboard/ActivityFeed";

export default function DepartmentDashboard() {
  const { user } = useAuth();
  const department = getDepartmentLabel(user);
  const [departmentRow, setDepartmentRow] = useState(null);
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    let active = true;

    Promise.all([getDepartments(), getTickets()]).then(([departments, allTickets]) => {
      if (!active) return;
      const currentDepartment =
        departments.find((item) => item.name?.toLowerCase() === department.toLowerCase()) || null;
      setDepartmentRow(currentDepartment);
      setTickets(allTickets.filter((ticket) => ticket.department === department));
    });

    return () => {
      active = false;
    };
  }, [department]);

  const count = (status) => tickets.filter((ticket) => ticket.status === status).length;

  return (
    <div className="space-y-6">
      <Card className="border-primary-ring bg-primary-soft/50">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">Department workspace</p>
        <h2 className="mt-2 font-display text-2xl font-semibold text-ink">{department}</h2>
        <p className="mt-2 text-sm text-ink-muted">
          You are viewing the department record that stores the saved query from Neon.
        </p>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Department ID" value={departmentRow?.id ?? "—"} icon={Hash} trend="Database row for this department" />
        <StatCard label="User ID" value={departmentRow?.user_id ?? "—"} icon={Inbox} trend="Linked student or staff user" />
        <StatCard label="Active" value={departmentRow?.is_active ? "Yes" : "No"} icon={CheckCircle2} accent="resolved" trend="Whether the department is available" />
        <StatCard label="Has query" value={departmentRow?.query ? "Yes" : "No"} icon={FileText} accent="teal" trend="Saved query text on the department row" />
      </div>

      <Card>
        <CardHeader
          title="Saved department query"
          subtitle="This is the query text currently stored in the departments table"
        />
        <div className="mt-4 rounded-xl border border-border bg-surface-sunken p-4">
          {departmentRow?.query ? (
            <p className="text-sm leading-6 text-ink-muted">{departmentRow.query}</p>
          ) : (
            <p className="text-sm text-ink-faint">
              No query has been saved for this department yet.
            </p>
          )}
          {departmentRow?.keywords && (
            <p className="mt-3 text-xs text-ink-faint">
              Keywords: {departmentRow.keywords}
            </p>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Assigned tickets" value={tickets.length} icon={Inbox} trend={`${department} total workload`} />
        <StatCard label="Open" value={count("Open") + count("Routed")} icon={Clock3} accent="teal" trend="Waiting for department action" />
        <StatCard label="Escalated" value={count("Escalated")} icon={AlertTriangle} accent="escalated" trend="Past the response threshold" />
        <StatCard label="Resolved" value={count("Resolved")} icon={CheckCircle2} accent="resolved" trend="Successfully completed" />
      </div>

      <Card padded={false}>
        <div className="flex items-start justify-between gap-4 p-5 pb-0">
          <CardHeader title="Recent department activity" subtitle={`Latest queries routed to ${department}`} />
          <Link to="/department/tickets" className="shrink-0 text-xs font-semibold text-primary">Manage tickets</Link>
        </div>
        <div className="p-5">
          <ActivityFeed tickets={tickets.slice(0, 8)} loading={false} />
        </div>
      </Card>
    </div>
  );
}
