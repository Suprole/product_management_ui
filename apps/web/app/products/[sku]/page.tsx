import { DashboardHeader } from "@/components/dashboard-header"
import { ProductDetailView } from "@/components/product-detail-view"

// 動的レンダリングを強制（getServerApiBaseUrl使用）
export const dynamic = 'force-dynamic'

export default async function ProductDetailPage({ params }: { params: Promise<{ sku: string }> }) {
  const { sku } = await params
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-6">
        <ProductDetailView sku={sku} />
      </main>
    </div>
  )
}
