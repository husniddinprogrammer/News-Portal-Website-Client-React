import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Eye, Heart, MessageCircle, User, Calendar, Tag } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import DOMPurify from 'dompurify';

import { useNewsDetail, useNews } from '../hooks/useNews';  // ← single import
import { useComments, useAddComment } from '../hooks/useComments';
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

// ─── Comment item ─────────────────────────────────────────────────────────────
const CommentItem = ({ comment }) => (
  <div
    className="p-4 rounded-xl border"
    style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
  >
    <div className="flex items-center gap-2 mb-2">
      <span className="font-bold text-sm text-red-600">@{comment.username}</span>
      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
        {formatDate(comment.createdAt)}
      </span>
    </div>
    <p className="text-sm leading-relaxed" style={{ color: 'var(--text)' }}>
      {comment.content}
    </p>
  </div>
);

// ─── Comment form ─────────────────────────────────────────────────────────────
const CommentForm = ({ newsId }) => {
  const { t } = useTranslation();
  const { mutate, isPending } = useAddComment(newsId);
  const [form, setForm] = useState({ username: '', content: '' });
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!form.content.trim()) {
      setError(t('comment.emptyError'));  // ← i18n, not hardcoded
      return;
    }
    setError('');
    mutate(
      { newsId, content: form.content, username: form.username },
      { onSuccess: () => setForm({ username: '', content: '' }) },
    );
  };

  const inputStyle = {
    background: 'var(--bg)',
    borderColor: 'var(--border)',
    color: 'var(--text)',
  };

  return (
    <form onSubmit={submit} className="space-y-3 mt-4" noValidate>
      {/* Username */}
      <div>
        <label htmlFor="comment-username" className="sr-only">
          {t('comment.usernamePlaceholder')}
        </label>
        <input
          id="comment-username"
          value={form.username}
          onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
          placeholder={t('comment.usernamePlaceholder')}
          className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:border-red-400 transition-colors"
          style={inputStyle}
          autoComplete="nickname"
        />
      </div>

      {/* Content */}
      <div>
        <label htmlFor="comment-content" className="sr-only">
          {t('comment.placeholder')}
        </label>
        <textarea
          id="comment-content"
          rows={4}
          value={form.content}
          onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
          placeholder={t('comment.placeholder')}
          className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:border-red-400 transition-colors resize-none"
          style={inputStyle}
          aria-required="true"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'comment-error' : undefined}
        />
      </div>

      {error && (
        <p id="comment-error" role="alert" className="text-red-500 text-xs">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="px-5 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 active:scale-95 transition-all duration-150 disabled:opacity-60 flex items-center gap-2"
      >
        {isPending && (
          <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        )}
        {t('comment.submit')}
      </button>
    </form>
  );
};

// ─── Main page ────────────────────────────────────────────────────────────────
export const NewsDetailPage = () => {
  const { slug } = useParams();
  const { t } = useTranslation();
  const { tr, trHtml } = useTranslit();

  const { data: news, isLoading, isError, refetch } = useNewsDetail(slug);
  const { data: commentsData, isLoading: loadComments } = useComments(news?.id);
  const comments = commentsData?.comments ?? [];

  const { news: similar, isLoading: loadSimilar } = useNews({
    category: news?.category?.slug,
    limit: 15,
    enabled: Boolean(news?.category?.slug),
  });

  const { news: latestSidebar } = useNews({ sort: 'id_desc', limit: 20 });

  // Memoize DOMPurify.sanitize — only recalculates when content or language changes
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
            <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
              <MessageCircle size={12} aria-hidden="true" />
              {formatViews(news.commentCount)}
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

          {/* ── Comments section ── */}
          <section aria-label={t('comment.title')} className="mt-8">
            <SectionTitle>
              {t('comment.title')}{comments.length > 0 && ` (${comments.length})`}
            </SectionTitle>

            <div className="space-y-3 mb-6">
              {loadComments ? (
                Array.from({ length: 3 }, (_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-3 w-1/4" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))
              ) : comments.length === 0 ? (
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  {t('comment.noComments')}
                </p>
              ) : (
                comments.map((c) => <CommentItem key={c.id} comment={c} />)
              )}
            </div>

            {news.id && <CommentForm newsId={news.id} />}
          </section>
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
