import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { latinToCyrillic, transliterateHtml } from '../utils/transliterate';

/**
 * Returns stable transliteration helpers bound to the current language.
 * Uses useCallback so tr/trHtml references only change when the language changes —
 * this makes them safe to use in useMemo/useCallback dependency arrays.
 *
 * tr(text)     — plain string: Latin → Cyrillic (or passthrough)
 * trHtml(html) — HTML-safe: only text nodes converted, tags preserved
 */
export const useTranslit = () => {
  const { i18n } = useTranslation();
  const active = i18n.language === 'uz-cyrillic';

  const tr = useCallback(
    (text) => (active ? latinToCyrillic(text ?? '') : (text ?? '')),
    [active],
  );

  const trHtml = useCallback(
    (html) => (active ? transliterateHtml(html ?? '') : (html ?? '')),
    [active],
  );

  return { tr, trHtml };
};
