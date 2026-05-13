export default function FlightsLoading() {
  return (
    <div className="mx-auto max-w-[1180px] px-4 py-8">
      {/* Page header skeleton */}
      <div className="mb-6">
        <div className="h-4 w-24 tv-skeleton rounded mb-2" />
        <div className="h-8 w-[420px] max-w-full tv-skeleton rounded" />
      </div>

      {/* Search bar skeleton */}
      <div className="mb-6 rounded-tv border border-tv-border bg-white p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_1fr_1fr_1fr_auto]">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-14 tv-skeleton rounded-tv" />
          ))}
          <div className="h-14 w-28 tv-skeleton rounded-tv" />
        </div>
      </div>

      {/* Main layout: filter sidebar + flight cards */}
      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        {/* Filter sidebar skeleton */}
        <aside className="hidden lg:block">
          <div className="rounded-tv border border-tv-border bg-white p-5 space-y-5">
            <div className="h-6 w-24 tv-skeleton rounded" />
            {/* Time blocks */}
            <div className="space-y-2">
              <div className="h-4 w-28 tv-skeleton rounded" />
              <div className="grid grid-cols-2 gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-10 tv-skeleton rounded" />
                ))}
              </div>
            </div>
            {/* Stops */}
            <div className="space-y-2">
              <div className="h-4 w-20 tv-skeleton rounded" />
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-5 w-full tv-skeleton rounded" />
              ))}
            </div>
            {/* Airlines */}
            <div className="space-y-2">
              <div className="h-4 w-24 tv-skeleton rounded" />
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-5 w-full tv-skeleton rounded" />
              ))}
            </div>
          </div>
        </aside>

        {/* Flight cards skeleton */}
        <div className="space-y-4">
          <div className="h-4 w-24 tv-skeleton rounded" />
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="rounded-tv border border-tv-border bg-white p-5"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="h-5 w-28 tv-skeleton rounded" />
                  <div className="h-4 w-20 tv-skeleton rounded" />
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <div className="h-4 w-32 tv-skeleton rounded" />
                </div>
                <div className="space-y-2 text-right">
                  <div className="h-5 w-28 tv-skeleton rounded ml-auto" />
                  <div className="h-4 w-20 tv-skeleton rounded ml-auto" />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-tv-border pt-4">
                <div className="h-4 w-24 tv-skeleton rounded" />
                <div className="h-7 w-32 tv-skeleton rounded" />
                <div className="h-9 w-24 tv-skeleton rounded-tv" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
