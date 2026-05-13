import { MapPin } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="rounded-full bg-tv-blue-light p-6">
        <MapPin className="text-tv-blue" size={48} aria-hidden="true" />
      </div>
      <h1 className="mt-6 text-4xl font-bold text-tv-ink dark:text-[#eaf7ff]">404</h1>
      <p className="mt-2 text-xl font-bold text-tv-ink-3">Trang không tìm thấy</p>
      <p className="mt-3 max-w-md text-sm leading-7 text-tv-ink-3">
        Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển. Hãy quay về trang chủ để tiếp
        tục khám phá.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-2 rounded-tv-sm bg-tv-blue px-6 py-3 font-bold text-white transition hover:bg-tv-blue-dark"
      >
        Về trang chủ
      </Link>
    </main>
  );
}
