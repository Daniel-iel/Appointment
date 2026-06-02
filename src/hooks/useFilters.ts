import { useState, useMemo } from 'react';
import { Appointment, Folga } from '@/lib/types';
import { PeriodPreset, DateRange, applyFilters } from '@/lib/filters';

export function useFilters(appointments: Appointment[], folgas: Folga[] = []) {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodPreset>('all');
  const [customRange, setCustomRange] = useState<DateRange | undefined>();

  const filteredAppointments = useMemo(() => {
    return applyFilters(appointments, {
      period: selectedPeriod,
      customRange,
    });
  }, [appointments, selectedPeriod, customRange]);

  const filteredFolgas = useMemo(() => {
    // Apply the same filters to folgas
    return applyFilters(folgas as any, {
      period: selectedPeriod,
      customRange,
    }) as unknown as Folga[];
  }, [folgas, selectedPeriod, customRange]);

  const handlePeriodChange = (period: PeriodPreset, range?: DateRange) => {
    setSelectedPeriod(period);
    setCustomRange(range);
  };

  const resetFilters = () => {
    setSelectedPeriod('all');
    setCustomRange(undefined);
  };

  return {
    selectedPeriod,
    customRange,
    filteredAppointments,
    filteredFolgas,
    handlePeriodChange,
    resetFilters,
  };
}
