"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useEffect, useState } from "react"
import { DashboardResponse } from "@/lib/types"

export function InventoryChart() {
  const [data, setData] = useState<{ date: string; value: number }[]>([])

  useEffect(() => {
    const run = async () => {
      const res = await fetch(`/api/gas/dashboard`, { cache: 'no-store' })
      const json = (await res.json()) as DashboardResponse
      if ('kpi' in json && json.series?.stock) {
        setData(json.series.stock.map((p) => ({ date: p.date.substring(5), value: p.value })))
      }
    }
    run()
  }, [])

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">在庫推移</CardTitle>
        <p className="text-sm text-muted-foreground">在庫数量の推移</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
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
