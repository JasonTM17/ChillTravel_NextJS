'use client';

/**
 * Admin Dashboard Overview — Task 37
 * Design §8 — 6 overview cards, revenue chart, bookings-by-status donut,
 * top tours bar chart, recent activities feed.
 * Requirements: Req 17, 45
 */

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
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
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

// ---------------------------------------------------------------------------
// Colour palette (Design DNA)
// ---------------------------------------------------------------------------

const BLUE = '#0064D2';
const ORANGE = '#FF6D00';
const TEAL = '#0f8b7b';
const GRAY = '#767676';

const STATUS_COLORS: Record<string, string> = {
  PENDING: ORANGE,
  CONFIRMED: BLUE,
  COMPLETED: TEAL,
  CANCELLED: '#ef4444',
  REFUNDED: '#a855f7',
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Chờ xác nhận',
  CONFIRMED: 'Đã xác nhận',
  COMPLETED: 'Hoàn thành',
  CANCELLED: 'Đã hủy',
  REFUNDED: 'Hoàn tiền',
};

// ---------------------------------------------------------------------------
// Skeleton helpers
// ---------------------------------------------------------------------------

function SkeletonBox({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-tv-sm bg-[#e8f4fd] ${className}`} aria-hidden="true" />
  );
}

function MetricCardSkeleton() {
  return (
    <div className="rounded-tv border border-[tv-border] bg-white p-5 shadow-tv-card">
      <SkeletonBox className="h-3 w-24" />
      <SkeletonBox className="mt-3 h-8 w-32" />
      <SkeletonBox className="mt-2 h-3 w-40" />
    </div>
  );
}

function ChartSkeleton({ height = 280 }: { height?: number }) {
  return (
    <div
      className="animate-pulse rounded-tv-sm bg-[#e8f4fd]"
      style={{ height }}
      aria-hidden="true"
    />
  );
}

// ---------------------------------------------------------------------------
// Metric card
// ---------------------------------------------------------------------------

interface MetricCardProps {
  label: string;
  value: string;
  helper: string;
  icon: React.ReactNode;
  tone?: 'blue' | 'orange' | 'teal';
}

function MetricCard({ label, value, helper, icon, tone = 'blue' }: MetricCardProps) {
  const valueColor =
    tone === 'orange' ? 'text-[tv-orange]' : tone === 'teal' ? 'text-[#0f8b7b]' : 'text-[tv-blue]';
  const iconBg =
    tone === 'orange'
      ? 'bg-[#fff3e8] text-[tv-orange]'
      : tone === 'teal'
        ? 'bg-[#e8fbf6] text-[#0f8b7b]'
        : 'bg-[tv-blue-light] text-[tv-blue]';

  return (
    <div className="rounded-tv border border-[tv-border] bg-white p-5 shadow-tv-card">
      <div className="flex items-start justify-between">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[tv-ink-3]">{label}</p>
        <div className={`rounded-tv-sm p-2 ${iconBg}`}>{icon}</div>
      </div>
      <p className={`mt-3 text-3xl font-bold ${valueColor}`}>{value}</p>
      <p className="mt-1 text-sm font-bold leading-6 text-[tv-ink-3]">{helper}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Error state
// ---------------------------------------------------------------------------

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-tv border border-red-100 bg-red-50 p-8 text-center">
      <AlertCircle size={40} className="text-red-400" aria-hidden="true" />
      <div>
        <p className="font-bold text-red-700">Không thể tải dữ liệu</p>
        <p className="mt-1 text-sm text-red-600">{message}</p>
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="rounded-tv-sm bg-[tv-blue] px-5 py-2 text-sm font-bold text-white transition hover:bg-[#0265b8]"
      >
        Thử lại
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Status badge
// ---------------------------------------------------------------------------

function StatusBadge({ status }: { status: string }) {
  const color = STATUS_COLORS[status] ?? GRAY;
  const label = STATUS_LABELS[status] ?? status;
  return (
    <span
      className="inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold"
      style={{ background: `${color}18`, color }}
    >
      {label}
    </span>
  );
}

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
    blue: 'bg-[tv-blue-light] text-[tv-blue] hover:bg-[#d0ecfa]',
    orange: 'bg-[#fff3e8] text-[tv-orange] hover:bg-[#ffe8d0]',
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
// Revenue chart
// ---------------------------------------------------------------------------

function RevenueChart({ data }: { data: RevenueData[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={BLUE} stopOpacity={0.18} />
            <stop offset="95%" stopColor={BLUE} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e8f4fd" />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 11, fill: GRAY }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: GRAY }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) =>
            v >= 1_000_000 ? `${(v / 1_000_000).toFixed(0)}tr` : `${v}`
          }
          width={48}
        />
        <Tooltip
          formatter={(value: number) => [formatVnd(value), 'Doanh thu']}
          contentStyle={{
            borderRadius: 12,
            border: '1px solid #E8E8E8',
            fontSize: 12,
            fontWeight: 700,
          }}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke={BLUE}
          strokeWidth={2.5}
          fill="url(#revenueGrad)"
          dot={false}
          activeDot={{ r: 5, fill: BLUE }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ---------------------------------------------------------------------------
// Bookings by status donut
// ---------------------------------------------------------------------------

function BookingsDonut({ data }: { data: BookingStatusCounts }) {
  const entries = Object.entries(data)
    .filter(([, v]) => v > 0)
    .map(([key, value]) => ({
      name: STATUS_LABELS[key] ?? key,
      value,
      color: STATUS_COLORS[key] ?? GRAY,
    }));

  const total = entries.reduce((s, e) => s + e.value, 0);

  return (
    <div className="flex flex-col items-center gap-4">
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={entries}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={3}
            dataKey="value"
          >
            {entries.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [
              `${value} (${total > 0 ? ((value / total) * 100).toFixed(1) : 0}%)`,
              'Đặt chỗ',
            ]}
            contentStyle={{
              borderRadius: 12,
              border: '1px solid #E8E8E8',
              fontSize: 12,
              fontWeight: 700,
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
        {entries.map((e) => (
          <div key={e.name} className="flex items-center gap-1.5 text-xs font-bold text-[tv-ink-3]">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ background: e.color }}
            />
            {e.name} ({e.value})
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Top tours bar chart
// ---------------------------------------------------------------------------

function TopToursChart({ data }: { data: TopTour[] }) {
  const chartData = data.slice(0, 5).map((t) => ({
    name: t.title.length > 20 ? `${t.title.slice(0, 20)}…` : t.title,
    bookings: t.bookingCount,
    revenue: t.revenue,
  }));

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ top: 4, right: 16, left: 0, bottom: 4 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e8f4fd" horizontal={false} />
        <XAxis
          type="number"
          tick={{ fontSize: 11, fill: GRAY }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="name"
          tick={{ fontSize: 11, fill: GRAY }}
          axisLine={false}
          tickLine={false}
          width={110}
        />
        <Tooltip
          formatter={(value: number, name: string) =>
            name === 'revenue' ? [formatVnd(value), 'Doanh thu'] : [value, 'Lượt đặt']
          }
          contentStyle={{
            borderRadius: 12,
            border: '1px solid #E8E8E8',
            fontSize: 12,
            fontWeight: 700,
          }}
        />
        <Legend
          formatter={(value: string) => (value === 'bookings' ? 'Lượt đặt' : 'Doanh thu')}
          wrapperStyle={{ fontSize: 11 }}
        />
        <Bar dataKey="bookings" fill={BLUE} radius={[0, 6, 6, 0]} barSize={14} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ---------------------------------------------------------------------------
// Recent bookings table
// ---------------------------------------------------------------------------

function RecentBookingsTable({ bookings }: { bookings: RecentActivities['recentBookings'] }) {
  if (!bookings.length) {
    return <p className="py-6 text-center text-sm text-[tv-ink-3]">Chưa có đặt chỗ nào.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[tv-border] text-left text-xs font-bold uppercase tracking-[0.12em] text-[tv-ink-3]">
            <th className="pb-3 pr-4">Mã đặt chỗ</th>
            <th className="pb-3 pr-4">Khách hàng</th>
            <th className="pb-3 pr-4">Tour</th>
            <th className="pb-3 pr-4">Tổng tiền</th>
            <th className="pb-3">Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.id} className="border-b border-[tv-border] last:border-b-0">
              <td className="py-3 pr-4 font-bold text-[tv-blue]">
                <Link href={`/admin/bookings`} className="hover:underline">
                  {b.bookingCode}
                </Link>
              </td>
              <td className="py-3 pr-4 text-[tv-ink]">{b.contactName}</td>
              <td className="py-3 pr-4 text-[tv-ink-3]">{b.tour?.title ?? '—'}</td>
              <td className="py-3 pr-4 font-bold text-[tv-ink]">{formatVnd(b.totalPrice)}</td>
              <td className="py-3">
                <StatusBadge status={b.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Recent contacts list
// ---------------------------------------------------------------------------

const CONTACT_STATUS_COLORS: Record<string, string> = {
  NEW: ORANGE,
  IN_PROGRESS: BLUE,
  RESOLVED: TEAL,
  CLOSED: GRAY,
};

const CONTACT_STATUS_LABELS: Record<string, string> = {
  NEW: 'Mới',
  IN_PROGRESS: 'Đang xử lý',
  RESOLVED: 'Đã giải quyết',
  CLOSED: 'Đã đóng',
};

function RecentContactsList({ contacts }: { contacts: RecentActivities['recentContacts'] }) {
  if (!contacts.length) {
    return <p className="py-6 text-center text-sm text-[tv-ink-3]">Chưa có yêu cầu tư vấn nào.</p>;
  }

  return (
    <ul className="space-y-3">
      {contacts.map((c) => {
        const color = CONTACT_STATUS_COLORS[c.status] ?? GRAY;
        const label = CONTACT_STATUS_LABELS[c.status] ?? c.status;
        return (
          <li
            key={c.id}
            className="flex items-start gap-3 rounded-tv-sm border border-[tv-border] p-3"
          >
            <div className="flex-1 min-w-0">
              <p className="truncate font-bold text-[tv-ink]">{c.name}</p>
              <p className="mt-0.5 truncate text-xs text-[tv-ink-3]">
                {c.email}
                {c.destinationInterested ? ` · ${c.destinationInterested}` : ''}
              </p>
              <p className="mt-0.5 text-xs text-[tv-ink-3]">
                {new Date(c.createdAt).toLocaleDateString('vi-VN')}
              </p>
            </div>
            <span
              className="inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold"
              style={{ background: `${color}18`, color }}
            >
              {label}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

// ---------------------------------------------------------------------------
// Pending reviews list
// ---------------------------------------------------------------------------

function PendingReviewsList({ reviews }: { reviews: RecentActivities['recentReviews'] }) {
  const pending = reviews.filter((r) => r.status === 'PENDING');

  if (!pending.length) {
    return (
      <p className="py-6 text-center text-sm text-[tv-ink-3]">Không có đánh giá nào chờ duyệt.</p>
    );
  }

  return (
    <ul className="space-y-3">
      {pending.map((r) => (
        <li
          key={r.id}
          className="flex items-start gap-3 rounded-tv-sm border border-[tv-border] p-3"
        >
          <div className="flex-1 min-w-0">
            <p className="truncate font-bold text-[tv-ink]">{r.title ?? r.content.slice(0, 60)}</p>
            <p className="mt-0.5 text-xs text-[tv-ink-3]">
              {'★'.repeat(r.rating)}
              {'☆'.repeat(5 - r.rating)} · {new Date(r.createdAt).toLocaleDateString('vi-VN')}
            </p>
          </div>
          <StatusBadge status={r.status} />
        </li>
      ))}
    </ul>
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

  // ---- Error state ----
  if (!loading && error) {
    return (
      <PageShell eyebrow="Quản trị hệ thống" title="Bảng vận hành ChillTravel">
        <ErrorState message={error} onRetry={fetchAll} />
      </PageShell>
    );
  }

  return (
    <PageShell eyebrow="Quản trị hệ thống" title="Bảng vận hành ChillTravel">
      <div className="space-y-8">
        {/* Quick actions */}
        <QuickActions />

        {/* ---- 6 Overview cards ---- */}
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

        {/* ---- Charts row ---- */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          {/* Revenue area chart */}
          <CommerceSurface>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[tv-blue]">
              Doanh thu
            </p>
            <h2 className="mt-1 text-xl font-bold text-[tv-ink]">12 tháng gần nhất</h2>
            <div className="mt-5">
              {loading ? (
                <ChartSkeleton height={280} />
              ) : revenue.length > 0 ? (
                <RevenueChart data={revenue} />
              ) : (
                <p className="py-16 text-center text-sm text-[tv-ink-3]">
                  Chưa có dữ liệu doanh thu.
                </p>
              )}
            </div>
          </CommerceSurface>

          {/* Bookings by status donut */}
          <CommerceSurface>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[tv-blue]">
              Đặt chỗ theo trạng thái
            </p>
            <h2 className="mt-1 text-xl font-bold text-[tv-ink]">Phân bổ hiện tại</h2>
            <div className="mt-5">
              {loading ? (
                <ChartSkeleton height={220} />
              ) : bookingsByStatus ? (
                <BookingsDonut data={bookingsByStatus} />
              ) : (
                <p className="py-16 text-center text-sm text-[tv-ink-3]">Chưa có dữ liệu.</p>
              )}
            </div>
          </CommerceSurface>
        </div>

        {/* ---- Top tours bar chart ---- */}
        <CommerceSurface>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[tv-blue]">
                Top tour
              </p>
              <h2 className="mt-1 text-xl font-bold text-[tv-ink]">5 tour được đặt nhiều nhất</h2>
            </div>
            <Link
              href="/admin/tours"
              className="rounded-tv-sm bg-[tv-blue-light] px-4 py-2 text-sm font-bold text-[tv-blue] transition hover:bg-[#d0ecfa]"
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
              <p className="py-12 text-center text-sm text-[tv-ink-3]">Chưa có dữ liệu tour.</p>
            )}
          </div>
        </CommerceSurface>

        {/* ---- Recent activities ---- */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent bookings */}
          <CommerceSurface>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[tv-blue]">
                  Hoạt động gần đây
                </p>
                <h2 className="mt-1 text-xl font-bold text-[tv-ink]">Đặt chỗ mới nhất</h2>
              </div>
              <Link
                href="/admin/bookings"
                className="rounded-tv-sm bg-[tv-blue-light] px-4 py-2 text-sm font-bold text-[tv-blue] transition hover:bg-[#d0ecfa]"
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

          {/* Recent contacts */}
          <CommerceSurface>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[tv-blue]">
                  Yêu cầu tư vấn
                </p>
                <h2 className="mt-1 text-xl font-bold text-[tv-ink]">Liên hệ gần đây</h2>
              </div>
              <Link
                href="/admin/contacts"
                className="rounded-tv-sm bg-[tv-blue-light] px-4 py-2 text-sm font-bold text-[tv-blue] transition hover:bg-[#d0ecfa]"
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

          {/* Pending reviews */}
          <CommerceSurface>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[tv-blue]">
                  Kiểm duyệt
                </p>
                <h2 className="mt-1 text-xl font-bold text-[tv-ink]">Đánh giá chờ duyệt</h2>
              </div>
              <Link
                href="/admin/reviews"
                className="rounded-tv-sm bg-[tv-blue-light] px-4 py-2 text-sm font-bold text-[tv-blue] transition hover:bg-[#d0ecfa]"
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
