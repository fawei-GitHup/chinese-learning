/**
 * GEO数据 - 城市专题页配置
 * 用于生成城市专属的医疗中文学习内容落地页
 */

export interface CityData {
  slug: string;
  name: {
    zh: string;
    en: string;
  };
  description: {
    zh: string;
    en: string;
  };
  // 城市关键词，用于内容筛选
  keywords: string[];
  // 城市特色场景
  featuredScenarios: string[];
  // 推荐词汇主题
  vocabularyTopics: string[];
  // SEO相关
  metaDescription: {
    zh: string;
    en: string;
  };
  // 地理位置信息（用于结构化数据）
  location: {
    latitude: number;
    longitude: number;
  };
}

export const CITIES: Record<string, CityData> = {
  beijing: {
    slug: 'beijing',
    name: {
      zh: '北京',
      en: 'Beijing',
    },
    description: {
      zh: '北京医疗中文学习资源 - 在首都学习专业的医疗汉语',
      en: 'Beijing Medical Chinese Learning - Professional medical Chinese in the capital',
    },
    keywords: ['北京', 'beijing', '首都', '协和', '北医'],
    featuredScenarios: ['hospital', 'emergency', 'clinic'],
    vocabularyTopics: ['symptoms', 'diagnosis', 'treatment'],
    metaDescription: {
      zh: '北京医疗中文学习资源，为在北京工作的医疗专业人士提供专业的医疗汉语词汇、场景对话和学习建议。',
      en: 'Beijing medical Chinese learning resources for healthcare professionals working in Beijing.',
    },
    location: {
      latitude: 39.9042,
      longitude: 116.4074,
    },
  },
  shanghai: {
    slug: 'shanghai',
    name: {
      zh: '上海',
      en: 'Shanghai',
    },
    description: {
      zh: '上海医疗中文学习资源 - 在国际都市学习医疗汉语',
      en: 'Shanghai Medical Chinese Learning - Medical Chinese in the international metropolis',
    },
    keywords: ['上海', 'shanghai', '华山', '瑞金', '中山'],
    featuredScenarios: ['hospital', 'clinic', 'pharmacy'],
    vocabularyTopics: ['symptoms', 'examination', 'medication'],
    metaDescription: {
      zh: '上海医疗中文学习资源，为在上海工作的医疗专业人士提供专业的医疗汉语词汇、场景对话和学习建议。',
      en: 'Shanghai medical Chinese learning resources for healthcare professionals working in Shanghai.',
    },
    location: {
      latitude: 31.2304,
      longitude: 121.4737,
    },
  },
  guangzhou: {
    slug: 'guangzhou',
    name: {
      zh: '广州',
      en: 'Guangzhou',
    },
    description: {
      zh: '广州医疗中文学习资源 - 在南方中心城市学习医疗汉语',
      en: 'Guangzhou Medical Chinese Learning - Medical Chinese in southern China',
    },
    keywords: ['广州', 'guangzhou', '中山', '南方医院'],
    featuredScenarios: ['hospital', 'emergency', 'outpatient'],
    vocabularyTopics: ['symptoms', 'diagnosis', 'prescription'],
    metaDescription: {
      zh: '广州医疗中文学习资源，为在广州工作的医疗专业人士提供专业的医疗汉语词汇、场景对话和学习建议。',
      en: 'Guangzhou medical Chinese learning resources for healthcare professionals working in Guangzhou.',
    },
    location: {
      latitude: 23.1291,
      longitude: 113.2644,
    },
  },
  shenzhen: {
    slug: 'shenzhen',
    name: {
      zh: '深圳',
      en: 'Shenzhen',
    },
    description: {
      zh: '深圳医疗中文学习资源 - 在创新之城学习医疗汉语',
      en: 'Shenzhen Medical Chinese Learning - Medical Chinese in the innovation hub',
    },
    keywords: ['深圳', 'shenzhen', '港大深圳医院'],
    featuredScenarios: ['hospital', 'clinic', 'telemedicine'],
    vocabularyTopics: ['symptoms', 'technology', 'treatment'],
    metaDescription: {
      zh: '深圳医疗中文学习资源，为在深圳工作的医疗专业人士提供专业的医疗汉语词汇、场景对话和学习建议。',
      en: 'Shenzhen medical Chinese learning resources for healthcare professionals working in Shenzhen.',
    },
    location: {
      latitude: 22.5431,
      longitude: 114.0579,
    },
  },
  chengdu: {
    slug: 'chengdu',
    name: {
      zh: '成都',
      en: 'Chengdu',
    },
    description: {
      zh: '成都医疗中文学习资源 - 在西南重镇学习医疗汉语',
      en: 'Chengdu Medical Chinese Learning - Medical Chinese in southwest China',
    },
    keywords: ['成都', 'chengdu', '华西', '四川大学'],
    featuredScenarios: ['hospital', 'emergency', 'traditional'],
    vocabularyTopics: ['symptoms', 'tcm', 'treatment'],
    metaDescription: {
      zh: '成都医疗中文学习资源，为在成都工作的医疗专业人士提供专业的医疗汉语词汇、场景对话和学习建议。',
      en: 'Chengdu medical Chinese learning resources for healthcare professionals working in Chengdu.',
    },
    location: {
      latitude: 30.5728,
      longitude: 104.0668,
    },
  },
  hangzhou: {
    slug: 'hangzhou',
    name: {
      zh: '杭州',
      en: 'Hangzhou',
    },
    description: {
      zh: '杭州医疗中文学习资源 - 在数字医疗前沿城市学习医疗汉语',
      en: 'Hangzhou Medical Chinese Learning - Medical Chinese in the digital healthcare hub',
    },
    keywords: ['杭州', 'hangzhou', '浙一', '浙二'],
    featuredScenarios: ['hospital', 'clinic', 'digital'],
    vocabularyTopics: ['symptoms', 'diagnosis', 'digital-health'],
    metaDescription: {
      zh: '杭州医疗中文学习资源，为在杭州工作的医疗专业人士提供专业的医疗汉语词汇、场景对话和学习建议。',
      en: 'Hangzhou medical Chinese learning resources for healthcare professionals working in Hangzhou.',
    },
    location: {
      latitude: 30.2741,
      longitude: 120.1551,
    },
  },
  wuhan: {
    slug: 'wuhan',
    name: {
      zh: '武汉',
      en: 'Wuhan',
    },
    description: {
      zh: '武汉医疗中文学习资源 - 在中部医疗中心学习医疗汉语',
      en: 'Wuhan Medical Chinese Learning - Medical Chinese in central China medical hub',
    },
    keywords: ['武汉', 'wuhan', '同济', '协和'],
    featuredScenarios: ['hospital', 'emergency', 'research'],
    vocabularyTopics: ['symptoms', 'infectious', 'treatment'],
    metaDescription: {
      zh: '武汉医疗中文学习资源，为在武汉工作的医疗专业人士提供专业的医疗汉语词汇、场景对话和学习建议。',
      en: 'Wuhan medical Chinese learning resources for healthcare professionals working in Wuhan.',
    },
    location: {
      latitude: 30.5928,
      longitude: 114.3055,
    },
  },
  xian: {
    slug: 'xian',
    name: {
      zh: '西安',
      en: "Xi'an",
    },
    description: {
      zh: '西安医疗中文学习资源 - 在古都学习医疗汉语',
      en: "Xi'an Medical Chinese Learning - Medical Chinese in the ancient capital",
    },
    keywords: ['西安', 'xian', '交大', '西京'],
    featuredScenarios: ['hospital', 'clinic', 'traditional'],
    vocabularyTopics: ['symptoms', 'diagnosis', 'tcm'],
    metaDescription: {
      zh: '西安医疗中文学习资源，为在西安工作的医疗专业人士提供专业的医疗汉语词汇、场景对话和学习建议。',
      en: "Xi'an medical Chinese learning resources for healthcare professionals working in Xi'an.",
    },
    location: {
      latitude: 34.3416,
      longitude: 108.9398,
    },
  },
};

// 获取所有城市slug列表
export function getAllCitySlugs(): string[] {
  return Object.keys(CITIES);
}

// 根据slug获取城市数据
export function getCityBySlug(slug: string): CityData | undefined {
  return CITIES[slug];
}

// 获取所有城市数据
export function getAllCities(): CityData[] {
  return Object.values(CITIES);
}
