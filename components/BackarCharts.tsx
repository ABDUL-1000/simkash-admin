"use client"
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "lucide-react"

const data = [
  {
    name: "Total Investment",
    value: 100,
    fill: "#266F94",
  },
  {
    name: "Active Investment",
    value: 61.25, // 2,450,000 / 4,000,000 * 100
    fill: "#264D64",
  },
]

export function BackerChart() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium text-gray-900">Backer</CardTitle>
          <Select defaultValue="july">
            <SelectTrigger className="w-28 h-10 border border-gray-300 rounded-lg">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="july">July</SelectItem>
              <SelectItem value="august">August</SelectItem>
              <SelectItem value="september">September</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center h-80 relative">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="50%"
              outerRadius="90%"
              barSize={13}
              data={data}
              startAngle={90}
              endAngle={450}
            >
              <RadialBar minAngle={15} background  dataKey="value" cornerRadius={10} />
            </RadialBarChart>
          </ResponsiveContainer>

          {/* Center Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-[0.8rem] text-gray-500 mb-2">Active Investment</p>
            <p className="text-[0.8rem] font-bold text-gray-900">{formatCurrency(2450000)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
