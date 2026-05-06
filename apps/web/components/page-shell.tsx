export function PageShell({ title, eyebrow, children }: { title: string; eyebrow: string; children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-ivory">
      <section className="cinematic px-4 py-20 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-mist">{eyebrow}</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black md:text-6xl">{title}</h1>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-12">{children}</section>
    </main>
  );
}
