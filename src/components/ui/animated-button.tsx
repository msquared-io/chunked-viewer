import { useState } from 'react'
import { Button } from './button'

interface AnimatedButtonProps {
  onClick: () => Promise<void> | void
  children: React.ReactNode
  loadingText?: string
  successText?: string
  errorText?: string
  disabled?: boolean
  className?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  showSuccess?: boolean
  successDuration?: number
}

export function AnimatedButton({
  onClick,
  children,
  loadingText = "loading...",
  successText = "success!",
  errorText = "error",
  disabled,
  className,
  variant,
  size,
  showSuccess = true,
  successDuration = 2000
}: AnimatedButtonProps) {
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleClick = async () => {
    if (state === 'loading' || disabled) return

    setState('loading')
    try {
      await onClick()
      if (showSuccess) {
        setState('success')
        setTimeout(() => setState('idle'), successDuration)
      } else {
        setState('idle')
      }
    } catch (error) {
      setState('error')
      setTimeout(() => setState('idle'), 3000)
    }
  }

  const getButtonContent = () => {
    switch (state) {
      case 'loading':
        return (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            {loadingText}
          </div>
        )
      case 'success':
        return (
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {successText}
          </div>
        )
      case 'error':
        return (
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            {errorText}
          </div>
        )
      default:
        return children
    }
  }

  const getButtonClassName = () => {
    const baseClasses = className || ""
    const stateClasses = {
      loading: "opacity-80 cursor-not-allowed",
      success: "bg-emerald-600 hover:bg-emerald-700 border-emerald-600",
      error: "bg-red-600 hover:bg-red-700 border-red-600",
      idle: ""
    }
    
    return `${baseClasses} ${stateClasses[state]} transition-all duration-200`
  }

  return (
    <Button
      onClick={handleClick}
      disabled={disabled || state === 'loading'}
      className={getButtonClassName()}
      variant={state === 'success' || state === 'error' ? 'default' : variant}
      size={size}
    >
      {getButtonContent()}
    </Button>
  )
} 