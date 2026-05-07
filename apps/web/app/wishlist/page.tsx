import Link from "next/link";
import { Heart, Luggage, MapPin, Share2, Ticket } from "lucide-react";
import { destinations } from "@vietwander/shared";
import { CommerceSurface, StatusPill, TrustBanner } from "@/components/commerce-primitives";
import { PageShell } from "@/components/page-shell";
import { getDestinationCopy } from "@/lib/destination-copy";
import { getDestinationImage } from "@/lib/destination-images";
import { formatVnd } from "@/lib/utils";

const savedTrips = [
  { title: "Đà Nẵng cuối tuần", slugs: ["da-nang", "hoi-an", "hue"], tone: "blue" as const },
  { title: "Gia đình đi biển", slugs: ["phu-quoc", "nha-trang", "ha-long"], tone: "teal" as const },
  { title: "Mùa lạnh săn mây", slugs: ["sapa", "ha-giang", "da-lat"], tone: "orange" as const }
];

export default function Page() {
  return (
    <PageShell eyebrow="Yêu thích" title="Lưu điểm đến, nơi ở và trải nghiệm theo từng chuyến">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section className="space-y-5">
          {savedTrips.map((trip) => (
            <CommerceSurface key={trip.title}>
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <StatusPill tone={trip.tone}>{trip.slugs.length} mục đã lưu</StatusPill>
                  <h2 className="mt-3 text-2xl font-black">{trip.title}</h2>
                  <p className="mt-1 text-sm leading-6 text-[#476273]">Có thể chuyển thành lịch trình, chia sẻ link đọc hoặc tải gói offline.</p>
                </div>
                <div className="flex gap-2">
                  <Link href="/ai-planner" className="rounded-xl bg-[#0277d4] px-4 py-3 text-sm font-black text-white">
                    Lập lịch trình
                  </Link>
                  <button type="button" className="rounded-xl border border-[#d9ecfb] bg-white px-4 py-3 text-sm font-black text-[#0277d4]">
                    Chia sẻ
                  </button>
                </div>
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-3">
                {trip.slugs.map((slug) => {
                  const destination = destinations.find((item) => item.slug === slug) ?? destinations[0];
                  const copy = getDestinationCopy(destination);
                  return (
                    <Link key={slug} href={`/destinations/${slug}`} className="group overflow-hidden rounded-2xl border border-[#d9ecfb] bg-[#fbfdff]">
                      <div className="h-32 bg-cover bg-center" style={{ backgroundImage: `url(${getDestinationImage(slug)})` }} />
                      <div className="p-4">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-black group-hover:text-[#0277d4]">{copy.name}</h3>
                          <Heart size={16} fill="#ff6d1a" className="text-[#ff6d1a]" aria-hidden="true" />
                        </div>
                        <p className="mt-1 line-clamp-1 text-sm text-[#476273]">{copy.city}</p>
                        <p className="mt-2 text-sm font-black text-[#ff5f12]">{formatVnd(destination.budgetMin)} / ngày</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </CommerceSurface>
          ))}
        </section>
        <aside className="h-fit space-y-4 lg:sticky lg:top-24">
          <TrustBanner compact />
          <CommerceSurface>
            <h2 className="text-xl font-black">Hành động nhanh</h2>
            <div className="mt-4 space-y-3">
              {[
                [Luggage, "Tạo gói offline", "Lưu lịch trình, checklist và thông tin khẩn cấp mẫu."],
                [Ticket, "Đặt chỗ demo", "Chuyển mục đã lưu thành giữ chỗ mô phỏng."],
                [Share2, "Link đọc công khai", "Tạo trang chia sẻ read-only như travel story."],
                [MapPin, "Xem trên bản đồ", "Gom các marker theo từng nhóm chuyến."]
              ].map(([Icon, title, body]) => (
                <div key={String(title)} className="flex gap-3 rounded-2xl bg-[#f7fbff] p-4">
                  <Icon className="mt-0.5 shrink-0 text-[#0277d4]" size={20} aria-hidden="true" />
                  <div>
                    <p className="font-black">{String(title)}</p>
                    <p className="mt-1 text-sm leading-6 text-[#476273]">{String(body)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CommerceSurface>
        </aside>
      </div>
    </PageShell>
  );
}
