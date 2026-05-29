import type { Metadata, Viewport } from "next";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "FlowSphere — Intelligent Crowd & Event Experience Platform",
  description: "FlowSphere is a production-grade smart venue operating system for large-scale sporting events. Real-time crowd management, AI navigation, queue prediction, and emergency response for 100,000+ attendees.",
  keywords: ["smart stadium", "crowd management", "venue technology", "event experience", "AI navigation"],
  authors: [{ name: "FlowSphere Team" }],
  applicationName: "FlowSphere",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "FlowSphere" },
};

export const viewport: Viewport = {
  themeColor: "#050A14",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
