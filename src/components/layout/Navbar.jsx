import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Sun, Moon, Globe, X, Menu, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '../../store/useThemeStore';
import { useCategories } from '../../hooks/useCategories';
import { useTranslit } from '../../hooks/useTranslit';

import { LANGUAGES } from '../../i18n';
import i18n from '../../i18n';

export const Navbar = () => {
  const { t } = useTranslation();
  const { tr } = useTranslit();
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
  const searchInputRef = useRef(null);

  const handleSearchChange = (val) => {
    setSearchVal(val);
    clearTimeout(searchTimerRef.current);
    if (val.trim()) {
      searchTimerRef.current = setTimeout(() => {
        navigate(`/search?search=${encodeURIComponent(val.trim())}`);
      }, 500);
    }
  };

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

  /* ── Icon button base styles ── */
  const iconBtn =
    'p-2 rounded-xl transition-all duration-150 hover:scale-105 active:scale-95';

  return (
    <nav
      className="sticky top-0 z-50"
      style={{
        background: 'var(--nav-bg)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border)',
        boxShadow: 'var(--shadow-xs)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center h-[60px] gap-3">

          {/* ── Logo ── */}
          <Link
            to="/"
            className="flex items-center gap-2.5 shrink-0 group"
          >
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-105"
              style={{
                background: 'var(--red)',
                boxShadow: 'var(--shadow-red)',
              }}
            >
              <span className="text-white font-black text-sm leading-none">N</span>
            </div>
            <div className="hidden sm:block leading-none">
              <span className="font-black text-[17px]" style={{ color: 'var(--text)' }}>News</span>
              <span className="font-black text-[17px]" style={{ color: 'var(--red)' }}>Portal</span>
            </div>
          </Link>

          {/* ── Divider ── */}
          <div
            className="hidden lg:block w-px h-5 shrink-0 mx-1"
            style={{ background: 'var(--border)' }}
          />

          {/* ── Categories (desktop) ── */}
          <nav className="hidden lg:flex items-center gap-0.5 flex-1 overflow-hidden">
            {categories.slice(0, 7).map((cat) => {
              const active = isActive(cat.slug);
              return (
                <Link
                  key={cat.id}
                  to={`/category/${cat.slug}`}
                  className="px-3 py-1.5 text-[13px] rounded-lg whitespace-nowrap font-semibold transition-all duration-150"
                  style={
                    active
                      ? { background: 'var(--red)', color: '#fff', boxShadow: 'var(--shadow-red)' }
                      : { color: 'var(--text-muted)' }
                  }
                  onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = 'var(--red-light)'; e.currentTarget.style.color = 'var(--red)'; }}}
                  onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = ''; e.currentTarget.style.color = 'var(--text-muted)'; }}}
                >
                  {tr(cat.name)}
                </Link>
              );
            })}
          </nav>

          {/* ── Right controls ── */}
          <div className="ml-auto flex items-center gap-0.5">

            {/* Search */}
            {searchOpen ? (
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-200"
                style={{
                  background: 'var(--bg-secondary)',
                  borderColor: 'var(--red)',
                  boxShadow: '0 0 0 3px var(--red-muted)',
                }}
              >
                <Search size={14} style={{ color: 'var(--red)' }} className="shrink-0" />
                <input
                  ref={searchInputRef}
                  autoFocus
                  value={searchVal}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder={t('nav.search')}
                  className="outline-none bg-transparent text-[13px] w-36 sm:w-52 font-medium placeholder:font-normal"
                  style={{ color: 'var(--text)' }}
                  onKeyDown={(e) => e.key === 'Escape' && closeSearch()}
                />
                <button
                  onClick={closeSearch}
                  className="hover:text-red-600 transition-colors duration-150"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setSearchOpen(true); navigate('/search', { replace: true }); }}
                className={iconBtn}
                style={{ color: 'var(--text-muted)' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--red-light)'; e.currentTarget.style.color = 'var(--red)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = ''; e.currentTarget.style.color = 'var(--text-muted)'; }}
                title="Qidirish"
              >
                <Search size={18} />
              </button>
            )}

            {/* Theme toggle */}
            <button
              onClick={toggle}
              className={iconBtn}
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--red-light)'; e.currentTarget.style.color = dark ? '#fbbf24' : 'var(--red)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = ''; e.currentTarget.style.color = 'var(--text-muted)'; }}
              title={dark ? "Yorug' rejim" : "Qorong'u rejim"}
            >
              {dark
                ? <Sun size={18} className="text-amber-400" />
                : <Moon size={18} />
              }
            </button>

            {/* Language selector */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangOpen((v) => !v)}
                className={`${iconBtn} flex items-center gap-1 px-2.5 text-xs font-bold`}
                style={{ color: 'var(--text-muted)' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--red-light)'; e.currentTarget.style.color = 'var(--red)'; }}
                onMouseLeave={(e) => { if (!langOpen) { e.currentTarget.style.background = ''; e.currentTarget.style.color = 'var(--text-muted)'; } }}
              >
                <Globe size={16} />
                <span className="hidden sm:block">{currentLang.short}</span>
                <ChevronDown
                  size={11}
                  className="transition-transform duration-200"
                  style={{ transform: langOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                />
              </button>

              {langOpen && (
                <div
                  className="absolute right-0 top-full mt-2 rounded-2xl overflow-hidden z-50 min-w-[160px]"
                  style={{
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    boxShadow: 'var(--shadow-xl)',
                  }}
                >
                  {LANGUAGES.map((lang) => {
                    const isSelected = lang.code === i18n.language;
                    return (
                      <button
                        key={lang.code}
                        onClick={() => { i18n.changeLanguage(lang.code); setLangOpen(false); }}
                        className="w-full px-4 py-2.5 text-sm text-left flex items-center gap-3 transition-all duration-150"
                        style={
                          isSelected
                            ? { background: 'var(--red-light)', color: 'var(--red)', fontWeight: 700 }
                            : { color: 'var(--text)' }
                        }
                        onMouseEnter={(e) => { if (!isSelected) { e.currentTarget.style.background = 'var(--bg-secondary)'; }}}
                        onMouseLeave={(e) => { if (!isSelected) { e.currentTarget.style.background = ''; }}}
                      >
                        <span className="font-black text-xs w-5 text-red-500">{lang.short}</span>
                        <span>{lang.label}</span>
                        {isSelected && (
                          <span className="ml-auto text-red-500 text-xs font-black">✓</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Mobile menu */}
            <button
              className={`${iconBtn} lg:hidden`}
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--red-light)'; e.currentTarget.style.color = 'var(--red)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = ''; e.currentTarget.style.color = 'var(--text-muted)'; }}
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* ── Mobile categories ── */}
        {mobileOpen && (
          <div
            className="lg:hidden py-3 border-t"
            style={{ borderColor: 'var(--border)' }}
          >
            <div className="flex flex-wrap gap-2 pb-1">
              <Link
                to="/"
                className="px-3 py-1.5 text-[13px] rounded-lg font-semibold border transition-all duration-150 hover:border-red-300 hover:text-red-600 hover:bg-red-50"
                style={{ color: 'var(--text-muted)', borderColor: 'var(--border)', background: 'var(--card)' }}
              >
                {t('nav.home')}
              </Link>
              {categories.map((cat) => {
                const active = isActive(cat.slug);
                return (
                  <Link
                    key={cat.id}
                    to={`/category/${cat.slug}`}
                    className="px-3 py-1.5 text-[13px] rounded-lg font-semibold border transition-all duration-150"
                    style={
                      active
                        ? { background: 'var(--red)', color: '#fff', borderColor: 'var(--red)' }
                        : { color: 'var(--text-muted)', borderColor: 'var(--border)', background: 'var(--card)' }
                    }
                  >
                    {tr(cat.name)}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
