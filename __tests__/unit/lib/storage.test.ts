import { getAppointments, saveAppointments, clearStorage, loadAppointments } from '@/lib/storage'
import { Appointment, StorageSchema } from '@/lib/types'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('Storage - getAppointments', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should return empty array initially', () => {
    const appointments = getAppointments()
    expect(appointments).toEqual([])
  })

  it('should return saved appointments', () => {
    const testAppointments: Appointment[] = [
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

    saveAppointments(testAppointments)
    const result = getAppointments()

    expect(result).toEqual(testAppointments)
  })
})

describe('Storage - saveAppointments', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should save appointments to localStorage', () => {
    const testAppointments: Appointment[] = [
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

    saveAppointments(testAppointments)

    const stored = localStorage.getItem('appointment_v1_data')
    expect(stored).toBeTruthy()

    const parsed = JSON.parse(stored!)
    expect(parsed.appointments).toEqual(testAppointments)
    expect(parsed.version).toBe(1)
  })

  it('should throw error if invalid data', () => {
    expect(() => saveAppointments(null as any)).toThrow()
    expect(() => saveAppointments(undefined as any)).toThrow()
  })
})

describe('Storage - clearStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should clear all stored data', () => {
    const testAppointments: Appointment[] = [
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

    saveAppointments(testAppointments)
    clearStorage()

    const result = getAppointments()
    expect(result).toEqual([])
  })
})

describe('Storage - loadAppointments', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should load appointments and validate schema', () => {
    const schema: StorageSchema = {
      version: 1,
      appointments: [
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
      ],
      lastSync: new Date().toISOString(),
    }

    localStorage.setItem('appointment_v1_data', JSON.stringify(schema))

    const appointments = loadAppointments()
    expect(appointments).toEqual(schema.appointments)
  })

  it('should return empty array if invalid schema', () => {
    localStorage.setItem('appointment_v1_data', JSON.stringify({ version: 2 }))

    const appointments = loadAppointments()
    expect(appointments).toEqual([])
  })

  it('should handle corrupted data gracefully', () => {
    localStorage.setItem('appointment_v1_data', 'corrupted json')

    const appointments = loadAppointments()
    expect(appointments).toEqual([])
  })
})
