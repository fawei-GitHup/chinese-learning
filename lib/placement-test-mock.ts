// 分级测试题库 Mock 数据
// 简化题型：选择题为主，HSK1-6级别，每级4-5题

export type HSKLevel = "HSK1" | "HSK2" | "HSK3" | "HSK4" | "HSK5" | "HSK6"

export interface PlacementQuestion {
  id: string
  level: HSKLevel
  question: string
  options: string[]
  correctIndex: number
  explanation?: string
}

// HSK1 级别题目（5题）
const hsk1Questions: PlacementQuestion[] = [
  {
    id: "hsk1-1",
    level: "HSK1",
    question: "你好 (nǐ hǎo) 是什么意思？",
    options: ["再见", "你好", "谢谢", "对不起"],
    correctIndex: 1,
    explanation: "你好是最基本的中文问候语，表示'Hello'。"
  },
  {
    id: "hsk1-2",
    level: "HSK1",
    question: "哪个词表示'吃'？",
    options: ["喝 (hē)", "吃 (chī)", "看 (kàn)", "听 (tīng)"],
    correctIndex: 1,
    explanation: "吃是'to eat'的意思，是HSK1的基础词汇。"
  },
  {
    id: "hsk1-3",
    level: "HSK1",
    question: "我___学生。(填入合适的词)",
    options: ["在", "有", "是", "做"],
    correctIndex: 2,
    explanation: "表示'我是学生'用'是'，这是基本的判断句。"
  },
  {
    id: "hsk1-4",
    level: "HSK1",
    question: "'谢谢'的拼音是？",
    options: ["xièxie", "zàijiàn", "nǐhǎo", "duìbuqǐ"],
    correctIndex: 0,
    explanation: "'谢谢'读作xiè xie，表示感谢。"
  },
  {
    id: "hsk1-5",
    level: "HSK1",
    question: "哪个词表示'爱好、喜欢'？",
    options: ["不喜欢", "喜欢 (xǐhuan)", "讨厌", "害怕"],
    correctIndex: 1,
    explanation: "喜欢是HSK1核心词汇，表示'to like'。"
  }
]

// HSK2 级别题目（4题）
const hsk2Questions: PlacementQuestion[] = [
  {
    id: "hsk2-1",
    level: "HSK2",
    question: "选择正确的句子：",
    options: [
      "我吃了饭",
      "我了吃饭",
      "吃了我饭",
      "饭了吃我"
    ],
    correctIndex: 0,
    explanation: "'了'表示完成，应该放在动词后面：我吃了饭。"
  },
  {
    id: "hsk2-2",
    level: "HSK2",
    question: "___天气不好，__我还是去了。",
    options: [
      "因为...所以",
      "虽然...但是",
      "如果...就",
      "不但...而且"
    ],
    correctIndex: 1,
    explanation: "虽然...但是表示转折，适合这个语境。"
  },
  {
    id: "hsk2-3",
    level: "HSK2",
    question: "他比我___。(选择表示'高')",
    options: ["很高", "高", "更高", "最高"],
    correctIndex: 1,
    explanation: "比较句中不用'很'，直接用形容词：他比我高。"
  },
  {
    id: "hsk2-4",
    level: "HSK2",
    question: "'已经'的意思是？",
    options: ["将要", "正在", "已经", "从来没有"],
    correctIndex: 2,
    explanation: "'已经'表示某事已经完成或发生了。"
  }
]

// HSK3 级别题目（4题）
const hsk3Questions: PlacementQuestion[] = [
  {
    id: "hsk3-1",
    level: "HSK3",
    question: "请___门关上。",
    options: ["让", "把", "被", "给"],
    correctIndex: 1,
    explanation: "把字句用于强调对某物的处置，这里是'把门关上'。"
  },
  {
    id: "hsk3-2",
    level: "HSK3",
    question: "'了解'和'知道'的区别是？",
    options: [
      "完全一样",
      "了解更深入，知道是基本知晓",
      "知道更深入，了解是基本知晓",
      "没有区别"
    ],
    correctIndex: 1,
    explanation: "'了解'表示深入理解，'知道'只是知晓事实。"
  },
  {
    id: "hsk3-3",
    level: "HSK3",
    question: "天气___热了。",
    options: ["很", "越来越", "比较", "最"],
    correctIndex: 1,
    explanation: "'越来越'表示程度逐渐增加：越来越热。"
  },
  {
    id: "hsk3-4",
    level: "HSK3",
    question: "选择正确的'着'用法：",
    options: [
      "他正在吃着饭",
      "门开着",
      "我看着书了",
      "他着了"
    ],
    correctIndex: 1,
    explanation: "'着'表示持续状态，'门开着'表示门处于开的状态。"
  }
]

// HSK4 级别题目（4题）
const hsk4Questions: PlacementQuestion[] = [
  {
    id: "hsk4-1",
    level: "HSK4",
    question: "'经济' (jīngjì) 是什么意思？",
    options: ["政治", "经济", "文化", "科学"],
    correctIndex: 1,
    explanation: "'经济'是'economy'的意思，是HSK4的核心词汇。"
  },
  {
    id: "hsk4-2",
    level: "HSK4",
    question: "我的手机___偷了。",
    options: ["把", "让", "被", "给"],
    correctIndex: 2,
    explanation: "'被'表示被动，'我的手机被偷了'。"
  },
  {
    id: "hsk4-3",
    level: "HSK4",
    question: "___多难，我都要学会。",
    options: ["虽然", "因为", "不管", "如果"],
    correctIndex: 2,
    explanation: "'不管...都'表示'无论...都'，强调决心。"
  },
  {
    id: "hsk4-4",
    level: "HSK4",
    question: "'目标'的意思是？",
    options: ["结果", "过程", "目标", "方法"],
    correctIndex: 2,
    explanation: "'目标'是'goal'或'objective'的意思。"
  }
]

// HSK5 级别题目（4题）
const hsk5Questions: PlacementQuestion[] = [
  {
    id: "hsk5-1",
    level: "HSK5",
    question: "选择正确的句子结构：",
    options: [
      "之所以成功，是因为努力",
      "成功是因为努力之所以",
      "因为努力之所以成功",
      "是因为成功之所以努力"
    ],
    correctIndex: 0,
    explanation: "'之所以...是因为...'表示原因，是HSK5的高级句型。"
  },
  {
    id: "hsk5-2",
    level: "HSK5",
    question: "'策略'的意思最接近？",
    options: ["问题", "方法", "战略、策略", "结果"],
    correctIndex: 2,
    explanation: "'策略'是'strategy'的意思。"
  },
  {
    id: "hsk5-3",
    level: "HSK5",
    question: "与其___，不如___。(选择正确搭配)",
    options: [
      "说/做",
      "做/说",
      "想/说",
      "听/看"
    ],
    correctIndex: 0,
    explanation: "'与其...不如...'表示宁愿做后者，与其说不如做。"
  },
  {
    id: "hsk5-3",
    level: "HSK5",
    question: "'现象'一词最常用于？",
    options: [
      "描述人物",
      "描述现象或情况",
      "描述地点",
      "描述时间"
    ],
    correctIndex: 1,
    explanation: "'现象'是'phenomenon'，用于描述客观存在的情况。"
  }
]

// HSK6 级别题目（3题）
const hsk6Questions: PlacementQuestion[] = [
  {
    id: "hsk6-1",
    level: "HSK6",
    question: "'鉴于'的用法是？",
    options: [
      "表示原因：鉴于天气不好",
      "表示转折",
      "表示假设",
      "表示强调"
    ],
    correctIndex: 0,
    explanation: "'鉴于'是正式书面语，表示'in view of, given that'。"
  },
  {
    id: "hsk6-2",
    level: "HSK6",
    question: "'渊博'形容的是？",
    options: [
      "知识丰富",
      "身体强壮",
      "性格开朗",
      "外貌英俊"
    ],
    correctIndex: 0,
    explanation: "'渊博'形容知识广博深厚，如'学识渊博'。"
  },
  {
    id: "hsk6-3",
    level: "HSK6",
    question: "'何尝不是'的意思是？",
    options: [
      "绝对不是",
      "难道不是吗（反问，表示肯定）",
      "可能是",
      "从来不是"
    ],
    correctIndex: 1,
    explanation: "'何尝不'是反问，表示强烈肯定：难道不是吗？"
  }
]

// 合并所有题目
export const allPlacementQuestions: PlacementQuestion[] = [
  ...hsk1Questions,
  ...hsk2Questions,
  ...hsk3Questions,
  ...hsk4Questions,
  ...hsk5Questions,
  ...hsk6Questions
]

// 按级别分组
export const questionsByLevel: Record<HSKLevel, PlacementQuestion[]> = {
  HSK1: hsk1Questions,
  HSK2: hsk2Questions,
  HSK3: hsk3Questions,
  HSK4: hsk4Questions,
  HSK5: hsk5Questions,
  HSK6: hsk6Questions
}

// 评分和等级计算
export interface TestResult {
  totalQuestions: number
  correctAnswers: number
  score: number // 0-100
  assessedLevel: HSKLevel
  levelScores: Record<HSKLevel, { correct: number; total: number }>
}

/**
 * 计算测试结果和评估HSK等级
 */
export function calculateTestResult(
  userAnswers: Record<string, number>
): TestResult {
  const levelScores: Record<HSKLevel, { correct: number; total: number }> = {
    HSK1: { correct: 0, total: 0 },
    HSK2: { correct: 0, total: 0 },
    HSK3: { correct: 0, total: 0 },
    HSK4: { correct: 0, total: 0 },
    HSK5: { correct: 0, total: 0 },
    HSK6: { correct: 0, total: 0 }
  }

  let correctAnswers = 0
  const totalQuestions = allPlacementQuestions.length

  // 统计每个级别的正确率
  allPlacementQuestions.forEach((q) => {
    levelScores[q.level].total++
    
    if (userAnswers[q.id] === q.correctIndex) {
      correctAnswers++
      levelScores[q.level].correct++
    }
  })

  // 计算总分 (0-100)
  const score = Math.round((correctAnswers / totalQuestions) * 100)

  // 根据各级别正确率评估用户等级
  const assessedLevel = assessHSKLevel(levelScores, score)

  return {
    totalQuestions,
    correctAnswers,
    score,
    assessedLevel,
    levelScores
  }
}

/**
 * 根据各级别答题情况评估HSK等级
 * 策略：如果某级别正确率>= 60%，且下一级<60%，则评为该级别
 */
function assessHSKLevel(
  levelScores: Record<HSKLevel, { correct: number; total: number }>,
  totalScore: number
): HSKLevel {
  const levels: HSKLevel[] = ["HSK1", "HSK2", "HSK3", "HSK4", "HSK5", "HSK6"]
  const threshold = 0.6 // 60% 正确率

  // 从高到低检查
  for (let i = levels.length - 1; i >= 0; i--) {
    const level = levels[i]
    const { correct, total } = levelScores[level]
    
    if (total === 0) continue
    
    const rate = correct / total
    
    // 如果该级别正确率 >= 60%，评为该级别
    if (rate >= threshold) {
      return level
    }
  }

  // 兜底：根据总分评估
  if (totalScore >= 85) return "HSK6"
  if (totalScore >= 70) return "HSK5"
  if (totalScore >= 55) return "HSK4"
  if (totalScore >= 40) return "HSK3"
  if (totalScore >= 25) return "HSK2"
  return "HSK1"
}

/**
 * 获取推荐学习建议
 */
export function getStudyRecommendation(assessedLevel: HSKLevel, score: number): string {
  const recommendations: Record<HSKLevel, string> = {
    HSK1: "建议从HSK1基础课程开始，多练习拼音和基本词汇。",
    HSK2: "您已掌握基础汉语，可以尝试简单的日常对话场景。",
    HSK3: "您的中文水平不错！可以开始学习更复杂的语法结构。",
    HSK4: "您已具备中级汉语能力，建议多阅读中文文章提高理解力。",
    HSK5: "您的汉语水平较高，可以尝试专业性文章和商务中文。",
    HSK6: "您的中文水平优秀！可以挑战文学作品和学术材料。"
  }

  return recommendations[assessedLevel]
}
