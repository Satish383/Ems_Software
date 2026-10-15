export function SkeletonLine({ className = "" }) {
  return <div className={`skeleton h-4 w-full ${className}`} />;
}

export default function LoadingState({ rows = 5, showHeader = true }) {
  return (
    <div className="p-4 space-y-3">
      {showHeader && <div className="skeleton h-8 w-40" />}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="skeleton w-10 h-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <SkeletonLine className="w-1/3" />
            <SkeletonLine className="w-1/4 h-3" />
          </div>
          <div className="skeleton h-6 w-16" />
        </div>
      ))}
    </div>
  );
}
