import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "VietWander AI - Đặt chuyến đi thông minh",
  description: "Nền tảng du lịch Việt Nam và thế giới với tìm kiếm, lịch trình AI local-first và thanh toán demo an toàn.",
  metadataBase: new URL("https://vietwander.local"),
  icons: {
    icon: "/brand/favicon.svg"
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
