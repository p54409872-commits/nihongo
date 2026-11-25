// review.js — 综合测试：错过的题 + 各课复习 + 后面课的挑战题
// 需要在 joshi.js、listen.js 之后加载（用它们的题库 JOSHIQ、WORDS2、LISTENQ）
(function(){

// 助词题对应的课（joshi.js 里有 JOSHI_L 就用它的）
var JL = window.JOSHI_L || [1,2,2,3,1,4,4,4,5,5,5,6,6,9,9,10,10,23,13,16,16,7,7,10,12,9,13,10,6,15,14,29,29,7,9,13,4,22,17,11,16];
var PRAISE = [["すごい！","真厉害"],["いいね！","好棒"],["せいかい！","答对了"],["やった！","太好了"],["そのちょうし！","保持这个状态"],["かんぺき！","完美"]];
var COMFORT = ["没关系，记住它就好～","错了才记得牢！","再看一遍，下次一定对。","慢慢来，每题都算数。"];
var T = {R:0, list:[], i:0, ans:[], answered:false, streak:0, manual:false};

function esc(t){ return String(t).replace(/[&<>"]/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]; }); }
function shuf(a){ for (var i=a.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)); var t=a[i]; a[i]=a[j]; a[j]=t; } return a; }
function pick(a){ return a[Math.floor(Math.random()*a.length)]; }

// ---------- 进度读写（和 listen.js、joshi.js 用同一份数据） ----------
var DEF = {
  wordgame: function(){ return {done:0, ok:0, wrong:{}, best:0}; },
  joshi:    function(){ return {done:0, ok:0, wrong:{}}; },
  review:   function(){ return {wrong:{}, tests:[]}; }
};
function rd(name){
  if (window.S && typeof S === "object") {
    if (!S[name]) S[name] = DEF[name]();
    if (!S[name].wrong) S[name].wrong = {};
    return S[name];
  }
  var o = null;
  try { o = JSON.parse(localStorage.getItem("jp-" + name)); } catch(e){}
  o = o || DEF[name]();
  if (!o.wrong) o.wrong = {};
  return o;
}

function wr(name, o){
  if (window.S && typeof S === "object") { if (typeof window.save === "function") window.save(); }
  else { try { localStorage.setItem("jp-" + name, JSON.stringify(o)); } catch(e){} }
}

function curLesson(){
  var sels = document.querySelectorAll("#main select"), lesson = 0, adv = false;
  for (var i = 0; i < sels.length; i++) {
    var o = sels[i].options[sels[i].selectedIndex], t = o ? o.text : "";
    if (/进阶/.test(t)) adv = true;
    var m = t.match(/第\s*(\d+)\s*课/);
    if (m && !lesson) lesson = +m[1];
  }
  return adv ? 0 : lesson;
}

// ---------- 题库 ----------
function W(){ return window.WORDS2 || []; }
function L(){ return window.LISTENQ || []; }
function J(){ return window.JOSHIQ || []; }
function get(k){
  var t = k[0], n = +k.slice(1);
  if (t === "w") { var w = W()[n]; return w ? {kana:w[0], ja:w[1] || w[0], zh:w[2], l:w[3]} : null; }
  if (t === "s") { var s = L()[n]; return s ? {kana:s[0], ja:s[0], zh:s[1], l:s[2]} : null; }
  if (t === "j") { var q = J()[n]; return q ? {q:q, kana:q.s.replace("＿", q.a), ja:q.s.replace("＿", q.a), zh:q.zh, l:JL[n] || 1} : null; }
  return null;
}
function allKeys(){
  return W().map(function(_, i){ return "w" + i; })
    .concat(L().map(function(_, i){ return "s" + i; }))
    .concat(J().map(function(_, i){ return "j" + i; }));
}

function maxL(){
  var m = 1;
  allKeys().forEach(function(k){ var g = get(k); if (g && g.l > m && k[0] !== "j") m = g.l; });
  return m;
}
function show(g){ return g.ja === g.kana ? esc(g.ja) : esc(g.ja) + '<span class="muted">（' + esc(g.kana) + '）</span>'; }

function dirFor(k, tag){
  if (k[0] === "j") return "joshi";
  if (k[0] === "s") return "listen";
  if (tag === "pre") return pick(["ja2zh", "listen"]);
  return pick(["ja2zh", "zh2ja", "listen", "listenKana"]);
}

// 出卷：错过的（最多6）→ 各课轮流复习（补到16）→ 后面1～2课的挑战题（4）
function build(R){
  var keys = allKeys().filter(function(k){ return get(k); });
  var used = {}, main = [], pre = [];
  function add(arr, k, tag){ if (used[k]) return; used[k] = 1; arr.push({k:k, tag:tag, dir:dirFor(k, tag)}); }

  var weak = [];
  Object.keys(rd("wordgame").wrong).forEach(function(x){ var k = x.split(":")[1]; if (k) weak.push(k); });
  Object.keys(rd("joshi").wrong).forEach(function(n){ weak.push("j" + n); });
  Object.keys(rd("review").wrong).forEach(function(k){ weak.push(k); });
  shuf(weak.filter(function(k){ var g = get(k); return g && g.l <= R; }))
    .forEach(function(k){ if (main.length < 6) add(main, k, "weak"); });

  var byL = {};
  keys.forEach(function(k){ var l = get(k).l; if (l <= R) (byL[l] = byL[l] || []).push(k); });
  var ls = Object.keys(byL);
  ls.forEach(function(l){ shuf(byL[l]); });
  for (var guard = 0; main.length < 16 && guard < 200; guard++) {

    var any = false;
    shuf(ls).forEach(function(l){
      while (main.length < 16 && byL[l].length) {
        var k = byL[l].pop();
        if (!used[k]) { add(main, k, "rev"); any = true; break; }
      }
    });
    if (!any) break;
  }

  shuf(keys.filter(function(k){ var l = get(k).l; return k[0] !== "j" && l > R && l <= R + 2; }))
    .slice(0, 4).forEach(function(k){ add(pre, k, "pre"); });

  return shuf(main).concat(pre);
}

function distract(k, g, field){
  var t = k[0], lim = T.R + 2;
  var ok = function(x){ var h = get(x); return x !== k && x[0] === t && h && h[field] !== g[field]; };
  var near = allKeys().filter(function(x){ return ok(x) && get(x).l <= lim; });
  var src = near.length >= 3 ? near : allKeys().filter(ok);
  var seen = {}, out = [];
  shuf(src).forEach(function(x){ var v = get(x)[field]; if (!seen[v] && out.length < 3) { seen[v] = 1; out.push(x); } });
  return out;
}

// ---------- 发音 / 动画 ----------
function say(t, slow){
  if (!window.speechSynthesis) return;
  speechSynthesis.cancel();
  var u = new SpeechSynthesisUtterance(t);
  u.lang = "ja-JP"; u.rate = slow ? 0.6 : 0.9;

  var v = (speechSynthesis.getVoices() || []).filter(function(v){ return /ja[-_]JP/i.test(v.lang); })[0];
  if (v) u.voice = v;
  speechSynthesis.speak(u);
}
function burst(n){
  var em = ["🌸","⭐","🎉","✨","💮","🌟"];
  for (var i = 0; i < n; i++) {
    var s = document.createElement("span");
    s.className = "ws-p"; s.textContent = pick(em);
    s.style.left = (5 + Math.random() * 90) + "%";
    s.style.setProperty("--r", (Math.random() * 720 - 360) + "deg");
    s.style.animationDelay = (Math.random() * 0.4) + "s";
    document.body.appendChild(s);
    setTimeout((function(x){ return function(){ x.remove(); }; })(s), 2400);
  }
}

// ---------- 窗口 ----------
function panel(){
  var ov = document.getElementById("rv-ov");
  if (!ov) {
    ov = document.createElement("div");
    ov.id = "rv-ov";
    ov.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,.35);z-index:9000;overflow:auto;padding:16px";
    ov.innerHTML = '<div class="card" id="rv-box" style="max-width:640px;margin:20px auto"></div>';
    document.body.appendChild(ov);
  }
  return document.getElementById("rv-box");
}
function closePanel(){
  if (window.speechSynthesis) speechSynthesis.cancel();
  var ov = document.getElementById("rv-ov"); if (ov) ov.remove();

}

function openTest(){ T.manual = false; menu(); }

function menu(){
  var cur = curLesson(), top = maxL();
  if (!T.manual) T.R = cur ? Math.min(cur, top) : top;
  var tests = rd("review").tests || [];
  var opts = "";
  for (var l = 1; l <= top; l++) opts += '<option value="' + l + '">第 1～' + l + ' 课</option>';
  var hist = tests.slice(-3).reverse().map(function(t){
    return '<div class="muted">' + t.d + '　第1～' + t.r + '课　' + t.s + ' / ' + t.n + (t.bn ? '　挑战 ' + t.b + ' / ' + t.bn : '') + '</div>';
  }).join("");
  panel().innerHTML =
    '<div class="qhead">🏁 综合测试</div>' +
    '<div class="row">范围：<select id="rv-range">' + opts + '</select></div>' +
    '<div class="muted">一共约 20 题：先出你之前错过的题，再从每一课轮流抽复习题，最后 4 题是后面一两课的新内容（挑战题，不算分）。</div>' +
    (hist ? '<h3>最近的成绩</h3>' + hist : '') +
    '<div class="btns"><button class="btn main" id="rv-go">开始测试</button><button class="btn" id="rv-close">关闭</button></div>';
  var sel = document.getElementById("rv-range");
  sel.value = String(T.R);
  sel.onchange = function(){ T.R = +sel.value; T.manual = true; };
  document.getElementById("rv-go").onclick = start;
  document.getElementById("rv-close").onclick = closePanel;
}

function start(){
  T.list = build(T.R); T.i = 0; T.ans = []; T.answered = false; T.streak = 0;
  render();
}

function render(){

  var box = panel();
  if (T.i >= T.list.length) { report(); return; }
  var it = T.list[T.i], k = it.k, g = get(k), dir = it.dir, head, opts;
  var tag = it.tag === "weak" ? '<span class="lbl">🔁 之前错过的</span>' :
            it.tag === "pre"  ? '<span class="lbl" style="background:var(--blue-bg);color:var(--blue)">🔭 挑战：后面的新内容</span>' : '';

  if (dir === "joshi") {
    var q = g.q;
    it.correct = q.a;
    head = '<div class="qhead">选出正确的助词</div><div class="box"><span class="big">' + esc(q.s).replace("＿", '<span class="blank">　</span>') + '</span></div>';
    opts = shuf(q.o.slice()).map(function(o){ return '<button class="opt" data-v="' + esc(o) + '">' + esc(o) + '</button>'; }).join("");
  } else {
    var field = dir === "listenKana" ? "kana" : "zh";
    var ks = shuf([k].concat(distract(k, g, field)));
    it.correct = k;
    if (dir === "listen" || dir === "listenKana") {
      head = '<div class="qhead">' + (dir === "listen" ? "听一听，选出意思" : "听一听，选出听到的写法") + '</div>' +
             '<div class="btns"><button class="btn main" id="rv-play">🔊 播放</button><button class="btn" id="rv-slow">🐢 慢速</button></div>';
      opts = ks.map(function(x){ return '<button class="opt" data-v="' + x + '">' + esc(dir === "listen" ? get(x).zh : get(x).kana) + '</button>'; }).join("");
    } else if (dir === "ja2zh") {
      head = '<div class="qhead">这个是什么意思？</div><div class="box"><span class="big">' + show(g) + '</span> <button class="mini" id="rv-play">🔊</button></div>';
      opts = ks.map(function(x){ return '<button class="opt" data-v="' + x + '">' + esc(get(x).zh) + '</button>'; }).join("");
    } else {
      head = '<div class="qhead">日语怎么说？</div><div class="box"><span class="big">' + esc(g.zh) + '</span></div>';
      opts = ks.map(function(x){ return '<button class="opt" data-v="' + x + '">' + show(get(x)) + '</button>'; }).join("");
    }
  }

  box.innerHTML =
    '<div class="qtop">🏁 综合测试 · 第1～' + T.R + '课 · ' + (T.i + 1) + ' / ' + T.list.length + ' · 第' + g.l + '课' +
    (T.streak >= 2 ? '<span class="ws-streak">🔥×' + T.streak + '</span>' : '') + '</div>' +
    tag + head + opts + '<div id="rv-fb"></div>' +

    '<div class="btns"><button class="link" id="rv-quit">中途退出</button></div>';

  var p = document.getElementById("rv-play"); if (p) p.onclick = function(){ say(g.kana); };
  var s = document.getElementById("rv-slow"); if (s) s.onclick = function(){ say(g.kana, true); };
  document.getElementById("rv-quit").onclick = menu;
  box.querySelectorAll(".opt").forEach(function(b){ b.onclick = function(){ answer(b, it, g); }; });
  if (dir === "listen" || dir === "listenKana") say(g.kana);
}

// 错题写回各自的错题本；之前错过、这次答对的减一次
function markWrong(it){
  if (it.k[0] === "j") { var js = rd("joshi"); js.wrong[it.k.slice(1)] = 2; wr("joshi", js); }
  else {
    var wg = rd("wordgame");
    var kind = (it.dir === "ja2zh" || it.dir === "zh2ja") ? "word" : "listen";
    wg.wrong[kind + ":" + it.k] = 2; wr("wordgame", wg);
  }
}
function markRight(it){
  if (it.k[0] === "j") {
    var js = rd("joshi"), n = it.k.slice(1);
    if (js.wrong[n] && --js.wrong[n] <= 0) delete js.wrong[n];
    wr("joshi", js);
  } else {
    var wg = rd("wordgame");
    ["word:", "listen:"].forEach(function(p){ var key = p + it.k; if (wg.wrong[key] && --wg.wrong[key] <= 0) delete wg.wrong[key]; });
    wr("wordgame", wg);
  }
  var rv = rd("review"); if (rv.wrong[it.k]) { delete rv.wrong[it.k]; wr("review", rv); }
}

function answer(b, it, g){

  if (T.answered) return; T.answered = true;
  var ok = b.dataset.v === it.correct;
  T.ans.push({k:it.k, tag:it.tag, dir:it.dir, ok:ok});
  var lost = 0;
  if (ok) { T.streak++; if (it.tag === "weak") markRight(it); }
  else { lost = T.streak; T.streak = 0; if (it.tag !== "pre") markWrong(it); }

  panel().querySelectorAll(".opt").forEach(function(x){
    x.disabled = true;
    if (x.dataset.v === it.correct) x.classList.add("right"); else if (x === b) x.classList.add("wrong");
  });

  var top;
  if (ok) {
    var pr = pick(PRAISE);
    var ms = T.streak >= 10 && T.streak % 5 === 0 ? "👑 连对 " + T.streak + " 题！你太强了！" :
             T.streak === 5 ? "🌟 连对 5 题！太厉害了！" :
             T.streak === 3 ? "🔥 连对 3 题！手感来了！" : "";
    if (it.tag === "pre") ms = "🔭 还没学到的也答对了！" + (ms ? " " + ms : "");
    top = '<div class="ok-h ws-pop">✅ ' + pr[0] + ' <span class="muted">' + pr[1] + '</span></div>' +
          (ms ? '<div class="celebrate ws-pop">' + ms + '</div>' : '');
    burst(ms ? 26 : 6);
  } else {
    top = it.tag === "pre"
      ? '<div class="ng-h">这是后面才学的，先认识一下 😊</div>'
      : '<div class="ng-h">❌ 差一点点</div><div class="comfort">' + pick(COMFORT) + (lost >= 3 ? ' 刚才连对了 ' + lost + ' 题，已经很棒了！' : '') + '</div>';
  }
  var body = it.dir === "joshi"
    ? '<span style="font-size:18px">' + esc(g.ja) + '</span><br>' + esc(g.zh) + '<br>' + esc(g.q.e)
    : '<span style="font-size:18px">' + show(g) + '</span><br>' + esc(g.zh) + ' <button class="mini" id="rv-again">🔊 再听</button>';

  document.getElementById("rv-fb").innerHTML = top + '<div class="note">' + body + '</div>' +

    '<div class="btns"><button class="btn main" id="rv-next">下一题</button></div>';
  var ag = document.getElementById("rv-again"); if (ag) ag.onclick = function(){ say(g.kana); };
  document.getElementById("rv-next").onclick = function(){ T.i++; T.answered = false; render(); };
}

function report(){
  var main = T.ans.filter(function(a){ return a.tag !== "pre"; });
  var pre = T.ans.filter(function(a){ return a.tag === "pre"; });
  var s = main.filter(function(a){ return a.ok; }).length, n = main.length;
  var b = pre.filter(function(a){ return a.ok; }).length, r = n ? s / n : 0;
  var stars = r >= 0.9 ? "⭐⭐⭐" : r >= 0.7 ? "⭐⭐" : r >= 0.5 ? "⭐" : "💪";
  var msg = r >= 0.9 ? "太厉害了！前面学的都记得牢牢的！" : r >= 0.7 ? "很棒！把弱的那几课再练练就满分了" : r >= 0.5 ? "不错哦，下面红点多的课回去再练一下" : "没关系，测试就是为了找出要复习的地方～";

  // 每课小圆点
  var byL = {};
  main.forEach(function(a){ var l = get(a.k).l; (byL[l] = byL[l] || []).push(a.ok); });
  var rows = Object.keys(byL).sort(function(x, y){ return x - y; }).map(function(l){
    var arr = byL[l], c = arr.filter(Boolean).length;
    return '<div class="row">第 ' + l + ' 课　' + arr.map(function(o){ return o ? "🟢" : "🔴"; }).join("") + ' <span class="muted">' + c + '/' + arr.length + '</span></div>';
  }).join("");
  var weakL = Object.keys(byL).filter(function(l){ var a = byL[l]; return a.length >= 2 && a.filter(Boolean).length / a.length < 0.6; });

  // 各题型正确率
  var ty = {};
  main.forEach(function(a){
    var t = a.dir === "joshi" ? "助词" : (a.dir === "listen" || a.dir === "listenKana") ? "听力" : "单词";
    ty[t] = ty[t] || [0, 0]; ty[t][1]++; if (a.ok) ty[t][0]++;
  });
  var tyHtml = Object.keys(ty).map(function(t){ return t + ' ' + ty[t][0] + '/' + ty[t][1]; }).join("　");

  // 错题列表
  var wrong = T.ans.filter(function(a){ return !a.ok; });

  var wHtml = wrong.map(function(a, i){
    var g = get(a.k);
    return '<div class="ex">' + (a.tag === "pre" ? '🔭 ' : '') + '<span class="exja">' + (a.k[0] === "j" ? esc(g.ja) : show(g)) + '</span> — ' + esc(g.zh) +
      ' <button class="mini" data-say="' + i + '">🔊</button></div>';
  }).join("");

  // 保存记录
  var rv = rd("review");
  rv.tests = (rv.tests || []).concat([{d: new Date().toISOString().slice(0, 10), r: T.R, s: s, n: n, b: b, bn: pre.length}]).slice(-20);
  wr("review", rv);

  panel().innerHTML =
    '<div class="celebrate ws-pop" style="text-align:center;font-size:18px"><div style="font-size:36px">' + stars + '</div>' +
    '第 1～' + T.R + ' 课综合测试：' + s + ' / ' + n + (pre.length ? '<br>🔭 挑战题 ' + b + ' / ' + pre.length : '') + '<br>' + msg + '</div>' +
    '<h3>每一课的情况</h3>' + rows +
    (weakL.length ? '<div class="hint">建议回去再练：' + weakL.map(function(l){ return "第" + l + "课"; }).join("、") + '</div>' : '<div class="cheer">每一课都掌握得不错！</div>') +
    '<h3>题型</h3><div>' + tyHtml + '</div>' +
    (wrong.length ? '<h3>这次的错题（已经加进错题本）</h3>' + wHtml : '<div class="cheer">一题都没错！</div>') +
    '<div class="btns"><button class="btn main" id="rv-again2">再测一次</button><button class="btn" id="rv-close2">关闭</button></div>';

  panel().querySelectorAll("[data-say]").forEach(function(x){
    x.onclick = function(){ say(get(wrong[+x.dataset.say].k).kana); };
  });
  document.getElementById("rv-again2").onclick = menu;
  document.getElementById("rv-close2").onclick = closePanel;
  if (r >= 0.7) burst(r >= 0.9 ? 40 : 20);
}

// ---------- 入口 ----------
// 每学完 5 课提醒一次（前5课、前10课……），做过那个阶段的测试就不再提醒
function milestone(){
  var cur = curLesson(); if (!cur) return 0;

  var M = Math.floor((cur - 1) / 5) * 5; if (M < 5) return 0;
  var tests = rd("review").tests || [];
  return tests.some(function(t){ return t.r > M; }) ? 0 : M;
}
function ensure(){
  // 在每一组「🎧 听力 / 📖 单词」按钮旁边加「🏁 综合测试」
  document.querySelectorAll('[data-ws="word"]').forEach(function(w){
    var host = w.parentNode;
    if (!host.querySelector("[data-rv]")) {
      var b = document.createElement("button");
      b.dataset.rv = "1"; b.className = w.className; b.textContent = "🏁 综合测试";
      b.onclick = function(e){ e.preventDefault(); e.stopPropagation(); openTest(); };
      host.appendChild(b);
    }
  });
  // 闯关模式：学完 5 的倍数课时，在助词卡片顶上出现提醒横幅
  var entry = document.getElementById("joshi-entry");
  if (entry) {
    var bn = document.getElementById("rv-banner"), M = milestone();
    if (M) {
      if (!bn) {
        bn = document.createElement("div");
        bn.id = "rv-banner"; bn.className = "celebrate"; bn.style.cursor = "pointer";
        bn.onclick = openTest;
        entry.insertBefore(bn, entry.firstChild);
      }
      bn.textContent = "🎉 前 " + M + " 课都学完了！点这里来一次综合测试吧";
    } else if (bn) bn.remove();
  }
}
setInterval(ensure, 1000);
ensure();

})();
