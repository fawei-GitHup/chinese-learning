import createIntlMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { locales, defaultLocale } from './i18n';

//创建 next-intl 中间件 - 所有语言都带前缀
const handleI18nRouting = createIntlMiddleware({
  locales: locales as unknown as string[],
  defaultLocale,
  localePrefix: 'always', // 所有语言都显示前缀
});

/**
 * 组合的中间件：处理 i18n 和认证
 */
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 学习区保护的路径
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

  // 检查当前路径是否需要认证（学习区）
  const isProtectedPath = protectedPaths.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  );

  // 如果是学习区，进行认证检查
  if (isProtectedPath) {
    const response = NextResponse.next();
    
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

    if (!session) {
      const loginUrl = new URL('/zh-CN/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    return response;
  }

  // 对于营销区，使用 next-intl 中间件
  return handleI18nRouting(request);
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_vercel).*)',
  ],
};
