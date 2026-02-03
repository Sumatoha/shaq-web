import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-dm-sans',
});

const playfair = Playfair_Display({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-playfair',
});

export const metadata: Metadata = {
  title: 'Shaq — Конструктор приглашений на торжества',
  description: 'Создайте красивое цифровое приглашение на свадьбу, той, юбилей за несколько минут. Персональные ссылки для гостей, RSVP, рассадка гостей.',
  keywords: ['приглашение', 'свадьба', 'той', 'сүндет той', 'тұсау кесу', 'юбилей', 'Казахстан'],
  openGraph: {
    title: 'Shaq — Конструктор приглашений',
    description: 'Создайте красивое цифровое приглашение на торжество',
    url: 'https://shaq.kz',
    siteName: 'Shaq',
    locale: 'ru_KZ',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={`${inter.variable} ${playfair.variable}`}>
      <body className="antialiased">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#111110',
              color: '#fff',
            },
          }}
        />
      </body>
    </html>
  );
}
