export const Skeleton = ({ className = '', style }) => (
  <div className={`skeleton ${className}`} style={style} />
);

export const SkeletonCard = () => (
  <div
    className="rounded-2xl overflow-hidden"
    style={{ background: 'var(--card)', boxShadow: 'var(--shadow-sm)' }}
  >
    <Skeleton style={{ paddingTop: '56.25%', borderRadius: 0 }} />
    <div className="p-4 space-y-2.5">
      <Skeleton className="h-3 w-1/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="flex gap-3 pt-1">
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-3 w-12" />
      </div>
    </div>
  </div>
);

export const SkeletonText = () => (
  <div className="flex gap-3.5 py-3.5 border-b" style={{ borderColor: 'var(--border)' }}>
    <div className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 skeleton" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-[13.5px] w-full" />
      <Skeleton className="h-[13.5px] w-3/4" />
      <Skeleton className="h-3 w-1/3" />
    </div>
  </div>
);

export const SkeletonLeftImage = () => (
  <div className="flex gap-4 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
    <Skeleton className="shrink-0 rounded-xl" style={{ width: 108, height: 68, borderRadius: 12 }} />
    <div className="flex-1 space-y-2 py-0.5">
      <Skeleton className="h-[13.5px] w-full" />
      <Skeleton className="h-[13.5px] w-4/5" />
      <Skeleton className="h-3 w-2/5" />
    </div>
  </div>
);
