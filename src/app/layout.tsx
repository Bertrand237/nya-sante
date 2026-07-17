import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#047857" },
    { media: "(prefers-color-scheme: dark)", color: "#065f46" },
  ],
};

export const metadata: Metadata = {
  title: "NYA Santé — Gestion Hospitalière SaaS",
  description:
    "Plateforme SaaS de gestion hospitalière nouvelle génération. DME, consultations, ordonnances, laboratoire, facturation — tout en un.",
  keywords: [
    "NYA Santé",
    "gestion hospitalière",
    "DME",
    "SaaS santé",
    "système de santé",
    "HIS",
    "Afrique",
    "Cameroun",
    "hospital management",
    "patient records",
    "PWA",
  ],
  authors: [{ name: "NYA Santé" }],
  creator: "NYA Santé",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "NYA Santé",
  },
  openGraph: {
    type: "website",
    locale: "fr_CM",
    title: "NYA Santé — Gestion Hospitalière SaaS",
    description: "Plateforme SaaS de gestion hospitalière nouvelle génération pour l'Afrique",
    siteName: "NYA Santé",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "NYA Santé",
    "application-name": "NYA Santé",
    "msapplication-TileColor": "#047857",
    "msapplication-tap-highlight": "no",
  },
  icons: {
    icon: [
      { url: "/icons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="NYA Santé" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}