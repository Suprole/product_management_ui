"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// Mock data - last 30 days
const mockData = [
  { date: "09/20", value: 2042 },
  { date: "09/21", value: 2044 },
  { date: "09/22", value: 2032 },
  { date: "09/23", value: 2030 },
  { date: "09/24", value: 2026 },
  { date: "09/25", value: 2028 },
  { date: "09/26", value: 2025 },
  { date: "09/27", value: 2031 },
  { date: "09/28", value: 2033 },
  { date: "09/29", value: 2010 },
  { date: "09/30", value: 2012 },
  { date: "10/01", value: 2018 },
  { date: "10/02", value: 2009 },
  { date: "10/03", value: 2001 },
  { date: "10/04", value: 2084 },
  { date: "10/05", value: 2195 },
  { date: "10/06", value: 2246 },
  { date: "10/07", value: 2255 },
  { date: "10/08", value: 2278 },
  { date: "10/09", value: 2330 },
  { date: "10/10", value: 2769 },
  { date: "10/11", value: 2804 },
  { date: "10/12", value: 2815 },
  { date: "10/13", value: 2810 },
  { date: "10/14", value: 2817 },
]

export function InventoryChart() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">在庫推移</CardTitle>
        <p className="text-sm text-muted-foreground">直近25日間の在庫数量</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={mockData}>
            <defs>
              <linearGradient id="colorInventory" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="rgb(168 85 247)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="rgb(168 85 247)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgb(39 39 42)" />
            <XAxis dataKey="date" stroke="rgb(161 161 170)" fontSize={12} />
            <YAxis stroke="rgb(161 161 170)" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgb(24 24 27)",
                border: "1px solid rgb(39 39 42)",
                borderRadius: "0.5rem",
              }}
              labelStyle={{ color: "rgb(250 250 250)" }}
              formatter={(value: number) => [`${value}個`, "在庫数"]}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="rgb(168 85 247)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorInventory)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
