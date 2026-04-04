export const formatViews = (n) => {
  if (!n) return '0';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
};

export const truncate = (str, max = 120) =>
  str?.length > max ? str.slice(0, max).trimEnd() + '…' : str;

export const imageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `${process.env.REACT_APP_API_URL?.replace('/api/v1', '') || 'http://localhost:3000'}${url}`;
};
