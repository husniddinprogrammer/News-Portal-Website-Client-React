import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, X } from 'lucide-react';
import { useNews } from '../hooks/useNews';
import { ImageTopNews } from '../components/news/ImageTopNews';
import { TextNews } from '../components/news/TextNews';
import { SectionTitle } from '../components/news/SectionTitle';
import { Pagination } from '../components/ui/Pagination';
import { SkeletonCard, SkeletonText } from '../components/ui/Skeleton';
import { ErrorUI } from '../components/ui/ErrorUI';

const SORT_ICONS = {
  rank_desc:   '⭐',
  id_desc:     '🕐',
  most_viewed: '👁️',
  most_liked:  '❤️',
};

const buildUrl = (params) => {
  const p = new URLSearchParams();
  if (params.sort)     p.set('sort',     params.sort);
  if (params.category) p.set('category', params.category);
  if (params.time && params.time !== 'custom') p.set('time', params.time);
  if (params.dateFrom) p.set('dateFrom', params.dateFrom);
  if (params.dateTo)   p.set('dateTo',   params.dateTo);
  return `/news?${p.toString()}`;
};

export const SortPage = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const sortParam     = searchParams.get('sort')     || 'id_desc';
  const categoryParam = searchParams.get('category') || '';
  const timeParam     = searchParams.get('time')     || '';
  const dateFromParam = searchParams.get('dateFrom') || '';
  const dateToParam   = searchParams.get('dateTo')   || '';

  const isCustom = Boolean(dateFromParam || dateToParam);
  const [showDatePicker, setShowDatePicker] = useState(isCustom);
  const [dateFrom, setDateFrom] = useState(dateFromParam);
  const [dateTo, setDateTo]     = useState(dateToParam);
  const [page, setPage] = useState(1);

  useEffect(() => { setPage(1); }, [sortParam, categoryParam, timeParam, dateFromParam, dateToParam]);

  // Build translated options inside component so t() is reactive
  const SORT_OPTIONS = [
    { value: 'rank_desc',   label: t('sort.rankDesc'),   icon: SORT_ICONS.rank_desc },
    { value: 'id_desc',     label: t('sort.idDesc'),     icon: SORT_ICONS.id_desc },
    { value: 'most_viewed', label: t('sort.mostViewed'), icon: SORT_ICONS.most_viewed },
    { value: 'most_liked',  label: t('sort.mostLiked'),  icon: SORT_ICONS.most_liked },
  ];

  const TIME_OPTIONS = [
    { value: 'today',      label: t('sort.today') },
    { value: 'this_week',  label: t('sort.thisWeek') },
    { value: 'this_month', label: t('sort.thisMonth') },
    { value: 'custom',     label: t('sort.custom') },
  ];

  const handleSort = (val) => {
    navigate(buildUrl({ sort: val, category: categoryParam, time: timeParam, dateFrom: dateFromParam, dateTo: dateToParam }), { replace: true });
  };

  const handleTime = (val) => {
    if (val === 'custom') {
      setShowDatePicker(true);
      return;
    }
    setShowDatePicker(false);
    setDateFrom('');
    setDateTo('');
    navigate(buildUrl({ sort: sortParam, category: categoryParam, time: val }), { replace: true });
  };

  const clearTime = () => {
    setShowDatePicker(false);
    setDateFrom('');
    setDateTo('');
    navigate(buildUrl({ sort: sortParam, category: categoryParam }), { replace: true });
  };

  const applyDateRange = () => {
    if (!dateFrom && !dateTo) return;
    navigate(buildUrl({ sort: sortParam, category: categoryParam, dateFrom, dateTo }), { replace: true });
  };

  const handlePage = (val) => {
    setPage(val);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeTime = isCustom ? 'custom' : timeParam;

  const { news: grid, pagination, isLoading: loadGrid, isError, refetch } = useNews({
    sort:     sortParam,
    category: categoryParam || undefined,
    time:     (!isCustom && timeParam) ? timeParam : undefined,
    dateFrom: dateFromParam || undefined,
    dateTo:   dateToParam   || undefined,
    limit:    12,
    page,
  });

  const { news: latest, isLoading: loadLatest } = useNews({
    sort: 'id_desc', limit: 15,
  });

  const activeOption = SORT_OPTIONS.find((o) => o.value === sortParam) || SORT_OPTIONS[1];

  const btnBase = 'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 border';
  const btnActive = 'bg-red-600 text-white border-red-600 shadow-sm';
  const btnInactive = 'border-transparent hover:border-red-200 hover:text-red-600';

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">

      {/* Header */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-2xl">{activeOption.icon}</span>
        <h1 className="text-2xl font-black" style={{ color: 'var(--text)' }}>
          {activeOption.label}
        </h1>
        {categoryParam && (
          <span className="text-sm font-semibold px-3 py-1 rounded-full bg-red-50 text-red-600 border border-red-200">
            #{categoryParam}
          </span>
        )}
      </div>

      {/* Filters panel */}
      <div
        className="rounded-xl border p-4 space-y-4"
        style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
      >
        {/* Sort */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold uppercase tracking-wider mr-1" style={{ color: 'var(--text-muted)' }}>
            {t('sort.sortLabel')}:
          </span>
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleSort(opt.value)}
              className={`${btnBase} flex items-center gap-1.5 ${sortParam === opt.value ? btnActive : btnInactive}`}
              style={sortParam !== opt.value ? { color: 'var(--text-muted)', background: 'var(--bg)' } : {}}
            >
              <span>{opt.icon}</span>
              {opt.label}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid var(--border)' }} />

        {/* Time filter */}
        <div className="flex items-start gap-2 flex-wrap">
          <span className="text-xs font-bold uppercase tracking-wider mr-1 mt-1.5" style={{ color: 'var(--text-muted)' }}>
            {t('sort.timeLabel')}:
          </span>
          <div className="flex items-center gap-2 flex-wrap flex-1">
            {TIME_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleTime(opt.value)}
                className={`${btnBase} flex items-center gap-1 ${activeTime === opt.value ? btnActive : btnInactive}`}
                style={activeTime !== opt.value ? { color: 'var(--text-muted)', background: 'var(--bg)' } : {}}
              >
                {opt.value === 'custom' && <Calendar size={12} />}
                {opt.label}
              </button>
            ))}

            {activeTime && (
              <button
                onClick={clearTime}
                className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs text-red-500 hover:text-red-700 transition-colors"
              >
                <X size={12} /> {t('sort.clear')}
              </button>
            )}
          </div>
        </div>

        {/* Custom date range */}
        {showDatePicker && (
          <div className="flex items-center gap-3 flex-wrap pl-14">
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{t('sort.from')}:</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="text-sm px-3 py-1.5 rounded-lg border outline-none focus:border-red-400 transition-colors"
                style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{t('sort.to')}:</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="text-sm px-3 py-1.5 rounded-lg border outline-none focus:border-red-400 transition-colors"
                style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
              />
            </div>
            <button
              onClick={applyDateRange}
              disabled={!dateFrom && !dateTo}
              className="px-4 py-1.5 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition-colors disabled:opacity-40"
            >
              {t('sort.apply')}
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {isError ? (
            <ErrorUI onRetry={refetch} />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {loadGrid
                  ? Array(12).fill(0).map((_, i) => <SkeletonCard key={i} />)
                  : grid.length === 0
                    ? <p className="col-span-3 text-center py-16" style={{ color: 'var(--text-muted)' }}>
                        {t('news.noNews')}
                      </p>
                    : grid.map((n) => <ImageTopNews key={n.id} news={n} />)}
              </div>
              <Pagination pagination={pagination} onPage={handlePage} />
            </>
          )}
        </div>

        <aside>
          <SectionTitle>{t('news.latest')}</SectionTitle>
          {loadLatest
            ? Array(10).fill(0).map((_, i) => <SkeletonText key={i} />)
            : latest.map((n) => <TextNews key={n.id} news={n} />)}
        </aside>
      </div>
    </div>
  );
};
