function handleProductBySku_(e) {
  var p = normalizeParams_(e.parameter || {});
  if (!p.sku) return json_({ error: 'sku required' }, 400);

  var sku = p.sku;
  var sales = readAll_('商品別日次売上集計').filter(function(r){ return String(r['SKU'])===sku && inRangeYmd_(toYmd_(r['売上日']), p.from, p.to); });
  var stock = readAll_('商品別在庫日次集計').filter(function(r){ return String(r['SKU'])===sku && inRangeYmd_(toYmd_(r['日付']), p.from, p.to); });

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
  // 期間末日在庫とDOH
  try {
    var stockEndRow = stock.filter(function(r){ return toYmd_(r['日付'])===p.to; })[0];
    var stockEnd = stockEndRow ? num_(stockEndRow['在庫数']) : 0;
    var days = (new Date(p.to).getTime() - new Date(p.from).getTime()) / 86400000 + 1;
    var avg = days>0 ? (head.units / days) : 0;
    out.kpis.stockEnd = stockEnd;
    out.kpis.doh = avg>0 ? (stockEnd/avg) : null;
  } catch (e1) {}

  // カート率（ASINに基づく30日加重平均）
  try {
    var bb = readAll_('商品別カート取得率集計');
    var asin = rows[0].asin;
    var acc = { w:0, v:0 };
    bb.forEach(function(r){
      if (String(r['ASIN']) !== asin) return;
      var rate = num_(r['平均カート取得率（30日）']);
      var sess = num_(r['総セッション数（30日）']);
      acc.w += sess; acc.v += rate * sess;
    });
    out.kpis.buyboxRateWeighted = acc.w ? (acc.v / acc.w) : 0;
  } catch (e2) {}
  var debug = String(e && e.parameter && e.parameter.debug || '') === '1';
  if (debug) {
    out._debug = {
      params: p,
      salesCount: sales.length,
      stockCount: stock.length
    };
  }
  return json_(out);
}


