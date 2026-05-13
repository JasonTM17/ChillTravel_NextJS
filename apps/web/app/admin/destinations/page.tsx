'use client';

import { useState, useEffect, useCallback } from 'react';
import { adminApi } from '@/lib/api/admin.api';
import type { Destination, CreateDestinationRequest } from '@/lib/api/destination.api';
import { getCountryName, getCityName } from '@/lib/api/destination.api';

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
          className={`rounded-lg px-4 py-3 text-sm font-semibold text-white shadow-lg ${
            t.type === 'success' ? 'bg-[tv-blue]' : 'bg-red-500'
          }`}
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
    ACTIVE: 'bg-green-100 text-green-700',
    INACTIVE: 'bg-gray-100 text-gray-600',
    DELETED: 'bg-red-100 text-red-600',
  };
  const labels: Record<string, string> = {
    ACTIVE: 'Hoạt động',
    INACTIVE: 'Ẩn',
    DELETED: 'Đã xóa',
  };
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${map[status] ?? 'bg-gray-100 text-gray-600'}`}
    >
      {labels[status] ?? status}
    </span>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
const EMPTY_FORM: CreateDestinationRequest = {
  name: '',
  country: '',
  city: '',
  description: '',
  shortDescription: '',
  bestTimeToVisit: '',
  imageUrl: '',
  category: '',
};

function DestinationModal({
  item,
  onClose,
  onSave,
}: {
  item: Destination | null;
  onClose: () => void;
  onSave: (data: CreateDestinationRequest) => Promise<void>;
}) {
  const [form, setForm] = useState<CreateDestinationRequest>(
    item
      ? {
          name: item.name,
          country: getCountryName(item),
          city: getCityName(item) ?? '',
          description: item.description,
          shortDescription: item.shortDescription ?? '',
          bestTimeToVisit: item.bestTimeToVisit ?? '',
          imageUrl: item.imageUrl ?? '',
          category: item.category ?? '',
        }
      : EMPTY_FORM,
  );
  const [saving, setSaving] = useState(false);

  const set = (k: keyof CreateDestinationRequest, v: string) => setForm((p) => ({ ...p, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(form);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-tv bg-white p-6 shadow-2xl">
        <h2 className="mb-4 text-lg font-bold text-[tv-blue]">
          {item ? 'Chỉnh sửa điểm đến' : 'Thêm điểm đến mới'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          {(
            [
              ['name', 'Tên điểm đến *', true],
              ['country', 'Quốc gia *', true],
              ['city', 'Thành phố', false],
              ['category', 'Danh mục', false],
              ['imageUrl', 'URL ảnh đại diện', false],
              ['bestTimeToVisit', 'Thời điểm đẹp nhất', false],
              ['shortDescription', 'Mô tả ngắn', false],
            ] as [keyof CreateDestinationRequest, string, boolean][]
          ).map(([k, label, req]) => (
            <div key={k}>
              <label className="mb-1 block text-xs font-semibold text-gray-600">{label}</label>
              <input
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[tv-blue] focus:outline-none"
                value={form[k] as string}
                onChange={(e) => set(k, e.target.value)}
                required={req}
              />
            </div>
          ))}
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-600">Mô tả đầy đủ *</label>
            <textarea
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[tv-blue] focus:outline-none"
              rows={3}
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-[tv-orange] px-4 py-2 text-sm font-bold text-white hover:bg-orange-600 disabled:opacity-60"
            >
              {saving ? 'Đang lưu...' : 'Lưu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AdminDestinationsPage() {
  const [items, setItems] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<'create' | Destination | null>(null);
  const { toasts, show } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminApi.destinations.list({ size: 100 });
      setItems(res.data?.items ?? []);
    } catch {
      setError('Không thể tải danh sách điểm đến.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSave(data: CreateDestinationRequest) {
    try {
      if (modal && modal !== 'create') {
        await adminApi.destinations.update((modal as Destination).id, data);
        show('Cập nhật thành công!');
      } else {
        await adminApi.destinations.create(data);
        show('Thêm điểm đến thành công!');
      }
      setModal(null);
      load();
    } catch {
      show('Có lỗi xảy ra. Vui lòng thử lại.', 'error');
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Bạn có chắc muốn xóa điểm đến này?')) return;
    try {
      await adminApi.destinations.delete(id);
      show('Đã xóa điểm đến.');
      load();
    } catch {
      show('Không thể xóa. Vui lòng thử lại.', 'error');
    }
  }

  return (
    <div className="min-h-screen bg-[tv-blue-light] p-6">
      <ToastContainer toasts={toasts} />

      {/* Breadcrumbs */}
      <nav className="mb-4 text-sm text-gray-500">
        <span>Admin</span> <span className="mx-1">/</span>
        <span className="font-semibold text-[tv-blue]">Điểm đến</span>
      </nav>

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý điểm đến</h1>
        <button
          onClick={() => setModal('create')}
          className="rounded-tv-sm bg-[tv-orange] px-5 py-2.5 text-sm font-bold text-white shadow hover:bg-orange-600"
        >
          + Thêm mới
        </button>
      </div>

      {/* Table */}
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
          <div className="p-8 text-center text-gray-400">Chưa có điểm đến nào.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-[tv-blue-light] text-left text-xs font-bold uppercase text-gray-500">
                  <th className="px-4 py-3">Tên</th>
                  <th className="px-4 py-3">Quốc gia</th>
                  <th className="px-4 py-3">Thành phố</th>
                  <th className="px-4 py-3">Danh mục</th>
                  <th className="px-4 py-3">Trạng thái</th>
                  <th className="px-4 py-3 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold text-gray-900">{item.name}</td>
                    <td className="px-4 py-3 text-gray-600">{getCountryName(item)}</td>
                    <td className="px-4 py-3 text-gray-600">{getCityName(item) ?? '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{item.category ?? '—'}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setModal(item)}
                        className="mr-2 rounded-lg bg-[tv-blue-light] px-3 py-1 text-xs font-semibold text-[tv-blue] hover:bg-blue-100"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="rounded-lg bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-100"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal !== null && (
        <DestinationModal
          item={modal === 'create' ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
