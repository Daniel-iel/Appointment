import { validateTimeFormat, validateDateFormat, sanitizeDescription, validateAppointment, validateDateRange } from '@/utils/validators'
import { Appointment } from '@/lib/types'

describe('validateTimeFormat', () => {
  it('should accept valid times', () => {
    expect(() => validateTimeFormat('09:00')).not.toThrow()
    expect(() => validateTimeFormat('00:00')).not.toThrow()
    expect(() => validateTimeFormat('23:59')).not.toThrow()
    expect(() => validateTimeFormat('12:30')).not.toThrow()
  })

  it('should reject invalid time formats', () => {
    expect(() => validateTimeFormat('9:00')).toThrow()
    expect(() => validateTimeFormat('09:0')).toThrow()
    expect(() => validateTimeFormat('25:00')).toThrow()
    expect(() => validateTimeFormat('09:60')).toThrow()
    expect(() => validateTimeFormat('09-00')).toThrow()
    expect(() => validateTimeFormat('abc')).toThrow()
  })
})

describe('validateDateFormat', () => {
  it('should accept valid ISO 8601 dates', () => {
    expect(() => validateDateFormat('2024-06-01')).not.toThrow()
    expect(() => validateDateFormat('2024-12-31')).not.toThrow()
    expect(() => validateDateFormat('2024-01-01')).not.toThrow()
  })

  it('should reject invalid date formats', () => {
    expect(() => validateDateFormat('06-01-2024')).toThrow()
    expect(() => validateDateFormat('2024/06/01')).toThrow()
    expect(() => validateDateFormat('01-06-2024')).toThrow()
    expect(() => validateDateFormat('2024-13-01')).toThrow()
    expect(() => validateDateFormat('2024-06-31')).toThrow()
  })
})

describe('sanitizeDescription', () => {
  it('should remove XSS attack vectors', () => {
    expect(sanitizeDescription('<script>alert("xss")</script>')).not.toContain('script')
    expect(sanitizeDescription('<img src=x onerror="alert(1)">')).not.toContain('onerror')
    expect(sanitizeDescription('<svg onload="alert(1)">')).not.toContain('onload')
  })

  it('should preserve normal text', () => {
    expect(sanitizeDescription('Normal text here')).toBe('Normal text here')
    expect(sanitizeDescription('Work from 9 to 5')).toBe('Work from 9 to 5')
  })

  it('should handle special characters safely', () => {
    expect(sanitizeDescription('Test & test')).toContain('&')
    expect(sanitizeDescription('Test "quotes"')).toContain('"')
  })

  it('should truncate if longer than 500 chars', () => {
    const longText = 'a'.repeat(600)
    const result = sanitizeDescription(longText)
    expect(result.length).toBeLessThanOrEqual(500)
  })
})

describe('validateDateRange', () => {
  it('should accept valid date ranges', () => {
    expect(() => validateDateRange('2024-06-01', '2024-06-01')).not.toThrow()
    expect(() => validateDateRange('2024-06-01', '2024-06-02')).not.toThrow()
  })

  it('should reject if end date is before start date', () => {
    expect(() => validateDateRange('2024-06-02', '2024-06-01')).toThrow()
  })
})

describe('validateAppointment', () => {
  const validAppointment = {
    id: '1',
    startDate: '2024-06-01',
    startTime: '09:00',
    endDate: '2024-06-01',
    endTime: '17:00',
    description: 'Work',
    createdAt: '2024-06-01T09:00:00Z',
    updatedAt: '2024-06-01T09:00:00Z',
  }

  it('should accept valid appointment', () => {
    expect(() => validateAppointment(validAppointment)).not.toThrow()
  })

  it('should reject appointment with invalid start time', () => {
    const invalid = { ...validAppointment, startTime: '25:00' }
    expect(() => validateAppointment(invalid)).toThrow()
  })

  it('should reject appointment with end time before start time', () => {
    const invalid = { ...validAppointment, endTime: '08:00' }
    expect(() => validateAppointment(invalid)).toThrow()
  })

  it('should reject appointment with empty description', () => {
    const invalid = { ...validAppointment, description: '' }
    expect(() => validateAppointment(invalid)).toThrow()
  })
})
