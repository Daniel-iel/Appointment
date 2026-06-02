'use client';

import { useState } from 'react';
import { getPeriodPresets, PeriodPreset, DateRange } from '@/lib/filters';
import { colors } from '@/styles/design-tokens';
import { DateRangePicker } from './DateRangePicker';
import { format } from 'date-fns';

export interface PeriodSelectorProps {
  selectedPeriod: PeriodPreset;
  customRange?: DateRange;
  onPeriodChange: (period: PeriodPreset, customRange?: DateRange) => void;
}

export function PeriodSelector({ selectedPeriod, customRange, onPeriodChange }: PeriodSelectorProps) {
  const [showCustomPicker, setShowCustomPicker] = useState(selectedPeriod === 'custom');
  const presets = getPeriodPresets();

  const handlePeriodSelect = (period: PeriodPreset) => {
    if (period === 'custom') {
      setShowCustomPicker(true);
      // If we already have a custom range, use it; otherwise use default from preset
      const range = customRange || presets.find(p => p.value === 'custom')!.getRange();
      onPeriodChange(period, range);
    } else {
      setShowCustomPicker(false);
      onPeriodChange(period);
    }
  };

  const handleCustomRangeChange = (range: DateRange) => {
    onPeriodChange('custom', range);
  };

  const getDisplayLabel = () => {
    if (selectedPeriod === 'custom' && customRange) {
      return `${format(customRange.start, 'MMM d')} - ${format(customRange.end, 'MMM d, yyyy')}`;
    }
    return presets.find(p => p.value === selectedPeriod)?.label || 'All Time';
  };

  return (
    <div className="space-y-3">
      {/* Period Tabs */}
      <div 
        className="inline-flex rounded-lg p-1"
        style={{ backgroundColor: colors['surface-2'] }}
      >
        {presets.filter(p => p.value !== 'custom').map((preset) => (
          <button
            key={preset.value}
            onClick={() => handlePeriodSelect(preset.value)}
            className="px-4 py-2 text-sm font-medium rounded-md transition-all"
            style={{
              backgroundColor: selectedPeriod === preset.value && !showCustomPicker
                ? colors['surface-3']
                : 'transparent',
              color: selectedPeriod === preset.value && !showCustomPicker
                ? colors.ink
                : colors['ink-muted'],
            }}
          >
            {preset.label}
          </button>
        ))}
        <button
          onClick={() => handlePeriodSelect('custom')}
          className="px-4 py-2 text-sm font-medium rounded-md transition-all"
          style={{
            backgroundColor: showCustomPicker ? colors['surface-3'] : 'transparent',
            color: showCustomPicker ? colors.ink : colors['ink-muted'],
          }}
        >
          Custom
        </button>
      </div>

      {/* Custom Date Range Picker */}
      {showCustomPicker && (
        <div 
          className="p-4 rounded-lg"
          style={{ 
            backgroundColor: colors['surface-2'],
            border: `1px solid ${colors['hairline-soft']}`,
          }}
        >
          <DateRangePicker
            startDate={customRange?.start || new Date()}
            endDate={customRange?.end || new Date()}
            onChange={handleCustomRangeChange}
          />
        </div>
      )}

      {/* Display selected range label */}
      <div className="text-sm" style={{ color: colors['ink-subtle'] }}>
        Showing: <span style={{ color: colors.ink, fontWeight: 600 }}>{getDisplayLabel()}</span>
      </div>
    </div>
  );
}
