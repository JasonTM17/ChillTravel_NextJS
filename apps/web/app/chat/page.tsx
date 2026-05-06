import { localAiAnswer } from "@vietwander/shared";
import { PageShell } from "@/components/page-shell";

const sampleQuestion = "Đà Nẵng 3 ngày nên ăn gì và đi theo lịch trình nào?";

export default function ChatPage() {
  const answer = localAiAnswer(sampleQuestion);

  return (
    <PageShell eyebrow="Trợ lý du lịch local" title="Hỏi VietWander để nhận câu trả lời có nguồn và ranh giới rõ ràng">
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="rounded-[16px] border border-[#d9ecfb] bg-white p-5 shadow-[0_18px_54px_rgba(2,68,120,0.08)]">
          <div className="rounded-2xl border border-[#d9ecfb] bg-[#f7fbff] p-4">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#0277d4]">Câu hỏi của bạn</p>
            <p className="mt-2 text-[#40515d]">{sampleQuestion}</p>
          </div>
          <div className="mt-4 rounded-2xl bg-[#071827] p-5 text-white">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#8ed6ff]">VietWander trả lời</p>
            <h2 className="mt-2 text-3xl font-black">Lịch trình cân bằng, ưu tiên ẩm thực</h2>
            <p className="mt-3 leading-7 text-white/82">
              Bắt đầu bằng bữa hải sản gần Mỹ Khê, dành sáng hôm sau cho Sơn Trà hoặc Ngũ Hành Sơn, rồi giữ nửa ngày cho
              Hội An nếu bạn muốn nhịp đi cân bằng. Về món ăn, ưu tiên mì Quảng, bánh tráng cuốn thịt heo và một bữa hải sản.
              Đây là dữ liệu mẫu local, không phải tình trạng chỗ trống hoặc giá thời gian thực.
            </p>
            <p className="mt-4 text-sm text-white/62">Nguồn knowledge base: {answer.citations[0]?.sourceId}</p>
          </div>
          <form className="mt-6 flex flex-col gap-3 md:flex-row">
            <input
              className="flex-1 rounded-lg border border-[#d9ecfb] bg-[#f7fbff] px-4 py-3 outline-none focus:border-[#0277d4]"
              placeholder="Hỏi về ngân sách, món ăn, văn hóa, hành lý..."
            />
            <button className="rounded-lg bg-[#0277d4] px-5 py-3 font-black text-white">Gửi</button>
          </form>
        </section>
        <aside className="rounded-[16px] border border-[#d9ecfb] bg-white p-5 shadow-[0_18px_54px_rgba(2,68,120,0.08)]">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#0277d4]">Hành động nhanh</p>
          <h2 className="mt-2 text-2xl font-black text-[#071827]">Biến câu trả lời thành chuyến đi</h2>
          {["Lưu câu trả lời", "Chuyển thành lịch trình", "Thêm điểm đến", "Ước tính ngân sách"].map((item) => (
            <button key={item} className="mt-3 w-full rounded-lg bg-[#f3f9ff] px-4 py-3 text-left font-bold text-[#071827]">
              {item}
            </button>
          ))}
          <p className="mt-5 rounded-xl bg-[#fff3e8] p-4 text-sm font-bold leading-6 text-[#b45309]">
            VietWander không bịa giá vé bay, visa hoặc thời tiết theo thời gian thực nếu knowledge base local không có dữ liệu đó.
          </p>
        </aside>
      </div>
    </PageShell>
  );
}
