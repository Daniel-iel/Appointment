 'use client';

import { useRef, useCallback } from 'react';
import { Folga } from '@/lib/types';
import { colors } from '@/styles/design-tokens';
import { Trash2, Sunrise, Utensils, Pencil } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { usePagination } from '@/hooks/usePagination';

export interface FolgaListProps {
  folgas: Folga[];
  onDelete: (id: string) => void;
  onEdit?: (folga: Folga) => void;
}

export function FolgaList({ folgas, onDelete, onEdit }: FolgaListProps) {
  if (folgas.length === 0) {
    return (
      <div
        className="card p-8 text-center"
        style={{
          backgroundColor: `${colors['product-vault']}05`,
          borderColor: `${colors['product-vault']}20`,
        }}
      >
        <div className="flex flex-col items-center gap-3">
          <div
            className="p-4 rounded-full"
            style={{ backgroundColor: `${colors['product-vault']}15` }}
          >
            <Sunrise className="w-8 h-8" style={{ color: colors['product-vault'] }} />
          </div>
          <p className="text-lg font-medium" style={{ color: colors['ink-muted'] }}>
            No time-off registered
          </p>
          <p className="text-sm" style={{ color: colors['ink-subtle'] }}>
            Click "Add Time-Off" to track breaks and vacations
          </p>
        </div>
      </div>
    );
  }

  // Sort by date descending (most recent first)
  const sortedFolgas = [...folgas].sort((a, b) => {
    const dateA = `${a.startDate} ${a.startTime}`;
    const dateB = `${b.startDate} ${b.startTime}`;
    return dateB.localeCompare(dateA);
  });

  const { paginatedItems, hasMore, loadMore } = usePagination(sortedFolgas, 10, 10);
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
        {paginatedItems.map((folga, idx) => {
          const displayDate = format(parseISO(folga.startDate), 'MMM d, yyyy');
          const endDate = format(parseISO(folga.endDate), 'MMM d, yyyy');
          const isSameDay = folga.startDate === folga.endDate;
          const isLast = idx === paginatedItems.length - 1;
          
          return (
            <div
              ref={isLast ? lastElementRef : undefined}
              key={folga.id}
              className="card p-4 transition-all hover:shadow-md"
              style={{
                backgroundColor: `${colors['product-vault']}05`,
                borderColor: `${colors['product-vault']}30`,
              }}
            >
              <div className="flex items-start justify-between gap-4">
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {isSameDay ? (
                      <>
                        <span className="text-sm font-medium" style={{ color: colors['ink-muted'] }}>
                          {displayDate}
                        </span>
                        <span className="text-xs" style={{ color: colors['ink-subtle'] }}>
                          {folga.startTime} - {folga.endTime}
                        </span>
                      </>
                    ) : (
                      <span className="text-sm font-medium" style={{ color: colors['ink-muted'] }}>
                        {displayDate} {folga.startTime} - {endDate} {folga.endTime}
                      </span>
                    )}
                  </div>
                  
                  <p
                    className="text-sm mb-2 line-clamp-2"
                    style={{ color: colors.ink }}
                  >
                    {folga.description || 'No description'}
                  </p>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Sunrise className="w-3 h-3" style={{ color: colors['product-vault'] }} />
                      <span className="text-xs font-medium" style={{ color: colors['product-vault'] }}>
                        {folga.hasLunchBreak && folga.grossHours ? (
                          <>
                            {folga.hours.toFixed(1)}h net ({folga.grossHours.toFixed(1)}h gross)
                          </>
                        ) : (
                          <>
                            {folga.hours.toFixed(1)}h time-off
                          </>
                        )}
                      </span>
                    </div>
                    
                    {folga.hasLunchBreak && (
                      <div
                        className="flex items-center gap-1 px-2 py-0.5 rounded text-xs"
                        style={{
                          backgroundColor: `${colors['product-vault']}20`,
                          color: colors['product-vault'],
                        }}
                        title={`Lunch break deducted: ${folga.lunchDuration || 1}h`}
                      >
                        <Utensils className="w-3 h-3" />
                        <span>-{folga.lunchDuration || 1}h lunch</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(folga)}
                      className="p-2 rounded-md transition-all hover:bg-opacity-80"
                      style={{
                        color: colors['product-vault'],
                      }}
                      title="Edit time-off"
                      aria-label="Edit time-off"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => onDelete(folga.id)}
                    className="p-2 rounded-md transition-all hover:bg-opacity-80"
                    style={{
                      color: colors['semantic-error'],
                    }}
                    title="Delete time-off"
                    aria-label="Delete time-off"
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
            aria-label="Load more time-off"
          >
            Load more
          </button>
        </div>
      )}
    </>
  );
}
