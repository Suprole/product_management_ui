function json_(obj, status) {
  obj = obj || {};
  if (status) obj._status = status;
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
function num_(v) { v = Number(v); return isNaN(v) ? 0 : v; }
function today_() { return Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyy-MM-dd'); }
function cacheGet_(key) { return CacheService.getScriptCache().get(key); }
function cachePut_(key, value, seconds) { CacheService.getScriptCache().put(key, value, seconds || 60); }

function normalizeParams_(param) {
  var from = param.from || Utilities.formatDate(new Date(Date.now()-30*86400000), 'Asia/Tokyo', 'yyyy-MM-dd');
  var to   = param.to   || today_();
  var grain= (param.grain || 'day').toLowerCase();
  return { from: from, to: to, grain: grain, sku: param.sku || '' };
}
function guard_(e) {
  var token = e && e.parameter && e.parameter.key;
  var expected = PropertiesService.getScriptProperties().getProperty('APP_TOKEN');
  if (!expected || token !== expected) throw new Error('unauthorized');
}

// 日付正規化: シートに "YYYY/MM/DD", "YYYY-MM-DD", Date オブジェクトなどが混在しても
// すべて "yyyy-MM-dd" に統一して返す
function toYmd_(v) {
  if (!v && v !== 0) return '';
  var d = null;
  if (Object.prototype.toString.call(v) === '[object Date]') {
    if (!isNaN(v.getTime())) d = v;
  } else if (typeof v === 'number') {
    // シリアル/epochの可能性。epoch(ms)想定
    d = new Date(v);
  } else if (typeof v === 'string') {
    var s = v.trim();
    // 区切りをスラッシュに統一してからDate化
    s = s.replace(/\./g, '/').replace(/-/g, '/');
    d = new Date(s);
  }
  if (!d || isNaN(d.getTime())) return '';
  return Utilities.formatDate(d, 'Asia/Tokyo', 'yyyy-MM-dd');
}

function inRangeYmd_(ymd, from, to) {
  if (!ymd) return false;
  return (ymd >= from && ymd <= to);
}

function rangeInfoFromRows_(rows, dateKey) {
  var min = null, max = null, c = 0;
  rows.forEach(function(r){
    var y = toYmd_(r[dateKey]);
    if (!y) return;
    c++;
    if (!min || y < min) min = y;
    if (!max || y > max) max = y;
  });
  return { count: c, min: min, max: max };
}


