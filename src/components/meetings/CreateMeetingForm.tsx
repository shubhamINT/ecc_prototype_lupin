import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_USERS } from '../../types/auth';
import type { Priority } from '../../types/actions';
import './CreateMeetingForm.css';

const SAMPLE_TRANSCRIPT = `[00:02] Priya Sharma: Let's begin with the IT security audit. Rajesh, where are we on the MFA rollout?

[00:05] Rajesh Satope: We're at about 60% completion. Remaining plant systems need to be done by end of April. It's tight but feasible.

[00:08] Priya Sharma: Okay. That's a high priority — make it a formal action item. MFA rollout complete by April 28th. Rajesh, you own that.

[00:11] Priya Sharma: Moving on — Finance update. Neha, the Q1 capex variance?

[00:13] Neha Patel: We have three items flagged. I need to prepare a variance report for the CEO's review. I can have it ready by April 30th.

[00:15] Priya Sharma: Good. Action item two — Neha to prepare Q1 capex variance report by April 30th. High priority.

[00:18] Arjun Mehta: On vendor contracts — two of our SLA agreements expire in Q2. If we don't start renewal now we're looking at a breach risk. I can initiate the process and target May 10th.

[00:21] Priya Sharma: Please do that, Arjun. That's action item three — medium priority, May 10th deadline.

[00:24] Priya Sharma: Also flagging — the DR drill sign-off is 12 days overdue. Rajesh, that needs immediate escalation. No further delay acceptable.

[00:27] Rajesh Satope: Understood. I'll have sign-off by this Friday.

[00:29] Priya Sharma: Agreed. I'll log it as a separate high-priority item in ECC. Let's wrap — all action owners to update ECC within 24 hours.`;

const GENERATED_MOM_HTML = `<p><strong>Agenda:</strong> Q1 compliance review, IT infrastructure security audit, Finance capex variance analysis, and vendor contract renewals.</p>
<p><strong>Decisions Taken:</strong></p>
<ul>
<li>MFA rollout to be completed across all plant systems by 28 April 2026 — Rajesh Satope confirmed feasibility</li>
<li>Finance to prepare Q1 capex variance report for CEO review by 30 April — Neha Patel to lead</li>
<li>Vendor SLA contract renewal process to be initiated immediately — Arjun Mehta assigned, target 10 May</li>
<li>DR drill sign-off escalated to CEO Office — 12 days overdue, Friday deadline agreed</li>
</ul>
<p><strong>Key Discussion Points:</strong></p>
<ul>
<li>IT flagged SOX compliance module upgrade timeline risk — potential audit window miss if delayed further</li>
<li>Finance confirmed Q4 audit findings partially addressed; two items still open for resolution</li>
<li>Operations flagged SLA breach risk on two vendor contracts expiring Q2 — early renewal critical</li>
</ul>
<p><strong>Escalations &amp; Risks:</strong></p>
<ul>
<li>IT-DR (DR Drill sign-off) — escalated to CEO Office; 12 days overdue, no prior update from owner</li>
<li>FIN-AUDIT (Q4 audit findings) — Finance head to resolve before next review cycle</li>
</ul>
<p><strong>Next Steps:</strong> All action items logged in ECC Platform with owners, deadlines, and priority levels. Automated T-3 day reminders will trigger for each open item.</p>`;

const GENERATED_ACTIONS: Array<{ title: string; assignedTo: string; dueDate: string; priority: Priority }> = [
  { title: 'Complete MFA rollout across all plant systems', assignedTo: 'Rajesh Satope', dueDate: '2026-04-28', priority: 'high' },
  { title: 'Prepare Q1 capex variance report for CEO review', assignedTo: 'Neha Patel', dueDate: '2026-04-30', priority: 'high' },
  { title: 'Initiate vendor SLA contract renewal — Q2 expiry risk', assignedTo: 'Arjun Mehta', dueDate: '2026-05-10', priority: 'medium' },
];

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
  const [momInputMode, setMomInputMode] = useState<'write' | 'transcript'>('write');
  const [transcriptText, setTranscriptText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiGenerated, setAiGenerated] = useState(false);

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

  const handleGenerateMOM = () => {
    if (!transcriptText.trim()) return;
    setIsGenerating(true);
    window.setTimeout(() => {
      setMomHtml(GENERATED_MOM_HTML);
      if (editorRef.current) {
        editorRef.current.innerHTML = GENERATED_MOM_HTML;
      }
      setActionItems(
        GENERATED_ACTIONS.map((a, i) => ({
          ...createEmptyAction(`ai-action-${i + 1}`),
          ...a,
        }))
      );
      setIsGenerating(false);
      setAiGenerated(true);
      setMomInputMode('write');
    }, 2600);
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
                <p>Write MOM manually, or paste the meeting transcript and let ECC generate structured minutes automatically.</p>
              </div>

              <div className="cmf-tab-row">
                <button
                  type="button"
                  className={`cmf-tab-btn ${momInputMode === 'write' ? 'active' : ''}`}
                  onClick={() => setMomInputMode('write')}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 10.5V12h1.5l4.42-4.42-1.5-1.5L2 10.5zM11.71 3.29a1 1 0 000-1.42l-1.08-1.08a1 1 0 00-1.42 0L8.1 1.9l2.5 2.5 1.11-1.11z" fill="currentColor"/>
                  </svg>
                  Write MOM
                </button>
                <button
                  type="button"
                  className={`cmf-tab-btn ${momInputMode === 'transcript' ? 'active' : ''}`}
                  onClick={() => setMomInputMode('transcript')}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <rect x="1" y="1" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.3"/>
                    <path d="M4 5h6M4 7.5h6M4 10h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                  </svg>
                  Paste Transcript
                  <span className="cmf-tab-ai-chip">AI</span>
                </button>
                {aiGenerated && (
                  <span className="cmf-ai-generated-badge">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <circle cx="6" cy="6" r="5.5" fill="#7c3aed" fillOpacity="0.15" stroke="#7c3aed" strokeWidth="1"/>
                      <path d="M3.5 6l1.8 1.8 3.2-3.6" stroke="#7c3aed" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    MOM generated from transcript
                  </span>
                )}
              </div>

              {momInputMode === 'transcript' ? (
                <div className="cmf-transcript-panel">
                  <div className="cmf-transcript-header">
                    <div>
                      <p className="cmf-transcript-title">Paste your meeting transcript</p>
                      <p className="cmf-transcript-hint">ECC will extract decisions, escalations, and action items automatically.</p>
                    </div>
                    <button
                      type="button"
                      className="cmf-link-btn"
                      onClick={() => setTranscriptText(SAMPLE_TRANSCRIPT)}
                    >
                      Load sample
                    </button>
                  </div>
                  <textarea
                    className="cmf-transcript-area"
                    value={transcriptText}
                    onChange={(e) => setTranscriptText(e.target.value)}
                    placeholder="Paste the raw meeting transcript here. Include speaker names and timestamps if available — ECC uses these to identify owners and assign action items."
                    rows={12}
                  />
                  <div className="cmf-transcript-footer">
                    <span className="cmf-transcript-wordcount">
                      {transcriptText.trim() ? `${transcriptText.trim().split(/\s+/).length} words` : '0 words'}
                    </span>
                    {isGenerating ? (
                      <div className="cmf-generating">
                        <div className="cmf-spinner" />
                        <span>Analysing transcript and extracting action items…</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="cmf-generate-btn"
                        disabled={!transcriptText.trim()}
                        onClick={handleGenerateMOM}
                      >
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                          <path d="M7.5 1L9.18 5.31L14 5.93L10.55 9.19L11.56 14L7.5 11.77L3.44 14L4.45 9.19L1 5.93L5.82 5.31L7.5 1Z" fill="currentColor" fillOpacity="0.9"/>
                        </svg>
                        Generate MOM with AI
                      </button>
                    )}
                  </div>
                </div>
              ) : (
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
                        setAiGenerated(false);
                        if (editorRef.current) {
                          editorRef.current.innerHTML = MOM_TEMPLATE;
                        }
                      }}
                    >
                      Reset template
                    </button>
                  </div>
                </div>
              )}
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
