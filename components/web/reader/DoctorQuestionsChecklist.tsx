"use client"

import React from "react"

import { useState } from "react"
import { GlassCard } from "@/components/web/GlassCard"
import { ChevronDown, ChevronUp, ClipboardList, Check } from "lucide-react"

interface ChecklistItem {
  id: string
  label_en: string
  label_zh: string
  question_zh: string
  question_pinyin: string
  question_en: string
  answer_template_zh: string
  answer_template_en: string
}

const defaultChecklist: ChecklistItem[] = [
  {
    id: "onset",
    label_en: "Onset",
    label_zh: "发病时间",
    question_zh: "什么时候开始的？",
    question_pinyin: "Shénme shíhou kāishǐ de?",
    question_en: "When did it start?",
    answer_template_zh: "从[时间]开始的。",
    answer_template_en: "It started [time].",
  },
  {
    id: "duration",
    label_en: "Duration",
    label_zh: "持续时间",
    question_zh: "持续多长时间了？",
    question_pinyin: "Chíxù duō cháng shíjiān le?",
    question_en: "How long has it lasted?",
    answer_template_zh: "已经[时间]了。",
    answer_template_en: "It's been [duration].",
  },
  {
    id: "severity",
    label_en: "Severity",
    label_zh: "严重程度",
    question_zh: "疼痛从一到十，有多疼？",
    question_pinyin: "Téngtòng cóng yī dào shí, yǒu duō téng?",
    question_en: "On a scale of 1-10, how painful is it?",
    answer_template_zh: "大概[数字]分。",
    answer_template_en: "About [number] out of 10.",
  },
  {
    id: "location",
    label_en: "Location",
    label_zh: "位置",
    question_zh: "哪里不舒服？能指给我看吗？",
    question_pinyin: "Nǎlǐ bù shūfu? Néng zhǐ gěi wǒ kàn ma?",
    question_en: "Where does it hurt? Can you show me?",
    answer_template_zh: "这里不舒服。",
    answer_template_en: "It hurts here.",
  },
  {
    id: "triggers",
    label_en: "Triggers",
    label_zh: "诱因",
    question_zh: "什么情况下会加重？",
    question_pinyin: "Shénme qíngkuàng xià huì jiāzhòng?",
    question_en: "What makes it worse?",
    answer_template_zh: "[活动]的时候会更疼。",
    answer_template_en: "It gets worse when [activity].",
  },
  {
    id: "allergies",
    label_en: "Allergies",
    label_zh: "过敏史",
    question_zh: "您有什么过敏吗？",
    question_pinyin: "Nín yǒu shénme guòmǐn ma?",
    question_en: "Do you have any allergies?",
    answer_template_zh: "我对[药物/食物]过敏。/ 没有过敏。",
    answer_template_en: "I'm allergic to [drug/food]. / No allergies.",
  },
  {
    id: "medications",
    label_en: "Current Medications",
    label_zh: "用药情况",
    question_zh: "现在在吃什么药？",
    question_pinyin: "Xiànzài zài chī shénme yào?",
    question_en: "What medications are you currently taking?",
    answer_template_zh: "我在吃[药名]。/ 没有吃药。",
    answer_template_en: "I'm taking [medication]. / No medications.",
  },
  {
    id: "past_history",
    label_en: "Past Medical History",
    label_zh: "既往病史",
    question_zh: "以前有过什么大病吗？",
    question_pinyin: "Yǐqián yǒuguò shénme dà bìng ma?",
    question_en: "Have you had any major illnesses before?",
    answer_template_zh: "我有[病名]。/ 没有。",
    answer_template_en: "I have [condition]. / No.",
  },
  {
    id: "family_history",
    label_en: "Family History",
    label_zh: "家族病史",
    question_zh: "家里人有什么慢性病吗？",
    question_pinyin: "Jiālǐ rén yǒu shénme mànxìngbìng ma?",
    question_en: "Does anyone in your family have chronic conditions?",
    answer_template_zh: "我[家人]有[病名]。",
    answer_template_en: "My [family member] has [condition].",
  },
  {
    id: "pregnancy",
    label_en: "Pregnancy Status",
    label_zh: "怀孕情况",
    question_zh: "您现在怀孕了吗？",
    question_pinyin: "Nín xiànzài huáiyùn le ma?",
    question_en: "Are you currently pregnant?",
    answer_template_zh: "是的，[周数]周了。/ 没有。",
    answer_template_en: "Yes, [weeks] weeks. / No.",
  },
]

interface DoctorQuestionsChecklistProps {
  customItems?: ChecklistItem[]
}

export function DoctorQuestionsChecklist({ customItems }: DoctorQuestionsChecklistProps) {
  const items = customItems || defaultChecklist
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set())

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const toggleCheck = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setCheckedItems((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  return (
    <GlassCard className="p-4">
      <div className="flex items-center gap-2 mb-3">
        <ClipboardList className="h-4 w-4 text-teal-400" />
        <h3 className="text-sm font-medium text-zinc-400">Doctor Questions Checklist</h3>
        <span className="ml-auto text-xs text-zinc-600">
          {checkedItems.size}/{items.length}
        </span>
      </div>

      <div className="space-y-1.5 max-h-[320px] overflow-y-auto pr-1">
        {items.map((item) => {
          const isExpanded = expandedId === item.id
          const isChecked = checkedItems.has(item.id)

          return (
            <div key={item.id} className="rounded-lg overflow-hidden">
              <button
                onClick={() => toggleExpand(item.id)}
                className={`w-full flex items-center gap-2 px-3 py-2 text-left transition-colors ${
                  isExpanded
                    ? "bg-white/[0.06] border border-white/[0.1]"
                    : "bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04]"
                } rounded-lg`}
              >
                <button
                  onClick={(e) => toggleCheck(item.id, e)}
                  className={`h-4 w-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                    isChecked
                      ? "bg-teal-500 border-teal-500"
                      : "border-white/20 hover:border-teal-500/50"
                  }`}
                >
                  {isChecked && <Check className="h-3 w-3 text-white" />}
                </button>
                <span className={`text-xs font-medium ${isChecked ? "text-zinc-500 line-through" : "text-zinc-300"}`}>
                  {item.label_en}
                </span>
                <span className="text-xs text-zinc-600">{item.label_zh}</span>
                <span className="ml-auto">
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-zinc-500" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-zinc-500" />
                  )}
                </span>
              </button>

              {isExpanded && (
                <div className="px-3 py-3 bg-white/[0.02] border-x border-b border-white/[0.06] rounded-b-lg -mt-1 space-y-3">
                  <div>
                    <p className="text-xs text-zinc-500 mb-1">Question:</p>
                    <p className="text-sm text-white">{item.question_zh}</p>
                    <p className="text-xs text-teal-400">{item.question_pinyin}</p>
                    <p className="text-xs text-zinc-500">{item.question_en}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 mb-1">Answer template:</p>
                    <p className="text-sm text-white">{item.answer_template_zh}</p>
                    <p className="text-xs text-zinc-500">{item.answer_template_en}</p>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </GlassCard>
  )
}
