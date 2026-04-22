import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { Role } from '../../types/auth';
import { MOCK_USERS, ROLE_LABELS, ROLE_DESCRIPTIONS } from '../../types/auth';
import { LUPIN_LOGO_URL } from '../../constants/branding';
import './LoginPage.css';

type LoginMode = 'ceo-office-admin' | 'action-owner' | 'ceo';

const LOGIN_MODES: Array<{
  id: LoginMode;
  label: string;
  description: string;
}> = [
  {
    id: 'ceo-office-admin',
    label: 'CEO Office Admin',
    description: 'Command center for all actions, meetings, and owners',
  },
  {
    id: 'action-owner',
    label: 'Action Owner',
    description: 'Personal dashboard for department heads and assignees',
  },
  {
    id: 'ceo',
    label: 'CEO',
    description: 'Executive view across departments and risk hotspots',
  },
];

const ACTION_OWNER_ROLES: Role[] = [
  'head-of-it',
  'head-of-finance',
  'head-of-operations',
];

const ROLE_ROUTES: Record<Role, string> = {
  ceo: '/ceo-dashboard',
  'ceo-office-admin': '/admin-dashboard',
  'head-of-it': '/personal-dashboard',
  'head-of-finance': '/personal-dashboard',
  'head-of-operations': '/personal-dashboard',
};

export default function LoginPage() {
  const [selectedMode, setSelectedMode] = useState<LoginMode>('action-owner');
  const [selectedOwnerRole, setSelectedOwnerRole] = useState<Role>('head-of-it');
  const { login } = useAuth();
  const navigate = useNavigate();

  const selectedRole: Role =
    selectedMode === 'action-owner' ? selectedOwnerRole : selectedMode;

  const handleLogin = () => {
    login(selectedRole);
    navigate(ROLE_ROUTES[selectedRole]);
  };

  return (
    <div className="login-root">
      <div className="login-left">
        <div className="login-brand">
          <div className="login-logo">
            <img className="login-logo-image" src={LUPIN_LOGO_URL} alt="Lupin Diagnostics logo" />
            <span className="login-logo-text">ECC<span>Platform</span></span>
          </div>
          <p className="login-brand-tagline">Executive Control Center · Lupin Diagnostics</p>
        </div>

        <div className="login-hero-text">
          <h1>Track. Comply.<br />Lead.</h1>
          <p>
            Unified compliance & corrective action dashboard for leadership.
            Real-time visibility across all departments.
          </p>
        </div>

        <div className="login-stats-row">
          <div className="login-stat">
            <span className="login-stat-num">247</span>
            <span className="login-stat-label">Active Actions</span>
          </div>
          <div className="login-stat-divider" />
          <div className="login-stat">
            <span className="login-stat-num">94%</span>
            <span className="login-stat-label">On-Time Rate</span>
          </div>
          <div className="login-stat-divider" />
          <div className="login-stat">
            <span className="login-stat-num">12</span>
            <span className="login-stat-label">Departments</span>
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-card">
          <div className="login-card-header">
            <h2>Sign in to ECC Platform</h2>
            <p>Select your role to access your dashboard</p>
          </div>

          <div className="login-role-section">
            <label className="login-label">Role Switcher</label>
            <div className="login-mode-grid">
              {LOGIN_MODES.map((mode) => {
                const active = selectedMode === mode.id;

                return (
                  <button
                    key={mode.id}
                    className={`login-mode-card ${active ? 'selected' : ''}`}
                    onClick={() => setSelectedMode(mode.id)}
                  >
                    <div className="login-mode-card-top">
                      <div className={`login-role-icon role-${mode.id}`}>
                        {mode.label.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="login-role-info">
                        <span className="login-role-name">{mode.label}</span>
                        <span className="login-role-desc">{mode.description}</span>
                      </div>
                      {active && (
                        <div className="login-role-check">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <circle cx="8" cy="8" r="8" fill="var(--color-primary)" />
                            <path d="M5 8l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {selectedMode === 'action-owner' && (
            <div className="login-owner-section">
              <label className="login-label" htmlFor="action-owner-role">Action Owner</label>
              <div className="login-owner-card">
                <select
                  id="action-owner-role"
                  className="login-owner-select"
                  value={selectedOwnerRole}
                  onChange={(e) => setSelectedOwnerRole(e.target.value as Role)}
                >
                  {ACTION_OWNER_ROLES.map((role) => (
                    <option key={role} value={role}>
                      {ROLE_LABELS[role]}
                    </option>
                  ))}
                </select>
                <div className="login-owner-meta">
                  <div className={`login-owner-avatar role-${selectedOwnerRole}`}>
                    {MOCK_USERS[selectedOwnerRole].initials}
                  </div>
                  <div>
                    <p className="login-owner-name">{MOCK_USERS[selectedOwnerRole].name}</p>
                    <p className="login-owner-desc">{ROLE_DESCRIPTIONS[selectedOwnerRole]}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <button className="login-btn" onClick={handleLogin}>
            Login as {ROLE_LABELS[selectedRole]}
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3 9h12M10 5l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <p className="login-disclaimer">
            This is a prototype demo. No authentication required.
          </p>
        </div>
      </div>
    </div>
  );
}
