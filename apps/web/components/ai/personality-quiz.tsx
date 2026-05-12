"use client";

import { useMemo, useState } from "react";
import { destinations, detectTravelStyle, type TravelQuizAnswer } from "@vietwander/shared";
import { DestinationCard } from "@/components/destination-card";
import { traitLabel, travelStyleDescription, travelStyleLabel } from "@/lib/vietnamese";

const questions = [
  {
    id: "pace",
    label: "Nhịp chuyến đi",
    options: ["buổi sáng văn hóa đi chậm", "nhiều điểm ngắm cảnh và hoạt động", "nhịp an toàn cho gia đình"]
  },
  {
    id: "anchor",
    label: "Điều bạn ưu tiên",
    options: ["ẩm thực đường phố chợ quán cà phê", "biển đảo hoàng hôn", "bảo tàng đền chùa di sản"]
  },
  {
    id: "comfort",
    label: "Mức thoải mái",
    options: ["tiết kiệm phương tiện công cộng hostel", "boutique thoải mái địa phương", "resort cao cấp xe riêng spa"]
  }
];

export function PersonalityQuiz() {
  const [answers, setAnswers] = useState<TravelQuizAnswer[]>([
    { id: "pace", value: questions[0]!.options[0]! },
    { id: "anchor", value: questions[1]!.options[0]! },
    { id: "comfort", value: questions[2]!.options[1]! }
  ]);
  const result = useMemo(() => detectTravelStyle(answers), [answers]);
  const recommended = destinations.filter((destination) => result.recommendedDestinationSlugs.includes(destination.slug)).slice(0, 4);

  function updateAnswer(id: string, value: string) {
    setAnswers((current) => current.map((answer) => (answer.id === id ? { ...answer, value } : answer)));
  }

  return (
    <section className="grid gap-8 lg:grid-cols-[420px_1fr]">
      <div className="rounded-tv border border-tv-border bg-white p-5 shadow-tv-card">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-tv-blue">Tính cách du lịch</p>
        <h2 className="mt-2 text-3xl font-bold text-tv-ink">{travelStyleLabel(result.style)}</h2>
        <p className="mt-3 text-tv-ink-3">{travelStyleDescription(result.style, result.description)}</p>
        <div className="mt-5 rounded-tv bg-tv-blue p-5 text-white shadow-[0_14px_32px_rgba(2,119,212,0.18)]">
          <p className="text-sm text-white/65">Độ tự tin gợi ý</p>
          <p className="text-4xl font-bold">{result.score}%</p>
          <div className="mt-4 h-2 rounded-full bg-white/15">
            <div className="h-2 rounded-full bg-tv-orange" style={{ width: `${result.score}%` }} />
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {result.traits.map((trait) => (
            <span key={trait} className="rounded-full bg-tv-blue-light px-3 py-1 text-sm font-semibold text-tv-blue">
              {traitLabel(trait)}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-5">
        {questions.map((question) => (
          <fieldset key={question.id} className="rounded-tv border border-tv-border bg-white p-5 shadow-tv-card">
            <legend className="font-bold text-tv-ink">{question.label}</legend>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {question.options.map((option) => {
                const selected = answers.find((answer) => answer.id === question.id)?.value === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => updateAnswer(question.id, option)}
                    className={selected ? "rounded-tv-sm bg-tv-blue px-4 py-3 text-left font-semibold text-white" : "rounded-tv-sm border border-tv-border bg-tv-bg px-4 py-3 text-left font-semibold text-tv-ink"}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </fieldset>
        ))}

        <div className="grid gap-4 md:grid-cols-2">
          {recommended.map((destination) => (
            <DestinationCard key={destination.slug} destination={destination} />
          ))}
        </div>
      </div>
    </section>
  );
}
