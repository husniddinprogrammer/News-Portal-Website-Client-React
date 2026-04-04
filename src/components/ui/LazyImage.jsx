import { useState, useRef, useEffect } from 'react';
import { imageUrl } from '../../utils/formatters';

export const LazyImage = ({ src, alt = '', className = '', style }) => {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
      { rootMargin: '300px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const resolved = imageUrl(src);

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      style={{ background: 'var(--border)', ...style }}
    >
      {!loaded && (
        <div className="absolute inset-0 skeleton" />
      )}
      {inView && resolved && (
        <img
          src={resolved}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className="w-full h-full object-cover"
          style={{
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.4s ease',
            position: 'absolute',
            inset: 0,
          }}
        />
      )}
      {/* Placeholder icon when no image */}
      {!resolved && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl opacity-30">📰</span>
        </div>
      )}
    </div>
  );
};
