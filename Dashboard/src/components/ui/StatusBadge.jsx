import { STATUS_CONFIG } from "../../utils/constants";

export default function StatusBadge({ status, className = "" }) {
  const config = STATUS_CONFIG[status];
  if (!config) return null;
  const Icon = config.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${config.soft} ${config.text} ${className}`}
    >
      <Icon size={12} strokeWidth={2.5} />
      {status}
    </span>
  );
}
