import { CatalogListing } from "@/components/catalog-listing";
import { PageShell } from "@/components/page-shell";

export default function Page() {
  return (
    <PageShell eyebrow="Tìm nơi lưu trú" title="Khách sạn demo, giá rõ và không thu tiền thật">
      <CatalogListing kind="hotel" />
    </PageShell>
  );
}
