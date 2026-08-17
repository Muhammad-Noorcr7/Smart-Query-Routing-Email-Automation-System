import { NODE_TYPE_CONFIG } from "../../utils/constants";

export default function PipelineLegend() {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-xl border border-border bg-surface px-5 py-4">
      {Object.entries(NODE_TYPE_CONFIG).map(([key, config]) => {
        const Icon = config.icon;
        return (
          <div key={key} className="flex items-center gap-2">
            <span
              className="flex h-5 w-5 items-center justify-center rounded"
              style={{ backgroundColor: `${config.color}1A`, color: config.color }}
            >
              <Icon size={11} strokeWidth={2.5} />
            </span>
            <span className="text-xs font-medium text-ink-muted">{config.label}</span>
          </div>
        );
      })}
    </div>
  );
}
