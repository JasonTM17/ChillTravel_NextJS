"use client";

import { useState, useEffect, useCallback } from "react";
import { adminApi } from "@/lib/api/admin.api";
import type { Coupon, CreateCouponRequest } from "@/lib/api/admin.api";
import { formatVnd } from "@/lib/utils";

// ─── Toast ───────────────────────────────────────────────────────────────────
type ToastType = "success" | "error";
interface ToastMsg { id: number; type: ToastType; text: string }

function useToast() {
  const [toasts, setToasts] = useState<ToastMsg[]>([]);
  const show = useCallback((text: string, type: ToastType = "success") => {
    const id = Date.now();
    setToasts((p) => [...p, { id, type, text }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3500);
  }, []);
  return { toasts, show };
}

function ToastContainer({ toasts }: { toasts: ToastMsg[] }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div key={t.id} className={`rounded-lg px-4 py-3 text-sm font-semibold text-white shadow-lg ${t.type === "success" ? "bg-[tv-blue]" : "bg-red-500"}`}>
          {t.text}
        </div>
      ))}
    </div>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function ActiveBadge({ isActive }: { isActive: boolean }) {
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
      {isActive ? "Đang hoạt động" : "Tắt"}
    </span>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
const EMPTY: CreateCouponRequest = {
  code: "", description: "", discountType: "PERCENT", discountValue: 10,
  minOrderAmount: undefined, maxDiscountAmount: undefined,
  usageLimit: undefined, validFrom: new Date().toISOString().slice(0, 10),
  validUntil: undefined, isActive: true,
};

function CouponModal({
  item, onClose, onSave,
}: {
  item: Coupon | null;
  onClose: () => void;
  onSave: (data: CreateCouponRequest) => Promise<void>;
}) {
  const [form, setForm] = useState<CreateCouponRequest>(
    item
      ? {
          code: item.code, description: item.description ?? "",
          discountType: item.discountType as "PERCENT" | "FIXED",
          discountValue: item.discountValue,
          minOrderAmount: item.minOrderAmount ?? undefined,
          maxDiscountAmount: item.maxDiscountAmount ?? undefined,
          usageLimit: item.usageLimit ?? undefined,
          validFrom: item.validFrom.slice(0, 10),
          validUntil: item.validUntil ? item.validUntil.slice(0, 10) : undefined,
          isActive: item.isActive,
        }
      : EMPTY
  );
  const [saving, setSaving] = useState(false);

  const setStr = (k: keyof CreateCouponRequest, v: string) => setForm((p) => ({ ...p, [k]: v }));
  const setNum = (k: keyof CreateCouponRequest, v: string) =>
    setForm((p) => ({ ...p, [k]: v ? Number(v) : undefined }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try { await onSave(form); } finally { setSaving(false); }
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-tv bg-white p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
        <h2 className="mb-4 text-lg font-bold text-[tv-blue]">
          {item ? "Chỉnh sửa mã giảm giá" : "Thêm mã giảm giá mới"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-600">Mã coupon *</label>
            <input
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-mono uppercase focus:border-[tv-blue] focus:outline-none"
              value={form.code}
              onChange={(e) => setStr("code", e.target.value.toUpperCase())}
              required
              placeholder="VD: SUMMER20"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-600">Mô tả</label>
            <input className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[tv-blue] focus:outline-none" value={form.description ?? ""} onChange={(e) => setStr("description", e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-600">Loại giảm giá *</label>
              <select
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[tv-blue] focus:outline-none"
                value={form.discountType}
                onChange={(e) => setForm((p) => ({ ...p, discountType: e.target.value as "PERCENT" | "FIXED" }))}
              >
                <option value="PERCENT">Phần trăm (%)</option>
                <option value="FIXED">Số tiền cố định (VND)</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-600">
                Giá trị * {form.discountType === "PERCENT" ? "(%)" : "(VND)"}
              </label>
              <input
                type="number"
                min={0}
                max={form.discountType === "PERCENT" ? 100 : undefined}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[tv-blue] focus:outline-none"
                value={form.discountValue}
                onChange={(e) => setForm((p) => ({ ...p, discountValue: Number(e.target.value) }))}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-600">Đơn hàng tối thiểu (VND)</label>
              <input type="number" min={0} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[tv-blue] focus:outline-none" value={form.minOrderAmount ?? ""} onChange={(e) => setNum("minOrderAmount", e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-600">Giảm tối đa (VND)</label>
              <input type="number" min={0} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[tv-blue] focus:outline-none" value={form.maxDiscountAmount ?? ""} onChange={(e) => setNum("maxDiscountAmount", e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-600">Giới hạn sử dụng</label>
              <input type="number" min={1} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[tv-blue] focus:outline-none" value={form.usageLimit ?? ""} onChange={(e) => setNum("usageLimit", e.target.value)} placeholder="Không giới hạn" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-600">Ngày bắt đầu *</label>
              <input type="date" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[tv-blue] focus:outline-none" value={form.validFrom} onChange={(e) => setStr("validFrom", e.target.value)} required />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-600">Ngày hết hạn</label>
            <input type="date" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[tv-blue] focus:outline-none" value={form.validUntil ?? ""} onChange={(e) => setForm((p) => ({ ...p, validUntil: e.target.value || undefined }))} />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="isActive" checked={form.isActive ?? true} onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))} />
            <label htmlFor="isActive" className="text-sm font-semibold text-gray-700">Kích hoạt ngay</label>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="rounded-lg border px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50">Hủy</button>
            <button type="submit" disabled={saving} className="rounded-lg bg-[tv-orange] px-4 py-2 text-sm font-bold text-white hover:bg-orange-600 disabled:opacity-60">
              {saving ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AdminCouponsPage() {
  const [items, setItems] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<"create" | Coupon | null>(null);
  const { toasts, show } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminApi.coupons.list({ size: 100 });
      setItems(res.data?.items ?? []);
    } catch {
      setError("Không thể tải danh sách mã giảm giá.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleSave(data: CreateCouponRequest) {
    try {
      if (modal && modal !== "create") {
        await adminApi.coupons.update((modal as Coupon).id, data);
        show("Cập nhật mã giảm giá thành công!");
      } else {
        await adminApi.coupons.create(data);
        show("Thêm mã giảm giá thành công!");
      }
      setModal(null);
      load();
    } catch {
      show("Có lỗi xảy ra. Vui lòng thử lại.", "error");
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Bạn có chắc muốn xóa mã giảm giá này?")) return;
    try {
      await adminApi.coupons.delete(id);
      show("Đã xóa mã giảm giá.");
      load();
    } catch {
      show("Không thể xóa. Vui lòng thử lại.", "error");
    }
  }

  return (
    <div className="min-h-screen bg-[tv-blue-light] p-6">
      <ToastContainer toasts={toasts} />

      <nav className="mb-4 text-sm text-gray-500">
        <span>Admin</span> <span className="mx-1">/</span>
        <span className="font-semibold text-[tv-blue]">Mã giảm giá</span>
      </nav>

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý mã giảm giá</h1>
        <button onClick={() => setModal("create")} className="rounded-tv-sm bg-[tv-orange] px-5 py-2.5 text-sm font-bold text-white shadow hover:bg-orange-600">
          + Thêm mới
        </button>
      </div>

      <div className="rounded-tv bg-white shadow">
        {loading ? (
          <div className="space-y-3 p-6">{[...Array(5)].map((_, i) => <div key={i} className="h-10 animate-pulse rounded-lg bg-gray-100" />)}</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">{error}</div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-gray-400">Chưa có mã giảm giá nào.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-[tv-blue-light] text-left text-xs font-bold uppercase text-gray-500">
                  <th className="px-4 py-3">Mã</th>
                  <th className="px-4 py-3">Loại</th>
                  <th className="px-4 py-3">Giá trị</th>
                  <th className="px-4 py-3">Đã dùng / Giới hạn</th>
                  <th className="px-4 py-3">Hết hạn</th>
                  <th className="px-4 py-3">Trạng thái</th>
                  <th className="px-4 py-3 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono font-bold text-[tv-blue]">{item.code}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {item.discountType === "PERCENT" ? "Phần trăm" : "Cố định"}
                    </td>
                    <td className="px-4 py-3 font-semibold text-[tv-orange]">
                      {item.discountType === "PERCENT"
                        ? `${item.discountValue}%`
                        : formatVnd(item.discountValue)}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {item.usedCount} / {item.usageLimit ?? "∞"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {item.validUntil ? new Date(item.validUntil).toLocaleDateString("vi-VN") : "Không giới hạn"}
                    </td>
                    <td className="px-4 py-3"><ActiveBadge isActive={item.isActive} /></td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => setModal(item)} className="mr-2 rounded-lg bg-[tv-blue-light] px-3 py-1 text-xs font-semibold text-[tv-blue] hover:bg-blue-100">Sửa</button>
                      <button onClick={() => handleDelete(item.id)} className="rounded-lg bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-100">Xóa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal !== null && (
        <CouponModal
          item={modal === "create" ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
