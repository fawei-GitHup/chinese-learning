import { redirect } from 'next/navigation';
import { defaultLocale } from '@/i18n';

/**
 * 根路由重定向到默认语言
 * 由于使用 next-intl 且 localePrefix: 'always'，所有页面都需要语言前缀
 */
export default function RootPage() {
  redirect(`/${defaultLocale}`);
}
