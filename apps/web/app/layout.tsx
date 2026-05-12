import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { AuthProvider } from "@/lib/auth/auth-context";
import { ThemeProvider } from "next-themes";

export const metadata: Metadata = {
  title: "WanderViet — Đặt tour du lịch Việt Nam",
  description:
    "Nền tảng du lịch Việt Nam và thế giới với tìm kiếm, lịch trình thông minh ưu tiên chạy local và thanh toán demo an toàn.",
  metadataBase: new URL("https://chilltravel.local"),
  icons: {
    icon: "/brand/logo-mark-islands.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light">
          <AuthProvider>
            <SiteHeader />
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
