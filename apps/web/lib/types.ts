export type Grain = 'day' | 'week' | 'month'

export type DateRangeQuery = {
  from?: string
  to?: string
  grain?: Grain
}

export type ApiError = { error: string; code?: string; _status?: number; hint?: string }

export type TimePoint = { date: string; value: number }

// Dashboard
export type DashboardKPI = {
  revenue: number
  orderCount: number
  shippedUnits: number
  aov: number
  buyboxRateWeighted: number
  totalStock: number
  totalRecommendedOrderQty: number
  totalDemandForecast: number
}

export type DashboardSeries = {
  revenue?: TimePoint[]
  units?: TimePoint[]
  buyboxRate?: TimePoint[]
  stock?: TimePoint[]
}

export type DashboardResponse = { kpi: DashboardKPI; series?: Partial<DashboardSeries> } | ApiError

// Products list
export type InventoryHealth = '良' | '注意' | '危険' | '不明' | string

export type ProductListItem = {
  sku: string
  name: string
  asin: string
  category: string
  units: number
  revenue: number
  buyboxRate: number
  stock: number
  avgDailyUnits?: number
  doh?: number
  recommendedOrderQty: number
  demandForecast: number
  inventoryHealth: InventoryHealth
}

export type ProductsResponse = { items: ProductListItem[] } | ApiError

// Product detail
export type ProductDetailKPI = {
  units: number
  revenue: number
  buyboxRateWeighted?: number
  stockEnd?: number
  doh?: number
  recommendedOrderQty: number
  demandForecast: number
}

export type ProductDetailSeries = {
  revenueDaily: TimePoint[]
  unitsDaily: TimePoint[]
  stockDaily: TimePoint[]
  buyboxRateDaily?: TimePoint[]
  demandForecastByGrain?: TimePoint[]
  recommendedOrderQtyByGrain?: TimePoint[]
}

export type ProductDetailResponse =
  | {
      sku: string
      name: string
      asin: string
      category: string
      kpis: ProductDetailKPI
      series: ProductDetailSeries
    }
  | ApiError

// Alerts
export type AlertSeverity = 'Critical' | 'Warning' | 'Info'
export type AlertType = 'Ordering' | 'Inventory' | 'Performance' | 'Sales' | 'State'

export type AlertItem = {
  sku: string
  name?: string
  type: AlertType
  severity: AlertSeverity
  metrics: {
    recommendedOrderQty?: number
    demandForecast?: number
    stockEnd?: number
    doh?: number
    buyboxDrop7dPt?: number
    zeroSalesStreakDays?: number
    inventoryHealth?: InventoryHealth
  }
  message?: string
  updatedAt?: string
}

export type AlertsResponse = { items: AlertItem[] } | ApiError

// Product charts
export type DailyProductSales = {
  date: string
  salesQuantity: number
  totalSales: number
  totalProfit: number
  orderCount: number
}

export type CartWinRate = {
  date: string
  cartWinRate: number // percent 0..100
  sessions?: number
}


