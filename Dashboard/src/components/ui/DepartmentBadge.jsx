import { DEPARTMENT_CONFIG_BY_NAME, DEPARTMENT_CONFIG } from "../../utils/constants";

export default function DepartmentBadge({ department, className = "" }) {
  const config = DEPARTMENT_CONFIG_BY_NAME[department] || DEPARTMENT_CONFIG.Admin;
  if (!config) return null;
  const Icon = config.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${config.soft} ${config.softText} ${className}`}
    >
      <Icon size={12} strokeWidth={2.5} />
      {department}
    </span>
  );
}
