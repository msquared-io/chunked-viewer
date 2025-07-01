import { useState, useEffect, createContext, useContext, useCallback } from 'react'

export interface Toast {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  message?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  clearToasts: () => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((toastData: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const toast: Toast = {
      id,
      duration: 5000,
      ...toastData
    }
    
    setToasts(prev => [...prev, toast])
    
    // Auto remove after duration
    if (toast.duration && toast.duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, toast.duration)
    }
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const clearToasts = useCallback(() => {
    setToasts([])
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearToasts }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  )
}

function ToastContainer() {
  const { toasts, removeToast } = useToast()

  return (
    <div className="fixed top-4 right-4 z-[9998] flex flex-col gap-2 max-w-sm">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  )
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const [isVisible, setIsVisible] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)

  useEffect(() => {
    // Trigger enter animation
    const timer = setTimeout(() => setIsVisible(true), 10)
    return () => clearTimeout(timer)
  }, [])

  const handleRemove = () => {
    setIsLeaving(true)
    setTimeout(() => onRemove(toast.id), 300)
  }

  const getToastStyles = () => {
    const base = "rounded-lg border shadow-lg p-4 transition-all duration-300 ease-out transform"
    const animation = isLeaving 
      ? "translate-x-full opacity-0 scale-95" 
      : isVisible 
        ? "translate-x-0 opacity-100 scale-100" 
        : "translate-x-full opacity-0 scale-95"
    
    const typeStyles = {
      success: "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800",
      error: "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800",
      warning: "bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800",
      info: "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800"
    }

    return `${base} ${animation} ${typeStyles[toast.type]}`
  }

  const getIconStyles = () => {
    const iconStyles = {
      success: "text-emerald-600 dark:text-emerald-400",
      error: "text-red-600 dark:text-red-400",
      warning: "text-orange-600 dark:text-orange-400",
      info: "text-blue-600 dark:text-blue-400"
    }
    return iconStyles[toast.type]
  }

  const getTextStyles = () => {
    const textStyles = {
      success: "text-emerald-900 dark:text-emerald-100",
      error: "text-red-900 dark:text-red-100",
      warning: "text-orange-900 dark:text-orange-100",
      info: "text-blue-900 dark:text-blue-100"
    }
    return textStyles[toast.type]
  }

  const getIcon = () => {
    const icons = {
      success: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-label="Success">
          <title>Success</title>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      error: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-label="Error">
          <title>Error</title>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
      warning: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-label="Warning">
          <title>Warning</title>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      ),
      info: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-label="Info">
          <title>Info</title>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
    return icons[toast.type]
  }

  return (
    <div className={getToastStyles()}>
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 ${getIconStyles()}`}>
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className={`font-medium text-sm ${getTextStyles()}`}>
            {toast.title}
          </div>
          {toast.message && (
            <div className={`text-sm mt-1 ${getTextStyles()} opacity-80`}>
              {toast.message}
            </div>
          )}
          {toast.action && (
            <button
              type="button"
              onClick={toast.action.onClick}
              className={`text-sm font-medium mt-2 ${getTextStyles()} hover:underline`}
            >
              {toast.action.label}
            </button>
          )}
        </div>
        
        <button
          type="button"
          onClick={handleRemove}
          className={`flex-shrink-0 ${getTextStyles()} opacity-60 hover:opacity-100 transition-opacity`}
          aria-label="Close notification"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <title>Close</title>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
} 