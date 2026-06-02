'use client';

import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { colors } from '@/styles/design-tokens';

export interface BarChartProps {
  data: Array<Record<string, any>>;
  xKey: string;
  bars: Array<{
    dataKey: string;
    name: string;
    color?: string;
  }>;
  title?: string;
  height?: number;
}

export function BarChart({ data, xKey, bars, title, height = 300 }: BarChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <p className="text-muted text-sm">No data available</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold mb-4" style={{ color: colors.ink }}>
          {title}
        </h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <RechartsBarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={colors['hairline-soft']} />
          <XAxis 
            dataKey={xKey} 
            stroke={colors['ink-muted']}
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke={colors['ink-muted']}
            style={{ fontSize: '12px' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: colors['surface-2'],
              border: `1px solid ${colors.hairline}`,
              borderRadius: '8px',
              color: colors.ink,
            }}
            labelStyle={{ color: colors.ink }}
          />
          <Legend 
            wrapperStyle={{ color: colors['ink-muted'], fontSize: '14px' }}
          />
          {bars.map((bar, index) => (
            <Bar
              key={bar.dataKey}
              dataKey={bar.dataKey}
              name={bar.name}
              fill={bar.color || colors['product-waypoint']}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
