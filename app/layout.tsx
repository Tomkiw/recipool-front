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
  title: 'Tasteorama',
  description: 'Discover, save, and share your favorite recipes.',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
  modal?: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`${montserrat.variable} ${dmSans.variable}`}>
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
