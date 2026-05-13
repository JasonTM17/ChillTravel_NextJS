import { destinations } from '@vietwander/shared';
import { BudgetSimulator } from '@/components/ai/budget-simulator';
import {
  BoundaryList,
  CommerceMetric,
  CommerceSurface,
  StatusPill,
} from '@/components/commerce-primitives';
import { ItineraryTimeline } from '@/components/itinerary-timeline';
import { PageShell } from '@/components/page-shell';
import { getDestinationCopy } from '@/lib/destination-copy';
import { getStructuredChatAnswer } from '@/lib/local-ai';
import { formatVnd } from '@/lib/utils';

export default async function AiPlannerPage({
  searchParams,
}: {
  searchParams: Promise<{ destination?: string }>;
}) {
  const { destination = 'da-nang' } = await searchParams;
  const selected = destinations.find((item) => item.slug === destination) ?? destinations[5]!;
  const answer = await getStructuredChatAnswer(
    `${getDestinationCopy(selected).name} 4 ngày lịch trình cân bằng`,
    selected.slug,
  );
  const plan = answer.itinerary;

  return (
    <PageShell
      eyebrow="Lập lịch trình thông minh"
      title="Tạo kế hoạch chuyến đi theo ngân sách, văn hóa, ẩm thực và nhịp di chuyển"
    >
      <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
        <form className="rounded-[16px] border border-tv-border bg-white p-5 shadow-tv-card">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-tv-blue">
            Thông tin chuyến đi
          </p>
          <h2 className="mt-2 text-3xl font-bold text-tv-ink">Bạn muốn đi như thế nào?</h2>
          <p className="mt-2 text-sm leading-6 text-[#584237]">
            Dịch vụ lập lịch ưu tiên chạy local dùng knowledge base mẫu và sẽ nói rõ khi câu hỏi cần
            dữ liệu chính thức theo thời gian thực.
          </p>
          <div className="mt-5 border-t border-[#eee6da] pt-5">
            <label className="text-sm font-bold text-tv-ink" htmlFor="destination">
              Điểm đến
            </label>
            <select
              id="destination"
              name="destination"
              defaultValue={selected.slug}
              className="mt-2 w-full rounded-lg border border-tv-border bg-tv-bg px-3 py-3"
            >
              {destinations.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {getDestinationCopy(item).name}
                </option>
              ))}
            </select>
          </div>
          {[
            'Xuất phát từ',
            'Ngày đi hoặc số ngày',
            'Số khách',
            'Ngân sách',
            'Sở thích',
            'Nhịp đi',
          ].map((label) => (
            <label key={label} className="mt-4 block text-sm font-bold text-tv-ink">
              {label}
              <input
                className="mt-2 w-full rounded-lg border border-tv-border bg-tv-bg px-3 py-3"
                placeholder={label}
              />
            </label>
          ))}
          <button className="mt-5 w-full rounded-lg bg-tv-orange px-4 py-3 font-bold text-white">
            Tạo lịch trình demo
          </button>
          <div className="mt-5 rounded-tv bg-tv-blue-light p-4">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-tv-blue">Provider</p>
            <p className="mt-2 font-bold">
              {answer.provider.chatProvider === 'ollama'
                ? `Ollama ${answer.provider.model}`
                : 'Sample fallback local'}
            </p>
            <p className="mt-1 text-sm font-bold leading-6 text-tv-ink-3">{answer.provider.note}</p>
          </div>
        </form>
        <div>
          <div className="mb-5 grid gap-4 md:grid-cols-3">
            <CommerceMetric
              label="Điểm đến"
              value={answer.destination}
              helper={`Phong cách: ${answer.travelStyle}`}
            />
            <CommerceMetric
              label="Dự toán"
              value={formatVnd(answer.budget.total)}
              helper="Dữ liệu mẫu local, không phải giá live."
              tone="orange"
            />
            <CommerceMetric
              label="Nguồn"
              value={String(answer.citations.length)}
              helper="Citation từ knowledge base local."
              tone="teal"
            />
          </div>
          <ItineraryTimeline plan={plan} />
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <CommerceSurface>
              <h2 className="text-xl font-bold">Ăn gì & chơi gì</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {[...answer.foods, ...answer.experiences].slice(0, 8).map((item) => (
                  <StatusPill key={item}>{item}</StatusPill>
                ))}
              </div>
            </CommerceSurface>
            <CommerceSurface>
              <h2 className="text-xl font-bold">Culture guard</h2>
              <BoundaryList items={[...answer.culturalNotes, ...answer.safetyNotes].slice(0, 5)} />
            </CommerceSurface>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <BudgetSimulator initialDestinationSlug={selected.slug} />
      </div>
    </PageShell>
  );
}
