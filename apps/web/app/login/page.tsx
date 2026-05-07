import Link from "next/link";
import { LogIn, ShieldCheck } from "lucide-react";
import { CommerceSurface, TrustBanner } from "@/components/commerce-primitives";
import { PageShell } from "@/components/page-shell";

const accounts = [
  "admin@chilltravel.local / Admin123!",
  "user@chilltravel.local / User123!",
  "guide@chilltravel.local / Guide123!",
  "host@chilltravel.local / Host123!"
];

export default function Page() {
  return (
    <PageShell eyebrow="Truy cập demo" title="Đăng nhập ChillTravel">
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <CommerceSurface>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-[#eef7ff] p-3 text-[#0277d4]">
              <LogIn size={22} aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#6f8594]">Tài khoản local</p>
              <h2 className="text-2xl font-black">Dùng tài khoản demo để vào luồng sản phẩm</h2>
            </div>
          </div>
          <form className="mt-6 grid gap-4">
            <label className="grid gap-2 text-sm font-bold text-[#476273]">
              Email
              <input defaultValue="user@chilltravel.local" className="rounded-2xl border border-[#d9ecfb] bg-[#f7fbff] px-4 py-3 font-black text-[#071827] outline-none focus:border-[#0277d4]" />
            </label>
            <label className="grid gap-2 text-sm font-bold text-[#476273]">
              Mật khẩu
              <input defaultValue="User123!" type="password" className="rounded-2xl border border-[#d9ecfb] bg-[#f7fbff] px-4 py-3 font-black text-[#071827] outline-none focus:border-[#0277d4]" />
            </label>
            <button type="button" className="rounded-2xl bg-[#ff6d1a] px-5 py-3 font-black text-white">
              Đăng nhập demo
            </button>
          </form>
          <p className="mt-4 text-sm leading-6 text-[#476273]">Đây là giao diện hồ sơ trình diễn dùng phiên local/mô phỏng, không gửi email thật.</p>
        </CommerceSurface>
        <aside className="space-y-4">
          <TrustBanner compact />
          <CommerceSurface>
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-[#e8fbf6] p-3 text-[#0f766e]">
                <ShieldCheck size={22} aria-hidden="true" />
              </div>
              <h2 className="text-xl font-black">Tài khoản demo</h2>
            </div>
            <div className="mt-4 space-y-2 text-sm font-bold text-[#476273]">
              {accounts.map((account) => (
                <p key={account} className="rounded-xl bg-[#f7fbff] p-3">{account}</p>
              ))}
            </div>
            <Link href="/register" className="mt-4 inline-flex font-black text-[#0277d4]">Tạo hồ sơ demo</Link>
          </CommerceSurface>
        </aside>
      </div>
    </PageShell>
  );
}
