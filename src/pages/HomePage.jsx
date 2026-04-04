import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNews } from '../hooks/useNews';
import { useDebounce } from '../hooks/useDebounce';
import { HeroNews } from '../components/news/HeroNews';
import { ImageTopNews } from '../components/news/ImageTopNews';
import { ImageLeftNews } from '../components/news/ImageLeftNews';
import { TextNews } from '../components/news/TextNews';
import { SectionTitle } from '../components/news/SectionTitle';
import { SkeletonCard, SkeletonLeftImage, SkeletonText } from '../components/ui/Skeleton';

// ─── Reusable grid sections ────────────────────────────────────────────────

const ThreeColGrid = ({ news = [], loading }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {loading
      ? Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)
      : news.slice(0, 9).map((n) => <ImageTopNews key={n.id} news={n} />)}
  </div>
);

const TwoColLeft = ({ news = [], loading }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
    {loading
      ? Array(10).fill(0).map((_, i) => <SkeletonLeftImage key={i} />)
      : [news.slice(0, 5), news.slice(5, 10)].map((col, ci) => (
          <div key={ci}>{col.map((n) => <ImageLeftNews key={n.id} news={n} />)}</div>
        ))}
  </div>
);

// ─── Main component ────────────────────────────────────────────────────────

export const HomePage = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  // ── Top rank hero (rank_desc, limit 1)
  const { news: topRanked, isLoading: loadHero } = useNews({ sort: 'rank_desc', limit: 1 });

  // ── Top rating grid (rank_desc, 9 items)
  const { news: topRating, isLoading: loadRating } = useNews({ sort: 'rank_desc', limit: 9, page: 1 });

  // ── Latest sidebar (id_desc, 10)
  const { news: latest, isLoading: loadLatest } = useNews({ sort: 'id_desc', limit: 10 });

  // ── Weekly most viewed
  const { news: weekViewed, isLoading: loadWeek } = useNews({ sort: 'most_viewed', time: 'this_week', limit: 10 });

  // ── World news (latest) — category "world" — fallback to latest
  const { news: worldNews, isLoading: loadWorld } = useNews({ sort: 'id_desc', limit: 9 });

  // ── Most liked
  const { news: mostLiked, isLoading: loadLiked } = useNews({ sort: 'most_liked', limit: 9 });

  // ── Uzbekistan news — category slug "uzbekistan"
  const { news: uzbekNews, isLoading: loadUzbek } = useNews({ category: 'uzbekistan', sort: 'id_desc', limit: 10 });

  // ── Search results
  const debouncedSearch = useDebounce(searchQuery, 0);
  const { news: searchResults, isLoading: loadSearch } = useNews({
    search: debouncedSearch,
    limit: 9,
    enabled: Boolean(debouncedSearch),
  });

  // ─────────────────────────────────────────────
  if (searchQuery) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <SectionTitle>"{searchQuery}" — qidiruv natijalari</SectionTitle>
        {loadSearch ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : searchResults.length === 0 ? (
          <p className="text-center py-16" style={{ color: 'var(--text-muted)' }}>{t('news.noNews')}</p>
        ) : (
          <ThreeColGrid news={searchResults} />
        )}
      </div>
    );
  }

  const hero = topRanked[0];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-12">

      {/* ── MAIN SPLIT: left 2/3, right 1/3 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Hero */}
          <section>
            <SectionTitle>{t('news.topNews')}</SectionTitle>
            {loadHero ? <SkeletonCard /> : hero ? <HeroNews news={hero} /> : null}
          </section>

          {/* Top rating grid */}
          <section>
            <SectionTitle>{t('news.topRating')}</SectionTitle>
            <ThreeColGrid news={topRating.slice(1)} loading={loadRating} />
          </section>
        </div>

        {/* Right sidebar — latest */}
        <aside>
          <SectionTitle>{t('news.latest')}</SectionTitle>
          {loadLatest
            ? Array(8).fill(0).map((_, i) => <SkeletonText key={i} />)
            : latest.map((n) => <TextNews key={n.id} news={n} />)}
        </aside>
      </div>

      {/* ── WEEKLY MOST VIEWED ── */}
      <section>
        <SectionTitle>{t('news.mostViewed')}</SectionTitle>
        <TwoColLeft news={weekViewed} loading={loadWeek} />
      </section>

      {/* ── WORLD NEWS ── */}
      <section>
        <SectionTitle>{t('news.worldNews')}</SectionTitle>
        <ThreeColGrid news={worldNews} loading={loadWorld} />
      </section>

      {/* ── MOST LIKED ── */}
      <section>
        <SectionTitle>{t('news.mostLiked')}</SectionTitle>
        <ThreeColGrid news={mostLiked} loading={loadLiked} />
      </section>

      {/* ── UZBEKISTAN NEWS ── */}
      <section>
        <SectionTitle>{t('news.uzbekistan')}</SectionTitle>
        <TwoColLeft news={uzbekNews} loading={loadUzbek} />
      </section>

    </div>
  );
};
