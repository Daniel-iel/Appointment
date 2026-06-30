import { Appointment, ValidationError } from '@/lib/types'

/**
 * Validate time format (HH:mm, 24-hour)
 * @param time - Time string to validate
 * @throws Error if format is invalid
 */
export function validateTimeFormat(time: string): void {
  const timeRegex = /^([01][0-9]|2[0-3]):[0-5][0-9]$/

  if (!timeRegex.test(time)) {
    throw new Error(
      `Invalid time format "${time}". Expected HH:mm in 24-hour format (e.g., 09:00, 23:59)`
    )
  }
}

/**
 * Validate ISO 8601 date format (YYYY-MM-DD)
 * @param date - Date string to validate
 * @throws Error if format is invalid
 */
export function validateDateFormat(date: string): void {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  
  if (!dateRegex.test(date)) {
    throw new Error(
      `Invalid date format "${date}". Expected YYYY-MM-DD format (e.g., 2024-01-15)`
    )
  }
  
  // Check if the date actually exists (validate day for month)
  const [year, month, day] = date.split('-').map(Number)
  const parsed = new Date(year, month - 1, day)
  
  if (parsed.getFullYear() !== year || parsed.getMonth() !== month - 1 || parsed.getDate() !== day) {
    throw new Error(
      `Invalid date "${date}". The date does not exist (e.g., 2024-06-31 is invalid)`
    )
  }
}

/**
 * Sanitize description to prevent XSS attacks
 * @param description - Raw description text
 * @returns Sanitized description (max 500 chars)
 */
export function sanitizeDescription(description: string): string {
  if (typeof description !== 'string') {
    return ''
  }

  // Remove script tags and their content
  let sanitized = description.replace(/<script[^>]*>.*?<\/script>/gi, '')
  
  // Remove all HTML tags
  sanitized = sanitized.replace(/<[^>]*>/g, '')
  
  // Remove javascript: protocol
  sanitized = sanitized.replace(/javascript:/gi, '')
  
  // Remove event handlers (onclick, onerror, onload, etc.)
  sanitized = sanitized.replace(/on\w+\s*=/gi, '')

  // Escape HTML entities
  sanitized = sanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')

  // Truncate to max 500 characters
  return sanitized.substring(0, 500)
}

/**
 * Validate date range (startDate before endDate)
 * @param startDate - Start date in YYYY-MM-DD format
 * @param endDate - End date in YYYY-MM-DD format
 * @throws Error if range is invalid
 */
export function validateDateRange(startDate: string, endDate: string): void {
  validateDateFormat(startDate)
  validateDateFormat(endDate)

  const start = new Date(startDate)
  const end = new Date(endDate)

  if (start > end) {
    throw new Error(
      `Invalid date range. Start date (${startDate}) must be before or equal to end date (${endDate})`
    )
  }
}

/**
 * Validate a complete appointment object
 * @param appointment - Appointment to validate
 * @throws Error if appointment is invalid
 */
export function validateAppointment(appointment: Appointment): void {
  const errors: ValidationError[] = []

  // Validate required fields
  if (!appointment) {
    throw new Error('Appointment is required')
  }

  // Validate ID
  if (!appointment.id || typeof appointment.id !== 'string') {
    errors.push({
      field: 'id',
      message: 'Appointment ID must be a non-empty string',
      type: 'format',
    })
  }

  // Validate startDate
  try {
    validateDateFormat(appointment.startDate)
  } catch (e) {
    errors.push({
      field: 'startDate',
      message: 'Invalid start date format. Expected YYYY-MM-DD',
      type: 'format',
    })
  }

  // Validate startTime
  try {
    validateTimeFormat(appointment.startTime)
  } catch (e) {
    errors.push({
      field: 'startTime',
      message: 'Invalid start time format. Expected HH:mm in 24-hour format',
      type: 'format',
    })
  }

  // Validate endDate
  try {
    validateDateFormat(appointment.endDate)
  } catch (e) {
    errors.push({
      field: 'endDate',
      message: 'Invalid end date format. Expected YYYY-MM-DD',
      type: 'format',
    })
  }

  // Validate endTime
  try {
    validateTimeFormat(appointment.endTime)
  } catch (e) {
    errors.push({
      field: 'endTime',
      message: 'Invalid end time format. Expected HH:mm in 24-hour format',
      type: 'format',
    })
  }

  // Validate date range if dates are valid
  if (!errors.some(e => e.field === 'startDate' || e.field === 'endDate')) {
    try {
      validateDateRange(appointment.startDate, appointment.endDate)
    } catch (e) {
      errors.push({
        field: 'dateRange',
        message: 'End date must be after start date',
        type: 'range',
      })
    }
  }

  // Validate time order if same day
  if (appointment.startDate === appointment.endDate) {
    const startParts = appointment.startTime.split(':')
    const endParts = appointment.endTime.split(':')
    const startMinutes = parseInt(startParts[0]) * 60 + parseInt(startParts[1])
    const endMinutes = parseInt(endParts[0]) * 60 + parseInt(endParts[1])
    
    if (endMinutes < startMinutes) {
      errors.push({
        field: 'timeRange',
        message: 'End time must be after start time when on the same day',
        type: 'range',
      })
    }
  }

  // Validate description - must not be empty if provided
  if (typeof appointment.description === 'string' && appointment.description.trim() === '') {
    errors.push({
      field: 'description',
      message: 'Description cannot be empty',
      type: 'required',
    })
  }

  if (appointment.description && typeof appointment.description !== 'string') {
    errors.push({
      field: 'description',
      message: 'Description must be a string',
      type: 'type',
    })
  }

  if (appointment.description && appointment.description.length > 500) {
    errors.push({
      field: 'description',
      message: 'Description must be 500 characters or less',
      type: 'length',
    })
  }

  // Validate createdAt
  if (!appointment.createdAt || typeof appointment.createdAt !== 'string') {
    errors.push({
      field: 'createdAt',
      message: 'createdAt must be a valid ISO 8601 timestamp',
      type: 'format',
    })
  }

  // Validate updatedAt
  if (!appointment.updatedAt || typeof appointment.updatedAt !== 'string') {
    errors.push({
      field: 'updatedAt',
      message: 'updatedAt must be a valid ISO 8601 timestamp',
      type: 'format',
    })
  }

  if (errors.length > 0) {
    throw new Error(`Validation failed: ${errors.map(e => e.message).join(', ')}`)
  }
}

/**
 * Validate lunch deduction parameters
 * @param grossHours - Original hours before deduction
 * @param hasLunchBreak - Whether lunch break should be deducted
 * @param lunchDuration - Duration of lunch in hours
 * @throws Error if validation fails
 */
export function validateLunchDeduction(
  grossHours: number,
  hasLunchBreak: boolean,
  lunchDuration: number
): void {
  if (hasLunchBreak) {
    // Lunch break can only be applied to full-day folgas (>= 8 hours)
    if (grossHours < 8) {
      throw new Error(
        `Lunch break deduction requires at least 8 hours. Got ${grossHours.toFixed(2)}h`
      )
    }

    // Lunch duration must be positive
    if (lunchDuration <= 0) {
      throw new Error(
        `Lunch duration must be greater than 0. Got ${lunchDuration}h`
      )
    }

    // Lunch duration must be less than gross hours
    if (lunchDuration >= grossHours) {
      throw new Error(
        `Lunch duration (${lunchDuration}h) must be less than gross hours (${grossHours.toFixed(2)}h)`
      )
    }

    // Lunch duration should be one of the standard options
    const validDurations = [0.5, 1, 1.5]
    if (!validDurations.includes(lunchDuration)) {
      throw new Error(
        `Invalid lunch duration. Expected 0.5, 1, or 1.5 hours. Got ${lunchDuration}h`
      )
    }
  }
}
