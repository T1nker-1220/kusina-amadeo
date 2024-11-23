import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './globals.css';
import AuthProvider from '@/providers/AuthProvider';
import { CartProvider } from '@/contexts/CartContext';
import { Toaster } from 'react-hot-toast';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
  variable: '--font-inter',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['Georgia', 'Times New Roman', 'serif'],
  variable: '--font-playfair-display',
});

export const metadata: Metadata = {
  title: 'Kusina De Amadeo',
  description: 'Authentic Filipino restaurant in Amadeo, Cavite',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans">
        <AuthProvider>
          <CartProvider>
            <Toaster position="top-right" />
            <Header />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
