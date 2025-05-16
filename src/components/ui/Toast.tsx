"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export type ToastType = "success" | "error" | "warning" | "info"

interface ToastProps {
  message: string
  type: ToastType
  onClose: () => void
}

const typeStyles: Record<ToastType, string> = {
  success: "bg-green-50 text-green-800 dark:bg-green-900/50 dark:text-green-300",
  error: "bg-red-50 text-red-800 dark:bg-red-900/50 dark:text-red-300",
  warning: "bg-yellow-50 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300",
  info: "bg-blue-50 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
}

export function Toast({ message, type, onClose }: ToastProps) {
  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-lg p-4 shadow-lg",
        typeStyles[type]
      )}
    >
      <p className="text-sm font-medium">{message}</p>
      <button
        onClick={onClose}
        className="ml-2 rounded-full p-1 hover:bg-black/10 dark:hover:bg-white/10"
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </button>
    </div>
  )
} 