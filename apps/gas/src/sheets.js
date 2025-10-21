// SS_ID は Script Properties に保存（SS_ID=<SpreadsheetId>）
var SH = {
  DAILY_SALES: '日次売上集計',
  SKU_SALES_DAILY: '商品別日次売上集計',
  BUYBOX_DAILY: 'カート取得率日次',
  STOCK_SKEW_DAILY: '商品別在庫日次集計',
  STOCK_GLOBAL_DAILY: '全体在庫日次集計',
  MASTER: '商品マスタ',
  STATE: '商品状態'
};

function open_() {
  var id = PropertiesService.getScriptProperties().getProperty('SS_ID');
  if (!id) throw new Error('SS_ID is not set in Script Properties');
  return SpreadsheetApp.openById(id);
}

function readAll_(sheetName) {
  var sh = open_().getSheetByName(sheetName);
  if (!sh) throw new Error('sheet not found: ' + sheetName);
  var values = sh.getDataRange().getValues();
  if (!values || !values.length) return [];
  var head = values.shift();
  return values.map(function(row){
    var o = {};
    for (var i=0;i<head.length;i++) o[String(head[i])] = row[i];
    return o;
  });
}

function readDashboard_(from, to) {
  var sales = readAll_(SH.DAILY_SALES).filter(function(r){ return (r['売上日']>=from && r['売上日']<=to); });
  var res = {
    revenue: sales.reduce(function(a,r){ return a + num_(r['実質売上']); }, 0),
    orders:  sales.reduce(function(a,r){ return a + num_(r['注文件数']); }, 0),
    units:   sales.reduce(function(a,r){ return a + num_(r['出荷商品数']); }, 0)
  };
  var stockRows = readAll_(SH.STOCK_GLOBAL_DAILY).filter(function(r){ return r['日付']===to; });
  res.stockTotal = stockRows.length ? num_(stockRows[0]['在庫数']) : 0;

  var stateRows = readAll_(SH.STATE);
  res.recommendedOrderTotal = stateRows.reduce(function(a,r){ return a + num_(r['推奨発注数']); }, 0);
  res.demandForecastTotal   = stateRows.reduce(function(a,r){ return a + num_(r['需要予測']); }, 0);
  return res;
}

function joinMaster_(rowsBySku) {
  var master = readAll_(SH.MASTER);
  var bySku = {};
  master.forEach(function(r){ bySku[String(r['SKU'])] = r; });
  rowsBySku.forEach(function(x){
    var m = bySku[x.sku] || {};
    x.asin = m['ASIN'] || '';
    x.name = m['商品名'] || '';
    x.category = m['カテゴリ'] || '';
  });
  return rowsBySku;
}

function joinState_(rowsBySku) {
  var st = readAll_(SH.STATE);
  var bySku = {};
  st.forEach(function(r){
    bySku[String(r['SKU'])] = {
      inventoryHealth: String(r['在庫健全性'] || ''),
      recommendedOrderQty: num_(r['推奨発注数']),
      demandForecast: num_(r['需要予測']),
      stateUpdatedAt: r['更新日'] || ''
    };
  });
  rowsBySku.forEach(function(x){
    var s = bySku[x.sku] || {};
    x.inventoryHealth = s.inventoryHealth || null;
    x.recommendedOrderQty = s.recommendedOrderQty || 0;
    x.demandForecast = s.demandForecast || 0;
    x.stateUpdatedAt = s.stateUpdatedAt || null;
  });
  return rowsBySku;
}


