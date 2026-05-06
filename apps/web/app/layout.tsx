import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "VietWander AI - Đặt chuyến đi thông minh",
  description: "Nền tảng du lịch Việt Nam và thế giới với tìm kiếm, lịch trình AI ưu tiên chạy local và thanh toán demo an toàn.",
  metadataBase: new URL("https://vietwander.local"),
  icons: {
    icon: "/brand/logo-mark-ai-islands.png"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
