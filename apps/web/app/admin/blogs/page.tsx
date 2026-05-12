"use client";

import { useState, useEffect, useCallback } from "react";
import { adminApi } from "@/lib/api/admin.api";
import type { BlogPost } from "@/lib/api/blog.api";
import type { CreateBlogRequest } from "@/lib/api/admin.api";

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
    PUBLISHED: "bg-green-100 text-green-700",
    DRAFT: "bg-yellow-100 text-yellow-700",
    DELETED: "bg-red-100 text-red-600",
  };
  const labels: Record<string, string> = { PUBLISHED: "Đã đăng", DRAFT: "Nháp", DELETED: "Đã xóa" };
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${map[status] ?? "bg-gray-100 text-gray-600"}`}>
      {labels[status] ?? status}
    </span>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
const EMPTY: CreateBlogRequest = {
  title: "", excerpt: "", content: "", coverImageUrl: "", category: "", status: "DRAFT",
};

function BlogModal({
  item, onClose, onSave,
}: {
  item: BlogPost | null;
  onClose: () => void;
  onSave: (data: CreateBlogRequest) => Promise<void>;
}) {
  const [form, setForm] = useState<CreateBlogRequest>(
    item
      ? {
          title: item.title, excerpt: item.excerpt ?? "",
          content: item.content, coverImageUrl: item.coverImageUrl ?? "",
          category: item.category ?? "", status: item.status,
        }
      : EMPTY
  );
  const [saving, setSaving] = useState(false);

  const set = (k: keyof CreateBlogRequest, v: string) => setForm((p) => ({ ...p, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try { await onSave(form); } finally { setSaving(false); }
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
        <h2 className="mb-4 text-lg font-bold text-[#0277D4]">
          {item ? "Chỉnh sửa bài viết" : "Thêm bài viết mới"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-600">Tiêu đề *</label>
            <input className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#0277D4] focus:outline-none" value={form.title} onChange={(e) => set("title", e.target.value)} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-600">Danh mục</label>
              <input className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#0277D4] focus:outline-none" value={form.category ?? ""} onChange={(e) => set("category", e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-600">Trạng thái</label>
              <select className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#0277D4] focus:outline-none" value={form.status ?? "DRAFT"} onChange={(e) => set("status", e.target.value)}>
                <option value="DRAFT">Nháp</option>
                <option value="PUBLISHED">Đã đăng</option>
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-600">URL ảnh bìa</label>
            <input className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#0277D4] focus:outline-none" value={form.coverImageUrl ?? ""} onChange={(e) => set("coverImageUrl", e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-600">Tóm tắt</label>
            <textarea className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#0277D4] focus:outline-none" rows={2} value={form.excerpt ?? ""} onChange={(e) => set("excerpt", e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-600">Nội dung (Markdown) *</label>
            <textarea
              className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm focus:border-[#0277D4] focus:outline-none"
              rows={10}
              value={form.content}
              onChange={(e) => set("content", e.target.value)}
              placeholder="# Tiêu đề&#10;&#10;Nội dung bài viết..."
              required
            />
            <p className="mt-1 text-xs text-gray-400">Hỗ trợ Markdown: **đậm**, *nghiêng*, # tiêu đề, - danh sách</p>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="rounded-lg border px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50">Hủy</button>
            <button type="submit" disabled={saving} className="rounded-lg bg-[#FF6D1A] px-4 py-2 text-sm font-bold text-white hover:bg-orange-600 disabled:opacity-60">
              {saving ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AdminBlogsPage() {
  const [items, setItems] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<"create" | BlogPost | null>(null);
  const { toasts, show } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminApi.blogs.list({ size: 100 });
      setItems(res.data?.items ?? []);
    } catch {
      setError("Không thể tải danh sách bài viết.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleSave(data: CreateBlogRequest) {
    try {
      if (modal && modal !== "create") {
        await adminApi.blogs.update((modal as BlogPost).id, data);
        show("Cập nhật bài viết thành công!");
      } else {
        await adminApi.blogs.create(data);
        show("Thêm bài viết thành công!");
      }
      setModal(null);
      load();
    } catch {
      show("Có lỗi xảy ra. Vui lòng thử lại.", "error");
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Bạn có chắc muốn xóa bài viết này?")) return;
    try {
      await adminApi.blogs.delete(id);
      show("Đã xóa bài viết.");
      load();
    } catch {
      show("Không thể xóa. Vui lòng thử lại.", "error");
    }
  }

  async function handleToggleStatus(item: BlogPost) {
    const newStatus = item.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    try {
      await adminApi.blogs.update(item.id, { status: newStatus });
      show(`Đã chuyển sang ${newStatus === "PUBLISHED" ? "Đã đăng" : "Nháp"}.`);
      load();
    } catch {
      show("Không thể cập nhật trạng thái.", "error");
    }
  }

  return (
    <div className="min-h-screen bg-[#EAF7FF] p-6">
      <ToastContainer toasts={toasts} />

      <nav className="mb-4 text-sm text-gray-500">
        <span>Admin</span> <span className="mx-1">/</span>
        <span className="font-semibold text-[#0277D4]">Blog</span>
      </nav>

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-black text-gray-900">Quản lý blog</h1>
        <button onClick={() => setModal("create")} className="rounded-xl bg-[#FF6D1A] px-5 py-2.5 text-sm font-bold text-white shadow hover:bg-orange-600">
          + Thêm mới
        </button>
      </div>

      <div className="rounded-2xl bg-white shadow">
        {loading ? (
          <div className="space-y-3 p-6">{[...Array(5)].map((_, i) => <div key={i} className="h-10 animate-pulse rounded-lg bg-gray-100" />)}</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">{error}</div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-gray-400">Chưa có bài viết nào.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-[#EAF7FF] text-left text-xs font-bold uppercase text-gray-500">
                  <th className="px-4 py-3">Tiêu đề</th>
                  <th className="px-4 py-3">Danh mục</th>
                  <th className="px-4 py-3">Trạng thái</th>
                  <th className="px-4 py-3">Ngày đăng</th>
                  <th className="px-4 py-3 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold text-gray-900 max-w-xs truncate">{item.title}</td>
                    <td className="px-4 py-3 text-gray-600">{item.category ?? "—"}</td>
                    <td className="px-4 py-3"><StatusBadge status={item.status} /></td>
                    <td className="px-4 py-3 text-gray-600">
                      {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString("vi-VN") : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => handleToggleStatus(item)} className="mr-2 rounded-lg bg-yellow-50 px-3 py-1 text-xs font-semibold text-yellow-700 hover:bg-yellow-100">
                        {item.status === "PUBLISHED" ? "Ẩn" : "Đăng"}
                      </button>
                      <button onClick={() => setModal(item)} className="mr-2 rounded-lg bg-[#EAF7FF] px-3 py-1 text-xs font-semibold text-[#0277D4] hover:bg-blue-100">Sửa</button>
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
        <BlogModal
          item={modal === "create" ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
