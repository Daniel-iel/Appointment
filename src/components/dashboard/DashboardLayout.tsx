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
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
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
                className="p-3 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: colors['surface-2'] }}
              >
                <img
                  src={`${basePath}/logo_menu.png`}
                  alt="Menu"
                  className="w-8 h-8 object-contain"
                />
              </div>
              <div>
                <h1
                  className="text-2xl font-bold tracking-tight"
                  style={{ color: colors.ink }}
                >
                  <img
                    src={`${basePath}/logo_extratime.png`}
                    alt={typeof title === 'string' ? title : 'ExtraTime Dashboard'}
                    className="h-10 object-contain"
                  />
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
