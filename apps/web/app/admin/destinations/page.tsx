import { destinations } from "@vietwander/shared";
import { CommerceMetric, CommerceSurface, OpsTable, TrustBanner } from "@/components/commerce-primitives";
import { PageShell } from "@/components/page-shell";
import { getDestinationCopy } from "@/lib/destination-copy";

const rows = destinations.slice(0, 6).map((destination) => {
  const copy = getDestinationCopy(destination);
  return {
    name: copy.name,
    detail: `${copy.city} · ${copy.bestTimeToVisit} · ${destination.hotelsMock.length} nơi ở mẫu`,
    status: destination.isFeatured ? "Featured" : "Draft",
    owner: destination.tags.includes("Vietnam") ? "Việt Nam" : "Quốc tế",
    tone: destination.isFeatured ? ("teal" as const) : ("gray" as const)
  };
});

export default function Page() {
  return (
    <PageShell eyebrow="Quản trị điểm đến" title="Vận hành dữ liệu destination">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <CommerceSurface>
          <div className="grid gap-4 md:grid-cols-3">
            <CommerceMetric label="Điểm đến" value={`${destinations.length}`} helper="Việt Nam và quốc tế trong seed local." />
            <CommerceMetric label="Featured" value={`${destinations.filter((item) => item.isFeatured).length}`} helper="Đang hiển thị ở landing/search." tone="teal" />
            <CommerceMetric label="Ảnh/prompt" value="Ready" helper="Có prompt hoặc asset placeholder." tone="orange" />
          </div>
          <div className="mt-6">
            <OpsTable rows={rows} />
          </div>
        </CommerceSurface>
        <aside className="h-fit space-y-4 lg:sticky lg:top-24">
          <TrustBanner compact />
          <CommerceSurface>
            <h2 className="text-xl font-black">Luồng CRUD dự kiến</h2>
            <div className="mt-4 space-y-3 text-sm font-bold leading-6 text-[#476273]">
              <p>1. Import JSON/CSV mẫu.</p>
              <p>2. Rà soát tên, slug, mùa đẹp, ngân sách, tag.</p>
              <p>3. Gắn prompt/ảnh và trải nghiệm liên quan.</p>
              <p>4. Rebuild RAG index khi nội dung thay đổi.</p>
            </div>
          </CommerceSurface>
        </aside>
      </div>
    </PageShell>
  );
}
