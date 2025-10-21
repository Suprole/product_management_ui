"use client";
import useSWR from 'swr';
import { fetchJson } from '@/src/lib/fetcher';

type SeriesPoint = { date: string; value: number };
type ProductDetail = {
  sku: string; name: string; asin: string; category: string;
  kpis: { units: number; revenue: number; recommendedOrderQty: number; demandForecast: number };
  series: { revenueDaily: SeriesPoint[]; unitsDaily: SeriesPoint[]; stockDaily: SeriesPoint[] };
};

export default function ProductDetailPage({ params }: { params: { sku: string }}){
  const { data } = useSWR<ProductDetail>(`/api/gas/product/${params.sku}`, fetchJson);
  const d = data;
  return (
    <div>
      <h1>{d?.name || params.sku}</h1>
      <div style={{color:'#666'}}>{d?.sku} / {d?.asin} / {d?.category}</div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginTop:12}}>
        <Kpi title="売上" value={d?.kpis.revenue ?? 0} />
        <Kpi title="数量" value={d?.kpis.units ?? 0} />
        <Kpi title="推奨発注" value={d?.kpis.recommendedOrderQty ?? 0} highlight />
        <Kpi title="需要予測" value={d?.kpis.demandForecast ?? 0} highlight />
      </div>
      <div style={{marginTop:16}}>
        <h3>需要予測 vs 推奨発注（概念表示）</h3>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <span style={{background:'#A78BFA',width:12,height:12,display:'inline-block'}}></span> 需要予測
          <span style={{background:'#60A5FA',width:12,height:2,display:'inline-block'}}></span> 推奨発注
        </div>
        <div style={{padding:'12px',border:'1px dashed #ddd',marginTop:8}}>
          {/* 簡易：値のみ提示（本番はチャートライブラリに差し替え） */}
          予測: {d?.kpis.demandForecast ?? 0} / 推奨: {d?.kpis.recommendedOrderQty ?? 0}
        </div>
      </div>
    </div>
  );
}

function Kpi({ title, value, highlight }: { title: string; value: number; highlight?: boolean }){
  return <div style={{padding:12,border:'1px solid #eee',borderRadius:8,background:highlight?'#EFF6FF':'#fff'}}>
    <div style={{fontSize:12,color:'#666'}}>{title}</div>
    <div style={{fontSize:20,fontWeight:600}}>{Intl.NumberFormat('ja-JP').format(value)}</div>
  </div>;
}


