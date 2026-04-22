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
  // ── Upcoming Meetings ──
  {
    id: 'MTG-006',
    title: 'IT Security & DR Drill Follow-up Review',
    date: '30 Apr 2026',
    dateIso: '2026-04-30',
    organizer: 'Priya Sharma',
    participants: ['Rajesh Satope', 'Rajesh Kumar', 'Priya Sharma'],
    department: 'IT',
    momText: '',
    actionItemIds: ['IT-003', 'IT-004', 'IT-009'],
    createdAt: '2026-04-22',
    keyPoints: [
      'DR Drill documentation (IT-003) is 12 days overdue — Rajesh Satope must present sign-off status or escalate.',
      'VPN decommission (IT-004) due same day as this meeting — confirm network team sign-off received.',
      'Oracle licensing (IT-009) blocked on CFO budget approval — decision may be required in this meeting.',
      'Ask Rajesh: Is MFA rollout on track for 30 Apr deadline? 72% progress as of last update.',
      'Risk: Two high-priority IT items due the same day as this meeting. Contingency plan needed if either slips.',
    ],
  },
  {
    id: 'MTG-007',
    title: 'Finance & Compliance Audit Review — Q1 Close',
    date: '10 May 2026',
    dateIso: '2026-05-10',
    organizer: 'Priya Sharma',
    participants: ['Neha Patel', 'Rajesh Kumar', 'Priya Sharma'],
    department: 'Finance',
    momText: '',
    actionItemIds: ['FIN-001', 'FIN-005', 'FIN-007'],
    createdAt: '2026-04-22',
    keyPoints: [
      'GST reconciliation (FIN-001) is overdue by 2 days — request closure confirmation from Neha before meeting.',
      'Pathology lab reimbursements (FIN-005) at 40% completion — ask for updated timeline.',
      'Capex for MRI machine (FIN-007) is blocked awaiting Siemens revised quote — check if CFO sign-off is ready.',
      'Q1 budget variance report already submitted (3.2% under budget) — positive story to open with.',
      'Prepare: What is the Finance department closure rate vs. plan for Q1?',
    ],
  },
  {
    id: 'MTG-008',
    title: 'Operations ISO 9001 Interim Audit Prep',
    date: '10 May 2026',
    dateIso: '2026-05-10',
    organizer: 'Priya Sharma',
    participants: ['Arjun Mehta', 'Rajesh Kumar', 'Priya Sharma'],
    department: 'Operations',
    momText: '',
    actionItemIds: ['OPS-003', 'OPS-004', 'OPS-007'],
    createdAt: '2026-04-22',
    keyPoints: [
      'Production downtime root cause analysis (OPS-003) is 17 days overdue — escalation required before meeting.',
      'ISO 9001 prep (OPS-004) at 50% — confirm interim audit readiness checklist is complete by May 5.',
      'Biomedical waste compliance flag (OPS-007) at 90% — expect closure confirmation from Arjun.',
      'Ask: Has vendor onboarding for Q2 (OPS-002) started? 4 vendors need to be onboarded by May 15.',
      'Risk: If OPS-003 root cause is unresolved, ISO auditors may flag it as a critical non-conformance.',
    ],
  },
  {
    id: 'MTG-009',
    title: 'CEO Quarterly Governance Review — Q1 FY26',
    date: '05 Jun 2026',
    dateIso: '2026-06-05',
    organizer: 'Priya Sharma',
    participants: ['Rajesh Kumar', 'Priya Sharma', 'Rajesh Satope', 'Neha Patel', 'Arjun Mehta'],
    department: 'CEO Office',
    momText: '',
    actionItemIds: ['IT-001', 'IT-002', 'FIN-004', 'OPS-001', 'OPS-004'],
    createdAt: '2026-04-22',
    keyPoints: [
      'Full Q1 action closure report needed — request Priya to prepare department-wise closure summary by May 30.',
      'IT: MFA rollout and SOX upgrade should both be complete by this date — confirm with Rajesh Satope.',
      'Finance: Q2 budget allocation (FIN-004) must be signed off before this review.',
      'Operations: Plant safety audit remediation (OPS-001) and ISO 9001 prep (OPS-004) — expect final status.',
      'Set Q2 action ownership targets in this meeting. Recommend discussing escalation thresholds.',
      'Strategic: ECC platform demo feedback from prototype review should be incorporated into Q2 roadmap.',
    ],
  },
];
