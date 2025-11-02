import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, TrendingUp, Percent } from "lucide-react"
import { headers } from "next/headers"
import { DashboardResponse } from "@/lib/types"
import { SalesChartByPeriod } from "./sales-chart-by-period"

// 期間計算ヘルパー
function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function getDateRange(daysAgo: number | null): { from?: string; to?: string } {
  const today = new Date()
  const to = formatDate(today)
  
  if (daysAgo === null) {
    // 全期間: 十分に古い日付を指定（スプレッドシートのデータ開始より前）
    return { from: '2020-01-01', to }
  }
  
  const fromDate = new Date(today)
  fromDate.setDate(today.getDate() - daysAgo)
  const from = formatDate(fromDate)
  
  return { from, to }
}

export async function SalesAnalyticsView() {
  const h = await headers()
  const host = h.get('x-forwarded-host') || h.get('host') || 'localhost:3000'
  const proto = h.get('x-forwarded-proto') || (process.env.VERCEL ? 'https' : 'http')
  const base = `${proto}://${host}`

  // 全期間、過去90日、過去30日のデータを並列取得
  const periods = [
    { label: '全期間', range: getDateRange(null) },
    { label: '過去90日', range: getDateRange(90) },
    { label: '過去30日', range: getDateRange(30) },
  ]

  const responses = await Promise.all(
    periods.map(async (period) => {
      const params = new URLSearchParams()
      if (period.range.from) params.set('from', period.range.from)
      if (period.range.to) params.set('to', period.range.to)
      const url = `${base}/api/gas/dashboard?${params.toString()}`
      const res = await fetch(url, { cache: 'no-store' })
      const data = (await res.json()) as DashboardResponse
      return { period: period.label, data }
    })
  )

  const periodData = responses.map(({ period, data }) => {
    if (!('kpi' in data)) {
      return {
        period,
        revenue: 0,
        profit: 0,
        profitRate: 0,
        revenueSeriesData: [],
        profitSeriesData: [],
        profitRateSeriesData: [],
        ordersSeriesData: [],
      }
    }
    const profit = (data.kpi as any).profit ?? 0
    const revenue = data.kpi.revenue ?? 0
    const profitRate = revenue ? (profit / revenue * 100) : 0
    
    return {
      period,
      revenue,
      profit,
      profitRate,
      revenueSeriesData: data.series?.revenue || [],
      profitSeriesData: data.series?.profit || [],
      profitRateSeriesData: data.series?.profitRate || [],
      ordersSeriesData: data.series?.orders || [],
      periodFrom: (data.kpi as any).periodFrom,
      periodTo: (data.kpi as any).periodTo,
    }
  })

  const formatJPY = (n: number) => `¥${Math.round(n).toLocaleString()}`

  return (
    <div className="space-y-6">
      {/* 総売上 - 期間別 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-blue-500" />
            総売上
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {periodData.map((pd) => (
              <div key={pd.period} className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">{pd.period}</p>
                <p className="text-3xl font-bold text-blue-500">{formatJPY(pd.revenue)}</p>
                {pd.periodFrom && pd.periodTo && (
                  <p className="text-xs text-muted-foreground">
                    {pd.periodFrom} ～ {pd.periodTo}
                  </p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 総利益 - 期間別 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            総利益
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {periodData.map((pd) => (
              <div key={pd.period} className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">{pd.period}</p>
                <p className={`text-3xl font-bold ${pd.profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {formatJPY(pd.profit)}
                </p>
                {pd.periodFrom && pd.periodTo && (
                  <p className="text-xs text-muted-foreground">
                    {pd.periodFrom} ～ {pd.periodTo}
                  </p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 利益率 - 期間別 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Percent className="h-5 w-5 text-purple-500" />
            利益率
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {periodData.map((pd) => (
              <div key={pd.period} className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">{pd.period}</p>
                <p className={`text-3xl font-bold ${pd.profitRate >= 0 ? 'text-purple-500' : 'text-red-500'}`}>
                  {pd.profitRate.toFixed(2)}%
                </p>
                {pd.periodFrom && pd.periodTo && (
                  <p className="text-xs text-muted-foreground">
                    {pd.periodFrom} ～ {pd.periodTo}
                  </p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 売上推移グラフ - 期間別 */}
      <div className="grid grid-cols-1 gap-6">
        {periodData.map((pd) => (
          <SalesChartByPeriod 
            key={pd.period}
            period={pd.period}
            revenueSeries={pd.revenueSeriesData}
            profitSeries={pd.profitSeriesData}
            profitRateSeries={pd.profitRateSeriesData}
            ordersSeries={pd.ordersSeriesData}
          />
        ))}
      </div>
    </div>
  )
}
