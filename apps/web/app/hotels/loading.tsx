export default function HotelsLoading() {
  return (
    <div className="mx-auto max-w-[1180px] px-4 py-8">
      {/* Page header skeleton */}
      <div className="mb-6">
        <div className="h-4 w-24 tv-skeleton rounded mb-2" />
        <div className="h-8 w-96 tv-skeleton rounded" />
      </div>

      <div className="flex gap-6">
        {/* Filter sidebar skeleton */}
        <aside className="hidden w-[260px] shrink-0 lg:block">
          <div className="rounded-tv border border-tv-border bg-white p-5 space-y-5">
            <div className="h-6 w-24 tv-skeleton rounded" />
            {/* Price range */}
            <div className="space-y-2">
              <div className="h-4 w-20 tv-skeleton rounded" />
              <div className="h-8 w-full tv-skeleton rounded" />
            </div>
            {/* Star rating */}
            <div className="space-y-2">
              <div className="h-4 w-28 tv-skeleton rounded" />
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-8 w-12 tv-skeleton rounded" />
                ))}
              </div>
            </div>
            {/* Amenities */}
            <div className="space-y-2">
              <div className="h-4 w-20 tv-skeleton rounded" />
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-5 w-full tv-skeleton rounded" />
              ))}
            </div>
          </div>
        </aside>

        {/* Hotel card list skeleton */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Sort bar */}
          <div className="flex items-center justify-between">
            <div className="h-4 w-24 tv-skeleton rounded" />
            <div className="h-8 w-40 tv-skeleton rounded" />
          </div>

          {/* Hotel cards */}
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex gap-4 rounded-tv border border-tv-border bg-white p-4"
            >
              <div className="h-[180px] w-[240px] shrink-0 tv-skeleton rounded" />
              <div className="flex-1 space-y-3 py-1">
                <div className="h-6 w-3/4 tv-skeleton rounded" />
                <div className="h-4 w-1/2 tv-skeleton rounded" />
                <div className="flex gap-2">
                  <div className="h-5 w-14 tv-skeleton rounded" />
                  <div className="h-5 w-14 tv-skeleton rounded" />
                  <div className="h-5 w-14 tv-skeleton rounded" />
                </div>
                <div className="flex items-end justify-between pt-4">
                  <div className="h-7 w-32 tv-skeleton rounded" />
                  <div className="h-10 w-28 tv-skeleton rounded-tv" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
