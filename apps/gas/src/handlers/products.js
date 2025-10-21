function handleProducts_(e) {
  var p = normalizeParams_(e.parameter || {});
  var key = 'products:' + p.from + ':' + p.to + ':' + p.grain;
  var debug = String(e && e.parameter && e.parameter.debug || '') === '1';
  var hit = !debug && cacheGet_(key);
  if (hit) return json_(JSON.parse(hit));

  var sales = readAll_('商品別日次売上集計')
    .filter(function(r){ var y = toYmd_(r['売上日']); return inRangeYmd_(y, p.from, p.to); });

  var agg = {}; // SKU単位に集計
  sales.forEach(function(r){
    var sku = String(r['SKU'] || '');
    if (!sku) return;
    if (!agg[sku]) agg[sku] = { sku: sku, units:0, revenue:0 };
    agg[sku].units   += num_(r['販売数量']);
    agg[sku].revenue += num_(r['実質売上']);
  });

  var rows = Object.keys(agg).map(function(k){ return agg[k]; });
  joinMaster_(rows);
  joinState_(rows);

  // 末日時点在庫
  var stock = readAll_('商品別在庫日次集計').filter(function(r){ return toYmd_(r['日付'])===p.to; });
  var stockMap = {};
  stock.forEach(function(r){ stockMap[String(r['SKU'])] = num_(r['在庫数']); });
  rows.forEach(function(x){ x.stock = stockMap[x.sku] || 0; });

  // カート率（ASINベース → マスタでSKUへ）：シンプルな加重平均（日次）
  // 週/月の集計表が与えられている前提につき『商品別カート取得率集計』を参照
  var buybox = readAll_('商品別カート取得率集計');
  // 列: ASIN, 平均カート取得率（7日 or 30日 or 全期間）, 総セッション数（7日 or 30日）等
  // 重みには『総セッション数（30日）』を採用し、値は『平均カート取得率（30日）』を採用
  var asinBySku = {};
  rows.forEach(function(x){ asinBySku[x.sku] = x.asin; });
  var acc = {};
  buybox.forEach(function(r){
    var asin = String(r['ASIN'] || '');
    var sku = Object.keys(asinBySku).find(function(s){ return asinBySku[s]===asin; });
    if (!sku) return;
    if (!acc[sku]) acc[sku] = { w:0, v:0 };
    var rate = num_(r['平均カート取得率（30日）']);
    var sess = num_(r['総セッション数（30日）']);
    acc[sku].w += sess;
    acc[sku].v += rate * sess;
  });
  rows.forEach(function(x){
    var a = acc[x.sku];
    x.buyboxRate = a && a.w ? (a.v / a.w) : 0;
  });

  // 平均日販・DOH（在庫日数）を追加
  var days = (new Date(p.to).getTime() - new Date(p.from).getTime()) / 86400000 + 1;
  rows.forEach(function(x){
    var avg = days > 0 ? (x.units / days) : 0;
    x.avgDailyUnits = avg;
    x.doh = avg > 0 ? (x.stock / avg) : null;
  });

  var out = { items: rows };
  if (debug) {
    try {
      var ds = readAll_('商品別日次売上集計');
      var st = readAll_('商品別在庫日次集計');
      var bb = readAll_('商品別カート取得率集計');
      out._debug = {
        params: p,
        salesDaily: rangeInfoFromRows_(ds, '売上日'),
        stockDaily: rangeInfoFromRows_(st, '日付'),
        buyboxAgg: { count: bb.length }
      };
    } catch (err) {
      out._debugError = String(err);
    }
  }
  if (!debug) cachePut_(key, JSON.stringify(out), 120);
  return json_(out);
}


