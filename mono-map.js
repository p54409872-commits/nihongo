// mono-map.js — 大富翁世界地图：两个人的位置、走过的路线、谁领先
// 需要 mono.js 里的 window.MONO，以及 index.html 已加载的 d3、topojson
(function(){

// 每个国家：[首都, 城市1, 城市2, 城市3] 的 [经度, 纬度]，顺序和 mono.js 一样
var XY = {
  JP:[[139.69,35.69],[135.50,34.69],[135.77,35.01],[141.35,43.06]],
  KR:[[126.98,37.57],[129.08,35.18],[126.53,33.50],[129.22,35.86]],
  CN:[[116.40,39.90],[121.47,31.23],[108.94,34.34],[104.07,30.57]],
  ID:[[106.85,-6.21],[115.19,-8.65],[110.36,-7.80],[107.61,-6.91]],
  AU:[[149.13,-35.28],[151.21,-33.87],[144.96,-37.81],[145.77,-16.92]],
  IN:[[77.21,28.61],[72.88,19.08],[78.01,27.18],[77.59,12.97]],
  SA:[[46.68,24.71],[39.19,21.49],[37.92,26.62],[50.10,26.43]],
  TR:[[32.86,39.93],[28.98,41.01],[34.83,38.64],[30.71,36.90]],
  RU:[[37.62,55.76],[30.32,59.94],[49.11,55.79],[131.89,43.12]],
  DE:[[13.40,52.52],[11.58,48.14],[8.68,50.11],[9.99,53.55]],
  NL:[[4.90,52.37],[4.48,51.92],[4.30,52.08],[4.64,51.88]],
  CH:[[7.45,46.95],[8.54,47.38],[6.14,46.20],[7.75,46.02]],
  FR:[[2.35,48.86],[7.26,43.70],[4.84,45.76],[-0.58,44.84]],
  UK:[[-0.13,51.51],[-3.19,55.95],[-2.24,53.48],[-1.26,51.75]],
  ES:[[-3.70,40.42],[2.17,41.39],[-5.98,37.39],[-0.38,39.47]],
  IT:[[12.50,41.90],[12.32,45.44],[11.26,43.77],[9.19,45.46]],
  BR:[[-47.88,-15.79],[-43.17,-22.91],[-46.63,-23.55],[-60.02,-3.12]],
  MX:[[-99.13,19.43],[-86.85,21.16],[-101.26,21.02],[-103.35,20.67]],
  US:[[-77.04,38.91],[-74.01,40.71],[-118.24,34.05],[-122.42,37.77]],
  CA:[[-75.70,45.42],[-79.38,43.65],[-123.12,49.28],[-71.21,46.81]],
  VN:[[105.85,21.03],[107.08,20.95],[108.33,15.88],[106.70,10.78]],
  TH:[[100.50,13.76],[100.57,14.35],[98.99,18.79],[98.39,7.88]],
  SG:[[103.85,1.29],[103.86,1.28],[103.83,1.25],[103.84,1.28]],
  NZ:[[174.78,-41.29],[174.76,-36.85],[176.25,-38.14],[168.66,-45.03]],
  AE:[[54.37,24.45],[55.27,25.20],[55.41,25.35],[55.76,24.21]],
  EG:[[31.24,30.04],[29.92,31.20],[32.64,25.69],[32.90,24.09]],

  KE:[[36.82,-1.29],[36.07,-0.30],[35.14,-1.49],[39.67,-4.04]],
  ZA:[[28.19,-25.75],[28.05,-26.20],[31.02,-29.86],[18.42,-33.92]],
  NG:[[7.40,9.06],[8.52,12.00],[3.38,6.52],[8.33,4.95]],
  GR:[[23.73,37.98],[22.94,40.64],[21.63,37.64],[25.43,36.39]],
  SE:[[18.07,59.33],[17.64,59.86],[20.23,67.86],[11.97,57.71]],
  AR:[[-58.38,-34.60],[-54.58,-25.60],[-68.30,-54.80],[-68.84,-32.89]],
  CL:[[-70.67,-33.45],[-71.63,-33.05],[-68.20,-22.91],[-109.35,-27.11]]
};
var START = [139.2, 37.8];   // 起点在东京附近
var HEX = ["#993556", "#185fa5"];   // yueyue 粉、姐姐蓝（和 PK 一样）
var world = null, loading = false, PTS = null, keys = {};

function st(){ return window.MONO ? window.MONO.st() : null; }
function col(id){ return HEX[PROFILES.findIndex(function(p){ return p.id === id; }) === 0 ? 0 : 1]; }
function h(s){ return typeof esc === "function" ? esc(String(s)) : String(s); }

function coord(s, i){
  var b = s.B[i];
  if (b.t !== "sp") return XY[s.C[b.c].id][b.t === "cap" ? 0 : b.j + 1];
  if (b.k === "START") return START;
  var p = i, n = i;
  do { p = (p - 1 + s.N) % s.N; } while (s.B[p].t === "sp" && s.B[p].k !== "START");
  do { n = (n + 1) % s.N; } while (s.B[n].t === "sp" && s.B[n].k !== "START");
  return d3.geoInterpolate(coord(s, p), coord(s, n))(0.5);
}
function points(s){
  if (!PTS || PTS.length !== s.N) { PTS = []; for (var i = 0; i < s.N; i++) PTS.push(coord(s, i)); }
  return PTS;
}

function loadWorld(){
  if (world || loading || !window.d3 || !window.topojson) return;

  loading = true;
  fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
    .then(function(r){ return r.json(); })
    .then(function(w){ world = topojson.feature(w, w.objects.countries); keys = {}; })
    .catch(function(e){ console.error(e); });
}

// 赛跑条：谁领先
function race(s){
  var ids = [s.me, s.other], P = [s.M, s.O];
  var prog = P.map(function(x){ return x ? x.laps * s.N + x.pos : 0; });
  var mx = Math.max(prog[0], prog[1], 1);
  var rows = ids.map(function(id, k){
    var x = P[k];
    return '<div class="pkrow"><div class="pkname"><span><b style="color:' + col(id) + '">' + h(nameOf(id)) + '</b></span><span class="muted">' +
      (x ? '第 ' + (x.laps + 1) + ' 圈 · ' + s.tileName(x.pos) + ' · 共走 ' + prog[k] + ' 格 · 🎲 ' + x.dice + ' 次' : '还没出发') + '</span></div>' +
      '<div class="pkbar"><div style="width:' + Math.round(prog[k] / mx * 100) + '%;background:' + col(id) + '"></div></div></div>';
  }).join("");
  var d = prog[0] - prog[1], msg;
  if (d === 0) msg = "🤝 并驾齐驱！";
  else {
    var lead = d > 0 ? s.me : s.other, gap = Math.abs(d);
    msg = "🏃 " + h(nameOf(lead)) + " 领先 " + gap + " 格（大约 " + Math.ceil(gap / 7) + " 次骰子）";
  }
  return rows + '<div class="pkmsg">' + msg + '</div>';
}

function svg(s){
  if (!window.d3) return '<div class="muted">地图加载中…</div>';
  var W = 960, H = 480;
  var proj = d3.geoNaturalEarth1().fitSize([W, H], {type:"Sphere"}), path = d3.geoPath(proj), pts = points(s);
  var out = '<svg viewBox="0 0 ' + W + ' ' + H + '" style="width:100%;height:auto;display:block;background:#eef5fb;border-radius:10px;margin-top:8px">';

  if (world) out += '<path d="' + path(world) + '" fill="#e4e1d8" stroke="#ffffff" stroke-width="0.5"/>';
  var loop = {type:"LineString", coordinates:pts.concat([pts[0]])};
  out += '<path d="' + path(loop) + '" fill="none" stroke="#8a8a8a" stroke-width="1.2" stroke-dasharray="4 4"/>';
  [[s.other, s.O], [s.me, s.M]].forEach(function(x){
    var P = x[1]; if (!P) return;
    // 已经绕完至少一圈：整条路线用淡色铺一遍
    if (P.laps > 0) out += '<path d="' + path(loop) + '" fill="none" stroke="' + col(x[0]) + '" stroke-width="2" opacity="0.25"/>';
    if (P.pos < 1) return;
    out += '<path d="' + path({type:"LineString", coordinates:pts.slice(0, P.pos + 1)}) + '" fill="none" stroke="' + col(x[0]) + '" stroke-width="3.5" stroke-linecap="round" opacity="0.8"/>';
  });
  s.C.forEach(function(c, ci){
    if (!XY[c.id]) return;
    var ow = s.owner(ci), p = proj(XY[c.id][0]);
    out += '<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="' + (ow ? 7 : 4) + '" fill="' + (ow ? col(ow) : "#ffffff") + '" stroke="#444" stroke-width="1"><title>' +
      h(c.f + " " + c.cap.n + (ow ? "（" + nameOf(ow) + "）" : "（还没人买）")) + '</title></circle>';
  });
  var sp = proj(START);
  out += '<text x="' + (sp[0] + 8).toFixed(1) + '" y="' + (sp[1] - 8).toFixed(1) + '" font-size="18">🏁</text>';
  var same = s.O && s.M.pos === s.O.pos;
  [[s.other, s.O, same ? 9 : 0], [s.me, s.M, same ? -9 : 0]].forEach(function(x){
    var P = x[1]; if (!P) return;
    var p = proj(pts[P.pos]), cx = p[0] + x[2], cy = p[1] - 14;
    out += '<line x1="' + p[0].toFixed(1) + '" y1="' + p[1].toFixed(1) + '" x2="' + cx.toFixed(1) + '" y2="' + cy.toFixed(1) + '" stroke="' + col(x[0]) + '" stroke-width="2"/>' +
      '<circle cx="' + cx.toFixed(1) + '" cy="' + cy.toFixed(1) + '" r="13" fill="' + col(x[0]) + '" stroke="#fff" stroke-width="2.5"/>' +
      '<text x="' + cx.toFixed(1) + '" y="' + (cy + 5).toFixed(1) + '" text-anchor="middle" font-size="14" fill="#fff" font-weight="bold">' + h(nameOf(x[0]).slice(0, 1)) + '</text>';
  });
  return out + '</svg>';
}

function keyOf(s){
  var own = s.C.map(function(_, ci){ return s.owner(ci) || "-"; }).join(",");
  return [s.M.pos, s.M.laps, s.M.dice, s.O ? s.O.pos : "", s.O ? s.O.laps : "", s.O ? s.O.dice : "", own, !!world, s.me].join("|");

}
function paint(el, s, title){
  var k = keyOf(s);
  if (keys[el.id] === k && el.innerHTML) return;
  keys[el.id] = k;
  el.innerHTML = (title ? '<h3 style="margin-top:0">🗺️ 环游世界大富翁</h3>' : '') + race(s) + svg(s) +
    '<div class="muted" style="margin-top:6px">深色粗线＝这一圈走过的路，淡色线＝已经绕完的圈，大圆点＝已经被买下的首都（颜色＝主人），🏁＝起点（东京出发）。</div>';
}

setInterval(function(){
  var s = st(); if (!s) return;
  loadWorld();
  var card = document.getElementById("mono-card");
  if (card) {
    var m = document.getElementById("mono-map");
    if (!m) { m = document.createElement("div"); m.id = "mono-map"; m.className = "card"; }
    if (m.previousElementSibling !== card) card.parentNode.insertBefore(m, card.nextSibling);
    m.classList.remove("hidden");
    if (m.style.display === "none") m.style.display = "";
    paint(m, s, true);
  }
  var strip = document.getElementById("mono-strip");
  if (strip) {
    var m2 = document.getElementById("mono-map2");
    if (!m2) { m2 = document.createElement("div"); m2.id = "mono-map2"; strip.parentNode.insertBefore(m2, strip.nextSibling); }
    paint(m2, s, false);
  }
}, 1500);

})();
