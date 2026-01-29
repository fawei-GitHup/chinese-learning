"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"

interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  variant?: "default" | "destructive"
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
}: ConfirmDialogProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    if (open) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = ""
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-zinc-900/95 backdrop-blur-xl p-6 animate-in fade-in zoom-in-95">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        {description && (
          <p className="mt-2 text-sm text-zinc-400">{description}</p>
        )}
        
        <div className="mt-6 flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            className="rounded-xl border-white/20 bg-white/5 text-white hover:bg-white/10"
          >
            {cancelText}
          </Button>
          <Button
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className={cn(
              "rounded-xl",
              variant === "destructive"
                ? "bg-rose-500 text-white hover:bg-rose-600"
                : "bg-cyan-500 text-black hover:bg-cyan-400"
            )}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  )
}
