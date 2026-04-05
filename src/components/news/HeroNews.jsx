import { Link } from 'react-router-dom';
import { Eye, Heart, Clock, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatDate } from '../../utils/date';
import { formatViews, truncate } from '../../utils/formatters';
import { Badge } from '../ui/Badge';
import { LazyImage } from '../ui/LazyImage';
import { useTranslit } from '../../hooks/useTranslit';

export const HeroNews = ({ news }) => {
  const { t } = useTranslation();
  const { tr } = useTranslit();
  if (!news) return null;
  const cover = news.images?.[0]?.url;

  return (
    <Link
      to={`/news/${news.slug}`}
      className="group relative block rounded-2xl overflow-hidden"
      style={{
        minHeight: 420,
        boxShadow: 'var(--shadow-lg)',
      }}
    >
      {/* Full-bleed image */}
      <div className="absolute inset-0">
        <LazyImage
          src={cover}
          alt={tr(news.title)}
          className="w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out"
        />
      </div>

      {/* Multi-stop gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.15) 75%, transparent 100%)',
        }}
      />

      {/* Top: category badge */}
      {news.category && (
        <div className="absolute top-5 left-5 z-10">
          <Badge variant="glass">{tr(news.category.name)}</Badge>
        </div>
      )}

      {/* Bottom: content */}
      <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 z-10">
        <h2
          className="text-white font-black leading-tight mb-3 line-clamp-3 group-hover:text-red-300 transition-colors duration-300"
          style={{ fontSize: 'clamp(1.25rem, 3vw, 1.875rem)', letterSpacing: '-0.02em' }}
        >
          {tr(news.title)}
        </h2>

        {news.shortDescription && (
          <p className="text-white/70 text-sm leading-relaxed line-clamp-2 mb-4 max-w-2xl">
            {truncate(tr(news.shortDescription), 160)}
          </p>
        )}

        {/* Meta row */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-4 text-white/60 text-xs font-medium">
            <span className="flex items-center gap-1.5">
              <Clock size={12} /> {formatDate(news.createdAt)}
            </span>
            <span className="flex items-center gap-1.5">
              <Eye size={12} /> {formatViews(news.viewCount)}
            </span>
            <span className="flex items-center gap-1.5">
              <Heart size={12} /> {formatViews(news.likeCount)}
            </span>
          </div>
          <span className="flex items-center gap-1.5 text-xs font-bold text-red-400 group-hover:text-red-300 group-hover:gap-2.5 transition-all duration-200">
            {t('news.readMore')} <ArrowRight size={13} />
          </span>
        </div>
      </div>
    </Link>
  );
};
