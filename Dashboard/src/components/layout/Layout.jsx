import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";
import TopBar from "./TopBar";

const TITLES = {
  "/dashboard": { title: "Dashboard", subtitle: "Live overview of email routing & tickets" },
  "/pipeline": { title: "Pipeline Flow", subtitle: "Main routing & escalation pipelines" },
  "/tickets": { title: "Tickets", subtitle: "Every email routed through QueryRoute" },
  "/analytics": { title: "Analytics", subtitle: "Trends across departments over time" },
  "/settings": { title: "Settings", subtitle: "Routing rules & pipeline configuration" },
};

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();
  const meta = TITLES[pathname] ?? TITLES["/dashboard"];

  return (
    <div className="min-h-screen bg-bg">
      <Sidebar />
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="lg:pl-64">
        <TopBar
          title={meta.title}
          subtitle={meta.subtitle}
          onMenuClick={() => setMobileOpen(true)}
        />
        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
