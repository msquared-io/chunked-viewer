import { useToast } from '@/components/ui/toast'

interface TransactionOptions {
  successTitle: string
  successMessage?: string
  errorTitle: string
  errorMessage?: string
  loadingTitle?: string
  loadingMessage?: string
}

export function useTransactionToast() {
  const { addToast } = useToast()

  const executeTransaction = async <T>(
    operation: () => Promise<T>,
    options: TransactionOptions
  ): Promise<T | null> => {
    // Show loading toast if specified
    if (options.loadingTitle) {
      addToast({
        type: 'info',
        title: options.loadingTitle,
        message: options.loadingMessage,
        duration: 2000
      })
    }

    try {
      const result = await operation()
      
      // Show success toast
      addToast({
        type: 'success',
        title: options.successTitle,
        message: options.successMessage
      })
      
      return result
    } catch (error) {
      // Show error toast
      addToast({
        type: 'error',
        title: options.errorTitle,
        message: options.errorMessage || (error instanceof Error ? error.message : 'An unexpected error occurred')
      })
      
      return null
    }
  }

  const executeBooleanTransaction = async (
    operation: () => Promise<boolean>,
    options: TransactionOptions
  ): Promise<boolean> => {
    try {
      const success = await operation()
      
      if (success) {
        addToast({
          type: 'success',
          title: options.successTitle,
          message: options.successMessage
        })
      } else {
        addToast({
          type: 'error',
          title: options.errorTitle,
          message: options.errorMessage
        })
      }
      
      return success
    } catch (error) {
      addToast({
        type: 'error',
        title: options.errorTitle,
        message: options.errorMessage || (error instanceof Error ? error.message : 'An unexpected error occurred')
      })
      
      return false
    }
  }

  return {
    executeTransaction,
    executeBooleanTransaction,
    addToast
  }
} 