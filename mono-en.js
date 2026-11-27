// mono-en.js — 大富翁地名加英语名称和英语发音（不改 mono.js）
(function(){

// 国家：[显示名, 句子里用的名字]
var CT = {
  "日本":["Japan","Japan"], "韩国":["South Korea","South Korea"], "中国":["China","China"],
  "印度尼西亚":["Indonesia","Indonesia"], "澳大利亚":["Australia","Australia"], "印度":["India","India"],
  "沙特阿拉伯":["Saudi Arabia","Saudi Arabia"], "土耳其":["Türkiye (Turkey)","Türkiye"], "俄罗斯":["Russia","Russia"],
  "德国":["Germany","Germany"], "荷兰":["the Netherlands","the Netherlands"], "瑞士":["Switzerland","Switzerland"],
  "法国":["France","France"], "英国":["the United Kingdom","the United Kingdom"], "西班牙":["Spain","Spain"],
  "意大利":["Italy","Italy"], "巴西":["Brazil","Brazil"], "墨西哥":["Mexico","Mexico"],
  "美国":["the United States","the United States"], "加拿大":["Canada","Canada"]
};
// 地点：[英语名, 所属国家, 类型]  cap=首都 city=城市 island=岛 region=地区 town=小镇 village=村
var PL = {
  "东京":["Tokyo","日本","cap"], "大阪":["Osaka","日本","city"], "京都":["Kyoto","日本","city"], "札幌":["Sapporo","日本","city"],
  "首尔":["Seoul","韩国","cap"], "釜山":["Busan","韩国","city"], "济州岛":["Jeju Island","韩国","island"], "庆州":["Gyeongju","韩国","city"],
  "北京":["Beijing","中国","cap"], "上海":["Shanghai","中国","city"], "西安":["Xi'an","中国","city"], "成都":["Chengdu","中国","city"],
  "雅加达":["Jakarta","印度尼西亚","cap"], "巴厘岛":["Bali","印度尼西亚","island"], "日惹":["Yogyakarta","印度尼西亚","city"], "万隆":["Bandung","印度尼西亚","city"],
  "堪培拉":["Canberra","澳大利亚","cap"], "悉尼":["Sydney","澳大利亚","city"], "墨尔本":["Melbourne","澳大利亚","city"], "凯恩斯":["Cairns","澳大利亚","city"],
  "新德里":["New Delhi","印度","cap"], "孟买":["Mumbai","印度","city"], "阿格拉":["Agra","印度","city"], "班加罗尔":["Bengaluru","印度","city"],
  "利雅得":["Riyadh","沙特阿拉伯","cap"], "吉达":["Jeddah","沙特阿拉伯","city"], "欧拉":["AlUla","沙特阿拉伯","city"], "达曼":["Dammam","沙特阿拉伯","city"],
  "安卡拉":["Ankara","土耳其","cap"], "伊斯坦布尔":["Istanbul","土耳其","city"], "卡帕多奇亚":["Cappadocia","土耳其","region"], "安塔利亚":["Antalya","土耳其","city"],
  "莫斯科":["Moscow","俄罗斯","cap"], "圣彼得堡":["Saint Petersburg","俄罗斯","city"], "喀山":["Kazan","俄罗斯","city"], "符拉迪沃斯托克":["Vladivostok","俄罗斯","city"],
  "柏林":["Berlin","德国","cap"], "慕尼黑":["Munich","德国","city"], "法兰克福":["Frankfurt","德国","city"], "汉堡":["Hamburg","德国","city"],
  "阿姆斯特丹":["Amsterdam","荷兰","cap"], "鹿特丹":["Rotterdam","荷兰","city"], "海牙":["The Hague","荷兰","city"], "小孩堤防":["Kinderdijk","荷兰","village"],
  "伯尔尼":["Bern","瑞士","cap"], "苏黎世":["Zurich","瑞士","city"], "日内瓦":["Geneva","瑞士","city"], "采尔马特":["Zermatt","瑞士","town"],
  "巴黎":["Paris","法国","cap"], "尼斯":["Nice","法国","city"], "里昂":["Lyon","法国","city"], "波尔多":["Bordeaux","法国","city"],
  "伦敦":["London","英国","cap"], "爱丁堡":["Edinburgh","英国","city"], "曼彻斯特":["Manchester","英国","city"], "牛津":["Oxford","英国","city"],
  "马德里":["Madrid","西班牙","cap"], "巴塞罗那":["Barcelona","西班牙","city"], "塞维利亚":["Seville","西班牙","city"], "瓦伦西亚":["Valencia","西班牙","city"],
  "罗马":["Rome","意大利","cap"], "威尼斯":["Venice","意大利","city"], "佛罗伦萨":["Florence","意大利","city"], "米兰":["Milan","意大利","city"],
  "巴西利亚":["Brasília","巴西","cap"], "里约热内卢":["Rio de Janeiro","巴西","city"], "圣保罗":["São Paulo","巴西","city"], "马瑙斯":["Manaus","巴西","city"],

  "墨西哥城":["Mexico City","墨西哥","cap"], "坎昆":["Cancún","墨西哥","city"], "瓜纳华托":["Guanajuato","墨西哥","city"], "瓜达拉哈拉":["Guadalajara","墨西哥","city"],
  "华盛顿":["Washington, D.C.","美国","cap"], "纽约":["New York","美国","city"], "洛杉矶":["Los Angeles","美国","city"], "旧金山":["San Francisco","美国","city"],
  "渥太华":["Ottawa","加拿大","cap"], "多伦多":["Toronto","加拿大","city"], "温哥华":["Vancouver","加拿大","city"], "魁北克城":["Quebec City","加拿大","city"]
};
// 长的名字先匹配（「墨西哥城」要比「墨西哥」先认出来）
var KEYS = Object.keys(PL).sort(function(a, b){ return b.length - a.length; });

function cap1(s){ return s.charAt(0).toUpperCase() + s.slice(1); }
function sentence(key){
  var p = PL[key], c = CT[p[1]][1], a = {cap:"the capital of", city:"a city in", island:"an island in", region:"a region in", town:"a town in", village:"a village in"}[p[2]];
  return cap1(p[0]) + " is " + a + " " + c + ".";
}
function findPlace(text){
  for (var i = 0; i < KEYS.length; i++) if (text.indexOf(KEYS[i]) >= 0) return KEYS[i];
  return null;
}
function E(s){ return typeof esc === "function" ? esc(String(s)) : String(s); }

// ---------- 英语朗读 ----------
function sayEn(t, slow){
  if (!window.speechSynthesis) { alert("这个浏览器不支持朗读"); return; }
  speechSynthesis.cancel();
  var u = new SpeechSynthesisUtterance(t);
  u.lang = "en-US"; u.rate = slow ? 0.7 : 0.9;
  var vs = speechSynthesis.getVoices() || [];
  var v = vs.filter(function(x){ return /^en[-_]US/i.test(x.lang); })[0] || vs.filter(function(x){ return /^en/i.test(x.lang); })[0];
  if (v) u.voice = v;
  speechSynthesis.speak(u);
}
document.addEventListener("click", function(e){
  var b = e.target.closest && e.target.closest("[data-en]");
  if (!b) return;

  e.preventDefault(); e.stopPropagation();
  sayEn(b.getAttribute("data-en"), b.hasAttribute("data-slow"));
}, true);

// ---------- 加到大富翁的事件框和首都表里 ----------
function enhance(){
  var ev = document.getElementById("mono-ev");
  if (!ev) return;
  // 1) 走到首都 / 城市时的标题下面
  var q = ev.querySelector(".qhead");
  if (q && !(q.nextElementSibling && q.nextElementSibling.classList.contains("en-row"))) {
    var key = findPlace(q.textContent);
    if (key) {
      var p = PL[key], s = sentence(key);
      var row = document.createElement("div");
      row.className = "row en-row";
      row.innerHTML = '<span class="lbl" style="background:var(--blue-bg);color:var(--blue)">英语</span>' +
        '<b style="font-size:17px">' + E(p[0]) + '</b> <button class="mini" data-en="' + E(p[0]) + '">🔊</button>' +
        ' <button class="mini" data-en="' + E(p[0]) + '" data-slow>🐢</button>' +
        ' <span class="muted">· ' + E(CT[p[1]][0]) + '</span>' +
        '<div style="margin-top:2px">' + E(s) + ' <button class="mini" data-en="' + E(s) + '">🔊</button></div>';
      q.parentNode.insertBefore(row, q.nextSibling);
    }
  }
  // 2) 「🗺️ 首都」表格：每个首都下面加英语名
  ev.querySelectorAll("table td:first-child").forEach(function(td){
    if (td.querySelector(".en2")) return;
    var key = findPlace(td.textContent);
    if (!key) return;
    var d = document.createElement("div");
    d.className = "muted en2";
    d.innerHTML = E(PL[key][0]) + ' <button class="mini" data-en="' + E(PL[key][0]) + '">🔊</button>';

    td.appendChild(d);
  });
}

var pending = false;
new MutationObserver(function(){
  if (pending) return;
  pending = true;
  requestAnimationFrame(function(){ pending = false; enhance(); });
}).observe(document.body, {childList:true, subtree:true});

})();
