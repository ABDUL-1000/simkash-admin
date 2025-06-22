import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ReactNode } from "react"
import { Button } from "./ui/button"

interface SimTableCardProps {
    button?: ReactNode
      number: string
     network: string
     status: string
     active: string
     expire: string
     data: string
     statusColor?: string
    
}

export function SimTableCard({
     button= <Button className="w-full rounded-md " variant="outline"/>,
      number,
     network,
     status,
     active,
     expire,
     data,
     statusColor = "text-muted-foreground",
}: SimTableCardProps) {
  return (
    <Card className="border-0 p-2 space-y-2 shadow-none bg-[#FAFAFA]">
      <CardHeader className="flex  flex-row items-center px-0 lg:justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium py-4  text-[#000000] flex justify-start gap-2">
          <span className="text-[#000000]">{number} <span className={`text-[12px] bg-[#FFFFFF] rounded-full p-1 ${statusColor}`}>{status}</span></span> 
          {} 
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <div className="flex gap-6 justify-between items-center">
          <span className="text-[16px] ">network provider</span>
          <span className={`text-[12px] bg-[#FFFFFF] rounded-full p-1 `}>{network}</span>
        </div>
        <div className="flex gap-6 justify-between items-center">
          <span className="text-[16px] ">Activated On:</span>
          <span className={`text-[12px] bg-[#FFFFFF] rounded-full p-1 `}>{active}</span>
        </div>
        <div className="flex gap-6 justify-between items-center">
          <span className="text-[16px] ">Expiry Date:</span>
          <span className={`text-[12px] bg-[#FFFFFF] rounded-full p-1 `}>{expire}</span>
        </div>
        <div className="flex gap-6 justify-between items-center">
          <span className="text-[16px] ">Data Plan:</span>
          <span className={`text-[12px] bg-[#FFFFFF] rounded-full p-1 `}>{data}</span>
        </div>
      <div>
        {button}
      </div>
      </CardContent>
    </Card>
  )
}