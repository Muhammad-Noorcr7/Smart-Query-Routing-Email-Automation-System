import { useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  BarChart3,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  PlusCircle,
  Settings,
  Users,
  Waypoints,
  Workflow,
  X,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { getDepartmentLabel, getPortalRole } from "../../utils/auth";

const NAVIGATION = {
  student: [
    { to: "/student/dashboard", label: "Overview", icon: LayoutDashboard },
    { to: "/student/submit-query", label: "Submit Query", icon: PlusCircle },
    { to: "/student/queries", label: "My Queries", icon: Inbox },
  ],
  department: [
    { to: "/department/dashboard", label: "Overview", icon: LayoutDashboard },
    { to: "/department/tickets", label: "Department Tickets", icon: Inbox },
    { to: "/department/analytics", label: "Analytics", icon: BarChart3 },
  ],
  admin: [
    { to: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
    { to: "/admin/tickets", label: "All Tickets", icon: Inbox },
    { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
    { to: "/admin/pipeline", label: "Pipeline", icon: Workflow },
    { to: "/admin/users", label: "Users", icon: Users },
    { to: "/admin/settings", label: "Settings", icon: Settings },
  ],
};

const PAGE_TITLES = {
  "/student/dashboard": ["Student Dashboard", "Track your queries and department replies"],
  "/student/submit-query": ["Submit a Query", "Send your question to the correct university team"],
  "/student/queries": ["My Queries", "View the progress of every query you submitted"],
  "/department/dashboard": ["Department Dashboard", "Your department's current workload"],
  "/department/tickets": ["Department Tickets", "Review, reply to, and update assigned queries"],
  "/department/analytics": ["Department Analytics", "Performance and workload for your department"],
  "/admin/dashboard": ["Admin Dashboard", "System-wide email routing overview"],
  "/admin/tickets": ["All Tickets", "Queries across every department"],
  "/admin/analytics": ["System Analytics", "Trends across departments over time"],
  "/admin/pipeline": ["Pipeline Flow", "Main routing and escalation pipelines"],
  "/admin/users": ["User Management", "Manage staff and student accounts"],
  "/admin/settings": ["System Settings", "Routing rules and pipeline configuration"],
};

function Navigation({ items, onNavigate }) {
  return (
    <nav className="flex-1 space-y-1 px-3">
      {items.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors ${
              isActive
                ? "bg-primary-soft text-primary"
                : "text-ink-muted hover:bg-surface-sunken hover:text-ink"
            }`
          }
        >
          <Icon size={17} strokeWidth={2.2} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

function SidebarContent({ items, portal, user, onNavigate, onLogout }) {
  const accountLabel =
    portal === "department" ? getDepartmentLabel(user) : portal === "admin" ? "Administrator" : "Student";
  const initial = (user.full_name || user.email || "U").charAt(0).toUpperCase();

  return (
    <>
      <div className="flex items-center gap-2.5 px-5 pb-6 pt-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white">
          <Waypoints size={18} strokeWidth={2.3} />
        </div>
        <div>
          <p className="font-display text-[15px] font-bold tracking-tight text-ink">QueryRoute</p>
          <p className="text-[11px] text-ink-faint">{accountLabel} portal</p>
        </div>
      </div>

      <Navigation items={items} onNavigate={onNavigate} />

      <div className="m-3 border-t border-border pt-3">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-soft text-sm font-semibold text-primary">
            {initial}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-ink">{user.full_name || accountLabel}</p>
            <p className="truncate text-[11px] text-ink-faint">{user.email}</p>
          </div>
          <button
            onClick={onLogout}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-faint hover:bg-status-escalated-soft hover:text-status-escalated"
            title="Sign out"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </>
  );
}

export default function PortalLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const portal = getPortalRole(user);
  const items = NAVIGATION[portal];
  const [title, subtitle] = PAGE_TITLES[pathname] || ["QueryRoute", "Email automation"];

  function handleLogout() {
    logout();
    navigate("/", { replace: true });
  }

  return (
    <div className="min-h-screen bg-bg">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-surface lg:flex">
        <SidebarContent items={items} portal={portal} user={user} onLogout={handleLogout} />
      </aside>

      <div
        onClick={() => setMobileOpen(false)}
        className={`fixed inset-0 z-40 bg-ink/40 transition-opacity lg:hidden ${
          mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-surface shadow-xl transition-transform lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute right-3 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted hover:bg-surface-sunken"
          aria-label="Close navigation"
        >
          <X size={18} />
        </button>
        <SidebarContent
          items={items}
          portal={portal}
          user={user}
          onNavigate={() => setMobileOpen(false)}
          onLogout={handleLogout}
        />
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-border bg-surface/90 px-4 py-4 backdrop-blur-sm sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-ink-muted hover:bg-surface-sunken lg:hidden"
              aria-label="Open navigation"
            >
              <Menu size={19} />
            </button>
            <div className="min-w-0">
              <h1 className="truncate font-display text-lg font-semibold tracking-tight text-ink sm:text-xl">{title}</h1>
              <p className="hidden truncate text-[13px] text-ink-faint sm:block">{subtitle}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg border border-border bg-surface px-3 text-xs font-semibold text-ink-muted transition hover:border-status-escalated/30 hover:bg-status-escalated-soft hover:text-status-escalated sm:px-4 sm:text-sm"
          >
            <LogOut size={16} />
            Logout
          </button>
        </header>
        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
