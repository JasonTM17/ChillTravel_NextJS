"use client";

import { useState, useEffect, useCallback } from "react";
import { adminApi } from "@/lib/api/admin.api";
import type { Tour, CreateTourRequest } from "@/lib/api/tour.api";
import type { Destination } from "@/lib/api/destination.api";
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
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    ACTIVE: "bg-green-100 text-green-700",
    INACTIVE: "bg-gray-100 text-gray-600",
    DELETED: "bg-red-100 text-red-600",
  };
  const labels: Record<string, string> = { ACTIVE: "Hoạt động", INACTIVE: "Ẩn", DELETED: "Đã xóa" };
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${map[status] ?? "bg-gray-100 text-gray-600"}`}>
      {labels[status] ?? status}
    </span>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
const EMPTY: CreateTourRequest = {
  title: "", destinationId: "", description: "", shortDescription: "",
  durationDays: 1, durationNights: 0, basePrice: 0, salePrice: undefined,
  maxGuests: 10, minGuests: 1, availableSlots: 10, imageUrl: "", featured: false,
};

function TourModal({
  item, destinations, onClose, onSave,
}: {
  item: Tour | null;
  destinations: Destination[];
  onClose: () => void;
  onSave: (data: CreateTourRequest) => Promise<void>;
}) {
  const [form, setForm] = useState<CreateTourRequest>(
    item
      ? {
          title: item.title, destinationId: item.destinationId,
          description: item.description, shortDescription: item.shortDescription ?? "",
          durationDays: item.durationDays, durationNights: item.durationNights,
          basePrice: item.basePrice, salePrice: item.salePrice ?? undefined,
          maxGuests: item.maxGuests, minGuests: item.minGuests,
          availableSlots: item.availableSlots, imageUrl: item.imageUrl ?? "",
          featured: item.featured,
        }
      : EMPTY
  );
  const [saving, setSaving] = useState(false);

  const setStr = (k: keyof CreateTourRequest, v: string) => setForm((p) => ({ ...p, [k]: v }));
  const setNum = (k: keyof CreateTourRequest, v: string) => setForm((p) => ({ ...p, [k]: Number(v) }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try { await onSave(form); } finally { setSaving(false); }
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-tv bg-white p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
        <h2 className="mb-4 text-lg font-bold text-[tv-blue]">
          {item ? "Chỉnh sửa tour" : "Thêm tour mới"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-600">Tên tour *</label>
            <input className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[tv-blue] focus:outline-none" value={form.title} onChange={(e) => setStr("title", e.target.value)} required />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-600">Điểm đến *</label>
            <select className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[tv-blue] focus:outline-none" value={form.destinationId} onChange={(e) => setStr("destinationId", e.target.value)} required>
              <option value="">-- Chọn điểm đến --</option>
              {destinations.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-600">Số ngày *</label>
              <input type="number" min={1} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[tv-blue] focus:outline-none" value={form.durationDays} onChange={(e) => setNum("durationDays", e.target.value)} required />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-600">Số đêm</label>
              <input type="number" min={0} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[tv-blue] focus:outline-none" value={form.durationNights} onChange={(e) => setNum("durationNights", e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-600">Giá gốc (VND) *</label>
              <input type="number" min={0} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[tv-blue] focus:outline-none" value={form.basePrice} onChange={(e) => setNum("basePrice", e.target.value)} required />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-600">Giá khuyến mãi (VND)</label>
              <input type="number" min={0} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[tv-blue] focus:outline-none" value={form.salePrice ?? ""} onChange={(e) => setForm((p) => ({ ...p, salePrice: e.target.value ? Number(e.target.value) : undefined }))} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-600">Tối đa khách *</label>
              <input type="number" min={1} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[tv-blue] focus:outline-none" value={form.maxGuests} onChange={(e) => setNum("maxGuests", e.target.value)} required />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-600">Tối thiểu khách</label>
              <input type="number" min={1} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[tv-blue] focus:outline-none" value={form.minGuests} onChange={(e) => setNum("minGuests", e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-600">Chỗ còn lại *</label>
              <input type="number" min={0} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[tv-blue] focus:outline-none" value={form.availableSlots} onChange={(e) => setNum("availableSlots", e.target.value)} required />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-600">URL ảnh đại diện</label>
            <input className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[tv-blue] focus:outline-none" value={form.imageUrl ?? ""} onChange={(e) => setStr("imageUrl", e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-600">Mô tả ngắn</label>
            <input className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[tv-blue] focus:outline-none" value={form.shortDescription ?? ""} onChange={(e) => setStr("shortDescription", e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-600">Mô tả đầy đủ *</label>
            <textarea className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[tv-blue] focus:outline-none" rows={3} value={form.description} onChange={(e) => setStr("description", e.target.value)} required />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="featured" checked={form.featured ?? false} onChange={(e) => setForm((p) => ({ ...p, featured: e.target.checked }))} />
            <label htmlFor="featured" className="text-sm font-semibold text-gray-700">Tour nổi bật</label>
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
export default function AdminToursPage() {
  const [items, setItems] = useState<Tour[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<"create" | Tour | null>(null);
  const { toasts, show } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [toursRes, destsRes] = await Promise.all([
        adminApi.tours.list({ size: 100 }),
        adminApi.destinations.list({ size: 200 }),
      ]);
      setItems(toursRes.data?.items ?? []);
      setDestinations(destsRes.data?.items ?? []);
    } catch {
      setError("Không thể tải danh sách tour.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleSave(data: CreateTourRequest) {
    try {
      if (modal && modal !== "create") {
        await adminApi.tours.update((modal as Tour).id, data);
        show("Cập nhật tour thành công!");
      } else {
        await adminApi.tours.create(data);
        show("Thêm tour thành công!");
      }
      setModal(null);
      load();
    } catch {
      show("Có lỗi xảy ra. Vui lòng thử lại.", "error");
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Bạn có chắc muốn xóa tour này?")) return;
    try {
      await adminApi.tours.delete(id);
      show("Đã xóa tour.");
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
        <span className="font-semibold text-[tv-blue]">Tours</span>
      </nav>

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý tour</h1>
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
          <div className="p-8 text-center text-gray-400">Chưa có tour nào.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-[tv-blue-light] text-left text-xs font-bold uppercase text-gray-500">
                  <th className="px-4 py-3">Tên tour</th>
                  <th className="px-4 py-3">Điểm đến</th>
                  <th className="px-4 py-3">Thời gian</th>
                  <th className="px-4 py-3">Giá</th>
                  <th className="px-4 py-3">Trạng thái</th>
                  <th className="px-4 py-3">Nổi bật</th>
                  <th className="px-4 py-3 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold text-gray-900">{item.title}</td>
                    <td className="px-4 py-3 text-gray-600">{item.destination?.name ?? "—"}</td>
                    <td className="px-4 py-3 text-gray-600">{item.durationDays}N{item.durationNights}Đ</td>
                    <td className="px-4 py-3 text-gray-600">{formatVnd(item.salePrice ?? item.basePrice)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-4 py-3">
                      {item.featured ? <span className="text-[tv-orange] font-bold">★</span> : <span className="text-gray-300">—</span>}
                    </td>
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
        <TourModal
          item={modal === "create" ? null : modal}
          destinations={destinations}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
