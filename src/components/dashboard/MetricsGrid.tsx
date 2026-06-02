'use client';

import { KPICard } from './KPICard';
import { Clock, Calendar, TrendingUp, BarChart3 } from 'lucide-react';
import { colors } from '@/styles/design-tokens';

export interface MetricsData {
  totalAppointments: number;
  totalHours: number;
  balance: number;
  averagePerDay: number;
  uniqueDays: number;
  averagePerAppointment: number;
}

export interface MetricsGridProps {
  metrics: MetricsData;
}

export function MetricsGrid({ metrics }: MetricsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <KPICard
        title="Total Hours"
        value={metrics.totalHours.toFixed(1)}
        unit="h"
        icon={<Clock className="w-5 h-5" />}
        color={colors['product-terraform']}
        subtitle={`Across ${metrics.totalAppointments} appointments`}
      />
      
      <KPICard
        title="Balance"
        value={metrics.balance >= 0 ? `+${metrics.balance.toFixed(1)}` : metrics.balance.toFixed(1)}
        unit="h"
        trend={metrics.balance > 0 ? 'up' : metrics.balance < 0 ? 'down' : 'neutral'}
        trendValue={metrics.balance >= 0 ? 'Surplus' : 'Deficit'}
        icon={<TrendingUp className="w-5 h-5" />}
        color={metrics.balance >= 0 ? colors['semantic-success'] : colors['semantic-error']}
      />
      
      <KPICard
        title="Average / Day"
        value={metrics.averagePerDay.toFixed(1)}
        unit="h"
        icon={<Calendar className="w-5 h-5" />}
        color={colors['product-waypoint']}
        subtitle={`Over ${metrics.uniqueDays} working days`}
      />
      
      <KPICard
        title="Avg / Appointment"
        value={metrics.averagePerAppointment.toFixed(1)}
        unit="h"
        icon={<BarChart3 className="w-5 h-5" />}
        color={colors['product-nomad']}
        trend={metrics.averagePerAppointment >= 8 ? 'up' : metrics.averagePerAppointment < 8 ? 'down' : 'neutral'}
        trendValue={metrics.averagePerAppointment >= 8 ? 'Above standard' : 'Below standard'}
      />
    </div>
  );
}
