import { CatalogListing } from "@/components/catalog-listing";
import { PageShell } from "@/components/page-shell";

export default function Page() {
  return (
    <PageShell eyebrow="Trải nghiệm địa phương" title="Tour ẩm thực, văn hóa và vé hoạt động demo">
      <CatalogListing kind="experience" />
    </PageShell>
  );
}
