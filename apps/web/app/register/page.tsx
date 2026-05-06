import Link from "next/link";
import { UserPlus } from "lucide-react";
import { CommerceSurface, StatusPill, TrustBanner } from "@/components/commerce-primitives";
import { PageShell } from "@/components/page-shell";

export default function Page() {
  return (
    <PageShell eyebrow="Tạo hồ sơ demo" title="Bắt đầu với phong cách du lịch của bạn">
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <CommerceSurface>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-[#eef7ff] p-3 text-[#0277d4]">
              <UserPlus size={22} aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#6f8594]">Hồ sơ local</p>
              <h2 className="text-2xl font-black">Tạo hồ sơ không cần thông tin thật</h2>
            </div>
          </div>
          <form className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold text-[#476273]">
              Tên hiển thị
              <input defaultValue="Minh Chill" className="rounded-2xl border border-[#d9ecfb] bg-[#f7fbff] px-4 py-3 font-black text-[#071827] outline-none focus:border-[#0277d4]" />
            </label>
            <label className="grid gap-2 text-sm font-bold text-[#476273]">
              Email demo
              <input defaultValue="minh@chilltravel.local" className="rounded-2xl border border-[#d9ecfb] bg-[#f7fbff] px-4 py-3 font-black text-[#071827] outline-none focus:border-[#0277d4]" />
            </label>
            <label className="grid gap-2 text-sm font-bold text-[#476273] md:col-span-2">
              Bạn thích kiểu đi nào?
              <select className="rounded-2xl border border-[#d9ecfb] bg-[#f7fbff] px-4 py-3 font-black text-[#071827] outline-none focus:border-[#0277d4]">
                <option>Ẩm thực và văn hóa</option>
                <option>Biển yên bình</option>
                <option>Gia đình an toàn</option>
                <option>Tiết kiệm nhưng nhiều trải nghiệm</option>
              </select>
            </label>
            <button type="button" className="rounded-2xl bg-[#ff6d1a] px-5 py-3 font-black text-white md:col-span-2">
              Tạo hồ sơ demo
            </button>
          </form>
        </CommerceSurface>
        <aside className="space-y-4">
          <TrustBanner compact />
          <CommerceSurface>
            <h2 className="text-xl font-black">Gợi ý sau khi tạo hồ sơ</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {["Quiz phong cách", "Yêu thích", "Gói offline", "Lịch trình thông minh"].map((item) => (
                <StatusPill key={item} tone="teal">{item}</StatusPill>
              ))}
            </div>
            <Link href="/login" className="mt-4 inline-flex font-black text-[#0277d4]">Đã có tài khoản demo</Link>
          </CommerceSurface>
        </aside>
      </div>
    </PageShell>
  );
}
