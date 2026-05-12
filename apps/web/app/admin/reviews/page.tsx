"use client";

import { useState, useEffect, useCallback } from "react";
import { adminApi } from "@/lib/api/admin.api";
import type { Review } from "@/lib/api/review.api";

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

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    APPROVED: "bg-green-100 text-green-700",
    REJECTED: "bg-red-100 text-red-600",
    HIDDEN: "bg-gray-100 text-gray-600",
  };
  const labels: Record<string, string> = {
    PENDING: "Chờ duyệt", APPROVED: "Đã duyệt",
    REJECTED: "Từ chối", HIDDEN: "Ẩn",
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${map[status] ?? "bg-gray-100 text-gray-600"}`}>
      {labels[status] ?? status}
    </span>
  );
}

// ─── Star Rating ──────────────────────────────────────────────────────────────
function StarRating({ rating }: { rating: number }) {
  return (
    <span className="text-sm">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={s <= rating ? "text-[#FF6D1A]" : "text-gray-200"}>★</span>
      ))}
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AdminReviewsPage() {
  const [items, setItems] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("PENDING");
  const { toasts, show } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminApi.reviews.list({ size: 100, status: statusFilter || undefined });
      setItems(res.data?.items ?? []);
    } catch {
      setError("Không thể tải danh sách đánh giá.");
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => { load(); }, [load]);

  async function handleApprove(id: string) {
    try {
      await adminApi.reviews.approve(id);
      show("Đã duyệt đánh giá.");
      setItems((p) => p.map((r) => r.id === id ? { ...r, status: "APPROVED" } : r));
    } catch {
      show("Không thể duyệt. Vui lòng thử lại.", "error");
    }
  }

  async function handleReject(id: string) {
    try {
      await adminApi.reviews.reject(id);
      show("Đã từ chối đánh giá.");
      setItems((p) => p.map((r) => r.id === id ? { ...r, status: "REJECTED" } : r));
    } catch {
      show("Không thể từ chối. Vui lòng thử lại.", "error");
    }
  }

  async function handleHide(id: string) {
    try {
      await adminApi.reviews.hide(id);
      show("Đã ẩn đánh giá.");
      setItems((p) => p.map((r) => r.id === id ? { ...r, status: "HIDDEN" } : r));
    } catch {
      show("Không thể ẩn. Vui lòng thử lại.", "error");
    }
  }

  return (
    <div className="min-h-screen bg-[#EAF7FF] p-6">
      <ToastContainer toasts={toasts} />

      <nav className="mb-4 text-sm text-gray-500">
        <span>Admin</span> <span className="mx-1">/</span>
        <span className="font-semibold text-[#0277D4]">Đánh giá</span>
      </nav>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-black text-gray-900">Kiểm duyệt đánh giá</h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold focus:border-[#0277D4] focus:outline-none"
        >
          <option value="">Tất cả</option>
          <option value="PENDING">Chờ duyệt</option>
          <option value="APPROVED">Đã duyệt</option>
          <option value="REJECTED">Từ chối</option>
          <option value="HIDDEN">Ẩn</option>
        </select>
      </div>

      <div className="rounded-2xl bg-white shadow">
        {loading ? (
          <div className="space-y-3 p-6">{[...Array(5)].map((_, i) => <div key={i} className="h-16 animate-pulse rounded-lg bg-gray-100" />)}</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">{error}</div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-gray-400">Không có đánh giá nào.</div>
        ) : (
          <div className="divide-y">
            {items.map((item) => (
              <div key={item.id} className="p-4 hover:bg-gray-50">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <StarRating rating={item.rating} />
                      <StatusBadge status={item.status} />
                      <span className="text-xs text-gray-400">
                        {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                    {item.title && <p className="font-semibold text-gray-900">{item.title}</p>}
                    <p className="mt-1 text-sm text-gray-600 line-clamp-2">{item.content}</p>
                    <p className="mt-1 text-xs text-gray-400">
                      Bởi: {item.author?.fullName ?? "Ẩn danh"} · Tour ID: {item.tourId.slice(0, 8)}...
                    </p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    {item.status !== "APPROVED" && (
                      <button onClick={() => handleApprove(item.id)} className="rounded-lg bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700 hover:bg-green-100">
                        Duyệt
                      </button>
                    )}
                    {item.status !== "REJECTED" && (
                      <button onClick={() => handleReject(item.id)} className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100">
                        Từ chối
                      </button>
                    )}
                    {item.status !== "HIDDEN" && (
                      <button onClick={() => handleHide(item.id)} className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-200">
                        Ẩn
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
