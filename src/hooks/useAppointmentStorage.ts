import { useState, useCallback, useEffect } from 'react'
import { v4 as uuidv4 } from '@/lib/uuid'
import { Appointment } from '@/lib/types'
import {
  getAppointments,
  saveAppointments,
  addAppointment as addToStorage,
  updateAppointment as updateInStorage,
  deleteAppointment as deleteFromStorage,
} from '@/lib/storage'

/**
 * Custom hook for managing appointments with localStorage persistence
 * @returns Object with appointment state and methods
 */
export function useAppointmentStorage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Initialize appointments from localStorage on mount
  useEffect(() => {
    const stored = getAppointments()
    setAppointments(stored)
    setIsLoaded(true)
  }, [])

  /**
   * Get all appointments
   */
  const getAll = useCallback((): Appointment[] => {
    return appointments
  }, [appointments])

  /**
   * Add a new appointment
   */
  const add = useCallback(
    (appointmentOrStartDate: Appointment | string, startTime?: string, endDate?: string, endTime?: string, description?: string): Appointment => {
      let appointment: Appointment
      
      // Handle both object and parameter forms
      if (typeof appointmentOrStartDate === 'object') {
        appointment = appointmentOrStartDate as Appointment
      } else {
        const now = new Date().toISOString()
        appointment = {
          id: uuidv4(),
          startDate: appointmentOrStartDate,
          startTime: startTime || '',
          endDate: endDate || '',
          endTime: endTime || '',
          description: description || '',
          createdAt: now,
          updatedAt: now,
        }
      }

      setAppointments((prev) => {
        const updated = [...prev, appointment]
        saveAppointments(updated)
        return updated
      })

      return appointment
    },
    []
  )

  /**
   * Update an existing appointment
   */
  const update = useCallback(
    (appointment: Appointment): void => {
      const updated = appointment
      updated.updatedAt = new Date().toISOString()

      const newAppointments = appointments.map(apt => (apt.id === appointment.id ? updated : apt))
      setAppointments(newAppointments)
      saveAppointments(newAppointments)
    },
    [appointments]
  )

  /**
   * Delete an appointment by ID
   */
  const remove = useCallback(
    (appointmentId: string): void => {
      const filtered = appointments.filter(apt => apt.id !== appointmentId)
      setAppointments(filtered)
      saveAppointments(filtered)
    },
    [appointments]
  )

  return {
    appointments,
    isLoaded,
    getAll,
    add,
    update,
    delete: remove,
  }
}
