import { Appointment, Folga } from './types';
import { calcTotalHours } from './calculations';
import { startOfDay, startOfWeek, startOfMonth, format, parseISO, differenceInDays } from 'date-fns';

export interface DailyData {
  date: string; // YYYY-MM-DD
  hours: number;
  appointments: number;
  balance: number; // hours - 8
}

export interface WeeklyData {
  weekStart: string; // ISO date of week start
  weekLabel: string; // e.g., "Week 22, 2026"
  hours: number;
  appointments: number;
  expectedHours: number;
  balance: number;
}

export interface MonthlyData {
  month: string; // YYYY-MM
  monthLabel: string; // e.g., "June 2026"
  hours: number;
  appointments: number;
  expectedHours: number;
  balance: number;
  averagePerDay: number;
}

export interface TimeSeriesPoint {
  date: string;
  hours: number;
  balance: number;
  cumulativeBalance: number;
}

export interface DistributionData {
  name: string;
  value: number;
  percentage: number;
}

export interface HeatmapCell {
  date: string;
  hours: number;
  intensity: number; // 0-1 scale
}

/**
 * Aggregate appointments by day
 */
export function aggregateByDay(appointments: Appointment[]): DailyData[] {
  const dailyMap = new Map<string, DailyData>();

  appointments.forEach((apt) => {
    const date = apt.startDate;
    
    if (!dailyMap.has(date)) {
      dailyMap.set(date, {
        date,
        hours: 0,
        appointments: 0,
        balance: 0,
      });
    }

    const data = dailyMap.get(date)!;
    const hours = calcTotalHours(apt.startTime, apt.endTime);
    data.hours += hours;
    data.appointments += 1;
    data.balance = data.hours - 8; // 8-hour standard
  });

  return Array.from(dailyMap.values()).sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Aggregate appointments by week (ISO week)
 */
export function aggregateByWeek(appointments: Appointment[]): WeeklyData[] {
  const weeklyMap = new Map<string, WeeklyData>();

  appointments.forEach((apt) => {
    const date = parseISO(apt.startDate);
    const weekStart = startOfWeek(date, { weekStartsOn: 1 }); // Monday
    const weekKey = format(weekStart, 'yyyy-MM-dd');
    
    if (!weeklyMap.has(weekKey)) {
      const weekNumber = Math.ceil(differenceInDays(weekStart, startOfMonth(weekStart)) / 7) + 1;
      weeklyMap.set(weekKey, {
        weekStart: weekKey,
        weekLabel: `Week ${weekNumber}, ${format(weekStart, 'yyyy')}`,
        hours: 0,
        appointments: 0,
        expectedHours: 0,
        balance: 0,
      });
    }

    const data = weeklyMap.get(weekKey)!;
    const hours = calcTotalHours(apt.startTime, apt.endTime);
    data.hours += hours;
    data.appointments += 1;
  });

  // Calculate expected hours and balance
  weeklyMap.forEach((data) => {
    data.expectedHours = data.appointments * 8;
    data.balance = data.hours - data.expectedHours;
  });

  return Array.from(weeklyMap.values()).sort((a, b) => a.weekStart.localeCompare(b.weekStart));
}

/**
 * Aggregate appointments by month
 */
export function aggregateByMonth(appointments: Appointment[]): MonthlyData[] {
  const monthlyMap = new Map<string, MonthlyData>();

  appointments.forEach((apt) => {
    const date = parseISO(apt.startDate);
    const monthStart = startOfMonth(date);
    const monthKey = format(monthStart, 'yyyy-MM');
    
    if (!monthlyMap.has(monthKey)) {
      monthlyMap.set(monthKey, {
        month: monthKey,
        monthLabel: format(monthStart, 'MMMM yyyy'),
        hours: 0,
        appointments: 0,
        expectedHours: 0,
        balance: 0,
        averagePerDay: 0,
      });
    }

    const data = monthlyMap.get(monthKey)!;
    const hours = calcTotalHours(apt.startTime, apt.endTime);
    data.hours += hours;
    data.appointments += 1;
  });

  // Calculate expected hours, balance, and average
  monthlyMap.forEach((data) => {
    data.expectedHours = data.appointments * 8;
    data.balance = data.hours - data.expectedHours;
    data.averagePerDay = data.appointments > 0 ? data.hours / data.appointments : 0;
  });

  return Array.from(monthlyMap.values()).sort((a, b) => a.month.localeCompare(b.month));
}

/**
 * Get time series data for line charts (chronological points)
 */
export function getTimeSeriesData(appointments: Appointment[]): TimeSeriesPoint[] {
  const dailyData = aggregateByDay(appointments);
  let cumulativeBalance = 0;

  return dailyData.map((day) => {
    cumulativeBalance += day.balance;
    return {
      date: day.date,
      hours: day.hours,
      balance: day.balance,
      cumulativeBalance,
    };
  });
}

/**
 * Get distribution data by time of day (morning, afternoon, evening, night)
 */
export function getDistributionByTimeOfDay(appointments: Appointment[]): DistributionData[] {
  const distribution = {
    morning: 0,    // 06:00 - 11:59
    afternoon: 0,  // 12:00 - 17:59
    evening: 0,    // 18:00 - 21:59
    night: 0,      // 22:00 - 05:59
  };

  appointments.forEach((apt) => {
    const hours = calcTotalHours(apt.startTime, apt.endTime);
    const startHour = parseInt(apt.startTime.split(':')[0], 10);

    if (startHour >= 6 && startHour < 12) {
      distribution.morning += hours;
    } else if (startHour >= 12 && startHour < 18) {
      distribution.afternoon += hours;
    } else if (startHour >= 18 && startHour < 22) {
      distribution.evening += hours;
    } else {
      distribution.night += hours;
    }
  });

  const total = Object.values(distribution).reduce((sum, val) => sum + val, 0);

  return Object.entries(distribution)
    .map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: Math.round(value * 100) / 100,
      percentage: total > 0 ? Math.round((value / total) * 100) : 0,
    }))
    .filter((item) => item.value > 0);
}

/**
 * Get heatmap data (calendar view with intensity)
 */
export function getHeatmapData(appointments: Appointment[]): HeatmapCell[] {
  const dailyData = aggregateByDay(appointments);
  const maxHours = Math.max(...dailyData.map((d) => d.hours), 8); // At least 8 for scale

  return dailyData.map((day) => ({
    date: day.date,
    hours: day.hours,
    intensity: maxHours > 0 ? day.hours / maxHours : 0,
  }));
}

/**
 * Calculate overall statistics
 */
export function getOverallStats(appointments: Appointment[], folgas: Folga[] = []) {
  const totalHours = appointments.reduce((sum, apt) => {
    try {
      return sum + calcTotalHours(apt.startTime, apt.endTime);
    } catch {
      return sum;
    }
  }, 0);

  const totalFolgaHours = folgas.reduce((sum, folga) => sum + folga.hours, 0);

  const expectedHours = appointments.length * 8;
  // Balance is defined as: sum(Entries) - sum(Time-Off)
  const balance = totalHours - totalFolgaHours;
  const averagePerAppointment = appointments.length > 0 ? totalHours / appointments.length : 0;

  const uniqueDates = new Set(appointments.map((apt) => apt.startDate));
  const uniqueDays = uniqueDates.size;
  const averagePerDay = uniqueDays > 0 ? totalHours / uniqueDays : 0;

  return {
    totalAppointments: appointments.length,
    totalHours: Math.round(totalHours * 100) / 100,
    totalFolgaHours: Math.round(totalFolgaHours * 100) / 100,
    expectedHours: Math.round(expectedHours * 100) / 100,
    balance: Math.round(balance * 100) / 100,
    averagePerAppointment: Math.round(averagePerAppointment * 100) / 100,
    uniqueDays,
    averagePerDay: Math.round(averagePerDay * 100) / 100,
  };
}
