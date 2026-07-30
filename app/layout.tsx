import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'PromptWorld AI — Premium AI Prompt Gallery',
  description: 'Discover, create, and share high-quality AI prompts.',
  icons: { icon: '/favicon.png' }, // <-- ADD THIS LINE
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      
      <body>
        <Header />
        
        <main style={{ paddingTop: 0, minHeight: '100vh' }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}