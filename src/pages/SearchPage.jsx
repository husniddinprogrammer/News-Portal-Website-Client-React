import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNews } from '../hooks/useNews';
import { useDebounce } from '../hooks/useDebounce';
import { ImageTopNews } from '../components/news/ImageTopNews';
import { SectionTitle } from '../components/news/SectionTitle';
import { SkeletonCard } from '../components/ui/Skeleton';

export const SearchPage = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const debouncedSearch = useDebounce(searchQuery, 300);

  const { news, isLoading } = useNews({
    search: debouncedSearch,
    limit: 12,
    enabled: Boolean(debouncedSearch),
  });

  if (!searchQuery) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4 text-center">
        <Search size={52} className="text-red-200" />
        <p className="text-lg font-medium" style={{ color: 'var(--text-muted)' }}>
          Qidirish uchun yozing...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <SectionTitle>"{searchQuery}" — qidiruv natijalari</SectionTitle>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : news.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
          <Search size={48} className="text-red-200" />
          <p className="font-semibold" style={{ color: 'var(--text)' }}>Hech narsa topilmadi</p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            "{searchQuery}" bo'yicha natija yo'q
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {news.map((n) => <ImageTopNews key={n.id} news={n} />)}
        </div>
      )}
    </div>
  );
};
