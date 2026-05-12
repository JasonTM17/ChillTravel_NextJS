"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  Tag,
  Users,
} from "lucide-react";
import { tourApi } from "@/lib/api/tour.api";
import type { Tour } from "@/lib/api/tour.api";
import { getDestinationImage } from "@/lib/destination-images";
import { formatVnd } from "@/lib/utils";

const PAGE_SIZE = 9;

const sortOptions = [
  { label: "Phù hợp nhất", value: "" },
  { label: "Giá thấp nhất", value: "price,asc" },
  { label: "Giá cao nhất", value: "price,desc" },
  { label: "Phổ biến nhất", value: "popular,desc" },
  { label: "Đánh giá cao", value: "rating,desc" },
  { label: "Mới nhất", value: "newest,desc" },
];

const categoryOptions = [
  "Biển",
  "Văn hóa",
  "Ẩm thực",
  "Núi",
  "Nghỉ dưỡng",
  "Phố cổ",
  "Khám phá",
  "Gia đình",
];

const durationOptions = [
  { label: "Tất cả", value: "" },
  { label: "1–3 ngày", value: "3" },
  { label: "4–7 ngày", value: "7" },
  { label: "8–14 ngày", value: "14" },
  { label: "Trên 14 ngày", value: "15" },
];

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------

function TourCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-tv border border-tv-border bg-white shadow-tv-card animate-pulse">
      <div className="h-48 tv-skeleton" />
      <div className="p-5 space-y-3">
        <div className="flex gap-2">
          <div className="h-5 w-16 rounded-full tv-skeleton" />
          <div className="h-5 w-12 rounded-full tv-skeleton" />
        </div>
        <div className="h-6 w-3/4 rounded tv-skeleton" />
        <div className="h-4 w-full rounded tv-skeleton" />
        <div className="h-4 w-2/3 rounded tv-skeleton" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-7 w-28 rounded tv-skeleton" />
          <div className="h-9 w-24 rounded-tv-sm tv-skeleton" />
        </div>
      </div>
    </div>
  );
}

function ToursPageSkeleton() {
  return (
    <main className="min-h-screen bg-tv-bg text-tv-ink">
      <section className="border-b border-tv-border bg-white">
        <div className="mx-auto max-w-[1180px] px-4 py-5">
          <div className="h-20 rounded-[26px] tv-skeleton animate-pulse" />
        </div>
      </section>
      <section className="mx-auto grid max-w-[1180px] gap-5 px-4 py-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <div className="h-[500px] rounded-tv border border-tv-border bg-white animate-pulse" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <TourCardSkeleton key={i} />
          ))}
        </div>
      </section>
    </main>
  );
}

// ---------------------------------------------------------------------------
// Main page — wrapped in Suspense for useSearchParams
// ---------------------------------------------------------------------------

export default function ToursPage() {
  return (
    <Suspense fallback={<ToursPageSkeleton />}>
      <ToursPageInner />
    </Suspense>
  );
}

function ToursPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const keyword = searchParams.get("keyword") ?? "";
  const category = searchParams.get("category") ?? "";
  const minPrice = searchParams.get("minPrice") ?? "";
  const maxPrice = searchParams.get("maxPrice") ?? "";
  const duration = searchParams.get("duration") ?? "";
  const sort = searchParams.get("sort") ?? "";
  const page = parseInt(searchParams.get("page") ?? "0", 10);

  const [tours, setTours] = useState<Tour[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTours = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await tourApi.list({
        keyword: keyword || undefined,
        category: category || undefined,
        minPrice: minPrice ? parseInt(minPrice, 10) : undefined,
        maxPrice: maxPrice ? parseInt(maxPrice, 10) : undefined,
        duration: duration ? parseInt(duration, 10) : undefined,
        sort: sort || undefined,
        page,
        size: PAGE_SIZE,
      });

      if (res.success) {
        const paginatedData = res.data as {
          items: Tour[];
          totalElements: number;
          totalPages: number;
        };
        setTours(paginatedData.items);
        setTotalElements(paginatedData.totalElements);
        setTotalPages(paginatedData.totalPages);
      } else {
        setError("Không thể tải danh sách tour.");
      }
    } catch {
      setError("Lỗi kết nối. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }, [keyword, category, minPrice, maxPrice, duration, sort, page]);

  useEffect(() => {
    void fetchTours();
  }, [fetchTours]);

  function updateParams(updates: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    }
    if (!("page" in updates)) {
      params.delete("page");
    }
    router.push(`/tours?${params.toString()}`);
  }

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const kw = (form.elements.namedItem("keyword") as HTMLInputElement)?.value ?? "";
    updateParams({ keyword: kw });
  }

  function handleSortChange(value: string) {
    updateParams({ sort: value });
  }

  function handleCategoryToggle(cat: string) {
    updateParams({ category: category === cat ? "" : cat });
  }

  function handleDurationChange(value: string) {
    updateParams({ duration: value });
  }

  function handlePriceChange(field: "minPrice" | "maxPrice", value: string) {
    updateParams({ [field]: value });
  }

  function handlePageChange(newPage: number) {
    updateParams({ page: String(newPage) });
  }

  return (
    <main className="min-h-screen bg-tv-bg text-tv-ink">
      {/* Search bar */}
      <section className="border-b border-tv-border bg-white">
        <div className="mx-auto max-w-[1180px] px-4 py-5">
          <form
            onSubmit={handleSearch}
            className="rounded-[26px] bg-tv-blue p-3 shadow-[0_18px_42px_rgba(2,119,212,0.18)]"
          >
            <div className="grid gap-3 rounded-[20px] bg-white p-3 md:grid-cols-[1fr_160px_148px]">
              <label className="flex min-w-0 items-center gap-3 rounded-tv border border-tv-border bg-tv-bg px-4 py-3">
                <Search size={19} className="text-tv-blue" aria-hidden="true" />
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-bold text-tv-ink-3">Tìm tour</span>
                  <input
                    name="keyword"
                    defaultValue={keyword}
                    className="mt-1 w-full bg-transparent font-bold text-tv-ink outline-none"
                    placeholder="Tên tour, điểm đến..."
                  />
                </span>
              </label>
              <div className="flex items-center gap-3 rounded-tv border border-tv-border bg-white px-4 py-3">
                <SlidersHorizontal size={18} className="shrink-0 text-tv-blue" aria-hidden="true" />
                <span className="min-w-0">
                  <span className="block text-xs font-bold text-tv-ink-3">Sắp xếp</span>
                  <select
                    value={sort}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="mt-1 w-full bg-transparent font-bold text-tv-ink outline-none text-sm"
                    aria-label="Sắp xếp tour"
                  >
                    {sortOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </span>
              </div>
              <button
                className="rounded-tv bg-tv-orange px-5 py-3 text-sm font-bold text-white transition hover:bg-tv-orange-dark"
                type="submit"
              >
                Tìm kiếm
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Main content */}
      <section className="mx-auto grid max-w-[1180px] gap-5 px-4 py-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        {/* Filter rail */}
        <aside className="h-fit rounded-tv border border-tv-border bg-white p-5 shadow-tv-card lg:sticky lg:top-24">
          <div className="flex items-center justify-between border-b border-tv-border pb-4">
            <h2 className="text-xl font-bold">Bộ lọc</h2>
            <SlidersHorizontal className="text-tv-blue" size={18} aria-hidden="true" />
          </div>

          {/* Category */}
          <div className="mt-5">
            <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-tv-ink-3">
              Loại tour
            </h3>
            <div className="mt-3 grid gap-2">
              {categoryOptions.map((cat) => {
                const active = category === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => handleCategoryToggle(cat)}
                    className={`flex items-center justify-between rounded-tv-sm border px-3 py-2 text-sm font-bold transition text-left ${
                      active
                        ? "border-tv-blue bg-tv-blue-light text-tv-blue"
                        : "border-tv-border bg-white text-tv-ink-3 hover:border-tv-blue hover:text-tv-blue"
                    }`}
                    type="button"
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Duration */}
          <div className="mt-6">
            <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-tv-ink-3">
              Thời gian
            </h3>
            <div className="mt-3 grid gap-2">
              {durationOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleDurationChange(opt.value)}
                  className={`rounded-tv-sm border px-3 py-2 text-xs font-bold text-left transition ${
                    duration === opt.value
                      ? "border-tv-blue bg-tv-blue-light text-tv-blue"
                      : "border-tv-border bg-white text-tv-ink-3 hover:border-tv-blue"
                  }`}
                  type="button"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Price range */}
          <div className="mt-6">
            <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-tv-ink-3">
              Khoảng giá (VNĐ)
            </h3>
            <div className="mt-3 space-y-2">
              <div>
                <label className="text-xs font-bold text-tv-ink-3" htmlFor="minPrice">
                  Từ
                </label>
                <input
                  id="minPrice"
                  type="number"
                  min={0}
                  step={100000}
                  defaultValue={minPrice}
                  onBlur={(e) => handlePriceChange("minPrice", e.target.value)}
                  className="mt-1 w-full rounded-tv-sm border border-tv-border bg-white px-3 py-2 text-sm font-bold text-tv-ink outline-none focus:border-tv-blue"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-tv-ink-3" htmlFor="maxPrice">
                  Đến
                </label>
                <input
                  id="maxPrice"
                  type="number"
                  min={0}
                  step={100000}
                  defaultValue={maxPrice}
                  onBlur={(e) => handlePriceChange("maxPrice", e.target.value)}
                  className="mt-1 w-full rounded-tv-sm border border-tv-border bg-white px-3 py-2 text-sm font-bold text-tv-ink outline-none focus:border-tv-blue"
                  placeholder="Không giới hạn"
                />
              </div>
            </div>
          </div>

          {/* Clear filters */}
          {(keyword || category || minPrice || maxPrice || duration || sort) && (
            <button
              onClick={() => router.push("/tours")}
              className="mt-6 w-full rounded-tv-sm border border-tv-border bg-white px-3 py-2 text-xs font-bold text-tv-ink-3 hover:border-tv-blue hover:text-tv-blue"
              type="button"
            >
              Xóa bộ lọc
            </button>
          )}
        </aside>

        {/* Results */}
        <section className="min-w-0">
          {/* Toolbar */}
          <div className="rounded-tv border border-tv-border bg-white p-4 shadow-tv-card">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-tv-blue">
                  Danh sách tour
                </p>
                <h1 className="mt-1 text-2xl font-bold">
                  {loading ? "Đang tải..." : `${totalElements} tour${keyword ? ` cho "${keyword}"` : ""}`}
                </h1>
                <p className="mt-1 text-sm text-tv-ink-3">Dữ liệu thật từ hệ thống.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {sortOptions.slice(1).map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSortChange(option.value)}
                    className={`rounded-full border px-3 py-2 text-xs font-bold ${
                      sort === option.value
                        ? "border-tv-blue bg-tv-blue-light text-tv-blue"
                        : "border-tv-border bg-white text-tv-ink-3"
                    }`}
                    type="button"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tour grid */}
          <div className="mt-4">
            {error ? (
              <ErrorState message={error} onRetry={() => void fetchTours()} />
            ) : loading ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <TourCardSkeleton key={i} />
                ))}
              </div>
            ) : tours.length === 0 ? (
              <EmptyResults onClear={() => router.push("/tours")} />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {tours.map((tour) => (
                  <TourCard key={tour.slug} tour={tour} />
                ))}
              </div>
            )}
          </div>

          {!loading && !error && totalPages > 1 && (
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </section>
      </section>
    </main>
  );
}

// ---------------------------------------------------------------------------
// Tour card
// ---------------------------------------------------------------------------

function TourCard({ tour }: { tour: Tour }) {
  const imgSrc =
    tour.imageUrl ??
    tour.images?.[0]?.imageUrl ??
    getDestinationImage(tour.destination?.slug ?? tour.slug);

  const displayPrice = tour.salePrice ?? tour.basePrice;
  const hasSale = tour.salePrice != null && tour.salePrice < tour.basePrice;

  return (
    <article className="tv-card flex flex-col overflow-hidden transition hover:-translate-y-0.5 hover:shadow-tv-hover">
      <Link
        href={`/tours/${tour.slug}`}
        className="relative block h-48 bg-cover bg-center"
        style={{ backgroundImage: `url(${imgSrc})` }}
        aria-label={`Xem chi tiết ${tour.title}`}
      >
        {tour.featured && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-tv-orange px-2.5 py-1 text-xs font-bold text-white shadow">
            <Sparkles size={12} aria-hidden="true" />
            Nổi bật
          </span>
        )}
        {hasSale && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-tv-blue px-2.5 py-1 text-xs font-bold text-white shadow">
            <Tag size={12} aria-hidden="true" />
            Ưu đãi
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {tour.destination && (
            <span className="inline-flex items-center gap-1 rounded-full bg-tv-blue-light px-2.5 py-1 font-bold text-tv-blue">
              <MapPin size={11} aria-hidden="true" />
              {tour.destination.city ?? tour.destination.name}
            </span>
          )}
          <span className="inline-flex items-center gap-1 rounded-full bg-tv-bg px-2.5 py-1 font-bold text-tv-ink-3">
            <Clock size={11} aria-hidden="true" />
            {tour.durationDays} ngày {tour.durationNights} đêm
          </span>
          {tour.ratingAvg != null && (
            <span className="inline-flex items-center gap-1 font-bold text-[#b45309]">
              <Star size={12} fill="currentColor" aria-hidden="true" />
              {tour.ratingAvg.toFixed(1)}
            </span>
          )}
        </div>

        <Link
          href={`/tours/${tour.slug}`}
          className="mt-3 line-clamp-2 text-lg font-bold leading-snug hover:text-tv-blue"
        >
          {tour.title}
        </Link>

        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-6 text-tv-ink-3">
          {tour.shortDescription ?? tour.description}
        </p>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-tv-border pt-4">
          <div>
            {hasSale && (
              <p className="text-xs font-bold text-tv-ink-3 line-through">
                {formatVnd(tour.basePrice)}
              </p>
            )}
            <p className="text-xl font-bold text-tv-orange">{formatVnd(displayPrice)}</p>
            <p className="text-xs font-bold text-tv-ink-3">/ người</p>
          </div>
          <Link
            href={`/tours/${tour.slug}`}
            className="inline-flex items-center gap-1.5 rounded-tv-sm bg-tv-orange px-4 py-2.5 text-sm font-bold text-white hover:bg-tv-orange-dark"
          >
            Xem tour
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}

// ---------------------------------------------------------------------------
// Error / Empty states
// ---------------------------------------------------------------------------

function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="rounded-tv border border-dashed border-red-200 bg-red-50 p-8 text-center">
      <p className="text-lg font-bold text-red-600">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 inline-flex rounded-tv-sm bg-tv-blue px-5 py-2.5 font-bold text-white hover:bg-tv-blue-dark"
          type="button"
        >
          Thử lại
        </button>
      )}
    </div>
  );
}

function EmptyResults({ onClear }: { onClear: () => void }) {
  return (
    <div className="rounded-tv border border-dashed border-tv-border bg-white p-10 text-center">
      <MapPin className="mx-auto text-tv-blue" size={34} aria-hidden="true" />
      <h2 className="mt-4 text-2xl font-bold">Chưa có tour phù hợp.</h2>
      <p className="mt-2 text-tv-ink-3">
        Thử thay đổi từ khóa, loại tour hoặc khoảng giá.
      </p>
      <button
        onClick={onClear}
        className="mt-5 inline-flex rounded-tv-sm bg-tv-blue px-5 py-3 font-bold text-white"
        type="button"
      >
        Xóa bộ lọc
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Pagination
// ---------------------------------------------------------------------------

function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="mt-6 flex items-center justify-center gap-2">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 0}
        className="inline-flex items-center gap-1 rounded-tv-sm border border-tv-border bg-white px-4 py-2 text-sm font-bold text-tv-blue disabled:opacity-40 hover:bg-tv-blue-light"
        type="button"
        aria-label="Trang trước"
      >
        <ChevronLeft size={16} aria-hidden="true" />
        Trước
      </button>

      <div className="flex gap-1">
        {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
          const pageNum =
            totalPages <= 7
              ? i
              : Math.max(0, Math.min(page - 3, totalPages - 7)) + i;
          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`h-9 w-9 rounded-tv-sm text-sm font-bold transition ${
                pageNum === page
                  ? "bg-tv-blue text-white"
                  : "border border-tv-border bg-white text-tv-ink-3 hover:bg-tv-blue-light"
              }`}
              type="button"
              aria-label={`Trang ${pageNum + 1}`}
              aria-current={pageNum === page ? "page" : undefined}
            >
              {pageNum + 1}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages - 1}
        className="inline-flex items-center gap-1 rounded-tv-sm border border-tv-border bg-white px-4 py-2 text-sm font-bold text-tv-blue disabled:opacity-40 hover:bg-tv-blue-light"
        type="button"
        aria-label="Trang sau"
      >
        Sau
        <ChevronRight size={16} aria-hidden="true" />
      </button>
    </div>
  );
}
