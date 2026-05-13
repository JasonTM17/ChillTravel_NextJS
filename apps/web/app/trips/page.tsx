import { userBookingSummaries } from '@vietwander/shared';
import { CalendarDays, CheckCircle2, MapPinned, PlaneTakeoff, WalletCards } from 'lucide-react';
import Link from 'next/link';
import {
  CommerceMetric,
  CommerceSurface,
  StatusPill,
  TrustBanner,
} from '@/components/commerce-primitives';
import { PageShell } from '@/components/page-shell';
import { formatVnd } from '@/lib/utils';

const tripDays = [
  {
    day: 1,
    title: 'Đến Đà Nẵng',
    area: 'Mỹ Khê',
    activities: ['Nhận phòng demo', 'Đi dạo biển', 'Ăn hải sản'],
    cost: 2800000,
  },
  {
    day: 2,
    title: 'Sơn Trà và phố cổ',
    area: 'Sơn Trà · Hội An',
    activities: ['Chùa Linh Ứng', 'Cà phê ven sông', 'Đèn lồng Hội An'],
    cost: 3400000,
  },
  {
    day: 3,
    title: 'Ẩm thực miền Trung',
    area: 'Trung tâm Đà Nẵng',
    activities: ['Mì Quảng', 'Bánh tráng cuốn', 'Chợ đêm'],
    cost: 2100000,
  },
];

export default function Page() {
  return (
    <PageShell eyebrow="Chuyến đi" title="Timeline chuyến đi đã lưu, dễ chia sẻ và lưu offline">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section className="space-y-5">
          <CommerceSurface>
            <div className="grid gap-4 md:grid-cols-3">
              <CommerceMetric
                label="Thời lượng"
                value="3 ngày"
                helper="Nhịp cân bằng cho cặp đôi hoặc nhóm nhỏ."
              />
              <CommerceMetric
                label="Dự toán"
                value={formatVnd(8300000)}
                helper="Dữ liệu mẫu local, không phải giá thật."
                tone="orange"
              />
              <CommerceMetric
                label="Offline"
                value="Sẵn sàng"
                helper="Checklist và ghi chú văn hóa đã lưu."
                tone="teal"
              />
            </div>
          </CommerceSurface>
          <div className="space-y-4">
            {tripDays.map((day) => (
              <CommerceSurface key={day.day}>
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <StatusPill tone="blue">Ngày {day.day}</StatusPill>
                    <h2 className="mt-3 text-2xl font-bold">{day.title}</h2>
                    <p className="mt-1 inline-flex items-center gap-2 text-sm font-bold text-tv-ink-3">
                      <MapPinned size={16} className="text-tv-blue" aria-hidden="true" />
                      {day.area}
                    </p>
                  </div>
                  <p className="rounded-tv bg-[#fff3e8] px-4 py-2 text-sm font-bold text-[#b45309]">
                    {formatVnd(day.cost)}
                  </p>
                </div>
                <div className="mt-5 grid gap-3 md:grid-cols-3">
                  {day.activities.map((activity) => (
                    <div
                      key={activity}
                      className="flex gap-2 rounded-tv bg-tv-bg p-4 text-sm font-bold text-tv-ink-3"
                    >
                      <CheckCircle2
                        size={17}
                        className="mt-0.5 shrink-0 text-[#0f8b7b]"
                        aria-hidden="true"
                      />
                      {activity}
                    </div>
                  ))}
                </div>
              </CommerceSurface>
            ))}
          </div>
        </section>
        <aside className="h-fit space-y-4 lg:sticky lg:top-24">
          <TrustBanner compact />
          <CommerceSurface>
            <h2 className="text-xl font-bold">Booking hub</h2>
            <div className="mt-4 space-y-3">
              {userBookingSummaries.map((booking) => (
                <Link
                  key={booking.id}
                  href="/booking/demo"
                  className="block rounded-tv bg-tv-bg p-4"
                >
                  <p className="font-bold text-tv-blue">{booking.code}</p>
                  <p className="mt-1 text-sm font-bold text-tv-ink">{booking.title}</p>
                  <p className="mt-1 text-xs font-bold text-tv-ink-3">{booking.paymentWarning}</p>
                </Link>
              ))}
            </div>
          </CommerceSurface>
          <CommerceSurface>
            <h2 className="text-xl font-bold">Gói chuyến đi</h2>
            <div className="mt-4 space-y-3">
              {(
                [
                  [CalendarDays, 'Lịch đọc nhanh', 'Sáng, chiều, tối rõ ràng cho từng ngày.'],
                  [WalletCards, 'Ngân sách mẫu', 'Không khẳng định giá thật hoặc chỗ trống thật.'],
                  [
                    PlaneTakeoff,
                    'Xuất phát',
                    'Có thể đổi thành Hà Nội, TP.HCM hoặc địa phương khác.',
                  ],
                ] as const
              ).map(([Icon, title, body]) => (
                <div key={title} className="flex gap-3 rounded-tv bg-tv-bg p-4">
                  <Icon className="mt-0.5 shrink-0 text-tv-blue" size={20} aria-hidden="true" />
                  <div>
                    <p className="font-bold">{title}</p>
                    <p className="mt-1 text-sm leading-6 text-tv-ink-3">{body}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/booking/da-nang"
              className="mt-5 inline-flex w-full justify-center rounded-tv bg-tv-orange px-4 py-3 font-bold text-white"
            >
              Đặt chỗ demo
            </Link>
          </CommerceSurface>
        </aside>
      </div>
    </PageShell>
  );
}
