import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/date';
import { truncate } from '../../utils/formatters';
import { Badge } from '../ui/Badge';
import { LazyImage } from '../ui/LazyImage';

export const ImageTopNews = ({ news }) => {
  if (!news) return null;
  const cover = news.images?.[0]?.url;

  return (
    <Link
      to={`/news/${news.slug}`}
      className="group block rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
      style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
    >
      {/* 16:9 Image */}
      <div className="relative overflow-hidden" style={{ paddingTop: '56.25%' }}>
        <div className="absolute inset-0">
          <LazyImage src={cover} alt={news.title} className="w-full h-full group-hover:scale-105 transition-transform duration-500" />
        </div>
        {news.category && (
          <div className="absolute top-2 left-2 z-10">
            <Badge>{news.category.name}</Badge>
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-3">
        <p className="text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
          {formatDate(news.createdAt)}
        </p>
        <h3
          className="text-sm font-bold leading-snug mb-1.5 group-hover:text-red-600 transition-colors duration-200 line-clamp-2"
          style={{ color: 'var(--text)' }}
        >
          {news.title}
        </h3>
        {news.shortDescription && (
          <p className="text-xs leading-relaxed line-clamp-2" style={{ color: 'var(--text-muted)' }}>
            {truncate(news.shortDescription, 100)}
          </p>
        )}
      </div>
    </Link>
  );
};
