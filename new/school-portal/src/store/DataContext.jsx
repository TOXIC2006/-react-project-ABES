import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import studentsSeed from '../data/students.json'
import attendanceSeed from '../data/attendance.json'
import assignmentsSeed from '../data/assignments.json'
import usersSeed from '../data/users.json'

const DATA_KEY = 'school-portal-data-v4'
const SESSION_KEY = 'school-portal-session-v4'

const ADMINS = usersSeed.admins

function loadData() {
  try {
    const raw = localStorage.getItem(DATA_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed && Array.isArray(parsed.students)) return parsed
    }
  } catch {
    /* corrupted storage -> reseed */
  }
  return {
    students: studentsSeed,
    attendance: attendanceSeed,
    assignments: assignmentsSeed,
  }
}

function loadSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY)) || null
  } catch {
    return null
  }
}

const DataContext = createContext(null)

export function DataProvider({ children }) {
  const [db, setDb] = useState(loadData)
  const [session, setSession] = useState(loadSession)

  useEffect(() => {
    try {
      localStorage.setItem(DATA_KEY, JSON.stringify(db))
    } catch {
      /* storage full/unavailable — app still works in memory */
    }
  }, [db])

  useEffect(() => {
    try {
      if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session))
      else localStorage.removeItem(SESSION_KEY)
    } catch {
      /* ignore */
    }
  }, [session])

  const login = useCallback(
    (username, password) => {
      const admin = ADMINS.find(
        (a) => a.username === username.trim() && a.password === password,
      )
      if (admin) {
        const s = { role: 'admin', name: admin.name, username: admin.username }
        setSession(s)
        return { ok: true, session: s }
      }
      const student = db.students.find(
        (st) => st.rollNumber === username.trim() && st.password === password,
      )
      if (student) {
        const s = {
          role: 'student',
          name: student.name,
          rollNumber: student.rollNumber,
          section: student.section,
          branch: student.branch,
        }
        setSession(s)
        return { ok: true, session: s }
      }
      return { ok: false, error: 'Invalid username or password. Please try again.' }
    },
    [db.students],
  )

  const logout = useCallback(() => setSession(null), [])

  const addStudent = useCallback((fields) => {
    const rollNumber = fields.rollNumber.trim()
    if (!rollNumber) return { ok: false, error: 'Roll number is required.' }
    let dup = false
    setDb((prev) => {
      if (prev.students.some((s) => s.rollNumber === rollNumber)) {
        dup = true
        return prev
      }
      return {
        ...prev,
        students: [
          ...prev.students,
          {
            id: `st-${Date.now()}`,
            name: fields.name.trim(),
            section: fields.section,
            branch: fields.branch,
            rollNumber,
            batch: '26-27',
            password: 'student123',
            addedAt: new Date().toISOString().slice(0, 10),
          },
        ],
      }
    })
    return dup
      ? { ok: false, error: 'A student with this roll number already exists.' }
      : { ok: true }
  }, [])

  const deleteStudent = useCallback((rollNumber) => {
    setDb((prev) => ({
      students: prev.students.filter((s) => s.rollNumber !== rollNumber),
      attendance: prev.attendance.filter((a) => a.rollNumber !== rollNumber),
      assignments: prev.assignments.map((as) => ({
        ...as,
        submissions: as.submissions.filter((sub) => sub.studentRoll !== rollNumber),
      })),
    }))
  }, [])

  const markAttendance = useCallback((date, branch, section, subject, rollNumber, status) => {
    setDb((prev) => {
      const idx = prev.attendance.findIndex(
        (a) =>
          a.date === date &&
          a.branch === branch &&
          a.section === section &&
          a.subject === subject &&
          a.rollNumber === rollNumber,
      )
      const attendance = [...prev.attendance]
      if (idx >= 0) attendance[idx] = { ...attendance[idx], status }
      else attendance.push({ date, branch, section, subject, rollNumber, status })
      return { ...prev, attendance }
    })
  }, [])

  const addAssignment = useCallback((fields) => {
    setDb((prev) => ({
      ...prev,
      assignments: [
        {
          id: `as-${Date.now()}`,
          title: fields.title.trim(),
          subject: fields.subject,
          branch: fields.branch,
          section: fields.section,
          description: fields.description.trim(),
          fileName: fields.fileName,
          dueDate: fields.dueDate,
          uploadedAt: new Date().toISOString().slice(0, 10),
          uploadedBy: 'Admin',
          submissions: [],
        },
        ...prev.assignments,
      ],
    }))
  }, [])

  const submitAssignment = useCallback((assignmentId, studentRoll, fileName) => {
    setDb((prev) => ({
      ...prev,
      assignments: prev.assignments.map((as) => {
        if (as.id !== assignmentId) return as
        const others = as.submissions.filter((s) => s.studentRoll !== studentRoll)
        return {
          ...as,
          submissions: [
            ...others,
            {
              studentRoll,
              fileName,
              submittedAt: new Date().toISOString().slice(0, 10),
            },
          ],
        }
      }),
    }))
  }, [])

  const resetDemoData = useCallback(() => {
    setDb({ students: studentsSeed, attendance: attendanceSeed, assignments: assignmentsSeed })
  }, [])

  const value = {
    db,
    session,
    login,
    logout,
    addStudent,
    deleteStudent,
    markAttendance,
    addAssignment,
    submitAssignment,
    resetDemoData,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used inside DataProvider')
  return ctx
}
