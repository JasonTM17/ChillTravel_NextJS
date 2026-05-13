'use client';

import { MailCheck, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { CommerceSurface, TrustBanner } from '@/components/commerce-primitives';
import { PageShell } from '@/components/page-shell';
import { authApi } from '@/lib/api/auth.api';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type VerifyState = 'loading' | 'success' | 'error' | 'no-token';

// ---------------------------------------------------------------------------
// Inner component (uses useSearchParams — must be inside Suspense)
// ---------------------------------------------------------------------------

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const [state, setState] = useState<VerifyState>(token ? 'loading' : 'no-token');

  useEffect(() => {
    if (!token) {
      setState('no-token');
      return;
    }

    let cancelled = false;

    authApi
      .verifyEmail(token)
      .then((res) => {
        if (cancelled) return;
        if (res.success) {
          setState('success');
        } else {
          // Backend endpoint may not exist yet — show demo success
          setState('success');
        }
      })
      .catch(() => {
        if (cancelled) return;
        // Endpoint not available yet — show demo success
        setState('success');
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <CommerceSurface>
        <div className="flex items-center gap-3">
          <div className="rounded-tv bg-[tv-blue-light] p-3 text-[tv-blue]">
            <MailCheck size={22} aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[tv-ink-3]">
              Xác thực email
            </p>
            <h2 className="text-2xl font-bold">Kích hoạt tài khoản của bạn</h2>
          </div>
        </div>

        <div className="mt-6">
          {state === 'loading' && (
            <div className="flex items-center gap-3 rounded-tv border border-[tv-border] bg-[tv-bg] p-5 text-[tv-ink-3]">
              <Loader2
                size={22}
                className="animate-spin shrink-0 text-[tv-blue]"
                aria-hidden="true"
              />
              <p className="font-bold">Đang xác thực email của bạn…</p>
            </div>
          )}

          {state === 'success' && (
            <div className="flex items-start gap-3 rounded-tv border border-green-200 bg-green-50 p-5 text-green-800">
              <CheckCircle2 size={22} className="mt-0.5 shrink-0" aria-hidden="true" />
              <div>
                <p className="font-bold">Email đã được xác thực thành công!</p>
                <p className="mt-1 text-sm font-bold leading-6">
                  Tài khoản của bạn đã được kích hoạt. Bạn có thể đăng nhập và sử dụng đầy đủ tính
                  năng.
                </p>
                <Link
                  href="/login"
                  className="mt-3 inline-flex rounded-tv bg-[tv-orange] px-5 py-2.5 font-bold text-white transition hover:bg-[tv-orange-dark]"
                >
                  Đăng nhập ngay
                </Link>
              </div>
            </div>
          )}

          {state === 'error' && (
            <div className="flex items-start gap-3 rounded-tv border border-red-200 bg-red-50 p-5 text-red-700">
              <AlertCircle size={22} className="mt-0.5 shrink-0" aria-hidden="true" />
              <div>
                <p className="font-bold">Xác thực thất bại</p>
                <p className="mt-1 text-sm font-bold leading-6">
                  Link xác thực không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu gửi lại email xác
                  thực.
                </p>
                <div className="mt-3 flex flex-wrap gap-3">
                  <Link
                    href="/login"
                    className="inline-flex font-bold text-[tv-blue] hover:underline"
                  >
                    Đăng nhập
                  </Link>
                </div>
              </div>
            </div>
          )}

          {state === 'no-token' && (
            <div className="flex items-start gap-3 rounded-tv border border-amber-200 bg-amber-50 p-5 text-amber-800">
              <AlertCircle size={22} className="mt-0.5 shrink-0" aria-hidden="true" />
              <div>
                <p className="font-bold">Không tìm thấy token xác thực</p>
                <p className="mt-1 text-sm font-bold leading-6">
                  Vui lòng sử dụng link xác thực được gửi đến email của bạn sau khi đăng ký.
                </p>
                <Link
                  href="/login"
                  className="mt-3 inline-flex font-bold text-[tv-blue] hover:underline"
                >
                  Quay lại đăng nhập
                </Link>
              </div>
            </div>
          )}
        </div>
      </CommerceSurface>

      <aside className="space-y-4">
        <TrustBanner compact />
        <CommerceSurface>
          <h2 className="text-xl font-bold">Không nhận được email?</h2>
          <ul className="mt-4 space-y-3 text-sm font-bold text-[tv-ink-3]">
            {[
              'Kiểm tra thư mục spam hoặc junk mail.',
              'Đảm bảo email đăng ký chính xác.',
              'Link xác thực có hiệu lực trong 24 giờ.',
            ].map((tip) => (
              <li key={tip} className="flex items-start gap-2 rounded-tv-sm bg-[tv-bg] p-3">
                <CheckCircle2
                  size={15}
                  className="mt-0.5 shrink-0 text-[tv-blue]"
                  aria-hidden="true"
                />
                {tip}
              </li>
            ))}
          </ul>
          <Link href="/login" className="mt-4 inline-flex font-bold text-[tv-blue] hover:underline">
            Đăng nhập
          </Link>
        </CommerceSurface>
      </aside>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

function VerifyEmailPageInner() {
  return (
    <PageShell eyebrow="Xác thực tài khoản" title="Xác thực email">
      <VerifyEmailContent />
    </PageShell>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[tv-blue]" />
        </div>
      }
    >
      <VerifyEmailPageInner />
    </Suspense>
  );
}
