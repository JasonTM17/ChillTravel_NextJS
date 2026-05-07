import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-ivory px-4 text-center">
      <div>
        <h1 className="text-5xl font-black text-navy">404</h1>
        <p className="mt-4 text-navy/70">Tuyến này không có trong lịch trình.</p>
        <Link href="/" className="mt-6 inline-flex rounded-lg bg-teal px-5 py-3 font-bold text-white">Về trang chủ</Link>
      </div>
    </main>
  );
}
