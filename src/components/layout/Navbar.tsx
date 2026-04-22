import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROLE_LABELS } from '../../types/auth';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
          <rect width="36" height="36" rx="8" fill="#1e40af" />
          <path d="M8 10h6l4 8 4-8h6l-10 16L8 10z" fill="white" />
        </svg>
        <span className="navbar-brand-text">ECC<span>Platform</span></span>
      </div>

      <div className="navbar-right">
        <div className="navbar-user">
          <div className={`navbar-avatar role-${user.role}`}>{user.initials}</div>
          <div className="navbar-user-info">
            <span className="navbar-user-name">{user.name}</span>
            <span className="navbar-user-role">{ROLE_LABELS[user.role]}</span>
          </div>
        </div>
        <button className="navbar-logout" onClick={handleLogout}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 14H3a1 1 0 01-1-1V3a1 1 0 011-1h3M10 11l3-3-3-3M13 8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Logout
        </button>
      </div>
    </header>
  );
}
