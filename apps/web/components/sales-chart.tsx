"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { useEffect, useMemo, useState } from "react"
import { DashboardResponse } from "@/lib/types"

export function SalesChart() {
  const [series, setSeries] = useState<{ date: string; sales: number }[]>([])

  useEffect(() => {
    const run = async () => {
      const res = await fetch(`/api/gas/dashboard`, { cache: 'no-store' })
      const data = (await res.json()) as DashboardResponse
      if ('kpi' in data && data.series?.revenue) {
        const rows = (data.series.revenue || []).map((p) => ({
          date: p.date.substring(5),
          sales: p.value,
        }))
        setSeries(rows)
      }
    }
    run()
  }, [])

  const chartData = useMemo(() => {
    return series.map((item) => ({
      ...item,
      salesK: Math.round(item.sales / 1000),
    }))
  }, [series])

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
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
