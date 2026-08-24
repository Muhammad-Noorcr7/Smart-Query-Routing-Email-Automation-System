# QueryRoute - Smart Query Routing & Email Automation Dashboard

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

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (usually http://localhost:5173).

```bash
npm run build     # production build to /dist
npm run preview   # preview the production build locally
npm run lint      # oxlint
```

## Project structure

```
src/
  api/index.js          - the only place components fetch data from
  utils/
    constants.js        - department/status/node-type colors, icons, nav config
    format.js           - date/time formatting helpers
  components/
    layout/             - Sidebar, TopBar, MobileNav, Layout shell
    ui/                  - Card, badges, toggle, skeletons
    dashboard/          - StatCard, ActivityFeed
    charts/             - Recharts wrappers (donut, area, bar, line)
    pipeline/           - The Pipeline Flow diagram, nodes, connectors, modal
    tickets/            - Filters + sortable table
    settings/           - Editable routing rule cards
  pages/
    Dashboard.jsx
    PipelineFlowPage.jsx
    Tickets.jsx
    Analytics.jsx
    Settings.jsx
```

## Data flow

All pages import data helpers from `src/api/index.js`. That file talks to the
backend for authentication and department data, and returns safe empty or
derived states for dashboard views that do not yet have dedicated backend
endpoints.
