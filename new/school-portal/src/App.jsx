import { Navigate, Route, Routes } from 'react-router-dom'
import { DataProvider, useData } from './store/DataContext'
import { ToastProvider } from './components/Toast'
import Login from './pages/Login'
import AdminDashboard from './pages/admin/AdminDashboard'
import StudentDashboard from './pages/student/StudentDashboard'

function Guard({ role, children }) {
  const { session } = useData()
  if (!session) return <Navigate to="/" replace />
  if (session.role !== role) {
    return <Navigate to={session.role === 'admin' ? '/admin' : '/student'} replace />
  }
  return children
}

export default function App() {
  return (
    <DataProvider>
      <ToastProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/admin"
            element={
              <Guard role="admin">
                <AdminDashboard />
              </Guard>
            }
          />
          <Route
            path="/student"
            element={
              <Guard role="student">
                <StudentDashboard />
              </Guard>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ToastProvider>
    </DataProvider>
  )
}
