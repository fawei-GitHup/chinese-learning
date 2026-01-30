/**
 * SEO辅助工具函数
 */

/**
 * 清理HTML标签和特殊字符
 * @param text - 待清理的文本
 * @returns 清理后的纯文本
 */
export function sanitizeText(text: string): string {
  if (!text) return '';
  
  return text
    .replace(/<[^>]*>/g, '') // 移除HTML标签
    .replace(/\s+/g, ' ')     // 规范化空格
    .replace(/["""]/g, '"')   // 统一引号
    .replace(/['']/g, "'")    // 统一单引号
    .replace(/\r?\n/g, ' ')   // 移除换行符
    .trim();
}

/**
 * 截断文本到指定长度
 * @param text - 待截断的文本
 * @param maxLength - 最大长度
 * @param ellipsis - 省略号（默认"..."）
 * @returns 截断后的文本
 */
export function truncate(
  text: string,
  maxLength: number,
  ellipsis: string = '...'
): string {
  const clean = sanitizeText(text);
  if (clean.length <= maxLength) return clean;
  
  return clean.substring(0, maxLength - ellipsis.length).trim() + ellipsis;
}

/**
 * 构建完整URL
 * @param path - 相对路径（如"/medical/vocabulary"）
 * @param baseUrl - 基础URL（可选，未提供时从环境变量读取）
 * @returns 完整的URL
 */
export function buildUrl(path: string, baseUrl?: string): string {
  const base = 
    baseUrl || 
    process.env.NEXT_PUBLIC_SITE_URL || 
    'https://learnchinesemedical.com';
  
  // 规范化路径
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  // 移除base的尾部斜杠
  const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base;
  
  return `${normalizedBase}${normalizedPath}`;
}

/**
 * 格式化日期为ISO 8601标准格式
 * @param date - Date对象或日期字符串
 * @returns ISO 8601格式的日期字符串
 */
export function formatDate(date: Date | string): string {
  return new Date(date).toISOString();
}

/**
 * 转义JSON-LD中的特殊字符
 * @param text - 待转义的文本
 * @returns 转义后的文本
 */
export function escapeJsonLd(text: string): string {
  return text
    .replace(/\\/g, '\\\\')  // 反斜杠
    .replace(/"/g, '\\"')     // 双引号
    .replace(/\n/g, '\\n')    // 换行
    .replace(/\r/g, '\\r')    // 回车
    .replace(/\t/g, '\\t');   // 制表符
}

/**
 * 验证URL格式
 * @param url - 待验证的URL
 * @returns 是否为有效URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * 规范化URL路径（移除重复斜杠、尾部斜杠等）
 * @param path - URL路径
 * @returns 规范化后的路径
 */
export function normalizePath(path: string): string {
  return path
    .replace(/\/+/g, '/')      // 移除重复斜杠
    .replace(/\/$/, '')        // 移除尾部斜杠
    .replace(/^([^/])/, '/$1'); // 确保开头有斜杠
}

/**
 * 从文本中提取纯文本（移除Markdown语法）
 * @param markdown - Markdown文本
 * @returns 纯文本
 */
export function stripMarkdown(markdown: string): string {
  return markdown
    // 移除标题标记
    .replace(/^#+\s+/gm, '')
    // 移除粗体/斜体
    .replace(/[*_]{1,2}([^*_]+)[*_]{1,2}/g, '$1')
    // 移除链接
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // 移除代码块
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    // 移除列表标记
    .replace(/^[-*+]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    // 规范化空白
    .replace(/\n{2,}/g, '\n')
    .trim();
}
