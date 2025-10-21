import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getInventoryAlerts, getInventoryData, getProductsData } from "@/lib/data"
import { AlertTriangle, Package, TrendingUp, AlertCircle } from "lucide-react"
import Link from "next/link"
import { InventoryChart } from "./inventory-chart"

export async function InventoryManagementView() {
  const alerts = await getInventoryAlerts()
  const inventoryData = await getInventoryData()
  const products = await getProductsData()

  const outOfStock = alerts.filter((a) => a.status === "out_of_stock").length
  const lowStock = alerts.filter((a) => a.status === "low_stock").length
  const overstock = alerts.filter((a) => a.status === "overstock").length
  const totalInventoryValue = products.reduce((sum, p) => {
    const avgPrice = p.totalSales / p.salesQuantity
    return sum + p.currentStock * avgPrice
  }, 0)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-500/10 rounded-lg">
              <AlertCircle className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">在庫切れ</p>
              <p className="text-2xl font-bold text-red-500">{outOfStock}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-500/10 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">在庫不足</p>
              <p className="text-2xl font-bold text-yellow-500">{lowStock}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <Package className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">過剰在庫</p>
              <p className="text-2xl font-bold text-blue-500">{overstock}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-500/10 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">在庫金額</p>
              <p className="text-2xl font-bold">¥{Math.round(totalInventoryValue).toLocaleString()}</p>
            </div>
          </div>
        </Card>
      </div>

      <InventoryChart />

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          在庫アラート
        </h3>
        <div className="space-y-3">
          {alerts.map((alert) => (
            <Link
              key={alert.sku}
              href={`/products/${alert.sku}`}
              className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent transition-colors"
            >
              <div className="flex items-center gap-4">
                <Badge
                  variant={
                    alert.status === "out_of_stock"
                      ? "destructive"
                      : alert.status === "low_stock"
                        ? "secondary"
                        : "default"
                  }
                >
                  {alert.status === "out_of_stock"
                    ? "在庫切れ"
                    : alert.status === "low_stock"
                      ? "在庫不足"
                      : "過剰在庫"}
                </Badge>
                <div>
                  <p className="font-medium">{alert.productName}</p>
                  <p className="text-sm text-muted-foreground">{alert.sku}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold">現在在庫: {alert.currentStock}個</p>
                {alert.recommendedOrder && (
                  <p className="text-sm text-green-500">推奨発注: {alert.recommendedOrder}個</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">全商品在庫状況</h3>
        <div className="space-y-2">
          {products.map((product) => (
            <Link
              key={product.sku}
              href={`/products/${product.sku}`}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors"
            >
              <div>
                <p className="font-medium">{product.productName}</p>
                <p className="text-sm text-muted-foreground">{product.sku}</p>
              </div>
              <div className="text-right">
                <p
                  className={`font-bold ${
                    product.currentStock === 0
                      ? "text-red-500"
                      : product.currentStock < 20
                        ? "text-yellow-500"
                        : "text-green-500"
                  }`}
                >
                  {product.currentStock}個
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  )
}
