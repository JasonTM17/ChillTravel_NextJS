"use client";

import { useState, useEffect, useCallback } from "react";
import { adminApi } from "@/lib/api/admin.api";
import type { AdminUser } from "@/lib/api/admin.api";

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
        <div
          key={t.id}
          className={`rounded-lg px-4 py-3 text-sm font-semibold text-white shadow-lg ${
            t.type === "success" ? "bg-[tv-blue]" : "bg-red-500"
          }`}
        >
          {t.text}
        </div>
      ))}
    </div>
  );
}

// ─── Status Badges ────────────────────────────────────────────────────────────
function UserStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    ACTIVE: "bg-green-100 text-green-700",
    INACTIVE: "bg-gray-100 text-gray-600",
    BANNED: "bg-red-100 text-red-600",
  };
  const labels: Record<string, string> = {
    ACTIVE: "Hoạt động",
    INACTIVE: "Không hoạt động",
    BANNED: "Bị khóa",
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${map[status] ?? "bg-gray-100 text-gray-600"}`}>
      {labels[status] ?? status}
    </span>
  );
}

function RoleBadge({ role }: { role: string }) {
  const map: Record<string, string> = {
    ADMIN: "bg-purple-100 text-purple-700",
    STAFF: "bg-blue-100 text-blue-700",
    USER: "bg-gray-100 text-gray-600",
  };
  const labels: Record<string, string> = {
    ADMIN: "Admin",
    STAFF: "Nhân viên",
    USER: "Người dùng",
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${map[role] ?? "bg-gray-100 text-gray-600"}`}>
      {labels[role] ?? role}
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AdminUsersPage() {
  const [items, setItems] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [keyword, setKeyword] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const PAGE_SIZE = 20;
  const { toasts } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminApi.users.list({
        page,
        size: PAGE_SIZE,
        keyword: keyword || undefined,
      });
      setItems(res.data?.items ?? []);
      setTotalPages(res.data?.totalPages ?? 0);
      setTotalElements(res.data?.totalElements ?? 0);
    } catch {
      setError("Không thể tải danh sách người dùng.");
    } finally {
      setLoading(false);
    }
  }, [page, keyword]);

  useEffect(() => { load(); }, [load]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(0);
    setKeyword(searchInput);
  }

  return (
    <div className="min-h-screen bg-[tv-blue-light] p-6">
      <ToastContainer toasts={toasts} />

      {/* Breadcrumbs */}
      <nav className="mb-4 text-sm text-gray-500">
        <span>Admin</span> <span className="mx-1">/</span>
        <span className="font-semibold text-[tv-blue]">Người dùng</span>
      </nav>

      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý người dùng</h1>
          {totalElements > 0 && (
            <p className="mt-1 text-sm text-gray-500">
              Tổng cộng <span className="font-semibold text-[tv-blue]">{totalElements}</span> người dùng
            </p>
          )}
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Tìm theo email hoặc tên..."
            className="rounded-tv-sm border border-gray-200 bg-white px-4 py-2 text-sm focus:border-[tv-blue] focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-tv-sm bg-[tv-blue] px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Tìm
          </button>
        </form>
      </div>

      {/* Read-only notice */}
      <div className="mb-4 rounded-tv-sm border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
        <span className="font-semibold">Chế độ xem:</span> Danh sách người dùng chỉ đọc. Chức năng chỉnh sửa/xóa sẽ được bổ sung trong phiên bản tiếp theo.
      </div>

      {/* Table */}
      <div className="rounded-tv bg-white shadow">
        {loading ? (
          <div className="space-y-3 p-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-10 animate-pulse rounded-lg bg-gray-100" />
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="mb-3 text-red-500">{error}</p>
            <button
              onClick={load}
              className="rounded-lg bg-[tv-blue] px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Thử lại
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            {keyword ? `Không tìm thấy người dùng nào với từ khóa "${keyword}".` : "Chưa có người dùng nào."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-[tv-blue-light] text-left text-xs font-bold uppercase text-gray-500">
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Họ tên</th>
                  <th className="px-4 py-3">Điện thoại</th>
                  <th className="px-4 py-3">Vai trò</th>
                  <th className="px-4 py-3">Trạng thái</th>
                  <th className="px-4 py-3">Email xác thực</th>
                  <th className="px-4 py-3">Ngày tạo</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold text-[tv-blue]">{item.email}</td>
                    <td className="px-4 py-3 text-gray-900">{item.fullName ?? "—"}</td>
                    <td className="px-4 py-3 text-gray-600">{item.phone ?? "—"}</td>
                    <td className="px-4 py-3">
                      <RoleBadge role={item.role} />
                    </td>
                    <td className="px-4 py-3">
                      <UserStatusBadge status={item.status} />
                    </td>
                    <td className="px-4 py-3">
                      {item.emailVerified ? (
                        <span className="text-green-600 font-semibold text-xs">✓ Đã xác thực</span>
                      ) : (
                        <span className="text-gray-400 text-xs">Chưa xác thực</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t px-4 py-3">
            <p className="text-xs text-gray-500">
              Trang {page + 1} / {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-lg border px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-40"
              >
                ← Trước
              </button>
              <button
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-lg border px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-40"
              >
                Sau →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
