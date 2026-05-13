export default function ToursLoading() {
  return (
    <main className="min-h-screen bg-tv-bg">
      {/* Search bar skeleton */}
      <section className="border-b border-tv-border bg-white">
        <div className="mx-auto max-w-[1180px] px-4 py-5">
          <div className="h-20 rounded-[26px] tv-skeleton" />
        </div>
      </section>

      {/* Main content skeleton */}
      <section className="mx-auto grid max-w-[1180px] gap-5 px-4 py-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        {/* Filter sidebar skeleton */}
        <aside className="hidden lg:block">
          <div className="rounded-tv border border-tv-border bg-white p-5 space-y-5">
            <div className="h-6 w-20 tv-skeleton rounded" />
            {/* Category */}
            <div className="space-y-2">
              <div className="h-4 w-16 tv-skeleton rounded" />
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-9 w-full tv-skeleton rounded-tv-sm" />
              ))}
            </div>
            {/* Duration */}
            <div className="space-y-2">
              <div className="h-4 w-20 tv-skeleton rounded" />
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-9 w-full tv-skeleton rounded-tv-sm" />
              ))}
            </div>
          </div>
        </aside>

        {/* Tour card grid skeleton */}
        <div>
          {/* Toolbar skeleton */}
          <div className="rounded-tv border border-tv-border bg-white p-4 mb-4">
            <div className="h-5 w-24 tv-skeleton rounded mb-2" />
            <div className="h-7 w-48 tv-skeleton rounded" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="overflow-hidden rounded-tv border border-tv-border bg-white"
              >
                <div className="h-48 tv-skeleton" />
                <div className="p-5 space-y-3">
                  <div className="flex gap-2">
                    <div className="h-5 w-16 rounded-full tv-skeleton" />
                    <div className="h-5 w-12 rounded-full tv-skeleton" />
                  </div>
                  <div className="h-6 w-3/4 tv-skeleton rounded" />
                  <div className="h-4 w-full tv-skeleton rounded" />
                  <div className="h-4 w-2/3 tv-skeleton rounded" />
                  <div className="flex justify-between items-center pt-2 border-t border-tv-border">
                    <div className="h-7 w-28 tv-skeleton rounded" />
                    <div className="h-9 w-24 tv-skeleton rounded-tv-sm" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
