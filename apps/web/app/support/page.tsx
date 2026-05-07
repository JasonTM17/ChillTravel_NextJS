import Link from "next/link";
import { HelpCircle, Mail, MessageCircle, Phone, Search, ShieldCheck } from "lucide-react";
import { demoPaymentWarning, supportArticles } from "@vietwander/shared";
import { CommerceMetric, CommerceSurface, StatusPill, TrustBanner } from "@/components/commerce-primitives";
import { PageShell } from "@/components/page-shell";

const supportContacts = [
  [MessageCircle, "Chat hỗ trợ", "/chat", "Hỏi trợ lý local về lịch trình hoặc đặt chỗ demo."],
  [Mail, "Email demo", "/profile", "support@chilltravel.local"],
  [Phone, "Hotline mẫu", "/support", "1900 0000 không gọi ra thật"]
] as const;

export default function SupportPage() {
  return (
    <PageShell eyebrow="Trung tâm hỗ trợ" title="Hỗ trợ đặt chỗ demo, gói offline và ranh giới dữ liệu local">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_330px]">
        <section className="space-y-5">
          <CommerceSurface className="bg-[#eef7ff]">
            <form action="/support" className="flex flex-col gap-3 md:flex-row">
              <label className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-[#cbe2f4] bg-white px-4 py-3">
                <Search size={19} className="text-[#0277d4]" aria-hidden="true" />
                <input defaultValue="Thanh toán demo" className="w-full bg-transparent font-black outline-none" aria-label="Tìm bài hỗ trợ" />
              </label>
              <button className="rounded-2xl bg-[#0277d4] px-5 py-3 font-black text-white" type="submit">Tìm hỗ trợ</button>
            </form>
          </CommerceSurface>

          <div className="grid gap-4 md:grid-cols-3">
            <CommerceMetric label="Phản hồi mẫu" value="< 2h" helper="Kênh hỗ trợ mock cho portfolio." />
            <CommerceMetric label="Chủ đề" value={String(supportArticles.length)} helper="Thanh toán, trợ lý local, mobile offline." tone="teal" />
            <CommerceMetric label="Giao dịch thật" value="0" helper="Không thu tiền hoặc lưu thẻ thật." tone="orange" />
          </div>

          <CommerceSurface>
            <h2 className="text-2xl font-black">Câu hỏi thường gặp</h2>
            <div className="mt-5 space-y-3">
              {supportArticles.map((article) => (
                <details key={article.id} className="group rounded-2xl border border-[#d9ecfb] bg-[#fbfdff] p-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                    <span>
                      <StatusPill tone={article.category === "payment" ? "orange" : "blue"}>{categoryLabel(article.category)}</StatusPill>
                      <span className="mt-2 block text-lg font-black">{article.title}</span>
                    </span>
                    <HelpCircle className="shrink-0 text-[#0277d4]" size={22} aria-hidden="true" />
                  </summary>
                  <p className="mt-3 text-sm leading-6 text-[#476273]">{article.summary}</p>
                  <ol className="mt-4 grid gap-2">
                    {article.steps.map((step, index) => (
                      <li key={step} className="flex gap-3 rounded-xl bg-white p-3 text-sm font-bold text-[#34566f]">
                        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#eef7ff] text-xs font-black text-[#0277d4]">{index + 1}</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </details>
              ))}
            </div>
          </CommerceSurface>
        </section>

        <aside className="h-fit space-y-4 lg:sticky lg:top-24">
          <TrustBanner compact />
          <CommerceSurface>
            <h2 className="text-xl font-black">Liên hệ mock</h2>
            <div className="mt-4 space-y-3">
              {supportContacts.map(([Icon, title, href, body]) => (
                <Link key={String(title)} href={String(href)} className="flex gap-3 rounded-2xl bg-[#f7fbff] p-4">
                  <Icon className="mt-0.5 shrink-0 text-[#0277d4]" size={20} aria-hidden="true" />
                  <span>
                    <span className="block font-black">{String(title)}</span>
                    <span className="mt-1 block text-sm leading-6 text-[#476273]">{String(body)}</span>
                  </span>
                </Link>
              ))}
            </div>
          </CommerceSurface>
          <CommerceSurface>
            <div className="flex gap-3">
              <ShieldCheck className="mt-0.5 shrink-0 text-[#0f8b7b]" size={22} aria-hidden="true" />
              <p className="text-sm font-bold leading-6 text-[#476273]">{demoPaymentWarning}. ChillTravel không yêu cầu gửi ảnh thẻ, mã OTP thật hoặc thông tin ngân hàng thật.</p>
            </div>
          </CommerceSurface>
        </aside>
      </div>
    </PageShell>
  );
}

function categoryLabel(category: string) {
  const labels: Record<string, string> = {
    booking: "Đặt chỗ",
    payment: "Thanh toán",
    account: "Tài khoản",
    assistant: "Trợ lý local",
    mobile: "Ứng dụng"
  };

  return labels[category] ?? category;
}
