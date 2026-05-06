export function PageShell({ title, eyebrow, children }: { title: string; eyebrow: string; children: React.ReactNode }) {
  return (
    <main className="travel-commerce-surface min-h-screen text-[#071827]">
      <section className="border-b border-[#d9ecfb] px-4 py-12 md:px-8 md:py-16">
        <div className="mx-auto max-w-[1440px]">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-[#0277d4]">{eyebrow}</p>
          <h1 className="mt-4 max-w-5xl text-4xl font-black leading-[1.04] md:text-6xl">{title}</h1>
        </div>
      </section>
      <section className="mx-auto max-w-[1440px] px-4 py-12 md:px-8">{children}</section>
    </main>
  );
}
