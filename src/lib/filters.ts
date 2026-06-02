import { Appointment } from './types';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays, parseISO, isWithinInterval } from 'date-fns';

export type PeriodPreset = 'today' | 'this-week' | 'this-month' | 'last-7-days' | 'last-30-days' | 'custom' | 'all';

export interface DateRange {
  start: Date;
  end: Date;
}

export interface PeriodOption {
  value: PeriodPreset;
  label: string;
  getRange: () => DateRange;
}

/**
 * Get all available period presets
 */
export function getPeriodPresets(): PeriodOption[] {
  const now = new Date();

  return [
    {
      value: 'all',
      label: 'All Time',
      getRange: () => ({
        start: new Date(0), // Unix epoch
        end: new Date(2099, 11, 31), // Far future
      }),
    },
    {
      value: 'today',
      label: 'Today',
      getRange: () => ({
        start: startOfDay(now),
        end: endOfDay(now),
      }),
    },
    {
      value: 'this-week',
      label: 'This Week',
      getRange: () => ({
        start: startOfWeek(now, { weekStartsOn: 1 }), // Monday
        end: endOfWeek(now, { weekStartsOn: 1 }),
      }),
    },
    {
      value: 'this-month',
      label: 'This Month',
      getRange: () => ({
        start: startOfMonth(now),
        end: endOfMonth(now),
      }),
    },
    {
      value: 'last-7-days',
      label: 'Last 7 Days',
      getRange: () => ({
        start: startOfDay(subDays(now, 6)),
        end: endOfDay(now),
      }),
    },
    {
      value: 'last-30-days',
      label: 'Last 30 Days',
      getRange: () => ({
        start: startOfDay(subDays(now, 29)),
        end: endOfDay(now),
      }),
    },
    {
      value: 'custom',
      label: 'Custom Range',
      getRange: () => ({
        start: startOfMonth(now),
        end: endOfMonth(now),
      }),
    },
  ];
}

/**
 * Get date range for a specific preset
 */
export function getDateRangeForPreset(preset: PeriodPreset): DateRange {
  const option = getPeriodPresets().find((p) => p.value === preset);
  if (!option) {
    throw new Error(`Invalid period preset: ${preset}`);
  }
  return option.getRange();
}

/**
 * Filter appointments by date range
 */
export function filterByDateRange(appointments: Appointment[], range: DateRange): Appointment[] {
  return appointments.filter((apt) => {
    try {
      const aptDate = parseISO(apt.startDate);
      return isWithinInterval(aptDate, {
        start: startOfDay(range.start),
        end: endOfDay(range.end),
      });
    } catch {
      return false; // Invalid date, exclude
    }
  });
}

/**
 * Filter appointments by period preset
 */
export function filterByPeriod(appointments: Appointment[], preset: PeriodPreset): Appointment[] {
  if (preset === 'all') {
    return appointments;
  }
  
  const range = getDateRangeForPreset(preset);
  return filterByDateRange(appointments, range);
}

/**
 * Apply multiple filters to appointments
 */
export interface FilterOptions {
  period?: PeriodPreset;
  customRange?: DateRange;
  searchText?: string;
}

export function applyFilters(appointments: Appointment[], options: FilterOptions): Appointment[] {
  let filtered = [...appointments];

  // Apply period/range filter
  if (options.period === 'custom' && options.customRange) {
    filtered = filterByDateRange(filtered, options.customRange);
  } else if (options.period) {
    filtered = filterByPeriod(filtered, options.period);
  }

  // Apply search filter (description)
  if (options.searchText && options.searchText.trim()) {
    const searchLower = options.searchText.toLowerCase().trim();
    filtered = filtered.filter((apt) =>
      apt.description.toLowerCase().includes(searchLower)
    );
  }

  return filtered;
}

/**
 * Get label for current filter state
 */
export function getFilterLabel(options: FilterOptions): string {
  if (options.period === 'custom' && options.customRange) {
    return `Custom: ${options.customRange.start.toLocaleDateString()} - ${options.customRange.end.toLocaleDateString()}`;
  }
  
  if (options.period) {
    const preset = getPeriodPresets().find((p) => p.value === options.period);
    return preset?.label || 'All Time';
  }

  return 'All Time';
}
