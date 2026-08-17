import { X, CheckCircle2 } from "lucide-react";
import { NODE_TYPE_CONFIG } from "../../utils/constants";
import { formatDateTime, timeAgo } from "../../utils/format";

export default function NodeDetailModal({ node, onClose }) {
  if (!node) return null;
  const config = NODE_TYPE_CONFIG[node.type];
  const Icon = config.icon;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-[1px]"
        onClick={onClose}
      />
      <aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col border-l border-border bg-surface shadow-[var(--shadow-popover)]">
        <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${config.color}1A`, color: config.color }}
            >
              <Icon size={17} strokeWidth={2.25} />
            </div>
            <div>
              <p className="font-display text-[15px] font-semibold text-ink">{node.name}</p>
              <p className="text-xs text-ink-faint">{config.label} node</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-ink-muted hover:bg-surface-sunken"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
          <div className="flex items-center gap-2 rounded-lg bg-status-resolved-soft px-3 py-2.5 text-status-resolved">
            <CheckCircle2 size={16} strokeWidth={2.25} />
            <span className="text-[13px] font-medium capitalize">{node.lastStatus}</span>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-ink-faint">
              What happened
            </p>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-muted">{node.detail}</p>
          </div>

          <dl className="space-y-3 rounded-lg border border-border bg-surface-sunken p-4">
            <div className="flex items-center justify-between text-[13px]">
              <dt className="text-ink-faint">Last run</dt>
              <dd className="font-mono text-ink">
                {node.lastRunAt ? `${formatDateTime(node.lastRunAt)} · ${timeAgo(node.lastRunAt)}` : "—"}
              </dd>
            </div>
            {node.itemsProcessed !== undefined && (
              <div className="flex items-center justify-between text-[13px]">
                <dt className="text-ink-faint">Items processed</dt>
                <dd className="font-mono font-medium text-ink">{node.itemsProcessed}</dd>
              </div>
            )}
            {node.avgLatencyMs !== undefined && (
              <div className="flex items-center justify-between text-[13px]">
                <dt className="text-ink-faint">Avg. latency</dt>
                <dd className="font-mono font-medium text-ink">{node.avgLatencyMs}ms</dd>
              </div>
            )}
            <div className="flex items-center justify-between text-[13px]">
              <dt className="text-ink-faint">Node type</dt>
              <dd className="text-ink">{config.label}</dd>
            </div>
          </dl>
        </div>
      </aside>
    </>
  );
}
