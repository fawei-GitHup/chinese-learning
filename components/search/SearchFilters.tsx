/**
 * 搜索过滤器组件
 * 工单 W3-01: 全站搜索
 * 
 * 提供内容类型、级别、分类等过滤选项
 */

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { ContentType } from '@/lib/content'
import { X } from 'lucide-react'

interface SearchFiltersProps {
  selectedTypes: ContentType[]
  selectedLevel?: string
  selectedCategory?: string
  onTypeToggle: (type: ContentType) => void
  onLevelChange: (level: string | undefined) => void
  onCategoryChange: (category: string | undefined) => void
  onClearAll: () => void
}

const CONTENT_TYPES: { value: ContentType; label: string; color: string }[] = [
  { value: 'medical_term', label: '医疗词汇', color: 'blue' },
  { value: 'lesson', label: '课程', color: 'green' },
  { value: 'reading', label: '阅读', color: 'purple' },
  { value: 'grammar', label: '语法', color: 'orange' },
  { value: 'scenario', label: '场景', color: 'cyan' },
]

const LEVELS = ['HSK1', 'HSK2', 'HSK3', 'HSK4', 'HSK5', 'HSK6']

// 根据内容类型提供的分类选项
const CATEGORIES: Record<ContentType, string[]> = {
  medical_term: ['symptom', 'body', 'department', 'test', 'medicine', 'insurance', 'history'],
  scenario: ['registration', 'triage', 'consultation', 'tests', 'pharmacy', 'billing'],
  lesson: [],
  reading: [],
  grammar: [],
}

const CATEGORY_LABELS: Record<string, string> = {
  // Medical term categories
  symptom: '症状',
  body: '身体部位',
  department: '科室',
  test: '检查',
  medicine: '药物',
  insurance: '医保',
  history: '病史',
  time: '时间',
  // Scenario categories
  registration: '挂号',
  triage: '分诊',
  consultation: '问诊',
  tests: '检查',
  pharmacy: '药房',
  billing: '结算',
}

export function SearchFilters({
  selectedTypes,
  selectedLevel,
  selectedCategory,
  onTypeToggle,
  onLevelChange,
  onCategoryChange,
  onClearAll,
}: SearchFiltersProps) {
  // 检查是否有任何过滤器激活
  const hasActiveFilters = 
    selectedTypes.length < CONTENT_TYPES.length || 
    selectedLevel !== undefined || 
    selectedCategory !== undefined

  // 获取当前可用的分类选项（基于选中的内容类型）
  const availableCategories = selectedTypes.length === 1 
    ? CATEGORIES[selectedTypes[0]] || []
    : []

  return (
    <div className="space-y-4">
      {/* 内容类型过滤 */}
      <div>
        <label className="text-sm font-medium text-zinc-400 mb-2 block">
          内容类型
        </label>
        <div className="flex flex-wrap gap-2">
          {CONTENT_TYPES.map(({ value, label, color }) => {
            const isSelected = selectedTypes.includes(value)
            return (
              <Button
                key={value}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                onClick={() => onTypeToggle(value)}
                className={
                  isSelected
                    ? `bg-${color}-600 hover:bg-${color}-700 border-${color}-500`
                    : `border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] text-white`
                }
              >
                {label}
              </Button>
            )
          })}
        </div>
      </div>

      {/* 难度级别过滤 */}
      <div>
        <label className="text-sm font-medium text-zinc-400 mb-2 block">
          难度级别
        </label>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedLevel === undefined ? "default" : "outline"}
            size="sm"
            onClick={() => onLevelChange(undefined)}
            className={
              selectedLevel === undefined
                ? ""
                : "border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] text-white"
            }
          >
            全部
          </Button>
          {LEVELS.map((level) => {
            const isSelected = selectedLevel === level
            return (
              <Button
                key={level}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                onClick={() => onLevelChange(level)}
                className={
                  isSelected
                    ? ""
                    : "border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] text-white"
                }
              >
                {level}
              </Button>
            )
          })}
        </div>
      </div>

      {/* 分类过滤（仅在选择单一内容类型时显示） */}
      {availableCategories.length > 0 && (
        <div>
          <label className="text-sm font-medium text-zinc-400 mb-2 block">
            分类
          </label>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === undefined ? "default" : "outline"}
              size="sm"
              onClick={() => onCategoryChange(undefined)}
              className={
                selectedCategory === undefined
                  ? ""
                  : "border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] text-white"
              }
            >
              全部
            </Button>
            {availableCategories.map((category) => {
              const isSelected = selectedCategory === category
              return (
                <Button
                  key={category}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  onClick={() => onCategoryChange(category)}
                  className={
                    isSelected
                      ? ""
                      : "border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] text-white"
                  }
                >
                  {CATEGORY_LABELS[category] || category}
                </Button>
              )
            })}
          </div>
        </div>
      )}

      {/* 清除所有过滤器 */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={onClearAll}
          className="border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] text-white"
        >
          <X className="h-4 w-4 mr-1" />
          清除所有过滤
        </Button>
      )}

      {/* 活动过滤器显示 */}
      {hasActiveFilters && (
        <div className="pt-2 border-t border-white/[0.08]">
          <p className="text-xs text-zinc-500 mb-2">当前过滤条件：</p>
          <div className="flex flex-wrap gap-2">
            {selectedTypes.length < CONTENT_TYPES.length && (
              <Badge variant="outline" className="text-xs bg-blue-500/10 border-blue-500/30 text-blue-400">
                类型: {selectedTypes.map(t => CONTENT_TYPES.find(ct => ct.value === t)?.label).join(', ')}
              </Badge>
            )}
            {selectedLevel && (
              <Badge variant="outline" className="text-xs bg-green-500/10 border-green-500/30 text-green-400">
                级别: {selectedLevel}
              </Badge>
            )}
            {selectedCategory && (
              <Badge variant="outline" className="text-xs bg-purple-500/10 border-purple-500/30 text-purple-400">
                分类: {CATEGORY_LABELS[selectedCategory] || selectedCategory}
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
