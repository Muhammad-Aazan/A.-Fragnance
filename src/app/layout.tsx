import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { WishlistProvider } from "@/lib/wishlist-context";
import SiteShell from "@/components/layout/SiteShell";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://afragrance.vercel.app";

export const viewport: Viewport = {
  themeColor: "#c6a56b",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "A. Fragrance — Define Your Presence | Luxury Perfumes & Pure Attars",
    template: "%s | A. Fragrance",
  },
  description:
    "Handcrafted luxury perfumes and concentrated artisanal attars distilled from natural botanical extracts, wild Assam agarwood, and vintage Taif roses. Express shipping across Pakistan.",
  keywords: [
    "Luxury Perfumes Pakistan",
    "Pure Attar",
    "Oud Noir",
    "Extrait de Parfum",
    "Concentrated Perfume Oil",
    "Artisanal Fragrance Karachi",
    "Designer Perfumes Lahore",
    "Buy Perfume Online Pakistan",
    "A. Fragrance",
    "Royal Musk",
    "Taif Rose Attar",
  ],
  authors: [{ name: "A. Fragrance Atelier" }],
  creator: "A. Fragrance",
  publisher: "A. Fragrance",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "A. Fragrance — Define Your Presence",
    description:
      "Rare ingredients. Unforgettable character. Discover luxury perfumes and sacred attars handcrafted for discerning connoisseurs.",
    url: siteUrl,
    siteName: "A. Fragrance",
    images: [
      {
        url: "/luxury-flacon.jpg",
        width: 1200,
        height: 630,
        alt: "A. Fragrance Luxury Extrait de Parfum",
      },
    ],
    locale: "en_PK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "A. Fragrance — Define Your Presence",
    description:
      "Handcrafted luxury perfumes and concentrated artisanal attars. Express delivery across Pakistan.",
    images: ["/luxury-flacon.jpg"],
    creator: "@afragrance",
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
  verification: {
    google: "OKi1fYi2AgEJT0QuzlRuYFoWhGSmwu3gya-HoK6Zb94",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <WishlistProvider>
          <CartProvider>
            <SiteShell>{children}</SiteShell>
          </CartProvider>
        </WishlistProvider>
      </body>
    </html>
  );
}
