import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarCheck2, FileText } from 'lucide-react'
import Shell from '../../components/Shell'
import { useData } from '../../store/DataContext'
import ViewAttendance from './ViewAttendance'
import StudentAssignments from './StudentAssignments'

const NAV = [
  { key: 'attendance', label: 'View Attendance', icon: <CalendarCheck2 size={18} /> },
  { key: 'assignments', label: 'Assignments', icon: <FileText size={18} /> },
]

const SUBTITLES = {
  attendance: 'Check your Present/Absent status by date, class and section',
  assignments: 'View assignments given by the admin and submit your work',
}

export default function StudentDashboard() {
  const { session, logout } = useData()
  const navigate = useNavigate()
  const [active, setActive] = useState('attendance')

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  return (
    <Shell
      navItems={NAV}
      active={active}
      onNavigate={setActive}
      title="Student Dashboard"
      subtitle={SUBTITLES[active]}
      userName={session?.name ?? 'Student'}
      roleLabel={`${session?.branch ?? ''} · Section ${session?.section} · Roll ${session?.rollNumber}`}
      onLogout={handleLogout}
      actions={
        <span className="badge badge-info">
          {session?.branch} · Section {session?.section}
        </span>
      }
    >
      {active === 'attendance' && <ViewAttendance />}
      {active === 'assignments' && <StudentAssignments />}
    </Shell>
  )
}
