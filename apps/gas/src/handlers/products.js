function handleProducts_(e) {
  var p = normalizeParams_(e.parameter || {});
  var key = 'products:' + p.from + ':' + p.to + ':' + p.grain;
  var hit = cacheGet_(key);
  if (hit) return json_(JSON.parse(hit));

  var sales = readAll_('商品別日次売上集計')
    .filter(function(r){ return (r['売上日']>=p.from && r['売上日']<=p.to); });

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
  var stock = readAll_('商品別在庫日次集計').filter(function(r){ return r['日付']===p.to; });
  var stockMap = {};
  stock.forEach(function(r){ stockMap[String(r['SKU'])] = num_(r['在庫数']); });
  rows.forEach(function(x){ x.stock = stockMap[x.sku] || 0; });

  // カート率（ASINベース → マスタでSKUへ）：シンプルな加重平均（日次）
  var buybox = readAll_('カート取得率日次');
  var asinBySku = {};
  rows.forEach(function(x){ asinBySku[x.sku] = x.asin; });
  var acc = {};
  buybox.forEach(function(r){
    var asin = String(r['ASIN'] || '');
    var sku = Object.keys(asinBySku).find(function(s){ return asinBySku[s]===asin; });
    if (!sku) return;
    if (!acc[sku]) acc[sku] = { w:0, v:0 };
    var rate = num_(r['カート取得率%']);
    var sess = num_(r['セッション数']);
    acc[sku].w += sess;
    acc[sku].v += rate * sess;
  });
  rows.forEach(function(x){
    var a = acc[x.sku];
    x.buyboxRate = a && a.w ? (a.v / a.w) : 0;
  });

  return json_({ items: rows });
}


