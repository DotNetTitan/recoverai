// app/layout.tsx — Root layout: providers, fonts, metadata, disclaimer check
import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';

export const metadata: Metadata = {
  title: 'RecoverAI — Recovery & Prevention Platform',
  description:
    'Multi-modal, AI-powered support for individuals navigating substance use disorders and their caregivers. Voice-first crisis intervention, personalized scripts, and grounding tools.',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-96x96.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
