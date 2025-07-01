import React, { useEffect } from "react"
import { createPortal } from "react-dom"

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

interface DialogContentProps {
  children: React.ReactNode
  className?: string
}

interface DialogHeaderProps {
  children: React.ReactNode
}

interface DialogTitleProps {
  children: React.ReactNode
}

interface DialogTriggerProps {
  asChild?: boolean
  children: React.ReactNode
  onClick?: () => void
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onOpenChange(false)
      }
    }

    if (open) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [open, onOpenChange])

  if (!open) return null

  const dialogContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            onOpenChange(false)
          }
        }}
        role="button"
        tabIndex={0}
      />
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )

  // Render the dialog in a portal at the document root
  return createPortal(dialogContent, document.body)
}

export function DialogContent({ children, className = "" }: DialogContentProps) {
  return (
    <div className={`bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-6 w-full max-w-md mx-4 ${className}`}>
      {children}
    </div>
  )
}

export function DialogHeader({ children }: DialogHeaderProps) {
  return (
    <div className="mb-4">
      {children}
    </div>
  )
}

export function DialogTitle({ children }: DialogTitleProps) {
  return (
    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
      {children}
    </h2>
  )
}

export function DialogTrigger({ asChild, children, onClick }: DialogTriggerProps) {
  if (asChild) {
    return React.cloneElement(children as React.ReactElement, { onClick } as React.HTMLAttributes<HTMLElement>)
  }
  
  return (
    <button type="button" onClick={onClick}>
      {children}
    </button>
  )
} 