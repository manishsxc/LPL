import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';

// Optional: fallback to system fonts if you remove Google Fonts
const rajdhaniClass = 'font-sans'; // Replace with local font class if using local
const orbitronClass = 'font-sans'; // Replace with local font class if using local

export const metadata: Metadata = {
  title: 'Langta Premier League — Auction',
  description: 'IPL-style premium cricket auction platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Removed Google Fonts links to prevent SSL issues */}
      </head>
      <body className={`${rajdhaniClass} ${orbitronClass} bg-lpl-dark text-white antialiased`}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: '#0A1628', color: '#fff', border: '1px solid rgba(255,215,0,0.3)' },
          }}
        />
      </body>
    </html>
  );
}