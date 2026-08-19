import {
  GraduationCap,
  Wallet,
  BookUser,
  Laptop2,
  Presentation,
  ShieldCheck,
  CircleDot,
  Route,
  AlertTriangle,
  CheckCircle2,
  LayoutDashboard,
  Workflow,
  Inbox,
  BarChart3,
  Settings,
  Clock,
  Mail,
  Sparkles,
  Send,
  Database,
  Siren,
} from "lucide-react";

export const DEPARTMENTS = [
  "Exam",
  "Finance",
  "Registrar",
  "IT Dept",
  "Instructor",
  "Admin",
];

export const STATUSES = ["Open", "Routed", "Escalated", "Resolved"];

export const DEPARTMENT_CONFIG = {
  Exam: {
    icon: GraduationCap,
    text: "text-dept-exam",
    bg: "bg-dept-exam",
    soft: "bg-dept-exam-soft",
    softText: "text-dept-exam",
    border: "border-dept-exam",
    dot: "bg-dept-exam",
  },
  Finance: {
    icon: Wallet,
    text: "text-dept-finance",
    bg: "bg-dept-finance",
    soft: "bg-dept-finance-soft",
    softText: "text-dept-finance",
    border: "border-dept-finance",
    dot: "bg-dept-finance",
  },
  Registrar: {
    icon: BookUser,
    text: "text-dept-registrar",
    bg: "bg-dept-registrar",
    soft: "bg-dept-registrar-soft",
    softText: "text-dept-registrar",
    border: "border-dept-registrar",
    dot: "bg-dept-registrar",
  },
  "IT Dept": {
    icon: Laptop2,
    text: "text-dept-it",
    bg: "bg-dept-it",
    soft: "bg-dept-it-soft",
    softText: "text-dept-it",
    border: "border-dept-it",
    dot: "bg-dept-it",
  },
  Instructor: {
    icon: Presentation,
    text: "text-dept-instructor",
    bg: "bg-dept-instructor",
    soft: "bg-dept-instructor-soft",
    softText: "text-dept-instructor",
    border: "border-dept-instructor",
    dot: "bg-dept-instructor",
  },
  Admin: {
    icon: ShieldCheck,
    text: "text-dept-admin",
    bg: "bg-dept-admin",
    soft: "bg-dept-admin-soft",
    softText: "text-dept-admin",
    border: "border-dept-admin",
    dot: "bg-dept-admin",
  },
};

export const STATUS_CONFIG = {
  Open: {
    icon: CircleDot,
    text: "text-status-open",
    soft: "bg-status-open-soft",
    dot: "bg-status-open",
  },
  Routed: {
    icon: Route,
    text: "text-status-routed",
    soft: "bg-status-routed-soft",
    dot: "bg-status-routed",
  },
  Escalated: {
    icon: AlertTriangle,
    text: "text-status-escalated",
    soft: "bg-status-escalated-soft",
    dot: "bg-status-escalated",
  },
  Resolved: {
    icon: CheckCircle2,
    text: "text-status-resolved",
    soft: "bg-status-resolved-soft",
    dot: "bg-status-resolved",
  },
};

export const NODE_TYPE_CONFIG = {
  trigger: { icon: Clock, color: "var(--color-node-trigger)", label: "Trigger" },
  gmail: { icon: Mail, color: "var(--color-node-gmail)", label: "Gmail" },
  ai: { icon: Sparkles, color: "var(--color-node-ai)", label: "AI / Code" },
  action: { icon: Send, color: "var(--color-node-action)", label: "Post-send action" },
  db: { icon: Database, color: "var(--color-node-db)", label: "Database" },
  escalation: { icon: Siren, color: "var(--color-node-escalation)", label: "Escalation" },
};

// Literal hex values for contexts that can't resolve CSS custom properties
// (Recharts SVG fills). Keep in sync with the --color-dept-* / --color-status-*
// tokens defined in src/index.css.
export const DEPARTMENT_HEX = {
  Exam: "#7C3AED",
  Finance: "#0E9F6E",
  Registrar: "#D97706",
  "IT Dept": "#0284C7",
  Instructor: "#E11D48",
  Admin: "#64748B",
};

export const STATUS_HEX = {
  Open: "#64748B",
  Routed: "#3538CD",
  Escalated: "#DC2626",
  Resolved: "#16A34A",
};

export const NODE_TYPE_HEX = {
  trigger: "#8A90A6",
  gmail: "#2563EB",
  ai: "#7C3AED",
  action: "#0F9E92",
  db: "#16A34A",
  escalation: "#F97066",
};

export const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/pipeline", label: "Pipeline Flow", icon: Workflow },
  { to: "/tickets", label: "Tickets", icon: Inbox },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings },
];
