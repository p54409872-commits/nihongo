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
  "美国":["the United States","the United States"], "加拿大":["Canada","Canada"],
  "越南":["Vietnam","Vietnam"], "泰国":["Thailand","Thailand"], "新加坡":["Singapore","Singapore"],
  "新西兰":["New Zealand","New Zealand"], "阿联酋":["the United Arab Emirates","the United Arab Emirates"],
  "埃及":["Egypt","Egypt"], "肯尼亚":["Kenya","Kenya"], "南非":["South Africa","South Africa"],
  "尼日利亚":["Nigeria","Nigeria"], "希腊":["Greece","Greece"], "瑞典":["Sweden","Sweden"],
  "阿根廷":["Argentina","Argentina"], "智利":["Chile","Chile"]
};
// 地点：[英语名, 所属国家, 类型]
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
  "渥太华":["Ottawa","加拿大","cap"], "多伦多":["Toronto","加拿大","city"], "温哥华":["Vancouver","加拿大","city"], "魁北克城":["Quebec City","加拿大","city"],
  "河内":["Hanoi","越南","cap"], "下龙湾":["Ha Long Bay","越南","bay"], "会安":["Hoi An","越南","town"], "胡志明市":["Ho Chi Minh City","越南","city"],
  "曼谷":["Bangkok","泰国","cap"], "大城":["Ayutthaya","泰国","city"], "清迈":["Chiang Mai","泰国","city"], "普吉岛":["Phuket","泰国","island"],
  "新加坡":["Singapore","新加坡","cap"], "滨海湾":["Marina Bay","新加坡","area"], "圣淘沙":["Sentosa","新加坡","island"], "牛车水":["Chinatown","新加坡","area"],
  "惠灵顿":["Wellington","新西兰","cap"], "奥克兰":["Auckland","新西兰","city"], "罗托鲁瓦":["Rotorua","新西兰","city"], "皇后镇":["Queenstown","新西兰","town"],
  "阿布扎比":["Abu Dhabi","阿联酋","cap"], "迪拜":["Dubai","阿联酋","city"], "沙迦":["Sharjah","阿联酋","city"], "阿莱茵":["Al Ain","阿联酋","city"],
  "开罗":["Cairo","埃及","cap"], "亚历山大":["Alexandria","埃及","city"], "卢克索":["Luxor","埃及","city"], "阿斯旺":["Aswan","埃及","city"],
  "内罗毕":["Nairobi","肯尼亚","cap"], "纳库鲁":["Nakuru","肯尼亚","city"], "马赛马拉":["Maasai Mara","肯尼亚","region"], "蒙巴萨":["Mombasa","肯尼亚","city"],
  "比勒陀利亚":["Pretoria","南非","cap"], "约翰内斯堡":["Johannesburg","南非","city"], "德班":["Durban","南非","city"], "开普敦":["Cape Town","南非","city"],
  "阿布贾":["Abuja","尼日利亚","cap"], "卡诺":["Kano","尼日利亚","city"], "拉各斯":["Lagos","尼日利亚","city"], "卡拉巴尔":["Calabar","尼日利亚","city"],
  "雅典":["Athens","希腊","cap"], "塞萨洛尼基":["Thessaloniki","希腊","city"], "奥林匹亚":["Olympia","希腊","town"], "圣托里尼":["Santorini","希腊","island"],
  "斯德哥尔摩":["Stockholm","瑞典","cap"], "乌普萨拉":["Uppsala","瑞典","city"], "基律纳":["Kiruna","瑞典","town"], "哥德堡":["Gothenburg","瑞典","city"],
  "布宜诺斯艾利斯":["Buenos Aires","阿根廷","cap"], "伊瓜苏":["Iguazú Falls","阿根廷","waterfall"], "乌斯怀亚":["Ushuaia","阿根廷","city"], "门多萨":["Mendoza","阿根廷","city"],
  "圣地亚哥":["Santiago","智利","cap"], "瓦尔帕莱索":["Valparaíso","智利","city"], "阿塔卡马":["Atacama","智利","region"], "复活节岛":["Easter Island","智利","island"]
};
var KEYS = Object.keys(PL).sort(function(a, b){ return b.length - a.length; });

function cap1(s){ return s.charAt(0).toUpperCase() + s.slice(1); }
function sentence(key){
  var p = PL[key], c = CT[p[1]][1];
  var a = {cap:"the capital of", city:"a city in", island:"an island in", region:"a region in", town:"a town in",
           village:"a village in", bay:"a bay in", area:"an area in", waterfall:"a waterfall in"}[p[2]];
  return cap1(p[0]) + " is " + a + " " + c + ".";
}
function findPlace(text){

  for (var i = 0; i < KEYS.length; i++) if (text.indexOf(KEYS[i]) >= 0) return KEYS[i];
  return null;
}
function E(s){ return typeof esc === "function" ? esc(String(s)) : String(s); }

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

function enhance(){
  var ev = document.getElementById("mono-ev");
  if (!ev) return;
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
