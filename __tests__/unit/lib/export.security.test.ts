import { exportToCSV } from '@/lib/export'
import { Appointment } from '@/lib/types'

describe('CSV Export Security', () => {
  const createAppointment = (description: string): Appointment => ({
    id: '123',
    startDate: '2024-06-01',
    startTime: '09:00',
    endDate: '2024-06-01',
    endTime: '17:00',
    description,
    createdAt: '2024-06-01T09:00:00Z',
    updatedAt: '2024-06-01T09:00:00Z',
  })

  describe('Formula Injection Prevention', () => {
    it('should escape formulas starting with =', () => {
      const malicious = createAppointment('=1+1')
      const csv = exportToCSV([malicious])
      
      // Should be prefixed with single quote
      expect(csv).toContain("'=1+1")
      expect(csv).not.toMatch(/^"=1\+1"/)
    })

    it('should escape formulas starting with +', () => {
      const malicious = createAppointment('+1+1')
      const csv = exportToCSV([malicious])
      
      expect(csv).toContain("'+1+1")
    })

    it('should escape formulas starting with -', () => {
      const malicious = createAppointment('-1+1')
      const csv = exportToCSV([malicious])
      
      expect(csv).toContain("'-1+1")
    })

    it('should escape formulas starting with @', () => {
      const malicious = createAppointment('@SUM(1+1)')
      const csv = exportToCSV([malicious])
      
      expect(csv).toContain("'@SUM(1+1)")
    })

    it('should escape formulas starting with tab', () => {
      const malicious = createAppointment('\t=1+1')
      const csv = exportToCSV([malicious])
      
      expect(csv).toContain("'\t=1+1")
    })

    it('should handle complex formula injections', () => {
      const attacks = [
        '=cmd|"/c calc"!A1',
        '=HYPERLINK("http://evil.com","Click")',
        '@SUM(A1:A10)',
        '+cmd|"/c calc"!A1',
        '-2+3+cmd|"/c calc"!A1',
      ]

      attacks.forEach(attack => {
        const malicious = createAppointment(attack)
        const csv = exportToCSV([malicious])
        
        // Should contain the escaped version (single quote prefix inside the quoted field)
        // The CSV will have the field as "'=..."
        expect(csv).toContain(`"'${attack.replace(/"/g, '""')}`)
      })
    })
  })

  describe('Quote Escaping', () => {
    it('should escape double quotes in descriptions', () => {
      const appointment = createAppointment('Test "quoted" text')
      const csv = exportToCSV([appointment])
      
      // Double quotes should be escaped as ""
      expect(csv).toContain('Test ""quoted"" text')
    })

    it('should handle multiple quotes', () => {
      const appointment = createAppointment('He said "hello" and she said "hi"')
      const csv = exportToCSV([appointment])
      
      expect(csv).toContain('He said ""hello"" and she said ""hi""')
    })
  })

  describe('Normal Text Preservation', () => {
    it('should not modify safe descriptions', () => {
      const safe = [
        'Regular work appointment',
        'Meeting with client',
        'Development work 9-5',
        'Project review session',
      ]

      safe.forEach(description => {
        const appointment = createAppointment(description)
        const csv = exportToCSV([appointment])
        
        expect(csv).toContain(description)
      })
    })

    it('should handle numbers safely', () => {
      const appointment = createAppointment('Worked 8 hours')
      const csv = exportToCSV([appointment])
      
      // Should not be escaped because it doesn't start with =
      expect(csv).toContain('Worked 8 hours')
      expect(csv).not.toContain("'Worked 8 hours")
    })
  })

  describe('CSV Structure', () => {
    it('should include all required headers', () => {
      const appointment = createAppointment('Test')
      const csv = exportToCSV([appointment])
      
      expect(csv).toContain('ID')
      expect(csv).toContain('Start Date')
      expect(csv).toContain('Start Time')
      expect(csv).toContain('End Date')
      expect(csv).toContain('End Time')
      expect(csv).toContain('Duration (hours)')
      expect(csv).toContain('Description')
      expect(csv).toContain('Created At')
      expect(csv).toContain('Updated At')
    })

    it('should properly format CSV rows', () => {
      const appointment = createAppointment('Test')
      const csv = exportToCSV([appointment])
      const lines = csv.split('\n')
      
      // Should have header + 1 data row
      expect(lines.length).toBeGreaterThanOrEqual(2)
      
      // Each row should have correct number of fields
      const headerFields = lines[0].split(',')
      expect(headerFields.length).toBe(9)
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty description', () => {
      const appointment = createAppointment('')
      const csv = exportToCSV([appointment])
      
      expect(csv).toContain('""')
    })

    it('should handle special characters', () => {
      const appointment = createAppointment('Test & Co., Inc.')
      const csv = exportToCSV([appointment])
      
      expect(csv).toContain('Test & Co., Inc.')
    })

    it('should handle newlines in description', () => {
      const appointment = createAppointment('Line 1\nLine 2')
      const csv = exportToCSV([appointment])
      
      // Should be properly quoted
      expect(csv).toContain('"')
    })

    it('should handle multiple appointments', () => {
      const appointments = [
        createAppointment('Normal'),
        createAppointment('=Malicious'),
        createAppointment('Another normal'),
      ]
      
      const csv = exportToCSV(appointments)
      const lines = csv.split('\n')
      
      // Header + 3 data rows
      expect(lines.length).toBeGreaterThanOrEqual(4)
      
      // Second appointment should be escaped
      expect(csv).toContain("'=Malicious")
    })
  })
})
