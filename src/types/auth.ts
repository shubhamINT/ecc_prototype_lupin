export type Role =
  | 'ceo'
  | 'ceo-office-admin'
  | 'head-of-it'
  | 'head-of-finance'
  | 'head-of-operations';

export interface User {
  id: string;
  name: string;
  role: Role;
  department: string;
  initials: string;
}

export const MOCK_USERS: Record<Role, User> = {
  ceo: {
    id: '1',
    name: 'Rajesh Kumar',
    role: 'ceo',
    department: 'Executive',
    initials: 'RK',
  },
  'ceo-office-admin': {
    id: '2',
    name: 'Priya Sharma',
    role: 'ceo-office-admin',
    department: 'CEO Office',
    initials: 'PS',
  },
  'head-of-it': {
    id: '3',
    name: 'Rajesh Satope',
    role: 'head-of-it',
    department: 'Information Technology',
    initials: 'RS',
  },
  'head-of-finance': {
    id: '4',
    name: 'Neha Patel',
    role: 'head-of-finance',
    department: 'Finance',
    initials: 'NP',
  },
  'head-of-operations': {
    id: '5',
    name: 'Arjun Mehta',
    role: 'head-of-operations',
    department: 'Operations',
    initials: 'AM',
  },
};

export const ROLE_LABELS: Record<Role, string> = {
  ceo: 'CEO',
  'ceo-office-admin': 'CEO Office Admin',
  'head-of-it': 'Head of IT',
  'head-of-finance': 'Head of Finance',
  'head-of-operations': 'Head of Operations',
};

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  ceo: 'Organization-wide strategic view',
  'ceo-office-admin': 'Manage & track all action owners',
  'head-of-it': 'IT department actions & compliance',
  'head-of-finance': 'Finance department actions & compliance',
  'head-of-operations': 'Operations department actions & compliance',
};
