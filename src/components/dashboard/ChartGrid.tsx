'use client';

import { ReactNode } from 'react';
import { colors } from '@/styles/design-tokens';

export interface ChartGridProps {
  children: ReactNode;
  columns?: 1 | 2 | 3;
}

export function ChartGrid({ children, columns = 2 }: ChartGridProps) {
  const gridClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 lg:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  }[columns];

  return (
    <div className={`grid ${gridClass} gap-6`}>
      {children}
    </div>
  );
}

export interface ChartCardProps {
  children: ReactNode;
  title?: string;
  fullWidth?: boolean;
}

export function ChartCard({ children, title, fullWidth = false }: ChartCardProps) {
  return (
    <div 
      className={`card p-6 ${fullWidth ? 'lg:col-span-2' : ''}`}
      style={{ borderColor: colors['hairline-soft'] }}
    >
      {title && (
        <h3 
          className="text-lg font-semibold mb-4"
          style={{ color: colors.ink }}
        >
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}
