export function PageShell({ title, eyebrow, children }: { title: string; eyebrow: string; children: React.ReactNode }) {
  return (
    <main className="travel-commerce-surface min-h-screen text-[#071827]">
      <section className="border-b border-[#d9ecfb] bg-white px-4 py-9 md:px-6 md:py-12">
        <div className="mx-auto max-w-[1180px]">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#0277d4] md:text-sm">{eyebrow}</p>
          <h1 className="mt-3 max-w-5xl text-3xl font-black leading-[1.08] md:text-5xl">{title}</h1>
        </div>
      </section>
      <section className="mx-auto max-w-[1180px] px-4 py-8 md:px-6 md:py-10">{children}</section>
    </main>
  );
}
