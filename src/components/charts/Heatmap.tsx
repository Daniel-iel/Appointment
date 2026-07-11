'use client';

import { colors } from '@/styles/design-tokens';
import { format, parseISO } from 'date-fns';

export interface HeatmapCell {
  date: string;
  hours: number;
  intensity: number; // 0-1 scale
}

export interface HeatmapProps {
  data: HeatmapCell[];
  title?: string;
}

export function Heatmap({ data, title }: HeatmapProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p className="text-muted text-sm">No data available</p>
      </div>
    );
  }

  const getIntensityColor = (intensity: number): string => {
    if (intensity === 0) return colors['surface-2'];
    if (intensity < 0.25) return '#1e3a4a'; // Very low
    if (intensity < 0.5) return colors['product-waypoint-deep']; // Low
    if (intensity < 0.75) return colors['product-waypoint']; // Medium
    return colors['product-nomad']; // High
  };

  // Group data by week for better visualization
  const weeks: HeatmapCell[][] = [];
  let currentWeek: HeatmapCell[] = [];
  
  data.forEach((cell, index) => {
    currentWeek.push(cell);
    if (currentWeek.length === 7 || index === data.length - 1) {
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
  });

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold mb-4" style={{ color: colors.ink }}>
          {title}
        </h3>
      )}
      
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Days of week header */}
          <div className="flex gap-1 mb-2 ml-16">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <div 
                key={day} 
                className="w-3 h-3 text-[10px] text-center"
                style={{ color: colors['ink-subtle'] }}
              >
                {day[0]}
              </div>
            ))}
          </div>
          
          {/* Heatmap grid */}
          <div className="space-y-1">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex items-center gap-1">
                {/* Week label */}
                <div 
                  className="w-14 text-[10px] text-right pr-2"
                  style={{ color: colors['ink-subtle'] }}
                >
                  {week[0] && format(parseISO(week[0].date), 'MMM d')}
                </div>
                
                {/* Week cells */}
                <div className="flex gap-1">
                  {week.map((cell, dayIndex) => {
                    const displayDate = format(parseISO(cell.date), 'MMM d, yyyy');
                    const hoursText = cell.hours.toFixed(1);
                    
                    return (
                      <div
                        key={dayIndex}
                        className="w-3 h-3 rounded-sm cursor-pointer transition-all hover:ring-2 hover:ring-offset-1"
                        style={{
                          backgroundColor: getIntensityColor(cell.intensity),
                        }}
                        title={`${displayDate}: ${hoursText}h`}
                      />
                    );
                  })}
                  {/* Fill remaining days if week is incomplete */}
                  {Array.from({ length: 7 - week.length }).map((_, index) => (
                    <div
                      key={`empty-${index}`}
                      className="w-3 h-3"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          {/* Legend */}
          <div className="flex items-center gap-2 mt-4 ml-16">
            <span className="text-xs" style={{ color: colors['ink-subtle'] }}>Less</span>
            <div className="flex gap-1">
              {[0, 0.25, 0.5, 0.75, 1].map((intensity, index) => (
                <div
                  key={index}
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: getIntensityColor(intensity) }}
                />
              ))}
            </div>
            <span className="text-xs" style={{ color: colors['ink-subtle'] }}>More</span>
          </div>
        </div>
      </div>
    </div>
  );
}
