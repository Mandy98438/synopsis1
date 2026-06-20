import type { Metadata, Viewport } from "next";
import { Providers } from "@/components/providers";
import "@/styles/globals.css";
import "@/styles/animations.css";

export const metadata: Metadata = {
  title: { default: "Kard — One card. Every connection.", template: "%s — Kard" },
  description: "Your digital identity card for everywhere.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://kard.io"),
  openGraph: { title: "Kard — One card. Every connection.", description: "Share your identity instantly with a single link or QR code.", type: "website", siteName: "Kard" },
  twitter: { card: "summary_large_image", title: "Kard", description: "Share your identity instantly." },
};

export const viewport: Viewport = {
  width: "device-width", initialScale: 1, maximumScale: 1, themeColor: "#0a0a0a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-[#0a0a0a] text-white antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
