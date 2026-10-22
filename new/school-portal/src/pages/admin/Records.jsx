import { useMemo, useState } from 'react'
import { ListOrdered, Search, UserPlus, UsersRound } from 'lucide-react'
import { useData } from '../../store/DataContext'
import { BRANCHES } from '../../lib/constants'

export default function Records({ onAddStudent }) {
  const { db } = useData()
  const [query, setQuery] = useState('')
  const [branch, setBranch] = useState('All')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return db.students
      .filter(
        (s) =>
          (branch === 'All' || s.branch === branch) &&
          (!q ||
            s.name.toLowerCase().includes(q) ||
            s.rollNumber.toLowerCase().includes(q) ||
            s.section.toLowerCase().includes(q)),
      )
      .sort((a, b) => a.addedAt.localeCompare(b.addedAt))
      .reverse()
  }, [db.students, query, branch])

  return (
    <div className="page-grid">
      <div className="stat-row">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--accent-soft)', color: '#4ade80' }}>
            <UsersRound size={22} />
          </div>
          <div>
            <div className="stat-value">{db.students.length}</div>
            <div className="stat-label">Saved student records</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--surface-2)', color: 'var(--muted)' }}>
            <ListOrdered size={22} />
          </div>
          <div>
            <div className="stat-value">
              {new Set(db.students.map((s) => s.section)).size}
            </div>
            <div className="stat-label">Sections covered</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <h3 className="section-title">Saved Records</h3>
          <div className="flex-between" style={{ gap: 10 }}>
            <select
              className="select"
              style={{ width: 160, minHeight: 40 }}
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              aria-label="Filter by branch"
            >
              <option value="All">All branches</option>
              {BRANCHES.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
            <div className="search-box">
              <Search size={16} />
              <input
                className="input"
                type="search"
                placeholder="Search by name, roll no or section…"
                aria-label="Search student records"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <button type="button" className="btn btn-secondary btn-sm" onClick={onAddStudent}>
              <UserPlus size={16} />
              Add Student
            </button>
          </div>
        </div>
        {filtered.length === 0 ? (
          <div className="empty-state">
            <ListOrdered size={40} />
            <h3>No records found</h3>
            <p>{query ? 'No students match your search.' : 'No students have been saved yet.'}</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Roll No</th>
                  <th>Name</th>
                  <th>Branch</th>
                  <th>Section</th>
                  <th>Batch</th>
                  <th>Added On</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.rollNumber}>
                    <td style={{ fontVariantNumeric: 'tabular-nums' }}>{s.rollNumber}</td>
                    <td>{s.name}</td>
                    <td>
                      <span className="badge badge-info">{s.branch}</span>
                    </td>
                    <td>{s.section}</td>
                    <td>
                      <span className="badge badge-info">{s.batch}</span>
                    </td>
                    <td>{s.addedAt}</td>
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
