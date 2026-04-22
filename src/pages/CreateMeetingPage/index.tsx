import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import CreateMeetingForm from '../../components/meetings/CreateMeetingForm';

export default function CreateMeetingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Navbar />
      <div style={{ padding: '40px 32px 64px', maxWidth: 820, margin: '0 auto' }}>
        {/* Back button */}
        <button
          onClick={() => navigate('/admin-dashboard')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            marginBottom: 24,
            padding: '8px 16px',
            borderRadius: 8,
            border: '1.5px solid #e2e8f0',
            background: 'white',
            color: '#475569',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'border-color 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#94a3b8')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e2e8f0')}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Dashboard
        </button>

        {/* Page header */}
        <div style={{ marginBottom: 32 }}>
          <h1
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: '#0f172a',
              margin: '0 0 6px',
              letterSpacing: '-0.6px',
            }}
          >
            Create New Meeting
          </h1>
          <p style={{ color: '#64748b', margin: 0, fontSize: 14 }}>
            Record minutes of meeting and assign action items to owners.
          </p>
        </div>

        <CreateMeetingForm />
      </div>
    </div>
  );
}
