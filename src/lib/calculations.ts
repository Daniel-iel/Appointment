import { Appointment, CompensationStatus, Folga } from '@/lib/types'
import { differenceInMinutes, parse } from 'date-fns'

/**
 * Calculate total hours between two times (same day or crossing midnight)
 * @param startTime - Time in HH:mm format
 * @param endTime - Time in HH:mm format
 * @returns Total hours as a decimal (e.g., 8.5 for 8 hours 30 minutes)
 */
export function calcTotalHours(startTime: string, endTime: string): number;
/**
 * Calculate total hours between two date-times (supports multi-day spans)
 * @param startDate - Date in YYYY-MM-DD format
 * @param startTime - Time in HH:mm format
 * @param endDate - Date in YYYY-MM-DD format
 * @param endTime - Time in HH:mm format
 * @returns Total hours as a decimal
 */
export function calcTotalHours(startDate: string, startTime: string, endDate: string, endTime: string): number;
export function calcTotalHours(startDateOrTime: string, endTimeOrStartTime: string, endDate?: string, endTime?: string): number {
  // Two-parameter version: same day or midnight crossing
  if (endDate === undefined && endTime === undefined) {
    const startTime = startDateOrTime;
    const endTimeStr = endTimeOrStartTime;
    
    const timeRegex = /^([01][0-9]|2[0-3]):[0-5][0-9]$/;

    if (!timeRegex.test(startTime) || !timeRegex.test(endTimeStr)) {
      throw new Error(`Invalid time format. Expected HH:mm (24-hour format). Got: ${startTime}, ${endTimeStr}`);
    }

    const baseDate = '2024-01-01';
    const start = parse(`${baseDate} ${startTime}`, 'yyyy-MM-dd HH:mm', new Date());
    let end = parse(`${baseDate} ${endTimeStr}`, 'yyyy-MM-dd HH:mm', new Date());

    // Handle times crossing midnight
    if (end < start) {
      const nextDate = '2024-01-02';
      end = parse(`${nextDate} ${endTimeStr}`, 'yyyy-MM-dd HH:mm', new Date());
    }

    const diffMinutes = differenceInMinutes(end, start);
    return diffMinutes / 60;
  }
  
  // Four-parameter version: multi-day support
  const startDate = startDateOrTime;
  const startTime = endTimeOrStartTime;
  
  const start = parse(`${startDate} ${startTime}`, 'yyyy-MM-dd HH:mm', new Date());
  const end = parse(`${endDate} ${endTime}`, 'yyyy-MM-dd HH:mm', new Date());

  if (end < start) {
    throw new Error('End date-time must be after start date-time');
  }

  const diffMinutes = differenceInMinutes(end, start);
  return diffMinutes / 60;
}

/**
 * Calculate compensation status from all appointments and folgas
 * Assumes 8 hours per day as the standard working day
 * @param appointments - Array of appointments
 * @param folgas - Optional array of folgas (time-off)
 * @returns CompensationStatus with totals and balance
 */
export function calcCompensationStatus(appointments: Appointment[], folgas: Folga[] = []): CompensationStatus {
  // Sum worked hours (safe against invalid entries)
  const totalHours = (appointments || []).reduce((sum, apt) => {
    try {
      const hours = calcTotalHours(apt.startTime, apt.endTime);
      return sum + hours;
    } catch {
      return sum;
    }
  }, 0);

  // Sum folga (time-off) hours
  const totalFolgaHours = (folgas || []).reduce((sum, folga) => sum + folga.hours, 0);

  // Balance definition: sum(Entries) - sum(TimeOff)
  const balance = totalHours - totalFolgaHours;
  const owedHours = balance < 0 ? balance : 0;
  const compensatedHours = balance > 0 ? balance : 0;

  return {
    totalHours: Math.round(totalHours * 100) / 100,
    owedHours: Math.round(owedHours * 100) / 100,
    compensatedHours: Math.round(compensatedHours * 100) / 100,
    balance: Math.round(balance * 100) / 100,
  };
}

/**
 * Apply lunch break deduction to gross hours
 * Only applies if gross hours >= 8 and hasLunchBreak is true
 * @param grossHours - Original calculated hours
 * @param hasLunchBreak - Whether to deduct lunch
 * @param lunchDuration - Lunch duration in hours (default 1)
 * @returns Net hours after lunch deduction
 */
export function applyLunchDeduction(
  grossHours: number,
  hasLunchBreak: boolean = false,
  lunchDuration: number = 1
): number {
  // Only apply lunch deduction for full-day folgas (>= 8 hours)
  if (grossHours >= 8 && hasLunchBreak && lunchDuration > 0) {
    return Math.max(0, grossHours - lunchDuration);
  }
  return grossHours;
}
