'use client';

import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { colors } from '@/styles/design-tokens';

export interface LineChartProps {
  data: Array<Record<string, any>>;
  xKey: string;
  lines: Array<{
    dataKey: string;
    name: string;
    color?: string;
  }>;
  title?: string;
  height?: number;
}

export function LineChart({ data, xKey, lines, title, height = 300 }: LineChartProps) {
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
        <RechartsLineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
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
          {lines.map((line, index) => (
            <Line
              key={line.dataKey}
              type="monotone"
              dataKey={line.dataKey}
              name={line.name}
              stroke={line.color || colors['product-terraform']}
              strokeWidth={2}
              dot={{ fill: line.color || colors['product-terraform'], r: 4 }}
              activeDot={{ r: 6 }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}
