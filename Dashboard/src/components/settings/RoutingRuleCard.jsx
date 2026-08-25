import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { DEPARTMENT_CONFIG } from "../../utils/constants";
import Toggle from "../ui/Toggle";

export default function RoutingRuleCard({ rule, onSave }) {
  const [description, setDescription] = useState(rule.description);
  const [keywords, setKeywords] = useState(rule.keywords.join(", "));
  const [threshold, setThreshold] = useState(rule.escalationThresholdHours);
  const [enabled, setEnabled] = useState(rule.enabled);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const config = DEPARTMENT_CONFIG[rule.department];
  const Icon = config.icon;

  const dirty =
    description !== rule.description ||
    keywords !== rule.keywords.join(", ") ||
    Number(threshold) !== rule.escalationThresholdHours ||
    enabled !== rule.enabled;

  async function handleSave() {
    setSaving(true);
    await onSave(rule.department, {
      description,
      keywords: keywords.split(",").map((k) => k.trim()).filter(Boolean),
      escalationThresholdHours: Number(threshold),
      enabled,
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${config.soft} ${config.softText}`}>
            <Icon size={16} strokeWidth={2.25} />
          </span>
          <p className="font-display text-[14.5px] font-semibold text-ink">{rule.department}</p>
        </div>
        <Toggle checked={enabled} onChange={setEnabled} label="Enabled" />
      </div>

      <div className="mt-4 space-y-3">
        <div>
          <label className="text-[11.5px] font-medium uppercase tracking-wide text-ink-faint">
            Routing description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="mt-1 w-full resize-none rounded-lg border border-border bg-surface px-3 py-2 text-[13px] text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-ring"
          />
        </div>

        <div>
          <label className="text-[11.5px] font-medium uppercase tracking-wide text-ink-faint">
            Match keywords
          </label>
          <input
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 font-mono text-[12.5px] text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-ring"
          />
        </div>

        <div className="flex items-center justify-between gap-3">
          <div>
            <label className="text-[11.5px] font-medium uppercase tracking-wide text-ink-faint">
              Escalate after
            </label>
            <div className="mt-1 flex items-center gap-2">
              <input
                type="number"
                min={1}
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                className="w-16 rounded-lg border border-border bg-surface px-2 py-1.5 text-[13px] text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-ring"
              />
              <span className="text-[13px] text-ink-faint">hours</span>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={!dirty || saving}
            className={`flex items-center gap-1.5 self-end rounded-lg px-3.5 py-2 text-[13px] font-medium transition-colors ${
              saved
                ? "bg-status-resolved-soft text-status-resolved"
                : dirty
                ? "bg-primary text-white hover:bg-primary-dark"
                : "cursor-not-allowed bg-surface-sunken text-ink-faint"
            }`}
          >
            {saving && <Loader2 size={13} className="animate-spin" />}
            {saved && <Check size={13} />}
            {saved ? "Saved" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
