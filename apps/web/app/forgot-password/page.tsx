"use client";

import { useState } from "react";
import Link from "next/link";
import { KeyRound, AlertCircle, CheckCircle2 } from "lucide-react";
import { z } from "zod";
import { CommerceSurface, TrustBanner } from "@/components/commerce-primitives";
import { PageShell } from "@/components/page-shell";

// ---------------------------------------------------------------------------
// Validation schema
// ---------------------------------------------------------------------------

const forgotSchema = z.object({
  email: z.string().min(1, "Email không được để trống").email("Email không hợp lệ"),
});

type ForgotFields = z.infer<typeof forgotSchema>;

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ForgotPasswordPage() {
  const [fields, setFields] = useState<ForgotFields>({ email: "" });
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof ForgotFields, string>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name as keyof ForgotFields]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const result = forgotSchema.safeParse(fields);
    if (!result.success) {
      const errs: Partial<Record<keyof ForgotFields, string>> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof ForgotFields;
        if (!errs[field]) errs[field] = issue.message;
      }
      setFieldErrors(errs);
      return;
    }

    setIsLoading(true);
    try {
      // Backend endpoint may not exist yet — show demo success regardless
      // In production, call: await authApi.forgotPassword({ email: fields.email })
      await new Promise((resolve) => setTimeout(resolve, 600)); // simulate network
    } finally {
      setIsLoading(false);
      setSubmitted(true);
    }
  }

  return (
    <PageShell eyebrow="Khôi phục tài khoản" title="Quên mật khẩu">
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <CommerceSurface>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-[#eef7ff] p-3 text-[#0277d4]">
              <KeyRound size={22} aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#6f8594]">Đặt lại mật khẩu</p>
              <h2 className="text-2xl font-black">Nhập email để nhận link đặt lại</h2>
            </div>
          </div>

          {submitted ? (
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 p-5 text-green-800">
              <CheckCircle2 size={22} className="mt-0.5 shrink-0" aria-hidden="true" />
              <div>
                <p className="font-black">Email đã được gửi (demo)</p>
                <p className="mt-1 text-sm font-bold leading-6">
                  Nếu email tồn tại, chúng tôi đã gửi link đặt lại mật khẩu (demo).
                  Vui lòng kiểm tra hộp thư của bạn.
                </p>
                <Link
                  href="/login"
                  className="mt-3 inline-flex font-black text-[#0277d4] hover:underline"
                >
                  Quay lại đăng nhập
                </Link>
              </div>
            </div>
          ) : (
            <>
              <p className="mt-4 text-sm leading-6 text-[#476273]">
                Nhập địa chỉ email đã đăng ký. Chúng tôi sẽ gửi link đặt lại mật khẩu đến email đó.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 grid gap-4" noValidate>
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
                    <span id="email-error" className="flex items-center gap-1 text-xs font-bold text-red-600">
                      <AlertCircle size={13} aria-hidden="true" />
                      {fieldErrors.email}
                    </span>
                  )}
                </label>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="rounded-2xl bg-[#ff6d1a] px-5 py-3 font-black text-white transition hover:bg-[#e85e0f] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading ? "Đang gửi…" : "Gửi link đặt lại mật khẩu"}
                </button>
              </form>

              <p className="mt-4 text-sm leading-6 text-[#476273]">
                Nhớ mật khẩu rồi?{" "}
                <Link href="/login" className="font-black text-[#0277d4] hover:underline">
                  Đăng nhập
                </Link>
              </p>
            </>
          )}
        </CommerceSurface>

        <aside className="space-y-4">
          <TrustBanner compact />
          <CommerceSurface>
            <h2 className="text-xl font-black">Lưu ý</h2>
            <ul className="mt-4 space-y-3 text-sm font-bold text-[#476273]">
              {[
                "Link đặt lại có hiệu lực trong 1 giờ.",
                "Kiểm tra cả thư mục spam nếu không thấy email.",
                "Mỗi link chỉ dùng được một lần.",
              ].map((note) => (
                <li key={note} className="flex items-start gap-2 rounded-xl bg-[#f7fbff] p-3">
                  <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-[#0277d4]" aria-hidden="true" />
                  {note}
                </li>
              ))}
            </ul>
          </CommerceSurface>
        </aside>
      </div>
    </PageShell>
  );
}
