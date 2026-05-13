export default function GlobalLoading() {
  return (
    <div className="min-h-screen bg-tv-bg">
      {/* Header skeleton */}
      <div className="border-b border-tv-border bg-white px-4 py-4">
        <div className="mx-auto flex max-w-[1180px] items-center gap-4">
          <div className="h-8 w-32 tv-skeleton rounded" />
          <div className="hidden md:flex flex-1 gap-6 ml-8">
            <div className="h-4 w-16 tv-skeleton rounded" />
            <div className="h-4 w-16 tv-skeleton rounded" />
            <div className="h-4 w-16 tv-skeleton rounded" />
            <div className="h-4 w-16 tv-skeleton rounded" />
          </div>
          <div className="ml-auto h-9 w-24 tv-skeleton rounded-tv" />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="mx-auto max-w-[1180px] px-4 py-8">
        {/* Hero block */}
        <div className="h-10 w-2/3 tv-skeleton rounded mb-3" />
        <div className="h-5 w-1/2 tv-skeleton rounded mb-8" />

        {/* Content blocks */}
        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-tv border border-tv-border bg-white p-5">
              <div className="h-40 tv-skeleton rounded mb-4" />
              <div className="h-5 w-3/4 tv-skeleton rounded mb-2" />
              <div className="h-4 w-full tv-skeleton rounded mb-2" />
              <div className="h-4 w-2/3 tv-skeleton rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
