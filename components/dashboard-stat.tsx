import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ReactNode } from "react"

interface StatCardProps {
  title: string
  icon: ReactNode
  value?: string | number
  note: string
  noteColor?: string
}

export function DashboardStatCard({
  title,
  icon,
  value,
  note,
  noteColor = "text-muted-foreground",
}: StatCardProps) {
  return (
    <Card className="border-0 p-2 space-y-2 shadow-none bg-[#FAFAFA]">
      <CardHeader className="flex  flex-row items-center px-0 lg:justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium py-4  text-[#000000] flex justify-start gap-2">
          <span className="text-[#000000]">{icon}</span> 
          {title} 
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <div className="flex gap-6 justify-between items-center">
          <span className="text-[16px] ">{value}</span>
          <span className={`text-[12px] bg-[#FFFFFF] rounded-full p-1 ${noteColor}`}>{note}</span>
        </div>
      </CardContent>
    </Card>
  )
}