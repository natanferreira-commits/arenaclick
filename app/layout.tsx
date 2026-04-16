import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.arenaafiliados.com.br"),
  title: {
    default: "Arena Click — Ferramentas gratuitas para criadores de conteúdo",
    template: "%s | Arena Click",
  },
  description:
    "Ferramentas gratuitas para criadores de conteúdo: mídia kit profissional, calculadora de receita e mais. Crie, cresça e monetize sua audiência.",
  keywords: [
    "mídia kit",
    "criador de conteúdo",
    "influenciador",
    "monetização",
    "afiliados",
    "apostas esportivas",
    "mídia kit gratuito",
    "criador de mídia kit",
  ],
  authors: [{ name: "Arena" }],
  creator: "Arena",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://www.arenaafiliados.com.br",
    siteName: "Arena Click",
    title: "Arena Click — Ferramentas gratuitas para criadores de conteúdo",
    description:
      "Crie seu mídia kit profissional gratuitamente. Para criadores de qualquer nicho.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Arena Click",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Arena Click — Ferramentas gratuitas para criadores",
    description:
      "Crie seu mídia kit profissional gratuitamente. Para criadores de qualquer nicho.",
    images: ["/og-image.png"],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#0d0d0d] text-white">
        {children}
      </body>
    </html>
  );
}
