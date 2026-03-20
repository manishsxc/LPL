import type { Metadata } from 'next';
import { Rajdhani, Orbitron } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const rajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-rajdhani',
});

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['700', '900'],
  variable: '--font-orbitron',
});

export const metadata: Metadata = {
  title: 'Langta Premier League — Auction',
  description: 'IPL-style premium cricket auction platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${rajdhani.variable} ${orbitron.variable} font-rajdhani bg-lpl-dark text-white antialiased`}>
        {children}
        <Toaster position="top-right" toastOptions={{ style: { background: '#0A1628', color: '#fff', border: '1px solid rgba(255,215,0,0.3)' } }} />
      </body>
    </html>
  );
}
