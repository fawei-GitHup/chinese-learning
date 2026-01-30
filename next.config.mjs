import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // TypeScript配置 - 生产环境建议修改为false
  typescript: {
    ignoreBuildErrors: true,  // TODO: 生产环境建议改为 false
  },
  
  // 图片优化 - Vercel支持自动图片优化
  images: {
    unoptimized: true,  // Vercel上可以改为false以启用图片优化
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'aljoaouzfncbhquaufik.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  
  // 生产环境优化
  reactStrictMode: true,
  
  // Vercel Analytics集成（已安装依赖）
  // 无需额外配置，自动启用
}

export default withNextIntl(nextConfig);
