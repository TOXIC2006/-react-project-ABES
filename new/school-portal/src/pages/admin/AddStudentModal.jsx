import { useEffect, useState } from 'react'
import Modal from '../../components/Modal'
import { useData } from '../../store/DataContext'
import { useToast } from '../../components/Toast'
import { BRANCHES, SECTIONS } from '../../lib/constants'

const EMPTY = { name: '', section: 'A', branch: 'CSE', rollNumber: '' }

export default function AddStudentModal({ open, onClose }) {
  const { addStudent } = useData()
  const toast = useToast()
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (open) {
      setForm(EMPTY)
      setErrors({})
    }
  }, [open])

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Student name is required.'
    if (!form.rollNumber.trim()) errs.rollNumber = 'Roll number is required.'
    if (form.rollNumber.trim() && !/^\d+$/.test(form.rollNumber.trim()))
      errs.rollNumber = 'Roll number must contain digits only.'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSave = (e) => {
    e.preventDefault()
    if (!validate()) return
    const result = addStudent(form)
    if (result.ok) {
      alert('Student record Successfully')
      toast(`Student "${form.name}" added to records.`)
      onClose()
    } else {
      setErrors({ rollNumber: result.error })
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add Student"
      footer={
        <>
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" form="add-student-form" className="btn btn-primary">
            Save
          </button>
        </>
      }
    >
      <form id="add-student-form" onSubmit={handleSave} noValidate>
        <div className={`field${errors.name ? ' field-error' : ''}`}>
          <label className="label" htmlFor="as-name">
            Name <span className="required">*</span>
          </label>
          <input
            id="as-name"
            className="input"
            type="text"
            placeholder="Enter student name"
            value={form.name}
            onChange={set('name')}
          />
          {errors.name && (
            <span className="error-text" role="alert">
              {errors.name}
            </span>
          )}
        </div>

        <div className="form-grid">
          <div className="field">
            <label className="label" htmlFor="as-branch">
              Branch <span className="required">*</span>
            </label>
            <select id="as-branch" className="select" value={form.branch} onChange={set('branch')}>
              {BRANCHES.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label className="label" htmlFor="as-section">
              Section <span className="required">*</span>
            </label>
            <select id="as-section" className="select" value={form.section} onChange={set('section')}>
              {SECTIONS.map((s) => (
                <option key={s} value={s}>
                  Section {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={`field${errors.rollNumber ? ' field-error' : ''}`}>
          <label className="label" htmlFor="as-roll">
            Roll Number <span className="required">*</span>
          </label>
          <input
            id="as-roll"
            className="input"
            type="text"
            inputMode="numeric"
            placeholder="e.g. 1042"
            value={form.rollNumber}
            onChange={set('rollNumber')}
          />
          {errors.rollNumber && (
            <span className="error-text" role="alert">
              {errors.rollNumber}
            </span>
          )}
        </div>

        <p className="hint">
          The student can log in using this roll number with the default password{' '}
          <code>student123</code>.
        </p>
      </form>
    </Modal>
  )
}
