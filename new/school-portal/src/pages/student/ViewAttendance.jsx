import { useMemo, useState } from 'react'
import { CalendarCheck2, CalendarX2, CheckCircle2, XCircle, Percent } from 'lucide-react'
import { useData } from '../../store/DataContext'
import { SECTIONS } from '../../lib/constants'

export default function ViewAttendance() {
  const { db, session } = useData()

  const availableDates = useMemo(() => {
    const set = new Set(
      db.attendance
        .filter(
          (a) => a.section === session.section && a.branch === session.branch,
        )
        .map((a) => a.date),
    )
    return [...set].sort().reverse()
  }, [db.attendance, session.section, session.branch])

  const [date, setDate] = useState(availableDates[0] ?? '')
  const [section, setSection] = useState(session.section)

  const rows = useMemo(() => {
    const subjects = new Set()
    for (const a of db.attendance) {
      if (a.date === date && a.section === section && a.branch === session.branch)
        subjects.add(a.subject)
    }
    return [...subjects].sort().map((subject) => {
      const rec = db.attendance.find(
        (a) =>
          a.date === date &&
          a.section === section &&
          a.subject === subject &&
          a.branch === session.branch &&
          a.rollNumber === session.rollNumber,
      )
      return { subject, status: rec?.status ?? null }
    })
  }, [db.attendance, date, section, session.branch, session.rollNumber])

  const stats = useMemo(() => {
    const present = rows.filter((r) => r.status === 'present').length
    const absent = rows.filter((r) => r.status === 'absent').length
    const total = present + absent
    return { present, absent, total, pct: total ? Math.round((present / total) * 100) : 0 }
  }, [rows])

  return (
    <div className="page-grid">
      <div className="card">
        <div className="card-head">
          <h3 className="section-title">Attendance Filters</h3>
        </div>
        <div className="card-body">
          <div className="filters">
            <div className="field" style={{ marginBottom: 0 }}>
              <label className="label" htmlFor="sv-date">
                Date
              </label>
              <select id="sv-date" className="select" value={date} onChange={(e) => setDate(e.target.value)}>
                {availableDates.length === 0 && <option value="">No dates available</option>}
                {availableDates.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label className="label" htmlFor="sv-section">
                Section
              </label>
              <select
                id="sv-section"
                className="select"
                value={section}
                onChange={(e) => setSection(e.target.value)}
              >
                {SECTIONS.map((s) => (
                  <option key={s} value={s}>
                    Section {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="stat-row">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--accent-soft)', color: '#4ade80' }}>
            <CheckCircle2 size={22} />
          </div>
          <div>
            <div className="stat-value">{stats.present}</div>
            <div className="stat-label">Present</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--destructive-soft)', color: '#fca5a5' }}>
            <XCircle size={22} />
          </div>
          <div>
            <div className="stat-value">{stats.absent}</div>
            <div className="stat-label">Absent</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(59,130,246,0.12)', color: '#93c5fd' }}>
            <Percent size={22} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="stat-value">{stats.pct}%</div>
            <div className="stat-label">Attendance rate</div>
            <div className="progress-track" style={{ marginTop: 8 }}>
              <div className="progress-fill" style={{ width: `${stats.pct}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <h3 className="section-title">
            Attendance for {date || '—'} · {session.branch} · Section {section}
          </h3>
        </div>
        {rows.length === 0 ? (
          <div className="empty-state">
            {date ? <CalendarX2 size={40} /> : <CalendarCheck2 size={40} />}
            <h3>No attendance records</h3>
            <p>There are no attendance records for this date and section.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.subject}>
                    <td>{r.subject}</td>
                    <td>
                      {r.status === 'present' && (
                        <span className="badge badge-present">
                          <span className="badge-dot" />
                          Present
                        </span>
                      )}
                      {r.status === 'absent' && (
                        <span className="badge badge-absent">
                          <span className="badge-dot" />
                          Absent
                        </span>
                      )}
                      {!r.status && <span className="badge badge-pending">Not marked</span>}
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
