"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState, useTransition } from "react";
import { Bot, CheckCircle2, DatabaseZap, Loader2, Send, ShieldAlert, Sparkles, UserRound } from "lucide-react";
import type { AiChatStructuredAnswer } from "@vietwander/shared";
import { StatusPill } from "@/components/commerce-primitives";
import { formatVnd } from "@/lib/utils";

type ChatTurn = {
  id: string;
  role: "user" | "assistant";
  content: string;
  answer?: AiChatStructuredAnswer;
};

const suggestedPrompts = [
  "Đà Nẵng đi 3 ngày ăn gì cho cặp đôi?",
  "Paris budget 5 days, thích bảo tàng và cafe",
  "Gia đình đi Phú Quốc 4 ngày cần gói offline",
  "Giá vé bay hôm nay và thời tiết Đà Nẵng thế nào?"
];

export function LocalChatConcierge({ initialAnswer }: { initialAnswer: AiChatStructuredAnswer }) {
  const [input, setInput] = useState("Đà Nẵng đi 3 ngày ăn gì cho cặp đôi?");
  const [turns, setTurns] = useState<ChatTurn[]>([
    {
      id: "assistant-initial",
      role: "assistant",
      content: initialAnswer.answer,
      answer: initialAnswer
    }
  ]);
  const [isPending, startTransition] = useTransition();
  const latestAnswer = useMemo(() => [...turns].reverse().find((turn) => turn.answer)?.answer ?? initialAnswer, [turns, initialAnswer]);

  function submitPrompt(prompt: string) {
    const message = prompt.trim();
    if (!message || isPending) return;
    setInput("");
    const userTurn: ChatTurn = { id: `user-${Date.now()}`, role: "user", content: message };
    setTurns((current) => [...current, userTurn]);
    startTransition(async () => {
      const response = await fetch("/api/local-ai/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message })
      });
      const payload = (await response.json()) as { data: AiChatStructuredAnswer };
      setTurns((current) => [
        ...current,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: payload.data.answer,
          answer: payload.data
        }
      ]);
    });
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submitPrompt(input);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <section className="rounded-[18px] border border-[#d9ecfb] bg-white p-4 shadow-[0_18px_54px_rgba(2,68,120,0.08)] md:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#edf4fa] pb-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#0277d4]">Trợ lý local-first</p>
            <h2 className="mt-1 text-2xl font-black">Chat lập chuyến có nguồn</h2>
          </div>
          <ProviderBadge answer={latestAnswer} />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {suggestedPrompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => submitPrompt(prompt)}
              className="rounded-full border border-[#d9ecfb] bg-[#f7fbff] px-3 py-2 text-left text-xs font-black text-[#0277d4] transition hover:bg-[#eef7ff]"
            >
              {prompt}
            </button>
          ))}
        </div>

        <div className="mt-5 space-y-4">
          {turns.map((turn) => (
            <article key={turn.id} className={`flex gap-3 ${turn.role === "user" ? "justify-end" : "justify-start"}`}>
              {turn.role === "assistant" ? <Avatar icon="assistant" /> : null}
              <div className={`max-w-[92%] rounded-2xl p-4 md:max-w-[78%] ${turn.role === "user" ? "bg-[#0277d4] text-white" : "bg-[#f7fbff] text-[#071827]"}`}>
                <p className="text-sm font-bold leading-6">{turn.content}</p>
                {turn.answer ? <StructuredAnswer answer={turn.answer} /> : null}
              </div>
              {turn.role === "user" ? <Avatar icon="user" /> : null}
            </article>
          ))}
          {isPending ? (
            <div className="flex items-center gap-2 rounded-2xl bg-[#f7fbff] p-4 text-sm font-black text-[#0277d4]">
              <Loader2 className="animate-spin" size={18} aria-hidden="true" />
              Đang hỏi trợ lý local...
            </div>
          ) : null}
        </div>

        <form onSubmit={onSubmit} className="mt-5 flex flex-col gap-3 rounded-2xl border border-[#d9ecfb] bg-[#fbfdff] p-3 md:flex-row">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className="min-h-12 flex-1 rounded-xl bg-white px-4 font-bold outline-none ring-1 ring-[#d9ecfb] focus:ring-2 focus:ring-[#0277d4]/35"
            placeholder="Hỏi về ngân sách, món ăn, văn hóa, hành lý..."
          />
          <button disabled={isPending} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#ff6d1a] px-5 py-3 font-black text-white disabled:opacity-70">
            <Send size={18} aria-hidden="true" />
            Gửi
          </button>
        </form>
      </section>

      <aside className="h-fit space-y-4 lg:sticky lg:top-24">
        <ActionPanel answer={latestAnswer} />
        <KnowledgePanel answer={latestAnswer} />
      </aside>
    </div>
  );
}

function Avatar({ icon }: { icon: "assistant" | "user" }) {
  return (
    <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl ${icon === "assistant" ? "bg-[#eef7ff] text-[#0277d4]" : "bg-[#fff3e8] text-[#b45309]"}`}>
      {icon === "assistant" ? <Bot size={20} aria-hidden="true" /> : <UserRound size={20} aria-hidden="true" />}
    </div>
  );
}

function ProviderBadge({ answer }: { answer: AiChatStructuredAnswer }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-[#e8fbf6] px-3 py-2 text-xs font-black text-[#0f766e]">
      <DatabaseZap size={15} aria-hidden="true" />
      {answer.provider.chatProvider === "ollama" ? `Ollama ${answer.provider.model}` : "Sample fallback"}
    </div>
  );
}

function StructuredAnswer({ answer }: { answer: AiChatStructuredAnswer }) {
  return (
    <div className="mt-4 space-y-3 border-t border-[#d9ecfb] pt-4">
      {answer.realtimeWarning ? (
        <div className="flex gap-2 rounded-xl bg-[#fff3e8] p-3 text-xs font-black leading-5 text-[#b45309]">
          <ShieldAlert size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
          {answer.realtimeWarning}
        </div>
      ) : null}

      <div className="grid gap-2 md:grid-cols-3">
        <MiniMetric label="Điểm đến" value={answer.destination} />
        <MiniMetric label="Phong cách" value={answer.travelStyle} />
        <MiniMetric label="Ngân sách" value={formatVnd(answer.budget.total)} />
      </div>

      <div className="rounded-xl bg-white p-3">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-[#6f8594]">Lịch trình gợi ý</p>
        <div className="mt-3 space-y-2">
          {answer.itinerary.days.slice(0, 3).map((day) => (
            <div key={day.day} className="rounded-xl bg-[#f7fbff] p-3">
              <p className="font-black">Ngày {day.day}: {day.title}</p>
              <p className="mt-1 text-xs font-bold leading-5 text-[#476273]">{[...day.morning, ...day.afternoon, ...day.evening].slice(0, 3).join(" · ")}</p>
            </div>
          ))}
        </div>
      </div>

      {answer.clarifyingQuestions.length ? (
        <div className="rounded-xl bg-white p-3">
          <p className="font-black">Mình cần thêm nếu muốn chính xác hơn</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {answer.clarifyingQuestions.map((question) => (
              <StatusPill key={question.id} tone="orange">{question.question}</StatusPill>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white p-3">
      <p className="text-[11px] font-black uppercase tracking-[0.12em] text-[#6f8594]">{label}</p>
      <p className="mt-1 text-sm font-black">{value}</p>
    </div>
  );
}

function ActionPanel({ answer }: { answer: AiChatStructuredAnswer }) {
  return (
    <section className="rounded-[18px] border border-[#d9ecfb] bg-white p-5 shadow-[0_18px_54px_rgba(2,68,120,0.08)]">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-[#0277d4]">Hành động nhanh</p>
      <h2 className="mt-2 text-2xl font-black">Biến câu trả lời thành chuyến đi</h2>
      <div className="mt-4 grid gap-3">
        {answer.quickActions.map((action) =>
          action.href ? (
            <Link key={action.id} href={action.href} className="inline-flex items-center justify-between rounded-xl bg-[#f3f9ff] px-4 py-3 text-sm font-black text-[#071827] transition hover:text-[#0277d4]">
              {action.label}
              <Sparkles size={16} aria-hidden="true" />
            </Link>
          ) : (
            <button key={action.id} type="button" className="inline-flex items-center justify-between rounded-xl bg-[#f3f9ff] px-4 py-3 text-left text-sm font-black text-[#071827]">
              {action.label}
              <CheckCircle2 size={16} className="text-[#0f8b7b]" aria-hidden="true" />
            </button>
          )
        )}
      </div>
    </section>
  );
}

function KnowledgePanel({ answer }: { answer: AiChatStructuredAnswer }) {
  return (
    <section className="rounded-[18px] border border-[#d9ecfb] bg-white p-5 shadow-[0_18px_54px_rgba(2,68,120,0.08)]">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-[#0277d4]">Nguồn local</p>
      <h2 className="mt-2 text-xl font-black">Citation & guardrail</h2>
      <div className="mt-4 space-y-3">
        {answer.citations.map((citation) => (
          <div key={`${citation.sourceId}-${citation.chunkId}`} className="rounded-xl bg-[#f7fbff] p-3">
            <p className="font-black">{citation.sourceId}</p>
            <p className="mt-1 text-xs font-bold text-[#476273]">Chunk: {citation.chunkId} · {citation.trustTier ?? "sample"}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 rounded-xl bg-[#fff3e8] p-3 text-xs font-bold leading-5 text-[#b45309]">
        Trợ lý local không bịa vé bay, visa hoặc thời tiết hiện tại. Khi cần dữ liệu live, hãy kiểm tra nguồn chính thức.
      </p>
    </section>
  );
}
