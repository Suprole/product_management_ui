function handleProductBySku_(e) {
  var p = normalizeParams_(e.parameter || {});
  if (!p.sku) return json_({ error: 'sku required' }, 400);

  var sku = p.sku;
  var sales = readAll_('商品別日次売上集計').filter(function(r){ return String(r['SKU'])===sku && (r['売上日']>=p.from && r['売上日']<=p.to); });
  var stock = readAll_('商品別在庫日次集計').filter(function(r){ return String(r['SKU'])===sku && (r['日付']>=p.from && r['日付']<=p.to); });

  var head = { sku: sku, units:0, revenue:0 };
  sales.forEach(function(r){ head.units+=num_(r['販売数量']); head.revenue+=num_(r['実質売上']); });
  var rows = [head];
  joinMaster_(rows);
  joinState_(rows);

  var out = {
    sku: sku, name: rows[0].name, asin: rows[0].asin, category: rows[0].category,
    kpis: {
      units: head.units, revenue: head.revenue,
      recommendedOrderQty: rows[0].recommendedOrderQty,
      demandForecast: rows[0].demandForecast
    },
    series: {
      revenueDaily: sales.map(function(r){ return { date: r['売上日'], value: num_(r['実質売上']) }; }),
      unitsDaily:   sales.map(function(r){ return { date: r['売上日'], value: num_(r['販売数量']) }; }),
      stockDaily:   stock.map(function(r){ return { date: r['日付'],  value: num_(r['在庫数']) }; })
    }
  };
  return json_(out);
}


