import { Link } from 'react-router-dom';
import { Eye, Heart } from 'lucide-react';
import { formatDate } from '../../utils/date';
import { formatViews, truncate } from '../../utils/formatters';
import { Badge } from '../ui/Badge';
import { LazyImage } from '../ui/LazyImage';
import { useTranslit } from '../../hooks/useTranslit';

export const ImageTopNews = ({ news }) => {
  const { tr } = useTranslit();
  if (!news) return null;
  const cover = news.images?.[0]?.url;

  return (
    <Link
      to={`/news/${news.slug}`}
      className="group flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
      style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
    >
      {/* 16:9 Image with overlay */}
      <div className="relative overflow-hidden" style={{ paddingTop: '56.25%' }}>
        <div className="absolute inset-0">
          <LazyImage
            src={cover}
            alt={tr(news.title)}
            className="w-full h-full group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        </div>

        {/* Gradient — always visible at bottom */}
        <div
          className="absolute inset-x-0 bottom-0 h-2/3 pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.52) 0%, transparent 100%)' }}
        />

        {/* Category badge */}
        {news.category && (
          <div className="absolute top-3 left-3 z-10">
            <Badge>{tr(news.category.name)}</Badge>
          </div>
        )}

        {/* Date overlaid on image */}
        <div className="absolute bottom-2.5 left-3 z-10">
          <span className="text-white/80 text-xs font-medium">
            {formatDate(news.createdAt)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <h3
          className="text-sm font-bold leading-snug line-clamp-2 group-hover:text-red-600 transition-colors duration-200 flex-1"
          style={{ color: 'var(--text)', letterSpacing: '-0.01em' }}
        >
          {tr(news.title)}
        </h3>

        {/* Stats */}
        <div
          className="flex items-center gap-3 text-xs pt-1"
          style={{
            color: 'var(--text-muted)',
            borderTop: '1px solid var(--border-light)',
          }}
        >
          <span className="flex items-center gap-1">
            <Eye size={11} /> {formatViews(news.viewCount)}
          </span>
          <span className="flex items-center gap-1">
            <Heart size={11} /> {formatViews(news.likeCount)}
          </span>
        </div>
      </div>
    </Link>
  );
};
