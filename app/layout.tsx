import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  icons: {
    icon: '/favicon.png',
  },
  title: {
    default: 'PromptWorld AI - Premium AI Prompt Gallery & Marketplace',
    template: '%s | PromptWorld AI',
  },
  applicationName: 'Prompt World AI',
  description: 'Discover, copy, and generate with thousands of curated, production-ready AI prompts for Midjourney, DALL-E 3, Stable Diffusion, and Flux. The ultimate prompt library for creators.',
  keywords: ['AI prompts', 'Midjourney prompts', 'DALL-E 3 prompts', 'Stable Diffusion', 'Flux prompts', 'AI art generator', 'prompt library', 'AI prompt gallery'],
  authors: [{ name: 'PromptWorld AI' }],
  creator: 'PromptWorld AI',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://promptworld.store',
    siteName: 'PromptWorld AI',
    title: 'PromptWorld AI - Premium AI Prompt Gallery',
    description: 'Discover, copy, and generate with thousands of curated AI prompts.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'PromptWorld AI Gallery',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PromptWorld AI',
    description: 'The ultimate curated library of production-ready AI prompts.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  other: {
    'google-adsense-account': 'ca-pub-5411995794134337',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="4EAJ4Vn_ye4qZyBlKOcXIdGiv7sXdlsc0ule_ifuMCo" />
        <Script
          src="https://quge5.com/88/tag.min.js"
          data-zone="267737"
          data-cfasync="false"
          strategy="afterInteractive"
        />
      </head>
      <body>
        
        {/* ========================================== */}
        {/* GOOGLE ANALYTICS CODE START                */}
        {/* ========================================== */}
        
        {/* 1. Load the Google Analytics library */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-JJRK269QEZ"
        />
        
        {/* 2. Initialize Google Analytics */}
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-JJRK269QEZ');
            `,
          }}
        />

        {/* ========================================== */}
        {/* GOOGLE ANALYTICS CODE END                  */}
        {/* ========================================== */}

        <Header />
        <main style={{ paddingTop: 0, minHeight: '100vh' }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}