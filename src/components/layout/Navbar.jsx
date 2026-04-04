import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Sun, Moon, Globe, X, Menu, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '../../store/useThemeStore';
import { useCategories } from '../../hooks/useCategories';

import { LANGUAGES } from '../../i18n';
import i18n from '../../i18n';

export const Navbar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { dark, toggle } = useThemeStore();
  const { data: categories = [] } = useCategories();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [langOpen, setLangOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const langRef = useRef(null);
  const searchTimerRef = useRef(null);

  // Search input o'zgarganda — timer bilan navigate
  const handleSearchChange = (val) => {
    setSearchVal(val);
    clearTimeout(searchTimerRef.current);
    if (val.trim()) {
      searchTimerRef.current = setTimeout(() => {
        navigate(`/search?search=${encodeURIComponent(val.trim())}`);
      }, 500);
    }
  };

  // Search yopilganda — pending timerni bekor qil
  const closeSearch = () => {
    clearTimeout(searchTimerRef.current);
    setSearchOpen(false);
    setSearchVal('');
  };

  useEffect(() => {
    const handler = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // /search sahifasida search ochiq qolsin, boshqasida yopilsin
  useEffect(() => {
    if (location.pathname === '/search') {
      setSearchOpen(true);
    } else {
      closeSearch();
      setMobileOpen(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const currentLang = LANGUAGES.find((l) => l.code === i18n.language) || LANGUAGES[0];

  const isActive = (slug) => location.pathname === `/category/${slug}`;

  return (
    <nav
      className="sticky top-0 z-50 backdrop-blur-sm"
      style={{
        background: dark ? 'rgba(15,23,42,0.95)' : 'rgba(255,255,255,0.95)',
        borderBottom: '1px solid var(--border)',
        boxShadow: '0 1px 8px rgba(0,0,0,0.08)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center h-16 gap-3">

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-9 h-9 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-200 group-hover:shadow-red-300 transition-all duration-200 group-hover:scale-105">
              <span className="text-white font-black text-base leading-none">N</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-black text-lg leading-none" style={{ color: 'var(--text)' }}>
                News
              </span>
              <span className="font-black text-lg leading-none text-red-600">Portal</span>
            </div>
          </Link>

          {/* ── Categories (desktop) ── */}
          <div className="hidden lg:flex items-center gap-0.5 flex-1 overflow-hidden">
            {categories.slice(0, 7).map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                className={`px-3 py-1.5 text-sm rounded-lg whitespace-nowrap font-medium transition-all duration-200 ${
                  isActive(cat.slug)
                    ? 'bg-red-600 text-white shadow-sm shadow-red-200'
                    : 'hover:bg-red-50 hover:text-red-600'
                }`}
                style={isActive(cat.slug) ? {} : { color: 'var(--text-muted)' }}
              >
                {cat.name}
              </Link>
            ))}
          </div>

          {/* ── Right controls ── */}
          <div className="ml-auto flex items-center gap-1">

            {/* Search */}
            {searchOpen ? (
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-200"
                style={{ background: 'var(--bg-secondary)', borderColor: '#dc2626' }}
              >
                <Search size={15} className="text-red-500 shrink-0" />
                <input
                  autoFocus
                  value={searchVal}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder={t('nav.search')}
                  className="outline-none bg-transparent text-sm w-36 sm:w-52"
                  style={{ color: 'var(--text)' }}
                  onKeyDown={(e) => e.key === 'Escape' && closeSearch()}
                />
                <button onClick={closeSearch}>
                  <X size={15} className="text-red-400 hover:text-red-600 transition-colors" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setSearchOpen(true); navigate('/search', { replace: true }); }}
                className="p-2 rounded-lg hover:bg-red-50 transition-all duration-200 hover:text-red-600"
                style={{ color: 'var(--text-muted)' }}
                title="Qidirish"
              >
                <Search size={19} />
              </button>
            )}

            {/* Theme */}
            <button
              onClick={toggle}
              className="p-2 rounded-lg hover:bg-red-50 transition-all duration-200 hover:text-red-600"
              style={{ color: 'var(--text-muted)' }}
              title={dark ? 'Yorug\' rejim' : 'Qorong\'u rejim'}
            >
              {dark
                ? <Sun size={19} className="text-amber-400" />
                : <Moon size={19} />
              }
            </button>

            {/* Language */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangOpen((v) => !v)}
                className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-red-50 transition-all duration-200 text-xs font-bold"
                style={{ color: 'var(--text-muted)' }}
              >
                <Globe size={17} />
                <span className="hidden sm:block">{currentLang.short}</span>
                <ChevronDown size={12} className={`transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`} />
              </button>

              {langOpen && (
                <div
                  className="absolute right-0 top-full mt-2 rounded-xl overflow-hidden shadow-2xl border z-50 min-w-max"
                  style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
                >
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => { i18n.changeLanguage(lang.code); setLangOpen(false); }}
                      className={`w-full px-5 py-3 text-sm text-left transition-all duration-150 flex items-center gap-3 ${
                        lang.code === i18n.language
                          ? 'bg-red-50 text-red-600 font-bold'
                          : 'hover:bg-red-50 hover:text-red-600'
                      }`}
                      style={lang.code !== i18n.language ? { color: 'var(--text)' } : {}}
                    >
                      <span className="font-black text-xs w-5">{lang.short}</span>
                      <span>{lang.label}</span>
                      {lang.code === i18n.language && <span className="ml-auto text-red-500">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile menu btn */}
            <button
              className="p-2 rounded-lg lg:hidden hover:bg-red-50 transition-all duration-200"
              style={{ color: 'var(--text-muted)' }}
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* ── Mobile categories dropdown ── */}
        {mobileOpen && (
          <div
            className="lg:hidden py-3 border-t"
            style={{ borderColor: 'var(--border)' }}
          >
            <div className="flex flex-wrap gap-2 pb-1">
              <Link
                to="/"
                className="px-3 py-1.5 text-sm rounded-lg font-medium border transition-all duration-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                style={{ color: 'var(--text-muted)', borderColor: 'var(--border)' }}
              >
                {t('nav.home')}
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/category/${cat.slug}`}
                  className={`px-3 py-1.5 text-sm rounded-lg font-medium border transition-all duration-200 ${
                    isActive(cat.slug)
                      ? 'bg-red-600 text-white border-red-600'
                      : 'hover:bg-red-50 hover:text-red-600 hover:border-red-200'
                  }`}
                  style={isActive(cat.slug) ? {} : { color: 'var(--text-muted)', borderColor: 'var(--border)' }}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
