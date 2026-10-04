import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { LanguageProvider } from '@/lib/i18n';
import type { Language } from '@/lib/i18n';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import './globals.css';

export const metadata: Metadata = {
  title: 'Bukka Ayyavarlu Community',
  description: 'Guardians of tradition, keepers of culture — a proud community woven through the centuries of Andhra heritage.',
  icons: {
    icon: '/bukka-ayyavarlu-logo.png',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const savedLanguage = (await cookies()).get('bukka_language')?.value;
  const language: Language = savedLanguage === 'te' ? 'te' : 'en';

  return (
    <html lang={language}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Cinzel:wght@400;600;700&family=Lato:wght@300;400;700&family=Noto+Sans+Telugu:wght@400;500;600;700&family=Noto+Serif+Telugu:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <LanguageProvider initialLanguage={language}>
          {children}
          <LanguageSwitcher />
        </LanguageProvider>
      </body>
    </html>
  );
}
