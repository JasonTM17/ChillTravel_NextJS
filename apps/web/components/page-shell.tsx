export function PageShell({ title, eyebrow, children }: { title: string; eyebrow: string; children: React.ReactNode }) {
  return (
    <main className="planning-desk min-h-screen text-[#071827]">
      <section className="border-b border-[#e0c0b1]/70 px-4 py-14 md:px-8 md:py-20">
        <div className="mx-auto max-w-[1440px]">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[#0f766e]">{eyebrow}</p>
          <h1 className="font-editorial mt-4 max-w-5xl text-4xl font-black leading-[1.02] md:text-6xl">{title}</h1>
        </div>
      </section>
      <section className="mx-auto max-w-[1440px] px-4 py-12 md:px-8">{children}</section>
    </main>
  );
}
