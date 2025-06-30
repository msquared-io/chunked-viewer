import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format numbers (including bigints & numeric strings) with thousands separators while
// optionally trimming to a maximum number of decimal places. Suitable for displaying
// very large integers (millions/billions) while keeping smaller decimal values tidy.
//
// Example:
//   formatNumber(1234567.8912)      => "1,234,567.8912"
//   formatNumber(123456789123456n)  => "123,456,789,123,456"
//   formatNumber("9876543.21", 2)  => "9,876,543.21"
export function formatNumber(
  value: number | bigint | string,
  maxDecimals = 4,
): string {
  // Convert to string while respecting the desired decimal precision for numbers
  let rawString: string

  if (typeof value === "number") {
    // Fix to the desired decimals, then strip trailing zeros
    rawString = Number.parseFloat(value.toFixed(maxDecimals)).toString()
  } else {
    // bigint or pre-formatted string
    rawString = value.toString()
  }

  // Split into integer and fractional parts
  const [integerPart, fractionalPart] = rawString.split(".")

  // Insert commas into the integer part
  const withCommas = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",")

  return fractionalPart ? `${withCommas}.${fractionalPart}` : withCommas
}
