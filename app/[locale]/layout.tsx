import React from "react"
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { locales } from '@/i18n';
import { AuthProvider } from '@/components/auth/AuthProvider';
import '../globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'LearnChinese - Master Mandarin with AI',
  description: 'The most effective way to learn Mandarin Chinese. Personalized lessons, immersive reading, and intelligent spaced repetition.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  console.log('=== LocaleLayout Start ===');
  console.log('Awaiting params...');
  
  // Next.js 16 requires awaiting params
  const { locale } = await params;
  console.log('Locale from params:', locale);
  
  // 验证 locale 是否有效
  if (!locales.includes(locale as any)) {
    console.log('Invalid locale, calling notFound()');
    notFound();
  }

  console.log('Fetching messages for locale:', locale);
  // 获取翻译内容
  const messages = await getMessages({ locale });
  console.log('Messages fetched successfully');
  console.log('=== LocaleLayout End ===\n');

  return (
    <html lang={locale} className="dark">
      <body className="font-sans antialiased ink-bg text-white min-h-screen">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AuthProvider>
            {children}
          </AuthProvider>
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
