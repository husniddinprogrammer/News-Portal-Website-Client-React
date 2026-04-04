/**
 * Sitemap generator — run after `npm run build`
 *   npm run sitemap
 *
 * Fetches all news, categories, hashtags from the API
 * and writes public/sitemap.xml
 */

const https = require('https');
const http  = require('http');
const fs    = require('fs');
const path  = require('path');

const SITE_URL = process.env.REACT_APP_SITE_URL || 'https://newsportal.uz';
const API_URL  = process.env.REACT_APP_API_URL   || 'http://localhost:3000/api/v1';
const OUT_FILE = path.join(__dirname, '..', 'public', 'sitemap.xml');

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fetch = (url) =>
  new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(e); }
      });
    }).on('error', reject);
  });

const escXml = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const url = (loc, { lastmod, changefreq = 'weekly', priority = '0.7' } = {}) => `
  <url>
    <loc>${escXml(loc)}</loc>
    ${lastmod ? `<lastmod>${lastmod.slice(0, 10)}</lastmod>` : ''}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;

// ─── Main ─────────────────────────────────────────────────────────────────────

async function generate() {
  console.log('Fetching data from', API_URL, '...');

  const [newsRes, categoriesRes, hashtagsRes] = await Promise.all([
    fetch(`${API_URL}/news?limit=1000&sort=id_desc`).catch(() => ({ data: [] })),
    fetch(`${API_URL}/categories`).catch(() => ({ data: [] })),
    fetch(`${API_URL}/hashtags?limit=500`).catch(() => ({ data: [] })),
  ]);

  const news       = newsRes?.data       ?? [];
  const categories = categoriesRes?.data ?? [];
  const hashtags   = hashtagsRes?.data   ?? [];

  const urls = [
    // Home
    url(`${SITE_URL}/`, { changefreq: 'hourly', priority: '1.0' }),

    // Categories
    ...categories.map((c) =>
      url(`${SITE_URL}/category/${c.slug}`, { changefreq: 'daily', priority: '0.8' })
    ),

    // Hashtags
    ...hashtags.map((h) =>
      url(`${SITE_URL}/hashtag/${h.slug}`, { changefreq: 'weekly', priority: '0.5' })
    ),

    // News articles
    ...news.map((n) =>
      url(`${SITE_URL}/news/${n.slug}`, {
        lastmod: n.updatedAt || n.createdAt,
        changefreq: 'monthly',
        priority: '0.9',
      })
    ),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('')}
</urlset>`;

  fs.writeFileSync(OUT_FILE, xml, 'utf-8');
  console.log(`✓ sitemap.xml written — ${urls.length} URLs → ${OUT_FILE}`);
}

generate().catch((err) => {
  console.error('Sitemap generation failed:', err.message);
  process.exit(1);
});
