"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { LogIn, ShieldCheck, AlertCircle } from "lucide-react";
import { z } from "zod";
import { CommerceSurface, TrustBanner } from "@/components/commerce-primitives";
import { PageShell } from "@/components/page-shell";
import { useAuth } from "@/lib/auth/auth-context";

// ---------------------------------------------------------------------------
// Validation schema
// ---------------------------------------------------------------------------

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email không được để trống")
    .email("Email không hợp lệ"),
  password: z.string().min(1, "Mật khẩu không được để trống"),
});

type SignInFields = z.infer<typeof loginSchema>;

// ---------------------------------------------------------------------------
// Demo accounts helper
// ---------------------------------------------------------------------------

const accounts = [
  "admin@wanderviet.com / Admin@123456",
  "user@wanderviet.com / User@123456",
  "staff@wanderviet.com / Staff@123456",
];

// ---------------------------------------------------------------------------
// Inner component (uses useSearchParams — must be inside Suspense)
// ---------------------------------------------------------------------------

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const [fields, setFields] = useState<SignInFields>({
    email: "",
    password: "",
  });
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof SignInFields, string>>
  >({});
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (fieldErrors[name as keyof SignInFields]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (error) setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Client-side validation
    const result = loginSchema.safeParse(fields);
    if (!result.success) {
      const errs: Partial<Record<keyof SignInFields, string>> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof SignInFields;
        if (!errs[field]) errs[field] = issue.message;
      }
      setFieldErrors(errs);
      return;
    }

    setIsLoading(true);
    try {
      const res = await login({
        email: fields.email,
        password: fields.password,
      });
      if (res.success) {
        const redirect = searchParams.get("redirect") ?? "/";
        router.push(redirect);
      } else {
        setError(
          res.message ??
            "Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.",
        );
      }
    } catch {
      setError("Đã xảy ra lỗi. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <CommerceSurface>
        <div className="flex items-center gap-3">
          <div className="rounded-tv bg-tv-blue-light p-3 text-tv-blue">
            <LogIn size={22} aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-tv-ink-3">
              Tài khoản
            </p>
            <h2 className="text-2xl font-bold">Đăng nhập để tiếp tục</h2>
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div className="mt-4 flex items-start gap-3 rounded-tv border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle
              size={18}
              className="mt-0.5 shrink-0"
              aria-hidden="true"
            />
            <p className="font-bold">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4" noValidate>
          <label className="grid gap-2 text-sm font-bold text-tv-ink-3">
            Email
            <input
              name="email"
              type="email"
              value={fields.email}
              onChange={handleChange}
              autoComplete="email"
              placeholder="ban@example.com"
              className="rounded-tv border border-tv-border bg-tv-bg px-4 py-3 font-bold text-tv-ink outline-none focus:border-tv-blue aria-[invalid=true]:border-red-400"
              aria-invalid={!!fieldErrors.email}
              aria-describedby={fieldErrors.email ? "email-error" : undefined}
            />
            {fieldErrors.email && (
              <span id="email-error" className="text-xs font-bold text-red-600">
                {fieldErrors.email}
              </span>
            )}
          </label>

          <label className="grid gap-2 text-sm font-bold text-tv-ink-3">
            Mật khẩu
            <input
              name="password"
              type="password"
              value={fields.password}
              onChange={handleChange}
              autoComplete="current-password"
              placeholder="••••••••"
              className="rounded-tv border border-tv-border bg-tv-bg px-4 py-3 font-bold text-tv-ink outline-none focus:border-tv-blue aria-[invalid=true]:border-red-400"
              aria-invalid={!!fieldErrors.password}
              aria-describedby={
                fieldErrors.password ? "password-error" : undefined
              }
            />
            {fieldErrors.password && (
              <span
                id="password-error"
                className="text-xs font-bold text-red-600"
              >
                {fieldErrors.password}
              </span>
            )}
          </label>

          <div className="flex items-center justify-between">
            <Link
              href="/forgot-password"
              className="text-sm font-bold text-tv-blue hover:underline"
            >
              Quên mật khẩu?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="tv-btn-orange w-full rounded-tv py-3 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Đang đăng nhập…" : "Đăng nhập"}
          </button>
        </form>

        <p className="mt-4 text-sm leading-6 text-tv-ink-3">
          Chưa có tài khoản?{" "}
          <Link
            href="/register"
            className="font-bold text-tv-blue hover:underline"
          >
            Đăng ký ngay
          </Link>
        </p>
      </CommerceSurface>

      <aside className="space-y-4">
        <TrustBanner compact />
        <CommerceSurface>
          <div className="flex items-center gap-3">
            <div className="rounded-tv bg-[#e8fbf6] p-3 text-[#0f766e]">
              <ShieldCheck size={22} aria-hidden="true" />
            </div>
            <h2 className="text-xl font-bold">Tài khoản demo</h2>
          </div>
          <div className="mt-4 space-y-2 text-sm font-bold text-tv-ink-3">
            {accounts.map((account) => (
              <p key={account} className="rounded-tv-sm bg-tv-bg p-3">
                {account}
              </p>
            ))}
          </div>
          <Link
            href="/register"
            className="mt-4 inline-flex font-bold text-tv-blue"
          >
            Tạo tài khoản mới
          </Link>
        </CommerceSurface>
      </aside>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function SignInPage() {
  return (
    <PageShell eyebrow="Truy cập tài khoản" title="Đăng nhập WanderViet">
      <Suspense
        fallback={
          <div className="h-64 animate-pulse rounded-tv bg-tv-bg" />
        }
      >
        <SignInForm />
      </Suspense>
    </PageShell>
  );
}
