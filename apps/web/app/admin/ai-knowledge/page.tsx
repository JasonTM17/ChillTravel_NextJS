import { DatabaseZap, FileJson2, RefreshCw, ShieldAlert } from "lucide-react";
import { CommerceMetric, CommerceSurface, OpsTable, ServiceActionCard } from "@/components/commerce-primitives";
import { getReindexStatus } from "@/lib/local-ai";
import { PageShell } from "@/components/page-shell";

const rows = [
  { name: "destinations/da-nang.md", detail: "12 chunks, trust tier mẫu local", status: "Đã lập chỉ mục", owner: "Qdrant", tone: "teal" as const },
  { name: "world/paris.md", detail: "Ngân sách 5 ngày, ghi chú văn hóa, hướng dẫn món ăn", status: "Đã lập chỉ mục", owner: "Qdrant", tone: "teal" as const },
  { name: "policies/realtime.md", detail: "Cảnh báo cho visa, thời tiết, vé bay", status: "Cần rà soát", owner: "Admin", tone: "orange" as const },
  { name: "datasets/travel_qa_vi_en.jsonl", detail: "Câu hỏi Việt/Anh cho trợ lý du lịch", status: "Sẵn sàng", owner: "Dataset", tone: "blue" as const }
];

export default async function Page() {
  const reindex = await getReindexStatus();
  const data = (reindex.data ?? {}) as Record<string, unknown>;
  const documents = numberLabel(data.documents, "0");
  const chunks = numberLabel(data.chunks, "0");
  const retrievalBackend = typeof data.retrieval_backend === "string" ? data.retrieval_backend : "sample";
  const fallbackReason = typeof data.fallback_reason === "string" && data.fallback_reason ? data.fallback_reason : "Đang dùng fallback local khi service chưa chạy";

  return (
    <PageShell eyebrow="Knowledge Studio" title="Quản lý nguồn RAG local">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <CommerceMetric label="Tài liệu" value={documents} helper="Markdown/JSON mẫu local." />
            <CommerceMetric label="Chunks" value={chunks} helper={`Backend hiện tại: ${retrievalBackend}.`} tone="teal" />
            <CommerceMetric label="Fallback" value={retrievalBackend === "qdrant" ? "Tắt" : "Bật"} helper={fallbackReason} tone="orange" />
          </div>
          <CommerceSurface>
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#0277d4]">Nhật ký truy xuất</p>
                <h2 className="mt-2 text-2xl font-black">Nguồn được truy xuất gần đây</h2>
              </div>
              <button type="button" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#ff6d1a] px-4 py-3 text-sm font-black text-white">
                <RefreshCw size={16} aria-hidden="true" />
                Lập lại chỉ mục local
              </button>
            </div>
            <div className="mt-5">
              <OpsTable rows={rows} />
            </div>
          </CommerceSurface>
        </div>
        <aside className="h-fit space-y-4 lg:sticky lg:top-24">
          <ServiceActionCard icon={FileJson2} title="Nhập dữ liệu" description="Nhận markdown hoặc JSON mẫu, không ingest dữ liệu riêng tư." href="/admin/ai-knowledge" tone="blue" />
          <ServiceActionCard icon={DatabaseZap} title="Qdrant local" description="Kho vector mặc định, dùng dữ liệu mẫu khi service chưa chạy." href="/admin/ai-knowledge" tone="teal" />
          <ServiceActionCard icon={ShieldAlert} title="Cảnh báo nguồn thật" description="Cảnh báo khi câu hỏi cần dữ liệu visa, thời tiết hoặc vé bay theo thời gian thực." href="/chat" tone="orange" />
        </aside>
      </div>
    </PageShell>
  );
}

function numberLabel(value: unknown, fallback: string) {
  return typeof value === "number" ? value.toLocaleString("vi-VN") : fallback;
}
