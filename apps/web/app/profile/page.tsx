"use client";

/**
 * Profile page — Req 4, 27, 45
 * Shows user info, edit form, and change password section.
 * Wired to authApi.getMe / updateMe / changePassword.
 */

import { useState } from "react";
import {
  BadgeCheck,
  Bell,
  Globe2,
  ShieldCheck,
  Star,
  UserRound,
  Pencil,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { authApi } from "@/lib/api";
import {
  CommerceSurface,
  StatusPill,
  TrustBanner,
} from "@/components/commerce-primitives";
import { PageShell } from "@/components/page-shell";
import { AuthGuard } from "@/components/auth-guard";

// ---------------------------------------------------------------------------
// Status badge helpers
// ---------------------------------------------------------------------------

function roleLabel(role: string) {
  const labels: Record<string, string> = {
    ADMIN: "Quản trị viên",
    STAFF: "Nhân viên",
    USER: "Khách hàng",
  };
  return labels[role] ?? role;
}

// ---------------------------------------------------------------------------
// Edit Profile Form
// ---------------------------------------------------------------------------

function EditProfileForm({
  initialFullName,
  initialPhone,
  initialAvatarUrl,
  onSaved,
}: {
  initialFullName: string;
  initialPhone: string;
  initialAvatarUrl: string;
  onSaved: () => void;
}) {
  const { updateProfile } = useAuth();
  const [fullName, setFullName] = useState(initialFullName);
  const [phone, setPhone] = useState(initialPhone);
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await authApi.updateMe({ fullName, phone, avatarUrl });
      if (res.success) {
        await updateProfile(res.data);
        setSuccess(true);
        onSaved();
      } else {
        setError(res.message ?? "Cập nhật thất bại.");
      }
    } catch {
      setError("Lỗi kết nối. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-bold text-tv-ink mb-1">
          Họ và tên
        </label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full rounded-tv-sm border border-tv-border bg-tv-bg px-4 py-3 text-sm font-bold text-tv-ink focus:outline-none focus:ring-2 focus:ring-tv-blue"
          placeholder="Nhập họ và tên"
        />
      </div>
      <div>
        <label className="block text-sm font-bold text-tv-ink mb-1">
          Số điện thoại
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full rounded-tv-sm border border-tv-border bg-tv-bg px-4 py-3 text-sm font-bold text-tv-ink focus:outline-none focus:ring-2 focus:ring-tv-blue"
          placeholder="Nhập số điện thoại"
        />
      </div>
      <div>
        <label className="block text-sm font-bold text-tv-ink mb-1">
          URL ảnh đại diện
        </label>
        <input
          type="url"
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          className="w-full rounded-tv-sm border border-tv-border bg-tv-bg px-4 py-3 text-sm font-bold text-tv-ink focus:outline-none focus:ring-2 focus:ring-tv-blue"
          placeholder="https://..."
        />
      </div>
      {error && (
        <p className="rounded-tv-sm bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
          {error}
        </p>
      )}
      {success && (
        <p className="rounded-tv-sm bg-green-50 px-4 py-3 text-sm font-bold text-green-700">
          Cập nhật thành công!
        </p>
      )}
      <button
        type="submit"
        disabled={saving}
        className="rounded-tv bg-tv-blue px-6 py-3 text-sm font-bold text-white disabled:opacity-60"
      >
        {saving ? "Đang lưu..." : "Lưu thay đổi"}
      </button>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Change Password Form
// ---------------------------------------------------------------------------

function ChangePasswordForm() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword.length < 8) {
      setError("Mật khẩu mới phải có ít nhất 8 ký tự.");
      return;
    }
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await authApi.changePassword({ oldPassword, newPassword });
      if (res.success) {
        setSuccess(true);
        setOldPassword("");
        setNewPassword("");
      } else {
        setError(res.message ?? "Đổi mật khẩu thất bại.");
      }
    } catch {
      setError("Lỗi kết nối. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-bold text-tv-ink mb-1">
          Mật khẩu hiện tại
        </label>
        <div className="relative">
          <input
            type={showOld ? "text" : "password"}
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full rounded-tv-sm border border-tv-border bg-tv-bg px-4 py-3 pr-12 text-sm font-bold text-tv-ink focus:outline-none focus:ring-2 focus:ring-tv-blue"
            placeholder="Nhập mật khẩu hiện tại"
            required
          />
          <button
            type="button"
            onClick={() => setShowOld((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-tv-ink-3"
            aria-label={showOld ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          >
            {showOld ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>
      <div>
        <label className="block text-sm font-bold text-tv-ink mb-1">
          Mật khẩu mới
        </label>
        <div className="relative">
          <input
            type={showNew ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full rounded-tv-sm border border-tv-border bg-tv-bg px-4 py-3 pr-12 text-sm font-bold text-tv-ink focus:outline-none focus:ring-2 focus:ring-tv-blue"
            placeholder="Ít nhất 8 ký tự"
            required
          />
          <button
            type="button"
            onClick={() => setShowNew((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-tv-ink-3"
            aria-label={showNew ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          >
            {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>
      {error && (
        <p className="rounded-tv-sm bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
          {error}
        </p>
      )}
      {success && (
        <p className="rounded-tv-sm bg-green-50 px-4 py-3 text-sm font-bold text-green-700">
          Đổi mật khẩu thành công!
        </p>
      )}
      <button
        type="submit"
        disabled={saving}
        className="tv-btn-orange rounded-tv px-6 py-3 text-sm disabled:opacity-60"
      >
        {saving ? "Đang lưu..." : "Đổi mật khẩu"}
      </button>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Inner page content (rendered inside AuthGuard)
// ---------------------------------------------------------------------------

function ProfileContent() {
  const { user } = useAuth();
  const [editMode, setEditMode] = useState(false);

  if (!user) return null;

  return (
    <PageShell
      eyebrow="Hồ sơ du lịch"
      title="Thông tin tài khoản và thiết lập bảo mật"
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section className="space-y-6">
          {/* User info card */}
          <CommerceSurface>
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.fullName ?? "Avatar"}
                    className="h-16 w-16 rounded-3xl object-cover"
                  />
                ) : (
                  <div className="grid h-16 w-16 place-items-center rounded-3xl bg-tv-blue-light text-tv-blue">
                    <UserRound size={30} aria-hidden="true" />
                  </div>
                )}
                <div>
                  <div className="flex flex-wrap gap-2">
                    <StatusPill tone="teal">{roleLabel(user.role)}</StatusPill>
                    {user.emailVerified && (
                      <StatusPill tone="blue">Email đã xác thực</StatusPill>
                    )}
                  </div>
                  <h2 className="mt-2 text-2xl font-bold">
                    {user.fullName ?? "Chưa cập nhật tên"}
                  </h2>
                  <p className="mt-1 text-sm text-tv-ink-3">{user.email}</p>
                  {user.phone && (
                    <p className="mt-0.5 text-sm text-tv-ink-3">{user.phone}</p>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditMode((v) => !v)}
                className="flex items-center gap-2 rounded-tv border border-tv-border bg-white px-4 py-3 text-sm font-bold text-tv-blue"
              >
                <Pencil size={16} aria-hidden="true" />
                {editMode ? "Hủy chỉnh sửa" : "Chỉnh sửa"}
              </button>
            </div>
          </CommerceSurface>

          {/* Edit profile form */}
          {editMode && (
            <CommerceSurface>
              <h2 className="text-xl font-bold mb-5">Cập nhật thông tin</h2>
              <EditProfileForm
                initialFullName={user.fullName ?? ""}
                initialPhone={user.phone ?? ""}
                initialAvatarUrl={user.avatarUrl ?? ""}
                onSaved={() => setEditMode(false)}
              />
            </CommerceSurface>
          )}

          {/* Change password */}
          <CommerceSurface>
            <div className="flex items-center gap-3 mb-5">
              <Lock size={20} className="text-tv-blue" aria-hidden="true" />
              <h2 className="text-xl font-bold">Đổi mật khẩu</h2>
            </div>
            <ChangePasswordForm />
          </CommerceSurface>
        </section>

        <aside className="h-fit space-y-4 lg:sticky lg:top-24">
          <TrustBanner compact />
          <CommerceSurface>
            <h2 className="text-xl font-bold">Thiết lập</h2>
            <div className="mt-4 space-y-3">
              {(
                [
                  [
                    Globe2,
                    "Ngôn ngữ",
                    "Tiếng Việt mặc định, có thể mở rộng tiếng Anh.",
                  ],
                  [
                    Bell,
                    "Thông báo",
                    "Nhắc lịch trình và giữ chỗ demo theo giờ local.",
                  ],
                  [
                    ShieldCheck,
                    "An toàn thanh toán",
                    "Không lưu số thẻ thật hoặc thu tiền thật.",
                  ],
                  [
                    BadgeCheck,
                    "Badge du khách",
                    "Vietnam Explorer, Food Hunter, Beach Seeker.",
                  ],
                  [
                    Star,
                    "Đánh giá",
                    "Bài đánh giá mẫu có kiểm duyệt.",
                  ],
                ] as const
              ).map(([Icon, title, body]) => (
                <div
                  key={String(title)}
                  className="flex gap-3 rounded-tv bg-tv-bg p-4"
                >
                  <Icon
                    className="mt-0.5 shrink-0 text-tv-blue"
                    size={20}
                    aria-hidden="true"
                  />
                  <div>
                    <p className="font-bold">{String(title)}</p>
                    <p className="mt-1 text-sm leading-6 text-tv-ink-3">
                      {String(body)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CommerceSurface>
        </aside>
      </div>
    </PageShell>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ProfilePage() {
  return (
    <AuthGuard>
      <ProfileContent />
    </AuthGuard>
  );
}
