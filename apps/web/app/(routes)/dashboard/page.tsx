"use client";
import useSWR from 'swr';
import { fetchJson } from '@/src/lib/fetcher';

type DashboardData = {
  kpi: { revenue: number; orders: number; units: number; stockTotal: number; recommendedOrderTotal: number; demandForecastTotal: number };
};

export default function DashboardPage() {
  const { data } = useSWR<DashboardData>(`/api/gas/dashboard`, fetchJson);
  const k = data?.kpi;
  return (
    <div>
      <h1>Dashboard</h1>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'12px'}}>
        <KpiCard title="総売上" value={k?.revenue ?? 0} />
        <KpiCard title="注文件数" value={k?.orders ?? 0} />
        <KpiCard title="出荷商品数" value={k?.units ?? 0} />
        <KpiCard title="全体在庫" value={k?.stockTotal ?? 0} />
        <KpiCard title="総推奨発注数" value={k?.recommendedOrderTotal ?? 0} highlight />
        <KpiCard title="総需要予測" value={k?.demandForecastTotal ?? 0} highlight />
      </div>
    </div>
  );
}

function KpiCard({ title, value, highlight }: { title: string; value: number; highlight?: boolean }){
  return (
    <div style={{padding:'12px',border:'1px solid #eee',borderRadius:8,background:highlight?'#EFF6FF':'#fff'}}>
      <div style={{fontSize:12,color:'#666'}}>{title}</div>
      <div style={{fontSize:22,fontWeight:600}}>{Intl.NumberFormat('ja-JP').format(value)}</div>
    </div>
  );
}


