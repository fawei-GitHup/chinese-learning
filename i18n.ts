import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// 支持的语言列表
export const locales = ['zh-CN', 'en'] as const;
export type Locale = (typeof locales)[number];

// 默认语言
export const defaultLocale: Locale = 'zh-CN';

export default getRequestConfig(async ({ locale }) => {
  console.log('=== i18n getRequestConfig ===');
  console.log('Requested locale:', locale);
  
  // 如果locale是undefined，使用默认locale（这是next-intl在某些情况下的行为）
  const actualLocale = locale || defaultLocale;
  console.log('Actual locale to use:', actualLocale);
  
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(actualLocale as any)) {
    console.log('Invalid locale, calling notFound()');
    notFound();
  }

  console.log('Loading messages for locale:', actualLocale);
  const messages = (await import(`./messages/${actualLocale}.json`)).default;
  console.log('Messages loaded successfully');
  console.log('=== i18n getRequestConfig End ===\n');

  return {
    locale: actualLocale,
    messages
  };
});
