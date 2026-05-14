'use client';

import { KeyRound, AlertCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { z } from 'zod';
import { CommerceSurface, TrustBanner } from '@/components/commerce-primitives';
import { PageShell } from '@/components/page-shell';

// ---------------------------------------------------------------------------
// Validation schema
// ---------------------------------------------------------------------------

const forgotSchema = z.object({
  email: z.string().min(1, 'Email không được để trống').email('Email không hợp lệ'),
});

type ForgotFields = z.infer<typeof forgotSchema>;

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ForgotPasswordPage() {
  const [fields, setFields] = useState<ForgotFields>({ email: '' });
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
            <div className="rounded-tv bg-tv-blue-light p-3 text-tv-blue">
              <KeyRound size={22} aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-tv-ink-3">
                Đặt lại mật khẩu
              </p>
              <h2 className="text-2xl font-bold">Nhập email để nhận link đặt lại</h2>
            </div>
          </div>

          {submitted ? (
            <div className="mt-6 flex items-start gap-3 rounded-tv border border-green-200 bg-green-50 p-5 text-green-800">
              <CheckCircle2 size={22} className="mt-0.5 shrink-0" aria-hidden="true" />
              <div>
                <p className="font-bold">Email đã được gửi (demo)</p>
                <p className="mt-1 text-sm font-bold leading-6">
                  Nếu email tồn tại, chúng tôi đã gửi link đặt lại mật khẩu (demo). Vui lòng kiểm
                  tra hộp thư của bạn.
                </p>
                <Link
                  href="/login"
                  className="mt-3 inline-flex font-bold text-tv-blue hover:underline"
                >
                  Quay lại đăng nhập
                </Link>
              </div>
            </div>
          ) : (
            <>
              <p className="mt-4 text-sm leading-6 text-tv-ink-3">
                Nhập địa chỉ email đã đăng ký. Chúng tôi sẽ gửi link đặt lại mật khẩu đến email đó.
              </p>

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
                    aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                  />
                  {fieldErrors.email && (
                    <span
                      id="email-error"
                      className="flex items-center gap-1 text-xs font-bold text-red-600"
                    >
                      <AlertCircle size={13} aria-hidden="true" />
                      {fieldErrors.email}
                    </span>
                  )}
                </label>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="rounded-tv bg-tv-orange px-5 py-3 font-bold text-white transition hover:bg-tv-orange-dark disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading ? 'Đang gửi…' : 'Gửi link đặt lại mật khẩu'}
                </button>
              </form>

              <p className="mt-4 text-sm leading-6 text-tv-ink-3">
                Nhớ mật khẩu rồi?{' '}
                <Link href="/login" className="font-bold text-tv-blue hover:underline">
                  Đăng nhập
                </Link>
              </p>
            </>
          )}
        </CommerceSurface>

        <aside className="space-y-4">
          <TrustBanner compact />
          <CommerceSurface>
            <h2 className="text-xl font-bold">Lưu ý</h2>
            <ul className="mt-4 space-y-3 text-sm font-bold text-tv-ink-3">
              {[
                'Link đặt lại có hiệu lực trong 1 giờ.',
                'Kiểm tra cả thư mục spam nếu không thấy email.',
                'Mỗi link chỉ dùng được một lần.',
              ].map((note) => (
                <li key={note} className="flex items-start gap-2 rounded-tv-sm bg-tv-bg p-3">
                  <CheckCircle2
                    size={15}
                    className="mt-0.5 shrink-0 text-tv-blue"
                    aria-hidden="true"
                  />
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
