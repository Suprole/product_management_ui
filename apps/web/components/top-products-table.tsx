import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { getProductsData } from "@/lib/data"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import Link from "next/link"

export async function TopProductsTable() {
  const products = await getProductsData()

  // Sort by profit and take top 10
  const topProducts = products.sort((a, b) => b.totalProfit - a.totalProfit).slice(0, 10)

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">トップ商品（利益順）</CardTitle>
        <p className="text-sm text-muted-foreground">利益が高い上位10商品</p>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground">SKU</TableHead>
              <TableHead className="text-muted-foreground">商品名</TableHead>
              <TableHead className="text-muted-foreground">注文件数</TableHead>
              <TableHead className="text-muted-foreground text-right">売上</TableHead>
              <TableHead className="text-muted-foreground text-right">利益</TableHead>
              <TableHead className="text-muted-foreground text-right">利益率</TableHead>
              <TableHead className="text-muted-foreground text-right">在庫</TableHead>
              <TableHead className="text-muted-foreground">状態</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topProducts.map((product) => (
              <TableRow key={product.sku} className="border-border hover:bg-muted/50">
                <TableCell className="font-mono text-sm">
                  <Link href={`/products/${product.sku}`} className="hover:underline text-blue-500">
                    {product.sku}
                  </Link>
                </TableCell>
                <TableCell className="max-w-xs truncate">{product.productName}</TableCell>
                <TableCell>{product.orderCount}</TableCell>
                <TableCell className="text-right">¥{product.totalSales.toLocaleString()}</TableCell>
                <TableCell className="text-right font-semibold">
                  <span className={product.totalProfit >= 0 ? "text-green-500" : "text-red-500"}>
                    ¥{product.totalProfit.toLocaleString()}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    {product.profitRate >= 0 ? (
                      <ArrowUpRight className="h-3 w-3 text-green-500" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 text-red-500" />
                    )}
                    <span className={product.profitRate >= 0 ? "text-green-500" : "text-red-500"}>
                      {product.profitRate.toFixed(1)}%
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">{product.currentStock}</TableCell>
                <TableCell>
                  {product.stockHealth === "不足" && (
                    <Badge variant="destructive" className="text-xs">
                      在庫不足
                    </Badge>
                  )}
                  {product.stockHealth === "out_of_stock" && (
                    <Badge variant="destructive" className="text-xs">
                      在庫切れ
                    </Badge>
                  )}
                  {!product.stockHealth && (
                    <Badge variant="secondary" className="text-xs">
                      正常
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
