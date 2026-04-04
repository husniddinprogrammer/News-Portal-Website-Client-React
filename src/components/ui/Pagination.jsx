import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Pagination = ({ pagination, onPage }) => {
  if (!pagination || pagination.totalPages <= 1) return null;

  const { page, totalPages } = pagination;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2
  );

  const btnBase =
    'w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-all';
  const active = 'bg-red-600 text-white shadow-sm';
  const inactive = 'hover:bg-red-50 hover:text-red-600';

  let prev = null;
  return (
    <div className="flex items-center justify-center gap-1 mt-8">
      <button
        disabled={page <= 1}
        onClick={() => onPage(page - 1)}
        className={`${btnBase} ${inactive} disabled:opacity-30`}
        style={{ color: 'var(--text-muted)' }}
      >
        <ChevronLeft size={18} />
      </button>

      {pages.map((p) => {
        const gap = prev !== null && p - prev > 1;
        prev = p;
        return (
          <span key={p} className="flex items-center gap-1">
            {gap && <span className="w-6 text-center text-gray-400">…</span>}
            <button
              onClick={() => onPage(p)}
              className={`${btnBase} ${p === page ? active : inactive}`}
              style={p !== page ? { color: 'var(--text)' } : {}}
            >
              {p}
            </button>
          </span>
        );
      })}

      <button
        disabled={page >= totalPages}
        onClick={() => onPage(page + 1)}
        className={`${btnBase} ${inactive} disabled:opacity-30`}
        style={{ color: 'var(--text-muted)' }}
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
};
