import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MapPin, BookOpen, MessageSquare, GraduationCap, ArrowRight } from 'lucide-react';
import {
  getCityBySlug,
  getAllCitySlugs,
  type CityData,
} from '@/lib/geo-data';
import { medicalLexicon, medicalScenarios, type MedicalWord, type MedicalScenario } from '@/lib/medical-mock';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

interface CityPageProps {
  params: {
    city: string;
    locale: string;
  };
}

// 生成静态params
export async function generateStaticParams() {
  const citySlugs = getAllCitySlugs();
  const locales = ['zh', 'en'];

  return locales.flatMap((locale) =>
    citySlugs.map((city) => ({
      locale,
      city,
    }))
  );
}

// 生成动态metadata
export async function generateMetadata({
  params,
}: CityPageProps): Promise<Metadata> {
  const city = getCityBySlug(params.city);

  if (!city) {
    return {
      title: 'City Not Found',
    };
  }

  const isZh = params.locale === 'zh';
  const cityName = isZh ? city.name.zh : city.name.en;
  const description = isZh ? city.metaDescription.zh : city.metaDescription.en;
  const title = isZh
    ? `${cityName}医疗中文学习 | 医疗汉语专业培训`
    : `${cityName} Medical Chinese Learning | Professional Training`;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';
  const canonicalUrl = `${baseUrl}/${params.locale}/medical/city/${params.city}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'zh': `${baseUrl}/zh/medical/city/${params.city}`,
        'en': `${baseUrl}/en/medical/city/${params.city}`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Medical Chinese Learning',
      locale: params.locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function CityPage({ params }: CityPageProps) {
  const city = getCityBySlug(params.city);

  if (!city) {
    notFound();
  }

  const isZh = params.locale === 'zh';
  const cityName = isZh ? city.name.zh : city.name.en;
  const description = isZh ? city.description.zh : city.description.en;

  // 获取所有医疗词汇和场景
  const allVocabulary = medicalLexicon;
  const allScenarios = medicalScenarios;

  // 根据城市关键词筛选相关内容
  const cityVocabulary = allVocabulary.filter((vocab: MedicalWord) => {
    // 检查是否有geo_snippet字段匹配城市关键词
    const geoText = (vocab.geo_snippet || '').toLowerCase();
    const meaningText = vocab.meanings_en.join(' ').toLowerCase();
    return city.keywords.some((keyword) =>
      geoText.includes(keyword.toLowerCase()) || meaningText.includes(keyword.toLowerCase())
    );
  });

  // 如果没有匹配的geo内容，返回推荐的主题词汇
  const featuredVocabulary =
    cityVocabulary.length > 0
      ? cityVocabulary.slice(0, 12)
      : allVocabulary.slice(0, 12);

  // 根据城市特色场景筛选
  const cityScenarios = allScenarios.filter((scenario: MedicalScenario) =>
    city.featuredScenarios.includes(scenario.id)
  );

  const featuredScenarios =
    cityScenarios.length > 0
      ? cityScenarios.slice(0, 6)
      : allScenarios.slice(0, 6);

  // 结构化数据
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Place',
        name: cityName,
        geo: {
          '@type': 'GeoCoordinates',
          latitude: city.location.latitude,
          longitude: city.location.longitude,
        },
      },
      {
        '@type': 'CollectionPage',
        name: isZh
          ? `${cityName}医疗中文学习资源`
          : `${cityName} Medical Chinese Learning`,
        description: description,
        url: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/${params.locale}/medical/city/${params.city}`,
        inLanguage: params.locale,
        about: {
          '@type': 'EducationalOrganization',
          name: 'Medical Chinese Learning Platform',
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: isZh ? '首页' : 'Home',
            item: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/${params.locale}`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: isZh ? '医疗中文' : 'Medical Chinese',
            item: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/${params.locale}/medical`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: cityName,
            item: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/${params.locale}/medical/city/${params.city}`,
          },
        ],
      },
    ],
  };

  return (
    <>
      {/* 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* 面包屑导航 */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={`/${params.locale}`}>
                {isZh ? '首页' : 'Home'}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/${params.locale}/medical`}>
                {isZh ? '医疗中文' : 'Medical Chinese'}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{cityName}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* 城市标题区 */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold">{cityName}</h1>
          </div>
          <p className="text-xl text-muted-foreground mb-6">{description}</p>
          <div className="flex flex-wrap gap-2">
            {city.keywords.map((keyword) => (
              <Badge key={keyword} variant="secondary">
                {keyword}
              </Badge>
            ))}
          </div>
        </div>

        {/* 学习资源概览 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <BookOpen className="w-8 h-8 text-primary mb-2" />
              <CardTitle>
                {isZh ? '医疗词汇' : 'Medical Vocabulary'}
              </CardTitle>
              <CardDescription>
                {isZh
                  ? `精选${featuredVocabulary.length}+专业医疗词汇`
                  : `${featuredVocabulary.length}+ professional terms`}
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <MessageSquare className="w-8 h-8 text-primary mb-2" />
              <CardTitle>
                {isZh ? '场景对话' : 'Scenario Dialogues'}
              </CardTitle>
              <CardDescription>
                {isZh
                  ? `${featuredScenarios.length}+真实医疗场景`
                  : `${featuredScenarios.length}+ real scenarios`}
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <GraduationCap className="w-8 h-8 text-primary mb-2" />
              <CardTitle>
                {isZh ? '本地化学习' : 'Localized Learning'}
              </CardTitle>
              <CardDescription>
                {isZh
                  ? '针对本地医疗环境定制'
                  : 'Customized for local healthcare'}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* 推荐词汇 */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">
              {isZh ? '推荐医疗词汇' : 'Featured Vocabulary'}
            </h2>
            <Button asChild variant="outline">
              <Link href={`/${params.locale}/medical/vocabulary`}>
                {isZh ? '查看全部' : 'View All'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredVocabulary.map((vocab) => (
              <Card key={vocab.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl">{vocab.word}</CardTitle>
                  <CardDescription className="text-base">
                    {vocab.pinyin}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-3">
                    {vocab.meanings_en[0]}
                  </p>
                  <Button asChild variant="ghost" size="sm" className="w-full">
                    <Link
                      href={`/${params.locale}/medical/dictionary/${vocab.id}`}
                    >
                      {isZh ? '查看详情' : 'View Details'}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* 特色场景 */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">
              {isZh ? '本地医疗场景' : 'Local Medical Scenarios'}
            </h2>
            <Button asChild variant="outline">
              <Link href={`/${params.locale}/medical/scenarios`}>
                {isZh ? '查看全部' : 'View All'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredScenarios.map((scenario) => (
              <Card
                key={scenario.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <CardTitle>{isZh ? scenario.title_zh : scenario.title_en}</CardTitle>
                  <CardDescription>{scenario.level}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {isZh ? scenario.chief_complaint_zh : scenario.chief_complaint_en}
                  </p>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link
                      href={`/${params.locale}/medical/scenarios/${scenario.id}`}
                    >
                      {isZh ? '学习场景' : 'Learn Scenario'}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* 学习建议 */}
        <section className="mb-12">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
            <CardHeader>
              <CardTitle className="text-2xl">
                {isZh
                  ? `为什么选择在${cityName}学习医疗中文？`
                  : `Why Learn Medical Chinese in ${cityName}?`}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">
                  {isZh ? '🏥 本地化内容' : '🏥 Localized Content'}
                </h3>
                <p className="text-muted-foreground">
                  {isZh
                    ? `针对${cityName}医疗系统特点定制的学习内容，包括当地常见的医疗术语和表达方式。`
                    : `Content tailored to ${cityName}'s healthcare system, including local medical terminology and expressions.`}
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">
                  {isZh ? '💬 实用场景对话' : '💬 Practical Dialogues'}
                </h3>
                <p className="text-muted-foreground">
                  {isZh
                    ? `基于${cityName}实际医疗环境的真实对话场景，帮助您快速适应本地工作。`
                    : `Real dialogue scenarios based on ${cityName}'s healthcare environment to help you adapt quickly.`}
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">
                  {isZh ? '📚 系统化学习路径' : '📚 Structured Learning Path'}
                </h3>
                <p className="text-muted-foreground">
                  {isZh
                    ? '从基础词汇到复杂场景，循序渐进的学习体系帮助您建立完整的医疗中文能力。'
                    : 'From basic vocabulary to complex scenarios, a progressive system to build comprehensive medical Chinese skills.'}
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA区域 */}
        <section className="text-center">
          <Card className="bg-primary text-primary-foreground">
            <CardHeader>
              <CardTitle className="text-3xl">
                {isZh ? '开始学习' : 'Start Learning'}
              </CardTitle>
              <CardDescription className="text-primary-foreground/80 text-lg">
                {isZh
                  ? `立即开始您在${cityName}的医疗中文学习之旅`
                  : `Begin your medical Chinese learning journey in ${cityName}`}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" variant="secondary">
                  <Link href={`/${params.locale}/medical/vocabulary`}>
                    {isZh ? '浏览词汇库' : 'Browse Vocabulary'}
                  </Link>
                </Button>
                <Button asChild size="lg" variant="secondary">
                  <Link href={`/${params.locale}/medical/scenarios`}>
                    {isZh ? '学习场景' : 'Learn Scenarios'}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </>
  );
}
