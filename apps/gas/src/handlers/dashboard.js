function handleDashboard_(e) {
  var p = normalizeParams_(e.parameter || {});
  var key = 'dash:' + p.from + ':' + p.to + ':' + p.grain;
  var debug = String(e && e.parameter && e.parameter.debug || '') === '1';
  var hit = !debug && cacheGet_(key);
  if (hit) return json_(JSON.parse(hit));

  var kpi = readDashboard_(p.from, p.to);
  var out = { kpi: kpi, series: {} };

  // series（基本: 日次）。粒度集計はUI側で可能なため当面は日別を返す
  try {
    var salesDaily = readAll_('日次売上集計')
      .filter(function(r){ var y = toYmd_(r['売上日']); return inRangeYmd_(y, p.from, p.to); })
      .map(function(r){ return { date: toYmd_(r['売上日']), revenue: num_(r['実質売上']), units: num_(r['出荷商品数']) }; });
    out.series.revenue = salesDaily.map(function(x){ return { date: x.date, value: x.revenue }; });
    out.series.units   = salesDaily.map(function(x){ return { date: x.date, value: x.units }; });
  } catch (err) {
    out._seriesRevenueError = String(err);
  }

  try {
    var stock = readAll_('全体在庫日次集計')
      .filter(function(r){ var y = toYmd_(r['日付']); return inRangeYmd_(y, p.from, p.to); })
      .map(function(r){ return { date: toYmd_(r['日付']), value: num_(r['在庫数']) }; });
    out.series.stock = stock;
  } catch (err2) {
    out._seriesStockError = String(err2);
  }
  if (debug) {
    // 入力データのレンジを同梱
    try {
      var ds = readAll_('日次売上集計');
      var st = readAll_('全体在庫日次集計');
      out._debug = {
        params: p,
        dailySales: rangeInfoFromRows_(ds, '売上日'),
        stockGlobal: rangeInfoFromRows_(st, '日付')
      };
    } catch (err) {
      out._debugError = String(err);
    }
  }
  if (!debug) cachePut_(key, JSON.stringify(out), 120);
  return json_(out);
}


