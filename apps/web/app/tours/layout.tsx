import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Danh sách Tour | WanderViet',
  description: 'Khám phá hàng trăm tour du lịch hấp dẫn, đa dạng tại Việt Nam và quốc tế. So sánh giá, lịch trình và đặt tour dễ dàng cùng WanderViet.',
  openGraph: {
    title: 'Danh sách Tour | WanderViet',
    description: 'Khám phá hàng trăm tour du lịch hấp dẫn, đa dạng tại Việt Nam và quốc tế.',
  },
};

export default function ToursLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
