import { NavLink } from "react-router-dom";
import { Waypoints } from "lucide-react";
import { NAV_ITEMS } from "../../utils/constants";

export default function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-surface lg:flex">
      <div className="flex items-center gap-2.5 px-5 pb-5 pt-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
          <Waypoints size={17} strokeWidth={2.25} />
        </div>
        <div className="leading-tight">
          <p className="font-display text-[15px] font-bold tracking-tight text-ink">
            QueryRoute
          </p>
          <p className="text-[11px] text-ink-faint">Email automation</p>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 px-3">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `group flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors ${
                isActive
                  ? "bg-primary-soft text-primary"
                  : "text-ink-muted hover:bg-surface-sunken hover:text-ink"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={16.5}
                  strokeWidth={2.25}
                  className={isActive ? "text-primary" : "text-ink-faint group-hover:text-ink-muted"}
                />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mx-3 mb-4 rounded-lg border border-border bg-surface-sunken px-3 py-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="pulse-dot absolute inline-flex h-full w-full rounded-full bg-status-resolved" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-status-resolved" />
          </span>
          <p className="text-[12px] font-medium text-ink">Pipelines live</p>
        </div>
        <p className="mt-1 text-[11px] leading-snug text-ink-faint">
          Routing every 5 min · escalation check every 24h
        </p>
      </div>
    </aside>
  );
}
