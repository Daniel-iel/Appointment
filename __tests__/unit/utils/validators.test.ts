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
    // Quotes are escaped to &quot;
    const result = sanitizeDescription('Test "quotes"')
    expect(result).toContain('&quot;')
  })

  it('should truncate if longer than 500 chars', () => {
    const longText = 'a'.repeat(600)
    const result = sanitizeDescription(longText)
    expect(result.length).toBeLessThanOrEqual(500)
  })

  // Security-focused tests
  describe('XSS Prevention', () => {
    it('should remove script tags and content', () => {
      const malicious = '<script>alert("XSS")</script>Hello'
      const result = sanitizeDescription(malicious)
      expect(result).not.toContain('<script')
      expect(result).not.toContain('alert')
      expect(result).toContain('Hello')
    })

    it('should remove uppercase script tags', () => {
      const malicious = '<SCRIPT>alert("XSS")</SCRIPT>'
      const result = sanitizeDescription(malicious)
      expect(result).not.toContain('SCRIPT')
      expect(result).not.toContain('alert')
    })

    it('should remove mixed-case script tags', () => {
      const malicious = '<ScRiPt>alert("XSS")</sCrIpT>'
      const result = sanitizeDescription(malicious)
      expect(result).not.toContain('cript')
      expect(result).not.toContain('alert')
    })

    it('should remove all HTML tags', () => {
      const inputs = [
        '<div>test</div>',
        '<span onclick="alert(1)">test</span>',
        '<img src=x onerror="alert(1)">',
        '<svg onload="alert(1)">',
        '<iframe src="malicious.com"></iframe>',
        '<object data="malicious.swf"></object>',
        '<embed src="malicious.swf">',
      ]
      
      inputs.forEach(input => {
        const result = sanitizeDescription(input)
        expect(result).not.toMatch(/<[^>]*>/)
      })
    })

    it('should remove javascript: protocol', () => {
      const malicious = 'javascript:alert(document.cookie)'
      const result = sanitizeDescription(malicious)
      expect(result.toLowerCase()).not.toContain('javascript:')
    })

    it('should remove event handlers', () => {
      const handlers = [
        'onclick=alert(1)',
        'onload=alert(1)',
        'onerror=alert(1)',
        'onmouseover=alert(1)',
        'onfocus=alert(1)',
      ]
      
      handlers.forEach(handler => {
        const result = sanitizeDescription(handler)
        expect(result.toLowerCase()).not.toMatch(/on\w+\s*=/)
      })
    })

    it('should escape HTML entities', () => {
      const input = 'Test & < > " \' symbols'
      const result = sanitizeDescription(input)
      expect(result).toContain('&amp;')
      // < and > are removed by tag stripping, then what's left is escaped
      expect(result).toContain('&quot;')
      expect(result).toContain('&#x27;')
      // Should not contain the literal < or >
      expect(result).not.toContain('<')
      expect(result).not.toContain('>')
    })

    it('should handle nested attack vectors', () => {
      const malicious = '<div><script>alert(1)</script><img src=x onerror="alert(2)"></div>'
      const result = sanitizeDescription(malicious)
      expect(result).not.toContain('<')
      expect(result).not.toContain('>')
      expect(result).not.toContain('script')
      expect(result).not.toContain('onerror')
    })

    it('should handle data URIs', () => {
      const malicious = 'data:text/html,<script>alert(1)</script>'
      const result = sanitizeDescription(malicious)
      expect(result).not.toContain('<script')
    })
  })

  describe('Input Validation', () => {
    it('should handle non-string input safely', () => {
      expect(sanitizeDescription(null as any)).toBe('')
      expect(sanitizeDescription(undefined as any)).toBe('')
      expect(sanitizeDescription(123 as any)).toBe('')
      expect(sanitizeDescription({} as any)).toBe('')
      expect(sanitizeDescription([] as any)).toBe('')
    })

    it('should handle empty string', () => {
      expect(sanitizeDescription('')).toBe('')
    })

    it('should handle only whitespace', () => {
      expect(sanitizeDescription('   ')).toBe('   ')
    })
  })

  describe('Length Constraints', () => {
    it('should enforce 500 character limit', () => {
      const text500 = 'a'.repeat(500)
      const text501 = 'a'.repeat(501)
      const text1000 = 'a'.repeat(1000)
      
      expect(sanitizeDescription(text500).length).toBe(500)
      expect(sanitizeDescription(text501).length).toBe(500)
      expect(sanitizeDescription(text1000).length).toBe(500)
    })

    it('should apply length limit after sanitization', () => {
      const longMalicious = '<script>alert(1)</script>' + 'a'.repeat(500)
      const result = sanitizeDescription(longMalicious)
      expect(result.length).toBeLessThanOrEqual(500)
    })
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
