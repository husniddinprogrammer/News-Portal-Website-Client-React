import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export const SectionTitle = ({ children, more }) => (
  <div className="flex items-center justify-between mb-5">
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1">
        <div className="w-1.5 h-6 bg-red-600 rounded-full" />
        <div className="w-1 h-4 bg-red-300 rounded-full" />
      </div>
      <h2 className="text-lg font-black tracking-tight" style={{ color: 'var(--text)' }}>
        {children}
      </h2>
    </div>
    {more && (
      <Link
        to={more}
        className="flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 transition-colors duration-200 group"
      >
        Ko'proq
        <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform duration-200" />
      </Link>
    )}
  </div>
);
