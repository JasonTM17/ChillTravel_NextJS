import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "VIETWANDER AI - Vietnam & World Travel Intelligence",
  description: "Local-first travel intelligence platform for Vietnam and world itineraries.",
  metadataBase: new URL("https://vietwander.local")
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
