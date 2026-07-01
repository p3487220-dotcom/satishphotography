import type { Metadata } from "next";
import { Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Satish Photography | Luxury Wedding & Cinematic Photography",
  description: "Exquisite cinematic visual storytelling and luxury wedding photography by Satish in Piduguralla, Andhra Pradesh. Timeless memories, beautifully crafted.",
  keywords: "Satish Photography, Luxury Wedding Photography, Cinematic Wedding Films, Piduguralla, Andhra Pradesh, Portrait Shoot, Pre-Wedding shoots, Baby Shoot, Album Designing",
  authors: [{ name: "Satish Photography" }],
  openGraph: {
    title: "Satish Photography | Luxury Wedding & Cinematic Photography",
    description: "Exquisite cinematic visual storytelling and luxury wedding photography by Satish in Piduguralla, Andhra Pradesh.",
    url: "https://satishphotography1.com",
    siteName: "Satish Photography",
    images: [
      {
        url: "/assets/wedding.webp",
        width: 1200,
        height: 630,
        alt: "Satish Photography Luxury Wedding",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  alternates: {
    canonical: "https://satishphotography1.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-primary text-white selection:bg-gold selection:text-primary">
        {children}
      </body>
    </html>
  );
}
