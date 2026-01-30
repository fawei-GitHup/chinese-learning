"use client"

import React from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ErrorDisplayProps {
  error: Error | string | null
  title?: string
  onRetry?: () => void
  className?: string
}

export function ErrorDisplay({
  error,
  title = '发生错误',
  onRetry,
  className = ''
}: ErrorDisplayProps) {
  const errorMessage = error instanceof Error ? error.message : (error || '未知错误')

  if (!error) return null

  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-900/20 border border-red-800/30 mb-4">
        <AlertTriangle className="h-8 w-8 text-red-400" />
      </div>

      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-zinc-400 mb-6 max-w-md">{errorMessage}</p>

      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          重新尝试
        </Button>
      )}
    </div>
  )
}