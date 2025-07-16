
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
  description: "Unlock your true aesthetic potential with Facelyze, your personal AI-powered face analysis coach. Receive objective scores, in-depth analysis of your facial features, and a personalized roadmap with actionable skincare and grooming advice to help you achieve your self-improvement goals.",
  keywords: ['ai face analysis', 'aesthetic score', 'facial harmony', 'lookmaxxing', 'beauty ai', 'skincare recommendations', 'self-improvement', 'face rating', 'grooming advice'],
  openGraph: {
    title: 'Facelyze - AI Face Analysis & Aesthetic Scoring',
    description: 'Unlock your true aesthetic potential with your personal AI-powered face analysis coach. Get objective scores and a personalized roadmap for self-improvement.',
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
    description: 'Unlock your true aesthetic potential with your personal AI-powered face analysis coach. Get objective scores and a personalized roadmap for self-improvement.',
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
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://facelyze.com/?q={search_term_string}",
    "query-input": "required name=search_term_string"
  },
  "mainEntity": {
      "@type": "Organization",
      "name": "Facelyze",
      "url": "https://facelyze.com/",
      "logo": "https://i.ibb.co/PGmC0pBK/Untitled-design-6.png",
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer support",
        "url": "https://facelyze.com/contact"
      }
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
        <link href="https://fonts.googleapis.com/css2?family=Kanit:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
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
