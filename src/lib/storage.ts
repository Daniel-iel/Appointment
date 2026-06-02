import { Appointment, StorageSchema } from '@/lib/types'

const STORAGE_KEY = 'appointment_v1_data'
const SCHEMA_VERSION = 1

/**
 * Get all appointments from localStorage
 * @returns Array of appointments or empty array if not found
 */
export function getAppointments(): Appointment[] {
  try {
    const data = loadAppointments()
    return data
  } catch (error) {
    console.error('Error getting appointments:', error)
    return []
  }
}

/**
 * Load and validate appointments from localStorage
 * @returns Array of appointments
 */
export function loadAppointments(): Appointment[] {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)

    if (!stored) {
      return []
    }

    const schema: StorageSchema = JSON.parse(stored)

    // Validate schema
    if (!schema || schema.version !== SCHEMA_VERSION) {
      console.warn('Invalid or outdated storage schema')
      return []
    }

    if (!Array.isArray(schema.appointments)) {
      return []
    }

    return schema.appointments
  } catch (error) {
    console.error('Error loading appointments from storage:', error)
    return []
  }
}

/**
 * Save appointments to localStorage
 * @param appointments - Array of appointments to save
 */
export function saveAppointments(appointments: Appointment[]): void {
  if (!appointments || !Array.isArray(appointments)) {
    throw new Error('Invalid appointments data')
  }

  if (typeof window === 'undefined') {
    return
  }

  try {
    const schema: StorageSchema = {
      version: SCHEMA_VERSION,
      appointments,
      lastSync: new Date().toISOString(),
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(schema))
  } catch (error) {
    console.error('Error saving appointments to storage:', error)
    throw error
  }
}

/**
 * Clear all stored appointments
 */
export function clearStorage(): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Error clearing storage:', error)
  }
}

/**
 * Add a single appointment to storage
 * @param appointment - Appointment to add
 */
export function addAppointment(appointment: Appointment): void {
  const current = getAppointments()
  current.push(appointment)
  saveAppointments(current)
}

/**
 * Update a single appointment in storage
 * @param appointment - Updated appointment
 */
export function updateAppointment(appointment: Appointment): void {
  const current = getAppointments()
  const index = current.findIndex(apt => apt.id === appointment.id)

  if (index === -1) {
    throw new Error(`Appointment with id ${appointment.id} not found`)
  }

  current[index] = appointment
  saveAppointments(current)
}

/**
 * Delete a single appointment from storage
 * @param appointmentId - ID of appointment to delete
 */
export function deleteAppointment(appointmentId: string): void {
  const current = getAppointments()
  const filtered = current.filter(apt => apt.id !== appointmentId)
  saveAppointments(filtered)
}
