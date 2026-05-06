import { DatabaseZap, FileJson2, RefreshCw, ShieldAlert } from "lucide-react";
import { CommerceMetric, CommerceSurface, OpsTable, ServiceActionCard } from "@/components/commerce-primitives";
import { PageShell } from "@/components/page-shell";

const rows = [
  { name: "destinations/da-nang.md", detail: "12 chunks, trust tier local-sample", status: "Indexed", owner: "Qdrant", tone: "teal" as const },
  { name: "world/paris.md", detail: "Budget 5 days, culture notes, food guide", status: "Indexed", owner: "Qdrant", tone: "teal" as const },
  { name: "policies/realtime.md", detail: "Guardrail cho visa, thời tiết, vé bay", status: "Review", owner: "Admin", tone: "orange" as const },
  { name: "datasets/travel_qa_vi_en.jsonl", detail: "Câu hỏi Việt/Anh cho trợ lý du lịch", status: "Ready", owner: "Dataset", tone: "blue" as const }
];

export default function Page() {
  return (
    <PageShell eyebrow="Knowledge Studio" title="Quản lý nguồn RAG local">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <CommerceMetric label="Tài liệu" value="86" helper="Markdown/JSON sample." />
            <CommerceMetric label="Chunks" value="428" helper="Có payload source/chunk/trust tier." tone="teal" />
            <CommerceMetric label="Guardrail" value="12" helper="Log câu hỏi cần nguồn chính thức." tone="orange" />
          </div>
          <CommerceSurface>
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#0277d4]">Retrieval log</p>
                <h2 className="mt-2 text-2xl font-black">Nguồn được truy xuất gần đây</h2>
              </div>
              <button type="button" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#ff6d1a] px-4 py-3 text-sm font-black text-white">
                <RefreshCw size={16} aria-hidden="true" />
                Reindex demo
              </button>
            </div>
            <div className="mt-5">
              <OpsTable rows={rows} />
            </div>
          </CommerceSurface>
        </div>
        <aside className="h-fit space-y-4 lg:sticky lg:top-24">
          <ServiceActionCard icon={FileJson2} title="Import dữ liệu" description="Nhận markdown hoặc JSON mẫu, không ingest dữ liệu riêng tư." href="/admin/ai-knowledge" tone="blue" />
          <ServiceActionCard icon={DatabaseZap} title="Qdrant local" description="Vector store mặc định, fallback sample khi service chưa chạy." href="/admin/ai-knowledge" tone="teal" />
          <ServiceActionCard icon={ShieldAlert} title="Hallucination guard" description="Cảnh báo khi câu hỏi cần dữ liệu visa, thời tiết hoặc vé bay real-time." href="/chat" tone="orange" />
        </aside>
      </div>
    </PageShell>
  );
}
