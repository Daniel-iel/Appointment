import { useMemo } from 'react';
import { Appointment, Folga } from '@/lib/types';
import {
  aggregateByDay,
  aggregateByWeek,
  aggregateByMonth,
  getTimeSeriesData,
  getDistributionByTimeOfDay,
  getHeatmapData,
  getOverallStats,
} from '@/lib/analytics';

/**
 * Combined analytics hook that integrates both appointments and folgas
 * @param appointments - Array of work appointments
 * @param folgas - Array of time-off entries
 * @returns Analytics data with folga integration
 */
export function useCombinedAnalytics(appointments: Appointment[], folgas: Folga[]) {
  // Memoize expensive calculations with folga integration
  const stats = useMemo(
    () => getOverallStats(appointments, folgas),
    [appointments, folgas]
  );
  
  const dailyData = useMemo(
    () => aggregateByDay(appointments),
    [appointments]
  );
  
  const weeklyData = useMemo(
    () => aggregateByWeek(appointments),
    [appointments]
  );
  
  const monthlyData = useMemo(
    () => aggregateByMonth(appointments),
    [appointments]
  );
  
  const timeSeriesData = useMemo(
    () => getTimeSeriesData(appointments),
    [appointments]
  );
  
  const distributionData = useMemo(
    () => getDistributionByTimeOfDay(appointments),
    [appointments]
  );
  
  const heatmapData = useMemo(
    () => getHeatmapData(appointments),
    [appointments]
  );

  return {
    stats,
    dailyData,
    weeklyData,
    monthlyData,
    timeSeriesData,
    distributionData,
    heatmapData,
  };
}
