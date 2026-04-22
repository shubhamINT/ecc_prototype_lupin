import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROLE_LABELS } from '../../types/auth';
import { LUPIN_LOGO_URL } from '../../constants/branding';
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
        <div className="navbar-logo">
          <img className="navbar-logo-image" src={LUPIN_LOGO_URL} alt="Lupin Diagnostics logo" />
        </div>
        <span className="navbar-brand-text">Lupin<span>Diagnostics</span></span>
      </div>

      <div className="navbar-right">
        <div className="navbar-notifications" style={{ position: 'relative', cursor: 'pointer', marginRight: '16px', display: 'flex', alignItems: 'center', color: '#64748b' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          <span style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#dc2626', color: 'white', borderRadius: '50%', width: '16px', height: '16px', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>3</span>
        </div>
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
