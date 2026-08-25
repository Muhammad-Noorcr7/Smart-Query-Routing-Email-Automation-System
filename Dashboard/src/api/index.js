// =============================================================================
// api/index.js
// -----------------------------------------------------------------------------
// This is the ONLY place components should ever fetch data from. Every
// function below currently just resolves mock data from /src/data/mockData.js
// behind a fake network delay.
//
// WHEN THE REAL BACKEND IS READY:
// Replace the body of each function with a real fetch()/axios call to your
// actual API (n8n webhook, Supabase REST endpoint, etc.), but keep the same
// function name, arguments, and return shape — nothing in /src/components or
// /src/pages needs to change if you do that.
//
// Example of what that swap looks like:
//
//   export async function getTickets() {
//     const res = await fetch(`${API_BASE_URL}/tickets`);
//     if (!res.ok) throw new Error("Failed to load tickets");
//     return res.json();
//   }
// =============================================================================

import {
  mockTickets,
  mockDashboardStats,
  mockDepartmentVolumes,
  mockWeeklyEmailVolume,
  mockPipelineStatus,
  mockEscalations,
  mockRoutingRules,
  mockEscalationRateOverTime,
  mockAvgResolutionByDept,
} from "../data/mockData.js";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

async function parseResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.detail || "Something went wrong. Please try again.");
  }
  return data;
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

function mapQueryToTicket(query) {
  return {
    id: query.id,
    sender: query.sender_email,
    subject: query.subject,
    snippet: query.snippet,
    department: query.department_name ?? "Admin",
    status: query.status,
    priority: query.priority,
    confidence: query.confidence,
    createdAt: query.created_at,
    updatedAt: query.updated_at,
    respondedAt: query.responded_at,
    message: query.message,
  };
}

export async function loginUser({ email, password }) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return parseResponse(response);
}

export async function signupUser({ email, password, fullName, departmentName }) {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      password,
      full_name: fullName,
      department_name: departmentName,
    }),
  });
  return parseResponse(response);
}

export async function getActiveDepartments() {
  const response = await fetch(`${API_BASE_URL}/departments/`);
  return parseResponse(response);
}

export async function getAdminUsers(token) {
  return request("/admin/users", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

const NETWORK_DELAY_MS = 300;

function delay(ms = NETWORK_DELAY_MS) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// In-memory copy so Settings edits persist for the session without a backend.
let routingRulesState = mockRoutingRules.map((r) => ({ ...r }));

/** Full ticket list, newest first. */
export async function getTickets(token = getStoredToken()) {
  if (!token) {
    return [];
  }

  const queries = await request("/queries/", {
    headers: { Authorization: `Bearer ${token}` },
  });

  return queries.map(mapQueryToTicket);
}

export async function getAllTickets(token = getStoredToken()) {
  if (!token) {
    return [];
  }

  const queries = await request("/admin/queries", {
    headers: { Authorization: `Bearer ${token}` },
  });

  return queries.map(mapQueryToTicket);
}

/** Single ticket by id. */
export async function getTicketById(id) {
  await delay(150);
  return mockTickets.find((t) => t.id === id) ?? null;
}

/** Dashboard summary cards. */
export async function getDashboardStats() {
  await delay();
  return { ...mockDashboardStats };
}

/** Ticket volume grouped by department. */
export async function getDepartmentVolumes() {
  await delay();
  return mockDepartmentVolumes;
}

/** Emails processed per day for the last 7 days. */
export async function getWeeklyEmailVolume() {
  await delay();
  return mockWeeklyEmailVolume;
}

/** Node-by-node status for both the main and escalation pipelines. */
export async function getPipelineStatus() {
  await delay(250);
  return mockPipelineStatus;
}

/** Escalation log entries. */
export async function getEscalations() {
  await delay();
  return mockEscalations;
}

/** Per-department routing rule configuration. */
export async function getRoutingRules() {
  await delay();
  return routingRulesState.map((r) => ({ ...r }));
}

export async function submitQuery({ message, token } = {}) {
  const authToken = token || getStoredToken();
  if (!authToken) {
    throw new Error("You must be signed in to submit a query.");
  }

  return request("/queries/", {
    method: "POST",
    headers: { Authorization: `Bearer ${authToken}` },
    body: JSON.stringify({ message }),
  });
}

/** Update a single department's routing rule. Currently mutates local mock state. */
export async function updateRoutingRule(department, newRule) {
  await delay(400);
  routingRulesState = routingRulesState.map((r) =>
    r.department === department ? { ...r, ...newRule } : r
  );
  return routingRulesState.find((r) => r.department === department);
}

/** Escalation rate (%) over the last 14 days, for the Analytics page. */
export async function getEscalationRateOverTime() {
  await delay();
  return mockEscalationRateOverTime;
}

/** Average resolution time (hours) per department, for the Analytics page. */
export async function getAvgResolutionByDept() {
  await delay();
  return mockAvgResolutionByDept;
}
