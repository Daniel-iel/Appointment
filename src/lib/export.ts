import { Appointment, Folga } from './types';
import { calcTotalHours } from './calculations';
import { getOverallStats } from './analytics';
import { format } from 'date-fns';

/**
 * Sanitize CSV field to prevent formula injection
 * @param value - Value to sanitize
 * @returns Sanitized value safe for CSV export
 */
function sanitizeForCSV(value: string): string {
  if (typeof value !== 'string') {
    return '""';
  }

  // Escape formula injection - prefix dangerous characters with single quote
  if (/^[=+\-@\t\r]/.test(value)) {
    value = "'" + value;
  }

  // Escape double quotes for CSV
  value = value.replace(/"/g, '""');
  
  // Wrap in quotes
  return `"${value}"`;
}

/**
 * Export appointments to CSV format
 */
export function exportToCSV(appointments: Appointment[]): string {
  const headers = ['ID', 'Start Date', 'Start Time', 'End Date', 'End Time', 'Duration (hours)', 'Description', 'Created At', 'Updated At'];
  
  const rows = appointments.map((apt) => {
    const duration = calcTotalHours(apt.startTime, apt.endTime);
    return [
      apt.id,
      apt.startDate,
      apt.startTime,
      apt.endDate,
      apt.endTime,
      duration.toFixed(2),
      sanitizeForCSV(apt.description), // Prevent formula injection
      apt.createdAt,
      apt.updatedAt,
    ];
  });

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\n');

  return csvContent;
}

/**
 * Download CSV file to browser
 */
export function downloadCSV(appointments: Appointment[], filename?: string): void {
  const csv = exportToCSV(appointments);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename || `appointments-${format(new Date(), 'yyyy-MM-dd')}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export appointments to JSON format
 */
export function exportToJSON(appointments: Appointment[], folgas: Folga[] = []): string {
  const stats = getOverallStats(appointments, folgas);
  
  const exportData = {
    exportedAt: new Date().toISOString(),
    summary: stats,
    appointments: appointments.map((apt) => ({
      ...apt,
      duration: calcTotalHours(apt.startTime, apt.endTime),
    })),
  };

  return JSON.stringify(exportData, null, 2);
}

/**
 * Download JSON file to browser
 */
export function downloadJSON(appointments: Appointment[], folgas: Folga[] = [], filename?: string): void {
  const json = exportToJSON(appointments, folgas);
  const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
  const link = document.createElement('a');
  
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename || `appointments-${format(new Date(), 'yyyy-MM-dd')}.json`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generate a text summary report
 */
export function generateSummaryReport(appointments: Appointment[], folgas: Folga[] = []): string {
  const stats = getOverallStats(appointments, folgas);
  
  const report = `
APPOINTMENT SUMMARY REPORT
Generated: ${format(new Date(), 'PPpp')}

=== OVERVIEW ===
Total Appointments: ${stats.totalAppointments}
Total Hours Worked: ${stats.totalHours}h
Expected Hours: ${stats.expectedHours}h (based on 8h/day standard)
  Balance: ${stats.balance >= 0 ? '+' : ''}${stats.balance}h

=== AVERAGES ===
Average per Appointment: ${stats.averagePerAppointment}h
Unique Working Days: ${stats.uniqueDays}
Average per Day: ${stats.averagePerDay}h

=== APPOINTMENTS DETAIL ===
${appointments
  .sort((a, b) => `${a.startDate} ${a.startTime}`.localeCompare(`${b.startDate} ${b.startTime}`))
  .map((apt) => {
    const duration = calcTotalHours(apt.startTime, apt.endTime);
    return `${apt.startDate} ${apt.startTime} - ${apt.endTime} | ${duration.toFixed(1)}h | ${apt.description}`;
  })
  .join('\n')}

=== END OF REPORT ===
  `.trim();

  return report;
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    return false;
  }
}
