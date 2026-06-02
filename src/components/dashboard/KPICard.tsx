'use client';

import { ReactNode } from 'react';
import { colors } from '@/styles/design-tokens';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';

export interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon?: ReactNode;
  color?: string;
  subtitle?: string;
}

export function KPICard({
  title,
  value,
  unit,
  trend,
  trendValue,
  icon,
  color = colors['product-terraform'],
  subtitle,
}: KPICardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <ArrowUp className="w-4 h-4" style={{ color: colors['semantic-success'] }} />;
      case 'down':
        return <ArrowDown className="w-4 h-4" style={{ color: colors['semantic-error'] }} />;
      case 'neutral':
        return <Minus className="w-4 h-4" style={{ color: colors['ink-muted'] }} />;
      default:
        return null;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return colors['semantic-success'];
      case 'down':
        return colors['semantic-error'];
      default:
        return colors['ink-muted'];
    }
  };

  return (
    <div 
      className="card p-6 transition-all hover:shadow-lg"
      style={{ 
        borderColor: colors['hairline-soft'],
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <h3 
          className="text-sm font-medium uppercase tracking-wide"
          style={{ color: colors['ink-muted'], letterSpacing: '0.6px' }}
        >
          {title}
        </h3>
        {icon && (
          <div style={{ color }}>
            {icon}
          </div>
        )}
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-2 mb-2">
        <span 
          className="text-4xl font-bold"
          style={{ color: colors.ink }}
        >
          {value}
        </span>
        {unit && (
          <span 
            className="text-lg font-medium"
            style={{ color: colors['ink-muted'] }}
          >
            {unit}
          </span>
        )}
      </div>

      {/* Trend or Subtitle */}
      {trend && trendValue ? (
        <div className="flex items-center gap-1">
          {getTrendIcon()}
          <span 
            className="text-sm font-medium"
            style={{ color: getTrendColor() }}
          >
            {trendValue}
          </span>
        </div>
      ) : subtitle ? (
        <p className="text-sm" style={{ color: colors['ink-subtle'] }}>
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
