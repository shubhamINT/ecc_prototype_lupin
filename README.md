# ECC Platform — Lupin Diagnostics Prototype

**Executive Command Centre** — Unified Action Item Tracking & CEO Office MOM Governance Platform

**Client:** Lupin Diagnostics  
**Prepared by:** Indus Net Technologies (INT.)  
**Demo date:** 23 April 2026  
**Phase:** 4 (Frontend prototype — Phases 1 to 4 implemented, all data mocked)

---

## What This System Does — The Full Story

### The Problem

CEO has meetings. Meetings produce action items. People own those actions. Nobody tracks. Deadlines slip. CEO finds out too late.

ECC fixes this — one platform where every action from every meeting is tracked, reminded, and visible to the right person.

---

### The People (Roles)

**Rajesh Kumar — CEO**
- Sees org-wide picture only. No editing.
- Dashboard: KPIs, department performance, overdue risks, upcoming meetings + prep briefs
- Can't touch individual actions. Strategic view only.

**Priya Sharma — CEO Office Admin**
- Controls everything. Creates meetings, writes MOM, assigns actions to owners.
- Admin Dashboard: sees all actions across all departments, filters, exports.
- Sends email alerts. Opens meeting records. Creates new meetings.

**Rajesh Satope / Neha Patel / Arjun Mehta — Heads of IT / Finance / Operations**
- See only their own actions. Can't see each other's.
- Personal Dashboard: update status, mark blocked, upload evidence.
- Get email alerts when deadline approaches.

---

### Data Flow — Step by Step

```
MEETING HAPPENS
      ↓
Priya opens "Create Meeting"
      ↓
Fills: title, date, department, participants
      ↓
Writes MOM — OR — pastes transcript → AI extracts MOM automatically
      ↓
Step 3: Action items extracted (id, owner, deadline, priority)
      ↓
Actions saved → mockActions.ts (in real system → database)
      ↓
─────────────────────────────────────────────────────────
                    WHAT HAPPENS NEXT
─────────────────────────────────────────────────────────
      ↓
Email alert engine watches deadlines:
  T-7 days → reminder email to owner
  T-3 days → urgent email to owner
  T-0 day  → final email to owner
  Overdue  → escalation email
      ↓
Owner gets email → clicks "Update Status Now" → deep link → opens their dashboard
      ↓
Owner updates: In Progress / Blocked / Completed
  If Blocked → must give reason
  If Completed → must give notes or upload evidence
      ↓
Calendar auto-syncs → owner's Outlook/Google Calendar updated
      ↓
Admin (Priya) sees status change live in Admin Dashboard
      ↓
CEO (Rajesh) sees aggregate numbers in CEO Dashboard
```

---

### What Each Page Does

| Page | Who sees it | Purpose |
|---|---|---|
| Login | Everyone | Role picker → routes to correct dashboard |
| Personal Dashboard | Owners (3 HODs) | My actions only. Update status inline. See sync badge. |
| Admin Dashboard | Priya | All actions. Filter. Search. Export. Create meetings. Send alerts. |
| CEO Dashboard | Rajesh Kumar | KPIs. Dept chart. Top overdue. Upcoming meetings + prep briefs. |
| Create Meeting | Priya | 3-step: meeting details → MOM → action items |
| Email Preview | All | Simulates what alert emails look like |

---

### Calendar Integration — How It Fits

```
Action created → calendarSynced: false
      ↓
Owner updates status (any change)
      → calendarSynced: true automatically
      → toast: "Calendar auto-synced · IT-001 pushed to Rajesh's Outlook"
      → row shows green "Synced" badge

Upcoming meeting in CEO Dashboard
      → CEO clicks "Add to Calendar" → picks Outlook or Google
      → .ics downloads OR Google Calendar opens pre-filled
      → button flips to "✓ Added to Calendar"
      → CEO clicks "Prep Brief" → sees 5 key points to prepare
```

---

### What's Real vs Fake (Prototype)

| Thing | Reality |
|---|---|
| All action/meeting data | Mock in-memory. Resets on refresh. |
| AI transcript extraction | Simulated — loads hardcoded sample |
| Email alerts | Preview only — no actual emails sent |
| Calendar sync | .ics download / opens Google/Outlook URL — actually works |
| Auto-sync on status change | Fake — just flips a boolean + shows toast |
| Auth / login | Mock — no passwords, no tokens |
| Export CSV | Actually works — real file download |

---

### Single Sentence Per Role

- **CEO** → sees the forest, not trees. Upcoming meetings with prep intel. No editing.
- **Admin (Priya)** → air traffic control. Creates everything, monitors everything, alerts everyone.
- **HODs** → update their own actions before deadline or get escalated.
- **Calendar** → passive reminder layer. Actions push deadlines into owners' calendars. CEO gets meetings synced with prep notes baked in.

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
│   ├── constants/
│   │   └── branding.ts       # Brand constants (company name, colors, logo refs)
│   │
│   ├── types/                # TypeScript interfaces — NO mock data here
│   │   ├── auth.ts           # Role, User, MOCK_USERS, ROLE_LABELS, ROLE_DESCRIPTIONS
│   │   ├── actions.ts        # ActionItem, ActionStatus, Priority, Department, label maps
│   │   │                     # calendarSynced field on ActionItem
│   │   └── meetings.ts       # Meeting, MOMEntry, prepBriefPoints
│   │
│   ├── data/                 # ALL fake/mock data for the prototype
│   │   ├── mockActions.ts    # Action items across 5 meetings, 4 departments
│   │   │                     # Exports: MOCK_ACTIONS, getActionsByOwner(),
│   │   │                     #          getActionsByDepartment(), getActionStats()
│   │   └── mockMeetings.ts   # 5 meetings with full MOM text, participant lists,
│   │                         # prepBriefPoints for CEO prep view
│   │
│   ├── context/
│   │   └── AuthContext.tsx   # AuthProvider, useAuth hook — login/logout via role
│   │
│   ├── utils/
│   │   ├── dateUtils.ts      # formatDate, getDaysLeft, isOverdue, isDueSoon
│   │   ├── statusUtils.ts    # STATUS_BG/TEXT/BORDER color maps for badges
│   │   └── calendarUtils.ts  # generateICS(), buildGoogleCalendarUrl(),
│   │                         # buildOutlookCalendarUrl() — used by calendar buttons
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx    # Top nav with user avatar + logout — used on all dashboards
│   │   │   └── Navbar.css
│   │   │
│   │   ├── ui/               # Reusable atomic components
│   │   │   ├── StatusBadge.tsx              # Colored badge for ActionStatus
│   │   │   ├── PriorityBadge.tsx            # Colored badge for Priority
│   │   │   ├── Modal.tsx                    # Generic modal wrapper
│   │   │   ├── AddToCalendarButton.tsx      # Action deadline → owner's calendar
│   │   │   │                                # Generates .ics or opens Google URL
│   │   │   ├── AddMeetingToCalendarButton.tsx  # Meeting → CEO's calendar
│   │   │   │                                   # Outlook .ics or Google pre-fill
│   │   │   └── CalendarSyncToast.tsx        # Toast notification shown after
│   │   │                                    # auto-sync on status update
│   │   │
│   │   ├── actions/
│   │   │   └── StatusUpdateModal.tsx  # Modal for owner to update action status
│   │   │                              # Triggers calendar sync + toast on save
│   │   │
│   │   ├── charts/
│   │   │   ├── KPISummaryTiles.tsx        # Row of 5 KPI stat cards
│   │   │   ├── GanttTimeline.tsx          # Horizontal action deadline timeline
│   │   │   ├── ActionsByDepartmentBar.tsx # Stacked bar chart by dept + status
│   │   │   └── GanttTimeline.css
│   │   │
│   │   ├── email/
│   │   │   └── EmailAlertPreview.tsx  # Modal showing simulated alert email
│   │   │
│   │   └── meetings/
│   │       ├── CreateMeetingForm.tsx   # Meeting → MOM → action items flow
│   │       └── CreateMeetingForm.css
│   │
│   └── pages/                # Route-level components (one folder per route)
│       │
│       ├── LoginPage/             # Route: /
│       │   ├── index.tsx
│       │   └── LoginPage.css
│       │
│       ├── PersonalDashboard/     # Route: /personal-dashboard
│       │   ├── index.tsx          # Action owner view — calendarSynced badge per row
│       │   └── PersonalDashboard.css
│       │
│       ├── AdminDashboard/        # Route: /admin-dashboard
│       │   ├── index.tsx          # Full action table — MOCK_MEETINGS wired for meeting count
│       │   └── AdminDashboard.css
│       │
│       ├── CEODashboard/          # Route: /ceo-dashboard
│       │   ├── index.tsx          # Upcoming meetings panel with Add to Calendar + Prep Brief
│       │   └── CEODashboard.css
│       │
│       ├── CreateMeetingPage/     # Route: /create-meeting
│       │   ├── index.tsx
│       │   └── CreateMeetingPage.css
│       │
│       └── EmailPreviewPage/      # Route: /email-preview
│           ├── index.tsx
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
- Action items across IT, Finance, Operations, HR/Marketing departments
- Spread across **5 meetings** (`MTG-001` to `MTG-005`)
- Status mix: open · in-progress · overdue · completed · blocked
- Each action has `calendarSynced: boolean` — flipped to `true` on any status update
- Helper functions: `getActionsByOwner(ownerId)`, `getActionsByDepartment(dept)`, `getActionStats()`

### Meetings (`mockMeetings.ts`)
- **5 meetings** with full MOM text, participant lists, dates
- Each meeting has `prepBriefPoints: string[]` — 5 bullet CEO prep notes shown on CEO Dashboard
- Cross-references `actionItemIds[]` matching IDs in `mockActions.ts`

### ActionStatus values
`open` · `in-progress` · `overdue` · `completed` · `blocked`

---

## Feature Build Status

### Feature 1 — Login Page with Role Switcher ✅ DONE
**File:** `src/pages/LoginPage/index.tsx`  
Role switcher with 3 top-level modes: CEO, CEO Office Admin, Action Owner.  
No top-level role preselected on initial load or return-to-login after logout.  
"Action Owner" expands to pick specific owner → routes to matching dashboard.

---

### Feature 2 — Personal Action Owner Dashboard ✅ DONE
**File:** `src/pages/PersonalDashboard/index.tsx`  
Selected action owner's consolidated action list across meetings.  
Source meeting context, red overdue rows, amber deadline warnings, inline status update dropdowns.  
Green "Synced" calendar badge appears per row after any status update.

---

### Feature 3 — CEO Office Admin Dashboard ✅ DONE
**File:** `src/pages/AdminDashboard/index.tsx`  
Command center for Priya Sharma — all actions, all owners, all departments.

**Delivered:**
1. Summary cards: Open, Overdue, Due This Week, Completed, Total Meetings
2. Full action table with risk highlighting and status modal
3. Working Department and Status filters
4. Search by action title or assignee
5. Navigation to Create Meeting and Email Preview
6. Quick drilldown chips: `All Departments` → `IT Focus` → `Rajesh Drilldown`
7. Gantt-style timeline section based on filtered actions

---

### Feature 4 — Meeting + MOM Creation Flow ✅ DONE
**File:** `src/pages/CreateMeetingPage/index.tsx` + `src/components/meetings/CreateMeetingForm.tsx`  
Multi-step workflow: meeting details → MOM editor → action items.

**Delivered:**
1. Meeting Details step: title, date, department, participant selection
2. MOM step: lightweight rich-text toolbar (bold, bullets, numbered lists)
3. Action Items step: dynamic add/remove rows (owner, deadline, priority)
4. Transcript upload → simulated AI extraction of MOM
5. Validation between steps, live summary sidebar, success state, redirect to `/admin-dashboard`

---

### Feature 5 — Simulated Email Alert Preview ✅ DONE
**File:** `src/pages/EmailPreviewPage/index.tsx` + `src/components/email/EmailAlertPreview.tsx`

**Delivered:**
1. 3 scenario tabs: Overdue Alert, T-3 Reminder, Upcoming Deadline
2. Realistic simulated email rendering with sender/subject metadata
3. `Update Status` CTA simulates deep link → opens `StatusUpdateModal`
4. Save flow updates local action state + confirms with toast

---

### Feature 6 — CEO Analytics Dashboard ✅ DONE
**File:** `src/pages/CEODashboard/index.tsx`

**Delivered:**
1. KPI row: Total Active, Closure Rate, Overdue Count, Avg Days to Close
2. Recharts bar chart: Action Items by Department
3. Department breakdown table with closure-rate and overdue visibility
4. Top 5 overdue items panel
5. Upcoming meetings panel with `Add to Calendar` (Outlook/Google) + `Prep Brief` modal

**Library:** `recharts`

---

### Feature 7 — Status Update Modal ✅ WIRED
**File:** `src/components/actions/StatusUpdateModal.tsx`  
Wired into `AdminDashboard`, `EmailPreviewPage` deep-link simulation, `PersonalDashboard`.

**Delivered:**
1. `Blocked` flow requires a reason
2. `Completed` flow supports notes + evidence upload
3. On save: flips `calendarSynced: true` + shows `CalendarSyncToast`

---

### Feature 8 — Gantt Timeline View ✅ DONE
**File:** `src/components/charts/GanttTimeline.tsx`  
Horizontal timeline from `createdAt` to `dueDateIso` with status-colored bars, Today marker, filter-aware data source.

---

### Feature 9 — Calendar Integration ✅ DONE

**Files:**
- `src/utils/calendarUtils.ts` — ICS generation, Google Calendar URL builder, Outlook URL builder
- `src/components/ui/AddToCalendarButton.tsx` — action deadline → owner's calendar
- `src/components/ui/AddMeetingToCalendarButton.tsx` — meeting → CEO's calendar (Outlook .ics or Google pre-fill)
- `src/components/ui/CalendarSyncToast.tsx` — toast shown after auto-sync

**Delivered:**
1. CEO Dashboard upcoming meetings: "Add to Calendar" button → Outlook .ics download or Google Calendar pre-filled URL
2. Button flips to "✓ Added to Calendar" after click
3. "Prep Brief" button opens modal with 5 key preparation points per meeting
4. Personal Dashboard: `calendarSynced` badge (green "Synced" / grey "Not synced") per action row
5. Status update on any action → auto-sets `calendarSynced: true` + shows CalendarSyncToast

---

## Design System

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
| Calendar synced color | `#16a34a` (green) |

**CSS naming convention:** Page-prefix BEM (e.g. `pd-` PersonalDashboard, `admin-` AdminDashboard, `ceo-` CEODashboard).

---

## Agent Instructions

When an agent is assigned a feature:

1. **Read the feature spec** in this README (§ Feature N above).
2. **Read the relevant stub files** — page `index.tsx` and component JSDoc comments contain full specs.
3. **Use existing data** from `src/data/mockActions.ts` and `src/data/mockMeetings.ts` — do NOT create new mock data files.
4. **Use existing components** — `StatusBadge`, `PriorityBadge`, `Modal`, `KPISummaryTiles`, `ActionsByDepartmentBar`, `StatusUpdateModal`, `EmailAlertPreview`, `AddToCalendarButton`, `AddMeetingToCalendarButton`, `CalendarSyncToast` are all ready to import.
5. **Match the design language** — copy CSS patterns from `PersonalDashboard.css` and `LoginPage.css`.
6. **No backend, no API calls** — everything is local state + mock data.
7. **Run `pnpm build`** after completing work to verify zero TypeScript errors.

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
- **US-08** → Feature 9 (Calendar sync for actions and meetings)
