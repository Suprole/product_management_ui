'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProductSearchStep } from '@/components/product-search-step'
import { OrderDetailsStep } from '@/components/order-details-step'
import { OrderConfirmStep } from '@/components/order-confirm-step'
import type { ProductSearchResult } from '@/lib/types'

type Step = 'search' | 'details' | 'confirm'

export function OrderCreateView() {
  const [currentStep, setCurrentStep] = useState<Step>('search')
  const [selectedProduct, setSelectedProduct] = useState<ProductSearchResult | null>(null)
  const [orderData, setOrderData] = useState<{
    setCount: number
    taxRate: number
    remarks: string
  } | null>(null)
  
  // ステップ1: 商品検索・選択
  const handleProductSelect = (product: ProductSearchResult) => {
    setSelectedProduct(product)
    setCurrentStep('details')
  }
  
  // ステップ2: 数量入力
  const handleDetailsComplete = (data: { setCount: number; taxRate: number; remarks: string }) => {
    setOrderData(data)
    setCurrentStep('confirm')
  }
  
  // ステップ3: 確認後、発注一覧へ
  const handleCreateSuccess = () => {
    // 発注作成成功後は発注一覧ページへリダイレクト
    window.location.href = '/orders'
  }
  
  // 戻る処理
  const handleBack = () => {
    if (currentStep === 'confirm') {
      setCurrentStep('details')
    } else if (currentStep === 'details') {
      setCurrentStep('search')
      setSelectedProduct(null)
    }
  }
  
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ステップインジケーター */}
      <Card>
        <CardHeader>
          <CardTitle>作成ステップ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  currentStep === 'search'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                1
              </div>
              <span
                className={
                  currentStep === 'search' ? 'font-semibold' : 'text-muted-foreground'
                }
              >
                商品検索
              </span>
            </div>
            
            <div className="h-px flex-1 bg-border mx-4" />
            
            <div className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  currentStep === 'details'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                2
              </div>
              <span
                className={
                  currentStep === 'details' ? 'font-semibold' : 'text-muted-foreground'
                }
              >
                数量入力
              </span>
            </div>
            
            <div className="h-px flex-1 bg-border mx-4" />
            
            <div className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  currentStep === 'confirm'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                3
              </div>
              <span
                className={
                  currentStep === 'confirm' ? 'font-semibold' : 'text-muted-foreground'
                }
              >
                確認・作成
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* ステップコンテンツ */}
      {currentStep === 'search' && (
        <ProductSearchStep onSelect={handleProductSelect} />
      )}
      
      {currentStep === 'details' && selectedProduct && (
        <OrderDetailsStep
          product={selectedProduct}
          onComplete={handleDetailsComplete}
          onBack={handleBack}
        />
      )}
      
      {currentStep === 'confirm' && selectedProduct && orderData && (
        <OrderConfirmStep
          product={selectedProduct}
          orderData={orderData}
          onSuccess={handleCreateSuccess}
          onBack={handleBack}
        />
      )}
    </div>
  )
}

