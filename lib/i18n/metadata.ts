import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { locales, defaultLocale, type Locale } from '@/i18n';

type MetadataParams = {
  locale: Locale;
  path?: string;
};

/**
 * 生成包含 hreflang 和 SEO 信息的 Metadata
 */
export async function generateI18nMetadata({
  locale,
  path = '',
}: MetadataParams): Promise<Metadata> {
  const t = await getTranslations({ locale });
  
  // 基础 URL（生产环境需要替换）
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://learn-chinese.example.com';
  
  // 当前页面的完整 URL
  const currentPath = path.startsWith('/') ? path : `/${path}`;
  const isDefaultLocale = locale === defaultLocale;
  const currentUrl = isDefaultLocale 
    ? `${baseUrl}${currentPath}`
    : `${baseUrl}/${locale}${currentPath}`;
  
  // 生成所有语言版本的 alternate links
  const alternateLanguages: Record<string, string> = {};
  
  locales.forEach((loc) => {
    if (loc === defaultLocale) {
      alternateLanguages[loc] = `${baseUrl}${currentPath}`;
    } else {
      alternateLanguages[loc] = `${baseUrl}/${loc}${currentPath}`;
    }
  });
  
  // x-default 指向默认语言
  alternateLanguages['x-default'] = `${baseUrl}${currentPath}`;

  return {
    alternates: {
      canonical: currentUrl,
      languages: alternateLanguages,
    },
    openGraph: {
      url: currentUrl,
      locale: locale,
      alternateLocale: locales.filter(l => l !== locale),
    },
  };
}

/**
 * 为营销页面生成 metadata
 */
export async function generateMarketingMetadata(
  locale: Locale,
  pagePath: string,
  overrides?: Partial<Metadata>
): Promise<Metadata> {
  const baseMetadata = await generateI18nMetadata({ locale, path: pagePath });
  const t = await getTranslations({ locale });
  
  return {
    ...baseMetadata,
    title: overrides?.title || t('nav.home'),
    description: overrides?.description || t('hero.subtitle'),
    ...overrides,
  };
}
