"use client";
import useSWR from 'swr';
import { fetchJson } from '@/src/lib/fetcher';

type AlertsData = { items: { sku: string; recommendedOrderQty: number; demandForecast: number; inventoryHealth?: string }[]; needWarnSkus: string[] };

export default function AlertsPage(){
  const { data } = useSWR<AlertsData>('/api/gas/alerts', fetchJson, { revalidateOnFocus: false });
  return (
    <div>
      <h1>Alerts</h1>
      <p style={{color:'#666'}}>推奨発注/需要超過警戒（簡易）</p>
      <table style={{width:'100%',borderCollapse:'collapse'}}>
        <thead><tr><Th>SKU</Th><Th>推奨発注</Th><Th>需要予測</Th><Th>状態</Th></tr></thead>
        <tbody>
          {(data?.items||[]).map(it => (
            <tr key={it.sku}>
              <Td>{it.sku}</Td>
              <Td style={{color: it.recommendedOrderQty>0?'#2563EB':undefined}}>{it.recommendedOrderQty}</Td>
              <Td style={{color:'#7C3AED'}}>{it.demandForecast}</Td>
              <Td>{it.inventoryHealth || '-'}</Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }){ return <th style={{textAlign:'left',borderBottom:'1px solid #eee',padding:'8px'}}>{children}</th>; }
function Td({ children }: { children: React.ReactNode }){ return <td style={{borderBottom:'1px solid #f3f4f6',padding:'8px'}}>{children}</td>; }


