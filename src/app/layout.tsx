import type { Metadata, Viewport } from "next";
import { SITE_URL } from "../lib/config";
import "./globals.css";

const description =
  "Ücretsiz online bilgi yarışması: Kolay, Orta, Zor veya Çok Zor seviyeni seç. 10 genel kültür sorusunu cevapla, açıklamaları öğren ve sonucunu paylaş. Üyelik gerekmez.";
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Yeni Nesil Bilgi Yarışması | Bilgini Göster, Eğlenerek Öğren!",
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: SITE_URL,
    siteName: "Yeni Nesil Bilgi Yarışması",
    title: "Yeni Nesil Bilgi Yarışması",
    description,
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Yeni Nesil Bilgi Yarışması: Bilgini göster, eğlenerek öğren!",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yeni Nesil Bilgi Yarışması",
    description,
    images: ["/opengraph-image.png"],
  },
  icons: { icon: "/icon.svg" },
};
export const viewport: Viewport = { themeColor: "#087b66" };

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr" data-scroll-behavior="smooth">
      <body>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebSite", name: "Yeni Nesil Bilgi Yarışması", url: SITE_URL, inLanguage: "tr-TR", description }) }} />
      </body>
    </html>
  );
}
