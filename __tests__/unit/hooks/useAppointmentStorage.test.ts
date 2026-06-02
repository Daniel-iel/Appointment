import { renderHook, act } from '@testing-library/react'
import { useAppointmentStorage } from '@/hooks/useAppointmentStorage'
import { Appointment } from '@/lib/types'

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

describe('useAppointmentStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should initialize with empty appointments', () => {
    const { result } = renderHook(() => useAppointmentStorage())

    expect(result.current.appointments).toEqual([])
  })

  it('should add new appointment', () => {
    const { result } = renderHook(() => useAppointmentStorage())

    const newAppointment = {
      id: '1',
      startDate: '2024-06-01',
      startTime: '09:00',
      endDate: '2024-06-01',
      endTime: '17:00',
      description: 'Work',
      createdAt: '2024-06-01T09:00:00Z',
      updatedAt: '2024-06-01T09:00:00Z',
    }

    act(() => {
      result.current.add(newAppointment)
    })

    expect(result.current.appointments).toHaveLength(1)
    expect(result.current.appointments[0]).toEqual(newAppointment)
  })

  it('should update existing appointment', () => {
    const { result } = renderHook(() => useAppointmentStorage())

    const appointment: Appointment = {
      id: '1',
      startDate: '2024-06-01',
      startTime: '09:00',
      endDate: '2024-06-01',
      endTime: '17:00',
      description: 'Work',
      createdAt: '2024-06-01T09:00:00Z',
      updatedAt: '2024-06-01T09:00:00Z',
    }

    act(() => {
      result.current.add(appointment)
    })

    const updated = { ...appointment, description: 'Updated Work' }

    act(() => {
      result.current.update(updated)
    })

    expect(result.current.appointments[0].description).toBe('Updated Work')
  })

  it('should delete appointment', () => {
    const { result } = renderHook(() => useAppointmentStorage())

    const appointment: Appointment = {
      id: '1',
      startDate: '2024-06-01',
      startTime: '09:00',
      endDate: '2024-06-01',
      endTime: '17:00',
      description: 'Work',
      createdAt: '2024-06-01T09:00:00Z',
      updatedAt: '2024-06-01T09:00:00Z',
    }

    act(() => {
      result.current.add(appointment)
    })

    expect(result.current.appointments).toHaveLength(1)

    act(() => {
      result.current.delete('1')
    })

    expect(result.current.appointments).toHaveLength(0)
  })

  it('should persist data to localStorage', () => {
    const { result } = renderHook(() => useAppointmentStorage())

    const appointment: Appointment = {
      id: '1',
      startDate: '2024-06-01',
      startTime: '09:00',
      endDate: '2024-06-01',
      endTime: '17:00',
      description: 'Work',
      createdAt: '2024-06-01T09:00:00Z',
      updatedAt: '2024-06-01T09:00:00Z',
    }

    act(() => {
      result.current.add(appointment)
    })

    const stored = localStorage.getItem('appointment_v1_data')
    expect(stored).toBeTruthy()

    const parsed = JSON.parse(stored!)
    expect(parsed.appointments).toHaveLength(1)
  })

  it('should return all appointments', () => {
    const { result } = renderHook(() => useAppointmentStorage())

    const appointments: Appointment[] = [
      {
        id: '1',
        startDate: '2024-06-01',
        startTime: '09:00',
        endDate: '2024-06-01',
        endTime: '17:00',
        description: 'Work 1',
        createdAt: '2024-06-01T09:00:00Z',
        updatedAt: '2024-06-01T09:00:00Z',
      },
      {
        id: '2',
        startDate: '2024-06-02',
        startTime: '09:00',
        endDate: '2024-06-02',
        endTime: '18:00',
        description: 'Work 2',
        createdAt: '2024-06-02T09:00:00Z',
        updatedAt: '2024-06-02T09:00:00Z',
      },
    ]

    act(() => {
      appointments.forEach(apt => result.current.add(apt))
    })

    const all = result.current.getAll()
    expect(all).toHaveLength(2)
  })
})
