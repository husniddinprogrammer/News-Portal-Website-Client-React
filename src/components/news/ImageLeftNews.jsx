import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { formatDate } from '../../utils/date';
import { formatViews, truncate } from '../../utils/formatters';
import { LazyImage } from '../ui/LazyImage';
import { useTranslit } from '../../hooks/useTranslit';

export const ImageLeftNews = ({ news }) => {
  const { tr } = useTranslit();
  if (!news) return null;
  const cover = news.images?.[0]?.url;

  return (
    <Link
      to={`/news/${news.slug}`}
      className="group flex gap-4 py-4 border-b transition-all duration-200"
      style={{ borderColor: 'var(--border)' }}
    >
      {/* Thumbnail — 16:9 */}
      <div
        className="relative shrink-0 rounded-xl overflow-hidden"
        style={{ width: 108, height: 68 }}
      >
        <LazyImage
          src={cover}
          alt={tr(news.title)}
          className="w-full h-full group-hover:scale-110 transition-transform duration-400 ease-out"
        />
      </div>

      {/* Text */}
      <div className="flex-1 flex flex-col justify-between min-w-0 py-0.5">
        <h4
          className="text-sm font-semibold leading-snug line-clamp-2 mb-1.5 group-hover:text-red-600 transition-colors duration-200"
          style={{ color: 'var(--text)', letterSpacing: '-0.01em' }}
        >
          {truncate(tr(news.title), 110)}
        </h4>

        <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
          {news.category && (
            <span className="font-semibold text-red-500 truncate" style={{ maxWidth: 80 }}>
              {tr(news.category.name)}
            </span>
          )}
          <span className="shrink-0">{formatDate(news.createdAt)}</span>
          <span className="ml-auto shrink-0 flex items-center gap-0.5">
            <Eye size={10} /> {formatViews(news.viewCount)}
          </span>
        </div>
      </div>
    </Link>
  );
};
