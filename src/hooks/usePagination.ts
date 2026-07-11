import { useCallback, useEffect, useMemo, useState } from 'react'

export function usePagination<T>(items: T[], initialCount = 10, loadMoreCount = 10) {
  const [visibleCount, setVisibleCount] = useState<number>(initialCount)

  // Reset visible count when the underlying items change (e.g., filters applied)
  useEffect(() => {
    setVisibleCount(initialCount)
  }, [items, initialCount])

  const paginatedItems = useMemo(() => items.slice(0, visibleCount), [items, visibleCount])

  const hasMore = paginatedItems.length < items.length

  const loadMore = useCallback(() => {
    setVisibleCount((prev) => Math.min(prev + loadMoreCount, items.length))
  }, [loadMoreCount, items.length])

  const reset = useCallback(() => setVisibleCount(initialCount), [initialCount])

  return { paginatedItems, hasMore, loadMore, reset, visibleCount }
}
