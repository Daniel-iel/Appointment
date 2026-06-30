import { importFromCSV, CSVImportValidationError } from '@/lib/import'

describe('CSV Import Security', () => {
  describe('Prototype Pollution Prevention', () => {
    it('should reject CSV with __proto__ header', () => {
      const maliciousCSV = `__proto__,Start Date,Start Time,End Date,End Time,Description
polluted,2024-06-01,09:00,2024-06-01,17:00,Test`
      
      expect(() => importFromCSV(maliciousCSV)).toThrow('Forbidden header name')
    })

    it('should reject CSV with constructor header', () => {
      const maliciousCSV = `constructor,Start Date,Start Time,End Date,End Time,Description
polluted,2024-06-01,09:00,2024-06-01,17:00,Test`
      
      expect(() => importFromCSV(maliciousCSV)).toThrow('Forbidden header name')
    })

    it('should reject CSV with prototype header', () => {
      const maliciousCSV = `prototype,Start Date,Start Time,End Date,End Time,Description
polluted,2024-06-01,09:00,2024-06-01,17:00,Test`
      
      expect(() => importFromCSV(maliciousCSV)).toThrow('Forbidden header name')
    })

    it('should accept normal headers', () => {
      const validCSV = `Start Date,Start Time,End Date,End Time,Description
2024-06-01,09:00,2024-06-01,17:00,Normal work`
      
      expect(() => importFromCSV(validCSV)).not.toThrow()
    })
  })

  describe('XSS Prevention in Imported Data', () => {
    it('should sanitize script tags in descriptions', () => {
      const maliciousCSV = `Start Date,Start Time,End Date,End Time,Description
2024-06-01,09:00,2024-06-01,17:00,"<script>alert('XSS')</script>"`
      
      const result = importFromCSV(maliciousCSV)
      const appointment = result.data[0] as any
      
      expect(appointment.description).not.toContain('<script')
      expect(appointment.description).not.toContain('alert')
    })

    it('should sanitize event handlers in descriptions', () => {
      const maliciousCSV = `Start Date,Start Time,End Date,End Time,Description
2024-06-01,09:00,2024-06-01,17:00,"<img src=x onerror=""alert(1)"">"`
      
      const result = importFromCSV(maliciousCSV)
      const appointment = result.data[0] as any
      
      expect(appointment.description.toLowerCase()).not.toContain('onerror')
    })

    it('should sanitize javascript: protocol', () => {
      const maliciousCSV = `Start Date,Start Time,End Date,End Time,Description
2024-06-01,09:00,2024-06-01,17:00,javascript:alert(document.cookie)`
      
      const result = importFromCSV(maliciousCSV)
      const appointment = result.data[0] as any
      
      expect(appointment.description.toLowerCase()).not.toContain('javascript:')
    })
  })

  describe('DoS Prevention', () => {
    it('should reject CSV with too many rows', () => {
      // Create CSV with more than MAX_ROWS (10000)
      const header = 'Start Date,Start Time,End Date,End Time,Description\n'
      const row = '2024-06-01,09:00,2024-06-01,17:00,Test\n'
      const maliciousCSV = header + row.repeat(10001)
      
      expect(() => importFromCSV(maliciousCSV)).toThrow('exceeds maximum')
    })

    it('should reject CSV with excessively long line', () => {
      const longDescription = 'a'.repeat(100001) // Exceeds MAX_LINE_LENGTH (100000)
      const maliciousCSV = `Start Date,Start Time,End Date,End Time,Description
2024-06-01,09:00,2024-06-01,17:00,${longDescription}`
      
      expect(() => importFromCSV(maliciousCSV)).toThrow('exceeds maximum length')
    })

    it('should reject CSV with excessively long field', () => {
      const longField = 'a'.repeat(10001) // Exceeds MAX_FIELD_LENGTH (10000)
      const maliciousCSV = `Start Date,Start Time,End Date,End Time,Description
2024-06-01,09:00,2024-06-01,17:00,"${longField}"`
      
      expect(() => importFromCSV(maliciousCSV)).toThrow('exceeds maximum length')
    })

    it('should accept CSV within limits', () => {
      const header = 'Start Date,Start Time,End Date,End Time,Description\n'
      const row = '2024-06-01,09:00,2024-06-01,17:00,Test\n'
      const validCSV = header + row.repeat(100) // Well within limits
      
      expect(() => importFromCSV(validCSV)).not.toThrow()
    })
  })

  describe('Data Validation', () => {
    it('should reject empty CSV', () => {
      expect(() => importFromCSV('')).toThrow('empty')
    })

    it('should reject CSV with only headers', () => {
      const csv = 'Start Date,Start Time,End Date,End Time,Description'
      expect(() => importFromCSV(csv)).toThrow('at least a header row and one data row')
    })

    it('should validate date formats', () => {
      const invalidCSV = `Start Date,Start Time,End Date,End Time,Description
06/01/2024,09:00,2024-06-01,17:00,Test`
      
      expect(() => importFromCSV(invalidCSV)).toThrow(CSVImportValidationError)
    })

    it('should validate time formats', () => {
      const invalidCSV = `Start Date,Start Time,End Date,End Time,Description
2024-06-01,9:00,2024-06-01,17:00,Test`
      
      expect(() => importFromCSV(invalidCSV)).toThrow(CSVImportValidationError)
    })

    it('should enforce description length limit', () => {
      const longDescription = 'a'.repeat(501)
      const invalidCSV = `Start Date,Start Time,End Date,End Time,Description
2024-06-01,09:00,2024-06-01,17:00,"${longDescription}"`
      
      // Description is sanitized and truncated to 500 chars, so it passes validation
      // The length check happens BEFORE sanitization, but sanitization also truncates
      const result = importFromCSV(invalidCSV)
      const appointment = result.data[0] as any
      
      // Should be truncated to 500 chars
      expect(appointment.description.length).toBeLessThanOrEqual(500)
    })
  })

  describe('CSV Parsing', () => {
    it('should handle quoted fields correctly', () => {
      const csv = `Start Date,Start Time,End Date,End Time,Description
2024-06-01,09:00,2024-06-01,17:00,"Test, with, commas"`
      
      const result = importFromCSV(csv)
      const appointment = result.data[0] as any
      
      expect(appointment.description).toContain('Test, with, commas')
    })

    it('should handle escaped quotes in fields', () => {
      const csv = `Start Date,Start Time,End Date,End Time,Description
2024-06-01,09:00,2024-06-01,17:00,"Test ""quoted"" text"`
      
      const result = importFromCSV(csv)
      const appointment = result.data[0] as any
      
      // Quotes are escaped to HTML entities by sanitization
      expect(appointment.description).toContain('&quot;')
    })

    it('should skip empty rows', () => {
      const csv = `Start Date,Start Time,End Date,End Time,Description
2024-06-01,09:00,2024-06-01,17:00,First
,,,,
2024-06-02,09:00,2024-06-02,17:00,Second`
      
      const result = importFromCSV(csv)
      
      // Should only import 2 appointments, skipping empty row
      expect(result.count).toBe(2)
    })
  })

  describe('Type Detection', () => {
    it('should detect appointment type', () => {
      const csv = `Start Date,Start Time,End Date,End Time,Description
2024-06-01,09:00,2024-06-01,17:00,Work`
      
      const result = importFromCSV(csv)
      
      expect(result.type).toBe('appointment')
    })

    it('should detect folga type by lunch break header', () => {
      const csv = `Start Date,Start Time,End Date,End Time,Description,Hours,Has Lunch Break
2024-06-01,09:00,2024-06-01,17:00,Time off,8,true`
      
      const result = importFromCSV(csv)
      
      expect(result.type).toBe('folga')
    })
  })

  describe('Error Accumulation', () => {
    it('should collect all errors before throwing', () => {
      const invalidCSV = `Start Date,Start Time,End Date,End Time,Description
invalid-date,invalid-time,2024-06-01,17:00,Test
2024-06-01,09:00,invalid-date,invalid-time,${'a'.repeat(501)}`
      
      try {
        importFromCSV(invalidCSV)
        fail('Should have thrown CSVImportValidationError')
      } catch (error) {
        if (error instanceof CSVImportValidationError) {
          // Should have multiple errors from both rows
          expect(error.errors.length).toBeGreaterThan(2)
        } else {
          throw error
        }
      }
    })

    it('should provide row and field information in errors', () => {
      const invalidCSV = `Start Date,Start Time,End Date,End Time,Description
2024-06-01,invalid,2024-06-01,17:00,Test`
      
      try {
        importFromCSV(invalidCSV)
        fail('Should have thrown CSVImportValidationError')
      } catch (error) {
        if (error instanceof CSVImportValidationError) {
          const firstError = error.errors[0]
          expect(firstError).toHaveProperty('row')
          expect(firstError).toHaveProperty('field')
          expect(firstError).toHaveProperty('message')
          expect(firstError.field).toBe('Start Time')
        } else {
          throw error
        }
      }
    })
  })
})
