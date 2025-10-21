import { DashboardHeader } from "@/components/dashboard-header"
import { SalesAnalyticsView } from "@/components/sales-analytics-view"

export default function SalesPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">売上分析</h1>
          <p className="text-muted-foreground mt-2">商品別売上ランキングと利益率分析</p>
        </div>

        <SalesAnalyticsView />
      </main>
    </div>
  )
}
