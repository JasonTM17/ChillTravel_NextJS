import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tour du lịch — WanderViet',
  description:
    'Khám phá các tour du lịch Việt Nam và quốc tế. Đa dạng loại hình: biển, văn hóa, ẩm thực, núi, nghỉ dưỡng với giá tốt nhất.',
};

export default function ToursLayout({ children }: { children: React.ReactNode }) {
  return children;
}
