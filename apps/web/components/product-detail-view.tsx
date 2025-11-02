import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Package, TrendingUp, ShoppingCart, Star } from "lucide-react"
import Link from "next/link"
import { ProductSalesChart } from "./product-sales-chart"
import { ProductInventoryChart } from "./product-inventory-chart"
import { ProductCartWinChart } from "./product-cart-win-chart"
import { headers } from "next/headers"

export async function ProductDetailView({ sku }: { sku: string }) {
  const h = await headers()
  const host = h.get('x-forwarded-host') || h.get('host') || 'localhost:3000'
  const proto = h.get('x-forwarded-proto') || (process.env.VERCEL ? 'https' : 'http')
  const base = `${proto}://${host}`
  const res = await fetch(`${base}/api/gas/product/${encodeURIComponent(sku)}`, { cache: 'no-store' })
  const data = await res.json()
  if (!data || data.error) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">商品が見つかりませんでした</p>
      </div>
    )
  }
  const kpis = data.kpis || {}
  const series = data.series || {}
  const periodFrom = data.periodFrom || ''
  const periodTo = data.periodTo || ''
  const periodText = periodFrom && periodTo ? `${periodFrom} ～ ${periodTo}` : ''
  const rating = data.rating || null
  
  const product = {
    productName: data.name || '',
    sku: data.sku || sku,
    asin: data.asin || '',
    category: data.category || '',
    currentStock: kpis.stockCurrent ?? kpis.stockEnd ?? 0,
    totalSales: Math.round(kpis.revenue ?? 0),
    orderCount: Math.round(kpis.units ?? 0),
    price: Math.round((data.price ?? 0) || 0),
    cost: Math.round((data.cost ?? 0) || 0),
    totalProfit: Math.round((data.totalProfit ?? 0) || 0),
    profitRate: typeof data.profitRate === 'number' ? data.profitRate : ((kpis.revenue ? ((data.totalProfit ?? 0) / (kpis.revenue || 1)) * 100 : 0)),
    rating: rating,
    salesQuantity: Math.round(kpis.units ?? 0),
    unitProfit: Math.round((data.unitProfit ?? (kpis.revenue ? ((data.totalProfit ?? 0) / (kpis.units || 1)) : 0)) || 0),
  }
  const mapByDate = (arr: any[]) => {
    const m: Record<string, number> = {}
    arr.forEach((x: any) => { m[x.date] = x.value })
    return m
  }
  const rev = mapByDate(series.revenueDaily || [])
  const prf = mapByDate(series.profitDaily || [])
  const dates = Object.keys(rev).sort()
  const dailySales = dates.map((d) => ({
    date: d,
    totalSales: rev[d] || 0,
    totalProfit: prf[d] || 0,
    salesQuantity: 0,
    orderCount: 0,
  }))
  const inventoryHistory = (series.stockDaily || []).map((p: any) => ({ date: p.date, stock: p.value }))
  const cartRows = [
    { label: '7日', value: (data.kpis?.buybox7d ?? 0) * 100 },
    { label: '30日', value: (data.kpis?.buybox30d ?? 0) * 100 },
    { label: '全期間', value: (data.kpis?.buyboxAll ?? 0) * 100 },
  ]

  

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/products"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          商品一覧に戻る
        </Link>
      </div>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">{product.productName}</h1>
          <p className="text-muted-foreground mt-2">
            SKU: {product.sku} | ASIN: {product.asin}
          </p>
        </div>
        <Badge
          variant={product.currentStock === 0 ? "destructive" : product.currentStock < 20 ? "secondary" : "default"}
        >
          {product.currentStock === 0 ? "在庫切れ" : product.currentStock < 20 ? "在庫不足" : "在庫あり"}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <Package className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">現在在庫</p>
              <p className="text-2xl font-bold">{product.currentStock}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-500/10 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">総売上</p>
              <p className="text-2xl font-bold">¥{product.totalSales.toLocaleString()}</p>
              {periodText && (
                <p className="text-xs text-muted-foreground mt-1">{periodText}</p>
              )}
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <ShoppingCart className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">注文件数</p>
              <p className="text-2xl font-bold">{product.orderCount}</p>
              {periodText && (
                <p className="text-xs text-muted-foreground mt-1">{periodText}</p>
              )}
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-500/10 rounded-lg">
              <Star className="h-6 w-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">評価</p>
              <p className="text-2xl font-bold">{product.rating || '評価なし'}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">商品情報</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">カテゴリー</span>
              <span className="font-medium">{product.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">販売価格</span>
              <span className="font-medium">¥{product.price.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">原価</span>
              <span className="font-medium">¥{product.cost.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">販売数量</span>
              <span className="font-medium">{product.salesQuantity}個</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">収益情報</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">総利益</span>
              <span className={`font-medium ${product.totalProfit >= 0 ? "text-green-500" : "text-red-500"}`}>
                ¥{product.totalProfit.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">利益率</span>
              <span className={`font-medium ${product.profitRate >= 0 ? "text-green-500" : "text-red-500"}`}>
                {product.profitRate.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">商品単価利益</span>
              <span className="font-medium">¥{product.unitProfit.toLocaleString()}</span>
            </div>
          </div>
        </Card>
      </div>

      <ProductSalesChart data={dailySales} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProductInventoryChart data={inventoryHistory} />
        <ProductCartWinChart rows={cartRows} />
      </div>
    </div>
  )
}
