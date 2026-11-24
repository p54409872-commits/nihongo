// listen.js — 小游戏：听力 + 单词（独立模块）
// WORDS2、LISTENQ 只能在最后追加，不能删、不能调换顺序（错题按位置记录）
(function(){

// 单词：[假名, 汉字(没有就留空), 中文, 第几课]
window.WORDS2 = [
["わたし","私","我",1],["せんせい","先生","老师",1],["がくせい","学生","学生",1],
["かいしゃいん","会社員","公司职员",1],["いしゃ","医者","医生",1],["だいがく","大学","大学",1],
["びょういん","病院","医院",1],["だれ","","谁",1],["なんさい","何歳","几岁",1],
["ほん","本","书",2],["じしょ","辞書","词典",2],["ざっし","雑誌","杂志",2],
["しんぶん","新聞","报纸",2],["かぎ","鍵","钥匙",2],["とけい","時計","钟表",2],
["かさ","傘","伞",2],["くるま","車","汽车",2],["つくえ","机","桌子",2],["いす","椅子","椅子",2],
["ここ","","这里",3],["そこ","","那里（离对方近）",3],["あそこ","","那边（离双方都远）",3],
["どこ","","哪里",3],["きょうしつ","教室","教室",3],["しょくどう","食堂","食堂",3],
["うけつけ","受付","前台",3],["くに","国","国家",3],["いくら","","多少钱",3],
["いま","今","现在",4],["おきます","起きます","起床",4],["ねます","寝ます","睡觉",4],
["はたらきます","働きます","工作",4],["やすみます","休みます","休息",4],
["べんきょうします","勉強します","学习",4],["あさ","朝","早上",4],["ばん","晩","晚上",4],
["きょう","今日","今天",4],["あした","明日","明天",4],["きのう","昨日","昨天",4],
["いきます","行きます","去",5],["きます","来ます","来",5],["かえります","帰ります","回去",5],
["がっこう","学校","学校",5],["えき","駅","车站",5],["でんしゃ","電車","电车",5],
["ひこうき","飛行機","飞机",5],["ともだち","友達","朋友",5],["ひとりで","一人で","一个人",5],
["たべます","食べます","吃",6],["のみます","飲みます","喝",6],["みます","見ます","看",6],
["ききます","聞きます","听",6],["よみます","読みます","读",6],["かきます","書きます","写",6],
["かいます","買います","买",6],["しゃしん","写真","照片",6],["みず","水","水",6],
["あげます","","给（别人）",7],["もらいます","","得到、收到",7],["おしえます","教えます","教",7],
["ならいます","習います","学（跟人学）",7],["おくります","送ります","寄、送",7],
["おおきい","大きい","大",8],["ちいさい","小さい","小",8],["あたらしい","新しい","新",8],
["ふるい","古い","旧",8],["たかい","高い","贵；高",8],["やすい","安い","便宜",8],
["おいしい","","好吃",8],["しずか","静か","安静",8],["げんき","元気","有精神、健康",8],
["すき","好き","喜欢",9],["きらい","嫌い","讨厌",9],["じょうず","上手","擅长",9],
["わかります","分かります","懂",9],["おんがく","音楽","音乐",9],

["うえ","上","上面",10],["した","下","下面",10],["まえ","前","前面",10],
["うしろ","後ろ","后面",10],["なか","中","里面",10],["いぬ","犬","狗",10],
["ねこ","猫","猫",10],["き","木","树",10]
];

// 听力句子：[日语, 中文, 第几课]
window.LISTENQ = [
["わたしは がくせいです。","我是学生。",1],
["あの ひとは だれですか。","那个人是谁？",1],
["これは なんですか。","这是什么？",2],
["それは わたしの かさです。","那是我的伞。",2],
["トイレは どこですか。","厕所在哪里？",3],
["これは いくらですか。","这个多少钱？",3],
["いま なんじですか。","现在几点？",4],
["まいあさ ろくじに おきます。","每天早上六点起床。",4],
["あした きょうとへ いきます。","明天去京都。",5],
["でんしゃで がっこうへ いきます。","坐电车去学校。",5],
["いっしょに ひるごはんを たべませんか。","一起吃午饭好吗？",6],
["えきで しんぶんを かいます。","在车站买报纸。",6],
["ともだちに はなを あげました。","送了朋友花。",7],
["この りょうりは おいしいです。","这道菜很好吃。",8],
["わたしは いぬが すきです。","我喜欢狗。",9],
["つくえの うえに ねこが います。","桌子上有一只猫。",10]
];

var G = {kind:"", list:[], i:0, score:0, answered:false, maxL:null};

function esc(t){ return String(t).replace(/[&<>"]/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]; }); }
function shuf(a){ for (var i=a.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)); var t=a[i]; a[i]=a[j]; a[j]=t; } return a; }

// 进度：有 S 就存在 S.wordgame（跟着云同步），否则存本机
function store(){

  if (window.S && typeof S === "object") { if (!S.wordgame) S.wordgame = {done:0, ok:0, wrong:{}}; return S.wordgame; }
  try { return JSON.parse(localStorage.getItem("jp-wordgame")) || {done:0, ok:0, wrong:{}}; } catch(e){ return {done:0, ok:0, wrong:{}}; }
}
function persist(st){
  if (window.S && typeof S === "object") { if (typeof window.save === "function") window.save(); }
  else { try { localStorage.setItem("jp-wordgame", JSON.stringify(st)); } catch(e){} }
}

function curLesson(){
  var sels = document.querySelectorAll("#main select");
  for (var i = 0; i < sels.length; i++) {
    var o = sels[i].options[sels[i].selectedIndex];
    var m = o && o.text.match(/第\s*(\d+)\s*课/);
    if (m) return +m[1];
  }
  return 0;
}

// ---------- 发音 ----------
function say(t, slow){
  if (!window.speechSynthesis) { alert("这个浏览器不支持朗读"); return; }
  speechSynthesis.cancel();
  var u = new SpeechSynthesisUtterance(t);
  u.lang = "ja-JP"; u.rate = slow ? 0.6 : 0.9;
  var v = (speechSynthesis.getVoices() || []).filter(function(v){ return /ja[-_]JP/i.test(v.lang); })[0];
  if (v) u.voice = v;
  speechSynthesis.speak(u);
}

// ---------- 题目 ----------
function get(id){
  var n = +id.slice(1);

  if (id[0] === "w") { var w = WORDS2[n]; return {type:"w", kana:w[0], ja:w[1] || w[0], zh:w[2], l:w[3]}; }
  var s = LISTENQ[n]; return {type:"s", kana:s[0], ja:s[0], zh:s[1], l:s[2]};
}
function pool(kind){
  var ids = WORDS2.map(function(_, i){ return "w" + i; });
  if (kind === "listen") ids = ids.concat(LISTENQ.map(function(_, i){ return "s" + i; }));
  return ids.filter(function(id){ return get(id).l <= G.maxL; });
}
function show(it){ return it.ja === it.kana ? esc(it.ja) : esc(it.ja) + '<span class="muted">（' + esc(it.kana) + '）</span>'; }

// ---------- 弹出窗口 ----------
function panel(){
  var ov = document.getElementById("ws-ov");
  if (!ov) {
    ov = document.createElement("div");
    ov.id = "ws-ov";
    ov.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,.35);z-index:9000;overflow:auto;padding:16px";
    ov.innerHTML = '<div class="card" id="ws-box" style="max-width:640px;margin:20px auto"></div>';
    document.body.appendChild(ov);
  }
  return document.getElementById("ws-box");
}
function closePanel(){
  if (window.speechSynthesis) speechSynthesis.cancel();
  var ov = document.getElementById("ws-ov"); if (ov) ov.remove();
}

function openGame(kind){ G.kind = kind; menu(); }

function menu(){
  var st = store(), name = G.kind === "listen" ? "🎧 听力" : "📖 单词";
  if (G.maxL == null) G.maxL = curLesson() || 99;

  var nw = Object.keys(st.wrong).filter(function(k){ return k.indexOf(G.kind + ":") === 0; }).length;
  var top = 10, opts = '<option value="99">全部课</option>';
  for (var l = 1; l <= top; l++) opts += '<option value="' + l + '">学到第 ' + l + ' 课</option>';
  var n = pool(G.kind).length;
  panel().innerHTML =
    '<div class="qhead">' + name + '</div>' +
    '<div class="muted">' + (G.kind === "listen" ? "听日语，选出意思。没声音的话检查一下手机静音键和音量。" : "看日语选中文，或看中文选日语。") + '</div>' +
    '<div class="row">出题范围：<select id="ws-range">' + opts + '</select> <span class="muted">（' + n + ' 题）</span></div>' +
    '<div class="btns">' +
      '<button class="btn main" id="ws-go"' + (n >= 4 ? '' : ' disabled') + '>开始 10 题</button>' +
      '<button class="btn" id="ws-wrong"' + (nw ? '' : ' disabled') + '>错题重练（' + nw + '）</button>' +
      '<button class="btn" id="ws-close">关闭</button>' +
    '</div>';
  var sel = document.getElementById("ws-range");
  sel.value = G.maxL > top ? "99" : String(G.maxL);
  sel.onchange = function(){ G.maxL = +sel.value; menu(); };
  document.getElementById("ws-go").onclick = function(){ start(false); };
  document.getElementById("ws-wrong").onclick = function(){ start(true); };
  document.getElementById("ws-close").onclick = closePanel;
}

function start(wrongOnly){
  if (wrongOnly) {
    var pre = G.kind + ":";
    G.list = shuf(Object.keys(store().wrong).filter(function(k){ return k.indexOf(pre) === 0; })
                  .map(function(k){ return k.slice(pre.length); }));
  } else G.list = shuf(pool(G.kind)).slice(0, 10);
  G.i = 0; G.score = 0; G.answered = false;
  render();
}

function render(){

  var box = panel();
  if (G.i >= G.list.length) {
    menu();
    panel().insertAdjacentHTML("afterbegin", '<div class="celebrate">本轮结束：' + G.score + ' / ' + G.list.length + '</div>');
    return;
  }
  var id = G.list[G.i], it = get(id);
  // 干扰项：同类型（单词配单词，句子配句子）
  var others = shuf(WORDS2.map(function(_, i){ return "w" + i; }).concat(LISTENQ.map(function(_, i){ return "s" + i; }))
    .filter(function(x){ return x !== id && x[0] === id[0] && get(x).zh !== it.zh; })).slice(0, 3);
  var dir = G.kind === "listen" ? "listen" : (Math.random() < 0.5 ? "ja2zh" : "zh2ja");
  var opts = shuf([id].concat(others));
  var head, optHtml;

  if (dir === "listen") {
    head = '<div class="qhead">听一听，选出意思</div>' +
           '<div class="btns"><button class="btn main" id="ws-play">🔊 播放</button><button class="btn" id="ws-slow">🐢 慢速</button></div>';
    optHtml = opts.map(function(o){ return '<button class="opt" data-id="' + o + '">' + esc(get(o).zh) + '</button>'; }).join("");
  } else if (dir === "ja2zh") {
    head = '<div class="qhead">这个是什么意思？</div><div class="box"><span class="big">' + show(it) + '</span> <button class="mini" id="ws-play">🔊</button></div>';
    optHtml = opts.map(function(o){ return '<button class="opt" data-id="' + o + '">' + esc(get(o).zh) + '</button>'; }).join("");
  } else {
    head = '<div class="qhead">日语怎么说？</div><div class="box"><span class="big">' + esc(it.zh) + '</span></div>';
    optHtml = opts.map(function(o){ return '<button class="opt" data-id="' + o + '">' + show(get(o)) + '</button>'; }).join("");
  }

  box.innerHTML =
    '<div class="qtop">' + (G.kind === "listen" ? "🎧 听力" : "📖 单词") + ' · 第' + it.l + '课 · ' + (G.i + 1) + ' / ' + G.list.length + '</div>' +
    head + optHtml + '<div id="ws-fb"></div>' +
    '<div class="btns"><button class="link" id="ws-quit">结束返回</button></div>';

  var p = document.getElementById("ws-play"); if (p) p.onclick = function(){ say(it.kana); };

  var s = document.getElementById("ws-slow"); if (s) s.onclick = function(){ say(it.kana, true); };
  document.getElementById("ws-quit").onclick = menu;
  box.querySelectorAll(".opt").forEach(function(b){ b.onclick = function(){ answer(b, id, it); }; });
  if (dir === "listen") say(it.kana);
}

function answer(b, id, it){
  if (G.answered) return; G.answered = true;
  var ok = b.dataset.id === id, st = store(), key = G.kind + ":" + id;
  st.done++;
  if (ok) { st.ok++; G.score++; if (st.wrong[key] && --st.wrong[key] <= 0) delete st.wrong[key]; }
  else st.wrong[key] = 2;   // 错题要连续答对 2 次才移出
  persist(st);
  panel().querySelectorAll(".opt").forEach(function(x){
    x.disabled = true;
    if (x.dataset.id === id) x.classList.add("right"); else if (x === b) x.classList.add("wrong");
  });
  document.getElementById("ws-fb").innerHTML =
    (ok ? '<div class="ok-h">✅ 正确</div>' : '<div class="ng-h">❌ 再记一下</div>') +
    '<div class="note"><span style="font-size:18px">' + show(it) + '</span><br>' + esc(it.zh) +
    ' <button class="mini" id="ws-again">🔊 再听</button></div>' +
    '<div class="btns"><button class="btn main" id="ws-next">下一题</button></div>';
  document.getElementById("ws-again").onclick = function(){ say(it.kana); };
  document.getElementById("ws-next").onclick = function(){ G.i++; G.answered = false; render(); };
}

// ---------- 入口 ----------
function makeBtn(kind, cls){
  var b = document.createElement("button");
  b.dataset.ws = kind; b.className = cls;
  b.textContent = kind === "listen" ? "🎧 听力" : "📖 单词";
  b.onclick = function(e){ e.preventDefault(); e.stopPropagation(); openGame(kind); };

  return b;
}
function ensure(){
  // 1) 游戏中心：找到「消消乐 / 60秒 / 掉落 / 拼图」按钮，把听力和单词加在旁边
  var all = document.querySelectorAll("#main button");
  for (var i = 0; i < all.length; i++) {
    var b = all[i];
    if (!b.dataset.ws && /消消乐|60\s*秒|掉落|拼图/.test(b.textContent)) {
      var host = b.parentNode;
      if (!host.querySelector("[data-ws]")) {
        host.appendChild(makeBtn("listen", b.className));
        host.appendChild(makeBtn("word", b.className));
      }
      break;
    }
  }
  // 2) 闯关模式下的「📝 助词练习」大按钮卡片里也放一份
  var entry = document.getElementById("joshi-entry");
  if (entry && !entry.querySelector("[data-ws]")) {
    var row = document.createElement("div"); row.className = "btns";
    row.appendChild(makeBtn("listen", "btn")); row.appendChild(makeBtn("word", "btn"));
    entry.appendChild(row);
  }
}
setInterval(ensure, 1000);
ensure();
})();
