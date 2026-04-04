import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNews } from '../hooks/useNews';
import { ImageTopNews } from '../components/news/ImageTopNews';
import { TextNews } from '../components/news/TextNews';
import { SectionTitle } from '../components/news/SectionTitle';
import { Pagination } from '../components/ui/Pagination';
import { SkeletonCard, SkeletonText } from '../components/ui/Skeleton';
import { ErrorUI } from '../components/ui/ErrorUI';

const SORT_OPTIONS = [
  { value: 'rank_desc',   label: 'Eng yuqori rank', icon: '⭐' },
  { value: 'id_desc',     label: 'Eng yangi',        icon: '🕐' },
  { value: 'most_viewed', label: "Ko'p ko'rilgan",   icon: '👁️' },
  { value: 'most_liked',  label: 'Ko\'p likelangan', icon: '❤️' },
];

const buildUrl = (sort, category) => {
  const params = new URLSearchParams({ sort });
  if (category) params.set('category', category);
  return `/news?${params.toString()}`;
};

export const SortPage = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const sortParam     = searchParams.get('sort')     || 'id_desc';
  const categoryParam = searchParams.get('category') || '';
  const [page, setPage] = useState(1);

  // sort yoki category o'zganda page 1 ga qayt
  useEffect(() => { setPage(1); }, [sortParam, categoryParam]);

  const handleSort = (val) => {
    navigate(buildUrl(val, categoryParam), { replace: true });
  };

  const handlePage = (val) => {
    setPage(val);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const { news: grid, pagination, isLoading: loadGrid, isError, refetch } = useNews({
    sort:     sortParam,
    category: categoryParam || undefined,
    limit:    12,
    page,
  });

  const { news: latest, isLoading: loadLatest } = useNews({
    sort: 'id_desc',
    limit: 15,
  });

  const activeOption = SORT_OPTIONS.find((o) => o.value === sortParam) || SORT_OPTIONS[1];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">

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

      {/* Sort tabs */}
      <div
        className="flex items-center gap-2 flex-wrap p-3 rounded-xl border"
        style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
      >
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => handleSort(opt.value)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              sortParam === opt.value
                ? 'bg-red-600 text-white shadow-md shadow-red-200'
                : 'hover:bg-red-50 hover:text-red-600'
            }`}
            style={sortParam !== opt.value ? { color: 'var(--text-muted)' } : {}}
          >
            <span>{opt.icon}</span>
            {opt.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Grid */}
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

        {/* Sidebar */}
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
