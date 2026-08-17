import { NODE_TYPE_CONFIG } from "../../utils/constants";
import { timeAgo } from "../../utils/format";

export default function PipelineNode({ node, onClick, compact = false }) {
  const config = NODE_TYPE_CONFIG[node.type];
  const Icon = config.icon;

  return (
    <button
      onClick={() => onClick(node)}
      style={{ borderLeftColor: config.color }}
      className={`group flex h-14 w-44 shrink-0 items-center gap-2.5 rounded-lg border border-l-4 border-border bg-surface px-3 text-left shadow-[var(--shadow-card)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)] ${
        compact ? "w-40" : ""
      }`}
    >
      <div
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md"
        style={{ backgroundColor: `${config.color}1A`, color: config.color }}
      >
        <Icon size={13} strokeWidth={2.25} />
      </div>
      <div className="min-w-0">
        <p className="truncate text-[12.5px] font-semibold leading-tight text-ink">
          {node.name}
        </p>
        <p className="mt-1 truncate text-[11px] text-ink-faint">
          {node.lastRunAt ? timeAgo(node.lastRunAt) : "waiting"}
        </p>
      </div>
    </button>
  );
}
