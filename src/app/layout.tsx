import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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

export const metadata: Metadata = {
  title: "NYA Santé — Cahier de Charges | Plateforme de Santé pour l'Afrique",
  description:
    "Cahier de charges complet de NYA Santé : plateforme de gestion hospitalière nouvelle génération, conçue pour l'Afrique. Fonctionnement offline, multi-tenant, applications Android.",
  keywords: [
    "NYA Santé",
    "santé Afrique",
    "gestion hospitalière",
    "DME Afrique",
    "offline-first healthcare",
    "système de santé",
    "HIS Africa",
  ],
  icons: {
    icon: "/nya-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}