/**
 * Simple UUID v4 generator for the application
 * This is a lightweight implementation to avoid ESM module issues with jest
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

// Re-export as v4 for compatibility
export const v4 = generateUUID
