import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ReactNode } from "react"

interface StatCardProps {
  title: string
  icon: ReactNode
  value: string | number
  note: string
  noteColor?: string
}

export function StatCard({
  title,
  icon,
  value,
  note,
  noteColor = "text-muted-foreground",
}: StatCardProps) {
  return (
    <Card className={`border-0 shadow-none bg-[#FAFAFA] `}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground flex gap-2"><span>{icon}</span> {title}</CardTitle>
        
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold flex gap-6 justify-between items-center">{value}  <span className="text-[12px] text-muted-foreground">{note}</span></div>
        <p className={`text-xs mt-1 ${noteColor}`}>
         
        </p>
      </CardContent>
    </Card>
  )
}
