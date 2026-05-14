'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useCallback, Suspense } from 'react';
import { destinationApi } from '@/lib/api/destination.api';
import type { Destination } from '@/lib/api/destination.api';
import {
  ExplorePageSkeleton,
  ExploreSearch,
  FilterRail,
  ResultsToolbar,
  ErrorState,
  EmptyResults,
  SearchResultCard,
  SearchResultSkeleton,
  Pagination,
  TripSidePanel,
} from './_components/explore-widgets';

const PAGE_SIZE = 9;

export default function ExplorePage() {
  return (
    <Suspense fallback={<ExplorePageSkeleton />}>
      <ExplorePageInner />
    </Suspense>
  );
}

function ExplorePageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const keyword = searchParams.get('keyword') ?? searchParams.get('q') ?? '';
  const country = searchParams.get('country') ?? '';
  const city = searchParams.get('city') ?? '';
  const category = searchParams.get('category') ?? '';
  const sort = searchParams.get('sort') ?? '';
  const page = parseInt(searchParams.get('page') ?? '0', 10);

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDestinations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await destinationApi.list({
        keyword: keyword || undefined,
        country: country || undefined,
        city: city || undefined,
        category: category || undefined,
        sort: sort || undefined,
        page,
        size: PAGE_SIZE,
      });

      if (res.success) {
        setDestinations(res.data.items);
        setTotalElements(res.data.totalElements);
        setTotalPages(res.data.totalPages);
      } else {
        setError('Không thể tải danh sách điểm đến.');
      }
    } catch {
      setError('Lỗi kết nối. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }, [keyword, country, city, category, sort, page]);

  useEffect(() => {
    void fetchDestinations();
  }, [fetchDestinations]);

  function updateParams(updates: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    }
    if (!('page' in updates)) {
      params.delete('page');
    }
    router.push(`/explore?${params.toString()}`);
  }

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const kw = (form.elements.namedItem('keyword') as HTMLInputElement)?.value ?? '';
    updateParams({ keyword: kw });
  }

  function handleSortChange(value: string) {
    updateParams({ sort: value });
  }

  function handleCategoryToggle(cat: string) {
    updateParams({ category: category === cat ? '' : cat });
  }

  function handlePageChange(newPage: number) {
    updateParams({ page: String(newPage) });
  }

  const activeDestination = destinations[0];

  return (
    <main className="min-h-screen bg-tv-bg text-tv-ink">
      <ExploreSearch keyword={keyword} onSearch={handleSearch} />
      <section className="mx-auto grid max-w-[1180px] gap-5 px-4 py-6 lg:grid-cols-[260px_minmax(0,1fr)_300px]">
        <FilterRail
          selectedCategory={category}
          selectedSort={sort}
          onCategoryToggle={handleCategoryToggle}
          onSortChange={handleSortChange}
        />

        <section className="min-w-0">
          <ResultsToolbar
            count={totalElements}
            keyword={keyword}
            sort={sort}
            onSortChange={handleSortChange}
          />

          <div className="mt-4 space-y-4">
            {error ? (
              <ErrorState message={error} onRetry={() => void fetchDestinations()} />
            ) : loading ? (
              [1, 2, 3].map((i) => <SearchResultSkeleton key={i} />)
            ) : destinations.length === 0 ? (
              <EmptyResults onClear={() => router.push('/explore')} />
            ) : (
              destinations.map((destination) => (
                <SearchResultCard key={destination.slug} destination={destination} />
              ))
            )}
          </div>

          {!loading && !error && totalPages > 1 && (
            <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
          )}
        </section>

        {activeDestination ? (
          <TripSidePanel destination={activeDestination} />
        ) : (
          <aside className="h-fit rounded-tv border border-tv-border bg-white p-5 shadow-tv-card lg:sticky lg:top-24">
            <p className="text-sm font-bold text-tv-ink-3">Tìm kiếm để xem gợi ý chuyến đi.</p>
          </aside>
        )}
      </section>
    </main>
  );
}
