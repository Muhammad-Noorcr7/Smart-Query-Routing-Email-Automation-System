import { useEffect, useState } from "react";
import { Mail, Route, AlertTriangle, Timer } from "lucide-react";
import {
  getDashboardStats,
  getAllTickets,
  getDepartmentVolumes,
  getWeeklyEmailVolume,
} from "../api";
import { useAuth } from "../hooks/useAuth";
import StatCard from "../components/dashboard/StatCard";
import ActivityFeed from "../components/dashboard/ActivityFeed";
import DepartmentDonutChart from "../components/charts/DepartmentDonutChart";
import WeeklyVolumeChart from "../components/charts/WeeklyVolumeChart";
import Card, { CardHeader } from "../components/ui/Card";
import { SkeletonCard } from "../components/ui/Skeleton";

export default function Dashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [deptVolumes, setDeptVolumes] = useState([]);
  const [weeklyVolume, setWeeklyVolume] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      const [statsRes, ticketsRes, deptRes, weeklyRes] = await Promise.all([
        getDashboardStats(),
        getAllTickets(token),
        getDepartmentVolumes(),
        getWeeklyEmailVolume(),
      ]);
      if (!active) return;
      setStats(statsRes);
      setTickets(ticketsRes);
      setDeptVolumes(deptRes);
      setWeeklyVolume(weeklyRes);
      setLoading(false);
    }
    load();
    return () => {
      active = false;
    };
  }, [token]);

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading || !stats ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard
              label="Emails processed today"
              value={stats.emailsProcessedToday}
              icon={Mail}
              accent="primary"
              trend="Across all 6 department branches"
            />
            <StatCard
              label="Open tickets"
              value={stats.ticketsByStatus.Open}
              icon={Route}
              accent="teal"
              trend={`${stats.ticketsByStatus.Routed} routed · ${stats.ticketsByStatus.Resolved} resolved`}
            />
            <StatCard
              label="Escalations"
              value={stats.escalationCount}
              icon={AlertTriangle}
              accent="escalated"
              trend="Past 24h escalation run"
            />
            <StatCard
              label="Avg. response time"
              value={`${stats.avgResponseTimeMinutes}m`}
              icon={Timer}
              accent="resolved"
              trend="From receipt to routed reply"
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
        <Card className="xl:col-span-3">
          <CardHeader
            title="Emails processed — last 7 days"
            subtitle="Total processed vs. escalated per day"
          />
          <div className="mt-4">
            <WeeklyVolumeChart data={weeklyVolume} loading={loading} />
          </div>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader title="Ticket volume by department" subtitle="Share of total tickets" />
          <div className="mt-4">
            <DepartmentDonutChart data={deptVolumes} loading={loading} />
          </div>
        </Card>
      </div>

      <Card padded={false}>
        <div className="p-5 pb-0">
          <CardHeader title="Recent activity" subtitle="Latest emails routed by the pipeline" />
        </div>
        <div className="p-5">
          <ActivityFeed tickets={tickets.slice(0, 8)} loading={loading} />
        </div>
      </Card>
    </div>
  );
}
