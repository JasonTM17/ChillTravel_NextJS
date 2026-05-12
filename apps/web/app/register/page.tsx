"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserPlus, AlertCircle, CheckCircle2 } from "lucide-react";
import { z } from "zod";
import { CommerceSurface, StatusPill, TrustBanner } from "@/components/commerce-primitives";
import { PageShell } from "@/components/page-shell";
import { useAuth } from "@/lib/auth/auth-context";

// ---------------------------------------------------------------------------
// Validation schema
// ---------------------------------------------------------------------------

const registerSchema = z.object({
  fullName: z.string().min(1, "Tên không được để trống").min(2, "Tên phải có ít nhất 2 ký tự"),
  email: z.string().min(1, "Email không được để trống").email("Email không hợp lệ"),
  password: z
    .string()
    .min(1, "Mật khẩu không được để trống")
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
  phone: z.string().optional(),
});

type SignUpFields = z.infer<typeof registerSchema>;

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function SignUpPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [fields, setFields] = useState<SignUpFields>({
    fullName: "",
    email: "",
    password: "",
    phone: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof SignUpFields, string>>>({});
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name as keyof SignUpFields]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (error) setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const result = registerSchema.safeParse(fields);
    if (!result.success) {
      const errs: Partial<Record<keyof SignUpFields, string>> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof SignUpFields;
        if (!errs[field]) errs[field] = issue.message;
      }
      setFieldErrors(errs);
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        fullName: fields.fullName,
        email: fields.email,
        password: fields.password,
        ...(fields.phone ? { phone: fields.phone } : {}),
      };
      const res = await register(payload);
      if (res.success) {
        router.push("/");
      } else {
        setError(res.message ?? "Đăng ký thất bại. Vui lòng thử lại.");
      }
    } catch {
      setError("Đã xảy ra lỗi. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <PageShell eyebrow="Tạo tài khoản" title="Bắt đầu với WanderViet">
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <CommerceSurface>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-[#eef7ff] p-3 text-[#0277d4]">
              <UserPlus size={22} aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#6f8594]">Tài khoản mới</p>
              <h2 className="text-2xl font-black">Tạo tài khoản để khám phá</h2>
            </div>
          </div>

          {/* Error banner */}
          {error && (
            <div className="mt-4 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <AlertCircle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
              <p className="font-bold">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2" noValidate>
            <label className="grid gap-2 text-sm font-bold text-[#476273]">
              Họ và tên
              <input
                name="fullName"
                type="text"
                value={fields.fullName}
                onChange={handleChange}
                autoComplete="name"
                placeholder="Nguyễn Văn A"
                className="rounded-2xl border border-[#d9ecfb] bg-[#f7fbff] px-4 py-3 font-black text-[#071827] outline-none focus:border-[#0277d4] aria-[invalid=true]:border-red-400"
                aria-invalid={!!fieldErrors.fullName}
                aria-describedby={fieldErrors.fullName ? "fullName-error" : undefined}
              />
              {fieldErrors.fullName && (
                <span id="fullName-error" className="text-xs font-bold text-red-600">{fieldErrors.fullName}</span>
              )}
            </label>

            <label className="grid gap-2 text-sm font-bold text-[#476273]">
              Email
              <input
                name="email"
                type="email"
                value={fields.email}
                onChange={handleChange}
                autoComplete="email"
                placeholder="ban@example.com"
                className="rounded-2xl border border-[#d9ecfb] bg-[#f7fbff] px-4 py-3 font-black text-[#071827] outline-none focus:border-[#0277d4] aria-[invalid=true]:border-red-400"
                aria-invalid={!!fieldErrors.email}
                aria-describedby={fieldErrors.email ? "email-error" : undefined}
              />
              {fieldErrors.email && (
                <span id="email-error" className="text-xs font-bold text-red-600">{fieldErrors.email}</span>
              )}
            </label>

            <label className="grid gap-2 text-sm font-bold text-[#476273]">
              Mật khẩu
              <input
                name="password"
                type="password"
                value={fields.password}
                onChange={handleChange}
                autoComplete="new-password"
                placeholder="Ít nhất 8 ký tự"
                className="rounded-2xl border border-[#d9ecfb] bg-[#f7fbff] px-4 py-3 font-black text-[#071827] outline-none focus:border-[#0277d4] aria-[invalid=true]:border-red-400"
                aria-invalid={!!fieldErrors.password}
                aria-describedby={fieldErrors.password ? "password-error" : undefined}
              />
              {fieldErrors.password && (
                <span id="password-error" className="text-xs font-bold text-red-600">{fieldErrors.password}</span>
              )}
            </label>

            <label className="grid gap-2 text-sm font-bold text-[#476273]">
              Số điện thoại <span className="font-normal text-[#6f8594]">(tuỳ chọn)</span>
              <input
                name="phone"
                type="tel"
                value={fields.phone}
                onChange={handleChange}
                autoComplete="tel"
                placeholder="0912 345 678"
                className="rounded-2xl border border-[#d9ecfb] bg-[#f7fbff] px-4 py-3 font-black text-[#071827] outline-none focus:border-[#0277d4]"
              />
            </label>

            <button
              type="submit"
              disabled={isLoading}
              className="rounded-2xl bg-[#ff6d1a] px-5 py-3 font-black text-white transition hover:bg-[#e85e0f] disabled:cursor-not-allowed disabled:opacity-60 md:col-span-2"
            >
              {isLoading ? "Đang tạo tài khoản…" : "Tạo tài khoản"}
            </button>
          </form>

          <p className="mt-4 text-sm leading-6 text-[#476273]">
            Đã có tài khoản?{" "}
            <Link href="/login" className="font-black text-[#0277d4] hover:underline">
              Đăng nhập
            </Link>
          </p>
        </CommerceSurface>

        <aside className="space-y-4">
          <TrustBanner compact />
          <CommerceSurface>
            <h2 className="text-xl font-black">Sau khi đăng ký</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {["Đặt tour", "Yêu thích", "Lịch trình", "Đánh giá"].map((item) => (
                <StatusPill key={item} tone="teal">{item}</StatusPill>
              ))}
            </div>
            <ul className="mt-4 space-y-2">
              {[
                "Đặt tour và theo dõi booking",
                "Lưu điểm đến yêu thích",
                "Viết đánh giá sau chuyến đi",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm font-bold text-[#476273]">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[#0f8b7b]" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/login" className="mt-4 inline-flex font-black text-[#0277d4]">
              Đã có tài khoản
            </Link>
          </CommerceSurface>
        </aside>
      </div>
    </PageShell>
  );
}
