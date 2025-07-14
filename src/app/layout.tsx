
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/hooks/use-auth';
import { ThemeProvider } from '@/components/theme-provider';
import Script from 'next/script';

export const metadata: Metadata = {
  title: {
    template: '%s | Facelyze',
    default: 'Facelyze - AI Face Analysis & Aesthetic Scoring',
  },
  description: "Get a detailed AI analysis of your facial aesthetics. Facelyze provides personalized scores, feature breakdowns, and actionable skincare recommendations to help you achieve your goals.",
  keywords: ['face analysis', 'facial aesthetics', 'aesthetic score', 'lookmaxxing', 'beauty ai', 'skincare recommendations', 'self-improvement'],
  openGraph: {
    title: 'Facelyze - AI Face Analysis & Aesthetic Scoring',
    description: 'Get a detailed AI analysis of your facial aesthetics, personalized scores, and skincare recommendations.',
    url: 'https://facelyze.com',
    siteName: 'Facelyze',
    images: [
      {
        url: 'https://i.ibb.co/PGmC0pBK/Untitled-design-6.png',
        width: 1200,
        height: 630,
        alt: 'Facelyze AI Face Analysis',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Facelyze - AI Face Analysis & Aesthetic Scoring',
    description: 'Get a detailed AI analysis of your facial aesthetics, personalized scores, and skincare recommendations.',
    images: ['https://i.ibb.co/PGmC0pBK/Untitled-design-6.png'],
  },
  metadataBase: new URL('https://facelyze.com'),
  icons: {
    icon: 'https://i.ibb.co/PGmC0pBK/Untitled-design-6.png',
    shortcut: 'https://i.ibb.co/PGmC0pBK/Untitled-design-6.png',
    apple: 'https://i.ibb.co/PGmC0pBK/Untitled-design-6.png',
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Facelyze",
  "url": "https://facelyze.com/",
  "potentialAction": [
    {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://facelyze.com/?s={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  ],
  "mainEntity": {
    "@type": "WebPage",
    "mainEntityOfPage": {
      "@type": "WebSite",
      "url": "https://facelyze.com"
    },
    "hasPart": [
      {
        "@type": "WebPage",
        "name": "Dashboard",
        "url": "https://facelyze.com/"
      },
      {
        "@type": "WebPage",
        "name": "Scan Face",
        "url": "https://facelyze.com/scan-face"
      },
      {
        "@type": "WebPage",
        "name": "Advisory",
        "url": "https://facelyze.com/advisory"
      }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="google-adsense-account" content="ca-pub-9124896176133484" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9124896176133484"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
      </head>
      <body className="antialiased min-h-screen bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <main>{children}</main>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
