import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/date';
import { truncate } from '../../utils/formatters';
import { useTranslit } from '../../hooks/useTranslit';

export const TextNews = ({ news }) => {
  const { tr } = useTranslit();
  if (!news) return null;

  return (
    <Link
      to={`/news/${news.slug}`}
      className="group flex gap-3.5 py-3.5 border-b transition-colors duration-150"
      style={{ borderColor: 'var(--border)' }}
    >
      {/* Red dot accent */}
      <div
        className="mt-[5px] shrink-0 w-1.5 h-1.5 rounded-full bg-red-500 transition-all duration-200 group-hover:scale-150 group-hover:shadow-sm"
        style={{ boxShadow: 'none', transitionProperty: 'transform, box-shadow' }}
      />

      <div className="flex-1 min-w-0">
        <h4
          className="text-[13.5px] font-semibold leading-snug mb-1.5 line-clamp-2 group-hover:text-red-600 transition-colors duration-200"
          style={{ color: 'var(--text)', letterSpacing: '-0.005em' }}
        >
          {truncate(tr(news.title), 100)}
        </h4>
        <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
          {news.category && (
            <span className="font-semibold text-red-500 truncate" style={{ maxWidth: 80 }}>
              {tr(news.category.name)}
            </span>
          )}
          <span className="shrink-0">{formatDate(news.createdAt)}</span>
        </div>
      </div>
    </Link>
  );
};
