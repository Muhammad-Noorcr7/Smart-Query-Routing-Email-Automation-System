import { DEPARTMENTS } from "../utils/constants";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

async function parseResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.detail || "Something went wrong. Please try again.");
  }
  return data;
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  return parseResponse(response);
}

async function requestOrDefault(path, defaultValue, options = {}) {
  try {
    return await request(path, options);
  } catch {
    return defaultValue;
  }
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function parseKeywords(value) {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map((keyword) => String(keyword).trim()).filter(Boolean);
  }
  return String(value)
    .split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean);
}

function joinKeywords(value) {
  return parseKeywords(value).join(", ");
}

function getStoredToken() {
  try {
    const raw = localStorage.getItem("queryroute-auth");
    if (!raw) return null;
    return JSON.parse(raw)?.token ?? null;
  } catch {
    return null;
  }
}

function createEmptyDashboardStats() {
  return {
    emailsProcessedToday: 0,
    ticketsByStatus: {
      Open: 0,
      Routed: 0,
      Escalated: 0,
      Resolved: 0,
    },
    escalationCount: 0,
    avgResponseTimeMinutes: 0,
  };
}

function createEmptyWeeklyVolume() {
  const today = new Date();

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));
    return {
      day: date.toISOString().slice(0, 10),
      processed: 0,
      escalated: 0,
    };
  });
}

function createEmptyEscalationRate() {
  const today = new Date();

  return Array.from({ length: 14 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (13 - index));
    return {
      date: date.toISOString().slice(0, 10),
      rate: 0,
    };
  });
}

function createEmptyResolutionTimes() {
  return DEPARTMENTS.map((department) => ({
    department,
    avgHours: 0,
  }));
}

function createEmptyPipelineNode({
  id,
  type,
  name,
  detail,
  itemsProcessed = 0,
  avgLatencyMs = 0,
}) {
  return {
    id,
    type,
    name,
    detail,
    lastStatus: "waiting",
    lastRunAt: null,
    itemsProcessed,
    avgLatencyMs,
  };
}

function createEmptyPipelineStatus() {
  const branchNodes = [
    {
      id: "branch-exam",
      label: "Exam",
    },
    {
      id: "branch-finance",
      label: "Finance",
    },
    {
      id: "branch-registrar",
      label: "Registrar",
    },
    {
      id: "branch-it",
      label: "IT Dept",
    },
    {
      id: "branch-instructor",
      label: "Instructor",
    },
    {
      id: "branch-admin",
      label: "Admin",
    },
  ];

  return {
    main: {
      enabled: false,
      nodes: [
        createEmptyPipelineNode({
          id: "schedule",
          type: "trigger",
          name: "Schedule Trigger",
          detail: "Waiting for the next scheduled run.",
        }),
        createEmptyPipelineNode({
          id: "read-inbox",
          type: "gmail",
          name: "Read Inbox",
          detail: "Connect this node to the real mailbox feed.",
        }),
        createEmptyPipelineNode({
          id: "emails-found",
          type: "trigger",
          name: "Emails Found?",
          detail: "Waiting for inbox results from the backend.",
        }),
        createEmptyPipelineNode({
          id: "gemini",
          type: "ai",
          name: "Gemini AI Classify",
          detail: "Classification results will appear here.",
        }),
        createEmptyPipelineNode({
          id: "parse",
          type: "ai",
          name: "Parse Response",
          detail: "Parsed labels and confidence will show here.",
        }),
        createEmptyPipelineNode({
          id: "route",
          type: "action",
          name: "Route Dept",
          detail: "Real routing data is not connected yet.",
        }),
        ...branchNodes.map(({ id, label }) =>
          createEmptyPipelineNode({
            id,
            type: "action",
            name: `${label} Branch`,
            detail: `Waiting for ${label.toLowerCase()} cases.`,
          })
        ),
        createEmptyPipelineNode({
          id: "merge",
          type: "action",
          name: "Merge Branches",
          detail: "Routing branches will merge here.",
        }),
        createEmptyPipelineNode({
          id: "apply-label",
          type: "action",
          name: "Apply Label",
          detail: "Labels will be written by the backend.",
        }),
        createEmptyPipelineNode({
          id: "mark-read",
          type: "action",
          name: "Mark as Read",
          detail: "Inbox items will be marked after routing.",
        }),
        createEmptyPipelineNode({
          id: "save-supabase",
          type: "db",
          name: "Save to Supabase",
          detail: "Ticket records will be stored here.",
        }),
      ],
    },
    escalation: {
      enabled: false,
      nodes: [
        createEmptyPipelineNode({
          id: "schedule-24h",
          type: "trigger",
          name: "Schedule Trigger",
          detail: "Waiting for the 24 hour escalation run.",
        }),
        createEmptyPipelineNode({
          id: "fetch-overdue",
          type: "db",
          name: "Fetch Overdue Tickets",
          detail: "Overdue items will load here once connected.",
        }),
        createEmptyPipelineNode({
          id: "email-hod",
          type: "escalation",
          name: "Email HOD",
          detail: "Escalation emails will be sent from this step.",
        }),
        createEmptyPipelineNode({
          id: "update-status",
          type: "db",
          name: "Update Status",
          detail: "Escalation status updates will be saved here.",
        }),
      ],
    },
  };
}

function mapDepartmentToRoutingRule(department) {
  return {
    department: department.name,
    departmentId: department.id,
    description: department.description ?? "",
    keywords: parseKeywords(department.keywords),
    escalationThresholdHours: 24,
    enabled: department.is_active,
    userId: department.user_id ?? null,
    query: department.query ?? null,
    code: department.code,
  };
}

let routingRulesState = null;

async function getDepartmentRulesSnapshot() {
  const departments = await requestOrDefault("/departments", []);
  const nextState = departments.map(mapDepartmentToRoutingRule);

  if (routingRulesState === null) {
    routingRulesState = nextState;
    return clone(routingRulesState);
  }

  const merged = nextState.map((department) => {
    const existing = routingRulesState.find(
      (rule) => rule.department === department.department
    );
    return existing
      ? {
          ...department,
          escalationThresholdHours: existing.escalationThresholdHours,
        }
      : department;
  });

  routingRulesState = merged;
  return clone(routingRulesState);
}

export async function loginUser({ email, password }) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function getAdminUsers(token) {
  return request("/admin/users", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getDepartments() {
  return requestOrDefault("/departments/", []);
}

export async function getTickets() {
  return [];
}

export async function getTicketById(_id) {
  return null;
}

export async function getDashboardStats() {
  return createEmptyDashboardStats();
}

export async function getDepartmentVolumes() {
  const departments = await requestOrDefault("/departments", []);
  return departments.map((department) => ({
    department: department.name,
    count: 0,
  }));
}

export async function getWeeklyEmailVolume() {
  return createEmptyWeeklyVolume();
}

export async function getPipelineStatus() {
  return createEmptyPipelineStatus();
}

export async function getEscalations() {
  return [];
}

export async function getRoutingRules() {
  return getDepartmentRulesSnapshot();
}

export async function updateRoutingRule(department, newRule) {
  const currentRules = await getDepartmentRulesSnapshot();
  const currentRule = currentRules.find((rule) => rule.department === department);

  if (!currentRule) {
    return null;
  }

  const nextRule = {
    ...currentRule,
    ...newRule,
    department,
    keywords: parseKeywords(newRule.keywords ?? currentRule.keywords),
    escalationThresholdHours:
      newRule.escalationThresholdHours ?? currentRule.escalationThresholdHours,
    enabled: newRule.enabled ?? currentRule.enabled,
  };

  routingRulesState = routingRulesState.map((rule) =>
    rule.department === department ? nextRule : rule
  );

  const token = getStoredToken();
  if (token && currentRule.departmentId) {
    try {
      const updatedDepartment = await request(
        `/admin/departments/${currentRule.departmentId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            description: nextRule.description,
            keywords: joinKeywords(nextRule.keywords),
            is_active: nextRule.enabled,
          }),
        }
      );

      const persistedRule = mapDepartmentToRoutingRule(updatedDepartment);
      const storedThreshold = nextRule.escalationThresholdHours;
      routingRulesState = routingRulesState.map((rule) =>
        rule.department === department
          ? {
              ...persistedRule,
              escalationThresholdHours: storedThreshold,
            }
          : rule
      );
    } catch {
      // Keep the local session state in sync even if the protected update fails.
    }
  }

  return clone(routingRulesState.find((rule) => rule.department === department));
}

export async function getEscalationRateOverTime() {
  return createEmptyEscalationRate();
}

export async function getAvgResolutionByDept() {
  return createEmptyResolutionTimes();
}
