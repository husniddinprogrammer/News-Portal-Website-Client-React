import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Eye, Heart, User, Calendar, Tag } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import DOMPurify from 'dompurify';

import { useNewsDetail, useNews } from '../hooks/useNews';
import { useLike } from '../hooks/useLike';
import { useTranslit } from '../hooks/useTranslit';
import { formatDate, formatDateTime } from '../utils/date';
import { formatViews } from '../utils/formatters';
import { SITE_URL, buildNewsJsonLd, buildBreadcrumbJsonLd } from '../utils/seo';

import { Badge } from '../components/ui/Badge';
import { TextNews } from '../components/news/TextNews';
import { ImageTopNews } from '../components/news/ImageTopNews';
import { SectionTitle } from '../components/news/SectionTitle';
import { SkeletonCard, SkeletonText, Skeleton } from '../components/ui/Skeleton';
import { ErrorUI } from '../components/ui/ErrorUI';
import { SEOHead } from '../components/seo/SEOHead';
import { JsonLd } from '../components/seo/JsonLd';

// ─── Like button ─────────────────────────────────────────────────────────────
const LikeButton = ({ newsId, initialCount }) => {
  const { t } = useTranslation();
  const { liked, count, toggle, isPending } = useLike({
    newsId,
    initialLiked: false,
    initialCount,
  });

  return (
    <button
      onClick={toggle}
      disabled={isPending}
      aria-label={liked ? t('detail.liked') : t('detail.like')}
      aria-pressed={liked}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-150 border ${
        liked
          ? 'bg-red-600 text-white border-red-600'
          : 'border-red-200 text-red-600 hover:bg-red-50'
      } disabled:opacity-60 active:scale-95`}
      style={liked ? { boxShadow: 'var(--shadow-red)' } : {}}
    >
      <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
      {liked ? t('detail.liked') : t('detail.like')}
      <span className="font-bold tabular-nums">{formatViews(count)}</span>
    </button>
  );
};

// ─── Main page ────────────────────────────────────────────────────────────────
export const NewsDetailPage = () => {
  const { slug } = useParams();
  const { t } = useTranslation();
  const { tr, trHtml } = useTranslit();

  const { data: news, isLoading, isError, refetch } = useNewsDetail(slug);

  const { news: similar, isLoading: loadSimilar } = useNews({
    category: news?.category?.slug,
    limit: 15,
    enabled: Boolean(news?.category?.slug),
  });

  const { news: latestSidebar } = useNews({ sort: 'id_desc', limit: 20 });

  const sanitizedContent = useMemo(
    () => DOMPurify.sanitize(trHtml(news?.content ?? '')),
    [news?.content, trHtml],
  );

  // ── Loading ───────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-5 w-1/4" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-3/4" />
            <Skeleton className="w-full rounded-2xl" style={{ paddingTop: '52%' }} />
            {Array.from({ length: 8 }, (_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
          <aside>
            {Array.from({ length: 10 }, (_, i) => <SkeletonText key={i} />)}
          </aside>
        </div>
      </div>
    );
  }

  if (isError || !news) return <ErrorUI onRetry={refetch} />;

  const coverImage = news.images?.[0]?.url;

  const sidebarNews = latestSidebar.filter((n) => n.slug !== slug).slice(0, 12);
  const similarNews = similar.filter((n) => n.slug !== slug).slice(0, 15);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* ── SEO ── */}
      <SEOHead
        title={news.title}
        description={news.shortDescription || news.title}
        image={coverImage}
        url={`${SITE_URL}/news/${news.slug}`}
        type="article"
        keywords={[news.category?.name, ...(news.hashtags?.map((h) => h.name) ?? [])].filter(Boolean).join(', ')}
      />
      <JsonLd data={buildNewsJsonLd(news)} />
      <JsonLd data={buildBreadcrumbJsonLd([
        { name: 'Bosh sahifa', url: SITE_URL },
        ...(news.category ? [{ name: news.category.name, url: `${SITE_URL}/category/${news.category.slug}` }] : []),
        { name: news.title, url: `${SITE_URL}/news/${news.slug}` },
      ])} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ── LEFT: Article ── */}
        <article className="lg:col-span-2 space-y-6" aria-label={news.title}>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-3">
            {news.category && (
              <Badge to={`/category/${news.category.slug}`}>
                {tr(news.category.name)}
              </Badge>
            )}
            <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
              <Calendar size={12} aria-hidden="true" />
              <time dateTime={news.createdAt}>{formatDateTime(news.createdAt)}</time>
            </span>
            <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
              <Eye size={12} aria-hidden="true" />
              {formatViews(news.viewCount)}
            </span>
          </div>

          {/* Title */}
          <h1
            className="text-2xl md:text-3xl font-black leading-tight"
            style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}
          >
            {tr(news.title)}
          </h1>

          {/* Like */}
          <div>
            <LikeButton newsId={news.id} initialCount={news.likeCount} />
          </div>

          {/* Content — sanitized HTML */}
          <div
            className="news-content"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />

          {/* Author */}
          {news.author && (
            <div
              className="flex items-center gap-4 p-4 rounded-2xl border"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
            >
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
                style={{ background: 'var(--red-light)' }}
                aria-hidden="true"
              >
                <User size={20} className="text-red-600" />
              </div>
              <div>
                <p className="text-xs mb-0.5" style={{ color: 'var(--text-muted)' }}>
                  {t('detail.author')}
                </p>
                <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>
                  {tr(news.author.name)} {tr(news.author.surname)}
                  <span className="font-normal ml-1.5" style={{ color: 'var(--text-muted)' }}>
                    @{news.author.username}
                  </span>
                </p>
              </div>
            </div>
          )}

          {/* Hashtags */}
          {news.hashtags?.length > 0 && (
            <div className="flex flex-wrap gap-2" role="list" aria-label="Hashtaglar">
              {news.hashtags.map((h) => (
                <Link
                  key={h.id}
                  to={`/hashtag/${h.slug}`}
                  role="listitem"
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border font-medium transition-all duration-150 hover:bg-red-50 hover:text-red-600 hover:border-red-200 active:scale-95"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
                >
                  <Tag size={11} aria-hidden="true" />
                  {tr(h.name)}
                </Link>
              ))}
            </div>
          )}
        </article>

        {/* ── RIGHT: Sticky sidebar ── */}
        <aside className="lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100vh-5rem)] lg:overflow-y-auto">
          <SectionTitle>{t('news.latest')}</SectionTitle>
          {sidebarNews.map((n) => <TextNews key={n.id} news={n} />)}
        </aside>
      </div>

      {/* ── Similar news ── */}
      {similarNews.length > 0 && (
        <section className="mt-14" aria-label={t('detail.similarNews')}>
          <SectionTitle>{t('detail.similarNews')}</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {loadSimilar
              ? Array.from({ length: 5 }, (_, i) => <SkeletonCard key={i} />)
              : similarNews.map((n) => <ImageTopNews key={n.id} news={n} />)}
          </div>
        </section>
      )}
    </div>
  );
};
