"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { useMemo } from "react"

// Mock data - in real app, this would come from props or API
const mockData = [
  { date: "10/01", sales: 65306, profit: 6034 },
  { date: "10/02", sales: 25452, profit: 2080 },
  { date: "10/03", sales: 22818, profit: 2292 },
  { date: "10/04", sales: 100974, profit: 8817 },
  { date: "10/05", sales: 54990, profit: 2498 },
  { date: "10/06", sales: 39773, profit: 1920 },
  { date: "10/07", sales: 80541, profit: 3964 },
  { date: "10/08", sales: 63720, profit: 3006 },
  { date: "10/09", sales: 29617, profit: 3293 },
  { date: "10/10", sales: 62943, profit: 6224 },
  { date: "10/11", sales: 47643, profit: 5198 },
  { date: "10/12", sales: 24083, profit: 4839 },
  { date: "10/13", sales: 19423, profit: 2400 },
  { date: "10/14", sales: 14871, profit: 3939 },
  { date: "10/15", sales: 59453, profit: 5207 },
  { date: "10/16", sales: 88417, profit: 9912 },
  { date: "10/17", sales: 57554, profit: 6174 },
  { date: "10/18", sales: 66388, profit: 3609 },
  { date: "10/19", sales: 44410, profit: 4406 },
]

export function SalesChart() {
  const chartData = useMemo(() => {
    return mockData.map((item) => ({
      ...item,
      salesK: Math.round(item.sales / 1000),
      profitK: Math.round(item.profit / 1000),
    }))
  }, [])

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">売上推移</CardTitle>
        <p className="text-sm text-muted-foreground">直近19日間の売上と利益</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgb(39 39 42)" />
            <XAxis dataKey="date" stroke="rgb(161 161 170)" fontSize={12} />
            <YAxis stroke="rgb(161 161 170)" fontSize={12} tickFormatter={(value) => `¥${value}k`} />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgb(24 24 27)",
                border: "1px solid rgb(39 39 42)",
                borderRadius: "0.5rem",
              }}
              labelStyle={{ color: "rgb(250 250 250)" }}
              formatter={(value: number) => [`¥${value}k`, ""]}
            />
            <Legend />
            <Line type="monotone" dataKey="salesK" stroke="rgb(99 102 241)" strokeWidth={2} name="売上" dot={false} />
            <Line type="monotone" dataKey="profitK" stroke="rgb(34 197 94)" strokeWidth={2} name="利益" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
