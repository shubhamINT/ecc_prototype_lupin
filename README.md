# ECC Platform — Lupin Diagnostics Prototype

**Executive Command Centre** — Unified Action Item Tracking & CEO Office MOM Governance Platform

**Client:** Lupin Diagnostics  
**Prepared by:** Indus Net Technologies (INT.)  
**Demo date:** 23 April 2026  
**Phase:** 4 (Frontend prototype — Phases 1 to 4 implemented, all data mocked)

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
│   │   │   ├── GanttTimeline.tsx          # DONE ✅ — horizontal action deadline timeline
│   │   │   ├── ActionsByDepartmentBar.tsx # Stacked bar chart by department + status
│   │   │   └── GanttTimeline.css
│   │   │
│   │   ├── email/
│   │   │   └── EmailAlertPreview.tsx  # Modal showing simulated T-3/overdue alert email
│   │   │
│   │   └── meetings/
│   │       ├── CreateMeetingForm.tsx   # DONE ✅ — meeting → MOM → action items flow
│   │       └── CreateMeetingForm.css
│   │
│   └── pages/                # Route-level components (one folder per route)
│       │
│       ├── LoginPage/             # Route: /
│       │   ├── index.tsx          # DONE ✅ — role selector + login button
│       │   └── LoginPage.css
│       │
│       ├── PersonalDashboard/     # Route: /personal-dashboard
│       │   ├── index.tsx          # DONE ✅ — action owner view for Rajesh Satope
│       │   └── PersonalDashboard.css
│       │
│       ├── AdminDashboard/        # Route: /admin-dashboard
│       │   ├── index.tsx          # DONE ✅ — CEO Office Admin command center
│       │   └── AdminDashboard.css
│       │
│       ├── CEODashboard/          # Route: /ceo-dashboard
│       │   ├── index.tsx          # DONE ✅ — CEO analytics dashboard with Recharts
│       │   └── CEODashboard.css
│       │
│       ├── CreateMeetingPage/     # Route: /create-meeting
│       │   ├── index.tsx          # DONE ✅ — meeting + MOM creation workflow page
│       │   └── CreateMeetingPage.css
│       │
│       └── EmailPreviewPage/      # Route: /email-preview
│           ├── index.tsx          # DONE ✅ — simulated alert email with deep-link flow
│           └── EmailPreviewPage.css
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
| `/admin-dashboard` | AdminDashboard | CEO Office Admin | ✅ Done |
| `/ceo-dashboard` | CEODashboard | CEO | ✅ Done |
| `/create-meeting` | CreateMeetingPage | CEO Office Admin | ✅ Done |
| `/email-preview` | EmailPreviewPage | All | ✅ Done |

---

## User Roles

Defined in `src/types/auth.ts`. All users are mock — no real auth.

| Role ID | Name | Dashboard Route | Color |
|---|---|---|---|
| `ceo` | Rajesh Kumar | `/ceo-dashboard` | Purple `#7c3aed` |
| `ceo-office-admin` | Priya Sharma | `/admin-dashboard` | Cyan `#0891b2` |
| `head-of-it` | Rajesh Satope | `/personal-dashboard` | Blue `#1e40af` |
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
Role switcher with 3 top-level modes: CEO Office Admin, Action Owner, CEO.  
When "Action Owner" is selected, the admin can choose the specific owner and route straight to the matching dashboard.  
**Demo:** Select "Head of IT" → shows Rajesh Satope's personal dashboard.

---

### Feature 2 — Personal Action Owner Dashboard ✅ DONE
**File:** `src/pages/PersonalDashboard/index.tsx`  
Shows Rajesh Satope's consolidated IT action list across multiple meetings.  
Includes source meeting context, red overdue rows, amber deadline warning states, and inline status update dropdowns directly in the table.

---

### Feature 3 — CEO Office Admin Dashboard ✅ DONE
**File:** `src/pages/AdminDashboard/index.tsx`  
**Description:** Command center for Priya Sharma — all actions, all owners, all departments.

**Delivered:**
1. Summary cards for Open, Overdue, Due This Week, and Completed
2. Full action table with risk highlighting and status modal wiring
3. Working Department and Status filters
4. Search by action title or assignee
5. Direct navigation to Create Meeting and Email Preview
6. Quick drilldown chips: `All Departments` → `IT Focus` → `Rajesh Drilldown`
7. Gantt-style timeline section based on currently filtered actions

---

### Feature 4 — Meeting + MOM Creation Flow ✅ DONE
**File:** `src/pages/CreateMeetingPage/index.tsx` + `src/components/meetings/CreateMeetingForm.tsx`  
**Description:** Working multi-step workflow for the CEO Office admin to create a meeting record from scratch.

**Delivered:**
1. Meeting Details step with title, date, department, and participant selection
2. MOM step with a lightweight rich-text editor toolbar for bold, bullets, and numbered lists
3. Action Items step with dynamic add/remove rows for owner, deadline, and priority
4. Validation between steps, live summary sidebar, submission preview, success state, and redirect to `/admin-dashboard`

**Demo:** Create "April Board Review" live, capture the MOM, and assign 3 action items before submitting.

---

### Feature 5 — Simulated Email Alert Preview ✅ DONE
**File:** `src/pages/EmailPreviewPage/index.tsx` + `src/components/email/EmailAlertPreview.tsx`  
**Delivered:**
1. Dedicated Email Preview screen with 3 scenario tabs: Overdue Alert, T-3 Reminder, and Upcoming Deadline
2. Realistic simulated email rendering with sender/subject metadata and action-item detail card
3. Prominent `Update Status` CTA that simulates a deep link (`ecc://actions/<id>...`) and opens `StatusUpdateModal`
4. Save flow updates local action state and confirms with a toast

---

### Feature 6 — CEO Analytics Dashboard ✅ DONE
**File:** `src/pages/CEODashboard/index.tsx`

**Delivered:**
1. KPI row with `Total Active`, `Closure Rate`, `Overdue Count`, and `Avg Days to Close`
2. Recharts bar chart for `Action Items by Department`
3. Department breakdown table with closure-rate and overdue visibility
4. Top 5 overdue items panel for CEO risk review

**Data:** `MOCK_ACTIONS`, `getActionStats()` from `src/data/mockActions.ts`  
**Library:** `recharts`

---

### Feature 7 — Status Update Modal ✅ WIRED
**File:** `src/components/actions/StatusUpdateModal.tsx`  
**Status:** Wired into `AdminDashboard`, `EmailPreviewPage` deep-link simulation, and click-to-open in `PersonalDashboard`.
**Delivered:**
1. `Blocked` flow requires a reason
2. `Completed` flow supports notes plus evidence upload field
3. Context-aware initialization and validation before save

---

### Feature 8 — Gantt Timeline View ✅ DONE
**File:** `src/components/charts/GanttTimeline.tsx`  
Horizontal timeline visualizing actions from `createdAt` to `dueDateIso` with:
1. Status-colored bars
2. `Today` marker
3. Filter-aware data source (follows Admin dashboard drilldown filters)

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
