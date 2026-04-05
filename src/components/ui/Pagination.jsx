import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Pagination = ({ pagination, onPage }) => {
  if (!pagination || pagination.totalPages <= 1) return null;

  const { page, totalPages } = pagination;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  );

  const controlBase =
    'w-9 h-9 flex items-center justify-center rounded-xl text-sm font-semibold transition-all duration-150 border';

  let prev = null;

  return (
    <div className="flex items-center justify-center gap-1.5 mt-10">
      <button
        disabled={page <= 1}
        onClick={() => onPage(page - 1)}
        className={`${controlBase} disabled:opacity-30 disabled:cursor-not-allowed hover:border-red-500 hover:text-red-600`}
        style={{ color: 'var(--text-muted)', borderColor: 'var(--border)', background: 'var(--card)' }}
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map((p) => {
        const showEllipsis = prev !== null && p - prev > 1;
        prev = p;
        const isActive = p === page;
        return (
          <span key={p} className="flex items-center gap-1.5">
            {showEllipsis && (
              <span
                className="w-9 h-9 flex items-center justify-center text-sm"
                style={{ color: 'var(--text-faint)' }}
              >
                ···
              </span>
            )}
            <button
              onClick={() => onPage(p)}
              className={`${controlBase} ${!isActive ? 'hover:border-red-500 hover:text-red-600' : ''}`}
              style={
                isActive
                  ? { background: 'var(--red)', color: '#fff', borderColor: 'var(--red)', boxShadow: 'var(--shadow-red)' }
                  : { background: 'var(--card)', color: 'var(--text)', borderColor: 'var(--border)' }
              }
            >
              {p}
            </button>
          </span>
        );
      })}

      <button
        disabled={page >= totalPages}
        onClick={() => onPage(page + 1)}
        className={`${controlBase} disabled:opacity-30 disabled:cursor-not-allowed hover:border-red-500 hover:text-red-600`}
        style={{ color: 'var(--text-muted)', borderColor: 'var(--border)', background: 'var(--card)' }}
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};
