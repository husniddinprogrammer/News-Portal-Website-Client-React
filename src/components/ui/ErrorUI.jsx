import { AlertCircle, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const ErrorUI = ({ message, onRetry }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
      <AlertCircle size={48} className="text-red-500" />
      <p className="font-medium" style={{ color: 'var(--text)' }}>
        {message || t('common.error')}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors"
        >
          <RefreshCw size={16} />
          {t('common.retry')}
        </button>
      )}
    </div>
  );
};
