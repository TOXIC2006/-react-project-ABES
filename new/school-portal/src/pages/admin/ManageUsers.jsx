import { useMemo, useState } from 'react'
import { Search, Trash2, UserMinus, AlertTriangle } from 'lucide-react'
import Modal from '../../components/Modal'
import { useData } from '../../store/DataContext'
import { useToast } from '../../components/Toast'

export default function ManageUsers() {
  const { db, deleteStudent } = useData()
  const toast = useToast()
  const [query, setQuery] = useState('')
  const [target, setTarget] = useState(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return db.students
      .filter(
        (s) =>
          !q ||
          s.name.toLowerCase().includes(q) ||
          s.rollNumber.toLowerCase().includes(q) ||
          s.section.toLowerCase().includes(q) ||
          s.branch.toLowerCase().includes(q),
      )
      .sort(
        (a, b) =>
          a.branch.localeCompare(b.branch) || a.section.localeCompare(b.section),
      )
  }, [db.students, query])

  const confirmDelete = () => {
    if (!target) return
    deleteStudent(target.rollNumber)
    toast(`Student "${target.name}" (${target.rollNumber}) deleted.`)
    setTarget(null)
  }

  return (
    <div className="page-grid">
      <div className="card">
        <div className="card-head">
          <h3 className="section-title">Manage Users</h3>
          <div className="search-box">
            <Search size={16} />
            <input
              className="input"
              type="search"
              placeholder="Search students…"
              aria-label="Search students"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
        {filtered.length === 0 ? (
          <div className="empty-state">
            <UserMinus size={40} />
            <h3>No students found</h3>
            <p>{query ? 'No students match your search.' : 'There are no students to manage.'}</p>
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
                  <th style={{ textAlign: 'right' }}>Action</th>
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
                      <div className="td-actions">
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => setTarget(s)}
                        >
                          <Trash2 size={15} />
                          Delete Student
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        open={Boolean(target)}
        onClose={() => setTarget(null)}
        title="Delete Student"
        footer={
          <>
            <button type="button" className="btn btn-ghost" onClick={() => setTarget(null)}>
              Cancel
            </button>
            <button type="button" className="btn btn-danger" onClick={confirmDelete}>
              <Trash2 size={16} />
              Delete Student
            </button>
          </>
        }
      >
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          <div
            className="stat-icon"
            style={{ background: 'var(--destructive-soft)', color: '#fca5a5', flexShrink: 0 }}
          >
            <AlertTriangle size={20} />
          </div>
          <div>
            <p>
              Are you sure you want to delete{' '}
              <strong>
                {target?.name} ({target?.rollNumber})
              </strong>
              ?
            </p>
            <p className="muted" style={{ fontSize: '0.88rem', marginTop: 8 }}>
              This will permanently remove the student, their attendance records and assignment
              submissions. This action cannot be undone.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  )
}
