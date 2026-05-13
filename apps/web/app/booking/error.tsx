'use client';

import { useEffect } from 'react';

export default function BookingError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.error('[BookingError]', error);
    }
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="rounded-tv border border-tv-border bg-white p-8 shadow-tv-card max-w-md w-full">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--tv-orange-light)]">
          <svg
            className="h-7 w-7 text-[var(--tv-orange)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-tv-ink">
          Đã xảy ra lỗi trong quá trình đặt chỗ
        </h2>
        <p className="mt-2 text-sm text-tv-ink-3">
          Rất tiếc, hệ thống không thể hoàn tất yêu cầu đặt chỗ của bạn. Dữ liệu thanh toán của
          bạn không bị ảnh hưởng. Vui lòng thử lại.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="rounded-tv bg-[var(--tv-orange)] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[var(--tv-orange-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tv-orange)] focus-visible:ring-offset-2"
          >
            Thử lại
          </button>
          <a
            href="/"
            className="rounded-tv border border-tv-border px-5 py-2.5 text-sm font-bold text-tv-ink-2 transition hover:bg-tv-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tv-blue)] focus-visible:ring-offset-2"
          >
            Quay về trang chủ
          </a>
        </div>
      </div>
    </div>
  );
}
