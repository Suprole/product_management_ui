import { Card } from "@/components/ui/card"
import { getSalesAnalytics, getSalesData } from "@/lib/data"
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react"
import Link from "next/link"
import { SalesChart } from "./sales-chart"

export async function SalesAnalyticsView() {
  const analytics = await getSalesAnalytics()
  const salesData = await getSalesData()

  const totalSales = salesData.reduce((sum, day) => sum + day.totalSales, 0)
  const totalProfit = salesData.reduce((sum, day) => sum + day.totalProfit, 0)
  const averageProfitRate = (totalProfit / totalSales) * 100

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
                  <p className="font-bold">¥{product.totalSales.toLocaleString()}</p>
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
