'use client';

import { useRef, useCallback } from 'react';
import { Appointment } from '@/lib/types';
import { calcTotalHours } from '@/lib/calculations';
import { colors } from '@/styles/design-tokens';
import { Trash2, Clock, Pencil } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { usePagination } from '@/hooks/usePagination';

export interface AppointmentListProps {
  appointments: Appointment[];
  onDelete: (id: string) => void;
  onEdit?: (appointment: Appointment) => void;
}

export function AppointmentList({ appointments, onDelete, onEdit }: AppointmentListProps) {
  if (appointments.length === 0) {
    return (
      <div className="card p-8 text-center">
        <div className="flex flex-col items-center gap-3">
          <div
            className="p-4 rounded-full"
            style={{ backgroundColor: colors['surface-2'] }}
          >
            <Clock className="w-8 h-8" style={{ color: colors['ink-subtle'] }} />
          </div>
          <p className="text-lg font-medium" style={{ color: colors['ink-muted'] }}>
            No entries yet
          </p>
          <p className="text-sm" style={{ color: colors['ink-subtle'] }}>
            Click "Add Entry" to get started
          </p>
        </div>
      </div>
    );
  }

  // Sort by date descending (most recent first)
  const sortedAppointments = [...appointments].sort((a, b) => {
    const dateA = `${a.startDate} ${a.startTime}`;
    const dateB = `${b.startDate} ${b.startTime}`;
    return dateB.localeCompare(dateA);
  });

  const { paginatedItems, hasMore, loadMore } = usePagination(sortedAppointments, 10, 10);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observer.current) observer.current.disconnect();
      if (!node) return;
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            loadMore()
          }
        },
        { root: null, rootMargin: '0px', threshold: 1.0 }
      );
      observer.current.observe(node);
    },
    [hasMore, loadMore]
  );

  return (
    <>
      <div className="space-y-3">
        {paginatedItems.map((apt, idx) => {
          const duration = calcTotalHours(apt.startTime, apt.endTime);
          const displayDate = format(parseISO(apt.startDate), 'MMM d, yyyy');
          const isLast = idx === paginatedItems.length - 1;

          return (
            <div
              ref={isLast ? lastElementRef : undefined}
              key={apt.id}
              className="card p-4 transition-all hover:shadow-md"
              style={{ borderColor: colors['hairline-soft'] }}
            >
              <div className="flex items-start justify-between gap-4">
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium" style={{ color: colors['ink-muted'] }}>
                      {displayDate}
                    </span>
                    <span className="text-xs" style={{ color: colors['ink-subtle'] }}>
                      {apt.startTime} - {apt.endTime}
                    </span>
                  </div>
                  
                  <p
                    className="text-sm mb-2 line-clamp-2"
                    style={{ color: colors.ink }}
                  >
                    {apt.description || 'No description'}
                  </p>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3" style={{ color: colors['product-waypoint'] }} />
                    <span className="text-xs font-medium" style={{ color: colors['product-waypoint'] }}>
                      {duration.toFixed(1)}h
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(apt)}
                      className="p-2 rounded-md transition-all hover:bg-opacity-80"
                      style={{
                        color: colors['product-waypoint'],
                      }}
                      title="Edit entry"
                      aria-label="Edit entry"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => onDelete(apt.id)}
                    className="p-2 rounded-md transition-all hover:bg-opacity-80"
                    style={{
                      color: colors['semantic-error'],
                    }}
                    title="Delete entry"
                    aria-label="Delete entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {hasMore && (
        <div className="text-center mt-3">
          <button
            onClick={loadMore}
            className="px-4 py-2 rounded-md border"
            aria-label="Load more entries"
          >
            Load more
          </button>
        </div>
      )}
    </>
  );
}
