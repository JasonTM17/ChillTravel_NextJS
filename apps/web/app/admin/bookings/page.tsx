"use client";

import { useState, useEffect, useCallback } from "react";
import { adminApi } from "@/lib/api/admin.api";
import type { Booking } from "@/lib/api/booking.api";
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
        <div key={t.id} className={`rounded-lg px-4 py-3 text-sm font-semibold text-white shadow-lg ${t.type === "success" ? "bg-[#0277D4]" : "bg-red-500"}`}>
          {t.text}
        </div>
      ))}
    </div>
  );
}

// ─── Status Badges ────────────────────────────────────────────────────────────
function BookingStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    CONFIRMED: "bg-blue-100 text-blue-700",
    COMPLETED: "bg-green-100 text-green-700",
    CANCELLED: "bg-gray-100 text-gray-600",
    REFUNDED: "bg-purple-100 text-purple-700",
  };
  const labels: Record<string, string> = {
    PENDING: "Chờ xử lý", CONFIRMED: "Đã xác nhận",
    COMPLETED: "Hoàn thành", CANCELLED: "Đã hủy", REFUNDED: "Hoàn tiền",
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${map[status] ?? "bg-gray-100 text-gray-600"}`}>
      {labels[status] ?? status}
    </span>
  );
}

function PaymentStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    UNPAID: "bg-red-100 text-red-600",
    PAID: "bg-green-100 text-green-700",
    FAILED: "bg-red-100 text-red-700",
    REFUNDED: "bg-purple-100 text-purple-700",
  };
  const labels: Record<string, string> = {
    UNPAID: "Chưa thanh toán", PAID: "Đã thanh toán",
    FAILED: "Thất bại", REFUNDED: "Hoàn tiền",
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${map[status] ?? "bg-gray-100 text-gray-600"}`}>
      {labels[status] ?? status}
    </span>
  );
}

// ─── Detail Drawer ────────────────────────────────────────────────────────────
function BookingDrawer({
  booking, onClose, onUpdateStatus, onUpdatePayment,
}: {
  booking: Booking;
  onClose: () => void;
  onUpdateStatus: (id: string, status: string) => Promise<void>;
  onUpdatePayment: (id: string, status: string) => Promise<void>;
}) {
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [updatingPayment, setUpdatingPayment] = useState(false);

  async function changeStatus(status: string) {
    setUpdatingStatus(true);
    try { await onUpdateStatus(booking.id, status); } finally { setUpdatingStatus(false); }
  }

  async function changePayment(status: string) {
    setUpdatingPayment(true);
    try { await onUpdatePayment(booking.id, status); } finally { setUpdatingPayment(false); }
  }

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/40" onClick={onClose}>
      <div className="h-full w-full max-w-md overflow-y-auto bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#0277D4]">Chi tiết đặt chỗ</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl font-bold">×</button>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl bg-[#EAF7FF] p-4">
            <p className="text-xs text-gray-500">Mã đặt chỗ</p>
            <p className="font-bold text-[#0277D4]">{booking.bookingCode}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-gray-500">Khách hàng</p>
              <p className="font-semibold">{booking.contactName}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="font-semibold">{booking.contactEmail}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Điện thoại</p>
              <p className="font-semibold">{booking.contactPhone}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Số khách</p>
              <p className="font-semibold">{booking.numberOfGuests}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Tour</p>
              <p className="font-semibold">{booking.tour?.title ?? booking.tourId}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Tổng tiền</p>
              <p className="font-bold text-[#FF6D1A]">{formatVnd(booking.totalPrice)}</p>
            </div>
          </div>

          {booking.specialRequest && (
            <div>
              <p className="text-xs text-gray-500">Yêu cầu đặc biệt</p>
              <p className="text-sm text-gray-700">{booking.specialRequest}</p>
            </div>
          )}

          {/* Status actions */}
          <div>
            <p className="mb-2 text-xs font-bold text-gray-500 uppercase">Cập nhật trạng thái đặt chỗ</p>
            <div className="flex flex-wrap gap-2">
              {["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"].map((s) => (
                <button
                  key={s}
                  disabled={updatingStatus || booking.status === s}
                  onClick={() => changeStatus(s)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    booking.status === s
                      ? "bg-[#0277D4] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  } disabled:opacity-60`}
                >
                  {{ PENDING: "Chờ xử lý", CONFIRMED: "Xác nhận", COMPLETED: "Hoàn thành", CANCELLED: "Hủy" }[s]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-bold text-gray-500 uppercase">Cập nhật thanh toán</p>
            <div className="flex flex-wrap gap-2">
              {["UNPAID", "PAID", "FAILED", "REFUNDED"].map((s) => (
                <button
                  key={s}
                  disabled={updatingPayment || booking.paymentStatus === s}
                  onClick={() => changePayment(s)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    booking.paymentStatus === s
                      ? "bg-[#0277D4] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  } disabled:opacity-60`}
                >
                  {{ UNPAID: "Chưa TT", PAID: "Đã TT", FAILED: "Thất bại", REFUNDED: "Hoàn tiền" }[s]}
                </button>
              ))}
            </div>
          </div>

          {booking.guests && booking.guests.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-bold text-gray-500 uppercase">Danh sách khách</p>
              <div className="space-y-2">
                {booking.guests.map((g, i) => (
                  <div key={g.id} className="rounded-lg bg-gray-50 px-3 py-2 text-sm">
                    <span className="font-semibold">{i + 1}. {g.fullName}</span>
                    {g.gender && <span className="ml-2 text-gray-500">({g.gender})</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AdminBookingsPage() {
  const [items, setItems] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [drawer, setDrawer] = useState<Booking | null>(null);
  const [statusFilter, setStatusFilter] = useState("");
  const { toasts, show } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminApi.bookings.list({ size: 100, status: statusFilter || undefined });
      setItems(res.data?.items ?? []);
    } catch {
      setError("Không thể tải danh sách đặt chỗ.");
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => { load(); }, [load]);

  async function handleUpdateStatus(id: string, status: string) {
    try {
      const updated = await adminApi.bookings.updateStatus(id, status);
      show("Cập nhật trạng thái thành công!");
      setItems((p) => p.map((b) => b.id === id ? { ...b, status } : b));
      if (drawer?.id === id) setDrawer((prev) => prev ? { ...prev, status } : null);
    } catch {
      show("Không thể cập nhật trạng thái.", "error");
    }
  }

  async function handleUpdatePayment(id: string, paymentStatus: string) {
    try {
      await adminApi.bookings.updatePaymentStatus(id, paymentStatus);
      show("Cập nhật thanh toán thành công!");
      setItems((p) => p.map((b) => b.id === id ? { ...b, paymentStatus } : b));
      if (drawer?.id === id) setDrawer((prev) => prev ? { ...prev, paymentStatus } : null);
    } catch {
      show("Không thể cập nhật thanh toán.", "error");
    }
  }

  return (
    <div className="min-h-screen bg-[#EAF7FF] p-6">
      <ToastContainer toasts={toasts} />

      <nav className="mb-4 text-sm text-gray-500">
        <span>Admin</span> <span className="mx-1">/</span>
        <span className="font-semibold text-[#0277D4]">Đặt chỗ</span>
      </nav>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-black text-gray-900">Quản lý đặt chỗ</h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold focus:border-[#0277D4] focus:outline-none"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="PENDING">Chờ xử lý</option>
          <option value="CONFIRMED">Đã xác nhận</option>
          <option value="COMPLETED">Hoàn thành</option>
          <option value="CANCELLED">Đã hủy</option>
          <option value="REFUNDED">Hoàn tiền</option>
        </select>
      </div>

      <div className="rounded-2xl bg-white shadow">
        {loading ? (
          <div className="space-y-3 p-6">{[...Array(5)].map((_, i) => <div key={i} className="h-10 animate-pulse rounded-lg bg-gray-100" />)}</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">{error}</div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-gray-400">Không có đặt chỗ nào.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-[#EAF7FF] text-left text-xs font-bold uppercase text-gray-500">
                  <th className="px-4 py-3">Mã đặt chỗ</th>
                  <th className="px-4 py-3">Khách hàng</th>
                  <th className="px-4 py-3">Tour</th>
                  <th className="px-4 py-3">Khách</th>
                  <th className="px-4 py-3">Tổng tiền</th>
                  <th className="px-4 py-3">Đặt chỗ</th>
                  <th className="px-4 py-3">Thanh toán</th>
                  <th className="px-4 py-3 text-right">Chi tiết</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs font-bold text-[#0277D4]">{item.bookingCode}</td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-gray-900">{item.contactName}</div>
                      <div className="text-xs text-gray-500">{item.contactEmail}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-[160px] truncate">{item.tour?.title ?? "—"}</td>
                    <td className="px-4 py-3 text-gray-600">{item.numberOfGuests}</td>
                    <td className="px-4 py-3 font-semibold text-[#FF6D1A]">{formatVnd(item.totalPrice)}</td>
                    <td className="px-4 py-3"><BookingStatusBadge status={item.status} /></td>
                    <td className="px-4 py-3"><PaymentStatusBadge status={item.paymentStatus} /></td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => setDrawer(item)} className="rounded-lg bg-[#EAF7FF] px-3 py-1 text-xs font-semibold text-[#0277D4] hover:bg-blue-100">
                        Xem
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {drawer && (
        <BookingDrawer
          booking={drawer}
          onClose={() => setDrawer(null)}
          onUpdateStatus={handleUpdateStatus}
          onUpdatePayment={handleUpdatePayment}
        />
      )}
    </div>
  );
}
