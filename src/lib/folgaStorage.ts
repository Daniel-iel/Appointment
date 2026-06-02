import { Folga, FolgaStorageSchema } from '@/lib/types';

const STORAGE_KEY = 'appointment-tracker-folgas-v1';
const SCHEMA_VERSION = 1;

/**
 * Get all folgas from localStorage
 * @returns Array of folgas or empty array if not found
 */
export function getFolgas(): Folga[] {
  try {
    const data = loadFolgas();
    return data;
  } catch (error) {
    console.error('Error getting folgas:', error);
    return [];
  }
}

/**
 * Load and validate folgas from localStorage
 * @returns Array of folgas
 */
export function loadFolgas(): Folga[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return [];
    }

    const schema: FolgaStorageSchema = JSON.parse(stored);

    // Validate schema
    if (!schema || schema.version !== SCHEMA_VERSION) {
      console.warn('Invalid or outdated folga storage schema');
      return [];
    }

    if (!Array.isArray(schema.folgas)) {
      return [];
    }

    // Apply backward compatibility for old folgas without lunch fields
    return schema.folgas.map(folga => ({
      ...folga,
      // If hasLunchBreak is undefined, default to false
      hasLunchBreak: folga.hasLunchBreak ?? undefined,
      // If grossHours is undefined and hasLunchBreak is false, set grossHours to current hours
      grossHours: folga.grossHours ?? (folga.hasLunchBreak ? folga.hours : undefined),
      // If lunchDuration is undefined, default to 1
      lunchDuration: folga.lunchDuration ?? (folga.hasLunchBreak ? 1 : undefined),
    }));
  } catch (error) {
    console.error('Error loading folgas from storage:', error);
    return [];
  }
}

/**
 * Save folgas to localStorage
 * @param folgas - Array of folgas to save
 */
export function saveFolgas(folgas: Folga[]): void {
  if (!folgas || !Array.isArray(folgas)) {
    throw new Error('Invalid folgas data');
  }

  if (typeof window === 'undefined') {
    return;
  }

  try {
    const schema: FolgaStorageSchema = {
      version: SCHEMA_VERSION,
      folgas,
      lastSync: new Date().toISOString(),
    };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(schema));
  } catch (error) {
    console.error('Error saving folgas to storage:', error);
    throw error;
  }
}

/**
 * Clear all stored folgas
 */
export function clearFolgaStorage(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing folga storage:', error);
  }
}
