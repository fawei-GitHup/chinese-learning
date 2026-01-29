// Mock data for Learn Chinese web app

export const mockUser = {
  name: "Alex Chen",
  level: "HSK3" as const,
  streakDays: 42,
  goalMinutesPerDay: 30,
  avatar: null,
}

export const mockKpis = {
  todayMinutes: 18,
  wordsDue: 24,
  lessonsDoneThisWeek: 5,
  readingDoneThisWeek: 3,
}

export type TaskType = "lesson" | "reader" | "srs"
export type TaskStatus = "todo" | "done"

export interface DailyTask {
  id: string
  type: TaskType
  title: string
  etaMin: number
  status: TaskStatus
}

export const mockDailyPlan = {
  tasks: [
    { id: "t1", type: "lesson" as TaskType, title: "Shopping Vocabulary", etaMin: 15, status: "done" as TaskStatus },
    { id: "t2", type: "srs" as TaskType, title: "Review 24 Due Words", etaMin: 10, status: "todo" as TaskStatus },
    { id: "t3", type: "reader" as TaskType, title: "The Lost Umbrella", etaMin: 12, status: "todo" as TaskStatus },
    { id: "t4", type: "lesson" as TaskType, title: "Direction Words", etaMin: 15, status: "todo" as TaskStatus },
  ],
}

export interface FeaturedLesson {
  id: string
  title: string
  level: string
  durationMin: number
  tags: string[]
}

export const mockFeaturedLessons: FeaturedLesson[] = [
  { id: "l1", title: "Greetings & Introductions", level: "HSK1", durationMin: 20, tags: ["Speaking", "Basics"] },
  { id: "l2", title: "Numbers & Counting", level: "HSK1", durationMin: 15, tags: ["Numbers", "Basics"] },
  { id: "l3", title: "Shopping Dialogue", level: "HSK2", durationMin: 25, tags: ["Dialogue", "Practical"] },
  { id: "l4", title: "Restaurant Ordering", level: "HSK2", durationMin: 20, tags: ["Food", "Dialogue"] },
  { id: "l5", title: "Travel Conversations", level: "HSK3", durationMin: 30, tags: ["Travel", "Advanced"] },
  { id: "l6", title: "Business Chinese Basics", level: "HSK4", durationMin: 35, tags: ["Business", "Formal"] },
  { id: "l7", title: "Chinese Idioms (Chengyu)", level: "HSK5", durationMin: 40, tags: ["Culture", "Advanced"] },
  { id: "l8", title: "News & Current Events", level: "HSK6", durationMin: 45, tags: ["Reading", "Advanced"] },
]

export interface FeaturedReader {
  id: string
  title: string
  level: string
  wordCount: number
  tags: string[]
}

export const mockFeaturedReaders: FeaturedReader[] = [
  { id: "r1", title: "The Lost Umbrella", level: "HSK2", wordCount: 320, tags: ["Story", "Daily Life"] },
  { id: "r2", title: "A Day at the Market", level: "HSK1", wordCount: 180, tags: ["Shopping", "Beginner"] },
  { id: "r3", title: "The Clever Farmer", level: "HSK3", wordCount: 450, tags: ["Folklore", "Culture"] },
  { id: "r4", title: "Modern Beijing", level: "HSK4", wordCount: 680, tags: ["Travel", "City"] },
  { id: "r5", title: "The Tea Ceremony", level: "HSK3", wordCount: 520, tags: ["Culture", "Tradition"] },
  { id: "r6", title: "Technology in China", level: "HSK5", wordCount: 850, tags: ["Tech", "Modern"] },
  { id: "r7", title: "Ancient Poetry Collection", level: "HSK6", wordCount: 400, tags: ["Poetry", "Classical"] },
  { id: "r8", title: "My First Job Interview", level: "HSK4", wordCount: 600, tags: ["Business", "Career"] },
]

export interface RecentActivity {
  id: string
  type: "lesson" | "reader" | "srs" | "test"
  title: string
  time: string
  result: string
}

export const mockRecentActivity: RecentActivity[] = [
  { id: "a1", type: "lesson", title: "Shopping Vocabulary", time: "2 hours ago", result: "Completed" },
  { id: "a2", type: "srs", title: "Daily Review", time: "3 hours ago", result: "18/20 correct" },
  { id: "a3", type: "reader", title: "The Tea Ceremony", time: "Yesterday", result: "Read 520 words" },
  { id: "a4", type: "lesson", title: "Direction Words", time: "Yesterday", result: "In Progress" },
  { id: "a5", type: "test", title: "HSK3 Practice Test", time: "2 days ago", result: "Score: 85%" },
  { id: "a6", type: "srs", title: "Weekly Review", time: "2 days ago", result: "42/50 correct" },
  { id: "a7", type: "reader", title: "Modern Beijing", time: "3 days ago", result: "Read 680 words" },
  { id: "a8", type: "lesson", title: "Travel Conversations", time: "4 days ago", result: "Completed" },
  { id: "a9", type: "srs", title: "Difficult Words", time: "5 days ago", result: "15/15 correct" },
  { id: "a10", type: "reader", title: "The Clever Farmer", time: "1 week ago", result: "Read 450 words" },
]

export const mockReaderPreview = {
  title: "The Lost Umbrella",
  content: [
    { text: "今天", pinyin: "jīntiān", meaning: "today", isHighlighted: true },
    { text: "下雨", pinyin: "xià yǔ", meaning: "to rain", isHighlighted: false },
    { text: "了", pinyin: "le", meaning: "(particle)", isHighlighted: false },
    { text: "。", pinyin: "", meaning: "", isHighlighted: false },
    { text: "小明", pinyin: "Xiǎo Míng", meaning: "Xiao Ming (name)", isHighlighted: false },
    { text: "忘了", pinyin: "wàng le", meaning: "forgot", isHighlighted: true },
    { text: "带", pinyin: "dài", meaning: "to bring", isHighlighted: false },
    { text: "雨伞", pinyin: "yǔsǎn", meaning: "umbrella", isHighlighted: true },
    { text: "。", pinyin: "", meaning: "", isHighlighted: false },
  ],
}

export const mockDictionaryEntries = [
  { hanzi: "学习", pinyin: "xuéxí", meaning: "to study; to learn", level: "HSK1" },
  { hanzi: "中文", pinyin: "zhōngwén", meaning: "Chinese (language)", level: "HSK1" },
  { hanzi: "汉字", pinyin: "hànzì", meaning: "Chinese characters", level: "HSK2" },
  { hanzi: "语法", pinyin: "yǔfǎ", meaning: "grammar", level: "HSK3" },
  { hanzi: "词汇", pinyin: "cíhuì", meaning: "vocabulary", level: "HSK4" },
]

export const mockGrammarPoints = [
  { id: "g1", title: "是...的 Construction", level: "HSK2", category: "Sentence Structure" },
  { id: "g2", title: "把 Sentences", level: "HSK3", category: "Sentence Structure" },
  { id: "g3", title: "Comparison with 比", level: "HSK2", category: "Comparison" },
  { id: "g4", title: "Resultative Complements", level: "HSK3", category: "Complements" },
  { id: "g5", title: "Passive Voice with 被", level: "HSK4", category: "Sentence Structure" },
]

// ==================== PART 2: CORE LEARNING FLOW ====================

// Placement Test Questions
export interface PlacementQuestion {
  id: string
  type: "vocab" | "grammar" | "reading"
  question: string
  options: string[]
  answerIndex: number
  levelHint: string
}

export const placementQuestions: PlacementQuestion[] = [
  {
    id: "pq1",
    type: "vocab",
    question: "What does 你好 (nǐ hǎo) mean?",
    options: ["Goodbye", "Hello", "Thank you", "Sorry"],
    answerIndex: 1,
    levelHint: "HSK1",
  },
  {
    id: "pq2",
    type: "vocab",
    question: "Which word means 'to eat'?",
    options: ["喝 (hē)", "吃 (chī)", "看 (kàn)", "听 (tīng)"],
    answerIndex: 1,
    levelHint: "HSK1",
  },
  {
    id: "pq3",
    type: "vocab",
    question: "What does 经济 (jīngjì) mean?",
    options: ["Politics", "Economy", "Science", "Culture"],
    answerIndex: 1,
    levelHint: "HSK4",
  },
  {
    id: "pq4",
    type: "grammar",
    question: "Which sentence correctly uses 了 to indicate completion?",
    options: ["我吃了饭", "我了吃饭", "我饭吃了", "了我吃饭"],
    answerIndex: 0,
    levelHint: "HSK2",
  },
  {
    id: "pq5",
    type: "grammar",
    question: "How do you form a comparison using 比?",
    options: ["A 比 B + Adj", "比 A B + Adj", "A B 比 + Adj", "A + Adj 比 B"],
    answerIndex: 0,
    levelHint: "HSK3",
  },
  {
    id: "pq6",
    type: "grammar",
    question: "Which is the correct 把 sentence structure?",
    options: [
      "我把书放在桌子上",
      "我放把书在桌子上",
      "把我书放在桌子上",
      "我书把放在桌子上",
    ],
    answerIndex: 0,
    levelHint: "HSK3",
  },
  {
    id: "pq7",
    type: "reading",
    question:
      "Read: 昨天我去了商店，买了一些水果。今天我想在家休息。What did the speaker do yesterday?",
    options: [
      "Stayed home",
      "Went to the store",
      "Ate fruit",
      "Went to work",
    ],
    answerIndex: 1,
    levelHint: "HSK2",
  },
  {
    id: "pq8",
    type: "reading",
    question:
      "Read: 虽然今天天气不好，但是我还是决定去跑步。因为健康比什么都重要。What is most important to the speaker?",
    options: ["Weather", "Running", "Health", "Rest"],
    answerIndex: 2,
    levelHint: "HSK4",
  },
]

// Learning Path Data
export type HSKLevel = "HSK1" | "HSK2" | "HSK3" | "HSK4" | "HSK5" | "HSK6"

export interface Milestone {
  id: string
  title: string
  description: string
  isCompleted: boolean
}

export interface PathLevel {
  level: HSKLevel
  title: string
  description: string
  milestones: Milestone[]
}

export const pathLevels: PathLevel[] = [
  {
    level: "HSK1",
    title: "Beginner",
    description: "Master 150 essential words and basic sentence structures",
    milestones: [
      { id: "m1-1", title: "Basic Greetings", description: "Learn to say hello, goodbye, and introduce yourself", isCompleted: true },
      { id: "m1-2", title: "Numbers & Time", description: "Count from 1-100 and tell time", isCompleted: true },
      { id: "m1-3", title: "Family & People", description: "Describe family members and relationships", isCompleted: false },
      { id: "m1-4", title: "Daily Activities", description: "Talk about daily routines and activities", isCompleted: false },
    ],
  },
  {
    level: "HSK2",
    title: "Elementary",
    description: "Expand to 300 words with practical conversational skills",
    milestones: [
      { id: "m2-1", title: "Shopping & Money", description: "Navigate stores and handle transactions", isCompleted: true },
      { id: "m2-2", title: "Transportation", description: "Ask for directions and use public transit", isCompleted: false },
      { id: "m2-3", title: "Food & Dining", description: "Order at restaurants and discuss food", isCompleted: false },
      { id: "m2-4", title: "Weather & Seasons", description: "Describe weather and seasonal activities", isCompleted: false },
    ],
  },
  {
    level: "HSK3",
    title: "Intermediate",
    description: "Build fluency with 600 words and complex grammar",
    milestones: [
      { id: "m3-1", title: "Travel & Places", description: "Plan trips and describe locations", isCompleted: false },
      { id: "m3-2", title: "Health & Body", description: "Discuss health, see a doctor", isCompleted: false },
      { id: "m3-3", title: "Work & Career", description: "Talk about jobs and workplace", isCompleted: false },
      { id: "m3-4", title: "Hobbies & Interests", description: "Express preferences and activities", isCompleted: false },
    ],
  },
  {
    level: "HSK4",
    title: "Upper Intermediate",
    description: "Master 1200 words for fluent daily communication",
    milestones: [
      { id: "m4-1", title: "News & Media", description: "Understand news and current events", isCompleted: false },
      { id: "m4-2", title: "Culture & Society", description: "Discuss cultural topics", isCompleted: false },
      { id: "m4-3", title: "Education & Learning", description: "Academic vocabulary and discussions", isCompleted: false },
      { id: "m4-4", title: "Emotions & Opinions", description: "Express complex feelings and views", isCompleted: false },
    ],
  },
  {
    level: "HSK5",
    title: "Advanced",
    description: "2500 words for professional and academic contexts",
    milestones: [
      { id: "m5-1", title: "Business Chinese", description: "Professional communication", isCompleted: false },
      { id: "m5-2", title: "Literature & Arts", description: "Appreciate Chinese literature", isCompleted: false },
      { id: "m5-3", title: "Science & Technology", description: "Technical vocabulary", isCompleted: false },
      { id: "m5-4", title: "Philosophy & History", description: "Discuss abstract concepts", isCompleted: false },
    ],
  },
  {
    level: "HSK6",
    title: "Mastery",
    description: "5000+ words for near-native proficiency",
    milestones: [
      { id: "m6-1", title: "Classical Chinese", description: "Read classical texts", isCompleted: false },
      { id: "m6-2", title: "Idioms & Proverbs", description: "Master chengyu and sayings", isCompleted: false },
      { id: "m6-3", title: "Academic Writing", description: "Formal written Chinese", isCompleted: false },
      { id: "m6-4", title: "Native Media", description: "Understand native content", isCompleted: false },
    ],
  },
]

// Lessons by Level
export interface DialogueLine {
  speaker: string
  zh: string
  pinyin: string
  en: string
}

export interface VocabWord {
  word: string
  pinyin: string
  meaning: string
  geo_snippet: string
  key_points: string[]
  faq?: string[]
}

export interface Lesson {
  id: string
  level: HSKLevel
  title: string
  summary: string
  durationMin: number
  tags: string[]
  script: "simplified" | "traditional"
  dialogue: DialogueLine[]
  vocab: VocabWord[]
}

export const lessons: Lesson[] = [
  {
    id: "lesson-1",
    level: "HSK1",
    title: "Greetings & Introductions",
    summary: "Learn to greet people and introduce yourself in Chinese",
    durationMin: 20,
    tags: ["Speaking", "Basics"],
    script: "simplified",
    dialogue: [
      { speaker: "A", zh: "你好！", pinyin: "Nǐ hǎo!", en: "Hello!" },
      { speaker: "B", zh: "你好！你叫什么名字？", pinyin: "Nǐ hǎo! Nǐ jiào shénme míngzi?", en: "Hello! What's your name?" },
      { speaker: "A", zh: "我叫小明。你呢？", pinyin: "Wǒ jiào Xiǎo Míng. Nǐ ne?", en: "My name is Xiao Ming. And you?" },
      { speaker: "B", zh: "我叫小红。很高兴认识你！", pinyin: "Wǒ jiào Xiǎo Hóng. Hěn gāoxìng rènshi nǐ!", en: "I'm Xiao Hong. Nice to meet you!" },
      { speaker: "A", zh: "我也很高兴认识你！", pinyin: "Wǒ yě hěn gāoxìng rènshi nǐ!", en: "Nice to meet you too!" },
    ],
    vocab: [
      { word: "你好", pinyin: "nǐ hǎo", meaning: "hello", geo_snippet: "Most common greeting", key_points: ["Formal and informal", "Can be used anytime"], faq: ["Is it polite?", "Yes, always appropriate"] },
      { word: "叫", pinyin: "jiào", meaning: "to be called", geo_snippet: "Used for names", key_points: ["我叫... = My name is..."] },
      { word: "什么", pinyin: "shénme", meaning: "what", geo_snippet: "Question word", key_points: ["Place after the noun"] },
      { word: "名字", pinyin: "míngzi", meaning: "name", geo_snippet: "Full name", key_points: ["名 = given name, 姓 = surname"] },
      { word: "很", pinyin: "hěn", meaning: "very", geo_snippet: "Adverb", key_points: ["Often required before adj"] },
      { word: "高兴", pinyin: "gāoxìng", meaning: "happy", geo_snippet: "Emotion", key_points: ["很高兴 = very happy"] },
      { word: "认识", pinyin: "rènshi", meaning: "to know (a person)", geo_snippet: "Verb", key_points: ["For people, not things"] },
    ],
  },
  {
    id: "lesson-2",
    level: "HSK1",
    title: "Numbers & Counting",
    summary: "Master Chinese numbers from 1 to 100",
    durationMin: 15,
    tags: ["Numbers", "Basics"],
    script: "simplified",
    dialogue: [
      { speaker: "A", zh: "这个多少钱？", pinyin: "Zhège duōshao qián?", en: "How much is this?" },
      { speaker: "B", zh: "十五块。", pinyin: "Shíwǔ kuài.", en: "Fifteen yuan." },
      { speaker: "A", zh: "太贵了！十块可以吗？", pinyin: "Tài guì le! Shí kuài kěyǐ ma?", en: "Too expensive! Is ten okay?" },
      { speaker: "B", zh: "好，十二块吧。", pinyin: "Hǎo, shí'èr kuài ba.", en: "Okay, twelve yuan then." },
    ],
    vocab: [
      { word: "一", pinyin: "yī", meaning: "one", geo_snippet: "Number 1", key_points: ["Tone changes in context"] },
      { word: "二", pinyin: "èr", meaning: "two", geo_snippet: "Number 2", key_points: ["两 used for quantities"] },
      { word: "十", pinyin: "shí", meaning: "ten", geo_snippet: "Number 10", key_points: ["Base for teens"] },
      { word: "多少", pinyin: "duōshao", meaning: "how much/many", geo_snippet: "Question", key_points: ["For larger numbers"] },
      { word: "钱", pinyin: "qián", meaning: "money", geo_snippet: "Noun", key_points: ["多少钱 = how much money"] },
      { word: "块", pinyin: "kuài", meaning: "yuan (spoken)", geo_snippet: "Measure word", key_points: ["Casual form of 元"] },
    ],
  },
  {
    id: "lesson-3",
    level: "HSK2",
    title: "Shopping Dialogue",
    summary: "Navigate stores and make purchases with confidence",
    durationMin: 25,
    tags: ["Dialogue", "Practical"],
    script: "simplified",
    dialogue: [
      { speaker: "顾客", zh: "请问，这件衣服有别的颜色吗？", pinyin: "Qǐngwèn, zhè jiàn yīfu yǒu bié de yánsè ma?", en: "Excuse me, does this shirt come in other colors?" },
      { speaker: "店员", zh: "有，我们有红色、蓝色和黑色。", pinyin: "Yǒu, wǒmen yǒu hóngsè, lánsè hé hēisè.", en: "Yes, we have red, blue, and black." },
      { speaker: "顾客", zh: "我想试一下蓝色的，中号。", pinyin: "Wǒ xiǎng shì yīxià lánsè de, zhōnghào.", en: "I'd like to try the blue one, medium size." },
      { speaker: "店员", zh: "好的，试衣间在那边。", pinyin: "Hǎo de, shìyījiān zài nàbiān.", en: "Sure, the fitting room is over there." },
      { speaker: "顾客", zh: "这件多少钱？", pinyin: "Zhè jiàn duōshao qián?", en: "How much is this one?" },
      { speaker: "店员", zh: "原价两百，现在打八折，一百六。", pinyin: "Yuánjià liǎng bǎi, xiànzài dǎ bā zhé, yībǎi liù.", en: "Original price 200, now 20% off, 160." },
    ],
    vocab: [
      { word: "衣服", pinyin: "yīfu", meaning: "clothes", geo_snippet: "General term", key_points: ["件 is the measure word"] },
      { word: "颜色", pinyin: "yánsè", meaning: "color", geo_snippet: "Noun", key_points: ["什么颜色 = what color"] },
      { word: "试", pinyin: "shì", meaning: "to try", geo_snippet: "Verb", key_points: ["试一下 = try once"] },
      { word: "试衣间", pinyin: "shìyījiān", meaning: "fitting room", geo_snippet: "Location", key_points: ["试衣 = try clothes"] },
      { word: "原价", pinyin: "yuánjià", meaning: "original price", geo_snippet: "Shopping term", key_points: ["原 = original"] },
      { word: "打折", pinyin: "dǎ zhé", meaning: "discount", geo_snippet: "Shopping term", key_points: ["打八折 = 20% off"] },
    ],
  },
  {
    id: "lesson-4",
    level: "HSK2",
    title: "Restaurant Ordering",
    summary: "Order food at a Chinese restaurant with ease",
    durationMin: 20,
    tags: ["Food", "Dialogue"],
    script: "simplified",
    dialogue: [
      { speaker: "服务员", zh: "欢迎光临！请坐。", pinyin: "Huānyíng guānglín! Qǐng zuò.", en: "Welcome! Please have a seat." },
      { speaker: "顾客", zh: "谢谢。请给我菜单。", pinyin: "Xièxie. Qǐng gěi wǒ càidān.", en: "Thank you. Please give me the menu." },
      { speaker: "顾客", zh: "我要一碗米饭和宫保鸡丁。", pinyin: "Wǒ yào yī wǎn mǐfàn hé gōngbǎo jīdīng.", en: "I want a bowl of rice and kung pao chicken." },
      { speaker: "服务员", zh: "好的，请稍等。", pinyin: "Hǎo de, qǐng shāo děng.", en: "Okay, please wait a moment." },
    ],
    vocab: [
      { word: "欢迎", pinyin: "huānyíng", meaning: "welcome", geo_snippet: "Greeting", key_points: ["欢迎光临 = welcome (formal)"] },
      { word: "菜单", pinyin: "càidān", meaning: "menu", geo_snippet: "Restaurant", key_points: ["菜 = dish, 单 = list"] },
      { word: "米饭", pinyin: "mǐfàn", meaning: "rice", geo_snippet: "Food", key_points: ["碗 is measure word"] },
      { word: "请稍等", pinyin: "qǐng shāo děng", meaning: "please wait", geo_snippet: "Polite phrase", key_points: ["稍 = slightly/a bit"] },
    ],
  },
  {
    id: "lesson-5",
    level: "HSK3",
    title: "Travel Conversations",
    summary: "Essential phrases for traveling in China",
    durationMin: 30,
    tags: ["Travel", "Advanced"],
    script: "simplified",
    dialogue: [
      { speaker: "旅客", zh: "请问，去天安门怎么走？", pinyin: "Qǐngwèn, qù Tiān'ānmén zěnme zǒu?", en: "Excuse me, how do I get to Tiananmen?" },
      { speaker: "路人", zh: "你可以坐地铁一号线，在天安门东站下车。", pinyin: "Nǐ kěyǐ zuò dìtiě yī hào xiàn, zài Tiān'ānmén Dōng zhàn xià chē.", en: "You can take Metro Line 1, get off at Tiananmen East station." },
      { speaker: "旅客", zh: "大概需要多长时间？", pinyin: "Dàgài xūyào duō cháng shíjiān?", en: "About how long does it take?" },
      { speaker: "路人", zh: "差不多二十分钟。", pinyin: "Chàbuduō èrshí fēnzhōng.", en: "About twenty minutes." },
      { speaker: "旅客", zh: "太好了，非常感谢！", pinyin: "Tài hǎo le, fēicháng gǎnxiè!", en: "Great, thank you very much!" },
    ],
    vocab: [
      { word: "怎么走", pinyin: "zěnme zǒu", meaning: "how to get there", geo_snippet: "Direction", key_points: ["走 = walk/go"] },
      { word: "地铁", pinyin: "dìtiě", meaning: "subway/metro", geo_snippet: "Transport", key_points: ["地 = ground, 铁 = iron"] },
      { word: "下车", pinyin: "xià chē", meaning: "get off (vehicle)", geo_snippet: "Transport", key_points: ["上车 = get on"] },
      { word: "大概", pinyin: "dàgài", meaning: "approximately", geo_snippet: "Adverb", key_points: ["差不多 = similar meaning"] },
      { word: "需要", pinyin: "xūyào", meaning: "to need", geo_snippet: "Verb", key_points: ["需要 + noun/verb"] },
    ],
  },
  {
    id: "lesson-6",
    level: "HSK4",
    title: "Business Chinese Basics",
    summary: "Professional language for workplace situations",
    durationMin: 35,
    tags: ["Business", "Formal"],
    script: "simplified",
    dialogue: [
      { speaker: "主管", zh: "我们来讨论一下这个项目的进度。", pinyin: "Wǒmen lái tǎolùn yīxià zhège xiàngmù de jìndù.", en: "Let's discuss the progress of this project." },
      { speaker: "员工", zh: "目前我们已经完成了百分之六十。", pinyin: "Mùqián wǒmen yǐjīng wánchéng le bǎifēn zhī liùshí.", en: "Currently we've completed 60 percent." },
      { speaker: "主管", zh: "还有什么困难需要解决吗？", pinyin: "Hái yǒu shénme kùnnan xūyào jiějué ma?", en: "Are there any difficulties that need to be resolved?" },
      { speaker: "员工", zh: "我们需要更多的时间来测试产品。", pinyin: "Wǒmen xūyào gèng duō de shíjiān lái cèshì chǎnpǐn.", en: "We need more time to test the product." },
    ],
    vocab: [
      { word: "讨论", pinyin: "tǎolùn", meaning: "to discuss", geo_snippet: "Formal", key_points: ["讨论 + topic"] },
      { word: "项目", pinyin: "xiàngmù", meaning: "project", geo_snippet: "Business", key_points: ["项目经理 = project manager"] },
      { word: "进度", pinyin: "jìndù", meaning: "progress", geo_snippet: "Business", key_points: ["进 = advance"] },
      { word: "完成", pinyin: "wánchéng", meaning: "to complete", geo_snippet: "Verb", key_points: ["完 = finish"] },
      { word: "困难", pinyin: "kùnnan", meaning: "difficulty", geo_snippet: "Noun/Adj", key_points: ["有困难 = have difficulty"] },
      { word: "解决", pinyin: "jiějué", meaning: "to solve", geo_snippet: "Verb", key_points: ["解决问题 = solve problem"] },
    ],
  },
]

// Readers
export interface ReaderParagraph {
  zh: string
  pinyin?: string
  en?: string
}

export interface ReaderToken {
  word: string
  start: number
  end: number
  pinyin: string
  meaning: string
}

export interface Reader {
  id: string
  level: HSKLevel
  title: string
  summary: string
  wordCount: number
  tags: string[]
  paragraphs: ReaderParagraph[]
  tokens: ReaderToken[]
}

export const readers: Reader[] = [
  {
    id: "reader-1",
    level: "HSK2",
    title: "The Lost Umbrella",
    summary: "A simple story about a rainy day and a kind stranger",
    wordCount: 320,
    tags: ["Story", "Daily Life"],
    paragraphs: [
      { zh: "今天下雨了。小明忘了带雨伞。他站在商店门口，不知道怎么办。", pinyin: "Jīntiān xià yǔ le. Xiǎo Míng wàng le dài yǔsǎn. Tā zhàn zài shāngdiàn ménkǒu, bù zhīdào zěnme bàn.", en: "It's raining today. Xiao Ming forgot to bring his umbrella. He stood at the store entrance, not knowing what to do." },
      { zh: "这时候，一个老奶奶走过来。她看见小明没有伞，就把自己的伞给了他。", pinyin: "Zhè shíhou, yī gè lǎo nǎinai zǒu guòlái. Tā kànjiàn Xiǎo Míng méiyǒu sǎn, jiù bǎ zìjǐ de sǎn gěi le tā.", en: "At this moment, an elderly grandmother walked over. She saw Xiao Ming had no umbrella, so she gave him her own." },
      { zh: "小明很感动。他说：谢谢奶奶！老奶奶笑着说：不用谢，快回家吧！", pinyin: "Xiǎo Míng hěn gǎndòng. Tā shuō: xièxie nǎinai! Lǎo nǎinai xiào zhe shuō: bùyòng xiè, kuài huí jiā ba!", en: "Xiao Ming was very moved. He said: Thank you grandma! The grandmother smiled and said: You're welcome, hurry home!" },
      { zh: "第二天天气很好。小明找到了那个老奶奶，把伞还给她，还送了她一束花。", pinyin: "Dì èr tiān tiānqì hěn hǎo. Xiǎo Míng zhǎodào le nàge lǎo nǎinai, bǎ sǎn huán gěi tā, hái sòng le tā yī shù huā.", en: "The next day the weather was nice. Xiao Ming found the grandmother, returned the umbrella, and gave her a bouquet of flowers." },
    ],
    tokens: [
      { word: "今天", start: 0, end: 2, pinyin: "jīntiān", meaning: "today" },
      { word: "下雨", start: 2, end: 4, pinyin: "xià yǔ", meaning: "to rain" },
      { word: "忘", start: 9, end: 10, pinyin: "wàng", meaning: "to forget" },
      { word: "带", start: 11, end: 12, pinyin: "dài", meaning: "to bring" },
      { word: "雨伞", start: 12, end: 14, pinyin: "yǔsǎn", meaning: "umbrella" },
      { word: "商店", start: 19, end: 21, pinyin: "shāngdiàn", meaning: "store" },
      { word: "门口", start: 21, end: 23, pinyin: "ménkǒu", meaning: "entrance" },
      { word: "老奶奶", start: 35, end: 38, pinyin: "lǎo nǎinai", meaning: "grandmother" },
      { word: "感动", start: 58, end: 60, pinyin: "gǎndòng", meaning: "moved/touched" },
      { word: "天气", start: 85, end: 87, pinyin: "tiānqì", meaning: "weather" },
      { word: "还给", start: 102, end: 104, pinyin: "huán gěi", meaning: "return to" },
      { word: "一束花", start: 110, end: 113, pinyin: "yī shù huā", meaning: "a bouquet" },
    ],
  },
  {
    id: "reader-2",
    level: "HSK1",
    title: "A Day at the Market",
    summary: "Follow along as Xiao Li buys vegetables at the local market",
    wordCount: 180,
    tags: ["Shopping", "Beginner"],
    paragraphs: [
      { zh: "早上九点，小李去市场买菜。市场里人很多，很热闹。", pinyin: "Zǎoshang jiǔ diǎn, Xiǎo Lǐ qù shìchǎng mǎi cài. Shìchǎng lǐ rén hěn duō, hěn rènao.", en: "At 9 AM, Xiao Li went to the market to buy vegetables. The market was crowded and lively." },
      { zh: "她先买了白菜和西红柿。白菜两块钱一斤，西红柿三块钱一斤。", pinyin: "Tā xiān mǎi le báicài hé xīhóngshì. Báicài liǎng kuài qián yī jīn, xīhóngshì sān kuài qián yī jīn.", en: "She first bought cabbage and tomatoes. Cabbage was 2 yuan per jin, tomatoes 3 yuan per jin." },
      { zh: "然后她买了一些水果：苹果和香蕉。苹果很甜，香蕉很新鲜。", pinyin: "Ránhòu tā mǎi le yīxiē shuǐguǒ: píngguǒ hé xiāngjiāo. Píngguǒ hěn tián, xiāngjiāo hěn xīnxiān.", en: "Then she bought some fruit: apples and bananas. The apples were sweet, the bananas were fresh." },
    ],
    tokens: [
      { word: "早上", start: 0, end: 2, pinyin: "zǎoshang", meaning: "morning" },
      { word: "市场", start: 8, end: 10, pinyin: "shìchǎng", meaning: "market" },
      { word: "买菜", start: 10, end: 12, pinyin: "mǎi cài", meaning: "buy vegetables" },
      { word: "热闹", start: 22, end: 24, pinyin: "rènao", meaning: "lively" },
      { word: "白菜", start: 28, end: 30, pinyin: "báicài", meaning: "cabbage" },
      { word: "西红柿", start: 31, end: 34, pinyin: "xīhóngshì", meaning: "tomato" },
      { word: "水果", start: 55, end: 57, pinyin: "shuǐguǒ", meaning: "fruit" },
      { word: "苹果", start: 58, end: 60, pinyin: "píngguǒ", meaning: "apple" },
      { word: "香蕉", start: 61, end: 63, pinyin: "xiāngjiāo", meaning: "banana" },
      { word: "新鲜", start: 75, end: 77, pinyin: "xīnxiān", meaning: "fresh" },
    ],
  },
  {
    id: "reader-3",
    level: "HSK3",
    title: "The Clever Farmer",
    summary: "A traditional tale about wit and wisdom",
    wordCount: 450,
    tags: ["Folklore", "Culture"],
    paragraphs: [
      { zh: "从前有一个农民，他很聪明。有一天，一个有钱人来到他的村子，想买他的土地。", pinyin: "Cóngqián yǒu yī gè nóngmín, tā hěn cōngmíng. Yǒu yī tiān, yī gè yǒu qián rén láidào tā de cūnzi, xiǎng mǎi tā de tǔdì.", en: "Once upon a time there was a farmer who was very clever. One day, a rich man came to his village, wanting to buy his land." },
      { zh: "有钱人说：我给你一百两银子，你把地卖给我。农民摇摇头说：这块地是我祖父留给我的，不能卖。", pinyin: "Yǒu qián rén shuō: wǒ gěi nǐ yībǎi liǎng yínzi, nǐ bǎ dì mài gěi wǒ. Nóngmín yáo yao tóu shuō: zhè kuài dì shì wǒ zǔfù liú gěi wǒ de, bù néng mài.", en: "The rich man said: I'll give you 100 taels of silver, sell me the land. The farmer shook his head: This land was left to me by my grandfather, I cannot sell it." },
      { zh: "有钱人很生气，想出了一个坏主意。他说：那我们来比一比，如果你输了，就把地给我。", pinyin: "Yǒu qián rén hěn shēngqì, xiǎng chū le yī gè huài zhǔyì. Tā shuō: nà wǒmen lái bǐ yī bǐ, rúguǒ nǐ shū le, jiù bǎ dì gěi wǒ.", en: "The rich man was angry and came up with a bad idea. He said: Let's have a contest. If you lose, give me the land." },
      { zh: "聪明的农民同意了。最后，农民用他的智慧赢了比赛，保住了自己的土地。村里的人都很高兴。", pinyin: "Cōngmíng de nóngmín tóngyì le. Zuìhòu, nóngmín yòng tā de zhìhuì yíng le bǐsài, bǎozhù le zìjǐ de tǔdì. Cūn lǐ de rén dōu hěn gāoxìng.", en: "The clever farmer agreed. In the end, the farmer used his wisdom to win the contest and kept his land. Everyone in the village was happy." },
    ],
    tokens: [
      { word: "从前", start: 0, end: 2, pinyin: "cóngqián", meaning: "once upon a time" },
      { word: "农民", start: 5, end: 7, pinyin: "nóngmín", meaning: "farmer" },
      { word: "聪明", start: 10, end: 12, pinyin: "cōngmíng", meaning: "clever" },
      { word: "村子", start: 28, end: 30, pinyin: "cūnzi", meaning: "village" },
      { word: "土地", start: 35, end: 37, pinyin: "tǔdì", meaning: "land" },
      { word: "银子", start: 52, end: 54, pinyin: "yínzi", meaning: "silver/money" },
      { word: "祖父", start: 68, end: 70, pinyin: "zǔfù", meaning: "grandfather" },
      { word: "生气", start: 82, end: 84, pinyin: "shēngqì", meaning: "angry" },
      { word: "智慧", start: 115, end: 117, pinyin: "zhìhuì", meaning: "wisdom" },
      { word: "比赛", start: 120, end: 122, pinyin: "bǐsài", meaning: "contest/competition" },
    ],
  },
  {
    id: "reader-4",
    level: "HSK4",
    title: "Modern Beijing",
    summary: "Explore the contrasts of ancient and modern in China's capital",
    wordCount: 680,
    tags: ["Travel", "City"],
    paragraphs: [
      { zh: "北京是中国的首都，也是一个充满对比的城市。古老的胡同和现代的高楼大厦共同存在。", pinyin: "Běijīng shì Zhōngguó de shǒudū, yě shì yī gè chōngmǎn duìbǐ de chéngshì. Gǔlǎo de hútòng hé xiàndài de gāolóu dàshà gòngtóng cúnzài.", en: "Beijing is China's capital, and a city full of contrasts. Ancient hutongs and modern skyscrapers coexist." },
      { zh: "在这里，你可以早上去故宫看历史，下午去国贸购物，晚上去三里屯享受夜生活。", pinyin: "Zài zhèlǐ, nǐ kěyǐ zǎoshang qù Gùgōng kàn lìshǐ, xiàwǔ qù Guómào gòuwù, wǎnshang qù Sānlǐtún xiǎngshòu yèshēnghuó.", en: "Here, you can visit the Forbidden City in the morning, shop at Guomao in the afternoon, and enjoy nightlife in Sanlitun in the evening." },
      { zh: "北京的交通非常方便。地铁网络覆盖了整个城市，公交车也很多。但是堵车是一个大问题，特别是在早晚高峰期。", pinyin: "Běijīng de jiāotōng fēicháng fāngbiàn. Dìtiě wǎngluò fùgài le zhěnggè chéngshì, gōngjiāo chē yě hěn duō. Dànshì dǔchē shì yī gè dà wèntí, tèbié shì zài zǎo wǎn gāofēng qī.", en: "Beijing's transportation is very convenient. The subway network covers the whole city, and there are many buses. But traffic jams are a big problem, especially during morning and evening rush hours." },
      { zh: "如果你想了解真正的北京，就要去胡同里走一走。那里的生活节奏比较慢，可以看到老北京人的日常生活。", pinyin: "Rúguǒ nǐ xiǎng liǎojiě zhēnzhèng de Běijīng, jiù yào qù hútòng lǐ zǒu yī zǒu. Nàlǐ de shēnghuó jiézòu bǐjiào màn, kěyǐ kàndào lǎo Běijīng rén de rìcháng shēnghuó.", en: "If you want to understand the real Beijing, you should walk through the hutongs. The pace of life there is slower, and you can see the daily life of old Beijingers." },
    ],
    tokens: [
      { word: "首都", start: 5, end: 7, pinyin: "shǒudū", meaning: "capital city" },
      { word: "充满", start: 12, end: 14, pinyin: "chōngmǎn", meaning: "full of" },
      { word: "对比", start: 14, end: 16, pinyin: "duìbǐ", meaning: "contrast" },
      { word: "胡同", start: 22, end: 24, pinyin: "hútòng", meaning: "hutong/alley" },
      { word: "高楼大厦", start: 28, end: 32, pinyin: "gāolóu dàshà", meaning: "skyscrapers" },
      { word: "故宫", start: 48, end: 50, pinyin: "Gùgōng", meaning: "Forbidden City" },
      { word: "历史", start: 51, end: 53, pinyin: "lìshǐ", meaning: "history" },
      { word: "交通", start: 82, end: 84, pinyin: "jiāotōng", meaning: "transportation" },
      { word: "网络", start: 90, end: 92, pinyin: "wǎngluò", meaning: "network" },
      { word: "堵车", start: 108, end: 110, pinyin: "dǔchē", meaning: "traffic jam" },
      { word: "高峰期", start: 122, end: 125, pinyin: "gāofēng qī", meaning: "rush hour" },
      { word: "节奏", start: 145, end: 147, pinyin: "jiézòu", meaning: "rhythm/pace" },
    ],
  },
]

// Items by Level for Path View
export const itemsByLevel: Record<HSKLevel, { lessons: typeof lessons; readers: typeof readers }> = {
  HSK1: {
    lessons: lessons.filter((l) => l.level === "HSK1"),
    readers: readers.filter((r) => r.level === "HSK1"),
  },
  HSK2: {
    lessons: lessons.filter((l) => l.level === "HSK2"),
    readers: readers.filter((r) => r.level === "HSK2"),
  },
  HSK3: {
    lessons: lessons.filter((l) => l.level === "HSK3"),
    readers: readers.filter((r) => r.level === "HSK3"),
  },
  HSK4: {
    lessons: lessons.filter((l) => l.level === "HSK4"),
    readers: readers.filter((r) => r.level === "HSK4"),
  },
  HSK5: {
    lessons: [],
    readers: [],
  },
  HSK6: {
    lessons: [],
    readers: [],
  },
}

// SRS Queue
export interface SrsCard {
  id: string
  type: "word"
  word: string
  pinyin: string
  meaning: string
  due: "today" | "tomorrow" | "later"
  ease: number
  interval: number
}

export const srsQueue: SrsCard[] = [
  { id: "srs1", type: "word", word: "学习", pinyin: "xuéxí", meaning: "to study", due: "today", ease: 2.5, interval: 1 },
  { id: "srs2", type: "word", word: "认识", pinyin: "rènshi", meaning: "to know (a person)", due: "today", ease: 2.3, interval: 2 },
  { id: "srs3", type: "word", word: "高兴", pinyin: "gāoxìng", meaning: "happy", due: "today", ease: 2.7, interval: 3 },
  { id: "srs4", type: "word", word: "雨伞", pinyin: "yǔsǎn", meaning: "umbrella", due: "today", ease: 2.1, interval: 1 },
  { id: "srs5", type: "word", word: "市场", pinyin: "shìchǎng", meaning: "market", due: "today", ease: 2.4, interval: 2 },
  { id: "srs6", type: "word", word: "感动", pinyin: "gǎndòng", meaning: "moved/touched", due: "today", ease: 2.2, interval: 1 },
  { id: "srs7", type: "word", word: "聪明", pinyin: "cōngmíng", meaning: "clever", due: "today", ease: 2.6, interval: 4 },
  { id: "srs8", type: "word", word: "土地", pinyin: "tǔdì", meaning: "land", due: "today", ease: 2.0, interval: 1 },
  { id: "srs9", type: "word", word: "交通", pinyin: "jiāotōng", meaning: "transportation", due: "tomorrow", ease: 2.5, interval: 7 },
  { id: "srs10", type: "word", word: "历史", pinyin: "lìshǐ", meaning: "history", due: "tomorrow", ease: 2.8, interval: 14 },
]

// User Progress
export interface UserProgress {
  completedLessonIds: string[]
  completedReaderIds: string[]
  srsTodayDoneCount: number
}

export const mockProgress: UserProgress = {
  completedLessonIds: ["lesson-1"],
  completedReaderIds: [],
  srsTodayDoneCount: 0,
}

// ==================== PART 3: SEO + GEO PAGES ====================

// Dictionary Entries (50+)
export interface DictionaryEntry {
  id: string
  word: string
  pinyin: string
  meanings: string[]
  examples: { cn: string; en: string; pinyin?: string }[]
  collocations?: string[]
  geo_snippet: string
  key_points: string[]
  faq?: string[]
  relatedWords: string[]
  level: HSKLevel
}

export const dictionaryEntries: DictionaryEntry[] = [
  {
    id: "d1",
    word: "学习",
    pinyin: "xuéxí",
    meanings: ["to study", "to learn"],
    examples: [
      { cn: "我每天学习中文。", en: "I study Chinese every day.", pinyin: "Wǒ měitiān xuéxí zhōngwén." },
      { cn: "学习是一件快乐的事。", en: "Learning is a happy thing.", pinyin: "Xuéxí shì yī jiàn kuàilè de shì." },
    ],
    collocations: ["学习中文", "学习知识", "努力学习"],
    geo_snippet: "学习 (xuéxí) is the most common Chinese word for 'to study' or 'to learn', used in both formal and informal contexts.",
    key_points: ["Can be used as both verb and noun", "学 alone means 'to learn'", "习 alone means 'to practice'", "Often combined with subjects: 学习数学, 学习历史"],
    faq: ["What's the difference between 学习 and 学?", "学习 emphasizes the process of studying, while 学 is more general for learning.", "Can 学习 be used as a noun?", "Yes, 学习很重要 means 'studying is important'."],
    relatedWords: ["学", "学生", "学校", "练习"],
    level: "HSK1",
  },
  {
    id: "d2",
    word: "你好",
    pinyin: "nǐ hǎo",
    meanings: ["hello", "hi"],
    examples: [
      { cn: "你好，请问你叫什么名字？", en: "Hello, may I ask what your name is?", pinyin: "Nǐ hǎo, qǐngwèn nǐ jiào shénme míngzi?" },
      { cn: "你好！很高兴认识你。", en: "Hello! Nice to meet you.", pinyin: "Nǐ hǎo! Hěn gāoxìng rènshi nǐ." },
    ],
    geo_snippet: "你好 (nǐ hǎo) is the standard Chinese greeting meaning 'hello', appropriate in virtually all social situations.",
    key_points: ["Most universal Chinese greeting", "Literally means 'you good'", "Can be used any time of day", "Add 们 for plural: 你们好"],
    faq: ["Is 你好 formal or informal?", "It works in both contexts and is always polite.", "When should I use 您好 instead?", "Use 您好 with elders or in very formal situations."],
    relatedWords: ["您好", "早上好", "晚上好", "再见"],
    level: "HSK1",
  },
  {
    id: "d3",
    word: "吃",
    pinyin: "chī",
    meanings: ["to eat"],
    examples: [
      { cn: "你吃早饭了吗？", en: "Have you eaten breakfast?", pinyin: "Nǐ chī zǎofàn le ma?" },
      { cn: "我们去吃饭吧！", en: "Let's go eat!", pinyin: "Wǒmen qù chīfàn ba!" },
    ],
    collocations: ["吃饭", "吃早饭", "吃午饭", "吃晚饭"],
    geo_snippet: "吃 (chī) is the primary Chinese verb for 'to eat', one of the most frequently used words in daily conversation.",
    key_points: ["Basic verb for eating", "吃饭 literally means 'eat rice' but means 'to eat a meal'", "吃 + food item is the basic pattern", "Can also mean 'to suffer' in idioms"],
    faq: ["What's the difference between 吃 and 喝?", "吃 is for solid food, 喝 is for drinks.", "Why do Chinese ask 你吃了吗?", "It's a traditional greeting showing care, not a literal question."],
    relatedWords: ["喝", "饭", "食物", "餐厅"],
    level: "HSK1",
  },
  {
    id: "d4",
    word: "说",
    pinyin: "shuō",
    meanings: ["to speak", "to say", "to talk"],
    examples: [
      { cn: "他说中文说得很好。", en: "He speaks Chinese very well.", pinyin: "Tā shuō zhōngwén shuō de hěn hǎo." },
      { cn: "请说慢一点。", en: "Please speak slower.", pinyin: "Qǐng shuō màn yīdiǎn." },
    ],
    collocations: ["说话", "说中文", "说英语", "说实话"],
    geo_snippet: "说 (shuō) is the essential Chinese verb for 'to speak' or 'to say', fundamental for communication and language learning.",
    key_points: ["Primary verb for speaking", "说话 means 'to talk/speak'", "说 + language = to speak that language", "说得 + adj describes how well someone speaks"],
    faq: ["How is 说 different from 讲?", "They're often interchangeable, but 讲 can sound slightly more formal.", "What does 说实话 mean?", "It means 'to be honest' or 'frankly speaking'."],
    relatedWords: ["讲", "话", "语言", "聊天"],
    level: "HSK1",
  },
  {
    id: "d5",
    word: "看",
    pinyin: "kàn",
    meanings: ["to see", "to look", "to watch", "to read"],
    examples: [
      { cn: "我喜欢看电影。", en: "I like watching movies.", pinyin: "Wǒ xǐhuan kàn diànyǐng." },
      { cn: "看一看这本书。", en: "Take a look at this book.", pinyin: "Kàn yī kàn zhè běn shū." },
    ],
    collocations: ["看书", "看电影", "看电视", "看医生"],
    geo_snippet: "看 (kàn) is a versatile Chinese verb meaning 'to see', 'to look', 'to watch', or 'to read', depending on context.",
    key_points: ["Multi-purpose seeing/viewing verb", "看书 = to read a book", "看电影 = to watch a movie", "看医生 = to see a doctor (visit)"],
    faq: ["Why does 看 mean both 'watch' and 'read'?", "Chinese verbs are often more general; context clarifies meaning.", "What's the difference between 看 and 见?", "看 is the action of looking; 见 is actually seeing/meeting."],
    relatedWords: ["见", "读", "观看", "电影"],
    level: "HSK1",
  },
  {
    id: "d6",
    word: "听",
    pinyin: "tīng",
    meanings: ["to listen", "to hear"],
    examples: [
      { cn: "我喜欢听音乐。", en: "I like listening to music.", pinyin: "Wǒ xǐhuan tīng yīnyuè." },
      { cn: "请听我说。", en: "Please listen to me.", pinyin: "Qǐng tīng wǒ shuō." },
    ],
    collocations: ["听音乐", "听说", "听课", "听懂"],
    geo_snippet: "听 (tīng) is the Chinese verb for 'to listen' or 'to hear', essential for describing auditory activities.",
    key_points: ["Primary verb for hearing/listening", "听说 = to hear that (hearsay)", "听懂 = to understand what you hear", "听课 = to attend a lecture"],
    faq: ["What does 听说 mean?", "It means 'I heard that...' or 'It is said that...'", "How do I say 'I understand'?", "听懂了 means you understood what you heard."],
    relatedWords: ["音乐", "声音", "听写", "听力"],
    level: "HSK1",
  },
  {
    id: "d7",
    word: "写",
    pinyin: "xiě",
    meanings: ["to write"],
    examples: [
      { cn: "我在写作业。", en: "I am doing homework.", pinyin: "Wǒ zài xiě zuòyè." },
      { cn: "请写下你的名字。", en: "Please write down your name.", pinyin: "Qǐng xiě xià nǐ de míngzi." },
    ],
    collocations: ["写字", "写作业", "写信", "写文章"],
    geo_snippet: "写 (xiě) is the Chinese verb for 'to write', used for all forms of writing from characters to essays.",
    key_points: ["Basic verb for writing", "写字 = to write characters", "写作 = writing (as a skill)", "手写 = handwritten"],
    relatedWords: ["字", "作业", "文章", "笔"],
    level: "HSK1",
  },
  {
    id: "d8",
    word: "喝",
    pinyin: "hē",
    meanings: ["to drink"],
    examples: [
      { cn: "你想喝什么？", en: "What would you like to drink?", pinyin: "Nǐ xiǎng hē shénme?" },
      { cn: "我每天喝咖啡。", en: "I drink coffee every day.", pinyin: "Wǒ měitiān hē kāfēi." },
    ],
    collocations: ["喝水", "喝茶", "喝咖啡", "喝酒"],
    geo_snippet: "喝 (hē) is the Chinese verb for 'to drink', used for all beverages from water to alcohol.",
    key_points: ["Primary verb for drinking", "喝水 = to drink water", "喝茶 = to drink tea", "喝醉 = to get drunk"],
    faq: ["What's the difference between 喝 and 吃?", "喝 is for liquids, 吃 is for solid food.", "How do I say 'cheers'?", "干杯 (gānbēi) literally means 'dry cup'."],
    relatedWords: ["水", "茶", "咖啡", "酒"],
    level: "HSK1",
  },
  {
    id: "d9",
    word: "去",
    pinyin: "qù",
    meanings: ["to go"],
    examples: [
      { cn: "我要去学校。", en: "I'm going to school.", pinyin: "Wǒ yào qù xuéxiào." },
      { cn: "你去过中国吗？", en: "Have you been to China?", pinyin: "Nǐ qù guò Zhōngguó ma?" },
    ],
    collocations: ["去学校", "去工作", "去旅游", "去买"],
    geo_snippet: "去 (qù) is the fundamental Chinese verb for 'to go', indicating movement away from the speaker's location.",
    key_points: ["Basic verb for going somewhere", "去 + place = go to place", "去过 = have been to", "Opposite of 来 (to come)"],
    faq: ["What's the difference between 去 and 走?", "去 means 'to go to a destination', 走 means 'to walk' or 'to leave'.", "How do I say 'go home'?", "回家 (huí jiā) is more natural than 去家."],
    relatedWords: ["来", "走", "回", "到"],
    level: "HSK1",
  },
  {
    id: "d10",
    word: "来",
    pinyin: "lái",
    meanings: ["to come"],
    examples: [
      { cn: "请进来！", en: "Please come in!", pinyin: "Qǐng jìnlái!" },
      { cn: "他从北京来。", en: "He comes from Beijing.", pinyin: "Tā cóng Běijīng lái." },
    ],
    collocations: ["来这里", "过来", "回来", "出来"],
    geo_snippet: "来 (lái) is the essential Chinese verb for 'to come', indicating movement toward the speaker's location.",
    key_points: ["Basic verb for coming", "Opposite of 去 (to go)", "来 + verb = come and do something", "回来 = to come back"],
    relatedWords: ["去", "回", "到", "进"],
    level: "HSK1",
  },
  {
    id: "d11",
    word: "工作",
    pinyin: "gōngzuò",
    meanings: ["to work", "work", "job"],
    examples: [
      { cn: "我在公司工作。", en: "I work at a company.", pinyin: "Wǒ zài gōngsī gōngzuò." },
      { cn: "你的工作是什么？", en: "What is your job?", pinyin: "Nǐ de gōngzuò shì shénme?" },
    ],
    collocations: ["工作时间", "找工作", "工作经验", "在工作"],
    geo_snippet: "工作 (gōngzuò) means both 'to work' as a verb and 'work/job' as a noun, essential for professional conversations.",
    key_points: ["Functions as both verb and noun", "找工作 = to look for a job", "工作日 = workday", "工作狂 = workaholic"],
    faq: ["Is 工作 formal or informal?", "It's neutral and appropriate in all contexts.", "How do I ask about someone's job?", "你做什么工作？or 你的工作是什么？"],
    relatedWords: ["公司", "上班", "职业", "同事"],
    level: "HSK1",
  },
  {
    id: "d12",
    word: "朋友",
    pinyin: "péngyou",
    meanings: ["friend"],
    examples: [
      { cn: "他是我的好朋友。", en: "He is my good friend.", pinyin: "Tā shì wǒ de hǎo péngyou." },
      { cn: "我想交新朋友。", en: "I want to make new friends.", pinyin: "Wǒ xiǎng jiāo xīn péngyou." },
    ],
    collocations: ["好朋友", "老朋友", "男朋友", "女朋友"],
    geo_snippet: "朋友 (péngyou) is the standard Chinese word for 'friend', used in both casual and formal contexts.",
    key_points: ["Most common word for friend", "男朋友 = boyfriend", "女朋友 = girlfriend", "交朋友 = to make friends"],
    faq: ["What's a more casual word for friend?", "哥们儿 (gēmenr) is informal slang for male friends.", "How do I say 'best friend'?", "最好的朋友 or 闺蜜 (for female best friends)."],
    relatedWords: ["友谊", "交友", "同学", "伙伴"],
    level: "HSK1",
  },
  {
    id: "d13",
    word: "时间",
    pinyin: "shíjiān",
    meanings: ["time"],
    examples: [
      { cn: "你有时间吗？", en: "Do you have time?", pinyin: "Nǐ yǒu shíjiān ma?" },
      { cn: "时间过得很快。", en: "Time passes quickly.", pinyin: "Shíjiān guò de hěn kuài." },
    ],
    collocations: ["有时间", "没时间", "时间长", "浪费时间"],
    geo_snippet: "时间 (shíjiān) is the Chinese word for 'time' in the abstract sense, referring to duration or a point in time.",
    key_points: ["Abstract concept of time", "Different from 小时 (hour)", "浪费时间 = waste time", "节约时间 = save time"],
    faq: ["What's the difference between 时间 and 时候?", "时间 is time as a resource; 时候 refers to a point or moment in time.", "How do I say 'on time'?", "准时 (zhǔnshí) means 'on time/punctual'."],
    relatedWords: ["小时", "分钟", "时候", "日期"],
    level: "HSK1",
  },
  {
    id: "d14",
    word: "喜欢",
    pinyin: "xǐhuan",
    meanings: ["to like", "to be fond of"],
    examples: [
      { cn: "我喜欢吃中国菜。", en: "I like eating Chinese food.", pinyin: "Wǒ xǐhuan chī Zhōngguó cài." },
      { cn: "你喜欢什么颜色？", en: "What color do you like?", pinyin: "Nǐ xǐhuan shénme yánsè?" },
    ],
    collocations: ["喜欢吃", "喜欢看", "喜欢听", "很喜欢"],
    geo_snippet: "喜欢 (xǐhuan) is the most common Chinese word for 'to like', expressing fondness or preference.",
    key_points: ["Most common way to express liking", "喜欢 + verb = like to do", "喜欢 + noun = like something", "Can express romantic interest in context"],
    faq: ["How is 喜欢 different from 爱?", "喜欢 is 'like', 爱 is 'love' - stronger emotion.", "Can 喜欢 mean romantic interest?", "Yes, 我喜欢你 can mean 'I like you' romantically."],
    relatedWords: ["爱", "爱好", "讨厌", "喜爱"],
    level: "HSK1",
  },
  {
    id: "d15",
    word: "想",
    pinyin: "xiǎng",
    meanings: ["to want", "to think", "to miss"],
    examples: [
      { cn: "我想去中国。", en: "I want to go to China.", pinyin: "Wǒ xiǎng qù Zhōngguó." },
      { cn: "我很想你。", en: "I miss you very much.", pinyin: "Wǒ hěn xiǎng nǐ." },
    ],
    collocations: ["想去", "想吃", "想念", "想法"],
    geo_snippet: "想 (xiǎng) is a versatile Chinese verb meaning 'to want', 'to think', or 'to miss', depending on context.",
    key_points: ["想 + verb = want to do", "想 + person = miss someone", "我想... = I think...", "想法 = idea/thought"],
    faq: ["How is 想 different from 要?", "想 expresses desire/wish; 要 is stronger - 'need' or definite 'want'.", "How do I say 'I miss you'?", "我想你 or more emphatically 我很想你."],
    relatedWords: ["要", "想念", "思念", "认为"],
    level: "HSK1",
  },
  {
    id: "d16",
    word: "因为",
    pinyin: "yīnwèi",
    meanings: ["because"],
    examples: [
      { cn: "因为下雨，我没去。", en: "Because it rained, I didn't go.", pinyin: "Yīnwèi xià yǔ, wǒ méi qù." },
      { cn: "我迟到了，因为堵车。", en: "I was late because of traffic.", pinyin: "Wǒ chídào le, yīnwèi dǔchē." },
    ],
    collocations: ["因为...所以...", "就是因为", "正因为"],
    geo_snippet: "因为 (yīnwèi) is the primary Chinese conjunction for 'because', used to explain reasons and causes.",
    key_points: ["Always paired with 所以 in formal writing", "因为 can stand alone in spoken Chinese", "因为 comes before the reason", "所以 introduces the result"],
    faq: ["Do I always need 所以 after 因为?", "In spoken Chinese, no. In formal writing, yes.", "Where does 因为 go in the sentence?", "It comes before the clause explaining the reason."],
    relatedWords: ["所以", "由于", "原因", "因此"],
    level: "HSK2",
  },
  {
    id: "d17",
    word: "所以",
    pinyin: "suǒyǐ",
    meanings: ["so", "therefore"],
    examples: [
      { cn: "我病了，所以没去上班。", en: "I was sick, so I didn't go to work.", pinyin: "Wǒ bìng le, suǒyǐ méi qù shàngbān." },
      { cn: "因为他努力学习，所以考试考得很好。", en: "Because he studied hard, he did well on the exam.", pinyin: "Yīnwèi tā nǔlì xuéxí, suǒyǐ kǎoshì kǎo de hěn hǎo." },
    ],
    collocations: ["因为...所以...", "所以说"],
    geo_snippet: "所以 (suǒyǐ) means 'so' or 'therefore', typically used to introduce a result or conclusion.",
    key_points: ["Paired with 因为 in formal structures", "Introduces the result/consequence", "Can be used alone in spoken Chinese", "所以说 = that's why"],
    relatedWords: ["因为", "因此", "于是", "结果"],
    level: "HSK2",
  },
  {
    id: "d18",
    word: "但是",
    pinyin: "dànshì",
    meanings: ["but", "however"],
    examples: [
      { cn: "我想去，但是没有时间。", en: "I want to go, but I don't have time.", pinyin: "Wǒ xiǎng qù, dànshì méiyǒu shíjiān." },
      { cn: "这个很贵，但是质量很好。", en: "This is expensive, but the quality is good.", pinyin: "Zhège hěn guì, dànshì zhìliàng hěn hǎo." },
    ],
    collocations: ["虽然...但是...", "但是还是"],
    geo_snippet: "但是 (dànshì) is the most common Chinese word for 'but' or 'however', used to express contrast.",
    key_points: ["Most common way to say 'but'", "Often paired with 虽然 (although)", "可是 is slightly more informal", "但 alone works in shorter sentences"],
    faq: ["What's the difference between 但是 and 可是?", "They're very similar; 可是 is slightly more casual.", "Do I need 虽然 before 但是?", "No, but they're often used together."],
    relatedWords: ["可是", "然而", "虽然", "不过"],
    level: "HSK2",
  },
  {
    id: "d19",
    word: "虽然",
    pinyin: "suīrán",
    meanings: ["although", "even though"],
    examples: [
      { cn: "虽然很累，但是很开心。", en: "Although tired, I'm happy.", pinyin: "Suīrán hěn lèi, dànshì hěn kāixīn." },
      { cn: "虽然他年轻，但是很有经验。", en: "Although he's young, he has a lot of experience.", pinyin: "Suīrán tā niánqīng, dànshì hěn yǒu jīngyàn." },
    ],
    collocations: ["虽然...但是...", "虽然...可是..."],
    geo_snippet: "虽然 (suīrán) means 'although' or 'even though', used to introduce a concessive clause.",
    key_points: ["Always followed by 但是/可是/还是", "Introduces an acknowledged fact", "The main point comes after 但是", "Similar to 'While it's true that...'"],
    relatedWords: ["但是", "可是", "尽管", "即使"],
    level: "HSK2",
  },
  {
    id: "d20",
    word: "如果",
    pinyin: "rúguǒ",
    meanings: ["if"],
    examples: [
      { cn: "如果明天下雨，我就不去了。", en: "If it rains tomorrow, I won't go.", pinyin: "Rúguǒ míngtiān xià yǔ, wǒ jiù bù qù le." },
      { cn: "如果有问题，请告诉我。", en: "If you have questions, please tell me.", pinyin: "Rúguǒ yǒu wèntí, qǐng gàosu wǒ." },
    ],
    collocations: ["如果...就...", "如果...的话"],
    geo_snippet: "如果 (rúguǒ) is the standard Chinese word for 'if', used to express conditional situations.",
    key_points: ["如果...就... is the standard pattern", "的话 can follow for emphasis", "要是 is more colloquial", "假如 is more formal/literary"],
    faq: ["What's the difference between 如果 and 要是?", "They mean the same; 要是 is more colloquial.", "Do I need 就 after the condition?", "It's common but not always required in spoken Chinese."],
    relatedWords: ["要是", "假如", "就", "的话"],
    level: "HSK2",
  },
  {
    id: "d21",
    word: "可能",
    pinyin: "kěnéng",
    meanings: ["possible", "possibly", "maybe"],
    examples: [
      { cn: "他可能在家。", en: "He might be at home.", pinyin: "Tā kěnéng zài jiā." },
      { cn: "这个不可能！", en: "This is impossible!", pinyin: "Zhège bù kěnéng!" },
    ],
    collocations: ["可能会", "不可能", "有可能", "可能性"],
    geo_snippet: "可能 (kěnéng) expresses possibility or probability, meaning 'possible', 'possibly', or 'maybe'.",
    key_points: ["Works as adjective, adverb, or noun", "不可能 = impossible", "可能性 = possibility (noun)", "有可能 = there's a possibility"],
    faq: ["How is 可能 different from 也许?", "可能 is more neutral; 也许 sounds more uncertain.", "Where does 可能 go in a sentence?", "Usually before the verb: 他可能来."],
    relatedWords: ["也许", "或许", "大概", "能"],
    level: "HSK2",
  },
  {
    id: "d22",
    word: "应该",
    pinyin: "yīnggāi",
    meanings: ["should", "ought to"],
    examples: [
      { cn: "你应该多休息。", en: "You should rest more.", pinyin: "Nǐ yīnggāi duō xiūxi." },
      { cn: "这个应该是对的。", en: "This should be correct.", pinyin: "Zhège yīnggāi shì duì de." },
    ],
    collocations: ["应该做", "不应该", "应该是"],
    geo_snippet: "应该 (yīnggāi) means 'should' or 'ought to', expressing obligation, advice, or logical expectation.",
    key_points: ["Expresses obligation or advice", "不应该 = shouldn't", "应该是 = it should be (probability)", "Stronger than 可以 but softer than 必须"],
    faq: ["Is 应该 used for rules?", "For strict rules, use 必须 instead.", "Can 应该 express probability?", "Yes, 他应该到了 means 'he should have arrived by now'."],
    relatedWords: ["必须", "需要", "得", "可以"],
    level: "HSK2",
  },
  {
    id: "d23",
    word: "比",
    pinyin: "bǐ",
    meanings: ["than", "to compare"],
    examples: [
      { cn: "他比我高。", en: "He is taller than me.", pinyin: "Tā bǐ wǒ gāo." },
      { cn: "今天比昨天热。", en: "Today is hotter than yesterday.", pinyin: "Jīntiān bǐ zuótiān rè." },
    ],
    collocations: ["比较", "比...更", "没有...比"],
    geo_snippet: "比 (bǐ) is the primary Chinese preposition for making comparisons, equivalent to 'than' in English.",
    key_points: ["A 比 B + adjective pattern", "比较 = relatively/comparatively", "没有 A 比 B = nothing compares to", "Don't use 很 with 比 comparisons"],
    faq: ["Can I use 很 in a 比 sentence?", "No, use 更 or 多了 instead.", "How do I say 'as...as'?", "Use 跟...一样: 他跟我一样高."],
    relatedWords: ["比较", "更", "最", "一样"],
    level: "HSK2",
  },
  {
    id: "d24",
    word: "已经",
    pinyin: "yǐjīng",
    meanings: ["already"],
    examples: [
      { cn: "我已经吃了。", en: "I've already eaten.", pinyin: "Wǒ yǐjīng chī le." },
      { cn: "他已经走了。", en: "He has already left.", pinyin: "Tā yǐjīng zǒu le." },
    ],
    collocations: ["已经...了", "已经是"],
    geo_snippet: "已经 (yǐjīng) means 'already', indicating that an action has been completed or a state has been reached.",
    key_points: ["Always used with 了 for completed actions", "Goes before the verb", "Emphasizes completion", "曾经 is 'once/ever' (past experience)"],
    faq: ["Where does 已经 go in a sentence?", "Before the verb: 我已经吃了.", "What's the difference from 曾经?", "已经 = already (completed); 曾经 = once (in the past)."],
    relatedWords: ["曾经", "了", "还没", "刚"],
    level: "HSK2",
  },
  {
    id: "d25",
    word: "一直",
    pinyin: "yīzhí",
    meanings: ["always", "continuously", "straight"],
    examples: [
      { cn: "我一直在等你。", en: "I've been waiting for you.", pinyin: "Wǒ yīzhí zài děng nǐ." },
      { cn: "一直往前走。", en: "Go straight ahead.", pinyin: "Yīzhí wǎng qián zǒu." },
    ],
    collocations: ["一直在", "一直都", "一直到"],
    geo_snippet: "一直 (yīzhí) means 'continuously', 'always', or 'straight', expressing ongoing action or direction.",
    key_points: ["一直在 + verb = have been doing", "一直 + direction = go straight", "一直到 = until", "Emphasizes continuity"],
    relatedWords: ["总是", "经常", "始终", "不断"],
    level: "HSK2",
  },
  {
    id: "d26",
    word: "经常",
    pinyin: "jīngcháng",
    meanings: ["often", "frequently"],
    examples: [
      { cn: "我经常去那家餐厅。", en: "I often go to that restaurant.", pinyin: "Wǒ jīngcháng qù nà jiā cāntīng." },
      { cn: "她经常迟到。", en: "She is often late.", pinyin: "Tā jīngcháng chídào." },
    ],
    collocations: ["经常去", "经常吃", "不经常"],
    geo_snippet: "经常 (jīngcháng) means 'often' or 'frequently', describing repeated or habitual actions.",
    key_points: ["More formal than 常常", "经常 goes before the verb", "不经常 = not often", "总是 = always (more frequent)"],
    faq: ["What's more frequent: 经常 or 总是?", "总是 (always) > 经常 (often) > 有时候 (sometimes).", "Is 经常 formal or casual?", "It's neutral and works in all contexts."],
    relatedWords: ["常常", "总是", "有时候", "偶尔"],
    level: "HSK2",
  },
  {
    id: "d27",
    word: "重要",
    pinyin: "zhòngyào",
    meanings: ["important"],
    examples: [
      { cn: "健康很重要。", en: "Health is important.", pinyin: "Jiànkāng hěn zhòngyào." },
      { cn: "这是一个重要的决定。", en: "This is an important decision.", pinyin: "Zhè shì yī gè zhòngyào de juédìng." },
    ],
    collocations: ["很重要", "重要的", "最重要", "重要性"],
    geo_snippet: "重要 (zhòngyào) means 'important', used to describe significance or priority of matters.",
    key_points: ["Most common word for important", "重要性 = importance (noun)", "最重要的 = the most important", "Can modify nouns: 重要的事"],
    relatedWords: ["重大", "要紧", "关键", "必要"],
    level: "HSK2",
  },
  {
    id: "d28",
    word: "容易",
    pinyin: "róngyì",
    meanings: ["easy"],
    examples: [
      { cn: "这个问题很容易。", en: "This question is easy.", pinyin: "Zhège wèntí hěn róngyì." },
      { cn: "学中文不容易。", en: "Learning Chinese is not easy.", pinyin: "Xué zhōngwén bù róngyì." },
    ],
    collocations: ["很容易", "容易做", "不容易", "容易理解"],
    geo_snippet: "容易 (róngyì) means 'easy', describing tasks or situations that require little effort.",
    key_points: ["Opposite of 难 (difficult)", "容易 + verb = easy to do", "不容易 = not easy", "简单 also means easy/simple"],
    faq: ["What's the difference between 容易 and 简单?", "容易 emphasizes ease; 简单 emphasizes simplicity.", "How do I say 'it's easy to make mistakes'?", "容易出错 or 容易犯错."],
    relatedWords: ["简单", "难", "困难", "方便"],
    level: "HSK2",
  },
  {
    id: "d29",
    word: "难",
    pinyin: "nán",
    meanings: ["difficult", "hard"],
    examples: [
      { cn: "这道题太难了。", en: "This problem is too difficult.", pinyin: "Zhè dào tí tài nán le." },
      { cn: "难说。", en: "Hard to say.", pinyin: "Nán shuō." },
    ],
    collocations: ["很难", "太难", "难说", "难以"],
    geo_snippet: "难 (nán) means 'difficult' or 'hard', used to describe challenging tasks or situations.",
    key_points: ["Opposite of 容易 (easy)", "难 + verb = difficult to do", "难以 + verb (more formal)", "Also used in 困难 (difficulty)"],
    relatedWords: ["容易", "困难", "艰难", "简单"],
    level: "HSK2",
  },
  {
    id: "d30",
    word: "帮助",
    pinyin: "bāngzhù",
    meanings: ["to help", "help"],
    examples: [
      { cn: "谢谢你的帮助。", en: "Thank you for your help.", pinyin: "Xièxie nǐ de bāngzhù." },
      { cn: "我能帮助你吗？", en: "Can I help you?", pinyin: "Wǒ néng bāngzhù nǐ ma?" },
    ],
    collocations: ["帮助别人", "需要帮助", "互相帮助"],
    geo_snippet: "帮助 (bāngzhù) means 'to help' or 'help', used both as a verb and noun in Chinese.",
    key_points: ["Functions as verb and noun", "帮 alone is more casual", "帮忙 is very common too", "互相帮助 = help each other"],
    faq: ["What's the difference between 帮助 and 帮忙?", "Very similar; 帮忙 is slightly more casual.", "Can I just say 帮?", "Yes, 帮我 (help me) is common in speech."],
    relatedWords: ["帮忙", "帮", "支持", "协助"],
    level: "HSK2",
  },
  {
    id: "d31",
    word: "了解",
    pinyin: "liǎojiě",
    meanings: ["to understand", "to know about"],
    examples: [
      { cn: "我了解你的想法。", en: "I understand your thoughts.", pinyin: "Wǒ liǎojiě nǐ de xiǎngfǎ." },
      { cn: "你了解中国文化吗？", en: "Do you know about Chinese culture?", pinyin: "Nǐ liǎojiě Zhōngguó wénhuà ma?" },
    ],
    collocations: ["了解情况", "了解一下", "深入了解"],
    geo_snippet: "了解 (liǎojiě) means 'to understand' or 'to know about', often implying deeper comprehension than just knowing.",
    key_points: ["Deeper understanding than 知道", "了解 emphasizes comprehension", "了解一下 = look into it", "互相了解 = understand each other"],
    faq: ["How is 了解 different from 知道?", "知道 is knowing facts; 了解 is deeper understanding.", "How is 了解 different from 明白?", "明白 is 'to understand clearly'; 了解 is 'to be familiar with'."],
    relatedWords: ["知道", "明白", "理解", "认识"],
    level: "HSK3",
  },
  {
    id: "d32",
    word: "决定",
    pinyin: "juédìng",
    meanings: ["to decide", "decision"],
    examples: [
      { cn: "我决定去中国。", en: "I decided to go to China.", pinyin: "Wǒ juédìng qù Zhōngguó." },
      { cn: "这是一个重要的决定。", en: "This is an important decision.", pinyin: "Zhè shì yī gè zhòngyào de juédìng." },
    ],
    collocations: ["做决定", "决定了", "最后决定"],
    geo_snippet: "决定 (juédìng) means 'to decide' or 'decision', used for making choices and determinations.",
    key_points: ["Functions as verb and noun", "做决定 = make a decision", "决定 + verb = decide to do", "已经决定了 = have already decided"],
    relatedWords: ["选择", "定", "确定", "判断"],
    level: "HSK3",
  },
  {
    id: "d33",
    word: "影响",
    pinyin: "yǐngxiǎng",
    meanings: ["to influence", "influence", "to affect"],
    examples: [
      { cn: "天气影响了我们的计划。", en: "The weather affected our plans.", pinyin: "Tiānqì yǐngxiǎng le wǒmen de jìhuà." },
      { cn: "他对我影响很大。", en: "He has a big influence on me.", pinyin: "Tā duì wǒ yǐngxiǎng hěn dà." },
    ],
    collocations: ["影响力", "受影响", "产生影响"],
    geo_snippet: "影响 (yǐngxiǎng) means 'to influence' or 'influence', describing the effect one thing has on another.",
    key_points: ["Functions as verb and noun", "受...影响 = be affected by", "影响力 = influence (power)", "对...产生影响 = have an impact on"],
    relatedWords: ["效果", "作用", "改变", "结果"],
    level: "HSK3",
  },
  {
    id: "d34",
    word: "发展",
    pinyin: "fāzhǎn",
    meanings: ["to develop", "development"],
    examples: [
      { cn: "中国经济发展很快。", en: "China's economy is developing rapidly.", pinyin: "Zhōngguó jīngjì fāzhǎn hěn kuài." },
      { cn: "科技发展改变了生活。", en: "Technological development changed life.", pinyin: "Kējì fāzhǎn gǎibiàn le shēnghuó." },
    ],
    collocations: ["发展经济", "快速发展", "可持续发展"],
    geo_snippet: "发展 (fāzhǎn) means 'to develop' or 'development', commonly used in economic, social, and personal contexts.",
    key_points: ["Functions as verb and noun", "经济发展 = economic development", "发展中国家 = developing country", "个人发展 = personal development"],
    relatedWords: ["进步", "增长", "成长", "改进"],
    level: "HSK3",
  },
  {
    id: "d35",
    word: "改变",
    pinyin: "gǎibiàn",
    meanings: ["to change", "change"],
    examples: [
      { cn: "你改变了我的想法。", en: "You changed my mind.", pinyin: "Nǐ gǎibiàn le wǒ de xiǎngfǎ." },
      { cn: "生活发生了很大的改变。", en: "Life has undergone great changes.", pinyin: "Shēnghuó fāshēng le hěn dà de gǎibiàn." },
    ],
    collocations: ["改变主意", "改变想法", "发生改变"],
    geo_snippet: "改变 (gǎibiàn) means 'to change' or 'change', typically referring to deliberate or significant changes.",
    key_points: ["Functions as verb and noun", "改变主意 = change one's mind", "More intentional than 变化", "Often implies improvement"],
    faq: ["What's the difference between 改变 and 变化?", "改变 often implies intentional change; 变化 is more neutral.", "Can 改变 be used for small changes?", "It's typically used for significant changes."],
    relatedWords: ["变化", "变", "转变", "调整"],
    level: "HSK3",
  },
  {
    id: "d36",
    word: "提高",
    pinyin: "tígāo",
    meanings: ["to improve", "to raise", "to increase"],
    examples: [
      { cn: "我想提高我的中文水平。", en: "I want to improve my Chinese level.", pinyin: "Wǒ xiǎng tígāo wǒ de zhōngwén shuǐpíng." },
      { cn: "公司提高了员工的工资。", en: "The company raised employees' salaries.", pinyin: "Gōngsī tígāo le yuángōng de gōngzī." },
    ],
    collocations: ["提高水平", "提高效率", "提高质量"],
    geo_snippet: "提高 (tígāo) means 'to improve' or 'to raise', commonly used for skills, standards, and levels.",
    key_points: ["Used for levels, standards, skills", "提高水平 = improve level", "提高效率 = increase efficiency", "Often used with 能力, 质量, 工资"],
    relatedWords: ["增加", "增长", "改进", "进步"],
    level: "HSK3",
  },
  {
    id: "d37",
    word: "注意",
    pinyin: "zhùyì",
    meanings: ["to pay attention", "attention"],
    examples: [
      { cn: "请注意安全。", en: "Please pay attention to safety.", pinyin: "Qǐng zhùyì ānquán." },
      { cn: "他没有注意到我。", en: "He didn't notice me.", pinyin: "Tā méiyǒu zhùyì dào wǒ." },
    ],
    collocations: ["请注意", "注意力", "注意到"],
    geo_snippet: "注意 (zhùyì) means 'to pay attention' or 'attention', used for focusing awareness on something.",
    key_points: ["Functions as verb and noun", "请注意 = please note", "注意到 = to notice", "注意力 = attention span"],
    relatedWords: ["小心", "留意", "关注", "专心"],
    level: "HSK3",
  },
  {
    id: "d38",
    word: "经验",
    pinyin: "jīngyàn",
    meanings: ["experience"],
    examples: [
      { cn: "他有丰富的工作经验。", en: "He has rich work experience.", pinyin: "Tā yǒu fēngfù de gōngzuò jīngyàn." },
      { cn: "这是一次难忘的经验。", en: "This was an unforgettable experience.", pinyin: "Zhè shì yī cì nánwàng de jīngyàn." },
    ],
    collocations: ["工作经验", "有经验", "分享经验"],
    geo_snippet: "经验 (jīngyàn) means 'experience', referring to knowledge gained through practice or events.",
    key_points: ["Can be countable or uncountable", "有经验 = experienced", "经验丰富 = experienced (rich in experience)", "Different from 经历 (specific experience/event)"],
    faq: ["What's the difference between 经验 and 经历?", "经验 is knowledge gained; 经历 is a specific event or experience.", "How do I say 'experienced person'?", "有经验的人 or just 经验丰富."],
    relatedWords: ["经历", "体验", "阅历", "实践"],
    level: "HSK3",
  },
  {
    id: "d39",
    word: "机会",
    pinyin: "jīhuì",
    meanings: ["opportunity", "chance"],
    examples: [
      { cn: "这是一个很好的机会。", en: "This is a good opportunity.", pinyin: "Zhè shì yī gè hěn hǎo de jīhuì." },
      { cn: "我没有机会见到他。", en: "I didn't have a chance to meet him.", pinyin: "Wǒ méiyǒu jīhuì jiàndào tā." },
    ],
    collocations: ["有机会", "抓住机会", "错过机会"],
    geo_snippet: "机会 (jīhuì) means 'opportunity' or 'chance', referring to favorable circumstances for doing something.",
    key_points: ["有机会 = have a chance", "抓住机会 = seize the opportunity", "错过机会 = miss the chance", "机会难得 = rare opportunity"],
    relatedWords: ["机遇", "时机", "可能", "运气"],
    level: "HSK3",
  },
  {
    id: "d40",
    word: "环境",
    pinyin: "huánjìng",
    meanings: ["environment", "surroundings"],
    examples: [
      { cn: "保护环境很重要。", en: "Protecting the environment is important.", pinyin: "Bǎohù huánjìng hěn zhòngyào." },
      { cn: "这里的工作环境很好。", en: "The work environment here is good.", pinyin: "Zhèlǐ de gōngzuò huánjìng hěn hǎo." },
    ],
    collocations: ["保护环境", "环境污染", "学习环境"],
    geo_snippet: "环境 (huánjìng) means 'environment' or 'surroundings', used for both natural and social contexts.",
    key_points: ["Natural and social environments", "环境保护 = environmental protection", "环境污染 = pollution", "学习/工作环境 = study/work environment"],
    relatedWords: ["自然", "生态", "氛围", "条件"],
    level: "HSK3",
  },
  {
    id: "d41",
    word: "社会",
    pinyin: "shèhuì",
    meanings: ["society"],
    examples: [
      { cn: "现代社会变化很快。", en: "Modern society changes quickly.", pinyin: "Xiàndài shèhuì biànhuà hěn kuài." },
      { cn: "他对社会贡献很大。", en: "He made great contributions to society.", pinyin: "Tā duì shèhuì gòngxiàn hěn dà." },
    ],
    collocations: ["社会发展", "社会问题", "进入社会"],
    geo_snippet: "社会 (shèhuì) means 'society', referring to the community of people living together with shared laws and organizations.",
    key_points: ["社会主义 = socialism", "社会问题 = social issues", "进入社会 = enter society (start working)", "社会经验 = social experience"],
    relatedWords: ["国家", "社区", "群体", "公众"],
    level: "HSK4",
  },
  {
    id: "d42",
    word: "经济",
    pinyin: "jīngjì",
    meanings: ["economy", "economic"],
    examples: [
      { cn: "中国经济发展迅速。", en: "China's economy is developing rapidly.", pinyin: "Zhōngguó jīngjì fāzhǎn xùnsù." },
      { cn: "这个计划不经济。", en: "This plan is not economical.", pinyin: "Zhège jìhuà bù jīngjì." },
    ],
    collocations: ["经济发展", "经济增长", "市场经济"],
    geo_snippet: "经济 (jīngjì) means 'economy' or 'economic', a key term for discussing financial and business matters.",
    key_points: ["Functions as noun and adjective", "经济学 = economics", "市场经济 = market economy", "Also means 'economical/thrifty'"],
    relatedWords: ["金融", "商业", "贸易", "市场"],
    level: "HSK4",
  },
  {
    id: "d43",
    word: "政治",
    pinyin: "zhèngzhì",
    meanings: ["politics", "political"],
    examples: [
      { cn: "他对政治很感兴趣。", en: "He is very interested in politics.", pinyin: "Tā duì zhèngzhì hěn gǎn xìngqù." },
      { cn: "政治改革是必要的。", en: "Political reform is necessary.", pinyin: "Zhèngzhì gǎigé shì bìyào de." },
    ],
    collocations: ["政治制度", "政治家", "政治改革"],
    geo_snippet: "政治 (zhèngzhì) means 'politics' or 'political', used for discussing government and political affairs.",
    key_points: ["政治家 = politician", "政治制度 = political system", "政治课 = politics class", "Often paired with 经济"],
    relatedWords: ["政府", "国家", "法律", "选举"],
    level: "HSK4",
  },
  {
    id: "d44",
    word: "文化",
    pinyin: "wénhuà",
    meanings: ["culture"],
    examples: [
      { cn: "中国文化博大精深。", en: "Chinese culture is profound and extensive.", pinyin: "Zhōngguó wénhuà bódà jīngshēn." },
      { cn: "我喜欢学习不同的文化。", en: "I like learning about different cultures.", pinyin: "Wǒ xǐhuan xuéxí bùtóng de wénhuà." },
    ],
    collocations: ["文化交流", "传统文化", "文化遗产"],
    geo_snippet: "文化 (wénhuà) means 'culture', encompassing the customs, arts, and achievements of a people or society.",
    key_points: ["文化遗产 = cultural heritage", "文化交流 = cultural exchange", "传统文化 = traditional culture", "Also means education/literacy in some contexts"],
    relatedWords: ["传统", "艺术", "历史", "风俗"],
    level: "HSK4",
  },
  {
    id: "d45",
    word: "科技",
    pinyin: "kējì",
    meanings: ["science and technology", "tech"],
    examples: [
      { cn: "科技改变了我们的生活。", en: "Technology has changed our lives.", pinyin: "Kējì gǎibiàn le wǒmen de shēnghuó." },
      { cn: "他在科技公司工作。", en: "He works at a tech company.", pinyin: "Tā zài kējì gōngsī gōngzuò." },
    ],
    collocations: ["科技发展", "高科技", "科技公司"],
    geo_snippet: "科技 (kējì) is short for 科学技术, meaning 'science and technology', commonly used for tech-related topics.",
    key_points: ["Abbreviation of 科学技术", "高科技 = high-tech", "科技公司 = tech company", "科技发展 = technological development"],
    relatedWords: ["科学", "技术", "发明", "创新"],
    level: "HSK4",
  },
  {
    id: "d46",
    word: "管理",
    pinyin: "guǎnlǐ",
    meanings: ["to manage", "management"],
    examples: [
      { cn: "他负责管理这个部门。", en: "He is responsible for managing this department.", pinyin: "Tā fùzé guǎnlǐ zhège bùmén." },
      { cn: "时间管理很重要。", en: "Time management is important.", pinyin: "Shíjiān guǎnlǐ hěn zhòngyào." },
    ],
    collocations: ["管理层", "时间管理", "项目管理"],
    geo_snippet: "管理 (guǎnlǐ) means 'to manage' or 'management', used in business and organizational contexts.",
    key_points: ["Functions as verb and noun", "管理人员 = management staff", "项目管理 = project management", "管理层 = management level"],
    relatedWords: ["领导", "组织", "控制", "经营"],
    level: "HSK4",
  },
  {
    id: "d47",
    word: "研究",
    pinyin: "yánjiū",
    meanings: ["to research", "research", "study"],
    examples: [
      { cn: "我在研究中国历史。", en: "I am researching Chinese history.", pinyin: "Wǒ zài yánjiū Zhōngguó lìshǐ." },
      { cn: "这项研究很有意义。", en: "This research is very meaningful.", pinyin: "Zhè xiàng yánjiū hěn yǒu yìyì." },
    ],
    collocations: ["研究生", "研究所", "科学研究"],
    geo_snippet: "研究 (yánjiū) means 'to research' or 'research', used for academic and scientific investigation.",
    key_points: ["Functions as verb and noun", "研究生 = graduate student", "研究所 = research institute", "研究员 = researcher"],
    relatedWords: ["调查", "分析", "探索", "学术"],
    level: "HSK4",
  },
  {
    id: "d48",
    word: "目标",
    pinyin: "mùbiāo",
    meanings: ["goal", "target", "objective"],
    examples: [
      { cn: "我的目标是学好中文。", en: "My goal is to learn Chinese well.", pinyin: "Wǒ de mùbiāo shì xué hǎo zhōngwén." },
      { cn: "我们完成了今年的目标。", en: "We achieved this year's goals.", pinyin: "Wǒmen wánchéng le jīnnián de mùbiāo." },
    ],
    collocations: ["实现目标", "设定目标", "长期目标"],
    geo_snippet: "目标 (mùbiāo) means 'goal', 'target', or 'objective', used for describing aims and aspirations.",
    key_points: ["设定目标 = set a goal", "实现目标 = achieve a goal", "长期/短期目标 = long/short-term goals", "目标明确 = clear goals"],
    relatedWords: ["目的", "计划", "理想", "任务"],
    level: "HSK4",
  },
  {
    id: "d49",
    word: "效果",
    pinyin: "xiàoguǒ",
    meanings: ["effect", "result"],
    examples: [
      { cn: "这种方法效果很好。", en: "This method is very effective.", pinyin: "Zhè zhǒng fāngfǎ xiàoguǒ hěn hǎo." },
      { cn: "药物的效果很明显。", en: "The effect of the medicine is obvious.", pinyin: "Yàowù de xiàoguǒ hěn míngxiǎn." },
    ],
    collocations: ["效果好", "产生效果", "副作用"],
    geo_snippet: "效果 (xiàoguǒ) means 'effect' or 'result', describing the outcome or impact of an action.",
    key_points: ["效果好/不好 = good/bad effect", "没有效果 = no effect", "副作用 = side effect", "效果明显 = obvious effect"],
    relatedWords: ["结果", "作用", "影响", "成效"],
    level: "HSK4",
  },
  {
    id: "d50",
    word: "质量",
    pinyin: "zhìliàng",
    meanings: ["quality"],
    examples: [
      { cn: "这个产品质量很好。", en: "This product is of good quality.", pinyin: "Zhège chǎnpǐn zhìliàng hěn hǎo." },
      { cn: "我们要提高教学质量。", en: "We need to improve teaching quality.", pinyin: "Wǒmen yào tígāo jiàoxué zhìliàng." },
    ],
    collocations: ["产品质量", "质量控制", "高质量"],
    geo_snippet: "质量 (zhìliàng) means 'quality', used to describe the standard or grade of products and services.",
    key_points: ["高/低质量 = high/low quality", "质量保证 = quality assurance", "质量控制 = quality control", "Also means 'mass' in physics"],
    faq: ["Does 质量 only mean quality?", "In physics, it also means 'mass'.", "How do I say 'quality over quantity'?", "质量比数量重要 or 重质不重量."],
    relatedWords: ["品质", "水平", "标准", "等级"],
    level: "HSK4",
  },
  {
    id: "d51",
    word: "把",
    pinyin: "bǎ",
    meanings: ["(disposal particle)", "to hold"],
    examples: [
      { cn: "请把门关上。", en: "Please close the door.", pinyin: "Qǐng bǎ mén guān shàng." },
      { cn: "我把书放在桌子上了。", en: "I put the book on the table.", pinyin: "Wǒ bǎ shū fàng zài zhuōzi shàng le." },
    ],
    collocations: ["把...放在", "把...给", "把...拿走"],
    geo_snippet: "把 (bǎ) is a disposal particle that moves the object before the verb, emphasizing what happens to the object.",
    key_points: ["把 structure: Subject + 把 + Object + Verb + Result", "Used when something is being done to the object", "Object must be specific, not indefinite", "Common with directional and resultative complements"],
    faq: ["When do I use 把?", "When the object is affected or moved by the action.", "Can any verb use 把?", "No, only action verbs with a result or direction."],
    relatedWords: ["被", "让", "使", "叫"],
    level: "HSK3",
  },
  {
    id: "d52",
    word: "被",
    pinyin: "bèi",
    meanings: ["(passive particle)", "by"],
    examples: [
      { cn: "我的车被偷了。", en: "My car was stolen.", pinyin: "Wǒ de chē bèi tōu le." },
      { cn: "他被老师批评了。", en: "He was criticized by the teacher.", pinyin: "Tā bèi lǎoshī pīpíng le." },
    ],
    collocations: ["被...了", "被动语态"],
    geo_snippet: "被 (bèi) is the main passive particle in Chinese, used to indicate that the subject receives an action.",
    key_points: ["Structure: Subject + 被 + (Agent) + Verb", "Agent can be omitted", "Often used for negative or unpleasant events", "More formal alternatives: 让, 叫, 给"],
    faq: ["Is 被 always negative?", "Traditionally yes, but modern usage is more flexible.", "Can I omit the agent?", "Yes: 他被骂了 (He was scolded)."],
    relatedWords: ["让", "叫", "给", "把"],
    level: "HSK4",
  },
  {
    id: "d53",
    word: "得",
    pinyin: "de / děi",
    meanings: ["(complement particle)", "must"],
    examples: [
      { cn: "他跑得很快。", en: "He runs very fast.", pinyin: "Tā pǎo de hěn kuài." },
      { cn: "我得走了。", en: "I must go.", pinyin: "Wǒ děi zǒu le." },
    ],
    collocations: ["跑得快", "说得好", "得到"],
    geo_snippet: "得 has two pronunciations: 'de' as a complement particle and 'děi' meaning 'must' or 'have to'.",
    key_points: ["de: Verb + 得 + Complement (describes how)", "děi: must, have to", "得到 (dédào) = to obtain", "Don't confuse with 的 and 地"],
    faq: ["How do I know which 得 to use?", "de after verbs for degree; děi for 'must'.", "What's the difference between 得到 and 拿到?", "得到 is more abstract; 拿到 is physical."],
    relatedWords: ["的", "地", "必须", "能够"],
    level: "HSK2",
  },
  {
    id: "d54",
    word: "教育",
    pinyin: "jiàoyù",
    meanings: ["education", "to educate"],
    examples: [
      { cn: "教育是最重要的投资。", en: "Education is the most important investment.", pinyin: "Jiàoyù shì zuì zhòngyào de tóuzī." },
      { cn: "父母应该好好教育孩子。", en: "Parents should educate their children well.", pinyin: "Fùmǔ yīnggāi hǎohǎo jiàoyù háizi." },
    ],
    collocations: ["教育水平", "高等教育", "教育改革"],
    geo_snippet: "教育 (jiàoyù) means 'education' as a noun or 'to educate' as a verb, fundamental for discussing learning and schools.",
    key_points: ["Functions as verb and noun", "高等教育 = higher education", "义务教育 = compulsory education", "教育部 = Ministry of Education"],
    relatedWords: ["学校", "老师", "学习", "培训"],
    level: "HSK4",
  },
  {
    id: "d55",
    word: "交流",
    pinyin: "jiāoliú",
    meanings: ["to exchange", "to communicate", "exchange"],
    examples: [
      { cn: "我们应该多交流。", en: "We should communicate more.", pinyin: "Wǒmen yīnggāi duō jiāoliú." },
      { cn: "文化交流很重要。", en: "Cultural exchange is important.", pinyin: "Wénhuà jiāoliú hěn zhòngyào." },
    ],
    collocations: ["文化交流", "交流经验", "国际交流"],
    geo_snippet: "交流 (jiāoliú) means 'to exchange' or 'to communicate', used for sharing ideas, experiences, and cultural exchange.",
    key_points: ["Functions as verb and noun", "交流经验 = exchange experiences", "学术交流 = academic exchange", "Also means AC (alternating current) in electrical terms"],
    relatedWords: ["沟通", "交换", "联系", "对话"],
    level: "HSK4",
  },
]

// Grammar Entries (20+)
export interface GrammarEntry {
  id: string
  pattern: string
  explanation: string
  geo_snippet: string
  key_points: string[]
  examples: { cn: string; en: string }[]
  common_mistakes?: string[]
  faq?: string[]
  relatedPatterns: string[]
  level: HSKLevel
}

export const grammarEntries: GrammarEntry[] = [
  {
    id: "gr1",
    pattern: "是...的",
    explanation: "The 是...的 construction is used to emphasize the time, place, manner, or purpose of a past action. The action itself is already known or assumed; this pattern highlights specific details about it.",
    geo_snippet: "是...的 (shì...de) is a Chinese grammar pattern used to emphasize details (time, place, manner) of a known past action.",
    key_points: [
      "Emphasizes when, where, how, or why something happened",
      "The action must have already occurred",
      "是 comes before the emphasized element",
      "的 comes at the end, or before the object",
      "Often used in questions about past events"
    ],
    examples: [
      { cn: "你是什么时候来的？", en: "When did you come? (emphasis on time)" },
      { cn: "我是昨天来的。", en: "I came yesterday. (emphasis on yesterday)" },
      { cn: "他是坐飞机来的。", en: "He came by plane. (emphasis on method)" },
      { cn: "她是在北京出生的。", en: "She was born in Beijing. (emphasis on place)" },
    ],
    common_mistakes: [
      "Using 是...的 for actions that haven't happened yet",
      "Forgetting 是 before the emphasized element",
      "Confusing with simple 的 (possessive particle)"
    ],
    faq: [
      "Where does the object go?", "Either before 的 (我是昨天买的这本书) or after 的 (我是昨天买这本书的).",
      "Can I drop 是?", "In casual speech, 是 is sometimes dropped: 你什么时候来的？"
    ],
    relatedPatterns: ["了 (completion)", "过 (experience)", "的 (possessive)"],
    level: "HSK2",
  },
  {
    id: "gr2",
    pattern: "把字句",
    explanation: "The 把 construction places the object before the verb to emphasize what happens to it. It's used when the action affects, moves, or changes the object in some way.",
    geo_snippet: "把字句 (bǎ zì jù) is a Chinese disposal construction that moves the object before the verb to emphasize the result of an action on that object.",
    key_points: [
      "Structure: Subject + 把 + Object + Verb + Complement/Result",
      "Object must be specific (not 'a book' but 'the book' or 'this book')",
      "Verb must show a result or change",
      "Cannot use with verbs like 知道, 喜欢, 有",
      "The 把 object is typically affected, moved, or changed"
    ],
    examples: [
      { cn: "请把门关上。", en: "Please close the door." },
      { cn: "我把作业做完了。", en: "I finished my homework." },
      { cn: "他把杯子打破了。", en: "He broke the cup." },
      { cn: "我把书放在桌子上了。", en: "I put the book on the table." },
    ],
    common_mistakes: [
      "Using 把 with indefinite objects (把一本书)",
      "Using 把 with stative verbs (把他喜欢)",
      "Forgetting the complement after the verb"
    ],
    faq: [
      "When must I use 把?", "When emphasizing what happens to a specific object, especially with directional or resultative complements.",
      "Can I use 把 with 有?", "No, 有 (to have) cannot be used in 把 sentences."
    ],
    relatedPatterns: ["被字句 (passive)", "了 (completion)", "Resultative Complements"],
    level: "HSK3",
  },
  {
    id: "gr3",
    pattern: "比较句 (Comparison with 比)",
    explanation: "The 比 comparison structure directly compares two things, stating that A is more [adjective] than B. It's the most common way to make comparisons in Chinese.",
    geo_snippet: "比 (bǐ) is the primary Chinese comparison word, used in the pattern 'A 比 B + adjective' to say A is more [adj] than B.",
    key_points: [
      "Basic structure: A 比 B + Adjective",
      "Never use 很 with 比 (use 更 or 多了 instead)",
      "To express degree: A 比 B + Adj + 多了/得多/一点",
      "Negative: A 没有 B + Adj (A is not as adj as B)",
      "Equal comparison: A 跟 B 一样 + Adj"
    ],
    examples: [
      { cn: "他比我高。", en: "He is taller than me." },
      { cn: "今天比昨天热多了。", en: "Today is much hotter than yesterday." },
      { cn: "他跑得比我快。", en: "He runs faster than me." },
      { cn: "我没有他聪明。", en: "I'm not as smart as him." },
    ],
    common_mistakes: [
      "Using 很 with 比 (他比我很高 ✗)",
      "Wrong word order (比他我高 ✗)",
      "Forgetting that 没有 is used for negative comparisons"
    ],
    faq: [
      "Can I use 更 with 比?", "Yes: 他比我更高 (He is even taller than me).",
      "How do I say 'A is the same as B'?", "A 跟 B 一样 (A is the same as B)."
    ],
    relatedPatterns: ["跟...一样", "没有...那么", "最 (superlative)"],
    level: "HSK2",
  },
  {
    id: "gr4",
    pattern: "结果补语 (Resultative Complements)",
    explanation: "Resultative complements follow the verb to indicate the result of an action. They show what state or outcome results from the action.",
    geo_snippet: "结果补语 (jiéguǒ bǔyǔ) are complements added after verbs to indicate the result or outcome of an action in Chinese.",
    key_points: [
      "Structure: Verb + Resultative Complement",
      "Shows the result or state achieved by the action",
      "Common complements: 完 (finish), 到 (arrive/achieve), 见 (perceive), 懂 (understand)",
      "Potential form: Verb + 得/不 + Complement",
      "Negative uses 没: 我没听懂"
    ],
    examples: [
      { cn: "我做完了作业。", en: "I finished my homework." },
      { cn: "他听懂了。", en: "He understood (what he heard)." },
      { cn: "我看见他了。", en: "I saw him." },
      { cn: "我找到了钥匙。", en: "I found the key." },
    ],
    common_mistakes: [
      "Using 了 instead of a resultative complement for results",
      "Forgetting that 没 (not 不) is used for negation",
      "Confusing potential and actual resultative complements"
    ],
    faq: [
      "What's the difference from 了?", "了 shows completion; resultative complements show the specific result.",
      "How do I say 'I can't understand'?", "Use the potential form: 我听不懂."
    ],
    relatedPatterns: ["可能补语 (Potential Complements)", "程度补语 (Degree Complements)", "方向补语 (Directional Complements)"],
    level: "HSK3",
  },
  {
    id: "gr5",
    pattern: "被字句 (Passive Voice)",
    explanation: "The 被 construction creates passive sentences where the subject receives the action. It often (but not always) carries a negative connotation.",
    geo_snippet: "被 (bèi) is the main passive marker in Chinese, used to indicate that the subject undergoes or suffers an action.",
    key_points: [
      "Structure: Subject + 被 + (Agent) + Verb + Complement",
      "Agent (doer) can be omitted",
      "Traditionally used for negative/unpleasant events",
      "Modern usage is expanding to neutral contexts",
      "Alternatives: 让, 叫, 给 (more colloquial)"
    ],
    examples: [
      { cn: "我的手机被偷了。", en: "My phone was stolen." },
      { cn: "他被老师批评了。", en: "He was criticized by the teacher." },
      { cn: "这本书被很多人读过。", en: "This book has been read by many people." },
      { cn: "蛋糕被他吃了。", en: "The cake was eaten by him." },
    ],
    common_mistakes: [
      "Using 被 without a result or complement",
      "Overusing 被 when active voice is more natural",
      "Forgetting that agent is optional"
    ],
    faq: [
      "Must 被 be negative?", "Traditionally yes, but modern Chinese allows neutral/positive uses.",
      "What are alternatives to 被?", "让, 叫, and 给 are more colloquial: 我让他骂了."
    ],
    relatedPatterns: ["把字句 (disposal)", "让/叫 (causative)", "给 (passive)"],
    level: "HSK4",
  },
  {
    id: "gr6",
    pattern: "了 (Completion)",
    explanation: "了 after a verb indicates completion of an action. It does not indicate past tense but rather that an action has been realized or completed.",
    geo_snippet: "了 (le) is a completion particle in Chinese, placed after verbs to indicate an action has been completed or realized.",
    key_points: [
      "Verb + 了 = action completed",
      "Different from sentence-final 了 (change of state)",
      "Can be used for future completed actions",
      "Negative: 没(有) without 了",
      "Double 了 for both completion and new situation"
    ],
    examples: [
      { cn: "我吃了早饭。", en: "I ate breakfast." },
      { cn: "他买了三本书。", en: "He bought three books." },
      { cn: "我没看这个电影。", en: "I didn't watch this movie." },
      { cn: "下了课我就去。", en: "I'll go after class ends." },
    ],
    common_mistakes: [
      "Thinking 了 always means past tense",
      "Using 不 instead of 没 for negation",
      "Confusing verb 了 with sentence-final 了"
    ],
    faq: [
      "Is 了 past tense?", "No, it indicates completion, which can be past, present, or even future.",
      "When do I use 没 vs 不?", "没 for completed actions, 不 for habitual or future negation."
    ],
    relatedPatterns: ["没(有)", "过 (experience)", "sentence-final 了"],
    level: "HSK2",
  },
  {
    id: "gr7",
    pattern: "过 (Experience)",
    explanation: "过 after a verb indicates that an action has been experienced at least once before. It's about life experience, not specific past events.",
    geo_snippet: "过 (guò) is an experience particle in Chinese, indicating that someone has done something at least once in their life.",
    key_points: [
      "Verb + 过 = have experienced doing",
      "Emphasizes life experience, not specific instances",
      "Negative: 没(有) + Verb + 过",
      "Often used with 曾经 (once, ever)",
      "Cannot specify exact time with 过"
    ],
    examples: [
      { cn: "我去过中国。", en: "I have been to China." },
      { cn: "你吃过北京烤鸭吗？", en: "Have you ever eaten Peking duck?" },
      { cn: "我没见过他。", en: "I have never met him." },
      { cn: "我曾经学过法语。", en: "I once studied French." },
    ],
    common_mistakes: [
      "Using 过 with specific times (我昨天去过 ✗)",
      "Confusing 过 (experience) with 了 (completion)",
      "Using 不 instead of 没 for negation"
    ],
    faq: [
      "What's the difference between 过 and 了?", "过 is about life experience; 了 is about specific completed actions.",
      "Can I use 过 with a specific time?", "No, use 了 instead: 我昨天去了."
    ],
    relatedPatterns: ["了 (completion)", "曾经", "从来没有"],
    level: "HSK2",
  },
  {
    id: "gr8",
    pattern: "正在/在 (Progressive)",
    explanation: "正在 or 在 before a verb indicates an action is currently in progress, similar to English '-ing'.",
    geo_snippet: "正在/在 (zhèngzài/zài) marks the progressive aspect in Chinese, indicating an action currently in progress.",
    key_points: [
      "在/正在 + Verb + (呢) = action in progress",
      "正在 is more emphatic than 在 alone",
      "Often ends with 呢 in spoken Chinese",
      "Negative: 没(在) + Verb",
      "Can combine with other time expressions"
    ],
    examples: [
      { cn: "我在看书。", en: "I am reading." },
      { cn: "他正在吃饭呢。", en: "He is eating right now." },
      { cn: "她正在打电话。", en: "She is on the phone." },
      { cn: "你在做什么呢？", en: "What are you doing?" },
    ],
    common_mistakes: [
      "Using 了 with progressive (在看了 ✗)",
      "Forgetting that 呢 is optional but common",
      "Using 不 instead of 没 for negation"
    ],
    faq: [
      "What's the difference between 在 and 正在?", "正在 is more emphatic; both mean 'in the process of'.",
      "Do I need 呢 at the end?", "It's optional but makes the sentence more colloquial."
    ],
    relatedPatterns: ["呢 (modal particle)", "着 (continuous state)", "了 (completion)"],
    level: "HSK2",
  },
  {
    id: "gr9",
    pattern: "着 (Continuous State)",
    explanation: "着 after a verb indicates a continuing state resulting from an action, or an accompanying action.",
    geo_snippet: "着 (zhe) is a continuous state particle in Chinese, indicating an ongoing state or manner of an action.",
    key_points: [
      "Verb + 着 = state continues",
      "Different from 在 (ongoing action) - 着 emphasizes the resulting state",
      "Common with posture verbs: 站着, 坐着, 躺着",
      "Used for accompanying actions: Verb1着 + Verb2",
      "Negative: 没 + Verb + 着"
    ],
    examples: [
      { cn: "门开着。", en: "The door is open." },
      { cn: "他站着说话。", en: "He spoke while standing." },
      { cn: "墙上挂着一幅画。", en: "A painting is hanging on the wall." },
      { cn: "她笑着说。", en: "She said with a smile." },
    ],
    common_mistakes: [
      "Confusing 着 (state) with 在 (action in progress)",
      "Using with verbs that don't have continuous states",
      "Forgetting 着 in existential sentences"
    ],
    faq: [
      "What's the difference between 着 and 在?", "在 marks an ongoing action; 着 marks a continuing state.",
      "Can all verbs use 着?", "No, mainly verbs that can result in a visible state."
    ],
    relatedPatterns: ["在 (progressive)", "了 (completion)", "Existential sentences"],
    level: "HSK3",
  },
  {
    id: "gr10",
    pattern: "虽然...但是/可是",
    explanation: "This pattern expresses concession - acknowledging one fact while contrasting it with another. 'Although X, but Y'.",
    geo_snippet: "虽然...但是 (suīrán...dànshì) is the Chinese pattern for 'although...but', expressing concession and contrast.",
    key_points: [
      "虽然 introduces the conceded fact",
      "但是/可是/还是 introduces the main point",
      "In Chinese, both parts are typically present",
      "虽然 can be dropped in casual speech",
      "可是 is slightly more casual than 但是"
    ],
    examples: [
      { cn: "虽然很累，但是很开心。", en: "Although tired, I'm happy." },
      { cn: "虽然他年轻，可是很有经验。", en: "Although he's young, he's very experienced." },
      { cn: "虽然下雨了，我还是去了。", en: "Although it rained, I still went." },
      { cn: "虽然贵，但是值得。", en: "Although expensive, it's worth it." },
    ],
    common_mistakes: [
      "Dropping both 虽然 and 但是 (need at least one)",
      "Word order errors (但是 before 虽然)",
      "Using this pattern for simple cause-effect"
    ],
    faq: [
      "Can I drop 虽然 or 但是?", "You can drop one, but using both is clearer and more complete.",
      "What's the difference between 但是 and 可是?", "可是 is slightly more informal; they're largely interchangeable."
    ],
    relatedPatterns: ["但是", "可是", "不过", "尽管...还是"],
    level: "HSK2",
  },
  {
    id: "gr11",
    pattern: "因为...所以",
    explanation: "This pattern expresses cause and effect. 因为 introduces the reason, 所以 introduces the result.",
    geo_snippet: "因为...所以 (yīnwèi...suǒyǐ) is the standard Chinese pattern for expressing 'because...therefore' relationships.",
    key_points: [
      "因为 = because (introduces cause)",
      "所以 = so/therefore (introduces result)",
      "In spoken Chinese, one can be dropped",
      "In formal writing, both should be present",
      "因为 clause typically comes first"
    ],
    examples: [
      { cn: "因为下雨，所以我没去。", en: "Because it rained, I didn't go." },
      { cn: "因为他努力学习，所以考试考得很好。", en: "Because he studied hard, he did well on the exam." },
      { cn: "我很累，因为昨天没睡好。", en: "I'm tired because I didn't sleep well yesterday." },
      { cn: "他迟到了，所以老师批评了他。", en: "He was late, so the teacher criticized him." },
    ],
    common_mistakes: [
      "Wrong order (所以...因为)",
      "Using both with English word order",
      "Forgetting that in speech one can be omitted"
    ],
    faq: [
      "Can I use just 因为 or 所以?", "Yes, in casual speech one is often dropped.",
      "Can the result come first?", "Yes: 我没去，因为下雨了."
    ],
    relatedPatterns: ["由于", "因此", "既然...就"],
    level: "HSK2",
  },
  {
    id: "gr12",
    pattern: "如果...就",
    explanation: "This pattern expresses conditional situations. 如果 introduces the condition, 就 introduces the result.",
    geo_snippet: "如果...就 (rúguǒ...jiù) is the primary Chinese conditional pattern, meaning 'if...then'.",
    key_points: [
      "如果 = if (introduces condition)",
      "就 = then (introduces result)",
      "Condition comes before result",
      "的话 can be added after condition for emphasis",
      "要是 is a more colloquial alternative to 如果"
    ],
    examples: [
      { cn: "如果明天下雨，我就不去了。", en: "If it rains tomorrow, I won't go." },
      { cn: "如果你有问题的话，请问我。", en: "If you have questions, please ask me." },
      { cn: "如果我是你，我就不会这样做。", en: "If I were you, I wouldn't do this." },
      { cn: "要是他来，我们就开始。", en: "If he comes, we'll start." },
    ],
    common_mistakes: [
      "Forgetting 就 in the result clause",
      "Using wrong word order",
      "Confusing 如果 with 虽然"
    ],
    faq: [
      "Do I always need 就?", "It's often included but can be dropped in casual speech.",
      "What's the difference between 如果 and 要是?", "要是 is more colloquial; 如果 is more neutral/formal."
    ],
    relatedPatterns: ["要是", "假如", "只要...就", "除非...否则"],
    level: "HSK2",
  },
  {
    id: "gr13",
    pattern: "越来越",
    explanation: "越来越 + adjective means 'more and more [adjective]', expressing increasing degree over time.",
    geo_snippet: "越来越 (yuè lái yuè) means 'more and more', used with adjectives to show increasing intensity over time.",
    key_points: [
      "越来越 + Adjective = more and more adj",
      "Shows gradual change over time",
      "Can be used for positive or negative changes",
      "Related pattern: 越...越... (the more...the more...)",
      "Very common in describing trends"
    ],
    examples: [
      { cn: "天气越来越热了。", en: "The weather is getting hotter and hotter." },
      { cn: "他的中文越来越好。", en: "His Chinese is getting better and better." },
      { cn: "生活越来越方便。", en: "Life is becoming more and more convenient." },
      { cn: "问题越来越严重。", en: "The problem is getting more and more serious." },
    ],
    common_mistakes: [
      "Using 很 with 越来越 (越来越很好 ✗)",
      "Forgetting that it shows change over time",
      "Using with non-gradable adjectives"
    ],
    faq: [
      "Can I use 越来越 with verbs?", "Yes, but typically with verb phrases: 越来越喜欢.",
      "What's 越...越...?", "It means 'the more...the more': 越吃越胖."
    ],
    relatedPatterns: ["越...越...", "更", "比...更"],
    level: "HSK3",
  },
  {
    id: "gr14",
    pattern: "越...越...",
    explanation: "The 越A越B pattern means 'the more A, the more B', showing a proportional relationship between two things.",
    geo_snippet: "越...越... (yuè...yuè...) expresses 'the more...the more...', showing that as one thing increases, another does too.",
    key_points: [
      "越 + A, 越 + B = the more A, the more B",
      "A and B can be verbs, adjectives, or clauses",
      "Shows proportional or causal relationship",
      "Can describe the same subject or different subjects",
      "Very expressive and commonly used"
    ],
    examples: [
      { cn: "越吃越胖。", en: "The more you eat, the fatter you get." },
      { cn: "越学越有意思。", en: "The more you study, the more interesting it gets." },
      { cn: "他越想越生气。", en: "The more he thought about it, the angrier he got." },
      { cn: "越快越好。", en: "The faster the better." },
    ],
    common_mistakes: [
      "Using 很 or 更 with 越...越...",
      "Wrong word order in complex sentences",
      "Confusing with 越来越 (different meaning)"
    ],
    faq: [
      "How is this different from 越来越?", "越来越 shows change over time; 越...越... shows proportional relationship.",
      "Can both parts have the same subject?", "Yes: 我越想越不明白."
    ],
    relatedPatterns: ["越来越", "更", "比"],
    level: "HSK3",
  },
  {
    id: "gr15",
    pattern: "一...就...",
    explanation: "一...就... means 'as soon as' or 'once...then...', expressing that the second action happens immediately after the first.",
    geo_snippet: "一...就... (yī...jiù...) means 'as soon as' in Chinese, indicating immediate succession of two actions.",
    key_points: [
      "一 + Verb1, 就 + Verb2 = as soon as V1, V2",
      "Emphasizes immediacy between actions",
      "Can describe habitual or one-time events",
      "Subject can be the same or different",
      "Very common in daily speech"
    ],
    examples: [
      { cn: "我一到家就给你打电话。", en: "I'll call you as soon as I get home." },
      { cn: "他一看书就睡着。", en: "As soon as he reads, he falls asleep." },
      { cn: "一下雨就堵车。", en: "Whenever it rains, there's traffic." },
      { cn: "我一听就懂了。", en: "I understood as soon as I heard it." },
    ],
    common_mistakes: [
      "Forgetting 一 or 就",
      "Using wrong time reference",
      "Confusing with simple sequential actions"
    ],
    faq: [
      "Can the subjects be different?", "Yes: 他一来，我就走 (As soon as he arrives, I'll leave).",
      "Is this for one-time or repeated events?", "Both: one-time (future) or habitual patterns."
    ],
    relatedPatterns: ["就 (then)", "立刻/马上 (immediately)", "...的时候"],
    level: "HSK3",
  },
  {
    id: "gr16",
    pattern: "除了...以外",
    explanation: "除了...以外 means 'except for' or 'besides', used to express exclusion or addition depending on context.",
    geo_snippet: "除了...以外 (chúle...yǐwài) means 'except for' or 'besides', expressing exclusion or addition.",
    key_points: [
      "除了 A 以外 + 都 = everyone/everything except A",
      "除了 A 以外 + 还/也 = besides A, also",
      "以外 can be omitted in casual speech",
      "Context determines exclusive or inclusive meaning",
      "都 indicates exclusion, 还/也 indicates addition"
    ],
    examples: [
      { cn: "除了他以外，大家都来了。", en: "Everyone came except him." },
      { cn: "除了中文，我还会说英语。", en: "Besides Chinese, I can also speak English." },
      { cn: "除了周末以外，我每天都工作。", en: "I work every day except weekends." },
      { cn: "除了游泳，她还喜欢跑步。", en: "Besides swimming, she also likes running." },
    ],
    common_mistakes: [
      "Confusing exclusion (都) and addition (还/也)",
      "Forgetting that 以外 is optional",
      "Using wrong particles for the intended meaning"
    ],
    faq: [
      "How do I know if it's 'except' or 'besides'?", "都 after = except; 还/也 after = besides.",
      "Can I drop 以外?", "Yes, in casual speech: 除了他，大家都来了."
    ],
    relatedPatterns: ["都", "也", "只有...才"],
    level: "HSK3",
  },
  {
    id: "gr17",
    pattern: "不但...而且",
    explanation: "不但...而且 means 'not only...but also', used to add emphasis by building on an initial statement.",
    geo_snippet: "不但...而且 (bùdàn...érqiě) is the Chinese pattern for 'not only...but also', expressing progressive emphasis.",
    key_points: [
      "不但 A 而且 B = not only A but also B",
      "B is usually more significant than A",
      "Same subject: 他不但聪明而且勤奋",
      "Different subjects: 不但他会，而且她也会",
      "Shows progression or escalation"
    ],
    examples: [
      { cn: "他不但会说中文，而且说得很好。", en: "He not only speaks Chinese, but speaks it well." },
      { cn: "这个菜不但好吃，而且便宜。", en: "This dish is not only delicious but also cheap." },
      { cn: "不但我喜欢，而且大家都喜欢。", en: "Not only do I like it, but everyone does." },
      { cn: "她不但漂亮，而且聪明。", en: "She's not only beautiful but also smart." },
    ],
    common_mistakes: [
      "Wrong order (B should be more significant)",
      "Using with contradictory statements",
      "Forgetting to maintain parallel structure"
    ],
    faq: [
      "Does B have to be 'more' than A?", "Yes, B typically represents a higher degree or additional quality.",
      "Can the subjects be different?", "Yes, but word order changes: 不但他去，我也去."
    ],
    relatedPatterns: ["而且", "也", "还"],
    level: "HSK3",
  },
  {
    id: "gr18",
    pattern: "要是...就好了",
    explanation: "要是...就好了 expresses wishes or regrets, meaning 'It would be great if...' or 'I wish...'.",
    geo_snippet: "要是...就好了 (yàoshi...jiù hǎo le) expresses wishes and hypotheticals, meaning 'if only' or 'it would be nice if'.",
    key_points: [
      "要是 + condition + 就好了 = if only / it would be nice if",
      "Expresses wishes for unreal or unlikely situations",
      "Can express regret about the past",
      "就好了 literally means 'then it would be good'",
      "Often used for things outside one's control"
    ],
    examples: [
      { cn: "要是我会说中文就好了。", en: "It would be great if I could speak Chinese." },
      { cn: "要是不下雨就好了。", en: "If only it wouldn't rain." },
      { cn: "要是我早点知道就好了。", en: "If only I had known earlier." },
      { cn: "要是能再来一次就好了。", en: "It would be nice to come again." },
    ],
    common_mistakes: [
      "Using for realistic conditions (use 如果...就 instead)",
      "Forgetting 了 at the end",
      "Confusing with regular conditionals"
    ],
    faq: [
      "Is this for realistic situations?", "No, it's for wishes or regrets, not realistic conditions.",
      "Can I use 如果 instead of 要是?", "Yes, but 要是 is more common in this wishful pattern."
    ],
    relatedPatterns: ["如果...就", "要是", "可惜"],
    level: "HSK3",
  },
  {
    id: "gr19",
    pattern: "不管...都/也",
    explanation: "不管...都 means 'no matter...' or 'regardless of...', expressing that the result is the same under all conditions.",
    geo_snippet: "不管...都 (bùguǎn...dōu) means 'no matter what/how', expressing that the outcome remains unchanged regardless of conditions.",
    key_points: [
      "不管 + condition + 都/也 + result",
      "Emphasizes that result is unchanged",
      "Often used with question words: 谁, 什么, 怎么, 多少",
      "无论 is a more formal alternative",
      "Shows determination or inevitability"
    ],
    examples: [
      { cn: "不管多难，我都要学会。", en: "No matter how hard, I will learn it." },
      { cn: "不管谁来，我都不开门。", en: "No matter who comes, I won't open the door." },
      { cn: "不管天气怎么样，我们都去。", en: "No matter what the weather is like, we're going." },
      { cn: "不管你说什么，我也不相信。", en: "No matter what you say, I won't believe it." },
    ],
    common_mistakes: [
      "Forgetting 都 or 也 in the result clause",
      "Using with specific conditions (should be general)",
      "Confusing with 虽然...但是"
    ],
    faq: [
      "What's the difference between 不管 and 虽然?", "不管 is for hypothetical/general conditions; 虽然 acknowledges a specific fact.",
      "Is 无论 the same?", "Yes, but 无论 is more formal."
    ],
    relatedPatterns: ["无论...都", "不论", "虽然...但是"],
    level: "HSK4",
  },
  {
    id: "gr20",
    pattern: "Verb Complement 得",
    explanation: "得 after a verb introduces a complement describing the degree, result, or manner of the action.",
    geo_snippet: "得 (de) after a verb introduces complements that describe how an action is performed or to what degree.",
    key_points: [
      "Verb + 得 + Adjective/Complement",
      "Describes how well/badly something is done",
      "Very common for describing abilities",
      "Negative: Verb + 得 + 不 + Complement",
      "Different from potential 得 (得 vs 得了)"
    ],
    examples: [
      { cn: "他说中文说得很好。", en: "He speaks Chinese very well." },
      { cn: "她跑得很快。", en: "She runs very fast." },
      { cn: "我今天起得很早。", en: "I got up very early today." },
      { cn: "他写得不太清楚。", en: "He doesn't write very clearly." },
    ],
    common_mistakes: [
      "Confusing 得 with 的 and 地",
      "Forgetting to repeat the verb with objects",
      "Wrong negation pattern"
    ],
    faq: [
      "Why repeat the verb?", "With an object, verb repeats: 说中文说得好 (not 说得中文好).",
      "How is this different from 地?", "得 comes after verbs; 地 comes before verbs and after adverbs."
    ],
    relatedPatterns: ["的", "地", "可能补语"],
    level: "HSK2",
  },
  {
    id: "gr21",
    pattern: "会/能/可以 (Modal Verbs)",
    explanation: "会, 能, and 可以 are modal verbs expressing different types of ability or permission.",
    geo_snippet: "会 (huì), 能 (néng), and 可以 (kěyǐ) are Chinese modal verbs for ability and permission, each with distinct uses.",
    key_points: [
      "会 = learned ability, will (future)",
      "能 = physical ability, circumstances allow",
      "可以 = permission, possibility",
      "Negatives: 不会, 不能, 不可以",
      "Context often determines which to use"
    ],
    examples: [
      { cn: "我会说中文。", en: "I can speak Chinese. (learned ability)" },
      { cn: "他今天不能来。", en: "He can't come today. (circumstances)" },
      { cn: "这里可以抽烟吗？", en: "Can I smoke here? (permission)" },
      { cn: "明天会下雨。", en: "It will rain tomorrow. (future)" },
    ],
    common_mistakes: [
      "Using 会 for permission (should be 可以)",
      "Using 能 for learned skills (should be 会)",
      "Confusing future 会 with ability 会"
    ],
    faq: [
      "When do I use 会 vs 能?", "会 for learned skills; 能 for physical ability or circumstances.",
      "Is 可以 only for permission?", "Mostly, but it can also express possibility."
    ],
    relatedPatterns: ["应该", "必须", "得 (děi)"],
    level: "HSK1",
  },
  {
    id: "gr22",
    pattern: "方向补语 (Directional Complements)",
    explanation: "Directional complements are added after verbs to indicate the direction of movement or metaphorical direction.",
    geo_snippet: "方向补语 (fāngxiàng bǔyǔ) are directional complements in Chinese, indicating movement direction after verbs.",
    key_points: [
      "Simple: 来, 去, 上, 下, 进, 出, 回, 过, 起",
      "Compound: 上来, 下去, 出去, 进来, etc.",
      "来 = toward speaker, 去 = away from speaker",
      "Can have literal or metaphorical meanings",
      "Object placement varies by type"
    ],
    examples: [
      { cn: "他走进来了。", en: "He walked in (toward speaker)." },
      { cn: "请坐下。", en: "Please sit down." },
      { cn: "我想不起来他的名字。", en: "I can't remember his name." },
      { cn: "拿出你的书。", en: "Take out your book." },
    ],
    common_mistakes: [
      "Confusing 来 and 去 perspectives",
      "Wrong object placement in compound complements",
      "Missing metaphorical meanings"
    ],
    faq: [
      "Where does the object go?", "For places: after the first part (走进房间来). For things: varies.",
      "What's the metaphorical use?", "起来 can mean 'start to': 笑起来 = start laughing."
    ],
    relatedPatterns: ["结果补语", "可能补语", "趋向动词"],
    level: "HSK3",
  },
]

// HSK Hub Data
export interface HSKHub {
  level: HSKLevel
  title: string
  description: string
  wordCount: number
  grammarCount: number
  recommendedPath: { step: number; title: string; description: string }[]
  topWords: { word: string; pinyin: string; meaning: string }[]
  topGrammar: { pattern: string; description: string }[]
  featuredLessons: string[]
  featuredReaders: string[]
}

export const hskHubs: Record<HSKLevel, HSKHub> = {
  HSK1: {
    level: "HSK1",
    title: "HSK 1 - Beginner Chinese",
    description: "Master 150 essential words and basic sentence structures for simple daily conversations.",
    wordCount: 150,
    grammarCount: 15,
    recommendedPath: [
      { step: 1, title: "Greetings & Basics", description: "Learn to greet people and introduce yourself" },
      { step: 2, title: "Numbers & Time", description: "Count from 1-100 and tell time" },
      { step: 3, title: "Family & People", description: "Describe family members and relationships" },
      { step: 4, title: "Daily Activities", description: "Talk about daily routines and activities" },
    ],
    topWords: [
      { word: "你好", pinyin: "nǐ hǎo", meaning: "hello" },
      { word: "谢谢", pinyin: "xièxie", meaning: "thank you" },
      { word: "再见", pinyin: "zàijiàn", meaning: "goodbye" },
      { word: "是", pinyin: "shì", meaning: "to be" },
      { word: "不", pinyin: "bù", meaning: "not" },
      { word: "我", pinyin: "wǒ", meaning: "I/me" },
      { word: "你", pinyin: "nǐ", meaning: "you" },
      { word: "他", pinyin: "tā", meaning: "he/him" },
      { word: "吃", pinyin: "chī", meaning: "to eat" },
      { word: "喝", pinyin: "hē", meaning: "to drink" },
      { word: "去", pinyin: "qù", meaning: "to go" },
      { word: "来", pinyin: "lái", meaning: "to come" },
    ],
    topGrammar: [
      { pattern: "Subject + 是 + Noun", description: "Basic 'to be' sentences" },
      { pattern: "Subject + Verb + Object", description: "Basic sentence structure" },
      { pattern: "Question with 吗", description: "Yes/no questions" },
      { pattern: "会/能/可以", description: "Modal verbs for ability" },
      { pattern: "的 (possessive)", description: "Showing possession" },
      { pattern: "在 + Place", description: "Location expressions" },
    ],
    featuredLessons: ["lesson-1", "lesson-2"],
    featuredReaders: ["reader-2"],
  },
  HSK2: {
    level: "HSK2",
    title: "HSK 2 - Elementary Chinese",
    description: "Expand to 300 words and handle simple daily tasks and conversations with confidence.",
    wordCount: 300,
    grammarCount: 25,
    recommendedPath: [
      { step: 1, title: "Shopping & Money", description: "Navigate stores and handle transactions" },
      { step: 2, title: "Transportation", description: "Ask for directions and use public transit" },
      { step: 3, title: "Food & Dining", description: "Order at restaurants and discuss food" },
      { step: 4, title: "Weather & Seasons", description: "Describe weather and seasonal activities" },
    ],
    topWords: [
      { word: "因为", pinyin: "yīnwèi", meaning: "because" },
      { word: "所以", pinyin: "suǒyǐ", meaning: "so/therefore" },
      { word: "但是", pinyin: "dànshì", meaning: "but" },
      { word: "虽然", pinyin: "suīrán", meaning: "although" },
      { word: "如果", pinyin: "rúguǒ", meaning: "if" },
      { word: "已经", pinyin: "yǐjīng", meaning: "already" },
      { word: "一直", pinyin: "yīzhí", meaning: "always" },
      { word: "经常", pinyin: "jīngcháng", meaning: "often" },
      { word: "比", pinyin: "bǐ", meaning: "than" },
      { word: "得", pinyin: "de", meaning: "(complement particle)" },
      { word: "应该", pinyin: "yīnggāi", meaning: "should" },
      { word: "可能", pinyin: "kěnéng", meaning: "maybe" },
    ],
    topGrammar: [
      { pattern: "因为...所以...", description: "Cause and effect" },
      { pattern: "虽然...但是...", description: "Concession (although...but)" },
      { pattern: "如果...就...", description: "Conditional sentences" },
      { pattern: "比 (comparison)", description: "Comparing two things" },
      { pattern: "是...的", description: "Emphasizing details of past actions" },
      { pattern: "Verb + 得 + Complement", description: "Describing how actions are done" },
    ],
    featuredLessons: ["lesson-3", "lesson-4"],
    featuredReaders: ["reader-1", "reader-2"],
  },
  HSK3: {
    level: "HSK3",
    title: "HSK 3 - Intermediate Chinese",
    description: "Build fluency with 600 words and handle most everyday situations in Chinese-speaking regions.",
    wordCount: 600,
    grammarCount: 40,
    recommendedPath: [
      { step: 1, title: "Travel & Places", description: "Plan trips and describe locations" },
      { step: 2, title: "Health & Body", description: "Discuss health and visit a doctor" },
      { step: 3, title: "Work & Career", description: "Talk about jobs and the workplace" },
      { step: 4, title: "Hobbies & Interests", description: "Express preferences and discuss activities" },
    ],
    topWords: [
      { word: "了解", pinyin: "liǎojiě", meaning: "to understand" },
      { word: "决定", pinyin: "juédìng", meaning: "to decide" },
      { word: "影响", pinyin: "yǐngxiǎng", meaning: "influence" },
      { word: "改变", pinyin: "gǎibiàn", meaning: "to change" },
      { word: "提高", pinyin: "tígāo", meaning: "to improve" },
      { word: "注意", pinyin: "zhùyì", meaning: "to pay attention" },
      { word: "经验", pinyin: "jīngyàn", meaning: "experience" },
      { word: "机会", pinyin: "jīhuì", meaning: "opportunity" },
      { word: "把", pinyin: "bǎ", meaning: "(disposal particle)" },
      { word: "着", pinyin: "zhe", meaning: "(continuous state)" },
      { word: "越来越", pinyin: "yuè lái yuè", meaning: "more and more" },
      { word: "除了", pinyin: "chúle", meaning: "except/besides" },
    ],
    topGrammar: [
      { pattern: "把字句", description: "Disposal construction" },
      { pattern: "着 (continuous state)", description: "Indicating ongoing state" },
      { pattern: "越来越", description: "More and more" },
      { pattern: "越...越...", description: "The more...the more" },
      { pattern: "除了...以外", description: "Except for / besides" },
      { pattern: "一...就...", description: "As soon as" },
    ],
    featuredLessons: ["lesson-5"],
    featuredReaders: ["reader-1", "reader-3"],
  },
  HSK4: {
    level: "HSK4",
    title: "HSK 4 - Upper Intermediate Chinese",
    description: "Master 1200 words for fluent daily communication on a wide range of topics.",
    wordCount: 1200,
    grammarCount: 60,
    recommendedPath: [
      { step: 1, title: "News & Media", description: "Understand news and current events" },
      { step: 2, title: "Culture & Society", description: "Discuss cultural topics" },
      { step: 3, title: "Education & Learning", description: "Academic vocabulary and discussions" },
      { step: 4, title: "Emotions & Opinions", description: "Express complex feelings and views" },
    ],
    topWords: [
      { word: "社会", pinyin: "shèhuì", meaning: "society" },
      { word: "经济", pinyin: "jīngjì", meaning: "economy" },
      { word: "政治", pinyin: "zhèngzhì", meaning: "politics" },
      { word: "文化", pinyin: "wénhuà", meaning: "culture" },
      { word: "科技", pinyin: "kējì", meaning: "technology" },
      { word: "管理", pinyin: "guǎnlǐ", meaning: "to manage" },
      { word: "研究", pinyin: "yánjiū", meaning: "to research" },
      { word: "发展", pinyin: "fāzhǎn", meaning: "development" },
      { word: "被", pinyin: "bèi", meaning: "(passive particle)" },
      { word: "不管", pinyin: "bùguǎn", meaning: "no matter" },
      { word: "目标", pinyin: "mùbiāo", meaning: "goal" },
      { word: "效果", pinyin: "xiàoguǒ", meaning: "effect" },
    ],
    topGrammar: [
      { pattern: "被字句", description: "Passive voice" },
      { pattern: "不管...都", description: "No matter what" },
      { pattern: "不但...而且", description: "Not only...but also" },
      { pattern: "无论...都", description: "Regardless of" },
      { pattern: "即使...也", description: "Even if" },
      { pattern: "尽管...还是", description: "Despite...still" },
    ],
    featuredLessons: ["lesson-6"],
    featuredReaders: ["reader-4"],
  },
  HSK5: {
    level: "HSK5",
    title: "HSK 5 - Advanced Chinese",
    description: "Command 2500 words for professional and academic contexts with sophisticated expression.",
    wordCount: 2500,
    grammarCount: 80,
    recommendedPath: [
      { step: 1, title: "Business Chinese", description: "Professional communication" },
      { step: 2, title: "Literature & Arts", description: "Appreciate Chinese literature" },
      { step: 3, title: "Science & Technology", description: "Technical vocabulary" },
      { step: 4, title: "Philosophy & History", description: "Discuss abstract concepts" },
    ],
    topWords: [
      { word: "现象", pinyin: "xiànxiàng", meaning: "phenomenon" },
      { word: "概念", pinyin: "gàiniàn", meaning: "concept" },
      { word: "原则", pinyin: "yuánzé", meaning: "principle" },
      { word: "制度", pinyin: "zhìdù", meaning: "system" },
      { word: "趋势", pinyin: "qūshì", meaning: "trend" },
      { word: "策略", pinyin: "cèlüè", meaning: "strategy" },
      { word: "实施", pinyin: "shíshī", meaning: "to implement" },
      { word: "评估", pinyin: "pínggū", meaning: "to evaluate" },
      { word: "协调", pinyin: "xiétiáo", meaning: "to coordinate" },
      { word: "贡献", pinyin: "gòngxiàn", meaning: "contribution" },
      { word: "启发", pinyin: "qǐfā", meaning: "to inspire" },
      { word: "反映", pinyin: "fǎnyìng", meaning: "to reflect" },
    ],
    topGrammar: [
      { pattern: "以...为...", description: "Taking...as..." },
      { pattern: "之所以...是因为...", description: "The reason why...is because" },
      { pattern: "与其...不如...", description: "Rather than...better to" },
      { pattern: "要不是...就...", description: "If it weren't for...then" },
      { pattern: "别说...就是...", description: "Let alone...even" },
      { pattern: "非...不可", description: "Must, have to" },
    ],
    featuredLessons: [],
    featuredReaders: [],
  },
  HSK6: {
    level: "HSK6",
    title: "HSK 6 - Mastery Level Chinese",
    description: "Achieve near-native proficiency with 5000+ words for any context.",
    wordCount: 5000,
    grammarCount: 100,
    recommendedPath: [
      { step: 1, title: "Classical Chinese", description: "Read classical texts" },
      { step: 2, title: "Idioms & Proverbs", description: "Master chengyu and sayings" },
      { step: 3, title: "Academic Writing", description: "Formal written Chinese" },
      { step: 4, title: "Native Media", description: "Understand native content" },
    ],
    topWords: [
      { word: "深奥", pinyin: "shēn'ào", meaning: "profound" },
      { word: "抽象", pinyin: "chōuxiàng", meaning: "abstract" },
      { word: "体裁", pinyin: "tǐcái", meaning: "genre" },
      { word: "隐喻", pinyin: "yǐnyù", meaning: "metaphor" },
      { word: "典故", pinyin: "diǎngù", meaning: "allusion" },
      { word: "韵律", pinyin: "yùnlǜ", meaning: "rhythm" },
      { word: "造诣", pinyin: "zàoyì", meaning: "attainment" },
      { word: "渊博", pinyin: "yuānbó", meaning: "erudite" },
      { word: "精髓", pinyin: "jīngsuǐ", meaning: "essence" },
      { word: "底蕴", pinyin: "dǐyùn", meaning: "foundation" },
      { word: "内涵", pinyin: "nèihán", meaning: "connotation" },
      { word: "演绎", pinyin: "yǎnyì", meaning: "to deduce" },
    ],
    topGrammar: [
      { pattern: "何尝不...", description: "How could it not be..." },
      { pattern: "与其说...不如说...", description: "Rather than say...it's better to say" },
      { pattern: "岂止...简直...", description: "Not just...but actually" },
      { pattern: "固然...但...", description: "Admittedly...but" },
      { pattern: "鉴于", description: "In view of, given that" },
      { pattern: "有鉴于此", description: "In light of this" },
    ],
    featuredLessons: [],
    featuredReaders: [],
  },
}

// User Preferences (for Account page)
export interface UserPreferences {
  showPinyin: boolean
  showTranslation: boolean
  script: "simplified" | "traditional"
  theme: "dark" | "light" | "system"
  dailyGoalMinutes: number
}

export const defaultPreferences: UserPreferences = {
  showPinyin: true,
  showTranslation: true,
  script: "simplified",
  theme: "dark",
  dailyGoalMinutes: 30,
}

export interface ConnectedAccount {
  provider: "google" | "github"
  connected: boolean
  email?: string
}

export const mockConnectedAccounts: ConnectedAccount[] = [
  { provider: "google", connected: true, email: "alex.chen@gmail.com" },
  { provider: "github", connected: false },
]
