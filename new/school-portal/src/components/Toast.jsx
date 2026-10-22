import { createContext, useCallback, useContext, useState } from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const push = useCallback((message, type = 'success') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    setToasts((t) => [...t, { id, message, type }])
    window.setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id))
    }, 4000)
  }, [])

  const dismiss = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div className="toast-container" aria-live="polite" role="status">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            {t.type === 'error' ? (
              <XCircle size={18} color="#f87171" />
            ) : (
              <CheckCircle2 size={18} color="#4ade80" />
            )}
            <span>{t.message}</span>
            <button
              type="button"
              className="icon-btn"
              style={{ width: 28, height: 28, minHeight: 28, marginLeft: 'auto' }}
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss notification"
            >
              <XCircle size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
