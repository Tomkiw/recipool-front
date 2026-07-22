import TanStackProvider from '@/components/TanStackProvider/TanStackProvider';
import './globals.css';
import './reset.css';
import { Metadata } from 'next';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import { montserrat, dmSans } from '@/app/fonts';
import AuthProvider from '@/components/AuthProvider/AuthProvider';
import 'modern-normalize';

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      'http://localhost:3000'
  ),
  title: 'Recipool',
  description: 'Discover, save, and share your favorite recipes.',
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: 'Recipool',
    description: 'Discover, save, and share your favorite recipes.',
    url: '/',
    siteName: 'Recipool',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Recipool',
      },
    ],
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
  modal?: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${montserrat.variable} ${dmSans.variable}`}
    >
      <body>
        <TanStackProvider>
          <AuthProvider>
            <Header />
            <main>{children}</main>
            <Footer />
          </AuthProvider>
        </TanStackProvider>
      </body>
    </html>
  );
}
