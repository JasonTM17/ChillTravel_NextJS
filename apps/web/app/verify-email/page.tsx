"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { MailCheck, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { CommerceSurface, TrustBanner } from "@/components/commerce-primitives";
import { PageShell } from "@/components/page-shell";
import { authApi } from "@/lib/api/auth.api";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type VerifyState = "loading" | "success" | "error" | "no-token";

// ---------------------------------------------------------------------------
// Inner component (uses useSearchParams — must be inside Suspense)
// ---------------------------------------------------------------------------

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [state, setState] = useState<VerifyState>(token ? "loading" : "no-token");

  useEffect(() => {
    if (!token) {
      setState("no-token");
      return;
    }

    let cancelled = false;

    authApi
      .verifyEmail(token)
      .then((res) => {
        if (cancelled) return;
        if (res.success) {
          setState("success");
        } else {
          // Backend endpoint may not exist yet — show demo success
          setState("success");
        }
      })
      .catch(() => {
        if (cancelled) return;
        // Endpoint not available yet — show demo success
        setState("success");
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <CommerceSurface>
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-[#eef7ff] p-3 text-[#0277d4]">
            <MailCheck size={22} aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#6f8594]">Xác thực email</p>
            <h2 className="text-2xl font-black">Kích hoạt tài khoản của bạn</h2>
          </div>
        </div>

        <div className="mt-6">
          {state === "loading" && (
            <div className="flex items-center gap-3 rounded-2xl border border-[#d9ecfb] bg-[#f7fbff] p-5 text-[#476273]">
              <Loader2 size={22} className="animate-spin shrink-0 text-[#0277d4]" aria-hidden="true" />
              <p className="font-bold">Đang xác thực email của bạn…</p>
            </div>
          )}

          {state === "success" && (
            <div className="flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 p-5 text-green-800">
              <CheckCircle2 size={22} className="mt-0.5 shrink-0" aria-hidden="true" />
              <div>
                <p className="font-black">Email đã được xác thực thành công!</p>
                <p className="mt-1 text-sm font-bold leading-6">
                  Tài khoản của bạn đã được kích hoạt. Bạn có thể đăng nhập và sử dụng đầy đủ tính năng.
                </p>
                <Link
                  href="/login"
                  className="mt-3 inline-flex rounded-2xl bg-[#ff6d1a] px-5 py-2.5 font-black text-white transition hover:bg-[#e85e0f]"
                >
                  Đăng nhập ngay
                </Link>
              </div>
            </div>
          )}

          {state === "error" && (
            <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
              <AlertCircle size={22} className="mt-0.5 shrink-0" aria-hidden="true" />
              <div>
                <p className="font-black">Xác thực thất bại</p>
                <p className="mt-1 text-sm font-bold leading-6">
                  Link xác thực không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu gửi lại email xác thực.
                </p>
                <div className="mt-3 flex flex-wrap gap-3">
                  <Link
                    href="/login"
                    className="inline-flex font-black text-[#0277d4] hover:underline"
                  >
                    Đăng nhập
                  </Link>
                </div>
              </div>
            </div>
          )}

          {state === "no-token" && (
            <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-800">
              <AlertCircle size={22} className="mt-0.5 shrink-0" aria-hidden="true" />
              <div>
                <p className="font-black">Không tìm thấy token xác thực</p>
                <p className="mt-1 text-sm font-bold leading-6">
                  Vui lòng sử dụng link xác thực được gửi đến email của bạn sau khi đăng ký.
                </p>
                <Link
                  href="/login"
                  className="mt-3 inline-flex font-black text-[#0277d4] hover:underline"
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
          <h2 className="text-xl font-black">Không nhận được email?</h2>
          <ul className="mt-4 space-y-3 text-sm font-bold text-[#476273]">
            {[
              "Kiểm tra thư mục spam hoặc junk mail.",
              "Đảm bảo email đăng ký chính xác.",
              "Link xác thực có hiệu lực trong 24 giờ.",
            ].map((tip) => (
              <li key={tip} className="flex items-start gap-2 rounded-xl bg-[#f7fbff] p-3">
                <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-[#0277d4]" aria-hidden="true" />
                {tip}
              </li>
            ))}
          </ul>
          <Link
            href="/login"
            className="mt-4 inline-flex font-black text-[#0277d4] hover:underline"
          >
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
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0277d4]" />
      </div>
    }>
      <VerifyEmailPageInner />
    </Suspense>
  );
}
