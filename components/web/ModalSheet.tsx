"use client"

import React from "react"

import { cn } from "@/lib/utils"
import { X } from "lucide-react"
import { useEffect } from "react"

interface ModalSheetProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  side?: "right" | "bottom"
  className?: string
}

export function ModalSheet({
  open,
  onClose,
  title,
  children,
  side = "right",
  className,
}: ModalSheetProps) {
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
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div
        className={cn(
          "absolute bg-zinc-900/95 backdrop-blur-xl border-white/10",
          side === "right" && "right-0 top-0 h-full w-full max-w-md border-l",
          side === "bottom" && "bottom-0 left-0 w-full max-h-[80vh] border-t rounded-t-3xl",
          "animate-in",
          side === "right" ? "slide-in-from-right" : "slide-in-from-bottom",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="overflow-y-auto p-6" style={{ maxHeight: "calc(100% - 65px)" }}>
          {children}
        </div>
      </div>
    </div>
  )
}
