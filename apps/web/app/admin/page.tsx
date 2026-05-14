'use client';

import {
  TrendingUp,
  BookOpen,
  Clock,
  Users,
  MapPin,
  Compass,
  Plus,
  List,
  MessageSquare,
  BarChart2,
  PieChart as PieChartIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CommerceSurface } from '@/components/commerce-primitives';
import { PageShell } from '@/components/page-shell';
import { adminApi } from '@/lib/api/admin.api';
import type {
  DashboardSummary,
  RevenueData,
  BookingStatusCounts,
  TopTour,
  RecentActivities,
} from '@/lib/api/admin.api';
import { formatVnd } from '@/lib/utils';
import {
  SkeletonBox,
  MetricCardSkeleton,
  ChartSkeleton,
  MetricCard,
  ErrorState,
  RevenueChart,
  BookingsDonut,
  TopToursChart,
  RecentBookingsTable,
  RecentContactsList,
  PendingReviewsList,
} from './_components/dashboard-widgets';

// ---------------------------------------------------------------------------
// Quick action links
// ---------------------------------------------------------------------------

function QuickActions() {
  const actions = [
    { href: '/admin/tours/new', label: 'Thêm tour mới', icon: <Plus size={16} />, tone: 'orange' },
    {
      href: '/admin/destinations/new',
      label: 'Thêm điểm đến',
      icon: <MapPin size={16} />,
      tone: 'blue',
    },
    { href: '/admin/bookings', label: 'Quản lý đặt chỗ', icon: <List size={16} />, tone: 'blue' },
    {
      href: '/admin/contacts',
      label: 'Yêu cầu tư vấn',
      icon: <MessageSquare size={16} />,
      tone: 'teal',
    },
  ] as const;

  const toneClasses = {
    blue: 'bg-tv-blue-light text-tv-blue hover:bg-[#d0ecfa]',
    orange: 'bg-[#fff3e8] text-tv-orange hover:bg-[#ffe8d0]',
    teal: 'bg-[#e8fbf6] text-[#0f8b7b] hover:bg-[#d0f5ec]',
  };

  return (
    <div className="flex flex-wrap gap-3">
      {actions.map((a) => (
        <Link
          key={a.href}
          href={a.href}
          className={`inline-flex items-center gap-2 rounded-tv-sm px-4 py-2.5 text-sm font-bold transition ${toneClasses[a.tone]}`}
        >
          {a.icon}
          {a.label}
        </Link>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function AdminDashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [revenue, setRevenue] = useState<RevenueData[]>([]);
  const [bookingsByStatus, setBookingsByStatus] = useState<BookingStatusCounts | null>(null);
  const [topTours, setTopTours] = useState<TopTour[]>([]);
  const [activities, setActivities] = useState<RecentActivities | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [sumRes, revRes, bksRes, topRes, actRes] = await Promise.all([
        adminApi.dashboard.getSummary(),
        adminApi.dashboard.getRevenue(),
        adminApi.dashboard.getBookingsByStatus(),
        adminApi.dashboard.getTopTours(),
        adminApi.dashboard.getRecentActivities(),
      ]);

      if (sumRes.success) setSummary(sumRes.data);
      if (revRes.success) setRevenue(revRes.data);
      if (bksRes.success) setBookingsByStatus(bksRes.data);
      if (topRes.success) setTopTours(topRes.data);
      if (actRes.success) setActivities(actRes.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi khi tải dữ liệu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  if (!loading && error) {
    return (
      <PageShell eyebrow="Quản trị hệ thống" title="Bảng vận hành WanderViet">
        <ErrorState message={error} onRetry={fetchAll} />
      </PageShell>
    );
  }

  return (
    <PageShell eyebrow="Quản trị hệ thống" title="Bảng vận hành WanderViet">
      <div className="space-y-8">
        <QuickActions />

        {/* Overview cards */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <MetricCardSkeleton key={i} />)
          ) : summary ? (
            <>
              <MetricCard
                label="Tổng doanh thu"
                value={formatVnd(summary.totalRevenue)}
                helper="Tổng doanh thu từ các đặt chỗ đã thanh toán"
                icon={<TrendingUp size={18} />}
                tone="orange"
              />
              <MetricCard
                label="Tổng đặt chỗ"
                value={summary.totalBookings.toLocaleString('vi-VN')}
                helper="Tất cả đặt chỗ trên hệ thống"
                icon={<BookOpen size={18} />}
              />
              <MetricCard
                label="Chờ xác nhận"
                value={summary.pendingBookings.toLocaleString('vi-VN')}
                helper="Đặt chỗ đang chờ xử lý"
                icon={<Clock size={18} />}
                tone="orange"
              />
              <MetricCard
                label="Tổng người dùng"
                value={summary.totalUsers.toLocaleString('vi-VN')}
                helper="Tài khoản đã đăng ký"
                icon={<Users size={18} />}
                tone="teal"
              />
              <MetricCard
                label="Tổng tour"
                value={summary.totalTours.toLocaleString('vi-VN')}
                helper="Tour đang hoạt động trên nền tảng"
                icon={<Compass size={18} />}
              />
              <MetricCard
                label="Điểm đến"
                value={summary.totalDestinations.toLocaleString('vi-VN')}
                helper="Điểm đến đã được đăng tải"
                icon={<MapPin size={18} />}
                tone="teal"
              />
            </>
          ) : null}
        </div>

        {/* Charts row */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <CommerceSurface>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-tv-blue">Doanh thu</p>
            <h2 className="mt-1 text-xl font-bold text-tv-ink">12 tháng gần nhất</h2>
            <div className="mt-5">
              {loading ? (
                <ChartSkeleton height={280} />
              ) : revenue.length > 0 ? (
                <RevenueChart data={revenue} />
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50">
                    <BarChart2 className="h-8 w-8 text-gray-300" strokeWidth={1.5} />
                  </div>
                  <p className="text-base font-bold text-gray-900">Chưa có dữ liệu doanh thu</p>
                  <p className="mt-1 text-sm text-gray-500">
                    Doanh thu sẽ hiển thị khi có đặt chỗ thanh toán thành công.
                  </p>
                </div>
              )}
            </div>
          </CommerceSurface>

          <CommerceSurface>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-tv-blue">
              Đặt chỗ theo trạng thái
            </p>
            <h2 className="mt-1 text-xl font-bold text-tv-ink">Phân bổ hiện tại</h2>
            <div className="mt-5">
              {loading ? (
                <ChartSkeleton height={220} />
              ) : bookingsByStatus ? (
                <BookingsDonut data={bookingsByStatus} />
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50">
                    <PieChartIcon className="h-8 w-8 text-gray-300" strokeWidth={1.5} />
                  </div>
                  <p className="text-base font-bold text-gray-900">Chưa có dữ liệu</p>
                </div>
              )}
            </div>
          </CommerceSurface>
        </div>

        {/* Top tours */}
        <CommerceSurface>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-tv-blue">Top tour</p>
              <h2 className="mt-1 text-xl font-bold text-tv-ink">5 tour được đặt nhiều nhất</h2>
            </div>
            <Link
              href="/admin/tours"
              className="rounded-tv-sm bg-tv-blue-light px-4 py-2 text-sm font-bold text-tv-blue transition hover:bg-[#d0ecfa]"
            >
              Xem tất cả
            </Link>
          </div>
          <div className="mt-5">
            {loading ? (
              <ChartSkeleton height={240} />
            ) : topTours.length > 0 ? (
              <TopToursChart data={topTours} />
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-50">
                  <Compass className="h-7 w-7 text-gray-300" strokeWidth={1.5} />
                </div>
                <p className="text-base font-bold text-gray-900">Chưa có dữ liệu tour</p>
              </div>
            )}
          </div>
        </CommerceSurface>

        {/* Recent activities */}
        <div className="grid gap-6 lg:grid-cols-3">
          <CommerceSurface>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-tv-blue">
                  Hoạt động gần đây
                </p>
                <h2 className="mt-1 text-xl font-bold text-tv-ink">Đặt chỗ mới nhất</h2>
              </div>
              <Link
                href="/admin/bookings"
                className="rounded-tv-sm bg-tv-blue-light px-4 py-2 text-sm font-bold text-tv-blue transition hover:bg-[#d0ecfa]"
              >
                Xem tất cả
              </Link>
            </div>
            <div className="mt-5">
              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <SkeletonBox key={i} className="h-10 w-full" />
                  ))}
                </div>
              ) : activities ? (
                <RecentBookingsTable bookings={activities.recentBookings} />
              ) : null}
            </div>
          </CommerceSurface>

          <CommerceSurface>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-tv-blue">
                  Yêu cầu tư vấn
                </p>
                <h2 className="mt-1 text-xl font-bold text-tv-ink">Liên hệ gần đây</h2>
              </div>
              <Link
                href="/admin/contacts"
                className="rounded-tv-sm bg-tv-blue-light px-4 py-2 text-sm font-bold text-tv-blue transition hover:bg-[#d0ecfa]"
              >
                Xem tất cả
              </Link>
            </div>
            <div className="mt-5">
              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <SkeletonBox key={i} className="h-14 w-full" />
                  ))}
                </div>
              ) : activities ? (
                <RecentContactsList contacts={activities.recentContacts} />
              ) : null}
            </div>
          </CommerceSurface>

          <CommerceSurface>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-tv-blue">
                  Kiểm duyệt
                </p>
                <h2 className="mt-1 text-xl font-bold text-tv-ink">Đánh giá chờ duyệt</h2>
              </div>
              <Link
                href="/admin/reviews"
                className="rounded-tv-sm bg-tv-blue-light px-4 py-2 text-sm font-bold text-tv-blue transition hover:bg-[#d0ecfa]"
              >
                Xem tất cả
              </Link>
            </div>
            <div className="mt-5">
              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <SkeletonBox key={i} className="h-14 w-full" />
                  ))}
                </div>
              ) : activities ? (
                <PendingReviewsList reviews={activities.recentReviews} />
              ) : null}
            </div>
          </CommerceSurface>
        </div>
      </div>
    </PageShell>
  );
}
