"use client"

import * as React from "react"
import { X } from "lucide-react"
import { getTypographyClass } from "@/lib/typography"

export type ToastType = "success" | "error" | "warning" | "info"

interface ToastProps {
  message: string
  type?: ToastType
  onClose: () => void
}

export function Toast({ message, type = "info", onClose }: ToastProps) {
  const bgColor = {
    success: "bg-green-50 dark:bg-green-900/10",
    error: "bg-red-50 dark:bg-red-900/10",
    info: "bg-blue-50 dark:bg-blue-900/10",
  }[type]

  const textColor = {
    success: "text-green-800 dark:text-green-200",
    error: "text-red-800 dark:text-red-200",
    info: "text-blue-800 dark:text-blue-200",
  }[type]

  return (
    <div className={`fixed bottom-4 right-4 ${bgColor} rounded-lg shadow-lg p-4 flex items-center gap-2`}>
      <p className={`${getTypographyClass('body')} ${textColor}`}>{message}</p>
      <button
        onClick={onClose}
        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
} 