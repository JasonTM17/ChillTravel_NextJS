export function PageShell({ title, eyebrow, children }: { title: string; eyebrow: string; children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[#fdf9f0] text-[#071827]">
      <section className="border-b border-[#eadfce] bg-[#f8f1e6] px-4 py-14 md:py-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-[#0f766e]">{eyebrow}</p>
          <h1 className="mt-4 max-w-5xl text-4xl font-black leading-[0.98] tracking-normal md:text-6xl">{title}</h1>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-12">{children}</section>
    </main>
  );
}
