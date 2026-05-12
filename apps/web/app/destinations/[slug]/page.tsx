"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  CalendarDays,
  MapPin,
  MapPinned,
  MessageCircle,
  ShieldCheck,
  Star,
  Utensils,
  WalletCards
} from "lucide-react";
import { destinationApi } from "@/lib/api/destination.api";
import type { Destination } from "@/lib/api/destination.api";
import { BoundaryList, CommerceSurface, StatusPill, TrustBanner } from "@/components/commerce-primitives";
import { getDestinationImage, getExperienceDealImage, getStayDealImage } from "@/lib/destination-images";
import { formatVnd } from "@/lib/utils";
import { demoPaymentWarning } from "@/lib/vietnamese";

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------

function DestinationDetailSkeleton() {
  return (
    <main className="min-h-screen bg-[#f6fbff] text-[#071827] animate-pulse">
      <section className="border-b border-[#d9ecfb] bg-white">
        <div className="mx-auto max-w-[1180px] px-4 py-6 md:px-6">
          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => <div key={i} className="h-6 w-20 rounded-full bg-[#d9ecfb]" />)}
            </div>
            <div className="h-12 w-3/4 rounded bg-[#d9ecfb]" />
            <div className="h-4 w-full max-w-2xl rounded bg-[#d9ecfb]" />
            <div className="h-4 w-2/3 max-w-xl rounded bg-[#d9ecfb]" />
          </div>
          <div className="mt-6 grid gap-3 lg:grid-cols-[1.45fr_0.75fr]">
            <div className="min-h-[320px] rounded-[28px] bg-[#d9ecfb]" />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div className="min-h-[154px] rounded-[24px] bg-[#d9ecfb]" />
              <div className="min-h-[154px] rounded-[24px] bg-[#d9ecfb]" />
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-[1180px] gap-6 px-4 py-8 md:px-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl border border-[#d9ecfb] bg-white p-5">
                <div className="h-5 w-5 rounded bg-[#d9ecfb]" />
                <div className="mt-4 h-3 w-16 rounded bg-[#d9ecfb]" />
                <div className="mt-2 h-5 w-24 rounded bg-[#d9ecfb]" />
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-[#d9ecfb] bg-white p-6 space-y-3">
            <div className="h-6 w-40 rounded bg-[#d9ecfb]" />
            <div className="h-4 w-full rounded bg-[#d9ecfb]" />
            <div className="h-4 w-3/4 rounded bg-[#d9ecfb]" />
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-2xl border border-[#d9ecfb] bg-white p-5 space-y-3">
            <div className="h-4 w-24 rounded bg-[#d9ecfb]" />
            <div className="h-6 w-40 rounded bg-[#d9ecfb]" />
            <div className="h-10 rounded-2xl bg-[#d9ecfb]" />
          </div>
        </div>
      </section>
    </main>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function DestinationDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundError, setNotFoundError] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchDestination() {
      setLoading(true);
      setError(null);
      setNotFoundError(false);
      try {
        const res = await destinationApi.getBySlug(slug);
        if (cancelled) return;

        if (res.success) {
          setDestination(res.data);
        } else {
          // Check if it's a 404-style error
          const msg = (res as { message?: string }).message ?? "";
          if (msg.toLowerCase().includes("not found") || msg.includes("404")) {
            setNotFoundError(true);
          } else {
            setError(msg || "Không thể tải thông tin điểm đến.");
          }
        }
      } catch {
        if (!cancelled) setError("Lỗi kết nối. Vui lòng thử lại.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void fetchDestination();
    return () => { cancelled = true; };
  }, [slug]);

  if (loading) return <DestinationDetailSkeleton />;
  if (notFoundError) notFound();
  if (error) {
    return (
      <main className="min-h-screen bg-[#f6fbff] flex items-center justify-center">
        <div className="rounded-2xl border border-dashed border-red-200 bg-red-50 p-10 text-center max-w-md">
          <p className="text-lg font-black text-red-600">{error}</p>
          <Link href="/explore" className="mt-4 inline-flex rounded-xl bg-[#0277d4] px-5 py-2.5 font-bold text-white hover:bg-[#005ea8]">
            Quay lại khám phá
          </Link>
        </div>
      </main>
    );
  }
  if (!destination) return null;

  const heroImage = destination.imageUrl ?? getDestinationImage(destination.slug);
  const galleryImages = [
    heroImage,
    destination.images?.[1]?.imageUrl ?? getStayDealImage(),
    destination.images?.[2]?.imageUrl ?? getExperienceDealImage(),
  ];

  return (
    <main className="min-h-screen bg-[#f6fbff] text-[#071827]">
      <section className="border-b border-[#d9ecfb] bg-white">
        <div className="mx-auto max-w-[1180px] px-4 py-6 md:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex flex-wrap gap-2">
                <StatusPill>{destination.country}</StatusPill>
                {destination.city && <StatusPill tone="teal">{destination.city}</StatusPill>}
                {destination.category && <StatusPill tone="orange">{destination.category}</StatusPill>}
              </div>
              <h1 className="mt-4 text-4xl font-black leading-tight md:text-6xl">{destination.name}</h1>
              <p className="mt-3 max-w-3xl text-base leading-7 text-[#476273]">
                {destination.shortDescription ?? destination.description}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/ai-planner?destination=${destination.slug}`}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#d9ecfb] bg-white px-4 py-3 text-sm font-black text-[#0277d4] transition hover:bg-[#eef7ff]"
              >
                <MessageCircle size={18} aria-hidden="true" />
                Hỏi trợ lý chuyến đi
              </Link>
              <Link
                href={`/booking/${destination.slug}`}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#ff6d1a] px-5 py-3 text-sm font-black text-white shadow-[0_12px_26px_rgba(255,109,26,0.2)] transition hover:bg-[#e95c0a]"
              >
                Đặt chỗ demo
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="mt-6 grid gap-3 lg:grid-cols-[1.45fr_0.75fr]">
            <div
              className="min-h-[320px] rounded-[28px] bg-cover bg-center shadow-[0_18px_48px_rgba(2,68,120,0.14)]"
              style={{ backgroundImage: `linear-gradient(180deg, rgba(7,24,39,0.02), rgba(7,24,39,0.18)), url(${galleryImages[0]})` }}
              aria-label={`Ảnh du lịch ${destination.name}`}
            />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {galleryImages.slice(1).map((image, index) => (
                <div
                  key={image}
                  className="min-h-[154px] rounded-[24px] bg-cover bg-center shadow-[0_12px_30px_rgba(2,68,120,0.1)]"
                  style={{ backgroundImage: `linear-gradient(180deg, rgba(7,24,39,0.02), rgba(7,24,39,0.12)), url(${image})` }}
                  aria-label={index === 0 ? `Gợi ý lưu trú tại ${destination.name}` : `Gợi ý trải nghiệm tại ${destination.name}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1180px] gap-6 px-4 py-8 md:px-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            {destination.bestTimeToVisit && (
              <InfoCard icon={CalendarDays} title="Mùa đẹp" value={destination.bestTimeToVisit} />
            )}
            <InfoCard icon={ShieldCheck} title="An toàn" value="Tốt" />
            <InfoCard icon={MapPin} title="Vị trí" value={destination.city ?? destination.country} />
          </div>

          <CommerceSurface>
            <h2 className="text-2xl font-black">Vì sao nên đi</h2>
            <p className="mt-3 leading-7 text-[#476273]">{destination.description}</p>
            {destination.category && (
              <div className="mt-4 flex flex-wrap gap-2">
                <StatusPill tone="gray">{destination.category}</StatusPill>
              </div>
            )}
          </CommerceSurface>

          {destination.images && destination.images.length > 0 && (
            <CommerceSurface>
              <h2 className="text-2xl font-black">Hình ảnh</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                {destination.images.slice(0, 6).map((img) => (
                  <div
                    key={img.id}
                    className="h-36 rounded-2xl bg-cover bg-center"
                    style={{ backgroundImage: `url(${img.imageUrl})` }}
                    aria-label={img.altText ?? destination.name}
                  />
                ))}
              </div>
            </CommerceSurface>
          )}

          <CommerceSurface>
            <h2 className="text-2xl font-black">Thông tin điểm đến</h2>
            <div className="mt-4 space-y-3 text-sm">
              <InfoRow label="Quốc gia" value={destination.country} />
              {destination.city && <InfoRow label="Thành phố" value={destination.city} />}
              {destination.bestTimeToVisit && <InfoRow label="Thời điểm lý tưởng" value={destination.bestTimeToVisit} />}
              {destination.ratingAvg != null && (
                <InfoRow
                  label="Đánh giá"
                  value={`${destination.ratingAvg.toFixed(1)} / 5 (${destination.reviewCount ?? 0} đánh giá)`}
                />
              )}
            </div>
          </CommerceSurface>
        </div>

        <aside className="h-fit space-y-4 lg:sticky lg:top-24">
          <TrustBanner />
          <CommerceSurface>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#0277d4]">Tóm tắt đặt chỗ</p>
            <h2 className="mt-2 text-2xl font-black">{destination.name}</h2>
            <div className="mt-5 space-y-3 text-sm">
              <SideRow label="Quốc gia" value={destination.country} />
              {destination.city && <SideRow label="Thành phố" value={destination.city} />}
              {destination.ratingAvg != null && (
                <SideRow label="Đánh giá" value={`${destination.ratingAvg.toFixed(1)} / 5`} />
              )}
            </div>
            <Link
              href={`/booking/${destination.slug}`}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#ff6d1a] px-4 py-4 font-black text-white"
            >
              Xem ưu đãi demo
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <p className="mt-3 text-center text-xs font-bold text-[#b45309]">{demoPaymentWarning}</p>
          </CommerceSurface>

          {destination.images && destination.images.length > 0 && (
            <CommerceSurface>
              <h2 className="text-xl font-black">Ảnh điểm đến</h2>
              <div className="mt-4 space-y-3">
                {destination.images.slice(0, 3).map((img, index) => (
                  <div
                    key={img.id}
                    className="h-28 rounded-2xl bg-cover bg-center"
                    style={{ backgroundImage: `url(${img.imageUrl})` }}
                    aria-label={img.altText ?? `${destination.name} ảnh ${index + 1}`}
                  />
                ))}
              </div>
            </CommerceSurface>
          )}
        </aside>
      </section>
    </main>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function InfoCard({ icon: Icon, title, value }: { icon: LucideIcon; title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#d9ecfb] bg-white p-5 shadow-[0_12px_30px_rgba(2,68,120,0.06)]">
      <Icon className="text-[#0277d4]" aria-hidden="true" />
      <h2 className="mt-4 text-xs font-black uppercase tracking-[0.14em] text-[#6f8594]">{title}</h2>
      <p className="mt-2 text-lg font-black">{value}</p>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#edf4fa] pb-3">
      <span className="font-bold text-[#476273]">{label}</span>
      <span className="text-right font-black">{value}</span>
    </div>
  );
}

function SideRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#edf4fa] pb-3">
      <span className="font-bold text-[#476273]">{label}</span>
      <span className="text-right font-black">{value}</span>
    </div>
  );
}
