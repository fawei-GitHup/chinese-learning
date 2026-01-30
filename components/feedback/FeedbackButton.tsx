'use client';

/**
 * 用户反馈悬浮按钮组件
 * 固定在右下角，点击后打开反馈表单弹窗
 */

import { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FeedbackModal } from './FeedbackModal';
import { cn } from '@/lib/utils';

interface FeedbackButtonProps {
  className?: string;
}

export function FeedbackButton({ className }: FeedbackButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* 悬浮按钮 */}
      <Button
        size="lg"
        className={cn(
          'fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg',
          'transition-all duration-300 hover:scale-110 hover:shadow-xl',
          'md:h-auto md:w-auto md:rounded-md md:px-4',
          className
        )}
        onClick={() => setIsOpen(true)}
        aria-label="提交反馈"
      >
        <MessageSquare className="h-6 w-6 md:mr-2" />
        <span className="hidden md:inline">反馈</span>
      </Button>

      {/* 反馈弹窗 */}
      <FeedbackModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
