'use client';

/**
 * 用户反馈表单弹窗组件
 * 提供反馈类型选择、标题、详细描述和评分功能
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Star, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { submitFeedback, type FeedbackType } from '@/lib/feedback/api';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FeedbackFormData {
  feedbackType: FeedbackType;
  title: string;
  description: string;
  rating?: number;
}

const feedbackTypeLabels: Record<FeedbackType, string> = {
  bug: '🐛 Bug 报告',
  feature: '✨ 功能建议',
  improvement: '🚀 改进建议',
  other: '💬 其他反馈',
};

export function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FeedbackFormData>({
    defaultValues: {
      feedbackType: 'other',
      title: '',
      description: '',
    },
  });

  const feedbackType = watch('feedbackType');

  const onSubmit = async (data: FeedbackFormData) => {
    setIsSubmitting(true);

    try {
      // 自动获取当前页面URL
      const pageUrl = window.location.href;

      // 提交反馈
      const { error } = await submitFeedback({
        page_url: pageUrl,
        feedback_type: data.feedbackType,
        title: data.title,
        description: data.description,
        rating: rating > 0 ? rating : undefined,
      });

      if (error) {
        toast.error('提交失败', {
          description: error.message || '请稍后重试',
        });
        return;
      }

      toast.success('提交成功', {
        description: '感谢您的反馈！我们会尽快处理。',
      });

      // 重置表单
      reset();
      setRating(0);
      onClose();
    } catch (error) {
      console.error('提交反馈错误:', error);
      toast.error('提交失败', {
        description: '发生未知错误，请稍后重试',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      reset();
      setRating(0);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>提交反馈</DialogTitle>
          <DialogDescription>
            我们重视您的意见和建议。请填写以下信息，帮助我们改进产品。
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
          {/* 反馈类型 */}
          <div className="space-y-2">
            <Label htmlFor="feedbackType">
              反馈类型 <span className="text-destructive">*</span>
            </Label>
            <Select
              value={feedbackType}
              onValueChange={(value) =>
                setValue('feedbackType', value as FeedbackType)
              }
            >
              <SelectTrigger id="feedbackType">
                <SelectValue placeholder="请选择反馈类型" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(feedbackTypeLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 标题 */}
          <div className="space-y-2">
            <Label htmlFor="title">
              标题 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              placeholder="请简要描述您的反馈"
              {...register('title', {
                required: '请输入标题',
                minLength: {
                  value: 3,
                  message: '标题至少需要3个字符',
                },
                maxLength: {
                  value: 100,
                  message: '标题不能超过100个字符',
                },
              })}
              disabled={isSubmitting}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* 详细描述 */}
          <div className="space-y-2">
            <Label htmlFor="description">
              详细描述 <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="请详细描述您的反馈内容..."
              rows={6}
              {...register('description', {
                required: '请输入详细描述',
                minLength: {
                  value: 10,
                  message: '描述至少需要10个字符',
                },
                maxLength: {
                  value: 2000,
                  message: '描述不能超过2000个字符',
                },
              })}
              disabled={isSubmitting}
            />
            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* 评分 */}
          <div className="space-y-2">
            <Label>评分（可选）</Label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  disabled={isSubmitting}
                  className="transition-transform hover:scale-110 disabled:cursor-not-allowed"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= (hoveredRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-2 text-sm text-muted-foreground">
                  {rating} 星
                </span>
              )}
            </div>
          </div>

          {/* 提交按钮 */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              取消
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  提交中...
                </>
              ) : (
                '提交反馈'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
