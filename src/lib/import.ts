import { Appointment, Folga } from './types';
import { generateUUID } from './uuid';
import { validateTimeFormat, validateDateFormat } from '@/utils/validators';

export interface CSVImportResult {
  type: 'appointment' | 'folga';
  data: Appointment[] | Folga[];
  count: number;
}

export interface ImportError {
  row: number;
  field: string;
  message: string;
}

export class CSVImportValidationError extends Error {
  constructor(public errors: ImportError[]) {
    super(`CSV validation failed with ${errors.length} error(s)`);
    this.name = 'CSVImportValidationError';
  }
}

/**
 * Parse CSV content into rows and columns
 */
function parseCSV(content: string): string[][] {
  const lines = content.trim().split(/\r?\n/);
  const result: string[][] = [];

  for (const line of lines) {
    const row: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];

      if (char === '"' && inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"';
        i++; // Skip next quote
      } else if (char === '"') {
        // Toggle quote state
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        // End of field
        row.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }

    // Add last field
    row.push(current.trim());
    result.push(row);
  }

  return result;
}

/**
 * Detect CSV type based on headers
 */
export function detectCSVType(headers: string[]): 'appointment' | 'folga' {
  const normalizedHeaders = headers.map(h => h.toLowerCase().trim());
  
  // Folga-specific headers
  const folgaIndicators = [
    'lunch duration',
    'lunch break',
    'has lunch break',
    'gross hours',
    'net hours'
  ];

  const hasFolgaIndicator = folgaIndicators.some(indicator =>
    normalizedHeaders.some(h => h.includes(indicator))
  );

  return hasFolgaIndicator ? 'folga' : 'appointment';
}

/**
 * Validate and parse appointment row
 */
function validateAppointmentRow(
  row: string[],
  headers: string[],
  rowIndex: number
): Appointment {
  const errors: ImportError[] = [];
  
  // Create a map of header -> value
  const data: Record<string, string> = {};
  headers.forEach((header, index) => {
    data[header.toLowerCase().trim()] = row[index] || '';
  });

  // Extract fields (ignore ID from CSV, we'll generate new ones)
  const startDate = data['start date'] || '';
  const startTime = data['start time'] || '';
  const endDate = data['end date'] || '';
  const endTime = data['end time'] || '';
  const description = data['description'] || '';

  // Validate start date
  try {
    validateDateFormat(startDate);
  } catch (error) {
    errors.push({
      row: rowIndex,
      field: 'Start Date',
      message: error instanceof Error ? error.message : 'Invalid date format'
    });
  }

  // Validate start time
  try {
    validateTimeFormat(startTime);
  } catch (error) {
    errors.push({
      row: rowIndex,
      field: 'Start Time',
      message: error instanceof Error ? error.message : 'Invalid time format'
    });
  }

  // Validate end date
  try {
    validateDateFormat(endDate);
  } catch (error) {
    errors.push({
      row: rowIndex,
      field: 'End Date',
      message: error instanceof Error ? error.message : 'Invalid date format'
    });
  }

  // Validate end time
  try {
    validateTimeFormat(endTime);
  } catch (error) {
    errors.push({
      row: rowIndex,
      field: 'End Time',
      message: error instanceof Error ? error.message : 'Invalid time format'
    });
  }

  // Validate description length
  if (description.length > 500) {
    errors.push({
      row: rowIndex,
      field: 'Description',
      message: `Description exceeds 500 characters (${description.length} chars)`
    });
  }

  if (errors.length > 0) {
    throw new CSVImportValidationError(errors);
  }

  const now = new Date().toISOString();
  return {
    id: generateUUID(),
    startDate,
    startTime,
    endDate,
    endTime,
    description,
    createdAt: now,
    updatedAt: now
  };
}

/**
 * Validate and parse folga row
 */
function validateFolgaRow(
  row: string[],
  headers: string[],
  rowIndex: number
): Folga {
  const errors: ImportError[] = [];
  
  // Create a map of header -> value
  const data: Record<string, string> = {};
  headers.forEach((header, index) => {
    data[header.toLowerCase().trim()] = row[index] || '';
  });

  // Extract fields
  const startDate = data['start date'] || '';
  const startTime = data['start time'] || '';
  const endDate = data['end date'] || '';
  const endTime = data['end time'] || '';
  const description = data['description'] || '';
  const hasLunchBreakStr = data['has lunch break'] || data['lunch break'] || '';
  const lunchDurationStr = data['lunch duration'] || '';
  const hoursStr = data['hours'] || data['net hours'] || '';
  const grossHoursStr = data['gross hours'] || '';

  // Validate dates and times (same as appointments)
  try {
    validateDateFormat(startDate);
  } catch (error) {
    errors.push({
      row: rowIndex,
      field: 'Start Date',
      message: error instanceof Error ? error.message : 'Invalid date format'
    });
  }

  try {
    validateTimeFormat(startTime);
  } catch (error) {
    errors.push({
      row: rowIndex,
      field: 'Start Time',
      message: error instanceof Error ? error.message : 'Invalid time format'
    });
  }

  try {
    validateDateFormat(endDate);
  } catch (error) {
    errors.push({
      row: rowIndex,
      field: 'End Date',
      message: error instanceof Error ? error.message : 'Invalid date format'
    });
  }

  try {
    validateTimeFormat(endTime);
  } catch (error) {
    errors.push({
      row: rowIndex,
      field: 'End Time',
      message: error instanceof Error ? error.message : 'Invalid time format'
    });
  }

  // Validate description
  if (description.length > 500) {
    errors.push({
      row: rowIndex,
      field: 'Description',
      message: `Description exceeds 500 characters (${description.length} chars)`
    });
  }

  // Parse hours
  const hours = parseFloat(hoursStr);
  if (isNaN(hours) || hours < 0) {
    errors.push({
      row: rowIndex,
      field: 'Hours',
      message: 'Hours must be a valid positive number'
    });
  }

  if (errors.length > 0) {
    throw new CSVImportValidationError(errors);
  }

  // Parse optional fields
  const hasLunchBreak = hasLunchBreakStr.toLowerCase() === 'true' || hasLunchBreakStr === '1';
  const lunchDuration = lunchDurationStr ? parseFloat(lunchDurationStr) : undefined;
  const grossHours = grossHoursStr ? parseFloat(grossHoursStr) : undefined;

  const now = new Date().toISOString();
  return {
    id: generateUUID(),
    startDate,
    startTime,
    endDate,
    endTime,
    description,
    hours,
    grossHours,
    hasLunchBreak,
    lunchDuration,
    createdAt: now,
    updatedAt: now
  };
}

/**
 * Import data from CSV content
 * Throws CSVImportValidationError if any row is invalid
 */
export function importFromCSV(content: string): CSVImportResult {
  if (!content || content.trim() === '') {
    throw new Error('CSV content is empty');
  }

  const rows = parseCSV(content);
  
  if (rows.length < 2) {
    throw new Error('CSV must contain at least a header row and one data row');
  }

  const headers = rows[0];
  const dataRows = rows.slice(1);

  // Detect type
  const type = detectCSVType(headers);

  // Validate all rows first (strict validation)
  const allErrors: ImportError[] = [];
  const validatedData: (Appointment | Folga)[] = [];

  for (let i = 0; i < dataRows.length; i++) {
    const row = dataRows[i];
    
    // Skip empty rows
    if (row.every(cell => cell === '')) {
      continue;
    }

    try {
      if (type === 'appointment') {
        const appointment = validateAppointmentRow(row, headers, i + 2); // +2 for header and 1-based
        validatedData.push(appointment);
      } else {
        const folga = validateFolgaRow(row, headers, i + 2);
        validatedData.push(folga);
      }
    } catch (error) {
      if (error instanceof CSVImportValidationError) {
        allErrors.push(...error.errors);
      } else {
        allErrors.push({
          row: i + 2,
          field: 'Unknown',
          message: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
  }

  // If there are any errors, reject the entire import
  if (allErrors.length > 0) {
    throw new CSVImportValidationError(allErrors);
  }

  return {
    type,
    data: validatedData,
    count: validatedData.length
  };
}
