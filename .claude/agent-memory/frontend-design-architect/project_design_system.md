---
name: ECC Lupin Diagnostics Design System
description: Complete design tokens, CSS patterns, and component conventions for the ECC Lupin prototype
type: project
---

React + TypeScript + plain CSS project. No UI libraries. No CSS Modules — global CSS files co-located with each page.

**Background:** `#f8fafc`
**Cards:** `background: white; border: 1px solid #e2e8f0; border-radius: 12px or 16px; padding: 20px;`
**Max widths:** PersonalDashboard 1200px, AdminDashboard/CEODashboard 1400px
**Body padding:** `32px 40px 72px` (desktop), stacks down at ≤768px

**Typography:**
- Page titles: `26px, font-weight: 800, color: #0f172a, letter-spacing: -0.6px`
- Table headings (th): `11px, font-weight: 600, color: #94a3b8, text-transform: uppercase, letter-spacing: 0.5px`
- Table cells (td): `padding: 14px 16px; border-bottom: 1px solid #f8fafc; vertical-align: middle;`
- Subtitles / secondary text: `14px, color: #64748b`
- Muted: `color: #94a3b8`

**Status colors (from statusUtils.ts):**
- open: bg `#f1f5f9`, text `#475569`, border `#e2e8f0`
- in-progress: bg `#eff6ff`, text `#1e40af`, border `#bfdbfe`
- overdue: bg `#fef2f2`, text `#dc2626`, border `#fecaca`
- completed: bg `#f0fdf4`, text `#16a34a`, border `#bbf7d0`
- blocked: bg `#fffbeb`, text `#d97706`, border `#fde68a`

**Priority colors:**
- high: bg `#fee2e2`, text `#dc2626`
- medium: bg `#fef3c7`, text `#d97706`
- low: bg `#f1f5f9`, text `#64748b`

**Row highlights:**
- Overdue row: `background: #fff8f8`
- At-risk row (daysLeft 0–3, not completed): `background: #fffbeb`

**Department pill colors:**
- IT: bg `#eff6ff`, text `#1e40af`
- Finance: bg `#f0fdf4`, text `#15803d`
- Operations: bg `#fffbeb`, text `#b45309`
- HR: bg `#fdf4ff`, text `#7e22ce`
- Marketing: bg `#fff1f2`, text `#be123c`

**Avatar colors by assignedToId:**
- head-of-it: `#1e40af`
- head-of-finance: `#059669`
- head-of-operations: `#d97706`
- ceo-office-admin: `#0891b2`

**CSS prefixes per page (BEM pattern):**
- PersonalDashboard: `pd-`
- AdminDashboard: `admin-`
- CEODashboard: `ceo-`

**CEO accent color:** `#7c3aed` (purple) — used for score ring stroke, role dot, and score badge

**Score ring sizes:**
- PersonalDashboard: 80px ring, strokeWidth 7, stroke `#1e40af`
- CEODashboard: 120px ring, strokeWidth 9, stroke `#7c3aed`
- Track stroke always `#e2e8f0`; number overlay via `position: absolute; inset: 0; display: flex; align-items: center; justify-content: center`

**KPISummaryTiles component** — standalone, fetches its own data via `getActionStats()`, renders 5 flex tiles (Total, Open, Overdue, Due This Week, Closure Rate). Used in CEODashboard kpi-row.

**ActionsByDepartmentBar component** — standalone, renders a stacked horizontal bar chart with department rows. Has its own white card wrapper inside.

**Donut/ring chart (SVG):** Use multiple `<circle>` elements with `strokeDasharray`/`strokeDashoffset`. Each segment offset = `circ - cumulativePct * circ / 100`. Rotate -90deg on each circle. Track = #f1f5f9. Stroke colors: open #94a3b8, in-progress #1e40af, overdue #dc2626, completed #16a34a.

**Bottom row layout:** `grid-template-columns: 62% 1fr` — table on left, overdue list on right. Collapses to 1-col at ≤1200px.

**Overdue item card style:** `border-left: 3px solid #dc2626; background: #fff8f8; border-radius: 0 8px 8px 0; padding: 12px 14px`

**Buttons:**
- Primary: bg `#1e40af`, white text, border-radius 9px, padding `10px 18px`, hover bg `#1d3a9e`
- Secondary: bg white, border `1px solid #e2e8f0`, color `#475569`, hover color `#1e40af`

**Breakpoints:** 1024px (tablet), 768px (mobile), 480px (small mobile). Mobile-first stacking.

**Why:** Consistency across dashboards is load-bearing — all pages share same visual language.
**How to apply:** Always check these tokens before writing new color or spacing values.
