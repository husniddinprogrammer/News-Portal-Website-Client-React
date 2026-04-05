import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const SectionTitle = ({ children, more }) => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-between mb-6">
      {/* Left: title with red accent bar */}
      <div className="flex items-center gap-3">
        <div
          className="w-1 h-6 rounded-full bg-red-600 shrink-0"
          style={{ boxShadow: '0 0 8px rgba(220,38,38,0.45)' }}
        />
        <h2
          className="text-base font-extrabold uppercase tracking-wider"
          style={{ color: 'var(--text)', letterSpacing: '0.06em' }}
        >
          {children}
        </h2>
      </div>

      {/* Right: "Ko'proq" link */}
      {more && (
        <Link
          to={more}
          className="flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 group transition-colors duration-200"
        >
          {t('common.more')}
          <ArrowRight
            size={13}
            className="group-hover:translate-x-0.5 transition-transform duration-200"
          />
        </Link>
      )}
    </div>
  );
};
