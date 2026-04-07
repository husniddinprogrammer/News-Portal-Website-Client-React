import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTranslit } from '../hooks/useTranslit';
import { useNews } from '../hooks/useNews';
import { SEOHead } from '../components/seo/SEOHead';
import { SITE_URL } from '../utils/seo';
import { HeroNews } from '../components/news/HeroNews';
import { ImageTopNews } from '../components/news/ImageTopNews';
import { ImageLeftNews } from '../components/news/ImageLeftNews';
import { TextNews } from '../components/news/TextNews';
import { SectionTitle } from '../components/news/SectionTitle';
import { Pagination } from '../components/ui/Pagination';
import { SkeletonCard, SkeletonLeftImage, SkeletonText } from '../components/ui/Skeleton';
import { ErrorUI } from '../components/ui/ErrorUI';

export const CategoryPage = () => {
  const { slug } = useParams();
  const { t } = useTranslation();
  const { tr } = useTranslit();

  const SORT_OPTIONS = useMemo(() => [
    { value: 'id_desc',     label: t('sort.idDesc') },
    { value: 'rank_desc',   label: t('sort.rankDesc') },
    { value: 'most_viewed', label: t('sort.mostViewed') },
    { value: 'most_liked',  label: t('sort.mostLiked') },
  ], [t]);

  // Sort va page birgalikda — sort o'zganda page 1 ga qaytadi
  const [sort, setSort] = useState('id_desc');
  const [page, setPage] = useState(1);

  const handleSort = (val) => { setSort(val); setPage(1); };
  const handlePage = (val) => { setPage(val); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const { news: topRanked, isLoading: loadHero } = useNews({
    category: slug, sort: 'rank_desc', limit: 1,
  });

  const { news: grid, pagination, isLoading: loadGrid, isError, refetch } = useNews({
    category: slug, sort, limit: 9, page,
  });

  const { news: viewedNews, isLoading: loadWeek } = useNews({
    category: slug, sort: 'most_viewed', limit: 10,
  });

  const { news: latest, isLoading: loadLatest } = useNews({
    category: slug, sort: 'id_desc', limit: 15,
  });

  const { news: mostLiked, isLoading: loadLiked } = useNews({
    category: slug, sort: 'most_liked', limit: 9,
  });

  const hero = topRanked[0];

  // Use real category name from API once loaded; fall back to formatted slug
  const categoryName = topRanked[0]?.category?.name || grid[0]?.category?.name;
  const displayName  = categoryName
    ? tr(categoryName)
    : slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-12">
      <SEOHead
        title={displayName}
        description={`${displayName} bo'yicha eng so'nggi yangiliklar — NewsPortal`}
        url={`${SITE_URL}/category/${slug}`}
        keywords={`${displayName}, yangiliklar, o'zbekiston`}
      />

      {/* MAIN SPLIT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <SectionTitle more={`/news?sort=rank_desc&category=${slug}`}>{t('news.topNews')}</SectionTitle>
            {loadHero ? <SkeletonCard /> : hero ? <HeroNews news={hero} /> : null}
          </section>

          <section>
            {/* Sort toolbar */}
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div className="flex items-center gap-1 flex-wrap">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleSort(opt.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 border ${
                      sort === opt.value
                        ? 'bg-red-600 text-white border-red-600 shadow-sm'
                        : 'border-transparent hover:border-red-200 hover:text-red-600'
                    }`}
                    style={sort !== opt.value ? { color: 'var(--text-muted)', background: 'var(--bg-secondary)' } : {}}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {isError ? (
              <ErrorUI onRetry={refetch} />
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {loadGrid
                    ? Array.from({ length: 9 }, (_, i) => <SkeletonCard key={i} />)
                    : grid.map((n) => <ImageTopNews key={n.id} news={n} />)}
                </div>
                <Pagination pagination={pagination} onPage={handlePage} />
              </>
            )}
          </section>
        </div>

        <aside>
          <SectionTitle more={`/news?sort=id_desc&category=${slug}`}>{t('news.latest')}</SectionTitle>
          {loadLatest
            ? Array.from({ length: 8 }, (_, i) => <SkeletonText key={i} />)
            : latest.map((n) => <TextNews key={n.id} news={n} />)}
        </aside>
      </div>

      {/* MOST VIEWED */}
      <section>
        <SectionTitle more={`/news?sort=most_viewed&category=${slug}`}>{t('news.mostViewed')}</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          {loadWeek
            ? Array.from({ length: 10 }, (_, i) => <SkeletonLeftImage key={i} />)
            : [viewedNews.slice(0, 5), viewedNews.slice(5, 10)].map((col, ci) => (
                <div key={ci}>{col.map((n) => <ImageLeftNews key={n.id} news={n} />)}</div>
              ))}
        </div>
      </section>

      {/* MOST LIKED */}
      <section>
        <SectionTitle more={`/news?sort=most_liked&category=${slug}`}>{t('news.mostLiked')}</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loadLiked
            ? Array.from({ length: 6 }, (_, i) => <SkeletonCard key={i} />)
            : mostLiked.slice(0, 9).map((n) => <ImageTopNews key={n.id} news={n} />)}
        </div>
      </section>
    </div>
  );
};
