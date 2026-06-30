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

export function useAnalytics(appointments: Appointment[], folgas: Folga[] = []) {
  // Memoize expensive calculations (include folgas optionally)
  const stats = useMemo(() => getOverallStats(appointments, folgas), [appointments, folgas]);
  
  const dailyData = useMemo(() => aggregateByDay(appointments), [appointments]);
  
  const weeklyData = useMemo(() => aggregateByWeek(appointments), [appointments]);
  
  const monthlyData = useMemo(() => aggregateByMonth(appointments), [appointments]);
  
  const timeSeriesData = useMemo(() => getTimeSeriesData(appointments), [appointments]);
  
  const distributionData = useMemo(() => getDistributionByTimeOfDay(appointments), [appointments]);
  
  const heatmapData = useMemo(() => getHeatmapData(appointments), [appointments]);

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
