'use client';

import { CheckCircle2, Headphones, ShieldCheck, Tag } from 'lucide-react';
import type { TranslationNamespace } from '@/lib/i18n/types';

export function TrustBand({ t }: { t: TranslationNamespace }) {
  const items = [
    {
      icon: ShieldCheck,
      color: '#0064D2',
      bg: 'bg-blue-50',
      title: t.home.safePayment,
      desc: t.home.safePaymentDesc,
    },
    {
      icon: CheckCircle2,
      color: '#00A86B',
      bg: 'bg-emerald-50',
      title: t.home.realData,
      desc: t.home.realDataDesc,
    },
    {
      icon: Headphones,
      color: '#FF6D00',
      bg: 'bg-orange-50',
      title: t.home.support247,
      desc: t.home.support247Desc,
    },
    {
      icon: Tag,
      color: '#F59E0B',
      bg: 'bg-amber-50',
      title: t.home.bestPrice,
      desc: t.home.bestPriceDesc,
    },
  ];

  return (
    <section className="border-t border-gray-100 bg-white">
      <div className="mx-auto max-w-[1200px] px-4 py-8">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {items.map(({ icon: Icon, color, bg, title, desc }) => (
            <div key={title} className="flex items-start gap-3">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${bg}`}
              >
                <Icon size={22} style={{ color }} />
              </div>
              <div>
                <p className="text-[13px] font-bold text-gray-800">{title}</p>
                <p className="mt-0.5 text-[11px] text-gray-500 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
