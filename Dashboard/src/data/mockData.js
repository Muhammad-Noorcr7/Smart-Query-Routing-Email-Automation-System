// =============================================================================
// mockData.js
// -----------------------------------------------------------------------------
// The ONLY place raw mock data lives. Nothing in /src/components or /src/pages
// should import from this file directly — everything goes through
// /src/api/index.js so that swapping mock data for a real backend later is a
// one-file change. Shapes here are written to mirror what the real Gmail →
// Gemini → Switch → Supabase pipeline would actually return.
// =============================================================================

import { DEPARTMENTS, STATUSES } from "../utils/constants.js";

export { DEPARTMENTS, STATUSES };


// -- date helpers -------------------------------------------------------------
// Mock timestamps are generated relative to "now" so the dashboard always
// feels live, no matter when it's opened.
const now = new Date();

function hoursAgo(h) {
  return new Date(now.getTime() - h * 60 * 60 * 1000).toISOString();
}

function daysAgo(d, hourOfDay = 9) {
  const dt = new Date(now);
  dt.setDate(dt.getDate() - d);
  dt.setHours(hourOfDay, Math.floor(Math.random() * 59), 0, 0);
  return dt;
}

// -- tickets --------------------------------------------------------------
// 28 sample tickets spread across all 6 departments and all 4 statuses.
export const mockTickets = [
  {
    id: "TCK-3081",
    sender: "aisha.khan@student.reading.ac.uk",
    subject: "Unable to access exam timetable portal",
    snippet:
      "Hi, I've been trying to log into the exam portal since yesterday evening and it keeps returning a 403 error...",
    department: "Exam",
    status: "Open",
    priority: "Normal",
    confidence: 0.94,
    createdAt: hoursAgo(0.4),
    updatedAt: hoursAgo(0.4),
    respondedAt: null,
  },
  {
    id: "TCK-3080",
    sender: "j.osei@student.reading.ac.uk",
    subject: "Request to reschedule CS301 final exam",
    snippet:
      "Due to a clash with another module's exam slot, I'd like to request a reschedule for the CS301 final...",
    department: "Exam",
    status: "Routed",
    priority: "High",
    confidence: 0.88,
    createdAt: hoursAgo(1.2),
    updatedAt: hoursAgo(1.1),
    respondedAt: null,
  },
  {
    id: "TCK-3079",
    sender: "finance.query.priya@gmail.com",
    subject: "Tuition installment not reflecting in account",
    snippet:
      "I paid the second installment of my tuition fee last Thursday but the student portal still shows it as outstanding...",
    department: "Finance",
    status: "Escalated",
    priority: "High",
    confidence: 0.91,
    createdAt: hoursAgo(29),
    updatedAt: hoursAgo(2),
    respondedAt: null,
  },
  {
    id: "TCK-3078",
    sender: "t.brennan@student.reading.ac.uk",
    subject: "Refund status for withdrawn module",
    snippet:
      "I withdrew from MATH204 within the add/drop window and was told a refund would be processed within 10 days...",
    department: "Finance",
    status: "Resolved",
    priority: "Normal",
    confidence: 0.97,
    createdAt: hoursAgo(52),
    updatedAt: hoursAgo(6),
    respondedAt: hoursAgo(6),
  },
  {
    id: "TCK-3077",
    sender: "m.oconnor@student.reading.ac.uk",
    subject: "Transcript request for visa application",
    snippet:
      "I need an official transcript urgently for a visa renewal appointment next week, is expedited processing available...",
    department: "Registrar",
    status: "Routed",
    priority: "High",
    confidence: 0.9,
    createdAt: hoursAgo(3.5),
    updatedAt: hoursAgo(3.4),
    respondedAt: null,
  },
  {
    id: "TCK-3076",
    sender: "l.fernandez@student.reading.ac.uk",
    subject: "Name change on student records after marriage",
    snippet:
      "I recently got married and need to update my legal name on my student ID and transcripts, attaching my marriage certificate...",
    department: "Registrar",
    status: "Open",
    priority: "Low",
    confidence: 0.86,
    createdAt: hoursAgo(5),
    updatedAt: hoursAgo(5),
    respondedAt: null,
  },
  {
    id: "TCK-3075",
    sender: "d.walters@student.reading.ac.uk",
    subject: "VPN not connecting from off-campus",
    snippet:
      "The university VPN client fails at the authentication step with error code 809 whenever I try to connect from home...",
    department: "IT Dept",
    status: "Resolved",
    priority: "Normal",
    confidence: 0.95,
    createdAt: hoursAgo(30),
    updatedAt: hoursAgo(8),
    respondedAt: hoursAgo(8),
  },
  {
    id: "TCK-3074",
    sender: "s.patel@student.reading.ac.uk",
    subject: "Locked out of university email account",
    snippet:
      "I changed my password yesterday through the self-service portal and now can't sign into Outlook on any device...",
    department: "IT Dept",
    status: "Routed",
    priority: "High",
    confidence: 0.93,
    createdAt: hoursAgo(0.9),
    updatedAt: hoursAgo(0.8),
    respondedAt: null,
  },
  {
    id: "TCK-3073",
    sender: "r.nakamura@student.reading.ac.uk",
    subject: "Extension request for coursework submission",
    snippet:
      "I'm writing to request a 48-hour extension on the ML401 coursework deadline due to a medical appointment...",
    department: "Instructor",
    status: "Escalated",
    priority: "High",
    confidence: 0.82,
    createdAt: hoursAgo(31),
    updatedAt: hoursAgo(1.5),
    respondedAt: null,
  },
  {
    id: "TCK-3072",
    sender: "c.dubois@student.reading.ac.uk",
    subject: "Feedback on dissertation draft chapter 2",
    snippet:
      "I've submitted chapter 2 of my dissertation to the shared drive and wanted to check when feedback might be available...",
    department: "Instructor",
    status: "Resolved",
    priority: "Normal",
    confidence: 0.79,
    createdAt: hoursAgo(60),
    updatedAt: hoursAgo(12),
    respondedAt: hoursAgo(12),
  },
  {
    id: "TCK-3071",
    sender: "unclear.sender92@outlook.com",
    subject: "Question about campus parking permits",
    snippet:
      "Hi, could someone point me to the right office for annual parking permit renewals for staff, couldn't find it online...",
    department: "Admin",
    status: "Open",
    priority: "Low",
    confidence: 0.61,
    createdAt: hoursAgo(2.1),
    updatedAt: hoursAgo(2.1),
    respondedAt: null,
  },
  {
    id: "TCK-3070",
    sender: "events.external@partneruni.org",
    subject: "Venue booking enquiry for guest lecture series",
    snippet:
      "We'd like to enquire about booking the main auditorium for a joint guest lecture series in September...",
    department: "Admin",
    status: "Routed",
    priority: "Normal",
    confidence: 0.58,
    createdAt: hoursAgo(4.3),
    updatedAt: hoursAgo(4.2),
    respondedAt: null,
  },
  {
    id: "TCK-3069",
    sender: "h.singh@student.reading.ac.uk",
    subject: "Missing grade for resit exam",
    snippet:
      "My resit exam for STAT210 was two weeks ago and the grade still isn't showing on the student portal, could you check...",
    department: "Exam",
    status: "Escalated",
    priority: "High",
    confidence: 0.89,
    createdAt: hoursAgo(33),
    updatedAt: hoursAgo(3),
    respondedAt: null,
  },
  {
    id: "TCK-3068",
    sender: "b.almeida@student.reading.ac.uk",
    subject: "Exam seating arrangement query",
    snippet:
      "Could you confirm the seating room for my ECON110 exam on Friday, the timetable only lists a building code...",
    department: "Exam",
    status: "Resolved",
    priority: "Low",
    confidence: 0.92,
    createdAt: hoursAgo(80),
    updatedAt: hoursAgo(20),
    respondedAt: hoursAgo(20),
  },
  {
    id: "TCK-3067",
    sender: "y.tanaka@student.reading.ac.uk",
    subject: "Scholarship disbursement delayed",
    snippet:
      "The termly scholarship payment I was expecting on the 1st hasn't arrived in my account yet and I need to pay rent...",
    department: "Finance",
    status: "Routed",
    priority: "High",
    confidence: 0.93,
    createdAt: hoursAgo(6.4),
    updatedAt: hoursAgo(6.1),
    respondedAt: null,
  },
  {
    id: "TCK-3066",
    sender: "a.ibrahim@student.reading.ac.uk",
    subject: "Duplicate charge on library fine",
    snippet:
      "I was charged twice for the same overdue library fine this month, screenshots of both transactions attached...",
    department: "Finance",
    status: "Open",
    priority: "Normal",
    confidence: 0.9,
    createdAt: hoursAgo(1.7),
    updatedAt: hoursAgo(1.7),
    respondedAt: null,
  },
  {
    id: "TCK-3065",
    sender: "p.wozniak@student.reading.ac.uk",
    subject: "Course transfer between departments",
    snippet:
      "I'd like to formally request a transfer from the BSc Computer Science to the BEng Robotics programme for next term...",
    department: "Registrar",
    status: "Routed",
    priority: "Normal",
    confidence: 0.87,
    createdAt: hoursAgo(9),
    updatedAt: hoursAgo(8.5),
    respondedAt: null,
  },
  {
    id: "TCK-3064",
    sender: "e.moreau@student.reading.ac.uk",
    subject: "Proof of enrollment letter for landlord",
    snippet:
      "My letting agency is asking for an official proof of enrollment letter before finalising my tenancy agreement...",
    department: "Registrar",
    status: "Resolved",
    priority: "Normal",
    confidence: 0.96,
    createdAt: hoursAgo(70),
    updatedAt: hoursAgo(18),
    respondedAt: hoursAgo(18),
  },
  {
    id: "TCK-3063",
    sender: "k.olsen@student.reading.ac.uk",
    subject: "Printer credits not loading on campus",
    snippet:
      "I topped up my printing credits online but the library printers still show a zero balance after two attempts...",
    department: "IT Dept",
    status: "Escalated",
    priority: "Normal",
    confidence: 0.85,
    createdAt: hoursAgo(27),
    updatedAt: hoursAgo(4),
    respondedAt: null,
  },
  {
    id: "TCK-3062",
    sender: "n.abbas@student.reading.ac.uk",
    subject: "MFA app not receiving push notifications",
    snippet:
      "Since switching phones I no longer receive push approvals for MFA when logging into the student portal...",
    department: "IT Dept",
    status: "Open",
    priority: "High",
    confidence: 0.91,
    createdAt: hoursAgo(0.6),
    updatedAt: hoursAgo(0.6),
    respondedAt: null,
  },
  {
    id: "TCK-3061",
    sender: "f.rossi@student.reading.ac.uk",
    subject: "Lab access hours for final year project",
    snippet:
      "Could my supervisor confirm whether the robotics lab is available for out-of-hours access during the final project sprint...",
    department: "Instructor",
    status: "Routed",
    priority: "Normal",
    confidence: 0.8,
    createdAt: hoursAgo(11),
    updatedAt: hoursAgo(10.5),
    respondedAt: null,
  },
  {
    id: "TCK-3060",
    sender: "g.papadakis@student.reading.ac.uk",
    subject: "Clarification on group project marking rubric",
    snippet:
      "A few of us in the SE302 group project were unsure how individual contribution is weighted against the group mark...",
    department: "Instructor",
    status: "Resolved",
    priority: "Low",
    confidence: 0.83,
    createdAt: hoursAgo(90),
    updatedAt: hoursAgo(24),
    respondedAt: hoursAgo(24),
  },
  {
    id: "TCK-3059",
    sender: "facilities.contractor@buildright.co.uk",
    subject: "Scheduled maintenance access — East Wing",
    snippet:
      "Confirming our contractor team will need building access on Tuesday 8am–12pm for the scheduled HVAC maintenance...",
    department: "Admin",
    status: "Resolved",
    priority: "Low",
    confidence: 0.55,
    createdAt: hoursAgo(48),
    updatedAt: hoursAgo(30),
    respondedAt: hoursAgo(30),
  },
  {
    id: "TCK-3058",
    sender: "w.becker@student.reading.ac.uk",
    subject: "General question — not sure who to ask",
    snippet:
      "This might be the wrong inbox but I wasn't sure where to direct a general question about the alumni mentorship scheme...",
    department: "Admin",
    status: "Escalated",
    priority: "Low",
    confidence: 0.49,
    createdAt: hoursAgo(26),
    updatedAt: hoursAgo(5),
    respondedAt: null,
  },
  {
    id: "TCK-3057",
    sender: "o.mensah@student.reading.ac.uk",
    subject: "Special accommodations for upcoming exams",
    snippet:
      "Following my recent DSA assessment I need to arrange extra time and a separate room for my exams next month...",
    department: "Exam",
    status: "Routed",
    priority: "High",
    confidence: 0.92,
    createdAt: hoursAgo(14),
    updatedAt: hoursAgo(13.5),
    respondedAt: null,
  },
  {
    id: "TCK-3056",
    sender: "v.kowalski@student.reading.ac.uk",
    subject: "Direct debit failed for term 2 fees",
    snippet:
      "The direct debit for my term 2 tuition instalment bounced due to a bank switch, how do I update my payment details...",
    department: "Finance",
    status: "Routed",
    priority: "High",
    confidence: 0.94,
    createdAt: hoursAgo(16),
    updatedAt: hoursAgo(15.5),
    respondedAt: null,
  },
  {
    id: "TCK-3055",
    sender: "i.hassan@student.reading.ac.uk",
    subject: "Deferred entry confirmation needed",
    snippet:
      "I was granted deferred entry for next academic year and need a formal confirmation letter for my sponsor...",
    department: "Registrar",
    status: "Escalated",
    priority: "Normal",
    confidence: 0.88,
    createdAt: hoursAgo(28),
    updatedAt: hoursAgo(7),
    respondedAt: null,
  },
  {
    id: "TCK-3054",
    sender: "c.lindqvist@student.reading.ac.uk",
    subject: "Software license request — MATLAB",
    snippet:
      "My MATLAB student license expired and the self-service reactivation link on the IT portal returns a 404...",
    department: "IT Dept",
    status: "Routed",
    priority: "Normal",
    confidence: 0.9,
    createdAt: hoursAgo(19),
    updatedAt: hoursAgo(18.5),
    respondedAt: null,
  },
];

// -- dashboard summary ------------------------------------------------------
export const mockDashboardStats = {
  emailsProcessedToday: 47,
  ticketsByStatus: {
    Open: mockTickets.filter((t) => t.status === "Open").length,
    Routed: mockTickets.filter((t) => t.status === "Routed").length,
    Escalated: mockTickets.filter((t) => t.status === "Escalated").length,
    Resolved: mockTickets.filter((t) => t.status === "Resolved").length,
  },
  avgResponseTimeMinutes: 38,
  escalationCount: mockTickets.filter((t) => t.status === "Escalated").length,
  pipelineHealthy: true,
  lastRunAt: hoursAgo(0.05),
};

// -- department volumes -------------------------------------------------------
export const mockDepartmentVolumes = DEPARTMENTS.map((department) => ({
  department,
  count: mockTickets.filter((t) => t.department === department).length,
}));

// -- weekly email volume (7 days) --------------------------------------------
const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const mockWeeklyEmailVolume = Array.from({ length: 7 }).map((_, i) => {
  const offset = 6 - i;
  const dt = daysAgo(offset, 12);
  const base = [58, 64, 71, 52, 60, 24, 18][i];
  const escalated = [3, 5, 6, 2, 4, 1, 0][i];
  return {
    date: dt.toISOString().slice(0, 10),
    day: dayLabels[dt.getDay() === 0 ? 6 : dt.getDay() - 1],
    processed: base,
    escalated,
  };
});

// -- pipeline status ----------------------------------------------------------
export const mockPipelineStatus = {
  main: {
    id: "main",
    name: "Main Routing Pipeline",
    schedule: "Every 5 minutes",
    enabled: true,
    lastRunAt: hoursAgo(0.05),
    lastRunStatus: "success",
    lastRunDurationMs: 4210,
    nodes: [
      {
        id: "schedule",
        name: "Schedule Trigger",
        type: "trigger",
        lastStatus: "success",
        lastRunAt: hoursAgo(0.05),
        detail: "Fires on a 5 minute interval cron (*/5 * * * *).",
      },
      {
        id: "read-inbox",
        name: "Read Inbox (Gmail)",
        type: "gmail",
        lastStatus: "success",
        lastRunAt: hoursAgo(0.05),
        detail: "Fetched 6 unread messages from the shared support inbox.",
        itemsProcessed: 6,
      },
      {
        id: "emails-found",
        name: "Emails found? (IF)",
        type: "trigger",
        lastStatus: "success — branch: yes",
        lastRunAt: hoursAgo(0.05),
        detail: "6 unread messages found, continuing to classification.",
      },
      {
        id: "gemini",
        name: "Gemini AI Classify",
        type: "ai",
        lastStatus: "success",
        lastRunAt: hoursAgo(0.05),
        detail: "Classified intent + department for 6 messages.",
        avgLatencyMs: 820,
      },
      {
        id: "parse",
        name: "Parse Response (Code)",
        type: "ai",
        lastStatus: "success",
        lastRunAt: hoursAgo(0.05),
        detail: "Parsed Gemini JSON output into structured routing fields.",
      },
      {
        id: "route",
        name: "Route Dept (Switch)",
        type: "ai",
        lastStatus: "success",
        lastRunAt: hoursAgo(0.05),
        detail: "Split 6 messages across 6 department branches.",
      },
      {
        id: "branch-exam",
        name: "Exam Branch",
        type: "action",
        lastStatus: "success",
        detail: "Reply drafted and sent for 1 message.",
        itemsProcessed: 1,
      },
      {
        id: "branch-finance",
        name: "Finance Branch",
        type: "action",
        lastStatus: "success",
        detail: "Reply drafted and sent for 1 message.",
        itemsProcessed: 1,
      },
      {
        id: "branch-registrar",
        name: "Registrar Branch",
        type: "action",
        lastStatus: "success",
        detail: "Reply drafted and sent for 1 message.",
        itemsProcessed: 1,
      },
      {
        id: "branch-it",
        name: "IT Dept Branch",
        type: "action",
        lastStatus: "success",
        detail: "Reply drafted and sent for 2 messages.",
        itemsProcessed: 2,
      },
      {
        id: "branch-instructor",
        name: "Instructor Branch",
        type: "action",
        lastStatus: "success",
        detail: "Reply drafted and sent for 1 message.",
        itemsProcessed: 1,
      },
      {
        id: "branch-admin",
        name: "Admin Branch (fallback)",
        type: "action",
        lastStatus: "success",
        detail: "Unmatched intents routed to Admin for manual triage.",
        itemsProcessed: 0,
      },
      {
        id: "merge",
        name: "Merge Branches",
        type: "action",
        lastStatus: "success",
        detail: "Combined all 6 branch outputs into a single stream.",
      },
      {
        id: "apply-label",
        name: "Apply Label",
        type: "gmail",
        lastStatus: "success",
        detail: "Applied ROUTED/<department> label to 6 messages.",
      },
      {
        id: "mark-read",
        name: "Mark as Read",
        type: "gmail",
        lastStatus: "success",
        detail: "Marked 6 messages as read in parallel with labeling.",
      },
      {
        id: "save-supabase",
        name: "Save to Supabase",
        type: "db",
        lastStatus: "success",
        detail: "Logged 6 new ticket rows with status = Routed.",
        itemsProcessed: 6,
      },
    ],
  },
  escalation: {
    id: "escalation",
    name: "Escalation Pipeline",
    schedule: "Every 24 hours",
    enabled: true,
    lastRunAt: hoursAgo(6),
    lastRunStatus: "success",
    lastRunDurationMs: 1830,
    nodes: [
      {
        id: "schedule-24h",
        name: "Schedule Trigger (24h)",
        type: "trigger",
        lastStatus: "success",
        lastRunAt: hoursAgo(6),
        detail: "Fires once daily at 06:00 UTC.",
      },
      {
        id: "fetch-overdue",
        name: "Fetch Overdue Tickets",
        type: "db",
        lastStatus: "success",
        lastRunAt: hoursAgo(6),
        detail: "Queried Supabase for tickets open > 24h without response.",
        itemsProcessed: 6,
      },
      {
        id: "email-hod",
        name: "Email HOD",
        type: "escalation",
        lastStatus: "success",
        lastRunAt: hoursAgo(6),
        detail: "Sent escalation alert emails to 6 department heads.",
      },
      {
        id: "update-status",
        name: "Update Status → Escalated",
        type: "db",
        lastStatus: "success",
        lastRunAt: hoursAgo(6),
        detail: "Updated 6 ticket rows to status = Escalated.",
      },
    ],
  },
};

// -- escalation log -----------------------------------------------------------
export const mockEscalations = [
  {
    id: "ESC-441",
    ticketId: "TCK-3079",
    department: "Finance",
    subject: "Tuition installment not reflecting in account",
    sentTo: "hod.finance@reading.ac.uk",
    sentAt: hoursAgo(2),
    hoursOverdue: 27,
    reason: "No response within 24h SLA window",
  },
  {
    id: "ESC-440",
    ticketId: "TCK-3073",
    department: "Instructor",
    subject: "Extension request for coursework submission",
    sentTo: "hod.cs@reading.ac.uk",
    sentAt: hoursAgo(1.5),
    hoursOverdue: 29,
    reason: "No response within 24h SLA window",
  },
  {
    id: "ESC-439",
    ticketId: "TCK-3069",
    department: "Exam",
    subject: "Missing grade for resit exam",
    sentTo: "hod.exams@reading.ac.uk",
    sentAt: hoursAgo(3),
    hoursOverdue: 31,
    reason: "No response within 24h SLA window",
  },
];

// -- routing rules (settings) --------------------------------------------------
export const mockRoutingRules = [
  {
    department: "Exam",
    description: "Timetables, seating, resits, extenuating circumstances, exam access arrangements.",
    keywords: ["exam", "timetable", "resit", "seating", "invigilat"],
    enabled: true,
    escalationThresholdHours: 24,
  },
  {
    department: "Finance",
    description: "Tuition fees, installments, refunds, scholarships, payment methods.",
    keywords: ["tuition", "fee", "refund", "scholarship", "payment", "invoice"],
    enabled: true,
    escalationThresholdHours: 24,
  },
  {
    department: "Registrar",
    description: "Enrollment, transcripts, transfers, record changes, official letters.",
    keywords: ["transcript", "enrollment", "transfer", "records", "certificate"],
    enabled: true,
    escalationThresholdHours: 48,
  },
  {
    department: "IT Dept",
    description: "Account access, VPN, MFA, software licensing, campus network issues.",
    keywords: ["password", "vpn", "login", "mfa", "software", "wifi"],
    enabled: true,
    escalationThresholdHours: 12,
  },
  {
    department: "Instructor",
    description: "Coursework extensions, feedback, grading queries, lab/project access.",
    keywords: ["coursework", "extension", "feedback", "grading", "supervisor"],
    enabled: true,
    escalationThresholdHours: 48,
  },
  {
    department: "Admin",
    description: "Fallback branch for anything that doesn't match another department's intent.",
    keywords: ["general", "misc", "other"],
    enabled: true,
    escalationThresholdHours: 24,
  },
];

// -- analytics: escalation rate over last 14 days ------------------------------
export const mockEscalationRateOverTime = Array.from({ length: 14 }).map((_, i) => {
  const offset = 13 - i;
  const dt = daysAgo(offset, 12);
  const rate = [
    6.1, 7.4, 5.8, 8.9, 6.6, 4.2, 3.1, 7.0, 9.2, 6.4, 5.5, 8.1, 6.8, 5.3,
  ][i];
  return {
    date: dt.toISOString().slice(0, 10),
    rate,
  };
});

// -- analytics: avg resolution time per department (hours) --------------------
export const mockAvgResolutionByDept = [
  { department: "Exam", avgHours: 14.2 },
  { department: "Finance", avgHours: 19.8 },
  { department: "Registrar", avgHours: 27.5 },
  { department: "IT Dept", avgHours: 6.4 },
  { department: "Instructor", avgHours: 33.1 },
  { department: "Admin", avgHours: 21.0 },
];
