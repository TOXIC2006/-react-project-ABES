import { useMemo, useRef, useState } from 'react'
import {
  CalendarDays,
  CheckCircle2,
  Eye,
  FileText,
  Send,
  UploadCloud,
  BookOpen,
  X,
} from 'lucide-react'
import Modal from '../../components/Modal'
import { useData } from '../../store/DataContext'
import { useToast } from '../../components/Toast'
import { openPdf } from '../../lib/pdf'

export default function StudentAssignments() {
  const { db, session, submitAssignment } = useData()
  const toast = useToast()
  const [viewing, setViewing] = useState(null)
  const [submitting, setSubmitting] = useState(null)
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')
  const fileInput = useRef(null)

  const mine = useMemo(
    () =>
      db.assignments
        .filter(
          (a) =>
            a.branch === session.branch &&
            (a.section === 'All' || a.section === session.section),
        )
        .sort((a, b) => a.uploadedAt.localeCompare(b.uploadedAt))
        .reverse(),
    [db.assignments, session.branch, session.section],
  )

  const submissionFor = (a) =>
    a.submissions.find((s) => s.studentRoll === session.rollNumber)

  const openSubmit = (a) => {
    setSubmitting(a)
    setFile(null)
    setError('')
  }

  const closeSubmit = () => {
    setSubmitting(null)
    setFile(null)
    setError('')
  }

  const handleFile = (f) => {
    if (!f) return
    if (f.type !== 'application/pdf' && !f.name.toLowerCase().endsWith('.pdf')) {
      setError('Only PDF files are allowed.')
      return
    }
    setFile(f)
    setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!file) {
      setError('Please choose a PDF file to submit.')
      return
    }
    submitAssignment(submitting.id, session.rollNumber, file.name)
    toast(`Assignment "${submitting.title}" submitted successfully.`)
    closeSubmit()
  }

  return (
    <div className="page-grid">
      <div className="stat-row">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--accent-soft)', color: '#4ade80' }}>
            <BookOpen size={22} />
          </div>
          <div>
            <div className="stat-value">{mine.length}</div>
            <div className="stat-label">
              Assignments for {session.branch} · Section {session.section}
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(59,130,246,0.12)', color: '#93c5fd' }}>
            <Send size={22} />
          </div>
          <div>
            <div className="stat-value">
              {mine.filter((a) => submissionFor(a)).length}
            </div>
            <div className="stat-label">Submitted by you</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--surface-2)', color: 'var(--muted)' }}>
            <CalendarDays size={22} />
          </div>
          <div>
            <div className="stat-value">
              {mine.filter((a) => !submissionFor(a) && a.dueDate >= new Date().toISOString().slice(0, 10)).length}
            </div>
            <div className="stat-label">Pending submissions</div>
          </div>
        </div>
      </div>

      {mine.length === 0 ? (
        <div className="empty-state card">
          <FileText size={40} />
          <h3>No assignments yet</h3>
          <p>The admin has not uploaded any assignment for your branch and section.</p>
        </div>
      ) : (
        <div className="assignment-grid">
          {mine.map((a) => {
            const sub = submissionFor(a)
            const overdue = !sub && a.dueDate < new Date().toISOString().slice(0, 10)
            return (
              <div key={a.id} className="assignment-card">
                <div className="assignment-meta">
                  <span className="badge badge-info">{a.branch}</span>
                  <span className="badge badge-info">{a.subject}</span>
                  <span className={`badge ${sub ? 'badge-present' : overdue ? 'badge-warn' : 'badge-pending'}`}>
                    {sub ? 'Submitted' : overdue ? 'Overdue' : 'Pending'}
                  </span>
                </div>
                <div className="assignment-title">{a.title}</div>
                <p className="assignment-desc">{a.description || 'No description provided.'}</p>
                <div className="assignment-meta" style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <CalendarDays size={14} /> Due {a.dueDate}
                  </span>
                  {sub && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#4ade80' }}>
                      <CheckCircle2 size={14} /> {sub.fileName}
                    </span>
                  )}
                </div>
                <div className="assignment-actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ flex: 1 }}
                    onClick={() => setViewing(a)}
                  >
                    <Eye size={17} />
                    Show Assignment
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                    onClick={() => openSubmit(a)}
                  >
                    <Send size={17} />
                    {sub ? 'Re-submit' : 'Submit'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Modal
        open={Boolean(viewing)}
        onClose={() => setViewing(null)}
        title="Assignment Details"
        wide
        footer={
          <>
            <button type="button" className="btn btn-ghost" onClick={() => setViewing(null)}>
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => openPdf(viewing?.title, `${viewing?.branch} · Section ${viewing?.section} · ${viewing?.subject}`)}
            >
              <FileText size={17} />
              View PDF
            </button>
          </>
        }
      >
        {viewing && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="assignment-meta">
              <span className="badge badge-info">{viewing.branch}</span>
              <span className="badge badge-info">{viewing.subject}</span>
              <span className="badge badge-pending">Section {viewing.section}</span>
              <span className="badge badge-warn">Due {viewing.dueDate}</span>
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: 6 }}>{viewing.title}</h3>
              <p className="muted" style={{ fontSize: '0.9rem' }}>
                {viewing.description || 'No description provided.'}
              </p>
            </div>
            <div className="file-chip">
              <FileText size={18} />
              <span>{viewing.fileName}</span>
            </div>
            <p className="hint">
              Uploaded by {viewing.uploadedBy} on {viewing.uploadedAt}. Press “View PDF” to open the
              assignment document.
            </p>
          </div>
        )}
      </Modal>

      <Modal
        open={Boolean(submitting)}
        onClose={closeSubmit}
        title="Submit Assignment"
        footer={
          <>
            <button type="button" className="btn btn-ghost" onClick={closeSubmit}>
              Cancel
            </button>
            <button type="submit" form="submit-form" className="btn btn-primary">
              <Send size={16} />
              Submit Assignment
            </button>
          </>
        }
      >
        {submitting && (
          <form id="submit-form" onSubmit={handleSubmit} noValidate>
            <p style={{ marginBottom: 14 }}>
              Submitting for <strong>{submitting.title}</strong>
            </p>
            <div className={`field${error ? ' field-error' : ''}`}>
              <label className="label">
                Your Submission (PDF) <span className="required">*</span>
              </label>
              <input
                ref={fileInput}
                type="file"
                accept="application/pdf,.pdf"
                hidden
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
              {file ? (
                <div className="file-chip">
                  <FileText size={18} />
                  <span>{file.name}</span>
                  <button
                    type="button"
                    className="icon-btn"
                    style={{ width: 28, height: 28, minHeight: 28, marginLeft: 'auto' }}
                    onClick={() => {
                      setFile(null)
                      if (fileInput.current) fileInput.current.value = ''
                    }}
                    aria-label="Remove file"
                  >
                    <X size={15} />
                  </button>
                </div>
              ) : (
                <div
                  className="dropzone"
                  role="button"
                  tabIndex={0}
                  aria-label="Choose submission PDF"
                  onClick={() => fileInput.current?.click()}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') fileInput.current?.click()
                  }}
                >
                  <UploadCloud size={28} />
                  <strong>Click to choose your PDF</strong>
                  <span>or drag &amp; drop it here</span>
                </div>
              )}
              {error && (
                <span className="error-text" role="alert">
                  {error}
                </span>
              )}
            </div>
          </form>
        )}
      </Modal>
    </div>
  )
}
