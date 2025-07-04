import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/hooks/use-auth';
import { ThemeProvider } from '@/components/theme-provider';

export const metadata: Metadata = {
  title: {
    template: '%s | Facelyz',
    default: 'Facelyz - AI Face Analysis & Aesthetic Scoring',
  },
  description: "Get a detailed AI analysis of your facial aesthetics. Facelyz provides personalized scores, feature breakdowns, and actionable skincare recommendations to help you achieve your goals.",
  keywords: ['face analysis', 'facial aesthetics', 'aesthetic score', 'lookmaxxing', 'beauty ai', 'skincare recommendations', 'self-improvement'],
  openGraph: {
    title: 'Facelyz - AI Face Analysis & Aesthetic Scoring',
    description: 'Get a detailed AI analysis of your facial aesthetics, personalized scores, and skincare recommendations.',
    url: 'https://www.facelyz.com',
    siteName: 'Facelyz',
    images: [
      {
        url: 'https://placehold.co/1200x630.png',
        width: 1200,
        height: 630,
        alt: 'Facelyz AI Face Analysis',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Facelyz - AI Face Analysis & Aesthetic Scoring',
    description: 'Get a detailed AI analysis of your facial aesthetics, personalized scores, and skincare recommendations.',
    images: ['https://placehold.co/1200x630.png'],
  },
  metadataBase: new URL('https://www.facelyz.com'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Lora:wght@400;700&family=Poppins:wght@400;600&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen bg-background text-foreground">
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
