'use client';

import { useEffect } from 'react';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.error('[AdminError]', error);
    }
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="rounded-xl border border-gray-100 bg-white p-8 shadow-sm max-w-md w-full">
        <h2 className="text-xl font-bold text-gray-900">Lỗi trang quản trị</h2>
        <p className="mt-2 text-sm text-gray-500">
          Đã xảy ra lỗi khi tải trang quản trị. Vui lòng thử lại.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="rounded-lg bg-[#0064D2] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#004EA2]"
          >
            Thử lại
          </button>
          <a
            href="/"
            className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50"
          >
            Quay về trang chủ
          </a>
        </div>
      </div>
    </div>
  );
}
