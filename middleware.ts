import createIntlMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { locales, defaultLocale } from './i18n';

//创建 next-intl 中间件 - 所有语言都带前缀
const handleI18nRouting = createIntlMiddleware({
  locales: locales as unknown as string[],
  defaultLocale,
  localePrefix: 'always', // 所有语言都显示前缀
  localeDetection: true, // 启用locale检测
});

/**
 * 组合的中间件：处理 i18n 和认证
 */
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  console.log('=== Middleware Debug ===');
  console.log('Request URL:', request.url);
  console.log('Pathname:', pathname);

  // 学习区保护的路径（不含locale前缀）
  const protectedPaths = [
    '/dashboard',
    '/account',
    '/dictionary',
    '/grammar',
    '/lesson',
    '/lessons',
    '/medical-reader',
    '/path',
    '/placement',
    '/reader',
    '/search',
    '/srs',
  ];

  // 提取pathname中去除locale前缀后的路径
  // pathname格式: /zh-CN/xxx 或 /en/xxx
  const pathnameWithoutLocale = pathname.replace(/^\/(zh-CN|en)(\/|$)/, '$2');
  console.log('Pathname without locale:', pathnameWithoutLocale);

  // 检查当前路径是否需要认证（学习区）
  const isProtectedPath = protectedPaths.some(path => 
    pathnameWithoutLocale === path.slice(1) || // 匹配根路径如 "/dashboard" -> "dashboard"
    pathnameWithoutLocale.startsWith(path.slice(1) + '/') // 匹配子路径
  );
  console.log('Is protected path:', isProtectedPath);

  // 如果是学习区，进行认证检查
  if (isProtectedPath) {
    console.log('Processing protected path - checking authentication...');
    const response = handleI18nRouting(request);
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll: (cookies) => {
            cookies.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    const { data: { session } } = await supabase.auth.getSession();
    console.log('Session exists:', !!session);

    if (!session) {
      // 提取locale
      const localeMatch = pathname.match(/^\/(zh-CN|en)/);
      const locale = localeMatch ? localeMatch[1] : defaultLocale;
      
      const loginUrl = new URL(`/${locale}/login`, request.url);
      loginUrl.searchParams.set('redirect', pathname);
      console.log('Redirecting to login:', loginUrl.toString());
      return NextResponse.redirect(loginUrl);
    }

    console.log('Auth check passed, returning response');
    return response;
  }

  // 对于营销区和其他所有路径，使用 next-intl 中间件
  console.log('Processing marketing/public path - using i18n routing');
  const i18nResponse = handleI18nRouting(request);
  console.log('i18n routing completed');
  console.log('=== Middleware End ===\n');
  return i18nResponse;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_vercel).*)',
  ],
};
