import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle, TrendingDown, Package } from "lucide-react"
import { getProductsData } from "@/lib/data"

export async function AlertsPanel() {
  const products = await getProductsData()

  const lowStockProducts = products.filter((p) => p.stockHealth === "不足")
  const outOfStockProducts = products.filter((p) => p.stockHealth === "out_of_stock")
  const lowProfitProducts = products.filter((p) => p.profitRate < 0)

  const alerts = [
    {
      type: "warning",
      icon: AlertTriangle,
      title: "在庫不足",
      count: lowStockProducts.length,
      description: `${lowStockProducts.length}商品が在庫不足です`,
      color: "text-warning",
    },
    {
      type: "error",
      icon: Package,
      title: "在庫切れ",
      count: outOfStockProducts.length,
      description: `${outOfStockProducts.length}商品が在庫切れです`,
      color: "text-destructive",
    },
    {
      type: "info",
      icon: TrendingDown,
      title: "赤字商品",
      count: lowProfitProducts.length,
      description: `${lowProfitProducts.length}商品が赤字です`,
      color: "text-destructive",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {alerts.map((alert) => (
        <Card key={alert.title} className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className={`p-2 rounded-lg bg-muted ${alert.color}`}>
                <alert.icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{alert.title}</h3>
                  <span className={`text-2xl font-bold ${alert.color}`}>{alert.count}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
