import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { formatDate } from '../../utils/date';
import { formatViews, truncate } from '../../utils/formatters';
import { Badge } from '../ui/Badge';
import { LazyImage } from '../ui/LazyImage';

export const ImageLeftNews = ({ news }) => {
  if (!news) return null;
  const cover = news.images?.[0]?.url;

  return (
    <Link
      to={`/news/${news.slug}`}
      className="group flex gap-3 py-3 border-b transition-all duration-200 hover:bg-red-50/30 -mx-2 px-2 rounded-lg"
      style={{ borderColor: 'var(--border)' }}
    >
      {/* 16:9 thumbnail */}
      <div
        className="relative shrink-0 rounded-lg overflow-hidden"
        style={{ width: 112, height: 63 }}
      >
        <LazyImage
          src={cover}
          alt={news.title}
          className="w-full h-full group-hover:scale-110 transition-transform duration-300"
        />
      </div>

      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          {news.category && <Badge>{news.category.name}</Badge>}
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {formatDate(news.createdAt)}
          </span>
          <span className="flex items-center gap-1 text-xs ml-auto" style={{ color: 'var(--text-muted)' }}>
            <Eye size={11} /> {formatViews(news.viewCount)}
          </span>
        </div>
        <h4
          className="text-sm font-semibold leading-snug group-hover:text-red-600 transition-colors duration-200 line-clamp-2"
          style={{ color: 'var(--text)' }}
        >
          {truncate(news.title, 100)}
        </h4>
      </div>
    </Link>
  );
};
