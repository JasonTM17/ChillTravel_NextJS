import Image from 'next/image';
import Link from 'next/link';

export function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href="/"
      className="flex min-w-fit items-center gap-2.5"
      aria-label="Về trang chủ WanderViet"
    >
      <Image
        src="/brand/logo-mark-islands.png"
        width={36}
        height={36}
        alt=""
        priority
        className="h-9 w-9 object-contain"
      />
      {!compact ? (
        <span className="leading-tight">
          <span className="block text-[15px] font-extrabold text-gray-900">
            Wander<span className="text-[#0064D2]">Viet</span>
          </span>
          <span className="block text-[10px] font-medium text-gray-400">Du lịch thông minh</span>
        </span>
      ) : null}
    </Link>
  );
}
