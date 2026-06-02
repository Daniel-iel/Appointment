import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from '@/lib/uuid';
import { Folga, FolgaInput } from '@/lib/types';
import { getFolgas, saveFolgas } from '@/lib/folgaStorage';
import { calcTotalHours, applyLunchDeduction } from '@/lib/calculations';

/**
 * Custom hook for managing folgas (time-off) with localStorage persistence
 * @returns Object with folga state and methods
 */
export function useFolgaStorage() {
  const [folgas, setFolgas] = useState<Folga[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize folgas from localStorage on mount
  useEffect(() => {
    const stored = getFolgas();
    setFolgas(stored);
    setIsLoaded(true);
  }, []);

  /**
   * Get all folgas
   */
  const getAll = useCallback((): Folga[] => {
    return folgas;
  }, [folgas]);

  /**
   * Add a new folga
   */
  const add = useCallback(
    (
      startDate: string,
      startTime: string,
      endDate: string,
      endTime: string,
      description: string,
      hasLunchBreak: boolean = false,
      lunchDuration: number = 1
    ): Folga => {
      const now = new Date().toISOString();
      
      // Calculate gross hours for the folga
      const grossHours = calcTotalHours(startDate, startTime, endDate, endTime);
      
      // Apply lunch deduction if applicable
      const netHours = applyLunchDeduction(grossHours, hasLunchBreak, lunchDuration);
      
      const folga: Folga = {
        id: uuidv4(),
        startDate,
        startTime,
        endDate,
        endTime,
        description,
        hours: netHours,
        grossHours: hasLunchBreak ? grossHours : undefined,
        hasLunchBreak: hasLunchBreak || undefined,
        lunchDuration: hasLunchBreak ? lunchDuration : undefined,
        createdAt: now,
        updatedAt: now,
      };

      setFolgas((prev) => {
        const updated = [...prev, folga];
        saveFolgas(updated);
        return updated;
      });

      return folga;
    },
    []
  );

  /**
   * Update an existing folga
   */
  const update = useCallback(
    (folga: Folga): void => {
      // Recalculate gross hours
      const grossHours = calcTotalHours(folga.startDate, folga.startTime, folga.endDate, folga.endTime);
      
      // Apply lunch deduction if applicable
      const netHours = applyLunchDeduction(
        grossHours,
        folga.hasLunchBreak || false,
        folga.lunchDuration || 1
      );
      
      const updated = {
        ...folga,
        hours: netHours,
        grossHours: folga.hasLunchBreak ? grossHours : undefined,
        updatedAt: new Date().toISOString(),
      };

      const newFolgas = folgas.map(f => (f.id === folga.id ? updated : f));
      setFolgas(newFolgas);
      saveFolgas(newFolgas);
    },
    [folgas]
  );

  /**
   * Delete a folga by ID
   */
  const remove = useCallback(
    (folgaId: string): void => {
      const filtered = folgas.filter(f => f.id !== folgaId);
      setFolgas(filtered);
      saveFolgas(filtered);
    },
    [folgas]
  );

  return {
    folgas,
    isLoaded,
    getAll,
    add,
    update,
    delete: remove,
  };
}
