import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import CreateMeetingForm from '../../components/meetings/CreateMeetingForm';
import './CreateMeetingPage.css';

export default function CreateMeetingPage() {
  const navigate = useNavigate();

  return (
    <div className="cmp-root">
      <Navbar />
      <div className="cmp-shell">
        <button
          type="button"
          className="cmp-back-btn"
          onClick={() => navigate('/admin-dashboard')}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Dashboard
        </button>

        <div className="cmp-hero">
          <div className="cmp-hero-copy">
            <span className="cmp-eyebrow">Meeting Management</span>
            <h1 className="cmp-title">Create a new meeting record and turn discussion into owned actions</h1>
            <p className="cmp-subtitle">
              This is the daily workflow for the CEO Office admin: capture the meeting, document the minutes, and assign owners before the conversation goes cold.
            </p>
          </div>
          <div className="cmp-meta-card">
            <p className="cmp-meta-label">Admin Use Case</p>
            <p className="cmp-meta-value">Priya Sharma</p>
            <p className="cmp-meta-copy">Prepare MOM, assign owners, and close the loop in one pass.</p>
          </div>
        </div>

        <CreateMeetingForm />
      </div>
    </div>
  );
}
