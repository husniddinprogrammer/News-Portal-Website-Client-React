import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Eye, Heart, MessageCircle, User, Calendar, Tag } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNewsDetail } from '../hooks/useNews';
import { useNews } from '../hooks/useNews';
import { useComments, useAddComment } from '../hooks/useComments';
import { useLike } from '../hooks/useLike';
import { formatDate, formatDateTime } from '../utils/date';
import { formatViews } from '../utils/formatters';

import { Badge } from '../components/ui/Badge';
import { TextNews } from '../components/news/TextNews';
import { ImageTopNews } from '../components/news/ImageTopNews';
import { SectionTitle } from '../components/news/SectionTitle';
import { SkeletonCard, SkeletonText, Skeleton } from '../components/ui/Skeleton';
import { ErrorUI } from '../components/ui/ErrorUI';

// ─── Like button ────────────────────────────────────────────────────────────
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
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all border ${
        liked
          ? 'bg-red-600 text-white border-red-600 shadow-md'
          : 'border-red-200 text-red-600 hover:bg-red-50'
      } disabled:opacity-60`}
    >
      <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
      {liked ? t('detail.liked') : t('detail.like')}
      <span className="font-bold">{formatViews(count)}</span>
    </button>
  );
};

// ─── Comment form ────────────────────────────────────────────────────────────
const CommentForm = ({ newsId }) => {
  const { t } = useTranslation();
  const { mutate, isPending } = useAddComment(newsId);
  const [form, setForm] = useState({ username: '', content: '' });
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!form.content.trim()) { setError("Izoh maydoni bo'sh bo'lishi mumkin emas"); return; }
    setError('');
    mutate(
      { newsId, content: form.content },
      { onSuccess: () => setForm({ username: '', content: '' }) }
    );
  };

  return (
    <form onSubmit={submit} className="space-y-3 mt-4">
      <input
        value={form.username}
        onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
        placeholder={t('comment.usernamePlaceholder')}
        className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none focus:border-red-400 transition-colors"
        style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
      />
      <textarea
        rows={4}
        value={form.content}
        onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
        placeholder={t('comment.placeholder')}
        className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none focus:border-red-400 transition-colors resize-none"
        style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
      />
      {error && <p className="text-red-500 text-xs">{error}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="px-5 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-60"
      >
        {isPending ? '...' : t('comment.submit')}
      </button>
    </form>
  );
};

// ─── Main page ────────────────────────────────────────────────────────────────
export const NewsDetailPage = () => {
  const { slug } = useParams();
  const { t } = useTranslation();

  const { data: news, isLoading, isError, refetch } = useNewsDetail(slug);

  const { data: commentsData, isLoading: loadComments } = useComments(news?.id);
  const comments = commentsData?.comments ?? [];

  const { news: similar, isLoading: loadSimilar } = useNews({
    category: news?.category?.slug,
    limit: 15,
    enabled: Boolean(news?.category?.slug),
  });

  const { news: latestSidebar } = useNews({ sort: 'id_desc', limit: 20 });

  // ── Loading state
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="w-full" style={{ paddingTop: '56.25%' }} />
            {Array(8).fill(0).map((_, i) => <Skeleton key={i} className="h-4 w-full" />)}
          </div>
          <aside>{Array(10).fill(0).map((_, i) => <SkeletonText key={i} />)}</aside>
        </div>
      </div>
    );
  }

  if (isError || !news) return <ErrorUI onRetry={refetch} />;


  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ── LEFT: Article ── */}
        <article className="lg:col-span-2 space-y-5">
          {/* Meta bar */}
          <div className="flex flex-wrap items-center gap-3">
            {news.category && (
              <Badge to={`/category/${news.category.slug}`}>{news.category.name}</Badge>
            )}
            <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
              <Calendar size={13} /> {formatDateTime(news.createdAt)}
            </span>
            <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
              <Eye size={13} /> {formatViews(news.viewCount)}
            </span>
            <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
              <MessageCircle size={13} /> {formatViews(news.commentCount)}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-black leading-tight" style={{ color: 'var(--text)' }}>
            {news.title}
          </h1>

          {/* Like button */}
          <div className="flex items-center gap-3">
            <LikeButton newsId={news.id} initialCount={news.likeCount} />
          </div>

          {/* Content */}
          <div
            className="news-content text-base leading-relaxed"
            dangerouslySetInnerHTML={{ __html: news.content }}
          />

          {/* Author */}
          {news.author && (
            <div
              className="flex items-center gap-3 p-4 rounded-xl border"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
            >
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <User size={20} className="text-red-600" />
              </div>
              <div>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{t('detail.author')}</p>
                <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>
                  {news.author.name} {news.author.surname}
                  <span className="font-normal ml-1" style={{ color: 'var(--text-muted)' }}>
                    @{news.author.username}
                  </span>
                </p>
              </div>
            </div>
          )}

          {/* Hashtags */}
          {news.hashtags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {news.hashtags.map((h) => (
                <Link
                  key={h.id}
                  to={`/hashtag/${h.slug}`}
                  className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border font-medium transition-colors hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
                >
                  <Tag size={12} /> {h.name}
                </Link>
              ))}
            </div>
          )}

          {/* ── Comments ── */}
          <section className="mt-8">
            <SectionTitle>
              {t('comment.title')} {comments.length > 0 && `(${comments.length})`}
            </SectionTitle>

            {/* Comment list */}
            <div className="space-y-4 mb-6">
              {loadComments ? (
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-3 w-1/4" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))
              ) : comments.length === 0 ? (
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{t('comment.noComments')}</p>
              ) : (
                comments.map((c) => (
                  <div
                    key={c.id}
                    className="p-4 rounded-xl border"
                    style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-semibold text-sm text-red-600">@{c.username}</span>
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {formatDate(c.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm" style={{ color: 'var(--text)' }}>{c.content}</p>
                  </div>
                ))
              )}
            </div>

            {/* Comment form */}
            {news.id && <CommentForm newsId={news.id} />}
          </section>
        </article>

        {/* ── RIGHT: Sidebar ── */}
        <aside>
          <SectionTitle>{t('news.latest')}</SectionTitle>
          {latestSidebar
            .filter((n) => n.slug !== slug)
            .slice(0, 12)
            .map((n) => <TextNews key={n.id} news={n} />)}
        </aside>
      </div>

      {/* ── SIMILAR NEWS ── */}
      <section className="mt-12">
        <SectionTitle>{t('detail.similarNews')}</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {loadSimilar
            ? Array(5).fill(0).map((_, i) => <SkeletonCard key={i} />)
            : similar
                .filter((n) => n.slug !== slug)
                .slice(0, 15)
                .map((n) => <ImageTopNews key={n.id} news={n} />)}
        </div>
      </section>
    </div>
  );
};
