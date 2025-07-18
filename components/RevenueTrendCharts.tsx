"use client"
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { curveCardinal } from "d3-shape"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "lucide-react"

const data = [
  { name: "Jan", revenue: 5000 },
  { name: "Feb", revenue: 7000 },
  { name: "Mar", revenue: 12000 },
  { name: "Apr", revenue: 15000 },
  { name: "May", revenue: 45000 },
  { name: "Jun", revenue: 65000 },
  { name: "Jul", revenue: 120000 },
  { name: "Aug", revenue: 95000 },
  { name: "Sep", revenue: 85000 },
  { name: "Oct", revenue: 110000 },
  { name: "Nov", revenue: 140000 },
  { name: "Dec", revenue: 180000 },
]

const cardinal = curveCardinal.tension(0.2)

export function RevenueTrendsChart() {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium text-gray-900">Revenue Trends</CardTitle>
          <Select defaultValue="this-week">
            <SelectTrigger className="w-36 h-10 border border-gray-300 rounded-lg">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-week">This Week</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="this-year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 20,
              }}
            >
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#6b7280" }}
                tickFormatter={(value) => {
                  if (value >= 1000000) return `₦${(value / 1000000).toFixed(1)}M`
                  if (value >= 1000) return `₦${value / 1000}K`
                  return `₦${value}`
                }}
                domain={[0, 1000000]}
                ticks={[0, 1000, 10000, 100000, 1000000]}
              />
              <Tooltip
                formatter={(value: number) => [`₦${value.toLocaleString()}`, "Revenue"]}
                labelStyle={{ color: "#374151" }}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Area
                type={cardinal}
                dataKey="revenue"
                stroke="#266F94"
                fill="#0ea5e9"
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
