import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_USERS } from '../../types/auth';
import type { Priority } from '../../types/actions';
import './CreateMeetingForm.css';

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
const STEP_TITLES = ['Meeting Details', 'Minutes of Meeting', 'Action Items'] as const;
const MOM_TEMPLATE = `<p><strong>Agenda:</strong> Review current governance actions and agree next steps.</p><ul><li>Decision taken:</li><li>Escalations discussed:</li><li>Owner follow-ups:</li></ul>`;

function createEmptyAction(id: string): ActionForm {
  return {
    id,
    title: '',
    assignedTo: '',
    dueDate: '',
    priority: 'medium',
  };
}

function getPlainText(html: string) {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function formatPreviewDate(isoDate: string) {
  if (!isoDate) return 'Select a date';
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function CreateMeetingForm() {
  const navigate = useNavigate();
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');

  const [meetingForm, setMeetingForm] = useState<MeetingForm>({
    title: '',
    date: '2026-04-23',
    department: '',
    participants: ['Priya Sharma'],
  });
  const [momHtml, setMomHtml] = useState(MOM_TEMPLATE);
  const [actionItems, setActionItems] = useState<ActionForm[]>([
    createEmptyAction('action-1'),
  ]);

  const momText = useMemo(() => getPlainText(momHtml), [momHtml]);
  const wordCount = momText === '' ? 0 : momText.split(/\s+/).length;
  const completedActions = actionItems.filter(
    (item) => item.title && item.assignedTo && item.dueDate
  ).length;

  const payloadPreview = useMemo(
    () => ({
      meeting: {
        ...meetingForm,
        dateLabel: formatPreviewDate(meetingForm.date),
      },
      momText,
      actionItems,
    }),
    [actionItems, meetingForm, momText]
  );

  const updateMeetingField = <K extends keyof MeetingForm>(field: K, value: MeetingForm[K]) => {
    setMeetingForm((current) => ({ ...current, [field]: value }));
  };

  const toggleParticipant = (name: string) => {
    setMeetingForm((current) => ({
      ...current,
      participants: current.participants.includes(name)
        ? current.participants.filter((participant) => participant !== name)
        : [...current.participants, name],
    }));
  };

  const applyEditorCommand = (command: 'bold' | 'insertUnorderedList' | 'insertOrderedList') => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(command, false);
    setMomHtml(editorRef.current.innerHTML);
  };

  const handleEditorInput = () => {
    if (!editorRef.current) return;
    setMomHtml(editorRef.current.innerHTML);
  };

  const addActionItem = () => {
    setActionItems((current) => [
      ...current,
      createEmptyAction(`action-${Date.now()}-${current.length + 1}`),
    ]);
  };

  const removeActionItem = (id: string) => {
    if (actionItems.length === 1) return;
    setActionItems((current) => current.filter((item) => item.id !== id));
  };

  const updateActionItem = <K extends keyof ActionForm>(
    id: string,
    field: K,
    value: ActionForm[K]
  ) => {
    setActionItems((current) =>
      current.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const validateStep = (targetStep: number) => {
    if (targetStep === 0) {
      if (!meetingForm.title.trim() || !meetingForm.date || !meetingForm.department) {
        return 'Add the meeting title, date, and department before continuing.';
      }
      if (meetingForm.participants.length === 0) {
        return 'Select at least one participant for the meeting.';
      }
    }

    if (targetStep === 1 && wordCount < 8) {
      return 'Add a more complete MOM summary before moving to action items.';
    }

    if (targetStep === 2) {
      const hasIncompleteAction = actionItems.some(
        (item) => !item.title.trim() || !item.assignedTo || !item.dueDate
      );

      if (hasIncompleteAction) {
        return 'Complete each action item with title, owner, deadline, and priority.';
      }
    }

    return '';
  };

  const handleNext = () => {
    const message = validateStep(step);
    if (message) {
      setValidationMessage(message);
      return;
    }

    setValidationMessage('');
    setStep((current) => Math.min(current + 1, STEP_TITLES.length - 1));
  };

  const handleBack = () => {
    setValidationMessage('');
    setStep((current) => Math.max(current - 1, 0));
  };

  const handleSubmit = () => {
    const message = validateStep(2);
    if (message) {
      setValidationMessage(message);
      return;
    }

    console.log('New meeting:', payloadPreview);
    setSubmitted(true);
    window.setTimeout(() => navigate('/admin-dashboard'), 1800);
  };

  if (submitted) {
    return (
      <div className="cmf-success">
        <div className="cmf-success-icon">
          <svg width="46" height="46" viewBox="0 0 46 46" fill="none">
            <circle cx="23" cy="23" r="22" fill="#16a34a" fillOpacity="0.12" />
            <path d="M13 23l7 7 13-13" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className="cmf-success-title">Meeting logged successfully</h2>
        <p className="cmf-success-copy">
          {meetingForm.title || 'New meeting'} has been captured with {actionItems.length} action
          item{actionItems.length === 1 ? '' : 's'}. Redirecting to the admin dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="cmf-layout">
      <div className="cmf-main">
        <div className="cmf-stepper">
          {STEP_TITLES.map((label, index) => {
            const done = index < step;
            const active = index === step;

            return (
              <div key={label} className="cmf-stepper-item">
                <div className={`cmf-step-dot ${done ? 'done' : active ? 'active' : ''}`}>
                  {done ? '✓' : index + 1}
                </div>
                <div className="cmf-step-meta">
                  <p className="cmf-step-label">{label}</p>
                  <p className="cmf-step-copy">
                    {index === 0
                      ? 'Capture meeting context'
                      : index === 1
                      ? 'Write the MOM summary'
                      : 'Assign follow-up owners'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="cmf-card">
          {step === 0 && (
            <section className="cmf-section">
              <div className="cmf-section-header">
                <h2>Meeting Details</h2>
                <p>Capture the essentials Priya would fill immediately after the discussion starts.</p>
              </div>

              <div className="cmf-field">
                <label htmlFor="meeting-title">Meeting Title</label>
                <input
                  id="meeting-title"
                  className="cmf-input"
                  type="text"
                  value={meetingForm.title}
                  onChange={(event) => updateMeetingField('title', event.target.value)}
                  placeholder="April Board Review"
                />
              </div>

              <div className="cmf-grid cmf-grid-two">
                <div className="cmf-field">
                  <label htmlFor="meeting-date">Meeting Date</label>
                  <input
                    id="meeting-date"
                    className="cmf-input"
                    type="date"
                    value={meetingForm.date}
                    onChange={(event) => updateMeetingField('date', event.target.value)}
                  />
                </div>
                <div className="cmf-field">
                  <label htmlFor="meeting-department">Department</label>
                  <select
                    id="meeting-department"
                    className="cmf-input"
                    value={meetingForm.department}
                    onChange={(event) => updateMeetingField('department', event.target.value)}
                  >
                    <option value="">Select department</option>
                    {DEPARTMENTS.map((department) => (
                      <option key={department} value={department}>
                        {department}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="cmf-field">
                <label>Participants</label>
                <div className="cmf-chip-grid">
                  {ALL_USERS.map((user) => {
                    const selected = meetingForm.participants.includes(user.name);
                    return (
                      <button
                        key={user.id}
                        type="button"
                        className={`cmf-chip ${selected ? 'selected' : ''}`}
                        onClick={() => toggleParticipant(user.name)}
                      >
                        <span className={`cmf-chip-avatar role-${user.role}`}>{user.initials}</span>
                        <span>{user.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>
          )}

          {step === 1 && (
            <section className="cmf-section">
              <div className="cmf-section-header">
                <h2>Minutes of Meeting</h2>
                <p>Use the rich text box to capture decisions, escalations, and agreed next steps.</p>
              </div>

              <div className="cmf-editor-card">
                <div className="cmf-editor-toolbar">
                  <button type="button" onClick={() => applyEditorCommand('bold')}>Bold</button>
                  <button type="button" onClick={() => applyEditorCommand('insertUnorderedList')}>Bullets</button>
                  <button type="button" onClick={() => applyEditorCommand('insertOrderedList')}>Numbers</button>
                </div>
                <div
                  ref={editorRef}
                  className="cmf-editor"
                  contentEditable
                  suppressContentEditableWarning
                  onInput={handleEditorInput}
                  dangerouslySetInnerHTML={{ __html: momHtml }}
                />
                <div className="cmf-editor-footer">
                  <span>{wordCount} words</span>
                  <button
                    type="button"
                    className="cmf-link-btn"
                    onClick={() => {
                      setMomHtml(MOM_TEMPLATE);
                      if (editorRef.current) {
                        editorRef.current.innerHTML = MOM_TEMPLATE;
                      }
                    }}
                  >
                    Reset template
                  </button>
                </div>
              </div>
            </section>
          )}

          {step === 2 && (
            <section className="cmf-section">
              <div className="cmf-section-header">
                <h2>Action Items</h2>
                <p>Add owners one by one with deadlines and priorities before you close the meeting record.</p>
              </div>

              <div className="cmf-action-list">
                {actionItems.map((item, index) => (
                  <article key={item.id} className="cmf-action-card">
                    <div className="cmf-action-card-head">
                      <div>
                        <p className="cmf-action-index">Action Item #{index + 1}</p>
                        <p className="cmf-action-hint">Owner, due date, and priority are required.</p>
                      </div>
                      {actionItems.length > 1 && (
                        <button
                          type="button"
                          className="cmf-remove-btn"
                          onClick={() => removeActionItem(item.id)}
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="cmf-field">
                      <label htmlFor={`action-title-${item.id}`}>Action Title</label>
                      <input
                        id={`action-title-${item.id}`}
                        className="cmf-input"
                        type="text"
                        value={item.title}
                        onChange={(event) => updateActionItem(item.id, 'title', event.target.value)}
                        placeholder="Prepare April capex variance note for CEO office"
                      />
                    </div>

                    <div className="cmf-grid cmf-grid-three">
                      <div className="cmf-field">
                        <label htmlFor={`action-owner-${item.id}`}>Owner</label>
                        <select
                          id={`action-owner-${item.id}`}
                          className="cmf-input"
                          value={item.assignedTo}
                          onChange={(event) => updateActionItem(item.id, 'assignedTo', event.target.value)}
                        >
                          <option value="">Select owner</option>
                          {ALL_USERS.map((user) => (
                            <option key={user.id} value={user.name}>
                              {user.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="cmf-field">
                        <label htmlFor={`action-date-${item.id}`}>Deadline</label>
                        <input
                          id={`action-date-${item.id}`}
                          className="cmf-input"
                          type="date"
                          value={item.dueDate}
                          onChange={(event) => updateActionItem(item.id, 'dueDate', event.target.value)}
                        />
                      </div>
                      <div className="cmf-field">
                        <label htmlFor={`action-priority-${item.id}`}>Priority</label>
                        <select
                          id={`action-priority-${item.id}`}
                          className="cmf-input"
                          value={item.priority}
                          onChange={(event) =>
                            updateActionItem(item.id, 'priority', event.target.value as Priority)
                          }
                        >
                          <option value="high">High</option>
                          <option value="medium">Medium</option>
                          <option value="low">Low</option>
                        </select>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <button type="button" className="cmf-add-btn" onClick={addActionItem}>
                + Add Action Item
              </button>
            </section>
          )}

          {validationMessage && <p className="cmf-validation">{validationMessage}</p>}

          <div className="cmf-actions">
            <button
              type="button"
              className="cmf-btn cmf-btn-secondary"
              onClick={step === 0 ? () => navigate('/admin-dashboard') : handleBack}
            >
              {step === 0 ? 'Cancel' : 'Back'}
            </button>

            {step < STEP_TITLES.length - 1 ? (
              <button type="button" className="cmf-btn cmf-btn-primary" onClick={handleNext}>
                Continue
              </button>
            ) : (
              <button type="button" className="cmf-btn cmf-btn-primary" onClick={handleSubmit}>
                Submit Meeting
              </button>
            )}
          </div>
        </div>
      </div>

      <aside className="cmf-sidebar">
        <div className="cmf-sidebar-card primary">
          <p className="cmf-sidebar-label">Daily Use</p>
          <h3>CEO Office admin workflow</h3>
          <p>
            Create the meeting, capture the MOM while the discussion is fresh, and assign owners
            before actions fall through the cracks.
          </p>
        </div>

        <div className="cmf-sidebar-card">
          <p className="cmf-sidebar-label">Live Summary</p>
          <div className="cmf-summary-list">
            <div>
              <span>Meeting</span>
              <strong>{meetingForm.title || 'Untitled meeting'}</strong>
            </div>
            <div>
              <span>Date</span>
              <strong>{formatPreviewDate(meetingForm.date)}</strong>
            </div>
            <div>
              <span>Participants</span>
              <strong>{meetingForm.participants.length}</strong>
            </div>
            <div>
              <span>MOM words</span>
              <strong>{wordCount}</strong>
            </div>
            <div>
              <span>Action items ready</span>
              <strong>{completedActions}/{actionItems.length}</strong>
            </div>
          </div>
        </div>

        <div className="cmf-sidebar-card">
          <p className="cmf-sidebar-label">Submission Preview</p>
          <pre className="cmf-preview">{JSON.stringify(payloadPreview, null, 2)}</pre>
        </div>
      </aside>
    </div>
  );
}
