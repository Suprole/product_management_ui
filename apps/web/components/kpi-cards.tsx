import { TrendingUp, TrendingDown, DollarSign, Package, ShoppingCart, Percent } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardResponse } from "@/lib/types"
import { headers } from "next/headers"

function formatJPY(n: number) {
  return `¥${Math.round(n).toLocaleString()}`
}

export async function KPICards() {
  const h = await headers()
  const host = h.get('x-forwarded-host') || h.get('host') || 'localhost:3000'
  const proto = h.get('x-forwarded-proto') || (process.env.VERCEL ? 'https' : 'http')
  const base = `${proto}://${host}`
  const res = await fetch(`${base}/api/gas/dashboard`, { cache: 'no-store' })
  const data = (await res.json()) as DashboardResponse
  if (!('kpi' in data)) {
    return null
  }
  const { kpi } = data
  const orderCount = (kpi as any).orderCount ?? (kpi as any).orders ?? 0
  const totalStock = (kpi as any).totalStock ?? (kpi as any).stockTotal ?? 0

  const kpis = [
    {
      title: "総売上",
      value: formatJPY(kpi.revenue),
      change: "",
      trend: "up" as const,
      icon: DollarSign,
      color: "text-chart-1",
    },
    {
      title: "注文件数",
      value: String(orderCount),
      change: "",
      trend: "up" as const,
      icon: ShoppingCart,
      color: "text-chart-2",
    },
    {
      title: "平均注文単価",
      value: formatJPY(kpi.aov),
      change: "",
      trend: "up" as const,
      icon: Percent,
      color: "text-chart-3",
    },
    {
      title: "在庫合計",
      value: String(totalStock),
      change: "",
      trend: "up" as const,
      icon: Package,
      color: "text-chart-5",
    },
    {
      title: "加重カート率",
      value: `${(kpi.buyboxRateWeighted * 100).toFixed(1)}%`,
      change: "",
      trend: "up" as const,
      icon: TrendingUp,
      color: "text-chart-4",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {kpis.map((kpi) => (
        <Card key={kpi.title} className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.title}</CardTitle>
            <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpi.value}</div>
            <div className="flex items-center gap-1 mt-1">
              {kpi.trend === "up" ? (
                <TrendingUp className="h-3 w-3 text-success" />
              ) : (
                <TrendingDown className="h-3 w-3 text-destructive" />
              )}
              <span className={`text-xs ${kpi.trend === "up" ? "text-success" : "text-destructive"}`}>
                {kpi.change}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
