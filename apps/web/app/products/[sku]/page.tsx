import { DashboardHeader } from "@/components/dashboard-header"
import { ProductDetailView } from "@/components/product-detail-view"

export default function ProductDetailPage({ params }: { params: { sku: string } }) {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-6">
        <ProductDetailView sku={params.sku} />
      </main>
    </div>
  )
}
