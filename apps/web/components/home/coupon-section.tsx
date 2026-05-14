'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const coupons = [
  {
    code: 'WVWELCOME10',
    title: 'Giảm 10% lần đầu',
    desc: 'Áp dụng tất cả tour & khách sạn',
    badge: 'Mới',
    bg: 'from-[#0064D2] to-[#004EA2]',
  },
  {
    code: 'WV500K',
    title: 'Giảm 500.000đ',
    desc: 'Đơn hàng từ 5.000.000đ',
    badge: 'Hot',
    bg: 'from-[#FF6D00] to-[#E55A00]',
  },
  {
    code: 'VWD-DANANG',
    title: 'Đà Nẵng cuối tuần',
    desc: 'Ưu đãi tour biển miền Trung',
    badge: 'Phổ biến',
    bg: 'from-teal-500 to-teal-700',
  },
  {
    code: 'FAMILY-PQ',
    title: 'Phú Quốc gia đình',
    desc: 'Resort + tour trọn gói',
    badge: 'Gói mẫu',
    bg: 'from-emerald-500 to-emerald-700',
  },
];

export function CouponSection() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-gray-900">Ưu đãi dành cho bạn</h2>
        <Link
          href="/tours"
          className="flex items-center gap-1 text-sm font-semibold text-[#0064D2] hover:underline"
        >
          Xem tất cả <ArrowRight size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {coupons.map((coupon) => (
          <div
            key={coupon.code}
            className="group overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-lg hover:-translate-y-1"
          >
            <div className={`bg-gradient-to-br ${coupon.bg} p-4 text-white`}>
              <span className="inline-block rounded-md bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase">
                {coupon.badge}
              </span>
              <p className="mt-2 text-[15px] font-bold leading-tight">{coupon.title}</p>
              <p className="mt-1 text-[11px] text-white/80">{coupon.desc}</p>
            </div>
            <div className="flex items-center justify-between border-t border-dashed border-gray-200 px-4 py-2.5 bg-gray-50">
              <code className="text-[12px] font-bold text-[#0064D2]">{coupon.code}</code>
              <span className="text-[11px] font-medium text-gray-400 group-hover:text-[#0064D2] transition-colors">
                Dùng ngay →
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
