'use client';

import { useState } from 'react';
import { DateRange } from '@/lib/filters';
import { colors } from '@/styles/design-tokens';
import { format } from 'date-fns';

export interface DateRangePickerProps {
  startDate: Date;
  endDate: Date;
  onChange: (range: DateRange) => void;
}

export function DateRangePicker({ startDate, endDate, onChange }: DateRangePickerProps) {
  const [start, setStart] = useState(format(startDate, 'yyyy-MM-dd'));
  const [end, setEnd] = useState(format(endDate, 'yyyy-MM-dd'));
  const [error, setError] = useState('');

  const handleStartChange = (value: string) => {
    setStart(value);
    setError('');
    
    const startD = new Date(value);
    const endD = new Date(end);
    
    if (startD > endD) {
      setError('Start date must be before end date');
      return;
    }
    
    onChange({ start: startD, end: endD });
  };

  const handleEndChange = (value: string) => {
    setEnd(value);
    setError('');
    
    const startD = new Date(start);
    const endD = new Date(value);
    
    if (startD > endD) {
      setError('End date must be after start date');
      return;
    }
    
    onChange({ start: startD, end: endD });
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label 
            htmlFor="start-date" 
            className="block text-sm font-medium mb-1"
            style={{ color: colors['ink-muted'] }}
          >
            Start Date
          </label>
          <input
            id="start-date"
            type="date"
            value={start}
            onChange={(e) => handleStartChange(e.target.value)}
            className="w-full px-3 py-2 rounded-md transition-all"
            style={{
              backgroundColor: colors['surface-3'],
              border: `1px solid ${colors.hairline}`,
              color: colors.ink,
            }}
          />
        </div>
        
        <div>
          <label 
            htmlFor="end-date" 
            className="block text-sm font-medium mb-1"
            style={{ color: colors['ink-muted'] }}
          >
            End Date
          </label>
          <input
            id="end-date"
            type="date"
            value={end}
            onChange={(e) => handleEndChange(e.target.value)}
            className="w-full px-3 py-2 rounded-md transition-all"
            style={{
              backgroundColor: colors['surface-3'],
              border: `1px solid ${colors.hairline}`,
              color: colors.ink,
            }}
          />
        </div>
      </div>
      
      {error && (
        <p className="text-sm" style={{ color: colors['semantic-error'] }}>
          {error}
        </p>
      )}
    </div>
  );
}
