import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  GraduationCap,
  ClipboardCheck,
  Users,
  FileText,
  Eye,
  EyeOff,
  ShieldCheck,
  BookOpen,
  AlertCircle,
} from 'lucide-react'
import { useData } from '../store/DataContext'

const FEATURES = [
  { icon: <ClipboardCheck size={18} />, text: 'Mark & track daily attendance' },
  { icon: <Users size={18} />, text: 'Manage student records' },
  { icon: <FileText size={18} />, text: 'Assign & collect PDF assignments' },
]

export default function Login() {
  const { login } = useData()
  const navigate = useNavigate()
  const [role, setRole] = useState('admin')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    window.setTimeout(() => {
      const result = login(username, password)
      setSubmitting(false)
      if (result.ok) {
        navigate(result.session.role === 'admin' ? '/admin' : '/student', { replace: true })
      } else {
        setError(result.error)
      }
    }, 300)
  }

  const switchRole = (r) => {
    setRole(r)
    setError('')
    setPassword('')
    setUsername(r === 'admin' ? 'admin' : '')
  }

  return (
    <div className="login-page">
      <section className="login-hero">
        <div className="brand-logo">
          <GraduationCap size={30} />
        </div>
        <div>
          <h1>School Portal</h1>
          <p>
            One place for attendance, student records and assignments — for
            administrators and students.
          </p>
        </div>
        <div className="login-features">
          {FEATURES.map((f) => (
            <div key={f.text} className="login-feature">
              {f.icon}
              <span>{f.text}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="login-panel">
        <div className="login-card">
          <div className="role-tabs" role="tablist" aria-label="Login role">
            <button
              type="button"
              role="tab"
              aria-selected={role === 'admin'}
              className={`role-tab${role === 'admin' ? ' active' : ''}`}
              onClick={() => switchRole('admin')}
            >
              <ShieldCheck size={16} style={{ verticalAlign: '-3px', marginRight: 6 }} />
              Admin
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={role === 'student'}
              className={`role-tab${role === 'student' ? ' active' : ''}`}
              onClick={() => switchRole('student')}
            >
              <BookOpen size={16} style={{ verticalAlign: '-3px', marginRight: 6 }} />
              Student
            </button>
          </div>

          <h1 style={{ fontSize: '1.4rem', marginBottom: 4 }}>
            {role === 'admin' ? 'Admin Login' : 'Student Login'}
          </h1>
          <p className="muted" style={{ fontSize: '0.9rem', marginBottom: 20 }}>
            {role === 'admin'
              ? 'Sign in to manage the school portal.'
              : 'Sign in with your roll number to view your dashboard.'}
          </p>

          {error && (
            <div className="login-error" role="alert">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label className="label" htmlFor="login-username">
                {role === 'admin' ? 'Username' : 'Roll Number'}
              </label>
              <input
                id="login-username"
                className="input"
                type="text"
                autoComplete="username"
                placeholder={role === 'admin' ? 'Enter admin username' : 'Enter your roll number'}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label className="label" htmlFor="login-password">
                Password
              </label>
              <div className="pw-wrap">
                <input
                  id="login-password"
                  className="input"
                  type={showPw ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="icon-btn pw-toggle"
                  onClick={() => setShowPw((v) => !v)}
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%' }}
              disabled={submitting || !username || !password}
            >
              {submitting ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <div className="demo-creds">
            <strong>Demo credentials</strong>
            {role === 'admin' ? (
              <p>
                Username <code>admin</code> · Password <code>admin123</code>
              </p>
            ) : (
              <p>
                Roll no <code>2400321540187</code> · Password <code>student123</code>
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
