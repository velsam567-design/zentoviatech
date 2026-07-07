import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://zentoviatech.com"),

  title: {
    default: "Zentovia Tech — Premium Software Development",
    template: "%s | Zentovia Tech",
  },

  description:
    "Zentovia Tech builds premium websites, ERP software, mobile applications, AI solutions, cloud platforms and enterprise digital products.",

  keywords: [
    "Zentovia Tech",
    "Software Company",
    "Website Development",
    "Mobile App Development",
    "ERP Software",
    "CRM Development",
    "Inventory Software",
    "Billing Software",
    "AI Solutions",
    "Automation",
    "Next.js",
    "React",
    "Flutter",
    "Firebase",
    "Cloud Development",
    "Tamil Nadu",
    "India",
  ],

  authors: [{ name: "Zentovia Tech", url: "https://zentoviatech.com" }],
  creator: "Zentovia Tech",
  publisher: "Zentovia Tech",
  applicationName: "Zentovia Tech",

  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://zentoviatech.com",
    siteName: "Zentovia Tech",
    title: "Zentovia Tech — Premium Software Development",
    description:
      "Premium Software Development Company specializing in Websites, ERP Software, Mobile Apps, AI Solutions and Cloud Applications.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Zentovia Tech",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Zentovia Tech — Premium Software Development",
    description:
      "Premium Software Development Company specializing in Websites, ERP, Mobile Apps, AI Solutions and Cloud Applications.",
    images: ["/og-image.jpg"],
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  category: "technology",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#020617",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen font-sans antialiased">
        {children}
      </body>
    </html>
  );
}