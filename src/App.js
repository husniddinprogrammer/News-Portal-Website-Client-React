import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useThemeStore } from './store/useThemeStore';
import { ScrollToTop } from './components/ScrollToTop';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { SortPage } from './pages/SortPage';
import { CategoryPage } from './pages/CategoryPage';
import { HashtagPage } from './pages/HashtagPage';
import { NewsDetailPage } from './pages/NewsDetailPage';
import './i18n';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const ThemeInit = () => {
  const init = useThemeStore((s) => s.init);
  useEffect(() => { init(); }, [init]);
  return null;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeInit />
        <ScrollToTop />
        <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/news" element={<SortPage />} />
              <Route path="/category/:slug" element={<CategoryPage />} />
              <Route path="/hashtag/:slug" element={<HashtagPage />} />
              <Route path="/news/:slug" element={<NewsDetailPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
