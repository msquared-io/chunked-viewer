import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format number without trailing zeros
export function formatNumber(value: number, maxDecimals = 4): string {
  // Use toFixed to ensure we have the right precision, then Number.parseFloat to remove trailing zeros
  return Number.parseFloat(value.toFixed(maxDecimals)).toString()
}
