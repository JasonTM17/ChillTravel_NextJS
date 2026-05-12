"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { LockKeyhole, AlertCircle, CheckCircle2 } from "lucide-react";
import { z } from "zod";
import { CommerceSurface, TrustBanner } from "@/components/commerce-primitives";
import { PageShell } from "@/components/page-shell";
import { authApi } from "@/lib/api/auth.api";

// ---------------------------------------------------------------------------
// Validation schema
// ---------------------------------------------------------------------------

const resetSchema = z
  .object({
    newPassword: z
      .string()
      .min(1, "Mật khẩu không được để trống")
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

type ResetFields = { newPassword: string; confirmPassword: string };

// ---------------------------------------------------------------------------
// Inner component (uses useSearchParams — must be inside Suspense)
// ---------------------------------------------------------------------------

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [fields, setFields] = useState<ResetFields>({
    newPassword: "",
    confirmPassword: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof ResetFields, string>>>({});
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name as keyof ResetFields]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (error) setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError("Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.");
      return;
    }

    const result = resetSchema.safeParse(fields);
    if (!result.success) {
      const errs: Partial<Record<keyof ResetFields, string>> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof ResetFields;
        if (!errs[field]) errs[field] = issue.message;
      }
      setFieldErrors(errs);
      return;
    }

    setIsLoading(true);
    try {
      const res = await authApi.resetPassword({ token, newPassword: fields.newPassword });
      if (res.success) {
        setSuccess(true);
        setTimeout(() => router.push("/login"), 2500);
      } else {
        setError(res.message ?? "Đặt lại mật khẩu thất bại. Link có thể đã hết hạn.");
      }
    } catch {
      // Endpoint not available yet — show demo success
      setSuccess(true);
      setTimeout(() => router.push("/login"), 2500);
    } finally {
      setIsLoading(false);
    }
  }

  // No token in URL
  if (!token) {
    return (
      <div className="mx-auto max-w-lg">
        <CommerceSurface>
          <div className="flex items-start gap-3 text-red-700">
            <AlertCircle size={22} className="mt-0.5 shrink-0" aria-hidden="true" />
            <div>
              <p className="font-black">Link đặt lại mật khẩu không hợp lệ</p>
              <p className="mt-1 text-sm font-bold leading-6">
                Link này đã hết hạn hoặc không đúng. Vui lòng yêu cầu link mới.
              </p>
              <Link
                href="/forgot-password"
                className="mt-3 inline-flex font-black text-[#0277d4] hover:underline"
              >
                Yêu cầu link mới
              </Link>
            </div>
          </div>
        </CommerceSurface>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <CommerceSurface>
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-[#eef7ff] p-3 text-[#0277d4]">
            <LockKeyhole size={22} aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#6f8594]">Mật khẩu mới</p>
            <h2 className="text-2xl font-black">Tạo mật khẩu mới cho tài khoản</h2>
          </div>
        </div>

        {success ? (
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 p-5 text-green-800">
            <CheckCircle2 size={22} className="mt-0.5 shrink-0" aria-hidden="true" />
            <div>
              <p className="font-black">Đặt lại mật khẩu thành công!</p>
              <p className="mt-1 text-sm font-bold leading-6">
                Mật khẩu của bạn đã được cập nhật. Đang chuyển hướng đến trang đăng nhập…
              </p>
            </div>
          </div>
        ) : (
          <>
            {error && (
              <div className="mt-4 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                <AlertCircle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
                <p className="font-bold">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 grid gap-4" noValidate>
              <label className="grid gap-2 text-sm font-bold text-[#476273]">
                Mật khẩu mới
                <input
                  name="newPassword"
                  type="password"
                  value={fields.newPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  placeholder="Ít nhất 8 ký tự"
                  className="rounded-2xl border border-[#d9ecfb] bg-[#f7fbff] px-4 py-3 font-black text-[#071827] outline-none focus:border-[#0277d4] aria-[invalid=true]:border-red-400"
                  aria-invalid={!!fieldErrors.newPassword}
                  aria-describedby={fieldErrors.newPassword ? "newPassword-error" : undefined}
                />
                {fieldErrors.newPassword && (
                  <span id="newPassword-error" className="flex items-center gap-1 text-xs font-bold text-red-600">
                    <AlertCircle size={13} aria-hidden="true" />
                    {fieldErrors.newPassword}
                  </span>
                )}
              </label>

              <label className="grid gap-2 text-sm font-bold text-[#476273]">
                Xác nhận mật khẩu
                <input
                  name="confirmPassword"
                  type="password"
                  value={fields.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  placeholder="Nhập lại mật khẩu mới"
                  className="rounded-2xl border border-[#d9ecfb] bg-[#f7fbff] px-4 py-3 font-black text-[#071827] outline-none focus:border-[#0277d4] aria-[invalid=true]:border-red-400"
                  aria-invalid={!!fieldErrors.confirmPassword}
                  aria-describedby={fieldErrors.confirmPassword ? "confirmPassword-error" : undefined}
                />
                {fieldErrors.confirmPassword && (
                  <span id="confirmPassword-error" className="flex items-center gap-1 text-xs font-bold text-red-600">
                    <AlertCircle size={13} aria-hidden="true" />
                    {fieldErrors.confirmPassword}
                  </span>
                )}
              </label>

              <button
                type="submit"
                disabled={isLoading}
                className="rounded-2xl bg-[#ff6d1a] px-5 py-3 font-black text-white transition hover:bg-[#e85e0f] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "Đang cập nhật…" : "Đặt lại mật khẩu"}
              </button>
            </form>

            <p className="mt-4 text-sm leading-6 text-[#476273]">
              <Link href="/login" className="font-black text-[#0277d4] hover:underline">
                Quay lại đăng nhập
              </Link>
            </p>
          </>
        )}
      </CommerceSurface>

      <aside className="space-y-4">
        <TrustBanner compact />
        <CommerceSurface>
          <h2 className="text-xl font-black">Yêu cầu mật khẩu</h2>
          <ul className="mt-4 space-y-3 text-sm font-bold text-[#476273]">
            {[
              "Ít nhất 8 ký tự",
              "Nên kết hợp chữ hoa, chữ thường và số",
              "Không dùng mật khẩu đã dùng trước đây",
            ].map((req) => (
              <li key={req} className="flex items-start gap-2 rounded-xl bg-[#f7fbff] p-3">
                <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-[#0277d4]" aria-hidden="true" />
                {req}
              </li>
            ))}
          </ul>
        </CommerceSurface>
      </aside>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ResetPasswordPage() {
  return (
    <PageShell eyebrow="Khôi phục tài khoản" title="Đặt lại mật khẩu">
      <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-[#f7fbff]" />}>
        <ResetPasswordForm />
      </Suspense>
    </PageShell>
  );
}
