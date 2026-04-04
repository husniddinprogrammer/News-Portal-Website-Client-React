import { Link } from 'react-router-dom';
import { Eye, Heart, Clock } from 'lucide-react';
import { formatDate } from '../../utils/date';
import { formatViews, truncate } from '../../utils/formatters';
import { Badge } from '../ui/Badge';
import { LazyImage } from '../ui/LazyImage';

export const HeroNews = ({ news }) => {
  if (!news) return null;
  const cover = news.images?.[0]?.url;

  return (
    <Link
      to={`/news/${news.slug}`}
      className="group flex flex-col md:flex-row rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-0.5"
      style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
    >
      {/* Image — full on mobile, 55% on md */}
      <div className="relative w-full md:w-[55%] shrink-0 overflow-hidden" style={{ minHeight: 220 }}>
        <LazyImage
          src={cover}
          alt={news.title}
          className="absolute inset-0 w-full h-full group-hover:scale-105 transition-transform duration-700"
          style={{ position: 'absolute', inset: 0 }}
        />
        {/* Red accent bar on left edge */}
        <div className="hidden md:block absolute left-0 top-0 bottom-0 w-1 bg-red-600 z-10" />
      </div>

      {/* Content */}
      <div className="flex flex-col justify-between p-5 md:p-7 flex-1 gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          {news.category && <Badge>{news.category.name}</Badge>}
        </div>

        <div>
          <h2
            className="text-xl md:text-2xl font-black leading-tight mb-3 group-hover:text-red-600 transition-colors duration-200 line-clamp-3"
            style={{ color: 'var(--text)' }}
          >
            {news.title}
          </h2>
          {news.shortDescription && (
            <p className="text-sm leading-relaxed line-clamp-3" style={{ color: 'var(--text-muted)' }}>
              {truncate(news.shortDescription, 180)}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--text-muted)' }}>
            <span className="flex items-center gap-1.5"><Clock size={13} /> {formatDate(news.createdAt)}</span>
            <span className="flex items-center gap-1.5"><Eye size={13} /> {formatViews(news.viewCount)}</span>
            <span className="flex items-center gap-1.5"><Heart size={13} /> {formatViews(news.likeCount)}</span>
          </div>
          <span className="text-xs font-bold text-red-600 group-hover:gap-2 flex items-center gap-1 transition-all duration-200">
            Batafsil →
          </span>
        </div>
      </div>
    </Link>
  );
};
