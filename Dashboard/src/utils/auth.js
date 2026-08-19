const DEPARTMENT_ALIASES = {
  Exam: ["exam", "examination department", "examinations"],
  Finance: ["finance", "finance department"],
  Registrar: ["registrar", "registrar department", "registry", "registry department"],
  Instructor: ["instructor", "instructor department", "academic department"],
  "IT Dept": ["it", "it dept", "it department", "information technology", "information technology department"],
};

function normalize(value) {
  return String(value ?? "").trim().toLowerCase();
}

export function getPortalRole(user) {
  if (user?.is_admin || normalize(user?.role) === "admin") return "admin";
  if (normalize(user?.role) === "student") return "student";
  return "department";
}

export function getDashboardPath(user) {
  const portal = getPortalRole(user);
  if (portal === "admin") return "/admin/dashboard";
  if (portal === "student") return "/student/dashboard";
  return "/department/dashboard";
}

export function getDepartmentLabel(user) {
  const value = normalize(user?.department_name || user?.role);
  for (const [label, aliases] of Object.entries(DEPARTMENT_ALIASES)) {
    if (aliases.some((alias) => value === alias || value.includes(alias))) return label;
  }
  return user?.department_name || user?.role || "Department";
}

export function roleMatchesSelection(user, selectedRole) {
  const portal = getPortalRole(user);
  if (selectedRole === "Admin") return portal === "admin";
  if (selectedRole === "STUDENT") return portal === "student";
  if (portal !== "department") return false;
  return getDepartmentLabel(user) === selectedRole;
}
