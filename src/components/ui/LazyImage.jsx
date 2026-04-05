import { useState, useRef, useEffect, useMemo } from 'react';
import { ImageOff } from 'lucide-react';
import { imageUrl } from '../../utils/formatters';

/**
 * Lazy-loading image:
 *  - IntersectionObserver — loads only when image nears viewport
 *  - Skeleton shimmer while loading
 *  - Accessible fallback icon (no aria-less emoji) for missing images
 *  - Fade-in on load
 *  - URL resolved once via useMemo
 */
export const LazyImage = ({ src, alt = '', className = '', style }) => {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  const resolved = useMemo(() => imageUrl(src), [src]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setInView(true); observer.disconnect(); }
      },
      { rootMargin: '300px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      style={{ background: 'var(--border)', ...style }}
    >
      {/* Skeleton — visible while image loads (only when URL exists) */}
      {!loaded && resolved && (
        <div className="absolute inset-0 skeleton" aria-hidden="true" />
      )}

      {/* Fallback icon — only when no image URL at all */}
      {!resolved && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ background: 'var(--bg-secondary)' }}
          aria-hidden="true"
        >
          <ImageOff size={28} style={{ color: 'var(--text-faint)' }} />
        </div>
      )}

      {/* Image itself */}
      {inView && resolved && (
        <img
          src={resolved}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          className="w-full h-full object-cover"
          style={{
            position: 'absolute',
            inset: 0,
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.35s ease',
          }}
        />
      )}
    </div>
  );
};
