export function LoadingSkeleton() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="page-container flex-1 py-8 space-y-8">
        {/* Header skeleton */}
        <div className="space-y-3 max-w-2xl">
          <div className="h-8 w-64 bg-surface-tertiary rounded-lg animate-pulse" />
          <div className="h-4 w-96 bg-surface-tertiary rounded-lg animate-pulse" />
        </div>

        {/* Card grid skeleton */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="card p-6 space-y-4 animate-pulse"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-surface-tertiary" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-32 bg-surface-tertiary rounded" />
                  <div className="h-3 w-48 bg-surface-tertiary rounded" />
                </div>
              </div>
              <div className="h-3 w-full bg-surface-tertiary rounded" />
              <div className="h-3 w-3/4 bg-surface-tertiary rounded" />
            </div>
          ))}
        </div>

        {/* Footer skeleton */}
        <div className="flex justify-center gap-3 pt-8">
          <div className="h-4 w-20 bg-surface-tertiary rounded animate-pulse" />
          <div className="h-4 w-24 bg-surface-tertiary rounded animate-pulse" />
          <div className="h-4 w-16 bg-surface-tertiary rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
