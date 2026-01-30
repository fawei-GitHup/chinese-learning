/**
 * SEO工具库统一导出
 * 
 * 使用示例：
 * import { generateBreadcrumb, generatePageMetadata } from '@/lib/seo';
 */

// ============ 类型定义 ============
export type {
  BreadcrumbItem,
  ArticleStructuredData,
  FAQItem,
  DefinedTermData,
  HowToData,
  HowToStep,
  OrganizationData,
  WebSiteData,
  MetadataConfig,
} from './types';

// ============ 工具函数 ============
export {
  sanitizeText,
  truncate,
  buildUrl,
  formatDate,
  escapeJsonLd,
  isValidUrl,
  normalizePath,
  stripMarkdown,
} from './utils';

// ============ JSON-LD生成函数 ============
export {
  generateBreadcrumb,
  generateArticle,
  generateFAQ,
  generateDefinedTerm,
  generateHowTo,
  generateOrganization,
  generateWebSite,
  renderJsonLd,
  renderMultipleJsonLd,
} from './structured-data';

// ============ Metadata生成函数 ============
export {
  generatePageMetadata,
  generateHomeMetadata,
  generateListMetadata,
  generateDetailMetadata,
  generateErrorMetadata,
  generateDynamicMetadata,
} from './metadata';
