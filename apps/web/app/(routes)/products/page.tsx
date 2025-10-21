"use client";
import Link from 'next/link';
import useSWR from 'swr';
import { fetchJson } from '@/src/lib/fetcher';

type Item = {
  sku: string; name: string; category: string; asin: string;
  units: number; revenue: number; stock: number; buyboxRate?: number;
  inventoryHealth?: string | null; recommendedOrderQty?: number; demandForecast?: number;
};
type ProductsData = { items: Item[] };

export default function ProductsPage(){
  const { data } = useSWR<ProductsData>('/api/gas/products', fetchJson);
  const items = data?.items ?? [];
  return (
    <div>
      <h1>Products</h1>
      <table style={{width:'100%',borderCollapse:'collapse'}}>
        <thead>
          <tr>
            <Th>商品名</Th><Th>SKU/ASIN</Th><Th>数量/売上</Th><Th>平均カート率</Th><Th>在庫</Th><Th>DOH</Th><Th>在庫健全性</Th><Th>推奨発注</Th><Th>需要予測</Th>
          </tr>
        </thead>
        <tbody>
          {items.map(it => (
            <tr key={it.sku}>
              <Td><Link href={`/products/${it.sku}`}>{it.name || it.sku}</Link><div style={{fontSize:12,color:'#666'}}>{it.category}</div></Td>
              <Td>{it.sku}<div style={{fontSize:12,color:'#666'}}>{it.asin}</div></Td>
              <Td>{it.units} / {Intl.NumberFormat('ja-JP').format(it.revenue)}</Td>
              <Td>{((it.buyboxRate||0)).toFixed(1)}%</Td>
              <Td>{it.stock}</Td>
              <Td>{calcDOH(it.stock, it.units)}</Td>
              <Td>{it.inventoryHealth || '-'}</Td>
              <Td style={{color: (it.recommendedOrderQty||0)>0?'#2563EB':undefined}}>{it.recommendedOrderQty||0}</Td>
              <Td style={{color: '#7C3AED'}}>{it.demandForecast||0}</Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }){
  return <th style={{textAlign:'left',borderBottom:'1px solid #eee',padding:'8px'}}>{children}</th>;
}
function Td({ children }: { children: React.ReactNode }){
  return <td style={{borderBottom:'1px solid #f3f4f6',padding:'8px'}}>{children}</td>;
}
function calcDOH(stock: number, units: number){
  const avg = units/30; // 30日想定
  return avg>0 ? Math.round(stock/avg) : 0;
}


