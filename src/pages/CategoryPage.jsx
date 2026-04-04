import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNews } from '../hooks/useNews';
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
  const [page, setPage] = useState(1);

  const { news: topRanked, isLoading: loadHero } = useNews({
    category: slug, sort: 'rank_desc', limit: 1,
  });

  const { news: grid, pagination, isLoading: loadGrid, isError, refetch } = useNews({
    category: slug, sort: 'id_desc', limit: 9, page,
  });

  const { news: weekViewed, isLoading: loadWeek } = useNews({
    category: slug, sort: 'most_viewed', time: 'this_week', limit: 10,
  });

  const { news: latest, isLoading: loadLatest } = useNews({
    category: slug, sort: 'id_desc', limit: 10,
  });

  const { news: mostLiked, isLoading: loadLiked } = useNews({
    category: slug, sort: 'most_liked', limit: 9,
  });

  const hero = topRanked[0];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-12">

      {/* MAIN SPLIT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <SectionTitle>{t('news.topNews')}</SectionTitle>
            {loadHero ? <SkeletonCard /> : hero ? <HeroNews news={hero} /> : null}
          </section>

          <section>
            <SectionTitle>{t('news.topRating')}</SectionTitle>
            {isError ? (
              <ErrorUI onRetry={refetch} />
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {loadGrid
                    ? Array(9).fill(0).map((_, i) => <SkeletonCard key={i} />)
                    : grid.map((n) => <ImageTopNews key={n.id} news={n} />)}
                </div>
                <Pagination pagination={pagination} onPage={setPage} />
              </>
            )}
          </section>
        </div>

        <aside>
          <SectionTitle>{t('news.latest')}</SectionTitle>
          {loadLatest
            ? Array(8).fill(0).map((_, i) => <SkeletonText key={i} />)
            : latest.map((n) => <TextNews key={n.id} news={n} />)}
        </aside>
      </div>

      {/* WEEKLY MOST VIEWED */}
      <section>
        <SectionTitle>{t('news.mostViewed')}</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          {loadWeek
            ? Array(10).fill(0).map((_, i) => <SkeletonLeftImage key={i} />)
            : [weekViewed.slice(0, 5), weekViewed.slice(5, 10)].map((col, ci) => (
                <div key={ci}>{col.map((n) => <ImageLeftNews key={n.id} news={n} />)}</div>
              ))}
        </div>
      </section>

      {/* MOST LIKED */}
      <section>
        <SectionTitle>{t('news.mostLiked')}</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loadLiked
            ? Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)
            : mostLiked.slice(0, 9).map((n) => <ImageTopNews key={n.id} news={n} />)}
        </div>
      </section>
    </div>
  );
};
