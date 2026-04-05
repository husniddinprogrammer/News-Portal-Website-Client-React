import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, Phone } from 'lucide-react';
import { useCategories } from '../../hooks/useCategories';
import { useTranslit } from '../../hooks/useTranslit';

/* ── Social SVG icons ── */
const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
  </svg>
);

const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const SocialLink = ({ href, title, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    title={title}
    className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-150 hover:-translate-y-0.5"
    style={{ background: 'var(--bg)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = 'var(--red)';
      e.currentTarget.style.color = '#fff';
      e.currentTarget.style.borderColor = 'var(--red)';
      e.currentTarget.style.boxShadow = 'var(--shadow-red)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = 'var(--bg)';
      e.currentTarget.style.color = 'var(--text-muted)';
      e.currentTarget.style.borderColor = 'var(--border)';
      e.currentTarget.style.boxShadow = '';
    }}
  >
    {children}
  </a>
);

export const Footer = () => {
  const { t } = useTranslation();
  const { tr } = useTranslit();
  const { data: categories = [] } = useCategories();
  const year = new Date().getFullYear();

  return (
    <footer
      className="mt-20"
      style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-secondary)' }}
    >
      {/* Red accent line */}
      <div
        className="h-[3px]"
        style={{ background: 'linear-gradient(90deg, var(--red) 0%, #f87171 50%, var(--red) 100%)' }}
      />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">

          {/* ── Brand column ── */}
          <div>
            <Link to="/" className="flex items-center gap-2.5 mb-4 w-fit group">
              <img
                src="/logo192.png"
                alt="NewsPortal logo"
                width={36}
                height={36}
                className="rounded-xl transition-transform duration-200 group-hover:scale-105"
                style={{ boxShadow: 'var(--shadow-red)' }}
              />
              <span className="font-black text-xl" style={{ color: 'var(--text)' }}>
                News<span style={{ color: 'var(--red)' }}>Portal</span>
              </span>
            </Link>

            <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--text-muted)' }}>
              {t('footer.tagline')}
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-2">
              <SocialLink href="https://t.me/Husniddin301515" title="Telegram">
                <TelegramIcon />
              </SocialLink>
              <SocialLink href="https://github.com/husniddinprogrammer" title="GitHub">
                <GithubIcon />
              </SocialLink>
              <SocialLink href="https://www.linkedin.com/in/husniddin-mahmudov-25225b220" title="LinkedIn">
                <LinkedinIcon />
              </SocialLink>
            </div>
          </div>

          {/* ── Categories column ── */}
          <div>
            <p
              className="text-xs font-extrabold uppercase tracking-widest mb-4"
              style={{ color: 'var(--red)' }}
            >
              {t('footer.categoriesTitle')}
            </p>
            <div className="space-y-2">
              {categories.slice(0, 7).map((cat) => (
                <Link
                  key={cat.id}
                  to={`/category/${cat.slug}`}
                  className="flex items-center gap-2 text-sm transition-all duration-150 group w-fit"
                  style={{ color: 'var(--text-muted)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--red)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
                >
                  <span
                    className="w-1 h-1 rounded-full shrink-0 bg-current opacity-40 group-hover:opacity-100 transition-opacity"
                  />
                  {tr(cat.name)}
                </Link>
              ))}
            </div>
          </div>

          {/* ── Contact column ── */}
          <div>
            <p
              className="text-xs font-extrabold uppercase tracking-widest mb-4"
              style={{ color: 'var(--red)' }}
            >
              {t('footer.contactTitle')}
            </p>
            <div className="space-y-3">
              {[
                { href: 'mailto:husniddinprogrammer@gmail.com', icon: <Mail size={14} />, label: 'husniddinprogrammer@gmail.com' },
                { href: 'tel:+998915604085', icon: <Phone size={14} />, label: '+998 91 560 40 85' },
                { href: 'https://t.me/Husniddin301515', icon: <TelegramIcon />, label: '@Husniddin301515', external: true },
              ].map(({ href, icon, label, external }) => (
                <a
                  key={href}
                  href={href}
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="flex items-center gap-2.5 text-sm transition-all duration-150 w-fit"
                  style={{ color: 'var(--text-muted)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--red)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
                >
                  <span className="shrink-0">{icon}</span>
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 text-xs"
          style={{ borderTop: '1px solid var(--border)', color: 'var(--text-faint)' }}
        >
          <p>© {year} NewsPortal. {t('footer.rights')}.</p>
          <p>Made with ❤️ in Uzbekistan</p>
        </div>
      </div>
    </footer>
  );
};
