import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { BAKERY_META, BAKERY_BRAND } from "@/lib/constants/brand";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { extractRouterConfig } from "uploadthing/server";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: BAKERY_META.title,
    template: `%s | ${BAKERY_META.title}`,
  },
  description: BAKERY_META.description,
  keywords: BAKERY_META.keywords,
  authors: [{ name: BAKERY_META.author }],
  creator: BAKERY_META.author,
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: BAKERY_BRAND.website,
    title: BAKERY_META.title,
    description: BAKERY_META.description,
    siteName: BAKERY_META.title,
  },
  twitter: {
    card: "summary_large_image",
    title: BAKERY_META.title,
    description: BAKERY_META.description,
    creator: `@${BAKERY_META.author.replace(" ", "").toLowerCase()}`,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
          <main className="min-h-screen">
            {children}
          </main>
          <Analytics />
          <SpeedInsights />
          <Toaster closeButton expand position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
