import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vé máy bay — WanderViet',
  description:
    'Tìm kiếm vé máy bay nội địa và quốc tế. So sánh giá vé từ Vietnam Airlines, VietJet Air, Bamboo Airways và nhiều hãng khác.',
};

export default function FlightsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
