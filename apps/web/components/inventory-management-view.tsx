import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Package, TrendingUp, AlertCircle } from "lucide-react"
import Link from "next/link"
import { InventoryChart } from "./inventory-chart"
import { headers } from "next/headers"

export async function InventoryManagementView() {
  const h = await headers()
  const host = h.get('x-forwarded-host') || h.get('host') || 'localhost:3000'
  const proto = h.get('x-forwarded-proto') || (process.env.VERCEL ? 'https' : 'http')
  const base = `${proto}://${host}`

  const resProducts = await fetch(`${base}/api/gas/products`, { cache: 'no-store' })
  const dataProducts = await resProducts.json()
  const products: any[] = Array.isArray(dataProducts?.items) ? dataProducts.items : []

  const outOfStock = products.filter((p) => (p.stock ?? p.currentStock ?? 0) === 0).length
  const lowStock = products.filter((p) => (p.stock ?? p.currentStock ?? 0) > 0 && (p.stock ?? p.currentStock ?? 0) < 20).length
  const overstock = products.filter((p) => (p.stock ?? p.currentStock ?? 0) > 150).length
  const totalInventoryValue = products.reduce((sum, p) => {
    const revenue = Number(p.revenue ?? p.totalSales ?? 0)
    const units = Number(p.units ?? p.salesQuantity ?? 0)
    const avgPrice = units > 0 ? revenue / units : 0
    const stock = Number(p.stock ?? p.currentStock ?? 0)
    return sum + stock * avgPrice
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
          {products
            .filter((p) => (p.stock ?? p.currentStock ?? 0) === 0 || (p.stock ?? p.currentStock ?? 0) < 20 || (p.stock ?? p.currentStock ?? 0) > 150)
            .slice(0, 10)
            .map((p) => (
              <Link
                key={p.sku}
                href={`/products/${p.sku}`}
                className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-4">
                  <Badge
                    variant={(p.stock ?? p.currentStock ?? 0) === 0 ? "destructive" : (p.stock ?? p.currentStock ?? 0) < 20 ? "secondary" : "default"}
                  >
                    {(p.stock ?? p.currentStock ?? 0) === 0 ? "在庫切れ" : (p.stock ?? p.currentStock ?? 0) < 20 ? "在庫不足" : "過剰在庫"}
                  </Badge>
                  <div>
                    <p className="font-medium">{p.name || p.productName || ''}</p>
                    <p className="text-sm text-muted-foreground">{p.sku}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">現在在庫: {(p.stock ?? p.currentStock ?? 0)}個</p>
                  {(p.recommendedOrderQty ?? 0) > 0 && (
                    <p className="text-sm text-green-500">推奨発注: {p.recommendedOrderQty}個</p>
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
