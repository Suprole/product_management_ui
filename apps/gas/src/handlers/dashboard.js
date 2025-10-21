function handleDashboard_(e) {
  var p = normalizeParams_(e.parameter || {});
  var key = 'dash:' + p.from + ':' + p.to + ':' + p.grain;
  var hit = cacheGet_(key);
  if (hit) return json_(JSON.parse(hit));

  var kpi = readDashboard_(p.from, p.to);
  var out = { kpi: kpi, series: {} };
  // series（売上/在庫/カート率）は必要に応じて追加（本MVPでは省略・UI側で集約可）
  cachePut_(key, JSON.stringify(out), 120);
  return json_(out);
}


