import type { BlockCount, ItemCount } from "../types/stats"

type CountItem = BlockCount | ItemCount

// Generic type guard for arrays
function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value)
}

// Type guard for CountItem arrays
function isCountItemArray(value: unknown): value is CountItem[] {
  return (
    isArray(value) &&
    value.length > 0 &&
    typeof value[0] === "object" &&
    (("blockType" in (value[0] as object) && "count" in (value[0] as object)) ||
      ("itemType" in (value[0] as object) && "count" in (value[0] as object)))
  )
}

// Type guard for number arrays
function isNumberArray(value: unknown): value is number[] {
  return isArray(value) && value.length > 0 && typeof value[0] === "number"
}

// Type guard for bigint
function isBigInt(value: unknown): value is bigint {
  return typeof value === "bigint"
}

/**
 * Generic deep merge function that uses type reflection
 * Merges two objects of the same type, handling:
 * - Numbers: adds them together
 * - BigInts: adds them together
 * - Arrays of BlockCount/ItemCount: combines counts for same types
 * - Arrays of numbers: takes unique values
 * - Other arrays: concatenates and removes duplicates
 * - Objects: recursively merges properties
 */
export function deepMerge<T>(
  obj1: T | undefined,
  obj2: T | undefined,
): T | undefined {
  if (!obj1 && !obj2) return undefined
  if (!obj1) return obj2
  if (!obj2) return obj1

  // Handle primitive types
  if (typeof obj1 !== "object" || obj1 === null) {
    if (isBigInt(obj1) && isBigInt(obj2)) {
      return (obj1 + obj2) as unknown as T
    }
    if (typeof obj1 === "number" && typeof obj2 === "number") {
      return (obj1 + obj2) as unknown as T
    }
    return obj1
  }

  // Handle arrays
  if (isArray(obj1) && isArray(obj2)) {
    if (isCountItemArray(obj1) && isCountItemArray(obj2)) {
      // Merge CountItem arrays by combining counts for same types
      const merged = new Map<number, CountItem>()

      const processItem = (item: CountItem) => {
        const type = "blockType" in item ? item.blockType : item.itemType
        if (!merged.has(type)) {
          merged.set(type, { ...item, count: 0 })
        }
        const existing = merged.get(type)
        if (existing) {
          existing.count += item.count
        }
      }

      obj1.forEach(processItem)
      obj2.forEach(processItem)

      return Array.from(merged.values()) as unknown as T
    }

    if (isNumberArray(obj1) && isNumberArray(obj2)) {
      // Merge number arrays by taking unique values
      return Array.from(new Set([...obj1, ...obj2])) as unknown as T
    }

    // For other arrays, concatenate and remove duplicates
    return Array.from(new Set([...obj1, ...obj2])) as unknown as T
  }

  // Handle objects recursively
  const result = { ...obj1 } as Record<keyof T, unknown>

  for (const key in obj2) {
    if (key in obj1) {
      result[key as keyof T] = deepMerge(
        obj1[key as keyof T],
        obj2[key as keyof T],
      )
    } else {
      result[key as keyof T] = obj2[key as keyof T]
    }
  }

  return result as T
}
