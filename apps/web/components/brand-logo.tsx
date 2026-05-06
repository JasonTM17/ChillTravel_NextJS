import Image from "next/image";
import Link from "next/link";

export function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="flex min-w-fit items-center gap-3" aria-label="Về trang chủ VietWander AI">
      <Image src="/brand/logo-mark.svg" width={42} height={42} alt="" priority className="h-10 w-10 rounded-xl shadow-[0_10px_24px_rgba(2,119,212,0.24)]" />
      {!compact ? (
        <span className="leading-tight">
          <span className="block text-base font-black text-[#071827]">VietWander AI</span>
          <span className="block text-[11px] font-bold text-[#476273]">Du lịch thông minh</span>
        </span>
      ) : null}
    </Link>
  );
}
