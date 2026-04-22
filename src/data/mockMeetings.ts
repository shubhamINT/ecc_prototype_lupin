import type { Meeting } from '../types/meetings';

export const MOCK_MEETINGS: Meeting[] = [
  {
    id: 'MTG-001',
    title: 'Q1 FY26 IT Security Review',
    date: '05 Mar 2026',
    dateIso: '2026-03-05',
    organizer: 'Priya Sharma',
    participants: ['Rajesh Satope', 'Rajesh Kumar', 'Priya Sharma'],
    department: 'IT',
    momText: `1. MFA rollout status reviewed. Target: all plant systems by 30 Apr 2026.
2. SOX compliance module upgrade approved for May window.
3. DR drill documentation overdue — immediate escalation required.
4. VPN decommission timeline confirmed for 25 Apr 2026.`,
    actionItemIds: ['IT-001', 'IT-002', 'IT-003', 'IT-004'],
    createdAt: '2026-03-05',
  },
  {
    id: 'MTG-002',
    title: 'Finance Compliance Deep Dive — Q1',
    date: '10 Mar 2026',
    dateIso: '2026-03-10',
    organizer: 'Priya Sharma',
    participants: ['Neha Patel', 'Rajesh Kumar', 'Priya Sharma', 'External Auditor'],
    department: 'Finance',
    momText: `1. GST reconciliation audit pending — target completion 20 Apr 2026.
2. Budget variance report for Q1 due to CEO Office by 18 Apr 2026.
3. Accounts payable SLA review scheduled for May.
4. Tax filing deadline compliance confirmed — all entities covered.`,
    actionItemIds: ['FIN-001', 'FIN-002', 'FIN-003', 'FIN-004'],
    createdAt: '2026-03-10',
  },
  {
    id: 'MTG-003',
    title: 'Operations Excellence Review — March',
    date: '15 Mar 2026',
    dateIso: '2026-03-15',
    organizer: 'Priya Sharma',
    participants: ['Arjun Mehta', 'Rajesh Kumar', 'Priya Sharma', 'Plant Managers'],
    department: 'Operations',
    momText: `1. Plant safety audit findings reviewed — 3 critical items flagged.
2. Supply chain vendor onboarding for Q2 approved.
3. Production downtime SLA breach discussed — root cause analysis due.
4. ISO 9001 recertification preparation to begin immediately.`,
    actionItemIds: ['OPS-001', 'OPS-002', 'OPS-003', 'OPS-004'],
    createdAt: '2026-03-15',
  },
  {
    id: 'MTG-004',
    title: 'Cross-Functional Leadership Sync — April',
    date: '01 Apr 2026',
    dateIso: '2026-04-01',
    organizer: 'Priya Sharma',
    participants: ['Rajesh Satope', 'Neha Patel', 'Arjun Mehta', 'Rajesh Kumar', 'Priya Sharma'],
    department: 'Cross-Functional',
    momText: `1. ECC platform rollout discussed — prototype demo scheduled for April 23.
2. Q2 budget allocation finalized pending CFO sign-off.
3. HR policy update for remote work — final draft by 15 Apr.
4. Marketing campaign for Q2 launch approved pending compliance review.`,
    actionItemIds: ['IT-006', 'FIN-004', 'HR-001', 'MKT-001'],
    createdAt: '2026-04-01',
  },
  {
    id: 'MTG-005',
    title: 'CEO Office Monthly Governance Review',
    date: '15 Apr 2026',
    dateIso: '2026-04-15',
    organizer: 'Priya Sharma',
    participants: ['Rajesh Kumar', 'Priya Sharma', 'All HODs'],
    department: 'CEO Office',
    momText: `1. 14 action items overdue across 4 departments — escalation matrix activated.
2. IT DR drill still pending — Rajesh Satope to provide EOD update.
3. Finance GST reconciliation completed — closed.
4. Operations ISO prep on track — interim audit scheduled for May 10.`,
    actionItemIds: ['IT-003', 'IT-004', 'OPS-003', 'FIN-001'],
    createdAt: '2026-04-15',
  },
];
