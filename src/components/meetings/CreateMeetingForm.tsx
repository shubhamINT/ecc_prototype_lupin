import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_USERS } from '../../types/auth';
import type { Priority } from '../../types/actions';

interface MeetingForm {
  title: string;
  date: string;
  department: string;
  participants: string[];
}

interface ActionForm {
  id: string;
  title: string;
  assignedTo: string;
  dueDate: string;
  priority: Priority;
}

const DEPARTMENTS = ['IT', 'Finance', 'Operations', 'HR', 'Marketing', 'Cross-Functional'];
const ALL_USERS = Object.values(MOCK_USERS);

const STEPS = ['Meeting Details', 'Minutes of Meeting', 'Action Items'];

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '11px 14px',
  borderRadius: 8,
  border: '1.5px solid #e2e8f0',
  fontSize: 14,
  color: '#0f172a',
  background: 'white',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
  outline: 'none',
  transition: 'border-color 0.15s',
};

const labelStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  color: '#64748b',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  marginBottom: 6,
  display: 'block',
};

export default function CreateMeetingForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const [meetingForm, setMeetingForm] = useState<MeetingForm>({
    title: '',
    date: '',
    department: '',
    participants: [],
  });
  const [mom, setMom] = useState('');
  const [actionItems, setActionItems] = useState<ActionForm[]>([
    { id: '1', title: '', assignedTo: '', dueDate: '', priority: 'medium' },
  ]);

  const wordCount = mom.trim() === '' ? 0 : mom.trim().split(/\s+/).length;

  const toggleParticipant = (name: string) => {
    setMeetingForm((prev) => ({
      ...prev,
      participants: prev.participants.includes(name)
        ? prev.participants.filter((p) => p !== name)
        : [...prev.participants, name],
    }));
  };

  const addActionItem = () => {
    setActionItems((prev) => [
      ...prev,
      { id: String(Date.now()), title: '', assignedTo: '', dueDate: '', priority: 'medium' },
    ]);
  };

  const removeActionItem = (id: string) => {
    if (actionItems.length === 1) return;
    setActionItems((prev) => prev.filter((a) => a.id !== id));
  };

  const updateActionItem = (id: string, field: keyof ActionForm, value: string) => {
    setActionItems((prev) =>
      prev.map((a) => (a.id === id ? { ...a, [field]: value } : a))
    );
  };

  const handleNext = () => {
    if (step === 0 && (!meetingForm.title.trim() || !meetingForm.date || !meetingForm.department)) return;
    setStep((s) => Math.min(s + 1, 2));
  };

  const handleBack = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = () => {
    console.log('New meeting:', { meeting: meetingForm, mom, actionItems });
    setSubmitted(true);
    setTimeout(() => navigate('/admin-dashboard'), 1500);
  };

  if (submitted) {
    return (
      <div
        style={{
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: 12,
          padding: '28px 32px',
          textAlign: 'center',
          color: '#15803d',
        }}
      >
        <div style={{ fontSize: 36, marginBottom: 10 }}>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style={{ display: 'block', margin: '0 auto 12px' }}>
            <circle cx="24" cy="24" r="22" fill="#16a34a" fillOpacity="0.12" />
            <path d="M14 24l8 8 14-14" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 700 }}>Meeting created successfully!</p>
        <p style={{ margin: 0, fontSize: 13, color: '#64748b' }}>Redirecting to dashboard…</p>
      </div>
    );
  }

  return (
    <div>
      {/* Step indicator */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: 32,
          gap: 0,
        }}
      >
        {STEPS.map((label, i) => {
          const isDone = i < step;
          const isActive = i === step;
          return (
            <div key={label} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 13,
                    fontWeight: 700,
                    transition: 'all 0.2s',
                    background: isDone ? '#16a34a' : isActive ? '#1e40af' : '#e2e8f0',
                    color: isDone || isActive ? 'white' : '#94a3b8',
                    flexShrink: 0,
                  }}
                >
                  {isDone ? (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 7l4 4 6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </div>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#0f172a' : isDone ? '#16a34a' : '#94a3b8',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  style={{
                    flex: 1,
                    height: 2,
                    margin: '0 14px',
                    background: isDone ? '#16a34a' : '#e2e8f0',
                    borderRadius: 2,
                    transition: 'background 0.2s',
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Form card */}
      <div
        style={{
          background: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: 12,
          padding: '28px 32px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
        }}
      >
        {/* Step 1: Meeting Details */}
        {step === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <h3 style={{ margin: '0 0 4px', fontSize: 17, fontWeight: 700, color: '#0f172a' }}>
              Meeting Details
            </h3>
            <p style={{ margin: 0, fontSize: 13, color: '#64748b' }}>
              Basic information about the meeting.
            </p>

            <div>
              <label style={labelStyle}>Meeting Title *</label>
              <input
                type="text"
                value={meetingForm.title}
                onChange={(e) => setMeetingForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="e.g. Q2 Board Strategy Review"
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#1e40af')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#e2e8f0')}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={labelStyle}>Date *</label>
                <input
                  type="date"
                  value={meetingForm.date}
                  onChange={(e) => setMeetingForm((p) => ({ ...p, date: e.target.value }))}
                  style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#1e40af')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = '#e2e8f0')}
                />
              </div>
              <div>
                <label style={labelStyle}>Department *</label>
                <select
                  value={meetingForm.department}
                  onChange={(e) => setMeetingForm((p) => ({ ...p, department: e.target.value }))}
                  style={{ ...inputStyle, appearance: 'auto' }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#1e40af')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = '#e2e8f0')}
                >
                  <option value="">Select department…</option>
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label style={labelStyle}>Participants</label>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 10,
                  padding: '14px 16px',
                  background: '#f8fafc',
                  borderRadius: 8,
                  border: '1.5px solid #e2e8f0',
                }}
              >
                {ALL_USERS.map((u) => {
                  const checked = meetingForm.participants.includes(u.name);
                  return (
                    <label
                      key={u.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        cursor: 'pointer',
                        padding: '7px 14px',
                        borderRadius: 20,
                        border: `1.5px solid ${checked ? '#1e40af' : '#e2e8f0'}`,
                        background: checked ? '#eff6ff' : 'white',
                        fontSize: 13,
                        fontWeight: checked ? 600 : 400,
                        color: checked ? '#1e40af' : '#475569',
                        transition: 'all 0.15s',
                        userSelect: 'none',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleParticipant(u.name)}
                        style={{ display: 'none' }}
                      />
                      {u.name}
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Minutes of Meeting */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <h3 style={{ margin: '0 0 4px', fontSize: 17, fontWeight: 700, color: '#0f172a' }}>
              Minutes of Meeting
            </h3>
            <p style={{ margin: 0, fontSize: 13, color: '#64748b' }}>
              Record the key discussion points, decisions, and outcomes.
            </p>

            <div>
              <label style={labelStyle}>Meeting Minutes</label>
              <textarea
                value={mom}
                onChange={(e) => setMom(e.target.value)}
                rows={10}
                placeholder="Paste or type minutes of meeting..."
                style={{
                  ...inputStyle,
                  minHeight: 180,
                  resize: 'vertical',
                  lineHeight: 1.7,
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#1e40af')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#e2e8f0')}
              />
              <p style={{ margin: '6px 0 0', fontSize: 12, color: '#94a3b8' }}>
                {wordCount} {wordCount === 1 ? 'word' : 'words'}
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Action Items */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <h3 style={{ margin: '0 0 4px', fontSize: 17, fontWeight: 700, color: '#0f172a' }}>
              Action Items
            </h3>
            <p style={{ margin: 0, fontSize: 13, color: '#64748b' }}>
              Define action items and assign owners with due dates.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {actionItems.map((item, index) => (
                <div
                  key={item.id}
                  style={{
                    background: '#f8fafc',
                    border: '1.5px solid #e2e8f0',
                    borderRadius: 10,
                    padding: '16px 18px',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: '#94a3b8',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginBottom: 12,
                    }}
                  >
                    Action Item #{index + 1}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div>
                      <label style={labelStyle}>Title *</label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => updateActionItem(item.id, 'title', e.target.value)}
                        placeholder="Describe the action item…"
                        style={inputStyle}
                        onFocus={(e) => (e.currentTarget.style.borderColor = '#1e40af')}
                        onBlur={(e) => (e.currentTarget.style.borderColor = '#e2e8f0')}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                      <div>
                        <label style={labelStyle}>Assignee</label>
                        <select
                          value={item.assignedTo}
                          onChange={(e) => updateActionItem(item.id, 'assignedTo', e.target.value)}
                          style={{ ...inputStyle, appearance: 'auto' }}
                          onFocus={(e) => (e.currentTarget.style.borderColor = '#1e40af')}
                          onBlur={(e) => (e.currentTarget.style.borderColor = '#e2e8f0')}
                        >
                          <option value="">Select…</option>
                          {ALL_USERS.map((u) => (
                            <option key={u.id} value={u.name}>{u.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label style={labelStyle}>Due Date</label>
                        <input
                          type="date"
                          value={item.dueDate}
                          onChange={(e) => updateActionItem(item.id, 'dueDate', e.target.value)}
                          style={inputStyle}
                          onFocus={(e) => (e.currentTarget.style.borderColor = '#1e40af')}
                          onBlur={(e) => (e.currentTarget.style.borderColor = '#e2e8f0')}
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>Priority</label>
                        <select
                          value={item.priority}
                          onChange={(e) => updateActionItem(item.id, 'priority', e.target.value as Priority)}
                          style={{ ...inputStyle, appearance: 'auto' }}
                          onFocus={(e) => (e.currentTarget.style.borderColor = '#1e40af')}
                          onBlur={(e) => (e.currentTarget.style.borderColor = '#e2e8f0')}
                        >
                          <option value="high">High</option>
                          <option value="medium">Medium</option>
                          <option value="low">Low</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {actionItems.length > 1 && (
                    <button
                      onClick={() => removeActionItem(item.id)}
                      title="Remove action item"
                      style={{
                        position: 'absolute',
                        top: 14,
                        right: 14,
                        width: 26,
                        height: 26,
                        borderRadius: '50%',
                        border: '1.5px solid #fecaca',
                        background: '#fef2f2',
                        color: '#dc2626',
                        fontSize: 16,
                        lineHeight: 1,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        padding: 0,
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#fee2e2')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = '#fef2f2')}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={addActionItem}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 18px',
                borderRadius: 8,
                border: '1.5px dashed #cbd5e1',
                background: 'white',
                color: '#475569',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s',
                alignSelf: 'flex-start',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#1e40af';
                e.currentTarget.style.color = '#1e40af';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#cbd5e1';
                e.currentTarget.style.color = '#475569';
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Add Action Item
            </button>
          </div>
        )}

        {/* Navigation buttons */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 28,
            paddingTop: 24,
            borderTop: '1px solid #f1f5f9',
          }}
        >
          <div>
            {step > 0 && (
              <button
                onClick={handleBack}
                style={{
                  padding: '11px 22px',
                  borderRadius: 8,
                  border: '1.5px solid #e2e8f0',
                  background: 'white',
                  color: '#475569',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  transition: 'border-color 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#94a3b8')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e2e8f0')}
              >
                ← Back
              </button>
            )}
          </div>
          <div>
            {step < 2 ? (
              <button
                onClick={handleNext}
                style={{
                  padding: '11px 26px',
                  borderRadius: 8,
                  border: 'none',
                  background: '#1e40af',
                  color: 'white',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  opacity:
                    step === 0 && (!meetingForm.title.trim() || !meetingForm.date || !meetingForm.department)
                      ? 0.5
                      : 1,
                  transition: 'opacity 0.15s',
                }}
              >
                Next →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                style={{
                  padding: '11px 28px',
                  borderRadius: 8,
                  border: 'none',
                  background: '#1e40af',
                  color: 'white',
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  boxShadow: '0 4px 14px rgba(30,64,175,0.3)',
                  transition: 'opacity 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.88')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
              >
                Submit Meeting
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
