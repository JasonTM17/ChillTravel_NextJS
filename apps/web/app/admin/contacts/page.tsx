'use client';

import { useState, useEffect, useCallback } from 'react';
import { adminApi } from '@/lib/api/admin.api';
import type { ContactRequest } from '@/lib/api/contact.api';

// ─── Toast ───────────────────────────────────────────────────────────────────
type ToastType = 'success' | 'error';
interface ToastMsg {
  id: number;
  type: ToastType;
  text: string;
}

function useToast() {
  const [toasts, setToasts] = useState<ToastMsg[]>([]);
  const show = useCallback((text: string, type: ToastType = 'success') => {
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
          className={`rounded-lg px-4 py-3 text-sm font-semibold text-white shadow-lg ${t.type === 'success' ? 'bg-[tv-blue]' : 'bg-red-500'}`}
        >
          {t.text}
        </div>
      ))}
    </div>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    NEW: 'bg-blue-100 text-blue-700',
    IN_PROGRESS: 'bg-yellow-100 text-yellow-700',
    RESOLVED: 'bg-green-100 text-green-700',
    CLOSED: 'bg-gray-100 text-gray-600',
  };
  const labels: Record<string, string> = {
    NEW: 'Mới',
    IN_PROGRESS: 'Đang xử lý',
    RESOLVED: 'Đã giải quyết',
    CLOSED: 'Đóng',
  };
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${map[status] ?? 'bg-gray-100 text-gray-600'}`}
    >
      {labels[status] ?? status}
    </span>
  );
}

// ─── Detail Drawer ────────────────────────────────────────────────────────────
function ContactDrawer({
  contact,
  onClose,
  onUpdate,
}: {
  contact: ContactRequest;
  onClose: () => void;
  onUpdate: (
    id: string,
    data: { status?: string; assignedTo?: string; adminNote?: string },
  ) => Promise<void>;
}) {
  const [status, setStatus] = useState(contact.status);
  const [assignedTo, setAssignedTo] = useState(contact.assignedTo ?? '');
  const [adminNote, setAdminNote] = useState(contact.adminNote ?? '');
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await onUpdate(contact.id, {
        status,
        assignedTo: assignedTo || undefined,
        adminNote: adminNote || undefined,
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/40" onClick={onClose}>
      <div
        className="h-full w-full max-w-md overflow-y-auto bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[tv-blue]">Chi tiết liên hệ</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl font-bold">
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div className="rounded-tv-sm bg-[tv-blue-light] p-4 space-y-2">
            <div>
              <p className="text-xs text-gray-500">Họ tên</p>
              <p className="font-bold text-gray-900">{contact.name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="font-semibold text-[tv-blue]">{contact.email}</p>
            </div>
            {contact.phone && (
              <div>
                <p className="text-xs text-gray-500">Điện thoại</p>
                <p className="font-semibold">{contact.phone}</p>
              </div>
            )}
            {contact.destinationInterested && (
              <div>
                <p className="text-xs text-gray-500">Điểm đến quan tâm</p>
                <p className="font-semibold">{contact.destinationInterested}</p>
              </div>
            )}
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-1">Nội dung</p>
            <p className="rounded-lg bg-gray-50 p-3 text-sm text-gray-700">{contact.message}</p>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-600">Trạng thái</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[tv-blue] focus:outline-none"
            >
              <option value="NEW">Mới</option>
              <option value="IN_PROGRESS">Đang xử lý</option>
              <option value="RESOLVED">Đã giải quyết</option>
              <option value="CLOSED">Đóng</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-600">Giao cho</label>
            <input
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[tv-blue] focus:outline-none"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              placeholder="Email nhân viên..."
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-600">Ghi chú admin</label>
            <textarea
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[tv-blue] focus:outline-none"
              rows={3}
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              placeholder="Ghi chú nội bộ..."
            />
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full rounded-tv-sm bg-[tv-orange] py-2.5 text-sm font-bold text-white hover:bg-orange-600 disabled:opacity-60"
          >
            {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AdminContactsPage() {
  const [items, setItems] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [drawer, setDrawer] = useState<ContactRequest | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const { toasts, show } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminApi.contacts.list({ size: 100, status: statusFilter || undefined });
      setItems(res.data?.items ?? []);
    } catch {
      setError('Không thể tải danh sách liên hệ.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleUpdate(
    id: string,
    data: { status?: string; assignedTo?: string; adminNote?: string },
  ) {
    try {
      await adminApi.contacts.updateStatus(id, data);
      show('Cập nhật thành công!');
      setItems((p) => p.map((c) => (c.id === id ? { ...c, ...data } : c)));
      if (drawer?.id === id) setDrawer((prev) => (prev ? { ...prev, ...data } : null));
    } catch {
      show('Không thể cập nhật. Vui lòng thử lại.', 'error');
    }
  }

  return (
    <div className="min-h-screen bg-[tv-blue-light] p-6">
      <ToastContainer toasts={toasts} />

      <nav className="mb-4 text-sm text-gray-500">
        <span>Admin</span> <span className="mx-1">/</span>
        <span className="font-semibold text-[tv-blue]">Liên hệ</span>
      </nav>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý liên hệ</h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-tv-sm border border-gray-200 bg-white px-4 py-2 text-sm font-semibold focus:border-[tv-blue] focus:outline-none"
        >
          <option value="">Tất cả</option>
          <option value="NEW">Mới</option>
          <option value="IN_PROGRESS">Đang xử lý</option>
          <option value="RESOLVED">Đã giải quyết</option>
          <option value="CLOSED">Đóng</option>
        </select>
      </div>

      <div className="rounded-tv bg-white shadow">
        {loading ? (
          <div className="space-y-3 p-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 animate-pulse rounded-lg bg-gray-100" />
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">{error}</div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-gray-400">Không có liên hệ nào.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-[tv-blue-light] text-left text-xs font-bold uppercase text-gray-500">
                  <th className="px-4 py-3">Họ tên</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Điểm đến</th>
                  <th className="px-4 py-3">Trạng thái</th>
                  <th className="px-4 py-3">Giao cho</th>
                  <th className="px-4 py-3">Ngày gửi</th>
                  <th className="px-4 py-3 text-right">Chi tiết</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold text-gray-900">{item.name}</td>
                    <td className="px-4 py-3 text-gray-600">{item.email}</td>
                    <td className="px-4 py-3 text-gray-600">{item.destinationInterested ?? '—'}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-4 py-3 text-gray-600">{item.assignedTo ?? '—'}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setDrawer(item)}
                        className="rounded-lg bg-[tv-blue-light] px-3 py-1 text-xs font-semibold text-[tv-blue] hover:bg-blue-100"
                      >
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
        <ContactDrawer contact={drawer} onClose={() => setDrawer(null)} onUpdate={handleUpdate} />
      )}
    </div>
  );
}
