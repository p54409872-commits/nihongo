// listen.js — 小游戏：听力 + 单词（带连对鼓励）
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
["ねこ","猫","猫",10],["き","木","树",10],
// ↓↓↓ 以下为追加的单词
["にほん","日本","日本",1],["ちゅうごく","中国","中国",1],["ひと","人","人",1],
["なまえ","名前","名字",1],["はい","","是",1],["いいえ","","不是",1],
["えんぴつ","鉛筆","铅笔",2],["かばん","","包",2],["テレビ","","电视",2],["カメラ","","相机",2],
["コンピューター","","电脑",2],["ノート","","笔记本",2],["めいし","名刺","名片",2],["ボールペン","","圆珠笔",2],
["かいだん","階段","楼梯",3],["エレベーター","","电梯",3],["へや","部屋","房间",3],["うち","家","家",3],
["くつ","靴","鞋",3],["ネクタイ","","领带",3],["ワイン","","葡萄酒",3],["なんがい","何階","几楼",3],
["ひるやすみ","昼休み","午休",4],["しごと","仕事","工作（名词）",4],["ごぜん","午前","上午",4],
["ごご","午後","下午",4],["まいにち","毎日","每天",4],["まいばん","毎晩","每天晚上",4],
["おわります","終わります","结束",4],["にちようび","日曜日","星期天",4],["なんじ","何時","几点",4],
["バス","","公交车",5],["タクシー","","出租车",5],["じてんしゃ","自転車","自行车",5],
["あるいて","歩いて","走着（去）",5],["ちかてつ","地下鉄","地铁",5],["らいしゅう","来週","下周",5],
["せんしゅう","先週","上周",5],["たんじょうび","誕生日","生日",5],["かぞく","家族","家人",5],
["パン","","面包",6],["たまご","卵","鸡蛋",6],["にく","肉","肉",6],["さかな","魚","鱼",6],
["やさい","野菜","蔬菜",6],["くだもの","果物","水果",6],["おちゃ","お茶","茶",6],
["ぎゅうにゅう","牛乳","牛奶",6],["えいが","映画","电影",6],["てがみ","手紙","信",6],
["します","","做",6],["あいます","会います","见面",6],
["はし","箸","筷子",7],["はさみ","","剪刀",7],["かみ","紙","纸",7],["はな","花","花",7],
["プレゼント","","礼物",7],["かします","貸します","借给（别人）",7],["かります","借ります","借（别人的）",7],
["でんわ","電話","电话",7],
["あつい","暑い","热（天气）",8],["さむい","寒い","冷（天气）",8],["むずかしい","難しい","难",8],
["やさしい","","容易；温柔",8],["おもしろい","面白い","有趣",8],["いそがしい","忙しい","忙",8],
["たのしい","楽しい","开心",8],["しんせつ","親切","热情、亲切",8],["ゆうめい","有名","有名",8],
["やま","山","山",8],["まち","町","城镇",8],
["りょうり","料理","菜；做菜",9],["スポーツ","","运动",9],["え","絵","画",9],["じ","字","字",9],
["じかん","時間","时间",9],["やくそく","約束","约定",9],["ひらがな","","平假名",9],["カタカナ","","片假名",9],
["おとこのひと","男の人","男人",10],["おんなのひと","女の人","女人",10],["こども","子供","孩子",10],
["はこ","箱","盒子",10],["こうえん","公園","公园",10],["みせ","店","商店",10],
["となり","隣","旁边、隔壁",10],["ちかく","近く","附近",10],["いろいろ","","各种各样",10],

["ひとつ","一つ","一个",11],["ふたつ","二つ","两个",11],["みっつ","三つ","三个",11],
["りんご","","苹果",11],["きって","切手","邮票",11],["きょうだい","兄弟","兄弟姐妹",11],
["あに","兄","哥哥",11],["あね","姉","姐姐",11],["おとうと","弟","弟弟",11],["いもうと","妹","妹妹",11],
["てんき","天気","天气",12],["あめ","雨","雨",12],["ゆき","雪","雪",12],["はる","春","春天",12],
["なつ","夏","夏天",12],["あき","秋","秋天",12],["ふゆ","冬","冬天",12],["いちばん","一番","最",12],
["すずしい","涼しい","凉快",12],["あたたかい","暖かい","暖和",12],
["ほしい","","想要",13],["あそびます","遊びます","玩",13],["およぎます","泳ぎます","游泳",13],
["つかれます","疲れます","累",13],["うみ","海","海",13],["プール","","游泳池",13],
["つけます","","打开（灯、电器）",14],["けします","消します","关掉（灯、电器）",14],
["あけます","開けます","打开（门窗）",14],["しめます","閉めます","关上（门窗）",14],
["いそぎます","急ぎます","赶快",14],["まちます","待ちます","等",14],
["てつだいます","手伝います","帮忙",14],["よびます","呼びます","叫、喊",14],
["たちます","立ちます","站",15],["すわります","座ります","坐",15],
["すみます","住みます","住",15],["しります","知ります","知道",15]
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
["つくえの うえに ねこが います。","桌子上有一只猫。",10],
// ↓↓↓ 以下为追加的句子
["はじめまして。","初次见面。",1],
["どうぞ よろしく おねがいします。","请多关照。",1],
["わたしは ちゅうごくじんです。","我是中国人。",1],
["それは なんの ざっしですか。","那是什么杂志？",2],
["これは えんぴつですか。","这是铅笔吗？",2],
["この かばんは だれのですか。","这个包是谁的？",2],
["ここは きょうしつです。","这里是教室。",3],
["エレベーターは あそこです。","电梯在那边。",3],
["この くつは いくらですか。","这双鞋多少钱？",3],
["ぎんこうは なんじまでですか。","银行开到几点？",4],
["きのう べんきょうしました。","昨天学习了。",4],
["まいばん じゅうじに ねます。","每天晚上十点睡觉。",4],
["ともだちと がっこうへ いきます。","和朋友一起去学校。",5],
["バスで うちへ かえります。","坐公交车回家。",5],
["たんじょうびは いつですか。","生日是什么时候？",5],
["まいあさ パンを たべます。","每天早上吃面包。",6],
["いっしょに えいがを みませんか。","一起看电影好吗？",6],
["なにを のみますか。","喝什么？",6],
["はしで ごはんを たべます。","用筷子吃饭。",7],
["ははに てがみを かきます。","给妈妈写信。",7],
["ともだちに ほんを かりました。","向朋友借了书。",7],
["きょうは さむいですね。","今天好冷啊。",8],
["にほんごは おもしろいです。","日语很有趣。",8],
["この まちは しずかです。","这个城镇很安静。",8],
["わたしは りょうりが すきです。","我喜欢做菜。",9],
["ひらがなが わかります。","我懂平假名。",9],
["じかんが ありません。","没有时间。",9],
["こうえんに こどもが います。","公园里有孩子。",10],
["はこの なかに なにが ありますか。","盒子里有什么？",10],

["えきの ちかくに みせが あります。","车站附近有商店。",10],
["りんごを みっつ ください。","请给我三个苹果。",11],
["あねが ひとり います。","我有一个姐姐。",11],
["いもうとは じゅっさいです。","妹妹十岁。",11],
["きょうは いい てんきですね。","今天天气真好啊。",12],
["なつは ふゆより あついです。","夏天比冬天热。",12],
["いちばん すきな きせつは はるです。","最喜欢的季节是春天。",12],
["あたらしい くつが ほしいです。","想要新鞋子。",13],
["うみへ およぎに いきます。","去海边游泳。",13],
["つかれました。","累了。",13],
["まどを あけて ください。","请把窗户打开。",14],
["ちょっと まって ください。","请稍等一下。",14],
["でんきを けして ください。","请把灯关掉。",14],
["ここに すわっても いいですか。","可以坐这里吗？",15],
["とうきょうに すんで います。","住在东京。",15]
];

var PRAISE = [["すごい！","真厉害"],["いいね！","好棒"],["せいかい！","答对了"],["やった！","太好了"],["そのちょうし！","保持这个状态"],["かんぺき！","完美"]];
var COMFORT = ["没关系，记住它就好～","错了才记得牢！","再听一遍，下次一定对。","慢慢来，每题都算数。"];
var G = {kind:"", list:[], i:0, score:0, answered:false, maxL:null, streak:0, bestRound:0, recShown:false};

function esc(t){ return String(t).replace(/[&<>"]/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]; }); }
function shuf(a){ for (var i=a.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)); var t=a[i]; a[i]=a[j]; a[j]=t; } return a; }
function pick(a){ return a[Math.floor(Math.random()*a.length)]; }

function store(){
  var d = {done:0, ok:0, wrong:{}, best:0};
  if (window.S && typeof S === "object") { if (!S.wordgame) S.wordgame = d; if (S.wordgame.best == null) S.wordgame.best = 0; return S.wordgame; }
  try { return Object.assign(d, JSON.parse(localStorage.getItem("jp-wordgame")) || {}); } catch(e){ return d; }
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

// ---------- 庆祝动画 ----------
(function(){
  var css = document.createElement("style");
  css.textContent =
    "@keyframes wsfly{0%{transform:translateY(0) scale(.5);opacity:1}100%{transform:translateY(-65vh) rotate(var(--r)) scale(1.3);opacity:0}}" +
    ".ws-p{position:fixed;bottom:15%;font-size:30px;pointer-events:none;z-index:9500;animation:wsfly 1.8s ease-out forwards}" +
    "@keyframes wspop{0%{transform:scale(.4);opacity:0}60%{transform:scale(1.15);opacity:1}100%{transform:scale(1)}}" +
    ".ws-pop{animation:wspop .45s ease-out}" +

    ".ws-streak{display:inline-block;background:var(--gold-bg);color:var(--gold);border-radius:12px;padding:0 10px;font-weight:bold;margin-left:6px}";
  document.head.appendChild(css);
})();
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

// ---------- 题目 ----------
function get(id){
  var n = +id.slice(1);
  if (id[0] === "w") { var w = WORDS2[n]; return {type:"w", kana:w[0], ja:w[1] || w[0], zh:w[2], l:w[3]}; }
  var s = LISTENQ[n]; return {type:"s", kana:s[0], ja:s[0], zh:s[1], l:s[2]};
}
function allIds(){
  return WORDS2.map(function(_, i){ return "w" + i; }).concat(LISTENQ.map(function(_, i){ return "s" + i; }));
}
function pool(kind){
  var ids = kind === "listen" ? allIds() : WORDS2.map(function(_, i){ return "w" + i; });
  return ids.filter(function(id){ return get(id).l <= G.maxL; });
}
function maxLesson(){
  var m = 1;
  WORDS2.forEach(function(w){ if (w[3] > m) m = w[3]; });

  LISTENQ.forEach(function(s){ if (s[2] > m) m = s[2]; });
  return m;
}
// 干扰项：优先从已学范围里挑，同类型、不重复
function distract(id, it, field){
  var ok = function(x){ return x !== id && x[0] === id[0] && get(x)[field] !== it[field]; };
  var near = pool(G.kind).filter(ok);
  var src = near.length >= 3 ? near : allIds().filter(ok);
  var seen = {}, out = [];
  shuf(src).forEach(function(x){ var v = get(x)[field]; if (!seen[v] && out.length < 3) { seen[v] = 1; out.push(x); } });
  return out;
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
  var top = maxLesson(), opts = '<option value="99">全部课</option>';
  for (var l = 1; l <= top; l++) opts += '<option value="' + l + '">学到第 ' + l + ' 课</option>';
  var n = pool(G.kind).length;
  panel().innerHTML =
    '<div class="qhead">' + name + '</div>' +
    '<div class="muted">' + (G.kind === "listen" ? "听日语，选出意思或写法。没声音的话检查一下手机静音键和音量。" : "看日语选中文，或看中文选日语。") + '</div>' +
    '<div class="row">出题范围：<select id="ws-range">' + opts + '</select> <span class="muted">（' + n + ' 题）</span></div>' +
    (st.best ? '<div class="row">🏆 最高连对：<b>' + st.best + '</b> 题</div>' : '') +
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

  G.i = 0; G.score = 0; G.answered = false; G.streak = 0; G.bestRound = 0; G.recShown = false;
  render();
}

function finish(){
  var n = G.list.length, s = G.score, r = n ? s / n : 0;
  var stars = r >= 0.9 ? "⭐⭐⭐" : r >= 0.7 ? "⭐⭐" : r >= 0.5 ? "⭐" : "";
  var msg = r >= 0.9 ? "太厉害了！全都记住了！" : r >= 0.7 ? "很棒！再练一次就能满分了" : r >= 0.5 ? "不错哦，错的那几个再听几遍" : "刚开始都是这样，多练几次就会了～";
  menu();
  panel().insertAdjacentHTML("afterbegin",
    '<div class="celebrate ws-pop" style="text-align:center;font-size:18px">' +
    (stars ? '<div style="font-size:36px">' + stars + '</div>' : '<div style="font-size:36px">💪</div>') +
    '本轮 ' + s + ' / ' + n + '<br>' + msg +
    (G.bestRound >= 3 ? '<br>这一轮最多连对 ' + G.bestRound + ' 题 🔥' : '') + '</div>');
  if (r >= 0.7) burst(r >= 0.9 ? 36 : 18);
}

function render(){
  var box = panel();
  if (G.i >= G.list.length) { finish(); return; }
  var id = G.list[G.i], it = get(id);
  var dir = G.kind === "listen" ? (Math.random() < 0.6 ? "listen" : "listenKana") : (Math.random() < 0.5 ? "ja2zh" : "zh2ja");
  var field = dir === "listenKana" ? "kana" : "zh";
  var opts = shuf([id].concat(distract(id, it, field)));
  var head, optHtml;

  if (dir === "listen" || dir === "listenKana") {
    head = '<div class="qhead">' + (dir === "listen" ? "听一听，选出意思" : "听一听，选出听到的写法") + '</div>' +
           '<div class="btns"><button class="btn main" id="ws-play">🔊 播放</button><button class="btn" id="ws-slow">🐢 慢速</button></div>';
    optHtml = opts.map(function(o){ return '<button class="opt" data-id="' + o + '">' + esc(dir === "listen" ? get(o).zh : get(o).kana) + '</button>'; }).join("");
  } else if (dir === "ja2zh") {
    head = '<div class="qhead">这个是什么意思？</div><div class="box"><span class="big">' + show(it) + '</span> <button class="mini" id="ws-play">🔊</button></div>';

    optHtml = opts.map(function(o){ return '<button class="opt" data-id="' + o + '">' + esc(get(o).zh) + '</button>'; }).join("");
  } else {
    head = '<div class="qhead">日语怎么说？</div><div class="box"><span class="big">' + esc(it.zh) + '</span></div>';
    optHtml = opts.map(function(o){ return '<button class="opt" data-id="' + o + '">' + show(get(o)) + '</button>'; }).join("");
  }

  box.innerHTML =
    '<div class="qtop">' + (G.kind === "listen" ? "🎧 听力" : "📖 单词") + ' · 第' + it.l + '课 · ' + (G.i + 1) + ' / ' + G.list.length +
    (G.streak >= 2 ? '<span class="ws-streak">🔥×' + G.streak + '</span>' : '') + '</div>' +
    head + optHtml + '<div id="ws-fb"></div>' +
    '<div class="btns"><button class="link" id="ws-quit">结束返回</button></div>';

  var p = document.getElementById("ws-play"); if (p) p.onclick = function(){ say(it.kana); };
  var s = document.getElementById("ws-slow"); if (s) s.onclick = function(){ say(it.kana, true); };
  document.getElementById("ws-quit").onclick = menu;
  box.querySelectorAll(".opt").forEach(function(b){ b.onclick = function(){ answer(b, id, it); }; });
  if (dir === "listen" || dir === "listenKana") say(it.kana);
}

function answer(b, id, it){
  if (G.answered) return; G.answered = true;
  var ok = b.dataset.id === id, st = store(), key = G.kind + ":" + id, lost = 0, rec = false;
  st.done++;
  if (ok) {
    st.ok++; G.score++; G.streak++;
    if (G.streak > G.bestRound) G.bestRound = G.streak;
    if (G.streak > (st.best || 0)) { st.best = G.streak; if (G.streak >= 3 && !G.recShown) { rec = true; G.recShown = true; } }
    if (st.wrong[key] && --st.wrong[key] <= 0) delete st.wrong[key];
  } else {
    lost = G.streak; G.streak = 0;
    st.wrong[key] = 2;   // 错题要连续答对 2 次才移出
  }

  persist(st);

  panel().querySelectorAll(".opt").forEach(function(x){
    x.disabled = true;
    if (x.dataset.id === id) x.classList.add("right"); else if (x === b) x.classList.add("wrong");
  });

  var top;
  if (ok) {
    var pr = pick(PRAISE);
    var ms = G.streak >= 10 && G.streak % 5 === 0 ? "👑 连对 " + G.streak + " 题！你太强了！" :
             G.streak === 5 ? "🌟 连对 5 题！太厉害了！" :
             G.streak === 3 ? "🔥 连对 3 题！手感来了！" : "";
    top = '<div class="ok-h ws-pop">✅ ' + pr[0] + ' <span class="muted">' + pr[1] + '</span></div>' +
          (ms || rec ? '<div class="celebrate ws-pop">' + ms + (rec ? (ms ? ' ' : '') + '🏆 新纪录！' : '') + '</div>' : '');
    burst(ms || rec ? 26 : 6);
  } else {
    top = '<div class="ng-h">❌ 差一点点</div><div class="comfort">' + pick(COMFORT) +
          (lost >= 3 ? ' 刚才连对了 ' + lost + ' 题，已经很棒了！' : '') + '</div>';
  }

  document.getElementById("ws-fb").innerHTML = top +
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
