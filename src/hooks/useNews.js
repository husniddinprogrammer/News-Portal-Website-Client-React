import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { newsService } from '../services/news.service';

/**
 * Builds a stable, deduplicated query key from filter params.
 * Null / undefined / empty-string values are stripped so that
 * useNews({ category: '' }) and useNews({}) share the same cache entry.
 */
const EMPTY_VALUES = new Set([null, undefined, '', 'all']);

const buildQueryKey = (params) => {
  const clean = Object.fromEntries(
    Object.entries(params).filter(([, v]) => !EMPTY_VALUES.has(v))
  );
  // Deterministic key — sort entries so order doesn't matter
  return ['news', Object.fromEntries(Object.entries(clean).sort())];
};

/**
 * useNews — query builder hook for the /news endpoint.
 *
 * @param {Object} options
 * @param {number}  [options.page=1]
 * @param {number}  [options.limit=10]
 * @param {string}  [options.sort]       - 'id_desc' | 'id_asc' | 'most_viewed' | 'most_liked' | 'most_commented' | 'rank_desc'
 * @param {string}  [options.time]       - 'today' | 'this_week' | 'this_month'
 * @param {string}  [options.category]   - category slug
 * @param {string}  [options.hashtag]    - hashtag slug
 * @param {string}  [options.search]     - full-text search
 * @param {number}  [options.rank]       - rank filter 0-10
 * @param {string}  [options.status]     - 'DRAFT' | 'PUBLISHED' | 'DELETED' (admin only)
 * @param {string}  [options.dateFrom]   - 'YYYY-MM-DD'
 * @param {string}  [options.dateTo]     - 'YYYY-MM-DD'
 * @param {boolean} [options.infinite]   - use infinite scroll instead of regular pagination
 * @param {boolean} [options.enabled]    - enable/disable query
 *
 * @returns React Query result + helpers:
 *   - data, isLoading, isError, error, isFetching
 *   - news         — flattened news array (works for both modes)
 *   - pagination   — pagination meta (regular mode only)
 *   - fetchNextPage, hasNextPage, isFetchingNextPage (infinite mode)
 */
export const useNews = ({
  page = 1,
  limit = 10,
  sort,
  time,
  category,
  hashtag,
  search,
  rank,
  status,
  dateFrom,
  dateTo,
  infinite = false,
  enabled = true,
} = {}) => {
  const params = useMemo(
    () => ({ page, limit, sort, time, category, hashtag, search, rank, status, dateFrom, dateTo }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [page, limit, sort, time, category, hashtag, search, rank, status, dateFrom, dateTo]
  );

  const queryKey = useMemo(() => buildQueryKey(params), [params]);

  // ─── Infinite scroll mode ───────────────────────────────────────────────────
  const infiniteQuery = useInfiniteQuery({
    queryKey: [...queryKey, 'infinite'],
    queryFn: ({ pageParam = 1 }) =>
      newsService.getList({ ...params, page: pageParam }),
    getNextPageParam: (lastPage) => {
      const { page: current, totalPages } = lastPage.pagination ?? {};
      return current < totalPages ? current + 1 : undefined;
    },
    enabled: enabled && infinite,
    staleTime: 1000 * 60 * 2,     // 2 min
    gcTime: 1000 * 60 * 10,       // 10 min
    refetchOnWindowFocus: false,
  });

  // ─── Regular paginated mode ─────────────────────────────────────────────────
  const regularQuery = useQuery({
    queryKey,
    queryFn: () => newsService.getList(params),
    enabled: enabled && !infinite,
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    placeholderData: (prev) => prev,   // keep previous page data while fetching next
  });

  // ─── Unified helpers ────────────────────────────────────────────────────────
  if (infinite) {
    const news = infiniteQuery.data?.pages.flatMap((p) => p.data) ?? [];
    return {
      ...infiniteQuery,
      news,
      pagination: infiniteQuery.data?.pages.at(-1)?.pagination ?? null,
    };
  }

  return {
    ...regularQuery,
    news: regularQuery.data?.data ?? [],
    pagination: regularQuery.data?.pagination ?? null,
  };
};

/**
 * useNewsDetail — fetch single news by slug
 */
export const useNewsDetail = (slug, options = {}) =>
  useQuery({
    queryKey: ['news', 'slug', slug],
    queryFn: () => newsService.getBySlug(slug),
    enabled: Boolean(slug) && (options.enabled ?? true),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 15,
    refetchOnWindowFocus: false,
    select: (res) => res.data,
  });
