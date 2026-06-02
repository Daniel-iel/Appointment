/**
 * Core types for the Appointment application
 */

export interface Appointment {
  id: string; // UUID
  startDate: string; // ISO 8601 (YYYY-MM-DD)
  startTime: string; // HH:mm (24-hour format)
  endDate: string; // ISO 8601 (YYYY-MM-DD)
  endTime: string; // HH:mm (24-hour format)
  description: string; // Max 500 chars
  createdAt: string; // ISO 8601 timestamp
  updatedAt: string; // ISO 8601 timestamp
}

export interface StorageSchema {
  version: 1;
  appointments: Appointment[];
  lastSync: string; // ISO 8601 timestamp
}

export interface CompensationStatus {
  totalHours: number; // Total hours worked
  owedHours: number; // Negative (hours to compensate)
  compensatedHours: number; // Positive (surplus hours)
  balance: number; // owedHours + compensatedHours (negative = owing, positive = surplus)
}

export interface ValidationError {
  field: string;
  message: string;
  type: 'time_format' | 'date_format' | 'time_range' | 'xss' | 'empty' | 'other';
}

/**
 * Folga (Time-off) types
 */
export interface Folga {
  id: string; // UUID
  startDate: string; // ISO 8601 (YYYY-MM-DD)
  startTime: string; // HH:mm (24-hour format)
  endDate: string; // ISO 8601 (YYYY-MM-DD)
  endTime: string; // HH:mm (24-hour format)
  description: string; // Max 500 chars
  hours: number; // Net duration in hours (after lunch deduction if applicable)
  grossHours?: number; // Original hours before lunch deduction
  hasLunchBreak?: boolean; // Whether lunch break is deducted
  lunchDuration?: number; // Lunch duration in hours (0.5, 1, 1.5)
  createdAt: string; // ISO 8601 timestamp
  updatedAt: string; // ISO 8601 timestamp
}

export interface FolgaStorageSchema {
  version: 1;
  folgas: Folga[];
  lastSync: string; // ISO 8601 timestamp
}

export interface FolgaInput {
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  description: string;
  hasLunchBreak?: boolean;
  lunchDuration?: number;
}
