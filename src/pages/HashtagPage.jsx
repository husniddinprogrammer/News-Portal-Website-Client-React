import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNews } from '../hooks/useNews';
import { SEOHead } from '../components/seo/SEOHead';
import { SITE_URL } from '../utils/seo';
import { ImageTopNews } from '../components/news/ImageTopNews';
import { TextNews } from '../components/news/TextNews';
import { SectionTitle } from '../components/news/SectionTitle';
import { Pagination } from '../components/ui/Pagination';
import { SkeletonCard, SkeletonText } from '../components/ui/Skeleton';
import { ErrorUI } from '../components/ui/ErrorUI';

export const HashtagPage = () => {
  const { slug } = useParams();
  const { t } = useTranslation();
  const [page, setPage] = useState(1);

  const { news: grid, pagination, isLoading: loadGrid, isError, refetch } = useNews({
    hashtag: slug, sort: 'id_desc', limit: 9, page,
  });

  const { news: latest, isLoading: loadLatest } = useNews({
    sort: 'id_desc', limit: 10,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-12">
      <SEOHead
        title={`#${slug}`}
        description={`#${slug} hashtegi bo'yicha yangiliklar — NewsPortal`}
        url={`${SITE_URL}/hashtag/${slug}`}
        keywords={`${slug}, hashtag, yangiliklar`}
      />
      <div className="flex items-center gap-3">
        <span className="text-2xl font-black text-red-600">#</span>
        <h1 className="text-2xl font-black capitalize" style={{ color: 'var(--text)' }}>
          {slug}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
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
        </div>

        <aside>
          <SectionTitle>{t('news.latest')}</SectionTitle>
          {loadLatest
            ? Array(8).fill(0).map((_, i) => <SkeletonText key={i} />)
            : latest.map((n) => <TextNews key={n.id} news={n} />)}
        </aside>
      </div>
    </div>
  );
};
