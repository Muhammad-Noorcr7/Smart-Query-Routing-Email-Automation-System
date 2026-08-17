import { useEffect, useState } from "react";
import {
  getDepartmentVolumes,
  getEscalationRateOverTime,
  getAvgResolutionByDept,
} from "../api";
import Card, { CardHeader } from "../components/ui/Card";
import DepartmentBarChart from "../components/charts/DepartmentBarChart";
import EscalationRateChart from "../components/charts/EscalationRateChart";
import ResolutionTimeChart from "../components/charts/ResolutionTimeChart";

export default function Analytics() {
  const [deptVolumes, setDeptVolumes] = useState([]);
  const [escalationRate, setEscalationRate] = useState([]);
  const [resolutionTimes, setResolutionTimes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all([
      getDepartmentVolumes(),
      getEscalationRateOverTime(),
      getAvgResolutionByDept(),
    ]).then(([dept, esc, res]) => {
      if (!active) return;
      setDeptVolumes(dept);
      setEscalationRate(esc);
      setResolutionTimes(res);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const avgEscRate = escalationRate.length
    ? (escalationRate.reduce((s, d) => s + d.rate, 0) / escalationRate.length).toFixed(1)
    : "—";
  const slowestDept = resolutionTimes.length
    ? [...resolutionTimes].sort((a, b) => b.avgHours - a.avgHours)[0]
    : null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
        <Card className="xl:col-span-3">
          <CardHeader
            title="Department load distribution"
            subtitle="Total tickets currently attributed to each department"
          />
          <div className="mt-4">
            <DepartmentBarChart data={deptVolumes} loading={loading} />
          </div>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader
            title="Escalation rate"
            subtitle={loading ? "Last 14 days" : `Averaging ${avgEscRate}% over 14 days`}
          />
          <div className="mt-4">
            <EscalationRateChart data={escalationRate} loading={loading} />
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader
          title="Average resolution time by department"
          subtitle={
            slowestDept
              ? `${slowestDept.department} currently takes longest to resolve, at ${slowestDept.avgHours}h`
              : "Time from ticket creation to resolved status"
          }
        />
        <div className="mt-4">
          <ResolutionTimeChart data={resolutionTimes} loading={loading} />
        </div>
      </Card>
    </div>
  );
}
