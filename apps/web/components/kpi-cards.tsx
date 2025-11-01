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
  const orderCount = (kpi as any).orders ?? (kpi as any).orderCount ?? 0
  const totalStock = (kpi as any).stockTotal ?? (kpi as any).totalStock ?? 0
  const profit = (kpi as any).profit ?? 0
  const profitRate = (kpi as any).profitRate ?? 0
  
  // 期間表示用
  const periodText = kpi.periodFrom && kpi.periodTo 
    ? `${kpi.periodFrom} ～ ${kpi.periodTo}` 
    : '累計'

  const kpis = [
    {
      title: "総売上（累計）",
      value: formatJPY(kpi.revenue ?? 0),
      period: periodText,
      change: "",
      trend: "up" as const,
      icon: DollarSign,
      color: "text-chart-1",
    },
    {
      title: "総利益（累計）",
      value: formatJPY(profit),
      period: periodText,
      change: "",
      trend: profit >= 0 ? "up" as const : "down" as const,
      icon: TrendingUp,
      color: profit >= 0 ? "text-green-500" : "text-red-500",
    },
    {
      title: "利益率（累計）",
      value: `${profitRate.toFixed(1)}%`,
      period: periodText,
      change: "",
      trend: profitRate >= 0 ? "up" as const : "down" as const,
      icon: Percent,
      color: profitRate >= 0 ? "text-green-500" : "text-red-500",
    },
    {
      title: "注文件数（累計）",
      value: String(orderCount),
      period: periodText,
      change: "",
      trend: "up" as const,
      icon: ShoppingCart,
      color: "text-chart-2",
    },
    {
      title: "在庫合計",
      value: String(totalStock),
      period: "現在",
      change: "",
      trend: "up" as const,
      icon: Package,
      color: "text-chart-5",
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
            <div className="flex items-center justify-between gap-1 mt-1">
              <span className="text-xs text-muted-foreground">{kpi.period}</span>
              <div className="flex items-center gap-1">
                {kpi.trend === "up" ? (
                  <TrendingUp className="h-3 w-3 text-success" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-destructive" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
