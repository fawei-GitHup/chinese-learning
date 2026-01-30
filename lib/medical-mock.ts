// Medical Chinese mock data

export type MedicalCategory = 'registration' | 'triage' | 'consultation' | 'tests' | 'pharmacy' | 'billing'
export type LexiconCategory = 'symptom' | 'body' | 'department' | 'test' | 'medicine' | 'time' | 'insurance' | 'history'
export type WarningType = 'caution' | 'urgent_language'
export type IntentType = 'describe_pain' | 'duration' | 'severity' | 'allergy' | 'med_history' | 'past_history' | 'ask_explanation' | 'ask_result' | 'pharmacy_instructions' | 'location'

export interface ConversationLine {
  role: 'patient' | 'doctor' | 'nurse'
  zh: string
  pinyin: string
  en: string
}

export interface KeyPhrase {
  zh: string
  pinyin: string
  en: string
  intentTag: string
}

export interface Warning {
  type: WarningType
  zh: string
  en: string
}

export interface MedicalScenario {
  id: string
  category: MedicalCategory
  title_en: string
  title_zh: string
  level: 'HSK2' | 'HSK3' | 'HSK4' | 'HSK5' | 'HSK6'
  chief_complaint_zh: string
  chief_complaint_en: string
  conversation: ConversationLine[]
  key_phrases: KeyPhrase[]
  vocab_focus: string[]
  warnings: Warning[]
  related_grammar: string[]
}

export interface Collocation {
  zh: string
  pinyin: string
  en: string
}

export interface Example {
  cn: string
  en: string
  pinyin?: string
}

export interface SayItLike {
  zh: string
  en: string
}

export interface DontSay {
  zh: string
  en: string
  reason: string
}

export interface MedicalWord {
  id: string
  word: string
  pinyin: string
  meanings_en: string[]
  category: LexiconCategory
  collocations: Collocation[]
  examples: Example[]
  geo_snippet: string
  key_points: string[]
  faq?: { q: string; a: string }[]
  say_it_like: SayItLike[]
  dont_say: DontSay[]
  relatedWords: string[]
}

export interface MedicalGrammarPattern {
  id: string
  pattern: string
  level: 'HSK2' | 'HSK3' | 'HSK4' | 'HSK5' | 'HSK6'
  explanation_en: string
  geo_snippet: string
  key_points: string[]
  examples: { cn: string; en: string }[]
  common_mistakes: string[]
  faq?: { q: string; a: string }[]
  clinic_templates: { intent: IntentType; zh: string; en: string }[]
  relatedWords: string[]
}

export interface PhraseTemplate {
  zh: string
  pinyin: string
  en: string
  slots: Record<string, string>
}

export interface IntentTip {
  zh: string
  en: string
}

export interface MedicalIntent {
  intent: string
  title: string
  templates: PhraseTemplate[]
  tips: IntentTip[]
}

export interface DoctorChecklistItem {
  id: string
  label_en: string
  label_zh: string
  question_zh: string
  question_pinyin: string
  question_en: string
  answer_template_zh: string
  answer_template_en: string
}

// ============================================================
// MEDICAL SCENARIOS (12+)
// ============================================================

export const medicalScenarios: MedicalScenario[] = [
  {
    id: "ms1",
    category: "registration",
    title_en: "Hospital Registration",
    title_zh: "医院挂号",
    level: "HSK3",
    chief_complaint_zh: "我想挂内科",
    chief_complaint_en: "I want to register for internal medicine",
    conversation: [
      { role: "patient", zh: "你好，我想挂号。", pinyin: "Nǐ hǎo, wǒ xiǎng guàhào.", en: "Hello, I'd like to register." },
      { role: "nurse", zh: "好的，请问您看哪个科？", pinyin: "Hǎo de, qǐngwèn nín kàn nǎge kē?", en: "Okay, which department would you like to see?" },
      { role: "patient", zh: "我想看内科。", pinyin: "Wǒ xiǎng kàn nèikē.", en: "I'd like to see internal medicine." },
      { role: "nurse", zh: "请问您有医保卡吗？", pinyin: "Qǐngwèn nín yǒu yībǎo kǎ ma?", en: "Do you have a medical insurance card?" },
      { role: "patient", zh: "有，在这里。", pinyin: "Yǒu, zài zhèlǐ.", en: "Yes, here it is." },
      { role: "nurse", zh: "好的，挂号费是十五块。请在二楼等候。", pinyin: "Hǎo de, guàhào fèi shì shíwǔ kuài. Qǐng zài èr lóu děnghòu.", en: "Okay, the registration fee is 15 yuan. Please wait on the second floor." },
    ],
    key_phrases: [
      { zh: "挂号", pinyin: "guàhào", en: "register", intentTag: "registration" },
      { zh: "看哪个科", pinyin: "kàn nǎge kē", en: "which department", intentTag: "department" },
      { zh: "医保卡", pinyin: "yībǎo kǎ", en: "medical insurance card", intentTag: "insurance" },
    ],
    vocab_focus: ["mw1", "mw2", "mw3"],
    warnings: [
      { type: "caution", zh: "挂号费因医院和科室不同而异", en: "Registration fees vary by hospital and department" },
    ],
    related_grammar: ["mg1", "mg2"],
  },
  {
    id: "ms2",
    category: "triage",
    title_en: "Emergency Triage",
    title_zh: "急诊分诊",
    level: "HSK4",
    chief_complaint_zh: "我肚子很痛",
    chief_complaint_en: "My stomach hurts badly",
    conversation: [
      { role: "nurse", zh: "您好，请问哪里不舒服？", pinyin: "Nín hǎo, qǐngwèn nǎlǐ bù shūfu?", en: "Hello, where do you feel unwell?" },
      { role: "patient", zh: "我肚子很痛，痛了三个小时了。", pinyin: "Wǒ dùzi hěn tòng, tòng le sān ge xiǎoshí le.", en: "My stomach hurts badly, it's been hurting for three hours." },
      { role: "nurse", zh: "疼痛是持续的还是一阵一阵的？", pinyin: "Téngtòng shì chíxù de háishi yí zhèn yí zhèn de?", en: "Is the pain constant or does it come and go?" },
      { role: "patient", zh: "一阵一阵的，而且越来越厉害。", pinyin: "Yí zhèn yí zhèn de, érqiě yuè lái yuè lìhai.", en: "It comes and goes, and it's getting worse." },
      { role: "nurse", zh: "有没有恶心或者呕吐？", pinyin: "Yǒu méiyǒu ěxīn huòzhě ǒutù?", en: "Do you have nausea or vomiting?" },
      { role: "patient", zh: "有点恶心，但是没有吐。", pinyin: "Yǒudiǎn ěxīn, dànshì méiyǒu tù.", en: "A little nauseous, but I haven't vomited." },
      { role: "nurse", zh: "好的，您先量一下体温，然后我带您去看医生。", pinyin: "Hǎo de, nín xiān liáng yíxià tǐwēn, ránhòu wǒ dài nín qù kàn yīshēng.", en: "Okay, let me take your temperature first, then I'll take you to see the doctor." },
    ],
    key_phrases: [
      { zh: "哪里不舒服", pinyin: "nǎlǐ bù shūfu", en: "where do you feel unwell", intentTag: "location" },
      { zh: "持续的", pinyin: "chíxù de", en: "constant/continuous", intentTag: "duration" },
      { zh: "一阵一阵的", pinyin: "yí zhèn yí zhèn de", en: "intermittent", intentTag: "describe_pain" },
      { zh: "越来越厉害", pinyin: "yuè lái yuè lìhai", en: "getting worse", intentTag: "severity" },
    ],
    vocab_focus: ["mw4", "mw5", "mw6", "mw7"],
    warnings: [
      { type: "urgent_language", zh: "剧烈腹痛需要立即就医", en: "Severe abdominal pain requires immediate medical attention" },
    ],
    related_grammar: ["mg3", "mg4", "mg5"],
  },
  {
    id: "ms3",
    category: "consultation",
    title_en: "Headache Consultation",
    title_zh: "头痛问诊",
    level: "HSK3",
    chief_complaint_zh: "我头痛",
    chief_complaint_en: "I have a headache",
    conversation: [
      { role: "doctor", zh: "请坐。您哪里不舒服？", pinyin: "Qǐng zuò. Nín nǎlǐ bù shūfu?", en: "Please sit down. What seems to be the problem?" },
      { role: "patient", zh: "医生，我头很痛。", pinyin: "Yīshēng, wǒ tóu hěn tòng.", en: "Doctor, I have a bad headache." },
      { role: "doctor", zh: "头痛多长时间了？", pinyin: "Tóu tòng duō cháng shíjiān le?", en: "How long have you had this headache?" },
      { role: "patient", zh: "大概两天了。", pinyin: "Dàgài liǎng tiān le.", en: "About two days." },
      { role: "doctor", zh: "是整个头痛还是某个部位？", pinyin: "Shì zhěnggè tóu tòng háishi mǒu ge bùwèi?", en: "Does your whole head hurt or just a specific area?" },
      { role: "patient", zh: "主要是前额和太阳穴。", pinyin: "Zhǔyào shì qián'é hé tàiyángxué.", en: "Mainly my forehead and temples." },
      { role: "doctor", zh: "最近睡眠怎么样？有没有压力？", pinyin: "Zuìjìn shuìmián zěnmeyàng? Yǒu méiyǒu yālì?", en: "How's your sleep recently? Are you under stress?" },
      { role: "patient", zh: "睡得不太好，工作压力比较大。", pinyin: "Shuì de bú tài hǎo, gōngzuò yālì bǐjiào dà.", en: "Not sleeping well, work is quite stressful." },
    ],
    key_phrases: [
      { zh: "头痛", pinyin: "tóu tòng", en: "headache", intentTag: "describe_pain" },
      { zh: "多长时间", pinyin: "duō cháng shíjiān", en: "how long", intentTag: "duration" },
      { zh: "某个部位", pinyin: "mǒu ge bùwèi", en: "specific area", intentTag: "location" },
    ],
    vocab_focus: ["mw8", "mw9", "mw10"],
    warnings: [
      { type: "caution", zh: "持续剧烈头痛应该做进一步检查", en: "Persistent severe headaches should be further examined" },
    ],
    related_grammar: ["mg2", "mg6"],
  },
  {
    id: "ms4",
    category: "consultation",
    title_en: "Cold and Flu Symptoms",
    title_zh: "感冒症状",
    level: "HSK2",
    chief_complaint_zh: "我感冒了",
    chief_complaint_en: "I have a cold",
    conversation: [
      { role: "doctor", zh: "您好，请问有什么症状？", pinyin: "Nín hǎo, qǐngwèn yǒu shénme zhèngzhuàng?", en: "Hello, what symptoms do you have?" },
      { role: "patient", zh: "我流鼻涕，还有点咳嗽。", pinyin: "Wǒ liú bítì, hái yǒudiǎn késou.", en: "I have a runny nose and a bit of a cough." },
      { role: "doctor", zh: "发烧吗？", pinyin: "Fāshāo ma?", en: "Do you have a fever?" },
      { role: "patient", zh: "有一点，昨天晚上三十七度五。", pinyin: "Yǒu yìdiǎn, zuótiān wǎnshang sānshíqī dù wǔ.", en: "A little, 37.5 degrees last night." },
      { role: "doctor", zh: "喉咙痛吗？", pinyin: "Hóulóng tòng ma?", en: "Do you have a sore throat?" },
      { role: "patient", zh: "有点痛，吞咽的时候不舒服。", pinyin: "Yǒudiǎn tòng, tūnyàn de shíhou bù shūfu.", en: "A bit sore, uncomfortable when swallowing." },
      { role: "doctor", zh: "我给您开点感冒药和消炎药。", pinyin: "Wǒ gěi nín kāi diǎn gǎnmào yào hé xiāoyán yào.", en: "I'll prescribe some cold medicine and anti-inflammatory medicine." },
    ],
    key_phrases: [
      { zh: "流鼻涕", pinyin: "liú bítì", en: "runny nose", intentTag: "describe_pain" },
      { zh: "咳嗽", pinyin: "késou", en: "cough", intentTag: "describe_pain" },
      { zh: "发烧", pinyin: "fāshāo", en: "fever", intentTag: "describe_pain" },
    ],
    vocab_focus: ["mw11", "mw12", "mw13", "mw14"],
    warnings: [],
    related_grammar: ["mg7", "mg8"],
  },
  {
    id: "ms5",
    category: "tests",
    title_en: "Blood Test",
    title_zh: "验血检查",
    level: "HSK4",
    chief_complaint_zh: "我来抽血",
    chief_complaint_en: "I'm here for a blood test",
    conversation: [
      { role: "nurse", zh: "请问您是来抽血的吗？", pinyin: "Qǐngwèn nín shì lái chōuxuè de ma?", en: "Are you here for a blood test?" },
      { role: "patient", zh: "是的，医生让我做血常规和肝功能检查。", pinyin: "Shì de, yīshēng ràng wǒ zuò xuè chángguī hé gān gōngnéng jiǎnchá.", en: "Yes, the doctor asked me to do a routine blood test and liver function test." },
      { role: "nurse", zh: "好的，请问您今天空腹吗？", pinyin: "Hǎo de, qǐngwèn nín jīntiān kōngfù ma?", en: "Okay, have you fasted today?" },
      { role: "patient", zh: "是的，我早上没有吃东西。", pinyin: "Shì de, wǒ zǎoshang méiyǒu chī dōngxi.", en: "Yes, I didn't eat anything this morning." },
      { role: "nurse", zh: "请把袖子卷起来，握紧拳头。", pinyin: "Qǐng bǎ xiùzi juǎn qǐlái, wò jǐn quántou.", en: "Please roll up your sleeve and make a fist." },
      { role: "patient", zh: "好的。结果什么时候能出来？", pinyin: "Hǎo de. Jiéguǒ shénme shíhou néng chūlái?", en: "Okay. When will the results be ready?" },
      { role: "nurse", zh: "下午三点以后可以取报告。", pinyin: "Xiàwǔ sān diǎn yǐhòu kěyǐ qǔ bàogào.", en: "You can pick up the report after 3 PM." },
    ],
    key_phrases: [
      { zh: "抽血", pinyin: "chōuxuè", en: "draw blood", intentTag: "test" },
      { zh: "血常规", pinyin: "xuè chángguī", en: "routine blood test", intentTag: "test" },
      { zh: "空腹", pinyin: "kōngfù", en: "fasting", intentTag: "test" },
    ],
    vocab_focus: ["mw15", "mw16", "mw17"],
    warnings: [
      { type: "caution", zh: "某些检查需要空腹8-12小时", en: "Some tests require 8-12 hours of fasting" },
    ],
    related_grammar: ["mg9", "mg10"],
  },
  {
    id: "ms6",
    category: "pharmacy",
    title_en: "Picking Up Medication",
    title_zh: "药房取药",
    level: "HSK3",
    chief_complaint_zh: "我来取药",
    chief_complaint_en: "I'm here to pick up medication",
    conversation: [
      { role: "patient", zh: "你好，我来取药。", pinyin: "Nǐ hǎo, wǒ lái qǔ yào.", en: "Hello, I'm here to pick up my medication." },
      { role: "nurse", zh: "请把处方给我看一下。", pinyin: "Qǐng bǎ chǔfāng gěi wǒ kàn yíxià.", en: "Please let me see your prescription." },
      { role: "patient", zh: "给你。", pinyin: "Gěi nǐ.", en: "Here you go." },
      { role: "nurse", zh: "好的，请稍等。这是您的药，一共三种。", pinyin: "Hǎo de, qǐng shāo děng. Zhè shì nín de yào, yígòng sān zhǒng.", en: "Okay, please wait a moment. Here's your medication, three types in total." },
      { role: "patient", zh: "请问怎么吃？", pinyin: "Qǐngwèn zěnme chī?", en: "How should I take them?" },
      { role: "nurse", zh: "这个一天三次，每次两片，饭后吃。这个一天一次，睡前吃。", pinyin: "Zhège yì tiān sān cì, měi cì liǎng piàn, fàn hòu chī. Zhège yì tiān yí cì, shuì qián chī.", en: "This one three times a day, two tablets each time, after meals. This one once a day, before bed." },
      { role: "patient", zh: "有什么需要注意的吗？", pinyin: "Yǒu shénme xūyào zhùyì de ma?", en: "Is there anything I need to be aware of?" },
      { role: "nurse", zh: "吃药期间不要喝酒，如果有过敏反应请立即停药。", pinyin: "Chī yào qījiān búyào hē jiǔ, rúguǒ yǒu guòmǐn fǎnyìng qǐng lìjí tíng yào.", en: "Don't drink alcohol while taking the medication. If you have an allergic reaction, stop taking it immediately." },
    ],
    key_phrases: [
      { zh: "取药", pinyin: "qǔ yào", en: "pick up medication", intentTag: "pharmacy" },
      { zh: "处方", pinyin: "chǔfāng", en: "prescription", intentTag: "pharmacy" },
      { zh: "饭后吃", pinyin: "fàn hòu chī", en: "take after meals", intentTag: "pharmacy_instructions" },
      { zh: "过敏反应", pinyin: "guòmǐn fǎnyìng", en: "allergic reaction", intentTag: "allergy" },
    ],
    vocab_focus: ["mw18", "mw19", "mw20", "mw21"],
    warnings: [
      { type: "urgent_language", zh: "如有严重过敏反应请立即就医", en: "Seek immediate medical attention for severe allergic reactions" },
    ],
    related_grammar: ["mg11", "mg12"],
  },
  {
    id: "ms7",
    category: "billing",
    title_en: "Medical Bill Payment",
    title_zh: "医疗费用结算",
    level: "HSK3",
    chief_complaint_zh: "我来结账",
    chief_complaint_en: "I'm here to pay",
    conversation: [
      { role: "patient", zh: "你好，我来结账。", pinyin: "Nǐ hǎo, wǒ lái jiézhàng.", en: "Hello, I'm here to pay my bill." },
      { role: "nurse", zh: "请把您的就诊卡给我。", pinyin: "Qǐng bǎ nín de jiùzhěn kǎ gěi wǒ.", en: "Please give me your patient card." },
      { role: "patient", zh: "给你。请问一共多少钱？", pinyin: "Gěi nǐ. Qǐngwèn yígòng duōshao qián?", en: "Here you go. How much is it in total?" },
      { role: "nurse", zh: "挂号费十五元，检查费两百元，药费一百五十元，一共三百六十五元。", pinyin: "Guàhào fèi shíwǔ yuán, jiǎnchá fèi liǎng bǎi yuán, yào fèi yìbǎi wǔshí yuán, yígòng sānbǎi liùshíwǔ yuán.", en: "Registration fee 15 yuan, examination fee 200 yuan, medication fee 150 yuan, total 365 yuan." },
      { role: "patient", zh: "可以用医保吗？", pinyin: "Kěyǐ yòng yībǎo ma?", en: "Can I use medical insurance?" },
      { role: "nurse", zh: "可以，医保报销百分之七十，您自付一百零九元五角。", pinyin: "Kěyǐ, yībǎo bàoxiāo bǎifēnzhī qīshí, nín zìfù yìbǎi líng jiǔ yuán wǔ jiǎo.", en: "Yes, insurance covers 70%, you pay 109.5 yuan." },
    ],
    key_phrases: [
      { zh: "结账", pinyin: "jiézhàng", en: "pay the bill", intentTag: "billing" },
      { zh: "就诊卡", pinyin: "jiùzhěn kǎ", en: "patient card", intentTag: "insurance" },
      { zh: "报销", pinyin: "bàoxiāo", en: "reimburse", intentTag: "insurance" },
    ],
    vocab_focus: ["mw22", "mw23", "mw24"],
    warnings: [],
    related_grammar: ["mg13"],
  },
  {
    id: "ms8",
    category: "consultation",
    title_en: "Back Pain Consultation",
    title_zh: "腰痛问诊",
    level: "HSK4",
    chief_complaint_zh: "我腰很痛",
    chief_complaint_en: "My lower back hurts",
    conversation: [
      { role: "doctor", zh: "您好，请问哪里不舒服？", pinyin: "Nín hǎo, qǐngwèn nǎlǐ bù shūfu?", en: "Hello, what's bothering you?" },
      { role: "patient", zh: "医生，我腰痛，特别是弯腰的时候。", pinyin: "Yīshēng, wǒ yāo tòng, tèbié shì wānyāo de shíhou.", en: "Doctor, my lower back hurts, especially when I bend over." },
      { role: "doctor", zh: "痛了多久了？", pinyin: "Tòng le duō jiǔ le?", en: "How long has it been hurting?" },
      { role: "patient", zh: "大概一个星期了。", pinyin: "Dàgài yí ge xīngqī le.", en: "About a week." },
      { role: "doctor", zh: "是突然开始痛的还是慢慢加重的？", pinyin: "Shì tūrán kāishǐ tòng de háishi mànman jiāzhòng de?", en: "Did it start suddenly or gradually get worse?" },
      { role: "patient", zh: "慢慢加重的，可能是我坐太久了。", pinyin: "Mànman jiāzhòng de, kěnéng shì wǒ zuò tài jiǔ le.", en: "Gradually got worse, probably because I sit too long." },
      { role: "doctor", zh: "腿有没有麻木或者发软的感觉？", pinyin: "Tuǐ yǒu méiyǒu mámù huòzhě fā ruǎn de gǎnjué?", en: "Do your legs feel numb or weak?" },
      { role: "patient", zh: "有时候左腿有点麻。", pinyin: "Yǒu shíhou zuǒ tuǐ yǒudiǎn má.", en: "Sometimes my left leg feels a bit numb." },
    ],
    key_phrases: [
      { zh: "腰痛", pinyin: "yāo tòng", en: "lower back pain", intentTag: "describe_pain" },
      { zh: "弯腰", pinyin: "wānyāo", en: "bend over", intentTag: "describe_pain" },
      { zh: "麻木", pinyin: "mámù", en: "numbness", intentTag: "describe_pain" },
    ],
    vocab_focus: ["mw25", "mw26", "mw27"],
    warnings: [
      { type: "caution", zh: "腿部麻木可能提示神经问题", en: "Leg numbness may indicate nerve issues" },
    ],
    related_grammar: ["mg14", "mg15"],
  },
  {
    id: "ms9",
    category: "consultation",
    title_en: "Allergy Discussion",
    title_zh: "过敏问诊",
    level: "HSK4",
    chief_complaint_zh: "我好像过敏了",
    chief_complaint_en: "I think I'm having an allergic reaction",
    conversation: [
      { role: "doctor", zh: "您好，请问有什么问题？", pinyin: "Nín hǎo, qǐngwèn yǒu shénme wèntí?", en: "Hello, what's the problem?" },
      { role: "patient", zh: "我身上起了很多红疹，很痒。", pinyin: "Wǒ shēnshang qǐ le hěn duō hóng zhěn, hěn yǎng.", en: "I have a lot of red rashes on my body, and they're very itchy." },
      { role: "doctor", zh: "是从什么时候开始的？", pinyin: "Shì cóng shénme shíhou kāishǐ de?", en: "When did it start?" },
      { role: "patient", zh: "今天早上吃完早饭以后。", pinyin: "Jīntiān zǎoshang chī wán zǎofàn yǐhòu.", en: "This morning after breakfast." },
      { role: "doctor", zh: "早饭吃了什么？", pinyin: "Zǎofàn chī le shénme?", en: "What did you have for breakfast?" },
      { role: "patient", zh: "牛奶、鸡蛋和虾。", pinyin: "Niúnǎi, jīdàn hé xiā.", en: "Milk, eggs, and shrimp." },
      { role: "doctor", zh: "您以前对这些食物过敏吗？", pinyin: "Nín yǐqián duì zhèxiē shíwù guòmǐn ma?", en: "Have you been allergic to these foods before?" },
      { role: "patient", zh: "以前没有，这是第一次。", pinyin: "Yǐqián méiyǒu, zhè shì dì yī cì.", en: "No, this is the first time." },
    ],
    key_phrases: [
      { zh: "过敏", pinyin: "guòmǐn", en: "allergy/allergic", intentTag: "allergy" },
      { zh: "红疹", pinyin: "hóng zhěn", en: "red rash", intentTag: "describe_pain" },
      { zh: "痒", pinyin: "yǎng", en: "itchy", intentTag: "describe_pain" },
    ],
    vocab_focus: ["mw28", "mw29", "mw30"],
    warnings: [
      { type: "urgent_language", zh: "严重过敏（呼吸困难、喉咙肿胀）需立即急救", en: "Severe allergies (breathing difficulty, throat swelling) require immediate emergency care" },
    ],
    related_grammar: ["mg16", "mg17"],
  },
  {
    id: "ms10",
    category: "consultation",
    title_en: "Diabetes Follow-up",
    title_zh: "糖尿病复诊",
    level: "HSK5",
    chief_complaint_zh: "我来复诊",
    chief_complaint_en: "I'm here for a follow-up",
    conversation: [
      { role: "doctor", zh: "王先生，您好，最近血糖控制得怎么样？", pinyin: "Wáng xiānsheng, nín hǎo, zuìjìn xuètáng kòngzhì de zěnmeyàng?", en: "Mr. Wang, hello, how has your blood sugar been recently?" },
      { role: "patient", zh: "医生，空腹血糖大概在7到8之间。", pinyin: "Yīshēng, kōngfù xuètáng dàgài zài qī dào bā zhījiān.", en: "Doctor, my fasting blood sugar is around 7 to 8." },
      { role: "doctor", zh: "比上次有进步。您有按时吃药吗？", pinyin: "Bǐ shàng cì yǒu jìnbù. Nín yǒu ànshí chī yào ma?", en: "That's an improvement from last time. Have you been taking your medication on time?" },
      { role: "patient", zh: "有的，每天早晚各一次。", pinyin: "Yǒu de, měi tiān zǎo wǎn gè yí cì.", en: "Yes, once in the morning and once in the evening." },
      { role: "doctor", zh: "饮食方面有注意吗？", pinyin: "Yǐnshí fāngmiàn yǒu zhùyì ma?", en: "Have you been watching your diet?" },
      { role: "patient", zh: "我尽量少吃甜食和淀粉。", pinyin: "Wǒ jǐnliàng shǎo chī tiánshí hé diànfěn.", en: "I try to eat less sweets and starch." },
      { role: "doctor", zh: "很好，继续保持。我们今天再做个糖化血红蛋白检查。", pinyin: "Hěn hǎo, jìxù bǎochí. Wǒmen jīntiān zài zuò ge tánghuà xuèhóngdànbái jiǎnchá.", en: "Good, keep it up. Let's do an HbA1c test today." },
    ],
    key_phrases: [
      { zh: "血糖", pinyin: "xuètáng", en: "blood sugar", intentTag: "test" },
      { zh: "复诊", pinyin: "fùzhěn", en: "follow-up visit", intentTag: "registration" },
      { zh: "糖化血红蛋白", pinyin: "tánghuà xuèhóngdànbái", en: "HbA1c", intentTag: "test" },
    ],
    vocab_focus: ["mw31", "mw32", "mw33"],
    warnings: [
      { type: "caution", zh: "糖尿病需要长期管理和定期检查", en: "Diabetes requires long-term management and regular check-ups" },
    ],
    related_grammar: ["mg18", "mg19"],
  },
  {
    id: "ms11",
    category: "consultation",
    title_en: "Pediatric Visit - Child's Fever",
    title_zh: "儿科就诊 - 孩子发烧",
    level: "HSK3",
    chief_complaint_zh: "孩子发烧",
    chief_complaint_en: "My child has a fever",
    conversation: [
      { role: "doctor", zh: "您好，孩子怎么了？", pinyin: "Nín hǎo, háizi zěnme le?", en: "Hello, what's wrong with your child?" },
      { role: "patient", zh: "医生，他从昨天开始发烧，今天早上三十九度。", pinyin: "Yīshēng, tā cóng zuótiān kāishǐ fāshāo, jīntiān zǎoshang sānshíjiǔ dù.", en: "Doctor, he's had a fever since yesterday, 39 degrees this morning." },
      { role: "doctor", zh: "除了发烧还有其他症状吗？", pinyin: "Chúle fāshāo hái yǒu qítā zhèngzhuàng ma?", en: "Besides the fever, are there any other symptoms?" },
      { role: "patient", zh: "有点咳嗽，鼻子也有点塞。", pinyin: "Yǒudiǎn késou, bízi yě yǒudiǎn sāi.", en: "A bit of coughing, and his nose is a bit stuffed." },
      { role: "doctor", zh: "吃饭睡觉怎么样？", pinyin: "Chīfàn shuìjiào zěnmeyàng?", en: "How's his eating and sleeping?" },
      { role: "patient", zh: "不太想吃东西，晚上睡不好。", pinyin: "Bú tài xiǎng chī dōngxi, wǎnshang shuì bù hǎo.", en: "He doesn't want to eat much, and he's not sleeping well at night." },
      { role: "doctor", zh: "我先检查一下，请让孩子张嘴说'啊'。", pinyin: "Wǒ xiān jiǎnchá yíxià, qǐng ràng háizi zhāng zuǐ shuō 'ā'.", en: "Let me examine him first. Please have the child open his mouth and say 'ah'." },
    ],
    key_phrases: [
      { zh: "发烧", pinyin: "fāshāo", en: "have a fever", intentTag: "describe_pain" },
      { zh: "鼻塞", pinyin: "bí sāi", en: "stuffy nose", intentTag: "describe_pain" },
      { zh: "检查一下", pinyin: "jiǎnchá yíxià", en: "examine", intentTag: "test" },
    ],
    vocab_focus: ["mw34", "mw35", "mw36"],
    warnings: [
      { type: "urgent_language", zh: "高烧持续不退或出现惊厥需立即就医", en: "Persistent high fever or seizures require immediate medical attention" },
    ],
    related_grammar: ["mg20", "mg21"],
  },
  {
    id: "ms12",
    category: "tests",
    title_en: "X-ray Examination",
    title_zh: "X光检查",
    level: "HSK4",
    chief_complaint_zh: "我来拍X光",
    chief_complaint_en: "I'm here for an X-ray",
    conversation: [
      { role: "nurse", zh: "请问您是来做X光检查的吗？", pinyin: "Qǐngwèn nín shì lái zuò X guāng jiǎnchá de ma?", en: "Are you here for an X-ray?" },
      { role: "patient", zh: "是的，医生让我拍胸部X光。", pinyin: "Shì de, yīshēng ràng wǒ pāi xiōngbù X guāng.", en: "Yes, the doctor asked me to get a chest X-ray." },
      { role: "nurse", zh: "好的，请问您有没有怀孕？", pinyin: "Hǎo de, qǐngwèn nín yǒu méiyǒu huáiyùn?", en: "Okay, are you pregnant?" },
      { role: "patient", zh: "没有。", pinyin: "Méiyǒu.", en: "No." },
      { role: "nurse", zh: "请把身上的金属物品都取下来，包括手机、钥匙和项链。", pinyin: "Qǐng bǎ shēnshang de jīnshǔ wùpǐn dōu qǔ xiàlái, bāokuò shǒujī, yàoshi hé xiàngliàn.", en: "Please remove all metal objects, including your phone, keys, and necklace." },
      { role: "patient", zh: "好的，都取下来了。", pinyin: "Hǎo de, dōu qǔ xiàlái le.", en: "Okay, I've removed everything." },
      { role: "nurse", zh: "请站在这里，深吸一口气，屏住呼吸。", pinyin: "Qǐng zhàn zài zhèlǐ, shēn xī yì kǒu qì, bǐng zhù hūxī.", en: "Please stand here, take a deep breath, and hold it." },
    ],
    key_phrases: [
      { zh: "X光检查", pinyin: "X guāng jiǎnchá", en: "X-ray examination", intentTag: "test" },
      { zh: "怀孕", pinyin: "huáiyùn", en: "pregnant", intentTag: "past_history" },
      { zh: "深吸一口气", pinyin: "shēn xī yì kǒu qì", en: "take a deep breath", intentTag: "test" },
    ],
    vocab_focus: ["mw37", "mw38", "mw39"],
    warnings: [
      { type: "caution", zh: "孕妇应避免X光检查", en: "Pregnant women should avoid X-ray examinations" },
    ],
    related_grammar: ["mg22", "mg23"],
  },
]

// ============================================================
// MEDICAL LEXICON (80+ words)
// ============================================================

export const medicalLexicon: MedicalWord[] = [
  {
    id: "mw1",
    word: "挂号",
    pinyin: "guàhào",
    meanings_en: ["to register (at a hospital)", "registration"],
    category: "department",
    collocations: [
      { zh: "网上挂号", pinyin: "wǎngshàng guàhào", en: "online registration" },
      { zh: "挂号费", pinyin: "guàhào fèi", en: "registration fee" },
    ],
    examples: [
      { cn: "我想挂号看病。", en: "I'd like to register to see a doctor.", pinyin: "Wǒ xiǎng guàhào kànbìng." },
    ],
    geo_snippet: "Guàhào (挂号) means to register at a hospital in Chinese. It is the first step when visiting a Chinese hospital.",
    key_points: [
      "First step when visiting any Chinese hospital",
      "Can be done online or at the hospital window",
      "Registration fee varies by department and hospital tier",
      "Need to bring ID or medical insurance card",
    ],
    faq: [
      { q: "Can I register online?", a: "Yes, most major hospitals in China have online registration systems." },
    ],
    say_it_like: [
      { zh: "我要看医生", en: "I need to see a doctor" },
    ],
    dont_say: [
      { zh: "我要登记", en: "I want to register", reason: "登记 is for general registration, not medical. Use 挂号 specifically for hospitals." },
    ],
    relatedWords: ["mw2", "mw3"],
  },
  {
    id: "mw2",
    word: "内科",
    pinyin: "nèikē",
    meanings_en: ["internal medicine", "medicine department"],
    category: "department",
    collocations: [
      { zh: "内科医生", pinyin: "nèikē yīshēng", en: "internist" },
      { zh: "看内科", pinyin: "kàn nèikē", en: "see internal medicine" },
    ],
    examples: [
      { cn: "我想挂内科。", en: "I'd like to register for internal medicine.", pinyin: "Wǒ xiǎng guà nèikē." },
    ],
    geo_snippet: "Nèikē (内科) refers to the internal medicine department in Chinese hospitals, treating general health issues.",
    key_points: [
      "General department for common illnesses",
      "Treats conditions like colds, fever, digestive issues",
      "Good starting point if unsure which department to visit",
      "Opposite of 外科 (surgery)",
    ],
    say_it_like: [
      { zh: "普通门诊", en: "general outpatient" },
    ],
    dont_say: [],
    relatedWords: ["mw1", "mw40"],
  },
  {
    id: "mw3",
    word: "医保卡",
    pinyin: "yībǎo kǎ",
    meanings_en: ["medical insurance card", "health insurance card"],
    category: "insurance",
    collocations: [
      { zh: "刷医保卡", pinyin: "shuā yībǎo kǎ", en: "swipe medical insurance card" },
      { zh: "医保报销", pinyin: "yībǎo bàoxiāo", en: "insurance reimbursement" },
    ],
    examples: [
      { cn: "请问可以用医保卡吗？", en: "Can I use my medical insurance card?", pinyin: "Qǐngwèn kěyǐ yòng yībǎo kǎ ma?" },
    ],
    geo_snippet: "Yībǎo kǎ (医保卡) is the Chinese medical insurance card used to access healthcare benefits.",
    key_points: [
      "Essential for Chinese healthcare system",
      "Covers percentage of medical expenses",
      "Different coverage for different cities",
      "Need to present at registration and payment",
    ],
    say_it_like: [
      { zh: "社保卡", en: "social security card (sometimes used interchangeably)" },
    ],
    dont_say: [
      { zh: "保险卡", en: "insurance card", reason: "Too general, specify 医保 for medical insurance" },
    ],
    relatedWords: ["mw22", "mw24"],
  },
  {
    id: "mw4",
    word: "肚子",
    pinyin: "dùzi",
    meanings_en: ["stomach", "belly", "abdomen"],
    category: "body",
    collocations: [
      { zh: "肚子疼", pinyin: "dùzi téng", en: "stomachache" },
      { zh: "肚子饿", pinyin: "dùzi è", en: "hungry" },
    ],
    examples: [
      { cn: "我肚子很疼。", en: "My stomach hurts badly.", pinyin: "Wǒ dùzi hěn téng." },
    ],
    geo_snippet: "Dùzi (肚子) is the common Chinese word for stomach or belly, used when describing abdominal discomfort.",
    key_points: [
      "Casual/colloquial term for abdomen",
      "Medical term is 腹部 (fùbù)",
      "Common in everyday medical conversations",
      "Can refer to the whole abdominal area",
    ],
    say_it_like: [
      { zh: "腹部", en: "abdomen (more formal)" },
    ],
    dont_say: [
      { zh: "胃", en: "stomach", reason: "胃 refers specifically to the stomach organ, while 肚子 is more general" },
    ],
    relatedWords: ["mw5", "mw41"],
  },
  {
    id: "mw5",
    word: "疼痛",
    pinyin: "téngtòng",
    meanings_en: ["pain", "ache"],
    category: "symptom",
    collocations: [
      { zh: "剧烈疼痛", pinyin: "jùliè téngtòng", en: "severe pain" },
      { zh: "持续疼痛", pinyin: "chíxù téngtòng", en: "continuous pain" },
    ],
    examples: [
      { cn: "疼痛是持续的还是一阵一阵的？", en: "Is the pain constant or intermittent?", pinyin: "Téngtòng shì chíxù de háishi yí zhèn yí zhèn de?" },
    ],
    geo_snippet: "Téngtòng (疼痛) is the formal Chinese word for pain, commonly used in medical settings.",
    key_points: [
      "More formal than 痛 (tòng) alone",
      "Used in medical descriptions",
      "Can describe various types of pain",
      "Often combined with descriptive words",
    ],
    say_it_like: [
      { zh: "痛", en: "pain (casual)" },
      { zh: "不舒服", en: "uncomfortable (milder)" },
    ],
    dont_say: [],
    relatedWords: ["mw6", "mw8"],
  },
  {
    id: "mw6",
    word: "恶心",
    pinyin: "ěxīn",
    meanings_en: ["nausea", "to feel nauseous", "disgusting"],
    category: "symptom",
    collocations: [
      { zh: "感到恶心", pinyin: "gǎndào ěxīn", en: "feel nauseous" },
      { zh: "恶心呕吐", pinyin: "ěxīn ǒutù", en: "nausea and vomiting" },
    ],
    examples: [
      { cn: "我有点恶心。", en: "I feel a bit nauseous.", pinyin: "Wǒ yǒudiǎn ěxīn." },
    ],
    geo_snippet: "Ěxīn (恶心) means nausea in Chinese, describing the feeling of wanting to vomit.",
    key_points: [
      "Common symptom to describe",
      "Can also mean 'disgusting' in other contexts",
      "Often accompanies digestive issues",
      "Important to mention timing and triggers",
    ],
    say_it_like: [
      { zh: "想吐", en: "want to vomit" },
    ],
    dont_say: [],
    relatedWords: ["mw7", "mw4"],
  },
  {
    id: "mw7",
    word: "呕吐",
    pinyin: "ǒutù",
    meanings_en: ["to vomit", "vomiting"],
    category: "symptom",
    collocations: [
      { zh: "剧烈呕吐", pinyin: "jùliè ǒutù", en: "severe vomiting" },
      { zh: "呕吐物", pinyin: "ǒutù wù", en: "vomit (noun)" },
    ],
    examples: [
      { cn: "有没有呕吐？", en: "Have you vomited?", pinyin: "Yǒu méiyǒu ǒutù?" },
    ],
    geo_snippet: "Ǒutù (呕吐) is the Chinese medical term for vomiting, an important symptom to report.",
    key_points: [
      "Formal medical term for vomiting",
      "Casual term is 吐 (tù)",
      "Doctor may ask about color and frequency",
      "Often associated with food poisoning or gastric issues",
    ],
    say_it_like: [
      { zh: "吐了", en: "threw up (casual)" },
    ],
    dont_say: [],
    relatedWords: ["mw6"],
  },
  {
    id: "mw8",
    word: "头痛",
    pinyin: "tóu tòng",
    meanings_en: ["headache"],
    category: "symptom",
    collocations: [
      { zh: "偏头痛", pinyin: "piān tóu tòng", en: "migraine" },
      { zh: "头痛欲裂", pinyin: "tóu tòng yù liè", en: "splitting headache" },
    ],
    examples: [
      { cn: "我头痛得很厉害。", en: "I have a severe headache.", pinyin: "Wǒ tóu tòng de hěn lìhai." },
    ],
    geo_snippet: "Tóu tòng (头痛) means headache in Chinese, one of the most common symptoms described to doctors.",
    key_points: [
      "Very common symptom",
      "Describe location: 前额 (forehead), 后脑 (back of head), 太阳穴 (temples)",
      "Describe nature: throbbing, dull, sharp",
      "Mention duration and frequency",
    ],
    say_it_like: [
      { zh: "头疼", en: "headache (informal spelling)" },
    ],
    dont_say: [],
    relatedWords: ["mw9", "mw10"],
  },
  {
    id: "mw9",
    word: "前额",
    pinyin: "qián'é",
    meanings_en: ["forehead"],
    category: "body",
    collocations: [
      { zh: "前额疼", pinyin: "qián'é téng", en: "forehead pain" },
    ],
    examples: [
      { cn: "主要是前额痛。", en: "The pain is mainly in my forehead.", pinyin: "Zhǔyào shì qián'é tòng." },
    ],
    geo_snippet: "Qián'é (前额) means forehead in Chinese, a common location for headache pain.",
    key_points: [
      "Important for describing headache location",
      "Part of the head anatomy vocabulary",
      "Often associated with tension headaches",
    ],
    say_it_like: [
      { zh: "额头", en: "forehead (more casual)" },
    ],
    dont_say: [],
    relatedWords: ["mw8", "mw10"],
  },
  {
    id: "mw10",
    word: "太阳穴",
    pinyin: "tàiyángxué",
    meanings_en: ["temple (side of head)"],
    category: "body",
    collocations: [
      { zh: "太阳穴疼", pinyin: "tàiyángxué téng", en: "temple pain" },
    ],
    examples: [
      { cn: "两边太阳穴都痛。", en: "Both temples hurt.", pinyin: "Liǎng biān tàiyángxué dōu tòng." },
    ],
    geo_snippet: "Tàiyángxué (太阳穴) refers to the temples on the sides of the head, common sites for headache pain.",
    key_points: [
      "Located on sides of head near eyes",
      "Common migraine location",
      "Also a pressure point in traditional Chinese medicine",
    ],
    say_it_like: [],
    dont_say: [],
    relatedWords: ["mw8", "mw9"],
  },
  {
    id: "mw11",
    word: "感冒",
    pinyin: "gǎnmào",
    meanings_en: ["cold", "to catch a cold"],
    category: "symptom",
    collocations: [
      { zh: "感冒药", pinyin: "gǎnmào yào", en: "cold medicine" },
      { zh: "重感冒", pinyin: "zhòng gǎnmào", en: "bad cold" },
    ],
    examples: [
      { cn: "我感冒了。", en: "I have a cold.", pinyin: "Wǒ gǎnmào le." },
    ],
    geo_snippet: "Gǎnmào (感冒) is the Chinese word for common cold, one of the most frequent reasons for doctor visits.",
    key_points: [
      "Very common illness term",
      "Can be verb or noun",
      "Symptoms include runny nose, cough, sore throat",
      "Different from 流感 (flu)",
    ],
    say_it_like: [
      { zh: "着凉了", en: "caught a chill" },
    ],
    dont_say: [],
    relatedWords: ["mw12", "mw13", "mw14"],
  },
  {
    id: "mw12",
    word: "流鼻涕",
    pinyin: "liú bítì",
    meanings_en: ["runny nose", "to have a runny nose"],
    category: "symptom",
    collocations: [
      { zh: "流清鼻涕", pinyin: "liú qīng bítì", en: "clear runny nose" },
    ],
    examples: [
      { cn: "我一直流鼻涕。", en: "I keep having a runny nose.", pinyin: "Wǒ yìzhí liú bítì." },
    ],
    geo_snippet: "Liú bítì (流鼻涕) describes having a runny nose, a common cold symptom in Chinese.",
    key_points: [
      "Common cold symptom",
      "Color of discharge can indicate type of infection",
      "清鼻涕 (clear) vs 黄鼻涕 (yellow)",
    ],
    say_it_like: [],
    dont_say: [],
    relatedWords: ["mw11", "mw13"],
  },
  {
    id: "mw13",
    word: "咳嗽",
    pinyin: "késou",
    meanings_en: ["cough", "to cough"],
    category: "symptom",
    collocations: [
      { zh: "干咳", pinyin: "gān ké", en: "dry cough" },
      { zh: "咳嗽药", pinyin: "késou yào", en: "cough medicine" },
    ],
    examples: [
      { cn: "我咳嗽了好几天了。", en: "I've been coughing for several days.", pinyin: "Wǒ késou le hǎo jǐ tiān le." },
    ],
    geo_snippet: "Késou (咳嗽) means cough in Chinese, an important symptom to describe when seeing a doctor.",
    key_points: [
      "Describe type: dry (干咳) or productive (有痰)",
      "Mention timing: day, night, or constant",
      "Note any blood in phlegm",
      "Can indicate respiratory issues",
    ],
    say_it_like: [],
    dont_say: [],
    relatedWords: ["mw11", "mw14"],
  },
  {
    id: "mw14",
    word: "发烧",
    pinyin: "fāshāo",
    meanings_en: ["fever", "to have a fever"],
    category: "symptom",
    collocations: [
      { zh: "高烧", pinyin: "gāo shāo", en: "high fever" },
      { zh: "低烧", pinyin: "dī shāo", en: "low-grade fever" },
    ],
    examples: [
      { cn: "我发烧三十八度。", en: "I have a fever of 38 degrees.", pinyin: "Wǒ fāshāo sānshíbā dù." },
    ],
    geo_snippet: "Fāshāo (发烧) means to have a fever in Chinese, a key symptom indicating infection.",
    key_points: [
      "Always mention temperature if known",
      "China uses Celsius",
      "Normal is around 36.5-37°C",
      "Above 38°C considered significant",
    ],
    say_it_like: [
      { zh: "发热", en: "have a fever (more formal)" },
    ],
    dont_say: [],
    relatedWords: ["mw11"],
  },
  {
    id: "mw15",
    word: "抽血",
    pinyin: "chōuxuè",
    meanings_en: ["to draw blood", "blood draw"],
    category: "test",
    collocations: [
      { zh: "抽血化验", pinyin: "chōuxuè huàyàn", en: "blood test" },
    ],
    examples: [
      { cn: "医生让我抽血检查。", en: "The doctor asked me to get a blood test.", pinyin: "Yīshēng ràng wǒ chōuxuè jiǎnchá." },
    ],
    geo_snippet: "Chōuxuè (抽血) means to draw blood for testing in Chinese hospitals.",
    key_points: [
      "Common hospital procedure",
      "Often requires fasting beforehand",
      "Results usually available same day",
      "Done at designated blood draw area",
    ],
    say_it_like: [
      { zh: "验血", en: "blood test" },
    ],
    dont_say: [],
    relatedWords: ["mw16", "mw17"],
  },
  {
    id: "mw16",
    word: "血常规",
    pinyin: "xuè chángguī",
    meanings_en: ["complete blood count", "routine blood test"],
    category: "test",
    collocations: [
      { zh: "做血常规", pinyin: "zuò xuè chángguī", en: "do a CBC" },
    ],
    examples: [
      { cn: "请先做个血常规。", en: "Please do a complete blood count first.", pinyin: "Qǐng xiān zuò ge xuè chángguī." },
    ],
    geo_snippet: "Xuè chángguī (血常规) is the Chinese term for complete blood count (CBC), a routine blood test.",
    key_points: [
      "Most common blood test",
      "Checks red blood cells, white blood cells, platelets",
      "Usually doesn't require fasting",
      "Results in 30 minutes to a few hours",
    ],
    say_it_like: [],
    dont_say: [],
    relatedWords: ["mw15", "mw17"],
  },
  {
    id: "mw17",
    word: "空腹",
    pinyin: "kōngfù",
    meanings_en: ["fasting", "empty stomach"],
    category: "test",
    collocations: [
      { zh: "空腹抽血", pinyin: "kōngfù chōuxuè", en: "fasting blood draw" },
      { zh: "空腹血糖", pinyin: "kōngfù xuètáng", en: "fasting blood sugar" },
    ],
    examples: [
      { cn: "这个检查需要空腹吗？", en: "Does this test require fasting?", pinyin: "Zhège jiǎnchá xūyào kōngfù ma?" },
    ],
    geo_snippet: "Kōngfù (空腹) means fasting or empty stomach, often required before certain medical tests.",
    key_points: [
      "Usually means 8-12 hours without food",
      "Water is usually okay",
      "Required for many blood tests",
      "Ask specifically which tests need fasting",
    ],
    say_it_like: [],
    dont_say: [],
    relatedWords: ["mw15", "mw31"],
  },
  {
    id: "mw18",
    word: "取药",
    pinyin: "qǔ yào",
    meanings_en: ["to pick up medication", "collect medicine"],
    category: "medicine",
    collocations: [
      { zh: "去药房取药", pinyin: "qù yàofáng qǔ yào", en: "go to pharmacy to get medicine" },
    ],
    examples: [
      { cn: "请到一楼药房取药。", en: "Please pick up your medicine at the first floor pharmacy.", pinyin: "Qǐng dào yī lóu yàofáng qǔ yào." },
    ],
    geo_snippet: "Qǔ yào (取药) means to pick up prescribed medication from a hospital pharmacy in Chinese.",
    key_points: [
      "Done at hospital pharmacy after paying",
      "Need prescription slip",
      "Usually same building as consultation",
      "Ask about dosage instructions",
    ],
    say_it_like: [
      { zh: "拿药", en: "get medicine (casual)" },
    ],
    dont_say: [],
    relatedWords: ["mw19", "mw20"],
  },
  {
    id: "mw19",
    word: "处方",
    pinyin: "chǔfāng",
    meanings_en: ["prescription"],
    category: "medicine",
    collocations: [
      { zh: "开处方", pinyin: "kāi chǔfāng", en: "write a prescription" },
      { zh: "处方药", pinyin: "chǔfāng yào", en: "prescription medicine" },
    ],
    examples: [
      { cn: "医生给我开了处方。", en: "The doctor wrote me a prescription.", pinyin: "Yīshēng gěi wǒ kāi le chǔfāng." },
    ],
    geo_snippet: "Chǔfāng (处方) means prescription in Chinese, needed to obtain prescription medications.",
    key_points: [
      "Written by doctor",
      "Needed for prescription medicines",
      "Contains medicine name, dosage, frequency",
      "Some medicines don't need prescription (OTC)",
    ],
    say_it_like: [],
    dont_say: [],
    relatedWords: ["mw18", "mw20"],
  },
  {
    id: "mw20",
    word: "药房",
    pinyin: "yàofáng",
    meanings_en: ["pharmacy"],
    category: "department",
    collocations: [
      { zh: "医院药房", pinyin: "yīyuàn yàofáng", en: "hospital pharmacy" },
    ],
    examples: [
      { cn: "药房在哪里？", en: "Where is the pharmacy?", pinyin: "Yàofáng zài nǎlǐ?" },
    ],
    geo_snippet: "Yàofáng (药房) is the Chinese word for pharmacy, where medications are dispensed.",
    key_points: [
      "Can be inside hospital or standalone",
      "Hospital pharmacies fill prescriptions",
      "Outside pharmacies sell OTC and some prescriptions",
      "Also called 药店 (yàodiàn) for drugstores",
    ],
    say_it_like: [
      { zh: "药店", en: "drugstore" },
    ],
    dont_say: [],
    relatedWords: ["mw18", "mw19"],
  },
  {
    id: "mw21",
    word: "过敏",
    pinyin: "guòmǐn",
    meanings_en: ["allergy", "allergic", "to be allergic"],
    category: "symptom",
    collocations: [
      { zh: "过敏反应", pinyin: "guòmǐn fǎnyìng", en: "allergic reaction" },
      { zh: "药物过敏", pinyin: "yàowù guòmǐn", en: "drug allergy" },
    ],
    examples: [
      { cn: "您对什么药过敏吗？", en: "Are you allergic to any medications?", pinyin: "Nín duì shénme yào guòmǐn ma?" },
    ],
    geo_snippet: "Guòmǐn (过敏) means allergy or allergic reaction in Chinese, crucial information for medical treatment.",
    key_points: [
      "Always disclose allergies to doctors",
      "Common allergens: 青霉素 (penicillin), 海鲜 (seafood)",
      "Can be to food, medicine, or environment",
      "Symptoms range from rash to severe reactions",
    ],
    say_it_like: [],
    dont_say: [],
    relatedWords: ["mw28", "mw29"],
  },
  {
    id: "mw22",
    word: "结账",
    pinyin: "jiézhàng",
    meanings_en: ["to pay the bill", "to settle accounts"],
    category: "insurance",
    collocations: [
      { zh: "收费结账", pinyin: "shōufèi jiézhàng", en: "payment and billing" },
    ],
    examples: [
      { cn: "我来结账。", en: "I'm here to pay.", pinyin: "Wǒ lái jiézhàng." },
    ],
    geo_snippet: "Jiézhàng (结账) means to pay the bill in Chinese, used at hospital billing counters.",
    key_points: [
      "Done at billing/payment window",
      "Usually after all treatments completed",
      "Can use insurance card here",
      "Keep receipts for reimbursement",
    ],
    say_it_like: [
      { zh: "付钱", en: "pay" },
      { zh: "缴费", en: "pay fees" },
    ],
    dont_say: [],
    relatedWords: ["mw3", "mw24"],
  },
  {
    id: "mw23",
    word: "挂号费",
    pinyin: "guàhào fèi",
    meanings_en: ["registration fee"],
    category: "insurance",
    collocations: [
      { zh: "专家挂号费", pinyin: "zhuānjiā guàhào fèi", en: "specialist registration fee" },
    ],
    examples: [
      { cn: "挂号费多少钱？", en: "How much is the registration fee?", pinyin: "Guàhào fèi duōshao qián?" },
    ],
    geo_snippet: "Guàhào fèi (挂号费) is the registration fee paid when registering to see a doctor.",
    key_points: [
      "Paid at registration",
      "Varies by hospital tier and department",
      "Higher for specialists and experts",
      "Usually partially covered by insurance",
    ],
    say_it_like: [],
    dont_say: [],
    relatedWords: ["mw1", "mw24"],
  },
  {
    id: "mw24",
    word: "报销",
    pinyin: "bàoxiāo",
    meanings_en: ["reimbursement", "to reimburse"],
    category: "insurance",
    collocations: [
      { zh: "医保报销", pinyin: "yībǎo bàoxiāo", en: "medical insurance reimbursement" },
      { zh: "报销比例", pinyin: "bàoxiāo bǐlì", en: "reimbursement rate" },
    ],
    examples: [
      { cn: "这个可以报销吗？", en: "Can this be reimbursed?", pinyin: "Zhège kěyǐ bàoxiāo ma?" },
    ],
    geo_snippet: "Bàoxiāo (报销) means reimbursement in Chinese, commonly used for medical insurance claims.",
    key_points: [
      "Insurance covers percentage of costs",
      "Different rates for different treatments",
      "Some items not covered",
      "Keep all receipts",
    ],
    say_it_like: [],
    dont_say: [],
    relatedWords: ["mw3", "mw22"],
  },
  {
    id: "mw25",
    word: "腰",
    pinyin: "yāo",
    meanings_en: ["waist", "lower back"],
    category: "body",
    collocations: [
      { zh: "腰疼", pinyin: "yāo téng", en: "lower back pain" },
      { zh: "弯腰", pinyin: "wān yāo", en: "bend over" },
    ],
    examples: [
      { cn: "我腰很痛。", en: "My lower back hurts.", pinyin: "Wǒ yāo hěn tòng." },
    ],
    geo_snippet: "Yāo (腰) refers to the waist or lower back area in Chinese, a common site of pain.",
    key_points: [
      "Common complaint: 腰疼/腰痛",
      "Can indicate various conditions",
      "Important to describe: sharp, dull, radiating",
      "May need imaging tests",
    ],
    say_it_like: [],
    dont_say: [],
    relatedWords: ["mw26", "mw27"],
  },
  {
    id: "mw26",
    word: "弯腰",
    pinyin: "wānyāo",
    meanings_en: ["to bend over", "bending"],
    category: "symptom",
    collocations: [
      { zh: "弯腰困难", pinyin: "wānyāo kùnnan", en: "difficulty bending" },
    ],
    examples: [
      { cn: "弯腰的时候特别痛。", en: "It hurts especially when I bend over.", pinyin: "Wānyāo de shíhou tèbié tòng." },
    ],
    geo_snippet: "Wānyāo (弯腰) means to bend over, often used when describing back pain triggers.",
    key_points: [
      "Common aggravating factor for back pain",
      "Helps doctor understand pain pattern",
      "May indicate disc or muscle issues",
    ],
    say_it_like: [],
    dont_say: [],
    relatedWords: ["mw25"],
  },
  {
    id: "mw27",
    word: "麻木",
    pinyin: "mámù",
    meanings_en: ["numbness", "numb"],
    category: "symptom",
    collocations: [
      { zh: "手脚麻木", pinyin: "shǒujiǎo mámù", en: "numbness in hands and feet" },
    ],
    examples: [
      { cn: "腿有点麻木。", en: "My leg feels a bit numb.", pinyin: "Tuǐ yǒudiǎn mámù." },
    ],
    geo_snippet: "Mámù (麻木) means numbness in Chinese, an important neurological symptom to report.",
    key_points: [
      "Important symptom - may indicate nerve issues",
      "Describe location and duration",
      "Can accompany pain or occur alone",
      "May require neurological examination",
    ],
    say_it_like: [
      { zh: "发麻", en: "feel numb/tingly" },
    ],
    dont_say: [],
    relatedWords: ["mw25", "mw26"],
  },
  {
    id: "mw28",
    word: "红疹",
    pinyin: "hóng zhěn",
    meanings_en: ["red rash", "skin rash"],
    category: "symptom",
    collocations: [
      { zh: "起红疹", pinyin: "qǐ hóng zhěn", en: "develop a rash" },
    ],
    examples: [
      { cn: "身上起了很多红疹。", en: "I have a lot of red rashes on my body.", pinyin: "Shēnshang qǐ le hěn duō hóng zhěn." },
    ],
    geo_snippet: "Hóng zhěn (红疹) means red rash in Chinese, often a sign of allergic reaction or skin condition.",
    key_points: [
      "Common allergic symptom",
      "Describe location and spread",
      "Note if itchy or painful",
      "Important to identify cause",
    ],
    say_it_like: [
      { zh: "疹子", en: "rash (general)" },
    ],
    dont_say: [],
    relatedWords: ["mw21", "mw29"],
  },
  {
    id: "mw29",
    word: "痒",
    pinyin: "yǎng",
    meanings_en: ["itchy", "to itch"],
    category: "symptom",
    collocations: [
      { zh: "很痒", pinyin: "hěn yǎng", en: "very itchy" },
      { zh: "发痒", pinyin: "fā yǎng", en: "become itchy" },
    ],
    examples: [
      { cn: "这里很痒。", en: "It's very itchy here.", pinyin: "Zhèlǐ hěn yǎng." },
    ],
    geo_snippet: "Yǎng (痒) means itchy in Chinese, a common symptom of skin conditions and allergies.",
    key_points: [
      "Common with rashes and allergies",
      "Describe severity and location",
      "Avoid scratching if possible",
      "May need antihistamines",
    ],
    say_it_like: [],
    dont_say: [],
    relatedWords: ["mw28", "mw21"],
  },
  {
    id: "mw30",
    word: "食物过敏",
    pinyin: "shíwù guòmǐn",
    meanings_en: ["food allergy"],
    category: "symptom",
    collocations: [
      { zh: "海鲜过敏", pinyin: "hǎixiān guòmǐn", en: "seafood allergy" },
    ],
    examples: [
      { cn: "您有食物过敏吗？", en: "Do you have any food allergies?", pinyin: "Nín yǒu shíwù guòmǐn ma?" },
    ],
    geo_snippet: "Shíwù guòmǐn (食物过敏) means food allergy in Chinese, important to declare before any treatment.",
    key_points: [
      "Common allergens: 海鲜, 花生, 牛奶, 鸡蛋",
      "Always inform medical staff",
      "Can cause mild to severe reactions",
      "May need to carry emergency medication",
    ],
    say_it_like: [],
    dont_say: [],
    relatedWords: ["mw21", "mw28"],
  },
  {
    id: "mw31",
    word: "血糖",
    pinyin: "xuètáng",
    meanings_en: ["blood sugar", "blood glucose"],
    category: "test",
    collocations: [
      { zh: "血糖高", pinyin: "xuètáng gāo", en: "high blood sugar" },
      { zh: "测血糖", pinyin: "cè xuètáng", en: "test blood sugar" },
    ],
    examples: [
      { cn: "空腹血糖是多少？", en: "What's your fasting blood sugar?", pinyin: "Kōngfù xuètáng shì duōshao?" },
    ],
    geo_snippet: "Xuètáng (血糖) means blood sugar in Chinese, a key indicator for diabetes management.",
    key_points: [
      "Important for diabetes patients",
      "Normal fasting level: 3.9-6.1 mmol/L",
      "Test regularly if diabetic",
      "Affected by diet and medication",
    ],
    say_it_like: [],
    dont_say: [],
    relatedWords: ["mw32", "mw17"],
  },
  {
    id: "mw32",
    word: "糖尿病",
    pinyin: "tángniàobìng",
    meanings_en: ["diabetes"],
    category: "history",
    collocations: [
      { zh: "二型糖尿病", pinyin: "èr xíng tángniàobìng", en: "type 2 diabetes" },
    ],
    examples: [
      { cn: "您有糖尿病吗？", en: "Do you have diabetes?", pinyin: "Nín yǒu tángniàobìng ma?" },
    ],
    geo_snippet: "Tángniàobìng (糖尿病) is the Chinese word for diabetes, a common chronic condition.",
    key_points: [
      "Chronic condition requiring management",
      "Types: 一型 (Type 1), 二型 (Type 2)",
      "Requires regular monitoring",
      "Important to disclose to doctors",
    ],
    say_it_like: [],
    dont_say: [],
    relatedWords: ["mw31", "mw33"],
  },
  {
    id: "mw33",
    word: "按时",
    pinyin: "ànshí",
    meanings_en: ["on time", "punctually"],
    category: "time",
    collocations: [
      { zh: "按时吃药", pinyin: "ànshí chī yào", en: "take medicine on time" },
    ],
    examples: [
      { cn: "要按时吃药。", en: "Take the medicine on time.", pinyin: "Yào ànshí chī yào." },
    ],
    geo_snippet: "Ànshí (按时) means on time or punctually, often used for medication instructions.",
    key_points: [
      "Important for medication effectiveness",
      "Follow prescribed schedule",
      "Can set reminders",
    ],
    say_it_like: [
      { zh: "准时", en: "on time (alternative)" },
    ],
    dont_say: [],
    relatedWords: ["mw18"],
  },
  {
    id: "mw34",
    word: "儿科",
    pinyin: "érkē",
    meanings_en: ["pediatrics", "children's department"],
    category: "department",
    collocations: [
      { zh: "儿科医生", pinyin: "érkē yīshēng", en: "pediatrician" },
    ],
    examples: [
      { cn: "请问儿科在几楼？", en: "Which floor is pediatrics on?", pinyin: "Qǐngwèn érkē zài jǐ lóu?" },
    ],
    geo_snippet: "Érkē (儿科) is the pediatrics department in Chinese hospitals, treating children's health issues.",
    key_points: [
      "For patients under 14-18 (varies by hospital)",
      "Specialized for children's conditions",
      "Usually separate waiting area",
    ],
    say_it_like: [],
    dont_say: [],
    relatedWords: ["mw2"],
  },
  {
    id: "mw35",
    word: "鼻塞",
    pinyin: "bí sāi",
    meanings_en: ["stuffy nose", "nasal congestion"],
    category: "symptom",
    collocations: [
      { zh: "严重鼻塞", pinyin: "yánzhòng bí sāi", en: "severe nasal congestion" },
    ],
    examples: [
      { cn: "孩子鼻塞很严重。", en: "The child has severe nasal congestion.", pinyin: "Háizi bí sāi hěn yánzhòng." },
    ],
    geo_snippet: "Bí sāi (鼻塞) means stuffy nose or nasal congestion in Chinese.",
    key_points: [
      "Common cold symptom",
      "Can affect sleep and eating",
      "May need nasal spray or drops",
    ],
    say_it_like: [
      { zh: "鼻子不通", en: "nose is blocked" },
    ],
    dont_say: [],
    relatedWords: ["mw12", "mw11"],
  },
  {
    id: "mw36",
    word: "检查",
    pinyin: "jiǎnchá",
    meanings_en: ["examination", "to examine", "to check"],
    category: "test",
    collocations: [
      { zh: "身体检查", pinyin: "shēntǐ jiǎnchá", en: "physical examination" },
      { zh: "检查结果", pinyin: "jiǎnchá jiéguǒ", en: "test results" },
    ],
    examples: [
      { cn: "我先检查一下。", en: "Let me examine you first.", pinyin: "Wǒ xiān jiǎnchá yíxià." },
    ],
    geo_snippet: "Jiǎnchá (检查) means examination or test in Chinese, used for various medical procedures.",
    key_points: [
      "Can mean physical exam or lab test",
      "Various types: blood, imaging, physical",
      "Results may take time",
      "Ask about preparation needed",
    ],
    say_it_like: [],
    dont_say: [],
    relatedWords: ["mw15", "mw37"],
  },
  {
    id: "mw37",
    word: "X光",
    pinyin: "X guāng",
    meanings_en: ["X-ray"],
    category: "test",
    collocations: [
      { zh: "拍X光", pinyin: "pāi X guāng", en: "take an X-ray" },
      { zh: "胸部X光", pinyin: "xiōngbù X guāng", en: "chest X-ray" },
    ],
    examples: [
      { cn: "医生让我拍X光。", en: "The doctor asked me to get an X-ray.", pinyin: "Yīshēng ràng wǒ pāi X guāng." },
    ],
    geo_snippet: "X guāng (X光) is the Chinese term for X-ray, a common imaging test.",
    key_points: [
      "Common imaging test",
      "Remove metal objects before",
      "Pregnant women should avoid",
      "Usually quick results",
    ],
    say_it_like: [],
    dont_say: [],
    relatedWords: ["mw36", "mw38"],
  },
  {
    id: "mw38",
    word: "怀孕",
    pinyin: "huáiyùn",
    meanings_en: ["pregnant", "pregnancy"],
    category: "history",
    collocations: [
      { zh: "怀孕几个月", pinyin: "huáiyùn jǐ ge yuè", en: "how many months pregnant" },
    ],
    examples: [
      { cn: "您有没有怀孕？", en: "Are you pregnant?", pinyin: "Nín yǒu méiyǒu huáiyùn?" },
    ],
    geo_snippet: "Huáiyùn (怀孕) means pregnant or pregnancy in Chinese, important information before procedures.",
    key_points: [
      "Must disclose before imaging tests",
      "Affects medication choices",
      "Important for treatment decisions",
      "Routine question in hospitals",
    ],
    say_it_like: [],
    dont_say: [],
    relatedWords: ["mw37"],
  },
  {
    id: "mw39",
    word: "屏住呼吸",
    pinyin: "bǐng zhù hūxī",
    meanings_en: ["hold your breath"],
    category: "test",
    collocations: [],
    examples: [
      { cn: "请深吸一口气，屏住呼吸。", en: "Please take a deep breath and hold it.", pinyin: "Qǐng shēn xī yì kǒu qì, bǐng zhù hūxī." },
    ],
    geo_snippet: "Bǐng zhù hūxī (屏住呼吸) means to hold your breath, a common instruction during imaging tests.",
    key_points: [
      "Common X-ray instruction",
      "Usually for a few seconds",
      "Helps get clear image",
    ],
    say_it_like: [
      { zh: "憋气", en: "hold breath (casual)" },
    ],
    dont_say: [],
    relatedWords: ["mw37"],
  },
  {
    id: "mw40",
    word: "外科",
    pinyin: "wàikē",
    meanings_en: ["surgery department", "surgical"],
    category: "department",
    collocations: [
      { zh: "外科手术", pinyin: "wàikē shǒushù", en: "surgical operation" },
    ],
    examples: [
      { cn: "我要挂外科。", en: "I want to register for surgery department.", pinyin: "Wǒ yào guà wàikē." },
    ],
    geo_snippet: "Wàikē (外科) is the surgery department in Chinese hospitals.",
    key_points: [
      "For conditions requiring surgical intervention",
      "Opposite of 内科 (internal medicine)",
      "Various subspecialties exist",
    ],
    say_it_like: [],
    dont_say: [],
    relatedWords: ["mw2"],
  },
  {
    id: "mw41",
    word: "胃",
    pinyin: "wèi",
    meanings_en: ["stomach (organ)"],
    category: "body",
    collocations: [
      { zh: "胃痛", pinyin: "wèi tòng", en: "stomach pain" },
      { zh: "胃病", pinyin: "wèi bìng", en: "stomach disease" },
    ],
    examples: [
      { cn: "我胃不好。", en: "I have stomach problems.", pinyin: "Wǒ wèi bù hǎo." },
    ],
    geo_snippet: "Wèi (胃) refers specifically to the stomach organ in Chinese.",
    key_points: [
      "Specific organ name",
      "Different from 肚子 (general abdomen)",
      "Common issues: gastritis, ulcers",
    ],
    say_it_like: [],
    dont_say: [],
    relatedWords: ["mw4"],
  },
  {
    id: "mw42",
    word: "喉咙",
    pinyin: "hóulóng",
    meanings_en: ["throat"],
    category: "body",
    collocations: [
      { zh: "喉咙痛", pinyin: "hóulóng tòng", en: "sore throat" },
      { zh: "喉咙发炎", pinyin: "hóulóng fāyán", en: "throat inflammation" },
    ],
    examples: [
      { cn: "我喉咙很痛。", en: "My throat really hurts.", pinyin: "Wǒ hóulóng hěn tòng." },
    ],
    geo_snippet: "Hóulóng (喉咙) means throat in Chinese, commonly affected by colds and infections.",
    key_points: [
      "Common cold symptom area",
      "May indicate strep or viral infection",
      "Often accompanied by swallowing difficulty",
    ],
    say_it_like: [
      { zh: "嗓子", en: "throat (colloquial)" },
    ],
    dont_say: [],
    relatedWords: ["mw11", "mw13"],
  },
  {
    id: "mw43",
    word: "消炎药",
    pinyin: "xiāoyán yào",
    meanings_en: ["anti-inflammatory medicine", "antibiotics (colloquial)"],
    category: "medicine",
    collocations: [
      { zh: "吃消炎药", pinyin: "chī xiāoyán yào", en: "take anti-inflammatory" },
    ],
    examples: [
      { cn: "医生给我开了消炎药。", en: "The doctor prescribed anti-inflammatory medicine.", pinyin: "Yīshēng gěi wǒ kāi le xiāoyán yào." },
    ],
    geo_snippet: "Xiāoyán yào (消炎药) refers to anti-inflammatory medicine in Chinese, often used colloquially for antibiotics.",
    key_points: [
      "Often refers to antibiotics in common usage",
      "Should be taken as prescribed",
      "Complete the full course",
      "Don't use without prescription",
    ],
    say_it_like: [
      { zh: "抗生素", en: "antibiotics (formal)" },
    ],
    dont_say: [],
    relatedWords: ["mw19"],
  },
  {
    id: "mw44",
    word: "体温",
    pinyin: "tǐwēn",
    meanings_en: ["body temperature"],
    category: "test",
    collocations: [
      { zh: "量体温", pinyin: "liáng tǐwēn", en: "take temperature" },
    ],
    examples: [
      { cn: "请先量一下体温。", en: "Please let me take your temperature.", pinyin: "Qǐng xiān liáng yíxià tǐwēn." },
    ],
    geo_snippet: "Tǐwēn (体温) means body temperature in Chinese, a basic vital sign.",
    key_points: [
      "Normal: 36.5-37°C",
      "Above 37.5°C usually considered fever",
      "Measured with thermometer",
      "Important triage information",
    ],
    say_it_like: [],
    dont_say: [],
    relatedWords: ["mw14"],
  },
  {
    id: "mw45",
    word: "住院",
    pinyin: "zhùyuàn",
    meanings_en: ["to be hospitalized", "hospitalization"],
    category: "department",
    collocations: [
      { zh: "住院部", pinyin: "zhùyuàn bù", en: "inpatient department" },
      { zh: "办理住院", pinyin: "bànlǐ zhùyuàn", en: "admit for hospitalization" },
    ],
    examples: [
      { cn: "医生说需要住院观察。", en: "The doctor said I need to be hospitalized for observation.", pinyin: "Yīshēng shuō xūyào zhùyuàn guānchá." },
    ],
    geo_snippet: "Zhùyuàn (住院) means to be hospitalized or admitted to hospital in Chinese.",
    key_points: [
      "Requires admission procedures",
      "Need to pay deposit",
      "Different from outpatient (门诊)",
      "Family may need to help with care",
    ],
    say_it_like: [],
    dont_say: [],
    relatedWords: ["mw46"],
  },
  {
    id: "mw46",
    word: "门诊",
    pinyin: "ménzhěn",
    meanings_en: ["outpatient", "outpatient department"],
    category: "department",
    collocations: [
      { zh: "门诊部", pinyin: "ménzhěn bù", en: "outpatient department" },
      { zh: "门诊时间", pinyin: "ménzhěn shíjiān", en: "outpatient hours" },
    ],
    examples: [
      { cn: "门诊在哪里？", en: "Where is the outpatient department?", pinyin: "Ménzhěn zài nǎlǐ?" },
    ],
    geo_snippet: "Ménzhěn (门诊) is outpatient services in Chinese hospitals, for visits not requiring admission.",
    key_points: [
      "Most hospital visits are outpatient",
      "No overnight stay required",
      "Usually sees specific department",
    ],
    say_it_like: [],
    dont_say: [],
    relatedWords: ["mw45"],
  },
  {
    id: "mw47",
    word: "急诊",
    pinyin: "jízhěn",
    meanings_en: ["emergency", "emergency department"],
    category: "department",
    collocations: [
      { zh: "急诊室", pinyin: "jízhěn shì", en: "emergency room" },
    ],
    examples: [
      { cn: "请直接去急诊。", en: "Please go directly to the emergency department.", pinyin: "Qǐng zhíjiē qù jízhěn." },
    ],
    geo_snippet: "Jízhěn (急诊) is the emergency department in Chinese hospitals, for urgent medical needs.",
    key_points: [
      "For urgent/emergency conditions",
      "Open 24 hours",
      "No appointment needed",
      "May have longer waits for non-emergencies",
    ],
    say_it_like: [],
    dont_say: [],
    relatedWords: ["mw46"],
  },
  {
    id: "mw48",
    word: "病历",
    pinyin: "bìnglì",
    meanings_en: ["medical record", "case history"],
    category: "history",
    collocations: [
      { zh: "病历本", pinyin: "bìnglì běn", en: "medical record book" },
    ],
    examples: [
      { cn: "请把病历给我看一下。", en: "Please let me see your medical record.", pinyin: "Qǐng bǎ bìnglì gěi wǒ kàn yíxià." },
    ],
    geo_snippet: "Bìnglì (病历) means medical record or case history in Chinese.",
    key_points: [
      "Contains your medical history",
      "Bring to appointments",
      "Some hospitals have electronic records",
      "Important for continuity of care",
    ],
    say_it_like: [],
    dont_say: [],
    relatedWords: ["mw49"],
  },
  {
    id: "mw49",
    word: "既往病史",
    pinyin: "jìwǎng bìngshǐ",
    meanings_en: ["past medical history", "medical history"],
    category: "history",
    collocations: [
      { zh: "有什么既往病史", pinyin: "yǒu shénme jìwǎng bìngshǐ", en: "any past medical history" },
    ],
    examples: [
      { cn: "您有什么既往病史吗？", en: "Do you have any past medical history?", pinyin: "Nín yǒu shénme jìwǎng bìngshǐ ma?" },
    ],
    geo_snippet: "Jìwǎng bìngshǐ (既往病史) means past medical history in Chinese, information doctors need.",
    key_points: [
      "Include surgeries, chronic diseases",
      "Important for diagnosis and treatment",
      "Be thorough when answering",
    ],
    say_it_like: [
      { zh: "以前得过什么病", en: "what illnesses have you had before" },
    ],
    dont_say: [],
    relatedWords: ["mw48"],
  },
  {
    id: "mw50",
    word: "家族病史",
    pinyin: "jiāzú bìngshǐ",
    meanings_en: ["family medical history"],
    category: "history",
    collocations: [
      { zh: "家族病史调查", pinyin: "jiāzú bìngshǐ diàochá", en: "family history survey" },
    ],
    examples: [
      { cn: "家里人有糖尿病吗？", en: "Does anyone in your family have diabetes?", pinyin: "Jiālǐ rén yǒu tángniàobìng ma?" },
    ],
    geo_snippet: "Jiāzú bìngshǐ (家族病史) means family medical history in Chinese.",
    key_points: [
      "Includes parents, siblings, grandparents",
      "Important for genetic conditions",
      "Common questions: diabetes, cancer, heart disease",
    ],
    say_it_like: [],
    dont_say: [],
    relatedWords: ["mw49", "mw32"],
  },
  // Continue with more medical words (51-80+)
  {
    id: "mw51",
    word: "血压",
    pinyin: "xuèyā",
    meanings_en: ["blood pressure"],
    category: "test",
    collocations: [
      { zh: "量血压", pinyin: "liáng xuèyā", en: "measure blood pressure" },
      { zh: "高血压", pinyin: "gāo xuèyā", en: "high blood pressure" },
    ],
    examples: [
      { cn: "我量一下您的血压。", en: "Let me check your blood pressure.", pinyin: "Wǒ liáng yíxià nín de xuèyā." },
    ],
    geo_snippet: "Xuèyā (血压) means blood pressure in Chinese, a vital sign measured at most medical visits.",
    key_points: [
      "Normal: around 120/80 mmHg",
      "High blood pressure: 高血压",
      "Low blood pressure: 低血压",
      "Measured with a sphygmomanometer",
    ],
    say_it_like: [],
    dont_say: [],
    relatedWords: ["mw44"],
  },
  {
    id: "mw52",
    word: "心跳",
    pinyin: "xīntiào",
    meanings_en: ["heartbeat", "heart rate"],
    category: "test",
    collocations: [
      { zh: "心跳加速", pinyin: "xīntiào jiāsù", en: "rapid heartbeat" },
    ],
    examples: [
      { cn: "您心跳有点快。", en: "Your heart rate is a bit fast.", pinyin: "Nín xīntiào yǒudiǎn kuài." },
    ],
    geo_snippet: "Xīntiào (心跳) means heartbeat or heart rate in Chinese.",
    key_points: [
      "Normal resting: 60-100 beats per minute",
      "Can be felt at pulse points",
      "Elevated during exercise or stress",
    ],
    say_it_like: [
      { zh: "脉搏", en: "pulse" },
    ],
    dont_say: [],
    relatedWords: ["mw51"],
  },
  {
    id: "mw53",
    word: "呼吸",
    pinyin: "hūxī",
    meanings_en: ["breathing", "respiration", "to breathe"],
    category: "symptom",
    collocations: [
      { zh: "呼吸困难", pinyin: "hūxī kùnnan", en: "difficulty breathing" },
      { zh: "深呼吸", pinyin: "shēn hūxī", en: "deep breath" },
    ],
    examples: [
      { cn: "呼吸有困难吗？", en: "Do you have difficulty breathing?", pinyin: "Hūxī yǒu kùnnan ma?" },
    ],
    geo_snippet: "Hūxī (呼吸) means breathing or respiration in Chinese, a vital function.",
    key_points: [
      "Difficulty breathing is serious",
      "May indicate heart or lung issues",
      "Describe: fast, slow, shallow, deep",
    ],
    say_it_like: [],
    dont_say: [],
    relatedWords: ["mw39"],
  },
  {
    id: "mw54",
    word: "胸闷",
    pinyin: "xiōng mèn",
    meanings_en: ["chest tightness", "chest pressure"],
    category: "symptom",
    collocations: [
      { zh: "感觉胸闷", pinyin: "gǎnjué xiōng mèn", en: "feel chest tightness" },
    ],
    examples: [
      { cn: "我有时候感觉胸闷。", en: "I sometimes feel chest tightness.", pinyin: "Wǒ yǒu shíhou gǎnjué xiōng mèn." },
    ],
    geo_snippet: "Xiōng mèn (胸闷) means chest tightness or pressure in Chinese, potentially a serious symptom.",
    key_points: [
      "May indicate heart problems",
      "Should be evaluated promptly",
      "Describe timing and triggers",
      "Often accompanied by other symptoms",
    ],
    say_it_like: [],
    dont_say: [],
    relatedWords: ["mw53", "mw55"],
  },
  {
    id: "mw55",
    word: "胸痛",
    pinyin: "xiōng tòng",
    meanings_en: ["chest pain"],
    category: "symptom",
    collocations: [
      { zh: "剧烈胸痛", pinyin: "jùliè xiōng tòng", en: "severe chest pain" },
    ],
    examples: [
      { cn: "胸痛是什么时候开始的？", en: "When did the chest pain start?", pinyin: "Xiōng tòng shì shénme shíhou kāishǐ de?" },
    ],
    geo_snippet: "Xiōng tòng (胸痛) means chest pain in Chinese, a symptom that often requires urgent evaluation.",
    key_points: [
      "Potentially serious symptom",
      "May indicate heart attack",
      "Describe: sharp, dull, pressure, burning",
      "Note radiation to arm/jaw",
    ],
    say_it_like: [],
    dont_say: [],
    relatedWords: ["mw54"],
  },
  {
    id: "mw56",
    word: "心电图",
    pinyin: "xīndiàntú",
    meanings_en: ["electrocardiogram", "ECG", "EKG"],
    category: "test",
    collocations: [
      { zh: "做心电图", pinyin: "zuò xīndiàntú", en: "do an ECG" },
    ],
    examples: [
      { cn: "我建议做个心电图检查。", en: "I suggest doing an ECG.", pinyin: "Wǒ jiànyì zuò ge xīndiàntú jiǎnchá." },
    ],
    geo_snippet: "Xīndiàntú (心电图) is electrocardiogram (ECG/EKG) in Chinese, a test for heart function.",
    key_points: [
      "Tests heart electrical activity",
      "Non-invasive test",
      "Usually quick results",
      "Important for chest pain evaluation",
    ],
    say_it_like: [],
    dont_say: [],
    relatedWords: ["mw55", "mw57"],
  },
  {
    id: "mw57",
    word: "B超",
    pinyin: "B chāo",
    meanings_en: ["ultrasound", "B-scan ultrasound"],
    category: "test",
    collocations: [
      { zh: "做B超", pinyin: "zuò B chāo", en: "do an ultrasound" },
      { zh: "腹部B超", pinyin: "fùbù B chāo", en: "abdominal ultrasound" },
    ],
    examples: [
      { cn: "医生让我做个B超。", en: "The doctor asked me to get an ultrasound.", pinyin: "Yīshēng ràng wǒ zuò ge B chāo." },
    ],
    geo_snippet: "B chāo (B超) is ultrasound examination in Chinese, commonly used for various diagnostics.",
    key_points: [
      "Non-invasive imaging",
      "Common uses: pregnancy, abdomen, organs",
      "May require full bladder for some types",
      "Results usually same day",
    ],
    say_it_like: [
      { zh: "超声波", en: "ultrasound wave" },
    ],
    dont_say: [],
    relatedWords: ["mw37"],
  },
  {
    id: "mw58",
    word: "CT",
    pinyin: "CT",
    meanings_en: ["CT scan", "computed tomography"],
    category: "test",
    collocations: [
      { zh: "做CT", pinyin: "zuò CT", en: "do a CT scan" },
      { zh: "头部CT", pinyin: "tóubù CT", en: "head CT" },
    ],
    examples: [
      { cn: "需要做个CT检查。", en: "You need to do a CT scan.", pinyin: "Xūyào zuò ge CT jiǎnchá." },
    ],
    geo_snippet: "CT is used directly in Chinese for computed tomography scan, an advanced imaging test.",
    key_points: [
      "More detailed than X-ray",
      "May require contrast dye",
      "Some radiation exposure",
      "Used for detailed internal imaging",
    ],
    say_it_like: [],
    dont_say: [],
    relatedWords: ["mw37", "mw57"],
  },
  {
    id: "mw59",
    word: "核磁共振",
    pinyin: "hécí gòngzhèn",
    meanings_en: ["MRI", "magnetic resonance imaging"],
    category: "test",
    collocations: [
      { zh: "做核磁共振", pinyin: "zuò hécí gòngzhèn", en: "do an MRI" },
    ],
    examples: [
      { cn: "医生建议做核磁共振。", en: "The doctor suggested an MRI.", pinyin: "Yīshēng jiànyì zuò hécí gòngzhèn." },
    ],
    geo_snippet: "Hécí gòngzhèn (核磁共振) is MRI in Chinese, used for detailed soft tissue imaging.",
    key_points: [
      "No radiation",
      "Best for soft tissue",
      "Takes longer than CT",
      "Cannot have metal in body",
    ],
    say_it_like: [
      { zh: "磁共振", en: "MRI (shorter form)" },
    ],
    dont_say: [],
    relatedWords: ["mw58"],
  },
  {
    id: "mw60",
    word: "尿检",
    pinyin: "niào jiǎn",
    meanings_en: ["urinalysis", "urine test"],
    category: "test",
    collocations: [
      { zh: "做尿检", pinyin: "zuò niào jiǎn", en: "do a urine test" },
    ],
    examples: [
      { cn: "请先做个尿检。", en: "Please do a urine test first.", pinyin: "Qǐng xiān zuò ge niào jiǎn." },
    ],
    geo_snippet: "Niào jiǎn (尿检) means urinalysis or urine test in Chinese.",
    key_points: [
      "Common diagnostic test",
      "Can detect infections, diabetes, kidney issues",
      "Usually midstream sample needed",
      "Quick results",
    ],
    say_it_like: [
      { zh: "验尿", en: "urine test" },
    ],
    dont_say: [],
    relatedWords: ["mw15"],
  },
  {
    id: "mw61",
    word: "大便",
    pinyin: "dàbiàn",
    meanings_en: ["stool", "feces", "bowel movement"],
    category: "symptom",
    collocations: [
      { zh: "大便检查", pinyin: "dàbiàn jiǎnchá", en: "stool test" },
    ],
    examples: [
      { cn: "大便正常吗？", en: "Are your bowel movements normal?", pinyin: "Dàbiàn zhèngcháng ma?" },
    ],
    geo_snippet: "Dàbiàn (大便) means stool or bowel movement in Chinese, often discussed for digestive issues.",
    key_points: [
      "Color and consistency important",
      "Blood in stool is serious",
      "Changes may indicate issues",
    ],
    say_it_like: [],
    dont_say: [],
    relatedWords: ["mw4"],
  },
  {
    id: "mw62",
    word: "腹泻",
    pinyin: "fùxiè",
    meanings_en: ["diarrhea"],
    category: "symptom",
    collocations: [
      { zh: "严重腹泻", pinyin: "yánzhòng fùxiè", en: "severe diarrhea" },
    ],
    examples: [
      { cn: "我腹泻了好几天了。", en: "I've had diarrhea for several days.", pinyin: "Wǒ fùxiè le hǎo jǐ tiān le." },
    ],
    geo_snippet: "Fùxiè (腹泻) means diarrhea in Chinese, a common digestive complaint.",
    key_points: [
      "Can cause dehydration",
      "Note frequency and duration",
      "May indicate infection or food poisoning",
      "Stay hydrated",
    ],
    say_it_like: [
      { zh: "拉肚子", en: "diarrhea (colloquial)" },
    ],
    dont_say: [],
    relatedWords: ["mw61", "mw4"],
  },
  {
    id: "mw63",
    word: "便秘",
    pinyin: "biànmì",
    meanings_en: ["constipation"],
    category: "symptom",
    collocations: [
      { zh: "长期便秘", pinyin: "chángqī biànmì", en: "chronic constipation" },
    ],
    examples: [
      { cn: "我最近便秘。", en: "I've been constipated recently.", pinyin: "Wǒ zuìjìn biànmì." },
    ],
    geo_snippet: "Biànmì (便秘) means constipation in Chinese, a common digestive issue.",
    key_points: [
      "Opposite of diarrhea",
      "Often related to diet and water intake",
      "May need fiber or laxatives",
      "Chronic cases need evaluation",
    ],
    say_it_like: [],
    dont_say: [],
    relatedWords: ["mw61"],
  },
  {
    id: "mw64",
    word: "失眠",
    pinyin: "shīmián",
    meanings_en: ["insomnia", "sleeplessness"],
    category: "symptom",
    collocations: [
      { zh: "严重失眠", pinyin: "yánzhòng shīmián", en: "severe insomnia" },
    ],
    examples: [
      { cn: "我最近失眠很严重。", en: "I've had severe insomnia recently.", pinyin: "Wǒ zuìjìn shīmián hěn yánzhòng." },
    ],
    geo_snippet: "Shīmián (失眠) means insomnia or sleeplessness in Chinese.",
    key_points: [
      "Common complaint",
      "Can affect overall health",
      "May be stress or anxiety related",
      "Various treatments available",
    ],
    say_it_like: [
      { zh: "睡不着", en: "can't sleep" },
    ],
    dont_say: [],
    relatedWords: [],
  },
  {
    id: "mw65",
    word: "头晕",
    pinyin: "tóu yūn",
    meanings_en: ["dizziness", "dizzy"],
    category: "symptom",
    collocations: [
      { zh: "感到头晕", pinyin: "gǎndào tóu yūn", en: "feel dizzy" },
    ],
    examples: [
      { cn: "我站起来的时候头晕。", en: "I feel dizzy when I stand up.", pinyin: "Wǒ zhàn qǐlái de shíhou tóu yūn." },
    ],
    geo_snippet: "Tóu yūn (头晕) means dizziness in Chinese, a symptom with many possible causes.",
    key_points: [
      "Multiple possible causes",
      "May indicate blood pressure issues",
      "Note when it occurs",
      "Can accompany other symptoms",
    ],
    say_it_like: [],
    dont_say: [],
    relatedWords: ["mw8"],
  },
  {
    id: "mw66",
    word: "疲劳",
    pinyin: "píláo",
    meanings_en: ["fatigue", "tiredness"],
    category: "symptom",
    collocations: [
      { zh: "身体疲劳", pinyin: "shēntǐ píláo", en: "physical fatigue" },
    ],
    examples: [
      { cn: "我最近总是很疲劳。", en: "I've been very fatigued lately.", pinyin: "Wǒ zuìjìn zǒngshì hěn píláo." },
    ],
    geo_snippet: "Píláo (疲劳) means fatigue or tiredness in Chinese, a common complaint.",
    key_points: [
      "Can have many causes",
      "May indicate underlying condition",
      "Important to describe duration",
      "May need blood tests",
    ],
    say_it_like: [
      { zh: "累", en: "tired (colloquial)" },
    ],
    dont_say: [],
    relatedWords: ["mw64"],
  },
  {
    id: "mw67",
    word: "手术",
    pinyin: "shǒushù",
    meanings_en: ["surgery", "operation"],
    category: "test",
    collocations: [
      { zh: "做手术", pinyin: "zuò shǒushù", en: "have surgery" },
    ],
    examples: [
      { cn: "您以前做过手术吗？", en: "Have you had surgery before?", pinyin: "Nín yǐqián zuò guò shǒushù ma?" },
    ],
    geo_snippet: "Shǒushù (手术) means surgery or operation in Chinese.",
    key_points: [
      "Part of medical history",
      "Include all past surgeries",
      "Know what type if possible",
      "Important for future treatment",
    ],
    say_it_like: [],
    dont_say: [],
    relatedWords: ["mw40", "mw49"],
  },
  {
    id: "mw68",
    word: "打针",
    pinyin: "dǎ zhēn",
    meanings_en: ["injection", "to give/get an injection"],
    category: "medicine",
    collocations: [
      { zh: "打针吃药", pinyin: "dǎ zhēn chī yào", en: "injections and medication" },
    ],
    examples: [
      { cn: "需要打针吗？", en: "Do I need an injection?", pinyin: "Xūyào dǎ zhēn ma?" },
    ],
    geo_snippet: "Dǎ zhēn (打针) means to give or receive an injection in Chinese.",
    key_points: [
      "Can be IV, intramuscular, subcutaneous",
      "More common in Chinese hospitals than West",
      "Follow nurse instructions",
    ],
    say_it_like: [],
    dont_say: [],
    relatedWords: ["mw69"],
  },
  {
    id: "mw69",
    word: "输液",
    pinyin: "shūyè",
    meanings_en: ["IV drip", "intravenous infusion"],
    category: "medicine",
    collocations: [
      { zh: "输液室", pinyin: "shūyè shì", en: "IV room" },
    ],
    examples: [
      { cn: "医生说要输液。", en: "The doctor said I need an IV.", pinyin: "Yīshēng shuō yào shūyè." },
    ],
    geo_snippet: "Shūyè (输液) means IV drip or intravenous infusion in Chinese, common in hospitals.",
    key_points: [
      "Very common in Chinese hospitals",
      "Used for fluids and medications",
      "Done in designated IV room",
      "Takes 30 min to several hours",
    ],
    say_it_like: [
      { zh: "挂水", en: "IV drip (colloquial)" },
    ],
    dont_say: [],
    relatedWords: ["mw68"],
  },
  {
    id: "mw70",
    word: "复诊",
    pinyin: "fùzhěn",
    meanings_en: ["follow-up visit", "return visit"],
    category: "department",
    collocations: [
      { zh: "复诊时间", pinyin: "fùzhěn shíjiān", en: "follow-up appointment time" },
    ],
    examples: [
      { cn: "一周后来复诊。", en: "Come back for a follow-up in a week.", pinyin: "Yì zhōu hòu lái fùzhěn." },
    ],
    geo_snippet: "Fùzhěn (复诊) means follow-up visit or return appointment in Chinese.",
    key_points: [
      "Important for tracking progress",
      "Usually scheduled by doctor",
      "May need to register again",
      "Bring previous records",
    ],
    say_it_like: [],
    dont_say: [],
    relatedWords: ["mw1"],
  },
  {
    id: "mw71",
    word: "转诊",
    pinyin: "zhuǎnzhěn",
    meanings_en: ["referral", "transfer to another doctor"],
    category: "department",
    collocations: [
      { zh: "转诊单", pinyin: "zhuǎnzhěn dān", en: "referral form" },
    ],
    examples: [
      { cn: "我给您写个转诊。", en: "I'll write you a referral.", pinyin: "Wǒ gěi nín xiě ge zhuǎnzhěn." },
    ],
    geo_snippet: "Zhuǎnzhěn (转诊) means referral to another doctor or hospital in Chinese.",
    key_points: [
      "For specialist care",
      "May be required by insurance",
      "Brings continuity of care",
    ],
    say_it_like: [],
    dont_say: [],
    relatedWords: ["mw70"],
  },
  {
    id: "mw72",
    word: "片",
    pinyin: "piàn",
    meanings_en: ["tablet", "pill (measure word)"],
    category: "medicine",
    collocations: [
      { zh: "一片药", pinyin: "yì piàn yào", en: "one tablet" },
    ],
    examples: [
      { cn: "每次吃两片。", en: "Take two tablets each time.", pinyin: "Měi cì chī liǎng piàn." },
    ],
    geo_snippet: "Piàn (片) is the measure word for tablets or pills in Chinese.",
    key_points: [
      "Measure word for solid pills",
      "Common in dosage instructions",
      "Different from 粒 (granules/small pills)",
    ],
    say_it_like: [],
    dont_say: [],
    relatedWords: ["mw73"],
  },
  {
    id: "mw73",
    word: "粒",
    pinyin: "lì",
    meanings_en: ["grain", "capsule (measure word)"],
    category: "medicine",
    collocations: [
      { zh: "一粒胶囊", pinyin: "yì lì jiāonáng", en: "one capsule" },
    ],
    examples: [
      { cn: "每次吃一粒。", en: "Take one capsule each time.", pinyin: "Měi cì chī yì lì." },
    ],
    geo_snippet: "Lì (粒) is the measure word for capsules or small pills in Chinese.",
    key_points: [
      "Used for capsules",
      "Also for small round pills",
      "Common in dosage instructions",
    ],
    say_it_like: [],
    dont_say: [],
    relatedWords: ["mw72"],
  },
  {
    id: "mw74",
    word: "饭前",
    pinyin: "fàn qián",
    meanings_en: ["before meals"],
    category: "time",
    collocations: [
      { zh: "饭前吃", pinyin: "fàn qián chī", en: "take before meals" },
    ],
    examples: [
      { cn: "这个药饭前吃。", en: "Take this medicine before meals.", pinyin: "Zhège yào fàn qián chī." },
    ],
    geo_snippet: "Fàn qián (饭前) means before meals in Chinese, a common medication timing instruction.",
    key_points: [
      "Usually 30 min before eating",
      "Important for absorption",
      "Opposite of 饭后 (after meals)",
    ],
    say_it_like: [],
    dont_say: [],
    relatedWords: ["mw75"],
  },
  {
    id: "mw75",
    word: "饭后",
    pinyin: "fàn hòu",
    meanings_en: ["after meals"],
    category: "time",
    collocations: [
      { zh: "饭后吃", pinyin: "fàn hòu chī", en: "take after meals" },
    ],
    examples: [
      { cn: "这个药饭后吃。", en: "Take this medicine after meals.", pinyin: "Zhège yào fàn hòu chī." },
    ],
    geo_snippet: "Fàn hòu (饭后) means after meals in Chinese, a common medication timing instruction.",
    key_points: [
      "Reduces stomach irritation",
      "Usually within 30 min of eating",
      "Most common timing instruction",
    ],
    say_it_like: [],
    dont_say: [],
    relatedWords: ["mw74"],
  },
  {
    id: "mw76",
    word: "睡前",
    pinyin: "shuì qián",
    meanings_en: ["before bed", "before sleep"],
    category: "time",
    collocations: [
      { zh: "睡前吃", pinyin: "shuì qián chī", en: "take before bed" },
    ],
    examples: [
      { cn: "睡前吃一片。", en: "Take one tablet before bed.", pinyin: "Shuì qián chī yì piàn." },
    ],
    geo_snippet: "Shuì qián (睡前) means before bed in Chinese, used for medication timing.",
    key_points: [
      "For medications that cause drowsiness",
      "Or those that work overnight",
      "Usually 30 min before sleep",
    ],
    say_it_like: [],
    dont_say: [],
    relatedWords: ["mw74", "mw75"],
  },
  {
    id: "mw77",
    word: "副作用",
    pinyin: "fùzuòyòng",
    meanings_en: ["side effect"],
    category: "medicine",
    collocations: [
      { zh: "有副作用", pinyin: "yǒu fùzuòyòng", en: "have side effects" },
    ],
    examples: [
      { cn: "这个药有什么副作用？", en: "What are the side effects of this medicine?", pinyin: "Zhège yào yǒu shénme fùzuòyòng?" },
    ],
    geo_snippet: "Fùzuòyòng (副作用) means side effect in Chinese, important to understand for any medication.",
    key_points: [
      "Ask about before starting medicine",
      "Common ones: drowsiness, nausea, dizziness",
      "Report unusual reactions",
      "May need to change medication",
    ],
    say_it_like: [],
    dont_say: [],
    relatedWords: ["mw21"],
  },
  {
    id: "mw78",
    word: "禁忌",
    pinyin: "jìnjì",
    meanings_en: ["contraindication", "taboo"],
    category: "medicine",
    collocations: [
      { zh: "用药禁忌", pinyin: "yòngyào jìnjì", en: "medication contraindications" },
    ],
    examples: [
      { cn: "这个药有什么禁忌？", en: "What are the contraindications for this medicine?", pinyin: "Zhège yào yǒu shénme jìnjì?" },
    ],
    geo_snippet: "Jìnjì (禁忌) means contraindication in Chinese, things to avoid while on medication.",
    key_points: [
      "Important to follow",
      "May include foods, other drugs, activities",
      "Can cause serious interactions",
    ],
    say_it_like: [],
    dont_say: [],
    relatedWords: ["mw77"],
  },
  {
    id: "mw79",
    word: "注意事项",
    pinyin: "zhùyì shìxiàng",
    meanings_en: ["precautions", "things to note"],
    category: "medicine",
    collocations: [
      { zh: "用药注意事项", pinyin: "yòngyào zhùyì shìxiàng", en: "medication precautions" },
    ],
    examples: [
      { cn: "有什么注意事项吗？", en: "Is there anything I should be aware of?", pinyin: "Yǒu shénme zhùyì shìxiàng ma?" },
    ],
    geo_snippet: "Zhùyì shìxiàng (注意事项) means precautions or things to note in Chinese.",
    key_points: [
      "Always ask when getting prescriptions",
      "Includes storage, timing, interactions",
      "Found on medication packaging",
    ],
    say_it_like: [],
    dont_say: [],
    relatedWords: ["mw77", "mw78"],
  },
  {
    id: "mw80",
    word: "康复",
    pinyin: "kāngfù",
    meanings_en: ["recovery", "rehabilitation"],
    category: "department",
    collocations: [
      { zh: "康复治疗", pinyin: "kāngfù zhìliáo", en: "rehabilitation therapy" },
    ],
    examples: [
      { cn: "祝您早日康复！", en: "Wish you a speedy recovery!", pinyin: "Zhù nín zǎorì kāngfù!" },
    ],
    geo_snippet: "Kāngfù (康复) means recovery or rehabilitation in Chinese.",
    key_points: [
      "Common well-wish: 早日康复",
      "康复科 is rehabilitation department",
      "May involve physical therapy",
    ],
    say_it_like: [],
    dont_say: [],
    relatedWords: ["mw70"],
  },
]

// ============================================================
// MEDICAL GRAMMAR (30+ patterns)
// ============================================================

export const medicalGrammar: MedicalGrammarPattern[] = [
  {
    id: "mg1",
    pattern: "我想 + V",
    level: "HSK2",
    explanation_en: "Express 'I want to' or 'I would like to' - basic polite request form",
    geo_snippet: "The pattern '我想 + Verb' is a polite way to express wants or intentions in Chinese, commonly used in medical settings for requests.",
    key_points: [
      "Polite and appropriate for formal settings",
      "More respectful than direct commands",
      "Can add 一下 for softer tone",
      "Common in hospital registration",
    ],
    examples: [
      { cn: "我想挂号。", en: "I'd like to register." },
      { cn: "我想看医生。", en: "I'd like to see a doctor." },
    ],
    common_mistakes: [
      "Using 要 instead of 想 (too direct in formal settings)",
    ],
    clinic_templates: [
      { intent: "describe_pain", zh: "我想说一下我的症状。", en: "I'd like to describe my symptoms." },
    ],
    relatedWords: ["mw1", "mw2"],
  },
  {
    id: "mg2",
    pattern: "哪里 + 不舒服?",
    level: "HSK2",
    explanation_en: "Ask 'Where do you feel uncomfortable?' - standard medical inquiry",
    geo_snippet: "The pattern '哪里不舒服?' is the standard Chinese medical phrase for asking where a patient feels discomfort.",
    key_points: [
      "Most common doctor question",
      "哪里 means 'where'",
      "不舒服 means 'uncomfortable'",
      "Be ready with body part vocabulary",
    ],
    examples: [
      { cn: "请问您哪里不舒服？", en: "May I ask where you feel uncomfortable?" },
      { cn: "哪里痛？", en: "Where does it hurt?" },
    ],
    common_mistakes: [
      "Answering with just 'yes' or 'no' instead of specifying location",
    ],
    clinic_templates: [
      { intent: "location", zh: "我的[身体部位]不舒服。", en: "My [body part] feels uncomfortable." },
    ],
    relatedWords: ["mw4", "mw25"],
  },
  {
    id: "mg3",
    pattern: "V + 了 + Duration + 了",
    level: "HSK3",
    explanation_en: "Express duration of an ongoing action or state - 'has been V-ing for...'",
    geo_snippet: "The double 了 pattern indicates an action or state that started in the past and continues to the present, essential for describing symptom duration.",
    key_points: [
      "First 了 marks completed action aspect",
      "Second 了 indicates continuation to present",
      "Critical for describing how long symptoms have lasted",
      "Duration goes between the two 了",
    ],
    examples: [
      { cn: "我头痛了两天了。", en: "I've had a headache for two days." },
      { cn: "发烧了三个小时了。", en: "I've had a fever for three hours." },
    ],
    common_mistakes: [
      "Forgetting the second 了",
      "Putting duration in wrong position",
    ],
    faq: [
      { q: "When do I use single vs double 了?", a: "Double 了 emphasizes that something is ongoing; single 了 just marks completion." },
    ],
    clinic_templates: [
      { intent: "duration", zh: "我[症状]了[时间]了。", en: "I've had [symptom] for [duration]." },
    ],
    relatedWords: ["mw5", "mw8"],
  },
  {
    id: "mg4",
    pattern: "是...还是...?",
    level: "HSK2",
    explanation_en: "Ask 'Is it... or...?' - choice question format",
    geo_snippet: "The '是...还是...?' pattern is used to ask choice questions in Chinese, frequently used by doctors to understand symptom characteristics.",
    key_points: [
      "Presents two options",
      "Answer by choosing one option",
      "Common in medical assessments",
      "Helps narrow down diagnosis",
    ],
    examples: [
      { cn: "疼痛是持续的还是一阵一阵的？", en: "Is the pain constant or intermittent?" },
      { cn: "是突然开始的还是慢慢开始的？", en: "Did it start suddenly or gradually?" },
    ],
    common_mistakes: [
      "Answering with 是 or 不是 instead of choosing an option",
    ],
    clinic_templates: [
      { intent: "describe_pain", zh: "是[描述A]还是[描述B]？", en: "Is it [description A] or [description B]?" },
    ],
    relatedWords: ["mw5"],
  },
  {
    id: "mg5",
    pattern: "越来越 + Adj",
    level: "HSK3",
    explanation_en: "Express 'more and more' - progression pattern",
    geo_snippet: "The '越来越 + Adj' pattern describes increasing intensity, crucial for describing worsening or improving symptoms.",
    key_points: [
      "Indicates change over time",
      "Important for symptom progression",
      "Can be positive or negative change",
      "Helps doctor assess urgency",
    ],
    examples: [
      { cn: "痛得越来越厉害。", en: "The pain is getting worse and worse." },
      { cn: "感觉越来越好了。", en: "I'm feeling better and better." },
    ],
    common_mistakes: [
      "Using 很 instead of 越来越 for ongoing change",
    ],
    clinic_templates: [
      { intent: "severity", zh: "越来越[程度]。", en: "Getting more and more [severity]." },
    ],
    relatedWords: ["mw5"],
  },
  {
    id: "mg6",
    pattern: "多长时间?",
    level: "HSK2",
    explanation_en: "Ask 'How long?' - duration question",
    geo_snippet: "The question '多长时间?' asks about duration and is essential vocabulary for medical consultations.",
    key_points: [
      "Standard duration question",
      "Can also use 多久",
      "Answer with time period",
      "Critical medical information",
    ],
    examples: [
      { cn: "头痛多长时间了？", en: "How long have you had a headache?" },
      { cn: "这种情况持续多长时间？", en: "How long does this condition last?" },
    ],
    common_mistakes: [
      "Confusing with 什么时候 (when)",
    ],
    clinic_templates: [
      { intent: "duration", zh: "[症状]多长时间了？", en: "How long have you had [symptom]?" },
    ],
    relatedWords: ["mw8"],
  },
  {
    id: "mg7",
    pattern: "有点 + Adj/V",
    level: "HSK2",
    explanation_en: "Express 'a little' - mild degree",
    geo_snippet: "The pattern '有点 + Adj' expresses a mild degree of something, useful for describing slight symptoms.",
    key_points: [
      "Indicates slight degree",
      "Usually for negative adjectives",
      "Less severe than 很",
      "Common for mild symptoms",
    ],
    examples: [
      { cn: "有点咳嗽。", en: "I have a slight cough." },
      { cn: "有点发烧。", en: "I have a slight fever." },
    ],
    common_mistakes: [
      "Using 一点 before verbs (一点 follows verbs)",
    ],
    clinic_templates: [
      { intent: "describe_pain", zh: "有点[症状]。", en: "I have a slight [symptom]." },
    ],
    relatedWords: ["mw13", "mw14"],
  },
  {
    id: "mg8",
    pattern: "给 + Person + V",
    level: "HSK2",
    explanation_en: "Do something for someone - benefactive pattern",
    geo_snippet: "The '给 + Person + Verb' pattern indicates doing something for someone's benefit, common in medical prescriptions.",
    key_points: [
      "Doctor does action for patient",
      "Very common in prescriptions",
      "Indirect object pattern",
      "Patient is beneficiary",
    ],
    examples: [
      { cn: "我给您开点药。", en: "I'll prescribe some medicine for you." },
      { cn: "护士给我量了体温。", en: "The nurse took my temperature." },
    ],
    common_mistakes: [
      "Omitting 给 when there's a beneficiary",
    ],
    clinic_templates: [
      { intent: "pharmacy_instructions", zh: "给您开[药名]。", en: "Prescribing [medicine] for you." },
    ],
    relatedWords: ["mw19"],
  },
  {
    id: "mg9",
    pattern: "让 + Person + V",
    level: "HSK3",
    explanation_en: "Let/make/have someone do something - causative pattern",
    geo_snippet: "The '让 + Person + Verb' pattern expresses causing or allowing someone to do something, often used for doctor's instructions.",
    key_points: [
      "Causative construction",
      "Doctor instructs patient",
      "Can mean 'let' or 'make'",
      "Common for test referrals",
    ],
    examples: [
      { cn: "医生让我做血常规。", en: "The doctor asked me to do a blood test." },
      { cn: "请让孩子张嘴。", en: "Please have the child open their mouth." },
    ],
    common_mistakes: [
      "Confusing with 叫 (more colloquial)",
    ],
    clinic_templates: [
      { intent: "ask_result", zh: "医生让我做[检查]。", en: "The doctor asked me to do [test]." },
    ],
    relatedWords: ["mw15", "mw36"],
  },
  {
    id: "mg10",
    pattern: "请 + V + 一下",
    level: "HSK2",
    explanation_en: "Please do something (briefly) - polite request",
    geo_snippet: "The pattern '请 + Verb + 一下' is a polite way to make requests in Chinese, softened by 一下.",
    key_points: [
      "Very polite request form",
      "一下 softens the request",
      "Common in medical settings",
      "Shows respect to patient/doctor",
    ],
    examples: [
      { cn: "请等一下。", en: "Please wait a moment." },
      { cn: "请把袖子卷起来一下。", en: "Please roll up your sleeve." },
    ],
    common_mistakes: [
      "Forgetting 请 makes it less polite",
    ],
    clinic_templates: [
      { intent: "ask_explanation", zh: "请解释一下。", en: "Please explain." },
    ],
    relatedWords: ["mw36"],
  },
  {
    id: "mg11",
    pattern: "每 + Time + V + Number + 次",
    level: "HSK3",
    explanation_en: "Do something X times per time period - frequency pattern",
    geo_snippet: "The '每 + Time + V + Number + 次' pattern expresses frequency, essential for medication dosage instructions.",
    key_points: [
      "Standard dosage pattern",
      "每 means 'each/every'",
      "次 is measure word for 'times'",
      "Critical for taking medicine correctly",
    ],
    examples: [
      { cn: "每天吃三次。", en: "Take three times a day." },
      { cn: "每次吃两片。", en: "Take two tablets each time." },
    ],
    common_mistakes: [
      "Confusing word order",
    ],
    clinic_templates: [
      { intent: "pharmacy_instructions", zh: "每[时间]吃[数量]次。", en: "Take [number] times per [time period]." },
    ],
    relatedWords: ["mw72", "mw73"],
  },
  {
    id: "mg12",
    pattern: "如果...请...",
    level: "HSK3",
    explanation_en: "If... then please... - conditional instruction",
    geo_snippet: "The '如果...请...' pattern expresses conditional instructions, important for medication warnings.",
    key_points: [
      "Conditional structure",
      "Common in medication warnings",
      "Important safety information",
      "Pay attention to these instructions",
    ],
    examples: [
      { cn: "如果有过敏反应，请立即停药。", en: "If you have an allergic reaction, please stop taking the medicine immediately." },
      { cn: "如果疼痛加重，请来复诊。", en: "If the pain worsens, please come back for a follow-up." },
    ],
    common_mistakes: [
      "Omitting 请 in formal instructions",
    ],
    clinic_templates: [
      { intent: "allergy", zh: "如果有[症状]，请[动作]。", en: "If you have [symptom], please [action]." },
    ],
    relatedWords: ["mw21"],
  },
  {
    id: "mg13",
    pattern: "一共 + Number + Measure Word",
    level: "HSK2",
    explanation_en: "In total/altogether - sum expression",
    geo_snippet: "The '一共 + Number' pattern expresses a total amount, commonly used in hospital billing.",
    key_points: [
      "Indicates total amount",
      "Common in payments",
      "Often with money or items",
      "Usually at end of listing",
    ],
    examples: [
      { cn: "一共三百六十五元。", en: "365 yuan in total." },
      { cn: "一共三种药。", en: "Three types of medicine in total." },
    ],
    common_mistakes: [
      "Forgetting measure word after number",
    ],
    clinic_templates: [
      { intent: "pharmacy_instructions", zh: "一共[数量][单位]。", en: "[Number] [units] in total." },
    ],
    relatedWords: ["mw22", "mw23"],
  },
  {
    id: "mg14",
    pattern: "特别是 + Situation",
    level: "HSK3",
    explanation_en: "Especially when - emphasis on specific circumstance",
    geo_snippet: "The '特别是' pattern emphasizes specific situations, useful for describing when symptoms are worse.",
    key_points: [
      "Emphasizes specific condition",
      "Helps pinpoint triggers",
      "Important diagnostic information",
      "Often describes aggravating factors",
    ],
    examples: [
      { cn: "特别是弯腰的时候。", en: "Especially when bending over." },
      { cn: "特别是晚上更严重。", en: "Especially worse at night." },
    ],
    common_mistakes: [
      "Using 特别 without 是 for this pattern",
    ],
    clinic_templates: [
      { intent: "describe_pain", zh: "特别是[情况]的时候。", en: "Especially when [situation]." },
    ],
    relatedWords: ["mw25", "mw26"],
  },
  {
    id: "mg15",
    pattern: "有时候 + V",
    level: "HSK2",
    explanation_en: "Sometimes - occasional occurrence",
    geo_snippet: "The '有时候' pattern describes occasional occurrences, useful for intermittent symptoms.",
    key_points: [
      "Indicates intermittent occurrence",
      "Important for symptom pattern",
      "Distinguishes from constant symptoms",
      "Helps with diagnosis",
    ],
    examples: [
      { cn: "有时候左腿发麻。", en: "Sometimes my left leg feels numb." },
      { cn: "有时候会头晕。", en: "Sometimes I get dizzy." },
    ],
    common_mistakes: [
      "Using 有时 instead of 有时候 (both correct but 有时候 more common in speech)",
    ],
    clinic_templates: [
      { intent: "describe_pain", zh: "有时候会[症状]。", en: "Sometimes I have [symptom]." },
    ],
    relatedWords: ["mw27", "mw65"],
  },
  {
    id: "mg16",
    pattern: "对 + Noun + 过敏",
    level: "HSK3",
    explanation_en: "Allergic to something - allergy expression",
    geo_snippet: "The '对...过敏' pattern expresses allergies in Chinese, essential for medical history disclosure.",
    key_points: [
      "Standard allergy expression",
      "对 introduces the allergen",
      "Must disclose to medical staff",
      "Common question at registration",
    ],
    examples: [
      { cn: "我对青霉素过敏。", en: "I'm allergic to penicillin." },
      { cn: "您对什么药过敏吗？", en: "Are you allergic to any medications?" },
    ],
    common_mistakes: [
      "Forgetting 对 before the allergen",
    ],
    clinic_templates: [
      { intent: "allergy", zh: "我对[过敏原]过敏。", en: "I'm allergic to [allergen]." },
    ],
    relatedWords: ["mw21", "mw30"],
  },
  {
    id: "mg17",
    pattern: "从 + Time + 开始",
    level: "HSK2",
    explanation_en: "Starting from a time - onset expression",
    geo_snippet: "The '从...开始' pattern indicates when something started, crucial for describing symptom onset.",
    key_points: [
      "Marks starting point",
      "Important for medical history",
      "Can be specific or general time",
      "Often combined with 了",
    ],
    examples: [
      { cn: "从今天早上开始的。", en: "It started this morning." },
      { cn: "从上周开始发烧。", en: "Started having a fever since last week." },
    ],
    common_mistakes: [
      "Omitting 开始 at the end",
    ],
    clinic_templates: [
      { intent: "duration", zh: "从[时间]开始[症状]。", en: "[Symptom] started from [time]." },
    ],
    relatedWords: ["mw14"],
  },
  {
    id: "mg18",
    pattern: "控制得 + Result",
    level: "HSK4",
    explanation_en: "Control/manage with result - outcome of management",
    geo_snippet: "The '控制得' pattern describes how well something is managed, commonly used for chronic condition follow-ups.",
    key_points: [
      "Describes management outcome",
      "Common for chronic diseases",
      "得 links verb to result",
      "Used in follow-up visits",
    ],
    examples: [
      { cn: "血糖控制得怎么样？", en: "How is your blood sugar control?" },
      { cn: "控制得比较好。", en: "It's fairly well controlled." },
    ],
    common_mistakes: [
      "Forgetting 得 before result",
    ],
    clinic_templates: [
      { intent: "med_history", zh: "[病情]控制得[结果]。", en: "[Condition] is controlled [result]." },
    ],
    relatedWords: ["mw31", "mw32"],
  },
  {
    id: "mg19",
    pattern: "尽量 + V",
    level: "HSK4",
    explanation_en: "Try to/as much as possible - best effort",
    geo_snippet: "The '尽量' pattern expresses making best effort, often used for lifestyle recommendations.",
    key_points: [
      "Expresses best effort",
      "Common in health advice",
      "Not absolute requirement",
      "Shows trying within ability",
    ],
    examples: [
      { cn: "尽量少吃甜食。", en: "Try to eat less sweets." },
      { cn: "尽量多休息。", en: "Try to rest more." },
    ],
    common_mistakes: [
      "Confusing with 尽力 (more about trying hard despite difficulty)",
    ],
    clinic_templates: [
      { intent: "pharmacy_instructions", zh: "尽量[建议]。", en: "Try to [advice]." },
    ],
    relatedWords: ["mw32"],
  },
  {
    id: "mg20",
    pattern: "除了...还有...",
    level: "HSK3",
    explanation_en: "Besides... also have... - additional information",
    geo_snippet: "The '除了...还有...' pattern adds additional information, useful for listing multiple symptoms.",
    key_points: [
      "Lists additional items/symptoms",
      "除了 introduces first item",
      "还有 introduces additional items",
      "Important for complete symptom picture",
    ],
    examples: [
      { cn: "除了发烧还有其他症状吗？", en: "Besides the fever, are there any other symptoms?" },
      { cn: "除了头痛，还有恶心。", en: "Besides headache, I also have nausea." },
    ],
    common_mistakes: [
      "Using 和 instead of 还有 (和 just lists, 还有 emphasizes addition)",
    ],
    clinic_templates: [
      { intent: "describe_pain", zh: "除了[症状1]，还有[症状2]。", en: "Besides [symptom1], I also have [symptom2]." },
    ],
    relatedWords: ["mw11", "mw14"],
  },
  {
    id: "mg21",
    pattern: "先...然后...",
    level: "HSK2",
    explanation_en: "First... then... - sequence of actions",
    geo_snippet: "The '先...然后...' pattern describes a sequence of actions, common in medical instructions.",
    key_points: [
      "Orders sequential actions",
      "先 = first",
      "然后 = then",
      "Common in procedure explanations",
    ],
    examples: [
      { cn: "先量体温，然后去看医生。", en: "First take your temperature, then go see the doctor." },
      { cn: "先挂号，然后等叫号。", en: "First register, then wait for your number to be called." },
    ],
    common_mistakes: [
      "Putting 然后 at beginning of sentence",
    ],
    clinic_templates: [
      { intent: "ask_explanation", zh: "先[步骤1]，然后[步骤2]。", en: "First [step1], then [step2]." },
    ],
    relatedWords: ["mw1", "mw36"],
  },
  {
    id: "mg22",
    pattern: "把 + Object + V",
    level: "HSK3",
    explanation_en: "Do something to an object - disposal construction",
    geo_snippet: "The '把' construction emphasizes action on a specific object, common in medical instructions.",
    key_points: [
      "Emphasizes what happens to object",
      "Object moves before verb",
      "Common for specific instructions",
      "Often with result complement",
    ],
    examples: [
      { cn: "请把袖子卷起来。", en: "Please roll up your sleeve." },
      { cn: "把身上的金属物品取下来。", en: "Remove the metal objects from your body." },
    ],
    common_mistakes: [
      "Using 把 with verbs that don't affect objects",
    ],
    clinic_templates: [
      { intent: "ask_explanation", zh: "请把[物品][动作]。", en: "Please [action] [object]." },
    ],
    relatedWords: ["mw37", "mw15"],
  },
  {
    id: "mg23",
    pattern: "有没有 + V/Adj?",
    level: "HSK2",
    explanation_en: "Do you have/Is there? - yes/no question",
    geo_snippet: "The '有没有' pattern is a common yes/no question format in Chinese medical consultations.",
    key_points: [
      "Standard yes/no question",
      "Very common in medical interviews",
      "Answer with 有 or 没有",
      "Can precede various conditions",
    ],
    examples: [
      { cn: "有没有怀孕？", en: "Are you pregnant?" },
      { cn: "有没有过敏史？", en: "Do you have any allergy history?" },
    ],
    common_mistakes: [
      "Answering with 是/不是 instead of 有/没有",
    ],
    clinic_templates: [
      { intent: "past_history", zh: "有没有[病史/情况]？", en: "Do you have [history/condition]?" },
    ],
    relatedWords: ["mw21", "mw38"],
  },
  {
    id: "mg24",
    pattern: "什么时候 + V?",
    level: "HSK2",
    explanation_en: "When did/do you...? - time question",
    geo_snippet: "The '什么时候' pattern asks about timing, essential for understanding symptom onset.",
    key_points: [
      "Asks about time of action",
      "Important for medical history",
      "Can refer to past or future",
      "Answer with specific time",
    ],
    examples: [
      { cn: "什么时候开始不舒服的？", en: "When did you start feeling unwell?" },
      { cn: "结果什么时候出来？", en: "When will the results be ready?" },
    ],
    common_mistakes: [
      "Confusing with 多长时间 (duration vs. point in time)",
    ],
    clinic_templates: [
      { intent: "ask_result", zh: "[结果]什么时候能出来？", en: "When will [results] be ready?" },
    ],
    relatedWords: ["mw36"],
  },
  {
    id: "mg25",
    pattern: "...的时候",
    level: "HSK2",
    explanation_en: "When/while doing something - time clause",
    geo_snippet: "The '...的时候' pattern creates time clauses, useful for describing when symptoms occur.",
    key_points: [
      "Creates 'when' clause",
      "Describes timing of symptom",
      "Important diagnostic information",
      "Often with activities or times",
    ],
    examples: [
      { cn: "吞咽的时候痛。", en: "It hurts when swallowing." },
      { cn: "站起来的时候头晕。", en: "I get dizzy when standing up." },
    ],
    common_mistakes: [
      "Forgetting 的 before 时候",
    ],
    clinic_templates: [
      { intent: "describe_pain", zh: "[动作]的时候[症状]。", en: "[Symptom] when [action]." },
    ],
    relatedWords: ["mw42", "mw65"],
  },
  {
    id: "mg26",
    pattern: "...以后",
    level: "HSK2",
    explanation_en: "After doing something - sequence marker",
    geo_snippet: "The '...以后' pattern indicates 'after' in time sequence, common in medical instructions.",
    key_points: [
      "Indicates 'after' in time",
      "Common for timing instructions",
      "Can follow verbs or nouns",
      "Used in dosage instructions",
    ],
    examples: [
      { cn: "饭后吃药。", en: "Take medicine after meals." },
      { cn: "下午三点以后可以取报告。", en: "You can pick up the report after 3 PM." },
    ],
    common_mistakes: [
      "Confusing 以后 with 后来 (后来 = 'later' for past events)",
    ],
    clinic_templates: [
      { intent: "pharmacy_instructions", zh: "[时间/动作]以后[做什么]。", en: "[Do what] after [time/action]." },
    ],
    relatedWords: ["mw75"],
  },
  {
    id: "mg27",
    pattern: "可以...吗?",
    level: "HSK2",
    explanation_en: "Can I/May I...? - permission question",
    geo_snippet: "The '可以...吗?' pattern politely asks for permission or possibility in Chinese.",
    key_points: [
      "Polite permission request",
      "Common in hospital settings",
      "Answer: 可以 or 不可以",
      "More polite than 能...吗",
    ],
    examples: [
      { cn: "可以用医保吗？", en: "Can I use medical insurance?" },
      { cn: "可以吃东西吗？", en: "Can I eat?" },
    ],
    common_mistakes: [
      "Using when 能 is more appropriate (physical ability)",
    ],
    clinic_templates: [
      { intent: "ask_explanation", zh: "可以[动作]吗？", en: "Can I [action]?" },
    ],
    relatedWords: ["mw3", "mw24"],
  },
  {
    id: "mg28",
    pattern: "需要 + V",
    level: "HSK3",
    explanation_en: "Need to do something - necessity",
    geo_snippet: "The '需要' pattern expresses necessity, commonly used for required medical procedures.",
    key_points: [
      "Expresses necessity",
      "Often used by doctors",
      "Can be followed by noun or verb",
      "Important instruction indicator",
    ],
    examples: [
      { cn: "需要住院观察。", en: "You need to be hospitalized for observation." },
      { cn: "不需要手术。", en: "No surgery is needed." },
    ],
    common_mistakes: [
      "Using 需要 interchangeably with 要 (需要 is more formal/necessary)",
    ],
    clinic_templates: [
      { intent: "ask_explanation", zh: "需要[动作/检查]吗？", en: "Do I need [action/test]?" },
    ],
    relatedWords: ["mw45", "mw67"],
  },
  {
    id: "mg29",
    pattern: "应该 + V",
    level: "HSK3",
    explanation_en: "Should do something - recommendation",
    geo_snippet: "The '应该' pattern gives recommendations, commonly used for medical advice.",
    key_points: [
      "Gives recommendation",
      "Softer than 必须 (must)",
      "Common in health advice",
      "Often from doctor to patient",
    ],
    examples: [
      { cn: "应该多休息。", en: "You should rest more." },
      { cn: "应该少吃盐。", en: "You should eat less salt." },
    ],
    common_mistakes: [
      "Confusing with 要 (要 can mean 'want' or 'will')",
    ],
    clinic_templates: [
      { intent: "pharmacy_instructions", zh: "应该[建议]。", en: "You should [advice]." },
    ],
    relatedWords: ["mw79"],
  },
  {
    id: "mg30",
    pattern: "不要 + V",
    level: "HSK2",
    explanation_en: "Don't do something - prohibition/warning",
    geo_snippet: "The '不要' pattern expresses prohibition, essential for medication and treatment warnings.",
    key_points: [
      "Negative command",
      "Important for warnings",
      "Stronger than 别",
      "Common in medication instructions",
    ],
    examples: [
      { cn: "吃药期间不要喝酒。", en: "Don't drink alcohol while taking medication." },
      { cn: "不要吃辛辣食物。", en: "Don't eat spicy food." },
    ],
    common_mistakes: [
      "Using 不 instead of 不要 for commands",
    ],
    clinic_templates: [
      { intent: "pharmacy_instructions", zh: "不要[禁忌事项]。", en: "Don't [contraindication]." },
    ],
    relatedWords: ["mw78"],
  },
]

// ============================================================
// MEDICAL PHRASE TEMPLATES (10+ intents)
// ============================================================

export const medicalIntents: MedicalIntent[] = [
  {
    intent: "describe_symptom",
    title: "Describe Symptom",
    templates: [
      {
        zh: "我[身体部位]很[程度][症状]。",
        pinyin: "Wǒ [body part] hěn [degree] [symptom].",
        en: "My [body part] is very [degree] [symptom].",
        slots: { body_part: "身体部位", degree: "程度", symptom: "症状" },
      },
      {
        zh: "我感觉[身体部位]不舒服。",
        pinyin: "Wǒ gǎnjué [body part] bù shūfu.",
        en: "I feel uncomfortable in my [body part].",
        slots: { body_part: "身体部位" },
      },
      {
        zh: "我有[症状]。",
        pinyin: "Wǒ yǒu [symptom].",
        en: "I have [symptom].",
        slots: { symptom: "症状" },
      },
    ],
    tips: [
      { zh: "描述症状时要具体", en: "Be specific when describing symptoms" },
      { zh: "说明疼痛的性质：刺痛、钝痛、胀痛", en: "Describe pain type: sharp, dull, bloating" },
    ],
  },
  {
    intent: "duration",
    title: "Duration",
    templates: [
      {
        zh: "已经[时间]了。",
        pinyin: "Yǐjīng [duration] le.",
        en: "It's been [duration] already.",
        slots: { duration: "时间" },
      },
      {
        zh: "[症状]了[时间]了。",
        pinyin: "[Symptom] le [duration] le.",
        en: "I've had [symptom] for [duration].",
        slots: { symptom: "症状", duration: "时间" },
      },
      {
        zh: "从[时间]开始的。",
        pinyin: "Cóng [time] kāishǐ de.",
        en: "It started from [time].",
        slots: { time: "时间" },
      },
    ],
    tips: [
      { zh: "用具体时间：两天、一周、昨天", en: "Use specific times: two days, one week, yesterday" },
      { zh: "说明是突然开始还是慢慢开始", en: "Mention if it started suddenly or gradually" },
    ],
  },
  {
    intent: "severity",
    title: "Severity",
    templates: [
      {
        zh: "很[程度]。",
        pinyin: "Hěn [degree].",
        en: "Very [degree].",
        slots: { degree: "程度" },
      },
      {
        zh: "越来越[程度]。",
        pinyin: "Yuè lái yuè [degree].",
        en: "Getting more and more [degree].",
        slots: { degree: "程度" },
      },
      {
        zh: "[程度]得受不了。",
        pinyin: "[Degree] de shòu bù liǎo.",
        en: "So [degree] I can't stand it.",
        slots: { degree: "程度" },
      },
    ],
    tips: [
      { zh: "程度词：轻微、一般、严重、剧烈", en: "Severity words: mild, moderate, severe, intense" },
      { zh: "1-10分评估疼痛程度", en: "Rate pain on a scale of 1-10" },
    ],
  },
  {
    intent: "location",
    title: "Location",
    templates: [
      {
        zh: "在[位置]。",
        pinyin: "Zài [location].",
        en: "At [location].",
        slots: { location: "位置" },
      },
      {
        zh: "主要是[位置]。",
        pinyin: "Zhǔyào shì [location].",
        en: "Mainly at [location].",
        slots: { location: "位置" },
      },
      {
        zh: "从[位置1]延伸到[位置2]。",
        pinyin: "Cóng [location1] yánshēn dào [location2].",
        en: "Extends from [location1] to [location2].",
        slots: { location1: "位置1", location2: "位置2" },
      },
    ],
    tips: [
      { zh: "可以用手指出位置", en: "You can point to show the location" },
      { zh: "说明是固定位置还是会移动", en: "Mention if pain is fixed or moves" },
    ],
  },
  {
    intent: "allergy",
    title: "Allergy",
    templates: [
      {
        zh: "我对[过敏原]过敏。",
        pinyin: "Wǒ duì [allergen] guòmǐn.",
        en: "I'm allergic to [allergen].",
        slots: { allergen: "过敏原" },
      },
      {
        zh: "我没有药物过敏。",
        pinyin: "Wǒ méiyǒu yàowù guòmǐn.",
        en: "I don't have any drug allergies.",
        slots: {},
      },
      {
        zh: "我不确定，但吃[食物/药物]后会[反应]。",
        pinyin: "Wǒ bù quèdìng, dàn chī [food/medicine] hòu huì [reaction].",
        en: "I'm not sure, but after taking [food/medicine] I get [reaction].",
        slots: { food_medicine: "食物/药物", reaction: "反应" },
      },
    ],
    tips: [
      { zh: "常见过敏原：青霉素、海鲜、花生", en: "Common allergens: penicillin, seafood, peanuts" },
      { zh: "一定要主动告知医生过敏史", en: "Always proactively tell doctors about allergies" },
    ],
  },
  {
    intent: "med_history",
    title: "Medication History",
    templates: [
      {
        zh: "我在吃[药名]。",
        pinyin: "Wǒ zài chī [medicine name].",
        en: "I'm taking [medicine name].",
        slots: { medicine_name: "药名" },
      },
      {
        zh: "我每天吃[药名]，[剂量]。",
        pinyin: "Wǒ měi tiān chī [medicine], [dosage].",
        en: "I take [medicine] daily, [dosage].",
        slots: { medicine: "药名", dosage: "剂量" },
      },
      {
        zh: "我没有在吃任何药。",
        pinyin: "Wǒ méiyǒu zài chī rènhé yào.",
        en: "I'm not taking any medication.",
        slots: {},
      },
    ],
    tips: [
      { zh: "带上正在服用的药物或药盒", en: "Bring medications or boxes you're currently taking" },
      { zh: "包括保健品和中药", en: "Include supplements and Chinese medicine" },
    ],
  },
  {
    intent: "past_history",
    title: "Past Medical History",
    templates: [
      {
        zh: "我有[疾病]。",
        pinyin: "Wǒ yǒu [disease].",
        en: "I have [disease].",
        slots: { disease: "疾病" },
      },
      {
        zh: "我[时间]做过[手术]。",
        pinyin: "Wǒ [time] zuò guò [surgery].",
        en: "I had [surgery] in [time].",
        slots: { time: "时间", surgery: "手术" },
      },
      {
        zh: "家里有人有[疾病]。",
        pinyin: "Jiālǐ yǒu rén yǒu [disease].",
        en: "Someone in my family has [disease].",
        slots: { disease: "疾病" },
      },
    ],
    tips: [
      { zh: "常见慢性病：高血压、糖尿病、心脏病", en: "Common chronic diseases: hypertension, diabetes, heart disease" },
      { zh: "手术史也要提及", en: "Mention any surgical history" },
    ],
  },
  {
    intent: "ask_explanation",
    title: "Ask for Explanation",
    templates: [
      {
        zh: "请问这是什么意思？",
        pinyin: "Qǐngwèn zhè shì shénme yìsi?",
        en: "May I ask what this means?",
        slots: {},
      },
      {
        zh: "您能再解释一下吗？",
        pinyin: "Nín néng zài jiěshì yíxià ma?",
        en: "Could you explain that again?",
        slots: {},
      },
      {
        zh: "这个检查是查什么的？",
        pinyin: "Zhège jiǎnchá shì chá shénme de?",
        en: "What does this test check for?",
        slots: {},
      },
    ],
    tips: [
      { zh: "不懂就要问，这是你的权利", en: "Ask if you don't understand - it's your right" },
      { zh: "可以要求医生说慢一点", en: "You can ask the doctor to speak more slowly" },
    ],
  },
  {
    intent: "ask_result",
    title: "Ask About Test Result",
    templates: [
      {
        zh: "结果什么时候出来？",
        pinyin: "Jiéguǒ shénme shíhou chūlái?",
        en: "When will the results be ready?",
        slots: {},
      },
      {
        zh: "检查结果正常吗？",
        pinyin: "Jiǎnchá jiéguǒ zhèngcháng ma?",
        en: "Are the test results normal?",
        slots: {},
      },
      {
        zh: "这个数值高/低吗？",
        pinyin: "Zhège shùzhí gāo/dī ma?",
        en: "Is this value high/low?",
        slots: {},
      },
    ],
    tips: [
      { zh: "可以要求医生解释报告", en: "You can ask the doctor to explain the report" },
      { zh: "保存好检查报告", en: "Keep your test reports" },
    ],
  },
  {
    intent: "pharmacy_instructions",
    title: "Pharmacy Instructions",
    templates: [
      {
        zh: "这个药怎么吃？",
        pinyin: "Zhège yào zěnme chī?",
        en: "How do I take this medicine?",
        slots: {},
      },
      {
        zh: "有什么副作用吗？",
        pinyin: "Yǒu shénme fùzuòyòng ma?",
        en: "Are there any side effects?",
        slots: {},
      },
      {
        zh: "可以和[其他药]一起吃吗？",
        pinyin: "Kěyǐ hé [other medicine] yìqǐ chī ma?",
        en: "Can I take this with [other medicine]?",
        slots: { other_medicine: "其他药" },
      },
    ],
    tips: [
      { zh: "注意用法用量：饭前/饭后/睡前", en: "Note dosage: before/after meals/before bed" },
      { zh: "询问保存方法", en: "Ask about storage instructions" },
    ],
  },
]

// ============================================================
// DOCTOR QUESTIONS CHECKLIST
// ============================================================

export const doctorChecklist: DoctorChecklistItem[] = [
  {
    id: "dc1",
    label_en: "Onset",
    label_zh: "发病时间",
    question_zh: "什么时候开始的？",
    question_pinyin: "Shénme shíhou kāishǐ de?",
    question_en: "When did it start?",
    answer_template_zh: "从[时间]开始的。",
    answer_template_en: "It started from [time].",
  },
  {
    id: "dc2",
    label_en: "Duration",
    label_zh: "持续时间",
    question_zh: "持续多长时间了？",
    question_pinyin: "Chíxù duō cháng shíjiān le?",
    question_en: "How long has it lasted?",
    answer_template_zh: "已经[时间]了。",
    answer_template_en: "It's been [duration] already.",
  },
  {
    id: "dc3",
    label_en: "Severity",
    label_zh: "严重程度",
    question_zh: "严重吗？1到10分，几分？",
    question_pinyin: "Yánzhòng ma? 1 dào 10 fēn, jǐ fēn?",
    question_en: "Is it serious? On a scale of 1-10?",
    answer_template_zh: "大概[数字]分。",
    answer_template_en: "About [number] out of 10.",
  },
  {
    id: "dc4",
    label_en: "Triggers",
    label_zh: "诱因",
    question_zh: "什么情况下会加重？",
    question_pinyin: "Shénme qíngkuàng xià huì jiāzhòng?",
    question_en: "What makes it worse?",
    answer_template_zh: "[情况]的时候会加重。",
    answer_template_en: "It gets worse when [situation].",
  },
  {
    id: "dc5",
    label_en: "Allergies",
    label_zh: "过敏史",
    question_zh: "有没有药物或食物过敏？",
    question_pinyin: "Yǒu méiyǒu yàowù huò shíwù guòmǐn?",
    question_en: "Do you have any drug or food allergies?",
    answer_template_zh: "我对[过敏原]过敏。/ 我没有过敏。",
    answer_template_en: "I'm allergic to [allergen]. / I don't have allergies.",
  },
  {
    id: "dc6",
    label_en: "Current Medications",
    label_zh: "目前用药",
    question_zh: "现在在吃什么药？",
    question_pinyin: "Xiànzài zài chī shénme yào?",
    question_en: "What medications are you currently taking?",
    answer_template_zh: "我在吃[药名]。/ 我没有在吃药。",
    answer_template_en: "I'm taking [medicine]. / I'm not taking any medication.",
  },
  {
    id: "dc7",
    label_en: "Past Medical History",
    label_zh: "既往病史",
    question_zh: "以前得过什么病？做过什么手术？",
    question_pinyin: "Yǐqián dé guò shénme bìng? Zuò guò shénme shǒushù?",
    question_en: "What illnesses have you had? Any surgeries?",
    answer_template_zh: "我有[疾病]。/ 我[时间]做过[手术]。",
    answer_template_en: "I have [disease]. / I had [surgery] in [year].",
  },
  {
    id: "dc8",
    label_en: "Family History",
    label_zh: "家族病史",
    question_zh: "家里人有什么慢性病吗？",
    question_pinyin: "Jiālǐ rén yǒu shénme mànxìng bìng ma?",
    question_en: "Do any family members have chronic diseases?",
    answer_template_zh: "我[家人]有[疾病]。/ 没有。",
    answer_template_en: "My [family member] has [disease]. / No.",
  },
  {
    id: "dc9",
    label_en: "Pregnancy",
    label_zh: "怀孕情况",
    question_zh: "有没有怀孕？",
    question_pinyin: "Yǒu méiyǒu huáiyùn?",
    question_en: "Are you pregnant?",
    answer_template_zh: "有，[几周/几个月]了。/ 没有。",
    answer_template_en: "Yes, [weeks/months]. / No.",
  },
  {
    id: "dc10",
    label_en: "Lifestyle",
    label_zh: "生活习惯",
    question_zh: "抽烟喝酒吗？睡眠怎么样？",
    question_pinyin: "Chōuyān hē jiǔ ma? Shuìmián zěnmeyàng?",
    question_en: "Do you smoke or drink? How's your sleep?",
    answer_template_zh: "我[抽烟/喝酒/不抽烟/不喝酒]。睡眠[好/不好]。",
    answer_template_en: "I [smoke/drink/don't smoke/don't drink]. Sleep is [good/not good].",
  },
]

// Helper function to get medical scenario by ID
export function getMedicalScenarioById(id: string): MedicalScenario | undefined {
  return medicalScenarios.find((s) => s.id === id)
}

// Helper function to get medical word by ID
export function getMedicalWordById(id: string): MedicalWord | undefined {
  return medicalLexicon.find((w) => w.id === id)
}

// Helper function to get medical grammar by ID  
export function getMedicalGrammarById(id: string): MedicalGrammarPattern | undefined {
  return medicalGrammar.find((g) => g.id === id)
}

// Helper to get scenarios by category
export function getScenariosByCategory(category: MedicalCategory): MedicalScenario[] {
  return medicalScenarios.filter((s) => s.category === category)
}

// Helper to get words by category
export function getWordsByCategory(category: LexiconCategory): MedicalWord[] {
  return medicalLexicon.filter((w) => w.category === category)
}

// Export medicalPhraseTemplates as expected by IntentTemplatesPanel
export const medicalPhraseTemplates = {
  intents: medicalIntents,
}
