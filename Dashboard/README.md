# QueryRoute — Smart Query Routing & Email Automation Dashboard

A dashboard for monitoring an n8n-style email automation pipeline: it reads an
inbox, classifies each message with Gemini, routes it to one of six
departments, and escalates anything that goes unanswered.

## Stack

- React 19 (functional components + hooks)
- Vite
- Tailwind CSS v4
- React Router v7
- Recharts
- lucide-react

Everything currently runs on **mock data only** — there is no backend yet.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (usually http://localhost:5173).

```bash
npm run build     # production build to /dist
npm run preview   # preview the production build locally
npm run lint       # oxlint
```

## Project structure

```
src/
  data/mockData.js     ← the ONLY place mock data lives
  api/index.js          ← the ONLY place components fetch data from
  utils/
    constants.js        ← department/status/node-type colors, icons, nav config
    format.js            ← date/time formatting helpers
  components/
    layout/              Sidebar, TopBar, MobileNav, Layout shell
    ui/                   Card, badges, toggle, skeletons
    dashboard/           StatCard, ActivityFeed
    charts/              Recharts wrappers (donut, area, bar, line)
    pipeline/            The Pipeline Flow diagram, nodes, connectors, modal
    tickets/             Filters + sortable table
    settings/             Editable routing rule cards
  pages/
    Dashboard.jsx
    PipelineFlowPage.jsx
    Tickets.jsx
    Analytics.jsx
    Settings.jsx
```

## Wiring up a real backend

Open `src/api/index.js`. Every exported function currently resolves data from
`src/data/mockData.js` behind a fake network delay, e.g.:

```js
export async function getTickets() {
  await new Promise((r) => setTimeout(r, 300));
  return mockTickets;
}
```

Replace the body of each function with a real `fetch`/`axios` call to your
backend (n8n webhook, Supabase REST endpoint, etc.), keeping the same
function name, arguments, and return shape:

```js
export async function getTickets() {
  const res = await fetch(`${API_BASE_URL}/tickets`);
  if (!res.ok) throw new Error("Failed to load tickets");
  return res.json();
}
```

No component or page needs to change — everything already imports from
`api/index.js`, never from `data/mockData.js` directly.
