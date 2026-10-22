import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const outDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data')
mkdirSync(outDir, { recursive: true })

function mulberry32(seed) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const rand = mulberry32(20261020)

const BRANCHES = ['CSE', 'DS', 'IT', 'AIML']
// 4 sections, 50 students each
const SECTIONS = ['A', 'B', 'C', 'D']
const subjects = ['Data Structures', 'DBMS', 'Operating Systems']
const firstNames = [
  'Aarav', 'Priya', 'Rohan', 'Ananya', 'Kabir', 'Ishita', 'Arjun', 'Diya', 'Vivaan', 'Sneha',
  'Aditya', 'Meera', 'Rahul', 'Kavya', 'Nikhil', 'Tanvi', 'Dev', 'Sara', 'Yash', 'Nandini',
  'Ayaan', 'Riya', 'Om', 'Zara', 'Farhan', 'Pooja', 'Sahil', 'Ritika', 'Manish', 'Anjali',
  'Harsh', 'Sakshi', 'Kunal', 'Neha', 'Amit', 'Shreya', 'Varun', 'Divya', 'Rajat', 'Lakshmi',
  'Gaurav', 'Aisha', 'Imran', 'Payal', 'Vikram', 'Sunita', 'Ajay', 'Kiran', 'Mohit', 'Anita',
]
const lastNames = [
  'Sharma', 'Patel', 'Gupta', 'Singh', 'Khan', 'Verma', 'Mehta', 'Reddy', 'Joshi', 'Iyer',
  'Nair', 'Pillai', 'Desai', 'Rao', 'Bose', 'Kulkarni', 'Malhotra', 'Sheikh', 'Agarwal', 'Das',
  'Kapoor', 'Saxena', 'Prakash', 'Qureshi', 'Ali', 'Jain', 'Mishra', 'Chauhan', 'Bhatt', 'Thakur',
  'Yadav', 'Kaur', 'Menon', 'Nambiar', 'Ghosh', 'Banerjee', 'Mukherjee', 'Chatterjee', 'Sengupta', 'Dutta',
]
const namePool = []
for (const f of firstNames) for (const l of lastNames) namePool.push(`${f} ${l}`)
for (let i = namePool.length - 1; i > 0; i--) {
  const j = Math.floor(rand() * (i + 1))
  ;[namePool[i], namePool[j]] = [namePool[j], namePool[i]]
}

const students = []
let roll = 1001
let nameIdx = 0
let branchIdx = 0
// Section A: 49 generated + 1 demo student = 50
const generatedPerSection = { A: 49, B: 50, C: 50, D: 50 }
for (const section of SECTIONS) {
  for (let i = 0; i < generatedPerSection[section]; i++) {
    students.push({
      id: `st-${roll - 1000}`,
      name: namePool[nameIdx++],
      section,
      branch: BRANCHES[branchIdx++ % BRANCHES.length],
      rollNumber: String(roll++),
      batch: rand() < 0.15 ? '25-26' : '26-27',
      password: 'student123',
      addedAt: '2026-10-01',
    })
  }
}
students.unshift({
  id: 'st-demo',
  name: 'Siddharth Rawat',
  section: 'A',
  branch: 'CSE',
  rollNumber: '2400321540187',
  batch: '26-27',
  password: 'student123',
  addedAt: '2026-09-15',
})

const dates = []
const cursor = new Date('2026-10-05T00:00:00Z')
while (dates.length < 12) {
  const day = cursor.getUTCDay()
  if (day !== 0 && day !== 6) dates.push(cursor.toISOString().slice(0, 10))
  cursor.setUTCDate(cursor.getUTCDate() + 1)
}

const attendance = []
for (const date of dates) {
  for (const subject of subjects) {
    for (const s of students) {
      attendance.push({
        date,
        section: s.section,
        subject,
        branch: s.branch,
        rollNumber: s.rollNumber,
        status: rand() < 0.86 ? 'present' : 'absent',
      })
    }
  }
}

const assignments = [
  {
    id: 'as-1',
    title: 'Data Structures — Linked List Problems',
    subject: 'Data Structures',
    section: 'A',
    branch: 'CSE',
    description:
      'Solve all 10 linked-list problems (insertion, deletion, reversal). Show complete working and submit as a single PDF.',
    fileName: 'linked-list-problems.pdf',
    dueDate: '2026-10-25',
    uploadedAt: '2026-10-10',
    uploadedBy: 'Admin',
    submissions: [
      { studentRoll: '1001', fileName: 'aarav_linked_list.pdf', submittedAt: '2026-10-14' },
      { studentRoll: '1003', fileName: 'rohan_linked_list.pdf', submittedAt: '2026-10-15' },
    ],
  },
  {
    id: 'as-2',
    title: 'DBMS — ER Diagram Design',
    subject: 'DBMS',
    section: 'A',
    branch: 'CSE',
    description:
      'Design an ER diagram for a college management system along with a 2-page write-up. Upload the PDF of your report.',
    fileName: 'er-diagram-report.pdf',
    dueDate: '2026-10-28',
    uploadedAt: '2026-10-12',
    uploadedBy: 'Admin',
    submissions: [
      { studentRoll: '2400321540187', fileName: 'siddharth_er_diagram.pdf', submittedAt: '2026-10-18' },
    ],
  },
  {
    id: 'as-3',
    title: 'Operating Systems — Process Scheduling Notes',
    subject: 'Operating Systems',
    section: 'All',
    branch: 'CSE',
    description:
      'Write notes on FCFS, SJF and Round Robin scheduling with one worked example for each algorithm.',
    fileName: 'process-scheduling-notes.pdf',
    dueDate: '2026-10-30',
    uploadedAt: '2026-10-14',
    uploadedBy: 'Admin',
    submissions: [],
  },
  {
    id: 'as-4',
    title: 'DBMS — Normalization Worksheet',
    subject: 'DBMS',
    section: 'All',
    branch: 'DS',
    description:
      'Normalize the given tables up to 3NF. Show each normal form step with functional dependencies.',
    fileName: 'normalization-worksheet.pdf',
    dueDate: '2026-10-26',
    uploadedAt: '2026-10-15',
    uploadedBy: 'Admin',
    submissions: [],
  },
  {
    id: 'as-5',
    title: 'Data Structures — Sorting Algorithms Lab',
    subject: 'Data Structures',
    section: 'All',
    branch: 'IT',
    description:
      'Implement bubble sort, quick sort and merge sort. Include time-complexity analysis in the PDF report.',
    fileName: 'sorting-algorithms-lab.pdf',
    dueDate: '2026-10-27',
    uploadedAt: '2026-10-16',
    uploadedBy: 'Admin',
    submissions: [],
  },
  {
    id: 'as-6',
    title: 'Operating Systems — Deadlock Case Study',
    subject: 'Operating Systems',
    section: 'All',
    branch: 'AIML',
    description:
      'Present a case study on deadlock detection and recovery with a real-world example.',
    fileName: 'deadlock-case-study.pdf',
    dueDate: '2026-10-29',
    uploadedAt: '2026-10-17',
    uploadedBy: 'Admin',
    submissions: [],
  },
]

const users = {
  admins: [{ id: 'admin-1', username: 'admin', password: 'admin123', name: 'Principal Sharma' }],
}

writeFileSync(join(outDir, 'students.json'), JSON.stringify(students, null, 2))
writeFileSync(join(outDir, 'attendance.json'), JSON.stringify(attendance, null, 2))
writeFileSync(join(outDir, 'assignments.json'), JSON.stringify(assignments, null, 2))
writeFileSync(join(outDir, 'users.json'), JSON.stringify(users, null, 2))

console.log(
  `Generated: ${students.length} students (${SECTIONS.length} sections), ${attendance.length} attendance records, ${assignments.length} assignments, dates: ${dates[0]}..${dates[dates.length - 1]}`,
)
