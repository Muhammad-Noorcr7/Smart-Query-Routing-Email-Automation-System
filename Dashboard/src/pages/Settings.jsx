import { useEffect, useState } from "react";
import { getRoutingRules, updateRoutingRule, getPipelineStatus } from "../api";
import Card, { CardHeader } from "../components/ui/Card";
import Toggle from "../components/ui/Toggle";
import RoutingRuleCard from "../components/settings/RoutingRuleCard";
import { SkeletonCard } from "../components/ui/Skeleton";

export default function Settings() {
  const [rules, setRules] = useState([]);
  const [mainEnabled, setMainEnabled] = useState(true);
  const [escalationEnabled, setEscalationEnabled] = useState(true);
  const [globalThreshold, setGlobalThreshold] = useState(24);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all([getRoutingRules(), getPipelineStatus()])
      .then(([r, p]) => {
        if (!active) return;
        setRules(Array.isArray(r) ? r : []);
        setMainEnabled(Boolean(p?.main?.enabled));
        setEscalationEnabled(Boolean(p?.escalation?.enabled));
        setError("");
      })
      .catch((requestError) => {
        if (!active) return;
        setError(requestError.message || "Failed to load settings.");
        setRules([]);
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  async function handleSaveRule(department, patch) {
    const updated = await updateRoutingRule(department, patch);
    if (!updated) return;
    setRules((prev) => prev.map((r) => (r.department === department ? updated : r)));
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader title="Pipeline controls" subtitle="Turn each automated pipeline on or off" />
        <div className="mt-4 divide-y divide-border">
          <div className="flex items-center justify-between py-3.5">
            <div>
              <p className="text-[13.5px] font-medium text-ink">Main routing pipeline</p>
              <p className="text-xs text-ink-faint">
                Reads the inbox, classifies with Gemini, and routes every 5 minutes.
              </p>
            </div>
            <Toggle checked={mainEnabled} onChange={setMainEnabled} />
          </div>
          <div className="flex items-center justify-between py-3.5">
            <div>
              <p className="text-[13.5px] font-medium text-ink">Escalation pipeline</p>
              <p className="text-xs text-ink-faint">
                Checks for overdue tickets and alerts department heads every 24 hours.
              </p>
            </div>
            <Toggle checked={escalationEnabled} onChange={setEscalationEnabled} />
          </div>
          <div className="flex items-center justify-between py-3.5">
            <div>
              <p className="text-[13.5px] font-medium text-ink">Default escalation threshold</p>
              <p className="text-xs text-ink-faint">
                Tickets with no response after this many hours are escalated, unless a
                department overrides it below.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                value={globalThreshold}
                onChange={(e) => setGlobalThreshold(e.target.value)}
                className="w-16 rounded-lg border border-border bg-surface px-2 py-1.5 text-center text-[13px] text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-ring"
              />
              <span className="text-[13px] text-ink-faint">hours</span>
            </div>
          </div>
        </div>
      </Card>

      <div>
        <CardHeader
          title="Department routing rules"
          subtitle="How incoming emails are classified and where they're sent"
        />
        {error && (
          <div className="mt-4 rounded-xl border border-status-escalated/20 bg-status-escalated-soft px-4 py-3 text-sm text-status-escalated">
            {error}
          </div>
        )}
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} className="h-64" />)
            : (Array.isArray(rules) ? rules : []).map((rule) => (
                <RoutingRuleCard key={rule.department} rule={rule} onSave={handleSaveRule} />
              ))}
        </div>
      </div>
    </div>
  );
}
