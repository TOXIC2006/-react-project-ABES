import { useMemo, useState } from 'react'
import { CheckCircle2, Search, UsersRound, XCircle } from 'lucide-react'
import { useData } from '../../store/DataContext'
import { useToast } from '../../components/Toast'
import { ATTENDANCE_SUBJECTS, BATCHES, SECTIONS, BRANCHES } from '../../lib/constants'

const STATUS_BADGE = {
  present: { label: 'Present', cls: 'badge-present' },
  absent: { label: 'Absent', cls: 'badge-absent' },
}

export default function Attendance() {
  const { db, markAttendance } = useData()
  const toast = useToast()

  const today = new Date().toISOString().slice(0, 10)
  const [date, setDate] = useState(today)
  const [section, setSection] = useState('A')
  const [branch, setBranch] = useState('CSE')
  const [batch, setBatch] = useState('26-27')
  const [subject, setSubject] = useState(ATTENDANCE_SUBJECTS[0])
  const [viewing, setViewing] = useState(false)

  const students = useMemo(
    () =>
      db.students
        .filter(
          (s) =>
            s.section === section &&
            s.branch === branch &&
            (batch === 'All' || s.batch === batch),
        )
        .sort((a, b) => Number(a.rollNumber) - Number(b.rollNumber)),
    [db.students, section, branch, batch],
  )

  const records = useMemo(() => {
    const map = new Map()
    for (const a of db.attendance) {
      if (a.date === date && a.branch === branch && a.section === section && a.subject === subject) {
        map.set(a.rollNumber, a.status)
      }
    }
    return map
  }, [db.attendance, date, branch, section, subject])

  const counts = useMemo(() => {
    let present = 0
    let absent = 0
    let unmarked = 0
    for (const s of students) {
      const status = records.get(s.rollNumber)
      if (status === 'present') present++
      else if (status === 'absent') absent++
      else unmarked++
    }
    return { present, absent, unmarked }
  }, [students, records])

  const handleView = () => setViewing(true)

  const handleMark = (rollNumber, status) => {
    markAttendance(date, branch, section, subject, rollNumber, status)
    toast(`Marked ${rollNumber} as ${status} — ${subject}, ${date}.`)
  }

  const batchOptions = ['All', ...BATCHES]

  return (
    <div className="page-grid">
      <div className="card">
        <div className="card-head">
          <div>
            <h3 className="section-title">Attendance Filters</h3>
            <p className="section-sub" style={{ marginBottom: 0 }}>
              Select Branch, Section, Batch and Subject, then view all students.
            </p>
          </div>
        </div>
        <div className="card-body">
          <div className="filters">
            <div className="field" style={{ marginBottom: 0 }}>
              <label className="label" htmlFor="att-date">
                Date
              </label>
              <input
                id="att-date"
                className="input"
                type="date"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value)
                  setViewing(false)
                }}
              />
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label className="label" htmlFor="att-branch">
                Branch
              </label>
              <select
                id="att-branch"
                className="select"
                value={branch}
                onChange={(e) => {
                  setBranch(e.target.value)
                  setViewing(false)
                }}
              >
                {BRANCHES.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label className="label" htmlFor="att-section">
                Section
              </label>
              <select
                id="att-section"
                className="select"
                value={section}
                onChange={(e) => {
                  setSection(e.target.value)
                  setViewing(false)
                }}
              >
                {SECTIONS.map((s) => (
                  <option key={s} value={s}>
                    Section {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label className="label" htmlFor="att-batch">
                Badge / Batch
              </label>
              <select
                id="att-batch"
                className="select"
                value={batch}
                onChange={(e) => {
                  setBatch(e.target.value)
                  setViewing(false)
                }}
              >
                {batchOptions.map((b) => (
                  <option key={b} value={b}>
                    {b === 'All' ? 'All batches' : b}
                  </option>
                ))}
              </select>
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label className="label" htmlFor="att-subject">
                Subject
              </label>
              <select
                id="att-subject"
                className="select"
                value={subject}
                onChange={(e) => {
                  setSubject(e.target.value)
                  setViewing(false)
                }}
              >
                {ATTENDANCE_SUBJECTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <button type="button" className="btn btn-primary" onClick={handleView}>
              <Search size={18} />
              View all Student Present/Absent
            </button>
          </div>
        </div>
      </div>

      {viewing && (
        <>
          <div className="stat-row">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'var(--accent-soft)', color: '#4ade80' }}>
                <CheckCircle2 size={22} />
              </div>
              <div>
                <div className="stat-value">{counts.present}</div>
                <div className="stat-label">Present</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'var(--destructive-soft)', color: '#fca5a5' }}>
                <XCircle size={22} />
              </div>
              <div>
                <div className="stat-value">{counts.absent}</div>
                <div className="stat-label">Absent</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'var(--surface-2)', color: 'var(--muted)' }}>
                <UsersRound size={22} />
              </div>
              <div>
                <div className="stat-value">{students.length}</div>
                <div className="stat-label">
                  Total students ({branch}, Section {section}, batch {batch === 'All' ? 'all' : batch})
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-head">
              <h3 className="section-title">
                {subject} — {date}
              </h3>
              <span className="badge badge-info">
                {counts.unmarked} not marked
              </span>
            </div>
            {students.length === 0 ? (
              <div className="empty-state">
                <UsersRound size={40} />
                <h3>No students found</h3>
                <p>
                  No students match branch {branch}, Section {section} and batch {batch}.
                </p>
              </div>
            ) : (
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Roll No</th>
                      <th>Student Name</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Mark Attendance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s) => {
                      const status = records.get(s.rollNumber)
                      const badge = STATUS_BADGE[status]
                      return (
                        <tr key={s.rollNumber}>
                          <td style={{ fontVariantNumeric: 'tabular-nums' }}>{s.rollNumber}</td>
                          <td>{s.name}</td>
                          <td>
                            {badge ? (
                              <span className={`badge ${badge.cls}`}>
                                <span className="badge-dot" />
                                {badge.label}
                              </span>
                            ) : (
                              <span className="badge badge-pending">Not marked</span>
                            )}
                          </td>
                          <td>
                            <div className="td-actions">
                              <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                onClick={() => handleMark(s.rollNumber, 'present')}
                              >
                                Present
                              </button>
                              <button
                                type="button"
                                className="btn btn-danger btn-sm"
                                onClick={() => handleMark(s.rollNumber, 'absent')}
                              >
                                Absent
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {!viewing && (
        <div className="empty-state card">
          <ClipboardIcon />
          <h3>Attendance overview</h3>
          <p>
            Choose Date, Branch, Section, Batch and Subject, then press
            “View all Student Present/Absent” to see and mark attendance.
          </p>
        </div>
      )}
    </div>
  )
}

function ClipboardIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="8" y="2" width="8" height="4" rx="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="M9 12h6M9 16h4" />
    </svg>
  )
}
