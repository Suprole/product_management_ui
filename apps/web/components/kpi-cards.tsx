import { TrendingUp, TrendingDown, DollarSign, Package, ShoppingCart, Percent } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getSalesData, getInventoryData, getProductsData } from "@/lib/data"

export async function KPICards() {
  const salesData = await getSalesData()
  const inventoryData = await getInventoryData()
  const productsData = await getProductsData()

  // Calculate KPIs
  const totalSales = salesData.reduce((sum, day) => sum + day.totalSales, 0)
  const totalProfit = salesData.reduce((sum, day) => sum + day.totalProfit, 0)
  const profitRate = totalSales > 0 ? (totalProfit / totalSales) * 100 : 0
  const currentInventoryValue = inventoryData[inventoryData.length - 1]?.inventoryValue || 0
  const activeProducts = productsData.filter((p) => p.currentStock > 0).length
  const lowStockProducts = productsData.filter((p) => p.stockHealth === "不足").length

  const kpis = [
    {
      title: "総売上",
      value: `¥${(totalSales / 10000).toFixed(1)}万`,
      change: "+12.5%",
      trend: "up" as const,
      icon: DollarSign,
      color: "text-chart-1",
    },
    {
      title: "総利益",
      value: `¥${(totalProfit / 10000).toFixed(1)}万`,
      change: "+8.3%",
      trend: "up" as const,
      icon: TrendingUp,
      color: "text-chart-2",
    },
    {
      title: "利益率",
      value: `${profitRate.toFixed(1)}%`,
      change: "-2.1%",
      trend: "down" as const,
      icon: Percent,
      color: "text-chart-3",
    },
    {
      title: "在庫金額",
      value: `¥${(currentInventoryValue / 10000).toFixed(1)}万`,
      change: "+5.2%",
      trend: "up" as const,
      icon: Package,
      color: "text-chart-5",
    },
    {
      title: "販売中商品",
      value: activeProducts.toString(),
      change: `${lowStockProducts}件 在庫不足`,
      trend: lowStockProducts > 0 ? ("down" as const) : ("up" as const),
      icon: ShoppingCart,
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
