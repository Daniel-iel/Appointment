'use client';

import { ReactNode } from 'react';
import { colors } from '@/styles/design-tokens';
import { Clock } from 'lucide-react';

export interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
}

export function DashboardLayout({ 
  children, 
  title = 'Appointment Dashboard',
  subtitle,
  actions,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.canvas }}>
      {/* Header */}
      <header 
        className="sticky top-0 z-10 border-b"
        style={{ 
          backgroundColor: colors['surface-1'],
          borderColor: colors['hairline-soft'],
        }}
      >
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Title Section */}
            <div className="flex items-center gap-3">
              <div 
                className="p-2 rounded-lg"
                style={{ backgroundColor: colors['surface-2'] }}
              >
                <Clock className="w-6 h-6" style={{ color: colors['product-terraform'] }} />
              </div>
              <div>
                <h1 
                  className="text-2xl font-bold tracking-tight"
                  style={{ color: colors.ink }}
                >
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-sm mt-0.5" style={{ color: colors['ink-muted'] }}>
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            {/* Actions Section */}
            {actions && (
              <div className="flex items-center gap-3">
                {actions}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
}
