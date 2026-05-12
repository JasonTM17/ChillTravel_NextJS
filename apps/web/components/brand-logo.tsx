import Image from "next/image";
import Link from "next/link";

export function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="flex min-w-fit items-center gap-3" aria-label="Về trang chủ ChillTravel">
      <Image src="/brand/logo-mark-islands.png" width={44} height={44} alt="" priority className="h-11 w-11 object-contain" />
      {!compact ? (
        <span className="leading-tight">
          <span className="block text-base font-bold text-[tv-ink]">ChillTravel</span>
          <span className="block text-[11px] font-bold text-[tv-ink-3]">Du lịch thông minh</span>
        </span>
      ) : null}
    </Link>
  );
}
