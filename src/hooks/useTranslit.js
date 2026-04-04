import { useTranslation } from 'react-i18next';
import { latinToCyrillic, transliterateHtml } from '../utils/transliterate';

/**
 * Returns transliteration helpers bound to the current language.
 * When language is 'uz-cyrillic', text is converted Latin → Cyrillic.
 * Otherwise the original string is returned as-is.
 *
 * tr(text)     — plain string
 * trHtml(html) — HTML-safe (preserves tags/attrs)
 */
export const useTranslit = () => {
  const { i18n } = useTranslation();
  const active = i18n.language === 'uz-cyrillic';

  return {
    tr:     (text) => active ? latinToCyrillic(text ?? '') : (text ?? ''),
    trHtml: (html) => active ? transliterateHtml(html ?? '') : (html ?? ''),
  };
};
