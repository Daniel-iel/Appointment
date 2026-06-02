import { calcTotalHours, calcCompensationStatus } from '@/lib/calculations'
import { Appointment } from '@/lib/types'

describe('calcTotalHours', () => {
  it('should calculate 8 hours for 09:00 to 17:00', () => {
    const result = calcTotalHours('09:00', '17:00')
    expect(result).toBe(8)
  })

  it('should calculate 8.5 hours for 09:00 to 17:30', () => {
    const result = calcTotalHours('09:00', '17:30')
    expect(result).toBe(8.5)
  })

  it('should calculate 0.5 hours for 09:00 to 09:30', () => {
    const result = calcTotalHours('09:00', '09:30')
    expect(result).toBe(0.5)
  })

  it('should throw error for invalid time format', () => {
    expect(() => calcTotalHours('9:00', '17:00')).toThrow()
    expect(() => calcTotalHours('09:00', '25:00')).toThrow()
    expect(() => calcTotalHours('09:60', '17:00')).toThrow()
  })

  it('should handle times crossing midnight correctly', () => {
    // 23:00 to next day 01:00 = 2 hours
    const result = calcTotalHours('23:00', '01:00')
    expect(result).toBe(2)
  })
})

describe('calcCompensationStatus', () => {
  it('should return correct status for single appointment', () => {
    const appointments: Appointment[] = [
      {
        id: '1',
        startDate: '2024-06-01',
        startTime: '09:00',
        endDate: '2024-06-01',
        endTime: '17:00',
        description: 'Work',
        createdAt: '2024-06-01T09:00:00Z',
        updatedAt: '2024-06-01T09:00:00Z',
      },
    ]

    const status = calcCompensationStatus(appointments)
    expect(status.totalHours).toBe(8)
    expect(status.balance).toBe(0)
  })

  it('should calculate correct balance with multiple appointments', () => {
    const appointments: Appointment[] = [
      {
        id: '1',
        startDate: '2024-06-01',
        startTime: '09:00',
        endDate: '2024-06-01',
        endTime: '17:00', // 8 hours
        description: 'Work',
        createdAt: '2024-06-01T09:00:00Z',
        updatedAt: '2024-06-01T09:00:00Z',
      },
      {
        id: '2',
        startDate: '2024-06-02',
        startTime: '09:00',
        endDate: '2024-06-02',
        endTime: '18:00', // 9 hours
        description: 'Work',
        createdAt: '2024-06-02T09:00:00Z',
        updatedAt: '2024-06-02T09:00:00Z',
      },
    ]

    const status = calcCompensationStatus(appointments)
    expect(status.totalHours).toBe(17)
    expect(status.balance).toBe(1) // 1 hour surplus (17 - 8*2)
  })

  it('should return empty status for empty array', () => {
    const status = calcCompensationStatus([])
    expect(status.totalHours).toBe(0)
    expect(status.balance).toBe(0)
    expect(status.owedHours).toBe(0)
    expect(status.compensatedHours).toBe(0)
  })
})
