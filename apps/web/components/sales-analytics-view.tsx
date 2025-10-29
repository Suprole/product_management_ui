import { Card } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react"
import Link from "next/link"
import { SalesChart } from "./sales-chart"
import { headers } from "next/headers"
import { DashboardResponse, ProductsResponse } from "@/lib/types"

export async function SalesAnalyticsView() {
  const h = await headers()
  const host = h.get('x-forwarded-host') || h.get('host') || 'localhost:3000'
  const proto = h.get('x-forwarded-proto') || (process.env.VERCEL ? 'https' : 'http')
  const base = `${proto}://${host}`

  const [dashRes, prodRes] = await Promise.all([
    fetch(`${base}/api/gas/dashboard`, { cache: 'no-store' }),
    fetch(`${base}/api/gas/products`, { cache: 'no-store' }),
  ])
  const dash = (await dashRes.json()) as DashboardResponse
  const prod = (await prodRes.json()) as ProductsResponse
  const items = 'items' in prod ? prod.items : []

  const totalSales = 'kpi' in dash ? dash.kpi.revenue : items.reduce((s, it: any) => s + Number(it.revenue ?? it.totalSales ?? 0), 0)
  const totalProfit = items.reduce((s, it: any) => s + Number(it.profit ?? it.totalProfit ?? 0), 0)
  const averageProfitRate = totalSales ? (totalProfit / totalSales) * 100 : 0

  const normalized = items.map((it: any) => ({
    sku: it.sku,
    productName: it.name || it.productName || '',
    revenue: Number(it.revenue ?? it.totalSales ?? 0),
    salesQuantity: Number(it.units ?? it.salesQuantity ?? 0),
    totalProfit: Number(it.profit ?? it.totalProfit ?? 0),
    profitRate: typeof it.profitRate === 'number' ? it.profitRate : (Number(it.revenue ?? 0) ? (Number(it.profit ?? 0) / Number(it.revenue ?? 1)) * 100 : 0),
  }))
  const analytics = {
    topProducts: normalized.slice().sort((a, b) => b.revenue - a.revenue).slice(0, 10),
    profitRanking: normalized.slice().sort((a, b) => b.totalProfit - a.totalProfit).slice(0, 10),
    lowProfitProducts: normalized.filter((p) => p.profitRate < 5).sort((a, b) => a.profitRate - b.profitRate),
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">総売上</p>
              <p className="text-2xl font-bold">¥{totalSales.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-500/10 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">総利益</p>
              <p className="text-2xl font-bold text-green-500">¥{totalProfit.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">平均利益率</p>
              <p className="text-2xl font-bold">{averageProfitRate.toFixed(2)}%</p>
            </div>
          </div>
        </Card>
      </div>

      <SalesChart />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            売上トップ10
          </h3>
          <div className="space-y-3">
            {analytics.topProducts.map((product, index) => (
              <Link
                key={product.sku}
                href={`/products/${product.sku}`}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-muted-foreground w-6">{index + 1}</span>
                  <div>
                    <p className="font-medium">{product.productName}</p>
                    <p className="text-sm text-muted-foreground">{product.sku}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">¥{Math.round(product.revenue).toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">{product.salesQuantity}個</p>
                </div>
              </Link>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-yellow-500" />
            利益トップ10
          </h3>
          <div className="space-y-3">
            {analytics.profitRanking.map((product, index) => (
              <Link
                key={product.sku}
                href={`/products/${product.sku}`}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-muted-foreground w-6">{index + 1}</span>
                  <div>
                    <p className="font-medium">{product.productName}</p>
                    <p className="text-sm text-muted-foreground">{product.sku}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-500">¥{product.totalProfit.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">{product.profitRate.toFixed(1)}%</p>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingDown className="h-5 w-5 text-red-500" />
          低利益率商品（5%未満）
        </h3>
        <div className="space-y-3">
          {analytics.lowProfitProducts.map((product) => (
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
                <p className={`font-bold ${product.totalProfit >= 0 ? "text-yellow-500" : "text-red-500"}`}>
                  ¥{product.totalProfit.toLocaleString()}
                </p>
                <p className={`text-sm ${product.profitRate >= 0 ? "text-yellow-500" : "text-red-500"}`}>
                  {product.profitRate.toFixed(2)}%
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  )
}
