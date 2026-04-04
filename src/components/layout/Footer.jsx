import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const Footer = () => {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}>
      {/* Top band */}
      <div className="h-1 bg-gradient-to-r from-red-600 via-red-400 to-red-600" />

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2.5 mb-3 group w-fit">
              <div className="w-9 h-9 bg-red-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-black text-base">N</span>
              </div>
              <span className="font-black text-xl" style={{ color: 'var(--text)' }}>
                News<span className="text-red-600">Portal</span>
              </span>
            </Link>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              O'zbekistonning eng so'nggi yangiliklari — tez, ishonchli, sifatli.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-sm mb-3 text-red-600 uppercase tracking-wider">Sahifalar</h4>
            <div className="space-y-2">
              {[
                { label: t('footer.about'), href: '#' },
                { label: t('footer.contact'), href: '#' },
                { label: t('footer.privacy'), href: '#' },
              ].map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="block text-sm transition-colors duration-200 hover:text-red-600"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-sm mb-3 text-red-600 uppercase tracking-wider">Aloqa</h4>
            <div className="space-y-1.5 text-sm" style={{ color: 'var(--text-muted)' }}>
              <p>info@newsportal.uz</p>
              <p>+998 71 000 00 00</p>
              <p>Toshkent, O'zbekiston</p>
            </div>
          </div>
        </div>

        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 text-xs"
          style={{ borderTop: '1px solid var(--border)', color: 'var(--text-muted)' }}
        >
          <p>© {year} NewsPortal. {t('footer.rights')}.</p>
          <p>Made with ❤️ in Uzbekistan</p>
        </div>
      </div>
    </footer>
  );
};
