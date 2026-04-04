import { Helmet } from 'react-helmet-async';
import {
  SITE_NAME,
  SITE_URL,
  DEFAULT_DESCRIPTION,
  DEFAULT_IMAGE,
  DEFAULT_KEYWORDS,
  buildTitle,
} from '../../utils/seo';

/**
 * SEOHead — drop this into any page to set dynamic meta tags.
 *
 * Props:
 *   title       — page-specific title (without site name)
 *   description — meta description (≤160 chars ideal)
 *   image       — OG / Twitter card image URL
 *   url         — canonical URL
 *   keywords    — comma-separated keywords
 *   type        — OG type: 'website' | 'article'
 *   noindex     — set true for filter/search/pagination pages
 */
export const SEOHead = ({
  title,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_IMAGE,
  url,
  keywords = DEFAULT_KEYWORDS,
  type = 'website',
  noindex = false,
}) => {
  const fullTitle = buildTitle(title);
  const canonical = url || SITE_URL;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonical} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={canonical} />
      <meta property="og:locale" content="uz_UZ" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};
