import { useMemo, useRef, useState } from 'react'
import { FileText, FileUp, UploadCloud, X } from 'lucide-react'
import { useData } from '../../store/DataContext'
import { useToast } from '../../components/Toast'
import { ASSIGNMENT_SUBJECTS, BRANCHES, SECTIONS } from '../../lib/constants'

const EMPTY = {
  title: '',
  section: 'All',
  branch: 'CSE',
  subject: ASSIGNMENT_SUBJECTS[0],
  dueDate: '',
  description: '',
}

export default function Assignments() {
  const { db, addAssignment } = useData()
  const toast = useToast()
  const fileInput = useRef(null)
  const [form, setForm] = useState(EMPTY)
  const [file, setFile] = useState(null)
  const [errors, setErrors] = useState({})
  const [dragging, setDragging] = useState(false)

  const saved = useMemo(
    () => [...db.assignments].sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt)),
    [db.assignments],
  )

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleFile = (f) => {
    if (!f) return
    if (f.type !== 'application/pdf' && !f.name.toLowerCase().endsWith('.pdf')) {
      toast('Only PDF files are allowed.', 'error')
      return
    }
    setFile(f)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files?.[0])
  }

  const handleSave = (e) => {
    e.preventDefault()
    const errs = {}
    if (!form.title.trim()) errs.title = 'Assignment title is required.'
    if (!form.dueDate) errs.dueDate = 'Due date is required.'
    if (!file) errs.file = 'Please upload a PDF file.'
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    addAssignment({ ...form, fileName: file.name })
    toast(`Assignment "${form.title}" saved.`)
    setForm(EMPTY)
    setFile(null)
    if (fileInput.current) fileInput.current.value = ''
  }

  return (
    <div className="page-grid">
      <div className="card">
        <div className="card-head">
          <div>
            <h3 className="section-title">Upload Assignment</h3>
            <p className="section-sub" style={{ marginBottom: 0 }}>
              Upload a PDF and save the record for students to view and submit.
            </p>
          </div>
        </div>
        <div className="card-body">
          <form onSubmit={handleSave} noValidate>
            <div className={`field${errors.title ? ' field-error' : ''}`}>
              <label className="label" htmlFor="aw-title">
                Assignment Title <span className="required">*</span>
              </label>
              <input
                id="aw-title"
                className="input"
                type="text"
                placeholder="e.g. Algebra Worksheet — Chapter 4"
                value={form.title}
                onChange={set('title')}
              />
              {errors.title && (
                <span className="error-text" role="alert">
                  {errors.title}
                </span>
              )}
            </div>

            <div className="form-grid">
              <div className="field">
                <label className="label" htmlFor="aw-branch">
                  Branch <span className="required">*</span>
                </label>
                <select
                  id="aw-branch"
                  className="select"
                  value={form.branch}
                  onChange={set('branch')}
                >
                  {BRANCHES.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label className="label" htmlFor="aw-section">
                  Section
                </label>
                <select
                  id="aw-section"
                  className="select"
                  value={form.section}
                  onChange={set('section')}
                >
                  <option value="All">All Sections</option>
                  {SECTIONS.map((s) => (
                    <option key={s} value={s}>
                      Section {s}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label className="label" htmlFor="aw-subject">
                  Subject
                </label>
                <select
                  id="aw-subject"
                  className="select"
                  value={form.subject}
                  onChange={set('subject')}
                >
                  {ASSIGNMENT_SUBJECTS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div className={`field${errors.dueDate ? ' field-error' : ''}`}>
                <label className="label" htmlFor="aw-due">
                  Due Date <span className="required">*</span>
                </label>
                <input
                  id="aw-due"
                  className="input"
                  type="date"
                  value={form.dueDate}
                  onChange={set('dueDate')}
                />
                {errors.dueDate && (
                  <span className="error-text" role="alert">
                    {errors.dueDate}
                  </span>
                )}
              </div>
            </div>

            <div className="field">
              <label className="label" htmlFor="aw-desc">
                Description
              </label>
              <textarea
                id="aw-desc"
                className="textarea"
                placeholder="Instructions for the students…"
                value={form.description}
                onChange={set('description')}
              />
            </div>

            <div className={`field${errors.file ? ' field-error' : ''}`}>
              <label className="label">
                Assignment PDF <span className="required">*</span>
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
                  className={`dropzone${dragging ? ' dragging' : ''}`}
                  role="button"
                  tabIndex={0}
                  aria-label="Upload PDF file"
                  onClick={() => fileInput.current?.click()}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') fileInput.current?.click()
                  }}
                  onDragOver={(e) => {
                    e.preventDefault()
                    setDragging(true)
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                >
                  <UploadCloud size={28} />
                  <strong>Click to choose a PDF</strong>
                  <span>or drag &amp; drop it here</span>
                </div>
              )}
              {errors.file && (
                <span className="error-text" role="alert">
                  {errors.file}
                </span>
              )}
            </div>

            <button type="submit" className="btn btn-primary">
              <FileUp size={18} />
              Save Record
            </button>
          </form>
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <h3 className="section-title">Saved Assignment Records</h3>
          <span className="badge badge-info">{saved.length} saved</span>
        </div>
        {saved.length === 0 ? (
          <div className="empty-state">
            <FileText size={40} />
            <h3>No assignments yet</h3>
            <p>Uploaded assignments will appear here.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Branch</th>
                  <th>Section</th>
                  <th>Subject</th>
                  <th>PDF</th>
                  <th>Due Date</th>
                  <th>Uploaded</th>
                  <th>Submissions</th>
                </tr>
              </thead>
              <tbody>
                {saved.map((a) => (
                  <tr key={a.id}>
                    <td>{a.title}</td>
                    <td>
                      <span className="badge badge-info">{a.branch}</span>
                    </td>
                    <td>{a.section}</td>
                    <td>{a.subject}</td>
                    <td>
                      <span className="file-chip" style={{ padding: '4px 10px' }}>
                        <FileText size={15} />
                        <span style={{ maxWidth: 150 }}>{a.fileName}</span>
                      </span>
                    </td>
                    <td>{a.dueDate}</td>
                    <td>{a.uploadedAt}</td>
                    <td>
                      <span
                        className={`badge ${
                          a.submissions.length > 0 ? 'badge-present' : 'badge-pending'
                        }`}
                      >
                        {a.submissions.length}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
