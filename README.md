# ECC Platform — Lupin Diagnostics Prototype

**Executive Command Centre** — Unified Action Item Tracking & CEO Office MOM Governance Platform

**Client:** Lupin Diagnostics  
**Prepared by:** Indus Net Technologies (INT.)  
**Demo date:** 23 April 2026  
**Phase:** 1 (MVP Prototype — frontend only, no backend, all data mocked)

---

## Quick Start

```bash
pnpm install
pnpm dev        # http://localhost:5173
pnpm build      # production build
```

**Stack:** React 19 · TypeScript 6 · Vite 8 · React Router v7 · Plain CSS (no UI library)

---

## Folder Structure

```
ecc_prototype_lupin/
├── public/
│   ├── favicon.svg
│   └── icons.svg
│
├── src/
│   ├── main.tsx              # React entry point
│   ├── App.tsx               # Router + route definitions
│   ├── index.css             # Global reset + CSS variables
│   │
│   ├── assets/
│   │   └── ECC_BRD_Lupin_Diagnostics_v1.0.docx   # Source of truth for requirements
│   │
│   ├── types/                # TypeScript interfaces — NO mock data here
│   │   ├── auth.ts           # Role, User, MOCK_USERS, ROLE_LABELS, ROLE_DESCRIPTIONS
│   │   ├── actions.ts        # ActionItem, ActionStatus, Priority, Department, label maps
│   │   └── meetings.ts       # Meeting, MOMEntry
│   │
│   ├── data/                 # ALL fake/mock data for the prototype
│   │   ├── mockActions.ts    # 16 action items across 5 meetings, 4 departments
│   │   │                     # Exports: MOCK_ACTIONS, getActionsByOwner(),
│   │   │                     #          getActionsByDepartment(), getActionStats()
│   │   └── mockMeetings.ts   # 5 meetings with full MOM text and participant lists
│   │
│   ├── context/
│   │   └── AuthContext.tsx   # AuthProvider, useAuth hook — login/logout via role
│   │
│   ├── utils/
│   │   ├── dateUtils.ts      # formatDate, getDaysLeft, isOverdue, isDueSoon
│   │   └── statusUtils.ts    # STATUS_BG/TEXT/BORDER color maps for badges
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx    # Top nav with user avatar + logout — used on all dashboards
│   │   │   └── Navbar.css
│   │   │
│   │   ├── ui/               # Reusable atomic components
│   │   │   ├── StatusBadge.tsx    # Colored badge for ActionStatus (open/in-progress/etc.)
│   │   │   ├── PriorityBadge.tsx  # Colored badge for Priority (high/medium/low)
│   │   │   └── Modal.tsx          # Generic modal wrapper with overlay + close button
│   │   │
│   │   ├── actions/
│   │   │   └── StatusUpdateModal.tsx  # Modal for owner to update action status
│   │   │                              # Handles: In Progress / Completed / Blocked flows
│   │   │
│   │   ├── charts/
│   │   │   ├── KPISummaryTiles.tsx        # Row of 5 KPI stat cards (totals/counts)
│   │   │   └── ActionsByDepartmentBar.tsx # Stacked bar chart by department + status
│   │   │
│   │   ├── email/
│   │   │   └── EmailAlertPreview.tsx  # Modal showing simulated T-3/overdue alert email
│   │   │
│   │   └── meetings/
│   │       └── CreateMeetingForm.tsx  # Multi-step form: meeting → MOM → action items
│   │                                  # STUB — see JSDoc for full spec
│   │
│   └── pages/                # Route-level components (one folder per route)
│       │
│       ├── LoginPage/             # Route: /
│       │   ├── index.tsx          # DONE ✅ — role selector + login button
│       │   └── LoginPage.css
│       │
│       ├── PersonalDashboard/     # Route: /personal-dashboard
│       │   ├── index.tsx          # DONE ✅ — action owner view for Head of IT
│       │   └── PersonalDashboard.css
│       │
│       ├── AdminDashboard/        # Route: /admin-dashboard
│       │   ├── index.tsx          # TODO 🔴 — CEO Office Admin command center
│       │   └── AdminDashboard.css
│       │
│       ├── CEODashboard/          # Route: /ceo-dashboard
│       │   ├── index.tsx          # TODO 🔴 — CEO analytics + org-wide view
│       │   └── CEODashboard.css
│       │
│       ├── CreateMeetingPage/     # Route: /create-meeting
│       │   └── index.tsx          # TODO 🔴 — meeting + MOM creation flow
│       │
│       └── EmailPreviewPage/      # Route: /email-preview
│           └── index.tsx          # TODO 🟡 — email alert demo gallery (partial stub)
│
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

---

## Routes

| Path | Component | Role Access | Status |
|---|---|---|---|
| `/` | LoginPage | All | ✅ Done |
| `/personal-dashboard` | PersonalDashboard | Action Owners | ✅ Done |
| `/admin-dashboard` | AdminDashboard | CEO Office Admin | 🔴 Placeholder |
| `/ceo-dashboard` | CEODashboard | CEO | 🔴 Placeholder |
| `/create-meeting` | CreateMeetingPage | CEO Office Admin | 🔴 Stub |
| `/email-preview` | EmailPreviewPage | All | 🟡 Partial |

---

## User Roles

Defined in `src/types/auth.ts`. All users are mock — no real auth.

| Role ID | Name | Dashboard Route | Color |
|---|---|---|---|
| `ceo` | Rajesh Kumar | `/ceo-dashboard` | Purple `#7c3aed` |
| `ceo-office-admin` | Priya Sharma | `/admin-dashboard` | Cyan `#0891b2` |
| `head-of-it` | Vikram Singh | `/personal-dashboard` | Blue `#1e40af` |
| `head-of-finance` | Neha Patel | `/personal-dashboard` | Green `#059669` |
| `head-of-operations` | Arjun Mehta | `/personal-dashboard` | Amber `#d97706` |

---

## Mock Data

All data lives in `src/data/`. Nothing is fetched from a server.

### Actions (`mockActions.ts`)
- **16 action items** across IT (6), Finance (4), Operations (4), HR/Marketing (2)
- Spread across **5 meetings** (`MTG-001` to `MTG-005`)
- Status mix: 3 open · 6 in-progress · 4 overdue · 2 completed · 1 blocked
- Helper functions: `getActionsByOwner(ownerId)`, `getActionsByDepartment(dept)`, `getActionStats()`

### Meetings (`mockMeetings.ts`)
- **5 meetings** with full MOM text, participant lists, dates
- Cross-references `actionItemIds[]` matching IDs in `mockActions.ts`

### ActionStatus values
`open` · `in-progress` · `overdue` · `completed` · `blocked`

---

## Demo Features — Build Status

### Feature 1 — Login Page with Role Switcher ✅ DONE
**File:** `src/pages/LoginPage/index.tsx`  
Role card selector → click → redirect to correct dashboard. Hardcoded 5 roles.  
**Demo:** Select "Head of IT" → shows Vikram Singh's personal dashboard.

---

### Feature 2 — Personal Action Owner Dashboard ✅ DONE
**File:** `src/pages/PersonalDashboard/index.tsx`  
Shows 6 IT action items for Vikram Singh with status badges, progress bars, overdue flag.

**Enhancements needed for demo:**
- Wire `StatusUpdateModal` on row click (component already built at `src/components/actions/StatusUpdateModal.tsx`)
- Add "Source Meeting" column showing which meeting each action came from
- Use `getActionsByOwner('head-of-it')` from `mockActions.ts` instead of hardcoded array

---

### Feature 3 — CEO Office Admin Dashboard 🔴 TODO
**File:** `src/pages/AdminDashboard/index.tsx`  
**Description:** Command center for Priya Sharma — all actions, all owners, all departments.

**Must-have elements:**
1. KPI tiles row at top — use `KPISummaryTiles` component (already built)
2. Full action items table — all 16 items from `MOCK_ACTIONS`
   - Columns: ID · Action · Assignee · Department · Meeting · Priority · Due Date · Days Left · Status
   - Overdue rows: red background highlight
   - Due ≤3 days: amber highlight
3. Working filters: Department dropdown + Status dropdown (filter `MOCK_ACTIONS` in state)
4. Search bar: filter by action title or assignee name
5. "Create Meeting" button → navigate to `/create-meeting`
6. "Preview Email Alerts" button → navigate to `/email-preview`

**Data:** Import `MOCK_ACTIONS`, `getActionStats()` from `src/data/mockActions.ts`  
**Components to use:** `KPISummaryTiles`, `StatusBadge`, `PriorityBadge`, `StatusUpdateModal`  
**Styles:** Write in `AdminDashboard.css` — match PersonalDashboard design language

**Filter implementation:**
```tsx
const [deptFilter, setDeptFilter] = useState('All');
const [statusFilter, setStatusFilter] = useState('All');
const [searchQuery, setSearchQuery] = useState('');

const filtered = MOCK_ACTIONS.filter((a) => {
  if (deptFilter !== 'All' && a.department !== deptFilter) return false;
  if (statusFilter !== 'All' && a.status !== statusFilter) return false;
  if (searchQuery && !a.title.toLowerCase().includes(searchQuery.toLowerCase())
    && !a.assignedTo.toLowerCase().includes(searchQuery.toLowerCase())) return false;
  return true;
});
```

---

### Feature 4 — Meeting + MOM Creation Flow 🔴 TODO
**File:** `src/pages/CreateMeetingPage/index.tsx` + `src/components/meetings/CreateMeetingForm.tsx`  
**Description:** Multi-step form for CEO Office Admin to log a new meeting.

**Step 1 — Meeting details:**
- Title (text input), Date (date picker)
- Department (select: IT / Finance / Operations / HR / Marketing / Cross-Functional)
- Participants (multi-select or tag input from MOCK_USERS names)

**Step 2 — MOM text:**
- Large textarea, no rich-text lib needed
- Placeholder: "Paste or type minutes of meeting..."

**Step 3 — Action items (dynamic list):**
- Add/remove rows dynamically
- Each row: Title · Assignee (dropdown from MOCK_USERS) · Due Date · Priority
- "Add Action Item" button appends new row

**On submit:** Log to console, show success message, redirect to `/admin-dashboard`  
**Demo:** Create "April Board Review" meeting with 3 action items live during demo

---

### Feature 5 — Simulated Email Alert Preview 🟡 PARTIAL
**File:** `src/pages/EmailPreviewPage/index.tsx` + `src/components/email/EmailAlertPreview.tsx`  
**Status:** `EmailAlertPreview` modal component is fully built. `EmailPreviewPage` is a stub.

**Complete the page:**
- Show 3 tabs: Overdue Alert · T-3 Reminder · Upcoming
- Each tab pre-selects: IT-003 (overdue, -12d) · IT-004 (at-risk, 3d) · IT-001 (8d)
- Render `EmailAlertPreview` as modal OR inline (inline looks better for demo)
- "Update Status" CTA in email should open `StatusUpdateModal`

**Add link:** "Preview Alerts" button in AdminDashboard header

---

### Feature 6 — CEO Analytics Dashboard 🔴 TODO
**File:** `src/pages/CEODashboard/index.tsx`

**Must-have elements:**
1. KPI tiles row — `KPISummaryTiles` (already built)
2. Bar chart — `ActionsByDepartmentBar` (already built)
3. Per-department breakdown table: Department · Total · Open · Overdue · Completion%
4. Top 5 overdue items callout (filter `MOCK_ACTIONS` where `status === 'overdue'`, sort by `daysLeft` asc)
5. Compliance Score ring — reuse SVG ring pattern from PersonalDashboard

**Data:** `MOCK_ACTIONS`, `getActionStats()`, `getActionsByDepartment()` from `src/data/mockActions.ts`  
**Components:** `KPISummaryTiles`, `ActionsByDepartmentBar` (both already built)  
**Styles:** Write in `CEODashboard.css`

---

### Feature 7 — Status Update Modal 🟡 BUILT, needs wiring
**File:** `src/components/actions/StatusUpdateModal.tsx`  
**Status:** Component complete. Needs wiring into PersonalDashboard and AdminDashboard.

**Wire into PersonalDashboard:**
```tsx
const [selectedAction, setSelectedAction] = useState<ActionItem | null>(null);
// on table row click: setSelectedAction(action)
// render:
<StatusUpdateModal
  action={selectedAction}
  open={!!selectedAction}
  onClose={() => setSelectedAction(null)}
  onSave={(updated) => {
    setActions((prev) => prev.map((a) => a.id === updated.id ? updated : a));
    setSelectedAction(null);
  }}
/>
```

---

### Feature 8 — Gantt Timeline View (Nice-to-have) ⬜ NOT STARTED
**Suggested location:** `src/components/charts/GanttTimeline.tsx`

**Simple SVG approach (no library):**
- X axis: date range from earliest to latest due date in MOCK_ACTIONS
- One row per action item, colored bar from `createdAt` to `dueDateIso`
- Color bars by status using `STATUS_BG` from `statusUtils.ts`
- Vertical line for today's date (2026-04-22)

---

## Design System

Match these patterns from existing pages:

| Token | Value |
|---|---|
| Primary blue | `#1e40af` |
| Background | `#f8fafc` |
| Card background | `white` |
| Card border | `1px solid #e2e8f0` |
| Card border-radius | `12px` or `16px` |
| Body font size | `14px` |
| Heading font weight | `800` |
| Overdue color | `#dc2626` (red) |
| At-risk / blocked color | `#d97706` (amber) |
| On-track / completed color | `#16a34a` (green) |
| In-progress color | `#1e40af` (blue) |

**CSS naming convention:** Page-prefix BEM (e.g. `pd-` PersonalDashboard, `admin-` AdminDashboard, `ceo-` CEODashboard).

---

## Agent Instructions

When an agent is assigned a feature:

1. **Read the feature spec** in this README (§ Feature N above).
2. **Read the relevant stub files** — page `index.tsx` and component JSDoc comments contain full specs.
3. **Use existing data** from `src/data/mockActions.ts` and `src/data/mockMeetings.ts` — do NOT create new mock data files.
4. **Use existing components** — `StatusBadge`, `PriorityBadge`, `Modal`, `KPISummaryTiles`, `ActionsByDepartmentBar`, `StatusUpdateModal`, `EmailAlertPreview` are all ready to import.
5. **Match the design language** — copy CSS patterns from `PersonalDashboard.css` and `LoginPage.css`.
6. **No backend, no API calls** — everything is local state + mock data.
7. **Run `pnpm build`** after completing work to verify zero TypeScript errors.

### Priority order for demo (23 Apr 2026)

| Priority | Feature | Who sees it in demo |
|---|---|---|
| P0 | Feature 3 — AdminDashboard (full) | CEO Office Admin flow |
| P0 | Feature 6 — CEODashboard (full) | CEO view flow |
| P1 | Feature 7 — Wire StatusUpdateModal into pages | Action owner flow |
| P1 | Feature 5 — Complete EmailPreviewPage | Admin demo |
| P2 | Feature 4 — CreateMeetingPage | Admin demo |
| P3 | Feature 8 — Gantt Timeline | Nice to have |

---

## BRD Reference

Full requirements: `src/assets/ECC_BRD_Lupin_Diagnostics_v1.0.docx`

BRD user stories mapped to features:
- **US-01** → Feature 4 (Admin creates meeting + assigns actions)
- **US-02** → Feature 3 (Admin views consolidated dashboard)
- **US-03** → Feature 7 (Owner updates action status)
- **US-04** → Feature 5 (Automated email alert simulation)
- **US-05** → Feature 2 (Owner views personal action list)
- **US-06** → Feature 7 (Owner flags action as Blocked)
- **US-07** → Feature 6 (CEO views analytics dashboard)
