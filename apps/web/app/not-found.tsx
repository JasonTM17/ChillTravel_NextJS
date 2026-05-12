import Link from "next/link";
import { MapPin } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="rounded-full bg-[#eef7ff] p-6">
        <MapPin className="text-[#0277d4]" size={48} aria-hidden="true" />
      </div>
      <h1 className="mt-6 text-4xl font-black text-[#071827] dark:text-[#eaf7ff]">
        404
      </h1>
      <p className="mt-2 text-xl font-bold text-[#476273]">
        Trang không tìm thấy
      </p>
      <p className="mt-3 max-w-md text-sm leading-7 text-[#6f8594]">
        Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển. Hãy quay về
        trang chủ để tiếp tục khám phá.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#0277d4] px-6 py-3 font-black text-white transition hover:bg-[#005ea8]"
      >
        Về trang chủ
      </Link>
    </main>
  );
}
