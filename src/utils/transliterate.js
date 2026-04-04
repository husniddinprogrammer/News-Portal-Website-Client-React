/**
 * Uzbek Latin → Cyrillic transliterator
 *
 * Handles:
 *  - Digraphs : sh → ш, ch → ч, ng → нг (case-aware)
 *  - Specials  : o' → ў, g' → ғ  (all apostrophe variants)
 *  - Singles   : complete a-z / A-Z mapping
 *  - HTML      : transliterateHtml — only text nodes, tags & attrs preserved
 *  - Pass-through: digits, punctuation, Cyrillic/Arabic chars unchanged
 */

// ─── Apostrophe variants ────────────────────────────────────────────────────
const APOS = new Set(["'", "\u2018", "\u2019", "\u02BB", "\u02BC", "`", "\u0060"]);

// ─── Single character map (Latin → Cyrillic) ────────────────────────────────
const MAP = {
  A:'А', B:'Б', D:'Д', E:'Е', F:'Ф', G:'Г', H:'Ҳ',
  I:'И', J:'Ж', K:'К', L:'Л', M:'М', N:'Н', O:'О',
  P:'П', Q:'Қ', R:'Р', S:'С', T:'Т', U:'У', V:'В',
  W:'В', X:'Х', Y:'Й', Z:'З',
  a:'а', b:'б', d:'д', e:'е', f:'ф', g:'г', h:'ҳ',
  i:'и', j:'ж', k:'к', l:'л', m:'м', n:'н', o:'о',
  p:'п', q:'қ', r:'р', s:'с', t:'т', u:'у', v:'в',
  w:'в', x:'х', y:'й', z:'з',
};

// ─── Core converter ──────────────────────────────────────────────────────────
export const latinToCyrillic = (text) => {
  if (!text || typeof text !== 'string') return text;

  const out = [];
  let i = 0;
  const len = text.length;

  while (i < len) {
    const c  = text[i];
    const cl = c.toLowerCase();
    const n  = i + 1 < len ? text[i + 1] : '';
    const nl = n.toLowerCase();

    /* ── o' / O' ─────────────────── */
    if (cl === 'o' && APOS.has(n)) {
      out.push(c === 'O' ? 'Ў' : 'ў');
      i += 2; continue;
    }

    /* ── g' / G' ─────────────────── */
    if (cl === 'g' && APOS.has(n)) {
      out.push(c === 'G' ? 'Ғ' : 'ғ');
      i += 2; continue;
    }

    /* ── SH / Sh / sh ────────────── */
    if (cl === 's' && nl === 'h') {
      out.push(c === 'S' ? 'Ш' : 'ш');
      i += 2; continue;
    }

    /* ── CH / Ch / ch ────────────── */
    if (cl === 'c' && nl === 'h') {
      out.push(c === 'C' ? 'Ч' : 'ч');
      i += 2; continue;
    }

    /* ── NG / Ng / ng ────────────── */
    if (cl === 'n' && nl === 'g') {
      if (c === 'N' && n === 'G') out.push('НГ');
      else if (c === 'N')         out.push('Нг');
      else                        out.push('нг');
      i += 2; continue;
    }

    /* ── single char ─────────────── */
    out.push(MAP[c] ?? c);
    i++;
  }

  return out.join('');
};

// ─── HTML-safe converter ─────────────────────────────────────────────────────
// Replaces text nodes only; HTML tags, attributes, entities stay intact.
export const transliterateHtml = (html) => {
  if (!html || typeof html !== 'string') return html;

  // Split on HTML tags — odd indices are tags/comments, even are text nodes
  return html
    .split(/(<[^>]*>)/g)
    .map((chunk, idx) => (idx % 2 === 0 ? latinToCyrillic(chunk) : chunk))
    .join('');
};

// ─── Deep-object converter ────────────────────────────────────────────────────
// Recursively walks an object/array and transliterates every string value.
export const transliterateDeep = (value) => {
  if (typeof value === 'string')  return latinToCyrillic(value);
  if (Array.isArray(value))       return value.map(transliterateDeep);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, transliterateDeep(v)])
    );
  }
  return value;
};
