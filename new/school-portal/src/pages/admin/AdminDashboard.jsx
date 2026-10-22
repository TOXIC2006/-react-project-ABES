import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ClipboardCheck, FileText, ListOrdered, UserMinus, UserPlus } from 'lucide-react'
import Shell from '../../components/Shell'
import { useData } from '../../store/DataContext'
import AddStudentModal from './AddStudentModal'
import Attendance from './Attendance'
import Records from './Records'
import Assignments from './Assignments'
import ManageUsers from './ManageUsers'

const NAV = [
  { key: 'attendance', label: 'Attendance', icon: <ClipboardCheck size={18} /> },
  { key: 'records', label: 'Records', icon: <ListOrdered size={18} /> },
  { key: 'assignments', label: 'Assignments', icon: <FileText size={18} /> },
  { key: 'users', label: 'Manage Users', icon: <UserMinus size={18} /> },
]

const SUBTITLES = {
  attendance: 'Select filters and view or mark student presence',
  records: 'View all saved student records',
  assignments: 'Upload PDF assignments and view saved records',
  users: 'Delete students from the portal',
}

export default function AdminDashboard() {
  const { session, logout } = useData()
  const navigate = useNavigate()
  const [active, setActive] = useState('attendance')
  const [addOpen, setAddOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  return (
    <Shell
      navItems={NAV}
      active={active}
      onNavigate={setActive}
      title="Admin Panel"
      subtitle={SUBTITLES[active]}
      userName={session?.name ?? 'Admin'}
      roleLabel="Administrator"
      onLogout={handleLogout}
      actions={
        <button type="button" className="btn btn-primary" onClick={() => setAddOpen(true)}>
          <UserPlus size={18} />
          Add Student
        </button>
      }
    >
      {active === 'attendance' && <Attendance />}
      {active === 'records' && <Records onAddStudent={() => setAddOpen(true)} />}
      {active === 'assignments' && <Assignments />}
      {active === 'users' && <ManageUsers />}

      <AddStudentModal open={addOpen} onClose={() => setAddOpen(false)} />
    </Shell>
  )
}
