import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { useThemeStore } from './store/useThemeStore';
import { ScrollToTop } from './components/ScrollToTop';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import './i18n';

// ─── Lazy-loaded pages (code splitting per route) ───────────────────────────
const HomePage       = lazy(() => import('./pages/HomePage').then((m) => ({ default: m.HomePage })));
const SortPage       = lazy(() => import('./pages/SortPage').then((m) => ({ default: m.SortPage })));
const SearchPage     = lazy(() => import('./pages/SearchPage').then((m) => ({ default: m.SearchPage })));
const CategoryPage   = lazy(() => import('./pages/CategoryPage').then((m) => ({ default: m.CategoryPage })));
const HashtagPage    = lazy(() => import('./pages/HashtagPage').then((m) => ({ default: m.HashtagPage })));
const NewsDetailPage = lazy(() => import('./pages/NewsDetailPage').then((m) => ({ default: m.NewsDetailPage })));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const PageLoader = () => (
  <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
  </div>
);

const ThemeInit = () => {
  const init = useThemeStore((s) => s.init);
  useEffect(() => { init(); }, [init]);
  return null;
};

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ThemeInit />
          <ScrollToTop />
          <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
            <Navbar />
            <main>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/"               element={<HomePage />} />
                  <Route path="/search"         element={<SearchPage />} />
                  <Route path="/news"           element={<SortPage />} />
                  <Route path="/category/:slug" element={<CategoryPage />} />
                  <Route path="/hashtag/:slug"  element={<HashtagPage />} />
                  <Route path="/news/:slug"     element={<NewsDetailPage />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
