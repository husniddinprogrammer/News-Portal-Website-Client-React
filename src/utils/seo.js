export const SITE_NAME = 'NewsPortal';
export const SITE_URL = process.env.REACT_APP_SITE_URL || 'https://newsportal.uz';
export const DEFAULT_IMAGE = `${SITE_URL}/og-default.jpg`;
export const DEFAULT_DESCRIPTION =
  "O'zbekistonning eng so'nggi yangiliklari. Siyosat, iqtisodiyot, sport, texnologiya va boshqa sohalardagi xabarlar.";
export const DEFAULT_KEYWORDS =
  "yangiliklar, uzbekistan news, o'zbekiston, xabarlar, siyosat, iqtisodiyot, sport, texnologiya";

/** "Article title | NewsPortal" or fallback */
export const buildTitle = (title) =>
  title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — O'zbekiston yangiliklari`;

/** schema.org NewsArticle JSON-LD */
export const buildNewsJsonLd = (news) => ({
  '@context': 'https://schema.org',
  '@type': 'NewsArticle',
  headline: news.title,
  description: news.shortDescription || '',
  image: news.images?.map((img) => img.url).filter(Boolean) ?? [],
  datePublished: news.createdAt,
  dateModified: news.updatedAt || news.createdAt,
  author: news.author
    ? {
        '@type': 'Person',
        name: `${news.author.name ?? ''} ${news.author.surname ?? ''}`.trim(),
      }
    : { '@type': 'Organization', name: SITE_NAME },
  publisher: {
    '@type': 'Organization',
    name: SITE_NAME,
    logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo192.png` },
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': `${SITE_URL}/news/${news.slug}`,
  },
  url: `${SITE_URL}/news/${news.slug}`,
});

/** schema.org BreadcrumbList JSON-LD */
export const buildBreadcrumbJsonLd = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.name,
    item: item.url,
  })),
});
