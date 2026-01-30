"use client"

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { locales, type Locale } from '@/i18n';
import { Languages } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const languageNames: Record<Locale, string> = {
  'zh-CN': '简体中文',
  'en': 'English',
};

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: Locale) => {
    // 移除当前 locale 前缀（如果有）
    let newPath = pathname;
    for (const loc of locales) {
      if (pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`) {
        newPath = pathname.replace(`/${loc}`, '');
        break;
      }
    }

    // 确保路径以 / 开头
    if (!newPath.startsWith('/')) {
      newPath = '/' + newPath;
    }

    // 如果是默认语言（zh-CN），不添加前缀
    if (newLocale === 'zh-CN') {
      router.push(newPath || '/');
    } else {
      router.push(`/${newLocale}${newPath}`);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-400 hover:bg-white/[0.06] hover:text-white transition-colors">
          <Languages className="h-4 w-4" />
          <span className="hidden sm:inline">{languageNames[locale]}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((loc) => (
          <DropdownMenuItem
            key={loc}
            onClick={() => switchLocale(loc)}
            className={loc === locale ? 'bg-white/[0.06]' : ''}
          >
            {languageNames[loc]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
