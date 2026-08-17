import { NavLink } from "react-router-dom";
import { Waypoints, X } from "lucide-react";
import { NAV_ITEMS } from "../../utils/constants";

export default function MobileNav({ open, onClose }) {
  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-ink/40 transition-opacity lg:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-surface transition-transform lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 pb-5 pt-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
              <Waypoints size={17} strokeWidth={2.25} />
            </div>
            <p className="font-display text-[15px] font-bold tracking-tight text-ink">
              QueryRoute
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted hover:bg-surface-sunken"
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        </div>
        <nav className="flex-1 space-y-0.5 px-3">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary-soft text-primary"
                    : "text-ink-muted hover:bg-surface-sunken hover:text-ink"
                }`
              }
            >
              <Icon size={17} strokeWidth={2.25} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
