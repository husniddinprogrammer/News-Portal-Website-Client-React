import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { formatDate } from '../../utils/date';
import { formatViews, truncate } from '../../utils/formatters';

export const TextNews = ({ news }) => {
  if (!news) return null;

  return (
    <Link
      to={`/news/${news.slug}`}
      className="group flex gap-3 py-3 border-b transition-all duration-200 hover:bg-red-50/30 -mx-2 px-2 rounded-lg"
      style={{ borderColor: 'var(--border)' }}
    >
      {/* Left red accent dot */}
      <div className="mt-1.5 w-2 h-2 rounded-full bg-red-500 shrink-0 group-hover:scale-125 transition-transform duration-200" />

      <div className="flex-1 min-w-0">
        <h4
          className="text-sm font-semibold leading-snug mb-1.5 group-hover:text-red-600 transition-colors duration-200 line-clamp-2"
          style={{ color: 'var(--text)' }}
        >
          {truncate(news.title, 100)}
        </h4>
        <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
          <div className="flex items-center gap-2">
            {news.category && (
              <span className="font-semibold text-red-500">{news.category.name}</span>
            )}
            <span>{formatDate(news.createdAt)}</span>
          </div>
          <span className="flex items-center gap-1">
            <Eye size={11} /> {formatViews(news.viewCount)}
          </span>
        </div>
      </div>
    </Link>
  );
};
