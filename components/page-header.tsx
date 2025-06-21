"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { ReactNode } from "react"

interface PageHeaderProps {
  title: string
  subtitle: string
  onAddClick?: () => void
  addLabel?: string
  addIcon?: ReactNode
}

export function PageHeader({
  title,
  subtitle,
  onAddClick,
  addLabel = "Add",
  addIcon = <Plus />,
}: PageHeaderProps) {
  return (
    <div className="flex  justify-between items-center">
      <div className="text-[#4D4D4D]">
        <h2 className="font-bold text-[20px] mb-2 leading-6">{title}</h2>
        <p className="font-normal text-[16px] leading-6">{subtitle}</p>
      </div>
      {onAddClick && (
        <Button onClick={onAddClick} className="rounded-md bg-[#132939] flex items-center gap-2">
          {addIcon}
          {addLabel}
        </Button>
      )}
    </div>
  )
}
