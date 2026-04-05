import { AlertCircle, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const ErrorUI = ({ message, onRetry }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-5 text-center">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center"
        style={{ background: 'var(--red-light)' }}
      >
        <AlertCircle size={32} className="text-red-500" />
      </div>
      <div>
        <p className="font-bold text-base mb-1" style={{ color: 'var(--text)' }}>
          {t('common.error')}
        </p>
        {message && (
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{message}</p>
        )}
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 active:scale-95 transition-all duration-150"
          style={{ boxShadow: 'var(--shadow-red)' }}
        >
          <RefreshCw size={15} />
          {t('common.retry')}
        </button>
      )}
    </div>
  );
};
