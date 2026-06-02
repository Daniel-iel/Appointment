'use client';

import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { colors, getChartColors } from '@/styles/design-tokens';

export interface PieChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
  title?: string;
  height?: number;
  isDonut?: boolean;
}

export function PieChart({ data, title, height = 300, isDonut = true }: PieChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <p className="text-muted text-sm">No data available</p>
      </div>
    );
  }

  const chartColors = getChartColors();

  const renderCustomLabel = ({ name, percent }: any) => {
    return `${name}: ${(percent * 100).toFixed(0)}%`;
  };

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold mb-4" style={{ color: colors.ink }}>
          {title}
        </h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomLabel}
            outerRadius={isDonut ? 100 : 120}
            innerRadius={isDonut ? 60 : 0}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: colors['surface-2'],
              border: `1px solid ${colors.hairline}`,
              borderRadius: '8px',
              color: colors.ink,
            }}
          />
          <Legend 
            wrapperStyle={{ color: colors['ink-muted'], fontSize: '14px' }}
            verticalAlign="bottom"
            height={36}
          />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
}
