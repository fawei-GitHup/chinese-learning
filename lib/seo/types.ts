/**
 * SEO结构化数据类型定义
 * 遵循Schema.org标准
 */

/**
 * 面包屑导航项
 */
export interface BreadcrumbItem {
  /** 导航项名称 */
  name: string;
  /** 导航项URL路径 */
  url: string;
}

/**
 * Article结构化数据参数
 * 适用于：课程、阅读内容、医疗文章
 */
export interface ArticleStructuredData {
  /** 文章标题 */
  title: string;
  /** 文章描述 */
  description: string;
  /** 文章URL路径 */
  url: string;
  /** 文章封面图URL（可选） */
  imageUrl?: string;
  /** 发布日期 */
  datePublished: Date | string;
  /** 最后修改日期（可选，未提供时使用发布日期） */
  dateModified?: Date | string;
  /** 作者姓名（可选） */
  authorName?: string;
  /** 关键词列表（可选） */
  keywords?: string[];
}

/**
 * FAQ问答项
 */
export interface FAQItem {
  /** 问题 */
  question: string;
  /** 答案 */
  answer: string;
}

/**
 * DefinedTerm结构化数据参数
 * 适用于：医疗词汇、语法点定义
 */
export interface DefinedTermData {
  /** 术语/词汇 */
  term: string;
  /** 定义/解释 */
  definition: string;
  /** 所属术语集（可选），如"HSK Level 4"、"Medical Vocabulary" */
  inDefinedTermSet?: string;
  /** 术语代码（可选），如ICD编码、HSK编号等 */
  termCode?: string;
}

/**
 * HowTo步骤
 */
export interface HowToStep {
  /** 步骤名称 */
  name: string;
  /** 步骤详细说明 */
  text: string;
  /** 步骤详情页URL（可选） */
  url?: string;
  /** 步骤图片（可选） */
  image?: string;
}

/**
 * HowTo结构化数据参数
 * 适用于：场景对话步骤、操作教程
 */
export interface HowToData {
  /** 标题 */
  name: string;
  /** 描述 */
  description: string;
  /** 步骤列表 */
  steps: HowToStep[];
  /** 总耗时（可选），ISO 8601格式，如"PT30M"表示30分钟 */
  totalTime?: string;
}

/**
 * Organization结构化数据参数
 * 适用于：首页组织信息
 */
export interface OrganizationData {
  /** 组织名称 */
  name: string;
  /** 组织官网URL */
  url: string;
  /** 组织Logo URL（可选） */
  logo?: string;
  /** 组织描述（可选） */
  description?: string;
  /** 社交媒体链接列表（可选） */
  sameAs?: string[];
}

/**
 * WebSite结构化数据参数
 * 适用于：首页网站信息
 */
export interface WebSiteData {
  /** 网站名称 */
  name: string;
  /** 网站URL */
  url: string;
  /** 网站描述（可选） */
  description?: string;
  /** 搜索URL模板（可选），如"/search?q={search_term_string}" */
  searchUrl?: string;
}

/**
 * Next.js Metadata配置参数
 */
export interface MetadataConfig {
  /** 页面标题 */
  title: string;
  /** 页面描述 */
  description: string;
  /** 页面路径（相对路径） */
  path: string;
  /** Open Graph图片URL（可选） */
  imageUrl?: string;
  /** SEO关键词列表（可选） */
  keywords?: string[];
  /** 是否禁止索引（可选，默认false） */
  noindex?: boolean;
  /** 结构化数据列表（可选） */
  structuredData?: object[];
}
