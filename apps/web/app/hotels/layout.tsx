import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Khách sạn — WanderViet',
  description:
    'Tìm kiếm và so sánh khách sạn, resort, villa trên khắp Việt Nam. Giá rõ ràng, không phát sinh giao dịch thật.',
};

export default function HotelsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
