export const Skeleton = ({ className = '', style }) => (
  <div className={`skeleton ${className}`} style={style} />
);

export const SkeletonCard = () => (
  <div className="rounded-xl overflow-hidden" style={{ background: 'var(--card)', boxShadow: 'var(--card-shadow, 0 1px 3px rgba(0,0,0,0.1))' }}>
    <Skeleton className="w-full" style={{ paddingTop: '56.25%' }} />
    <div className="p-3 space-y-2">
      <Skeleton className="h-3 w-1/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  </div>
);

export const SkeletonText = () => (
  <div className="flex gap-3 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  </div>
);

export const SkeletonLeftImage = () => (
  <div className="flex gap-3 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
    <Skeleton className="w-28 h-20 shrink-0 rounded-lg" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-3 w-1/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
    </div>
  </div>
);
