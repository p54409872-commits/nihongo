// mono.js — 🎲 日语大富翁（替换「环游世界」）
// 用到 app.js 的全局：S, pid, setup, PROFILES, room, cloud, FB, roomRef, getData, otherId, nameOf,
// today, addDays, dayDiff, winner, dueList, poolByUnit, CONF, speak, esc, record
(function(){

var CFG = {START_CASH:20000, START_DICE:3, SALARY:1000, MAX_DICE:50, GOAL:50,
  BANK_RATE:0.01, P2P_RATE:0.005, RATE_MIN:2, RATE_MAX:20, RATE_DEF:5,
  AIR_FEE:200, JAIL_FEE:500, GAME_ROUNDS_PER_DAY:6, BUYOUT_PREMIUM:0.2, BUYOUT_BANK_MAX:10000};

// ===== 国家（按棋盘路线顺序）。gdp = IMF 2026年10月 名义GDP（十亿美元）=====
var C = [
{id:"JP",n:"日本",f:"🇯🇵",gdp:4342,cap:{n:"东京",i:"日本的首都，世界最大的都市圈之一。涩谷十字路口和东京塔都很有名。",w:["でんしゃ","电车"]},cs:[
 {n:"大阪",e:"🐙",i:"被称为「日本的厨房」，章鱼烧和大阪烧是招牌美食。",w:["たこやき","章鱼烧"]},
 {n:"京都",e:"⛩️",i:"做过一千多年首都的古城，到处是寺庙和神社。",w:["おてら","寺庙"]},
 {n:"札幌",e:"⛄",i:"北海道最大的城市，每年二月有盛大的雪祭。",w:["ゆき","雪"]}]},
{id:"KR",n:"韩国",f:"🇰🇷",gdp:2246,cap:{n:"首尔",i:"韩国首都，汉江从城中流过，景福宫是朝鲜王朝的王宫。",w:["きゅうでん","宫殿"]},cs:[
 {n:"釜山",e:"🌊",i:"韩国第二大城市，有漂亮的海滩和热闹的海鲜市场。",w:["うみ","海"]},
 {n:"济州岛",e:"🍊",i:"火山形成的海岛，盛产橘子，风景很美。",w:["しま","岛"]},
 {n:"庆州",e:"🏯",i:"新罗王朝的千年古都，被称为「没有围墙的博物馆」。",w:["れきし","历史"]}]},
{id:"CN",n:"中国",f:"🇨🇳",gdp:21546,cap:{n:"北京",i:"中国首都，有故宫和长城，建城历史超过三千年。",w:["ふるい","古老的"]},cs:[
 {n:"上海",e:"🌃",i:"中国最大的经济中心，外滩和东方明珠塔很有名。",w:["ビル","大楼"]},
 {n:"西安",e:"🗿",i:"十三个王朝的古都，有举世闻名的兵马俑。",w:["へいたい","士兵"]},
 {n:"成都",e:"🐼",i:"大熊猫的故乡，火锅又麻又辣。",w:["からい","辣"]}]},
{id:"ID",n:"印度尼西亚",f:"🇮🇩",gdp:1480,cap:{n:"雅加达",i:"印尼首都，人口超过一千万，以堵车出名。新首都努山塔拉正在建设中。",w:["くるま","汽车"]},cs:[
 {n:"巴厘岛",e:"🏝️",i:"热门度假海岛，有梯田、寺庙和冲浪海滩。",w:["なつやすみ","暑假"]},
 {n:"日惹",e:"🛕",i:"附近有世界最大的佛教遗址婆罗浮屠。",w:["ほとけ","佛"]},
 {n:"万隆",e:"🌋",i:"凉爽的高原城市，周围有好几座火山。",w:["かざん","火山"]}]},
{id:"AU",n:"澳大利亚",f:"🇦🇺",gdp:2111,cap:{n:"堪培拉",i:"专门规划建造的首都，位于悉尼和墨尔本之间。",w:["まち","城镇"]},cs:[
 {n:"悉尼",e:"🎭",i:"澳大利亚最大城市，有歌剧院和海港大桥。",w:["うた","歌"]},
 {n:"墨尔本",e:"☕",i:"咖啡和有轨电车之城，经常被评为最宜居城市。",w:["コーヒー","咖啡"]},
 {n:"凯恩斯",e:"🐠",i:"去大堡礁潜水的出发地，海里有各种彩色的鱼。",w:["さかな","鱼"]}]},
{id:"IN",n:"印度",f:"🇮🇳",gdp:4060,cap:{n:"新德里",i:"印度首都，有印度门和红堡。",w:["もん","门"]},cs:[
 {n:"孟买",e:"🎬",i:"印度最大城市，宝莱坞电影的大本营。",w:["えいが","电影"]},
 {n:"阿格拉",e:"🕌",i:"白色大理石建成的泰姬陵就在这里。",w:["しろい","白色的"]},
 {n:"班加罗尔",e:"💻",i:"被称为「印度硅谷」，有很多 IT 公司。",w:["コンピューター","电脑"]}]},
{id:"SA",n:"沙特阿拉伯",f:"🇸🇦",gdp:1343,cap:{n:"利雅得",i:"建在沙漠里的大城市，夏天常常超过 45 度。",w:["あつい","热"]},cs:[
 {n:"吉达",e:"🌅",i:"红海边的港口城市。",w:["あかい","红色的"]},
 {n:"欧拉",e:"🪨",i:"沙漠里有巨大的奇石和两千年前的古城遗址。",w:["いわ","岩石"]},
 {n:"达曼",e:"🛢️",i:"沙特石油工业的中心。",w:["あぶら","油"]}]},
{id:"TR",n:"土耳其",f:"🇹🇷",gdp:1818,cap:{n:"安卡拉",i:"土耳其首都，有国父阿塔图尔克的陵墓。",w:["くに","国家"]},cs:[
 {n:"伊斯坦布尔",e:"🌉",i:"横跨欧洲和亚洲两个大洲的城市。",w:["ふたつ","两个"]},
 {n:"卡帕多奇亚",e:"🎈",i:"清晨上百个热气球一起升空，地上全是奇形怪状的岩石。",w:["ききゅう","气球"]},
 {n:"安塔利亚",e:"🏖️",i:"地中海边的度假城市，阳光和沙滩很有名。",w:["すな","沙子"]}]},
{id:"RU",n:"俄罗斯",f:"🇷🇺",gdp:2861,cap:{n:"莫斯科",i:"俄罗斯首都，有红场和克里姆林宫，冬天非常冷。",w:["さむい","冷"]},cs:[
 {n:"圣彼得堡",e:"🌙",i:"有冬宫博物馆，夏天会出现天黑不下来的「白夜」。",w:["よる","夜晚"]},
 {n:"喀山",e:"🕌",i:"俄罗斯文化和鞑靼文化交汇的城市。",w:["ぶんか","文化"]},
 {n:"符拉迪沃斯托克",e:"🚂",i:"西伯利亚铁路的终点，离日本很近。",w:["てつどう","铁路"]}]},
{id:"DE",n:"德国",f:"🇩🇪",gdp:5471,cap:{n:"柏林",i:"德国首都，有勃兰登堡门和柏林墙遗址。",w:["かべ","墙"]},cs:[
 {n:"慕尼黑",e:"🍺",i:"每年秋天举办啤酒节，也是宝马汽车的故乡。",w:["まつり","节日"]},
 {n:"法兰克福",e:"🏦",i:"德国的金融中心，欧洲中央银行就在这里。",w:["ぎんこう","银行"]},
 {n:"汉堡",e:"⚓",i:"德国最大的港口城市。",w:["みなと","港口"]}]},
{id:"NL",n:"荷兰",f:"🇳🇱",gdp:1424,cap:{n:"阿姆斯特丹",i:"运河和自行车之城，自行车比人还多。",w:["じてんしゃ","自行车"]},cs:[
 {n:"鹿特丹",e:"🚢",i:"欧洲最大的港口。",w:["ふね","船"]},
 {n:"海牙",e:"⚖️",i:"政府和国际法院都在这里。",w:["ほうりつ","法律"]},
 {n:"小孩堤防",e:"🌬️",i:"十九座古老的风车排成一排，是世界遗产。",w:["かぜ","风"]}]},
{id:"CH",n:"瑞士",f:"🇨🇭",gdp:1136,cap:{n:"伯尔尼",i:"瑞士首都，中世纪老城里有天文钟，还有养熊的公园。",w:["くま","熊"]},cs:[
 {n:"苏黎世",e:"🍫",i:"瑞士最大城市，银行和巧克力都很有名。",w:["チョコレート","巧克力"]},
 {n:"日内瓦",e:"⛲",i:"湖边有大喷泉，联合国欧洲总部也在这里。",w:["みずうみ","湖"]},
 {n:"采尔马特",e:"🏔️",i:"马特洪峰脚下的滑雪小镇，镇上不许开汽油车。",w:["スキー","滑雪"]}]},
{id:"FR",n:"法国",f:"🇫🇷",gdp:3554,cap:{n:"巴黎",i:"法国首都，有埃菲尔铁塔和卢浮宫。",w:["びじゅつかん","美术馆"]},cs:[
 {n:"尼斯",e:"🏖️",i:"地中海边的「蓝色海岸」，海水特别蓝。",w:["あおい","蓝色的"]},
 {n:"里昂",e:"🍽️",i:"被称为法国的美食之都。",w:["りょうり","料理"]},
 {n:"波尔多",e:"🍇",i:"世界有名的葡萄酒产地。",w:["ぶどう","葡萄"]}]},
{id:"UK",n:"英国",f:"🇬🇧",gdp:4268,cap:{n:"伦敦",i:"英国首都，有大本钟和伦敦眼摩天轮。",w:["とけい","钟表"]},cs:[
 {n:"爱丁堡",e:"🏰",i:"苏格兰的首府，山上有古老的城堡。",w:["しろ","城堡"]},
 {n:"曼彻斯特",e:"⚽",i:"有两支世界有名的足球队。",w:["サッカー","足球"]},
 {n:"牛津",e:"🎓",i:"有九百多年历史的大学城。",w:["だいがく","大学"]}]},
{id:"ES",n:"西班牙",f:"🇪🇸",gdp:2085,cap:{n:"马德里",i:"西班牙首都，有普拉多美术馆和皇宫。",w:["え","画"]},cs:[
 {n:"巴塞罗那",e:"⛪",i:"高迪设计的圣家堂已经建了一百多年。",w:["きょうかい","教堂"]},
 {n:"塞维利亚",e:"💃",i:"弗拉门戈舞的故乡。",w:["おどり","舞蹈"]},
 {n:"瓦伦西亚",e:"🥘",i:"西班牙海鲜饭的发源地。",w:["こめ","米"]}]},
{id:"IT",n:"意大利",f:"🇮🇹",gdp:2702,cap:{n:"罗马",i:"意大利首都，有两千年前的斗兽场。「罗马不是一天建成的」。",w:["むかし","很久以前"]},cs:[
 {n:"威尼斯",e:"🛶",i:"建在水上的城市，大家坐贡多拉船出行。",w:["かわ","河"]},
 {n:"佛罗伦萨",e:"🎨",i:"文艺复兴的发源地，到处是艺术作品。",w:["げいじゅつ","艺术"]},
 {n:"米兰",e:"👗",i:"世界时尚之都，每年都有时装周。",w:["ふく","衣服"]}]},
{id:"BR",n:"巴西",f:"🇧🇷",gdp:2655,cap:{n:"巴西利亚",i:"1960 年在空地上新建的首都，城市形状像一架飞机。",w:["ひこうき","飞机"]},cs:[
 {n:"里约热内卢",e:"🎉",i:"有山顶的基督像和热闹的狂欢节。",w:["カーニバル","狂欢节"]},
 {n:"圣保罗",e:"🏙️",i:"南美最大的城市，住着很多日本移民的后代。",w:["にっけいじん","日裔"]},
 {n:"马瑙斯",e:"🌳",i:"亚马逊雨林中间的城市。",w:["もり","森林"]}]},
{id:"MX",n:"墨西哥",f:"🇲🇽",gdp:2176,cap:{n:"墨西哥城",i:"建在古代湖泊上的大城市，以前是阿兹特克帝国的首都。",w:["タコス","塔可"]},cs:[
 {n:"坎昆",e:"🏝️",i:"加勒比海边的度假胜地。",w:["なつ","夏天"]},
 {n:"瓜纳华托",e:"🏘️",i:"山坡上满是彩色房子的小城。",w:["いろ","颜色"]},
 {n:"瓜达拉哈拉",e:"🎺",i:"墨西哥街头音乐「马里亚奇」的故乡。",w:["おんがく","音乐"]}]},
{id:"US",n:"美国",f:"🇺🇸",gdp:32642,cap:{n:"华盛顿",i:"美国首都，有白宫和国会大厦。",w:["だいとうりょう","总统"]},cs:[
 {n:"纽约",e:"🗽",i:"美国最大城市，有自由女神像。",w:["じゆう","自由"]},
 {n:"洛杉矶",e:"🌟",i:"好莱坞所在地，很多电影明星住在这里。",w:["スター","明星"]},
 {n:"旧金山",e:"🌁",i:"有红色的金门大桥，常常起雾。",w:["はし","桥"]}]},
{id:"CA",n:"加拿大",f:"🇨🇦",gdp:2490,cap:{n:"渥太华",i:"加拿大首都，冬天运河会变成超长的溜冰场。",w:["こおり","冰"]},cs:[
 {n:"多伦多",e:"🗼",i:"加拿大最大城市，有高高的 CN 塔。",w:["たかい","高"]},
 {n:"温哥华",e:"🏔️",i:"背靠大山、面朝大海的城市。",w:["やま","山"]},
 {n:"魁北克城",e:"⚜️",i:"说法语的古老城市，街道像欧洲。",w:["フランスご","法语"]}]}
];

var IND = {
  agri:  {n:"🌾 农业", lo:0.00,  hi:0.02},
  mfg:   {n:"🏭 制造", lo:-0.02, hi:0.04},
  energy:{n:"⚡ 能源", lo:-0.06, hi:0.08},
  fin:   {n:"🏦 金融", lo:-0.08, hi:0.10},
  tour:  {n:"✈️ 旅游", lo:-0.10, hi:0.12},
  tech:  {n:"💻 科技", lo:-0.12, hi:0.14}
};
var SP = {START:{e:"🏁",n:"起点"},CHANCE:{e:"❓",n:"机会"},FATE:{e:"🔮",n:"命运"},PARK:{e:"🌳",n:"免费公园"},
  SCHOOL:{e:"🏫",n:"日语学校"},AIR:{e:"✈️",n:"国际机场"},JAIL:{e:"🏛️",n:"监狱"},POLICE:{e:"🚔",n:"警察局"}};
var SEQ = ["START","JP","CHANCE","KR","FATE","CN","PARK","ID","SCHOOL","AU","AIR","IN","CHANCE","SA","FATE","TR",
  "JAIL","RU","CHANCE","DE","NL","FATE","CH","FR","PARK","UK","CHANCE","ES","IT","AIR","BR","FATE","MX","POLICE","US","CA"];
var JLD = [1,2,2,3,1,4,4,4,5,5,5,6,6,9,9,10,10,23,13,16,16,7,7,10,12,9,13,10,6,15,14,29,29,7,9,13,4,22,17,11,16];

// ===== 棋盘 =====
var B = [];
SEQ.forEach(function(s){
  var ci = -1;
  for (var i = 0; i < C.length; i++) if (C[i].id === s) ci = i;
  if (ci >= 0) { B.push({t:"cap", c:ci}); for (var j = 0; j < 3; j++) B.push({t:"city", c:ci, j:j}); }
  else B.push({t:"sp", k:s});
});
var N = B.length, JAIL_POS = 0;
B.forEach(function(b, i){ if (b.k === "JAIL") JAIL_POS = i; });
function capPos(ci){ for (var i = 0; i < N; i++) if (B[i].t === "cap" && B[i].c === ci) return i; return 0; }
var RANK = C.map(function(_, i){ return i; }).sort(function(a, b){ return C[b].gdp - C[a].gdp; });
function rank(ci){ return RANK.indexOf(ci) + 1; }
function price(ci){ return Math.round((800 + 7200 * Math.sqrt(C[ci].gdp / 32642)) / 10) * 10; }

// ===== 小工具 =====
function $m(id){ return document.getElementById(id); }
function h(s){ return (typeof esc === "function") ? esc(String(s)) : String(s).replace(/[&<>"']/g, function(c){ return "&#" + c.charCodeAt(0) + ";"; }); }
function money(x){ x = Math.round(x); return (x < 0 ? "-" : "") + Math.abs(x).toLocaleString(); }
function shuf(a){ a = a.slice(); for (var i = a.length - 1; i > 0; i--){ var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
function rpick(a){ return a[Math.floor(Math.random() * a.length)]; }
function oid(){ return otherId(); }
function pidx(id){ return PROFILES.findIndex(function(p){ return p.id === id; }); }
function pcol(id){ return pidx(id) === 0 ? "var(--pink)" : "var(--blue)"; }
function pbg(id){ return pidx(id) === 0 ? "var(--pink-bg)" : "var(--blue-bg)"; }

(function(){
  var css = document.createElement("style");
  css.textContent =
    "#mono-ov{position:fixed;inset:0;background:rgba(0,0,0,.35);z-index:9000;overflow:auto;padding:12px}" +
    "#mono-box{max-width:720px;margin:10px auto}" +
    ".mstrip{display:flex;gap:6px;overflow-x:auto;padding:8px 2px;margin:8px 0}" +
    ".mtile{flex:0 0 78px;border:2px solid var(--line);border-radius:10px;padding:6px 3px;text-align:center;font-size:12px;background:#fff;line-height:1.35}" +
    ".mtile .ic{font-size:22px;display:block}" +
    ".mtile.cur{box-shadow:0 0 0 3px var(--gold)}" +
    ".mtok{display:inline-block;width:20px;height:20px;border-radius:50%;color:#fff;font-size:11px;line-height:20px;margin:3px 1px 0}" +
    ".mdice{font-size:52px;letter-spacing:8px;text-align:center;line-height:1.2}" +
    ".mstat{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px}" +
    ".mstat>div{border-radius:10px;padding:8px 10px;font-size:13px;line-height:1.6}" +
    ".mo-toast{position:fixed;left:50%;transform:translateX(-50%);background:#222;color:#fff;padding:8px 14px;border-radius:8px;font-size:14px;z-index:9999;max-width:90%}" +
    "@keyframes mofly{0%{transform:translateY(0) scale(.5);opacity:1}100%{transform:translateY(-60vh) rotate(var(--r)) scale(1.3);opacity:0}}" +
    ".mo-p{position:fixed;bottom:15%;font-size:30px;pointer-events:none;z-index:9500;animation:mofly 1.8s ease-out forwards}" +
    "#mono-box input[type=number]{font-size:18px;padding:8px 10px;border:1px solid var(--line);border-radius:8px;width:150px}";
  document.head.appendChild(css);
})();

var toasts = 0;
function toast(s){
  var t = document.createElement("div");
  t.className = "mo-toast"; t.textContent = s;
  t.style.bottom = (24 + 46 * (toasts++ % 4)) + "px";
  document.body.appendChild(t);
  setTimeout(function(){ t.remove(); toasts = Math.max(0, toasts - 1); }, 3200);
}
function burst(){
  var em = ["🌸","⭐","🎉","✨","💰","🌟"];
  for (var i = 0; i < 24; i++) {
    var s = document.createElement("span");
    s.className = "mo-p"; s.textContent = rpick(em);
    s.style.left = (5 + Math.random() * 90) + "%";
    s.style.setProperty("--r", (Math.random() * 720 - 360) + "deg");
    s.style.animationDelay = (Math.random() * 0.4) + "s";
    document.body.appendChild(s);
    setTimeout((function(x){ return function(){ x.remove(); }; })(s), 2400);
  }
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

// ===== 状态 =====
var M = null, O = null, curPid = "", ready = false, listening = "", saveT = null;
var MS = 0, busy = false, lock = false, lastRoundT = 0, lastInd = "mfg";

function fresh(){
  return {v:1, pos:0, laps:0, cash:CFG.START_CASH, dice:CFG.START_DICE, rate:CFG.RATE_DEF, rolled:false, rateWin:false,
    own:{}, sent:0, taken:0, p2p:0, giftOut:0, giftIn:0, loanReq:null, credit:null, creditUsed:0, loanAnsT:0,
    jail:false, js:0, lastSettle:today(), lastAct:"", fl:{d:""}, log:[], news:null, ts:0};
}
function fix(x){
  var d = Object.assign(fresh(), x || {});
  if (!d.own) d.own = {};
  if (!d.fl) d.fl = {d:""};
  if (!Array.isArray(d.log)) d.log = [];
  return d;
}
function loadLocal(id){ try { var s = localStorage.getItem("jp-mono-" + id); return s ? JSON.parse(s) : null; } catch(e){ return null; } }

function saveM(){
  if (!M || !ready) return;
  M.ts = Date.now();
  var data = JSON.stringify(M), who = curPid;
  try { localStorage.setItem("jp-mono-" + who, data); } catch(e){}
  if (cloud && window.FB && room) {
    clearTimeout(saveT);
    saveT = setTimeout(function(){
      var o = {}; o["mono_" + who] = data;
      FB.setDoc(roomRef(), o, {merge:true}).catch(function(e){ console.error(e); });
    }, 500);
  }
}
function applyDoc(d){
  var me = d["mono_" + curPid], ot = d["mono_" + oid()];
  if (me) { try { var x = JSON.parse(me); if (!M || (x.ts || 0) > (M.ts || 0)) M = fix(x); } catch(e){} }
  if (ot) { try { O = fix(JSON.parse(ot)); } catch(e){} }
}
function init(){
  curPid = pid; ready = false;
  M = fix(loadLocal(pid));
  var o = loadLocal(oid()); O = o ? fix(o) : null;
  if (cloud && window.FB && room) {
    FB.getDoc(roomRef()).then(function(s){ if (s.exists()) applyDoc(s.data()); ready = true; afterSync(); })
      .catch(function(e){ console.error(e); ready = true; afterSync(); });
    if (listening !== room) {
      listening = room;
      FB.onSnapshot(roomRef(), function(s){
        if (!s.exists() || s.metadata.hasPendingWrites || !ready) return;
        applyDoc(s.data()); afterSync();
      });
    }
  } else { ready = true; afterSync(); }
}
function afterSync(){
  if (!M || !ready) return;
  var before = JSON.stringify(M);
  settle(); takeGifts(); resolve(); fl();
  if (JSON.stringify(M) !== before) saveM();
  refresh();
}

// ===== 钱、地产 =====
function effOf(P, Q){ return P.cash + (Q ? (Q.sent || 0) - (Q.taken || 0) : 0); }
function myCash(){ return effOf(M, O); }
function oCash(){ return O ? effOf(O, M) : 0; }
function payO(x){ M.cash -= x; M.sent = (M.sent || 0) + x; }
function rateEff(){ return Math.max(M.rate, O ? O.rate : 0); }
function ownerOf(ci){
  var a = M && M.own[ci], b = O && O.own[ci];
  if (a && b) {
    if (a.take && a.take === b.t) return curPid;   // 我收购了她的
    if (b.take && b.take === a.t) return oid();    // 她收购了我的
    return (a.t < b.t || (a.t === b.t && curPid < oid())) ? curPid : oid();
  }
  return a ? curPid : (b ? oid() : null);
}
function netOf(P, ci){ var v = price(ci), o = P && P.own[ci]; if (o) (o.inv || []).forEach(function(p){ v += p.val; }); return v; }
function resolve(){
  if (!O) return;
  Object.keys(M.own).forEach(function(k){
    var ci = +k;
    if (O.own[k] && ownerOf(ci) !== curPid) {
      if (O.own[k].take === M.own[k].t) {
        // 被对方收购：钱对方已经付过了，这里只交出地产
        delete M.own[k];
        log("🤝 " + C[ci].cap.n + " 被 " + nameOf(oid()) + " 以 " + money(O.own[k].paid || 0) + " 收购了");
        M.news = (M.news || []).concat(["🤝 " + C[ci].cap.n + " 被 " + nameOf(oid()) + " 以 " + money(O.own[k].paid || 0) + " 收购了，钱已到账"]);
      } else {
        // 两个人同时买：后买的退款
        var v = netOf(M, ci);
        M.cash += v; delete M.own[k];
        log("↩️ " + C[ci].cap.n + " 对方先买了，退回 " + money(v));
        toast("↩️ " + C[ci].cap.n + " 对方先买了，钱已退回");
      }
    }
  });
}
function takeGifts(){
  if (O && (O.giftOut || 0) > (M.giftIn || 0)) {
    var g = O.giftOut - (M.giftIn || 0); M.giftIn = O.giftOut;
    addDice(g, nameOf(oid()) + " 送你的");
  }
}
function log(s){ M.log.unshift(today().slice(5) + " " + s); M.log = M.log.slice(0, 40); }
function addDice(n, why){
  var b = M.dice; M.dice = Math.min(CFG.MAX_DICE, M.dice + n);
  var got = M.dice - b;
  if (got > 0) { toast("🎲 +" + got + " 次骰子：" + why); log("🎲 +" + got + " " + why); }
  else toast("🎲 骰子已经攒满 " + CFG.MAX_DICE + " 次啦，先去掷掉一些吧");
}
function fl(){
  var t = today();
  if (M.fl.d !== t) M.fl = {d:t, goal:0, rev:0, rounds:0, due:(typeof dueList === "function" ? dueList().length : 0)};
  return M.fl;
}

// ===== 每天结算：投资、利息、PK、骰子过期 =====
function settle(){
  var t = today();
  if (!M.lastSettle) M.lastSettle = t;
  if (M.lastSettle < t) {
    var d = M.lastSettle, n = 0, invB = 0, invA = 0, bank = 0, p2p = 0, pk = 0, OD = getData(oid());
    while (d < t && n < 60) {
      Object.keys(M.own).forEach(function(k){
        (M.own[k].inv || []).forEach(function(p){
          var g = IND[p.k] || IND.mfg; invB += p.val;
          p.val = Math.max(0, Math.round(p.val * (1 + g.lo + Math.random() * (g.hi - g.lo))));
          invA += p.val;
        });
      });
      var e = myCash();
      if (e < 0) { var i = Math.ceil(-e * CFG.BANK_RATE); M.cash -= i; bank += i; }
      if (M.p2p > 0 && (S.days[d] || 0) < CFG.GOAL) { var k2 = Math.ceil(M.p2p * CFG.P2P_RATE); M.p2p += k2; p2p += k2; }
      var me = {c:S.days[d] || 0, ok:(S.daysOk && S.daysOk[d]) || 0};
      var ot = {c:(OD.days && OD.days[d]) || 0, ok:(OD.daysOk && OD.daysOk[d]) || 0};
      if (me.c > 0 && winner(me, ot) === 0) pk++;
      d = addDays(d, 1); n++;
    }
    M.lastSettle = t;
    var news = [];
    if (invB) news.push("📈 投资结算：" + (invA >= invB ? "赚了 +" : "亏了 ") + money(invA - invB));
    if (bank) news.push("🏦 高利贷利息 -" + money(bank));
    if (p2p) news.push("💸 欠 " + nameOf(oid()) + " 的钱涨了利息 +" + money(p2p) + "（那天没做满 " + CFG.GOAL + " 题）");
    news.forEach(log);
    if (news.length) M.news = (M.news || []).concat(news);
    if (pk) addDice(pk, "PK 获胜 " + pk + " 天");
  }
  expire();
}
function lastPractice(){
  var b = M.lastAct || "";
  for (var k in S.days) if (S.days[k] > 0 && k > b) b = k;
  return b;
}
function expire(){
  var lp = lastPractice(); if (!lp) return;
  if (dayDiff(lp, today()) >= 4 && M.dice > 0) {
    log("😢 连续 3 天没做题，" + M.dice + " 次骰子清零了");
    M.news = (M.news || []).concat(["😢 连续 3 天没做题，攒的骰子清零了"]);
    M.dice = 0;
  }
}
function warnText(){
  var lp = lastPractice(), t = today();
  if (!lp || lp === t) return "";
  var gap = dayDiff(lp, t);
  if (gap === 3) return "⚠️ 已经 2 天没做题了！今天再不做，明天攒的骰子就清零！";
  if (gap === 2) return "⏰ 昨天没做题。连续 3 天不做题，骰子会清零哦。";
  return "";
}

// ===== 做题奖励 =====
function onAnswer(ok, src){
  if (!M || !ready) return;
  var f = fl(), st;
  M.lastAct = today();
  if (src === "main") st = S.streak;
  else { MS = ok ? MS + 1 : 0; st = MS; }
  if (ok) {
    if (myCash() < 0) { M.cash += 100; toast("💰 +100（还债中：每答对 1 题 +100）"); }
    else if (st > 0 && st % 3 === 0) { M.cash += 100; toast("💰 连对 " + st + " 题 +100"); }
    if (st > 0 && st % 5 === 0) addDice(1, "连对 " + st + " 题");
  }
  if (M.jail) {
    M.js = ok ? (M.js || 0) + 1 : 0;
    if (M.js >= 3) { M.jail = false; M.js = 0; log("🔓 连对 3 题出狱"); toast("🔓 连对 3 题，出狱啦！"); }
  }
  if (src === "main") {
    if (!f.goal && (S.days[today()] || 0) >= CFG.GOAL) { f.goal = 1; addDice(2, "今天做满 " + CFG.GOAL + " 题"); }
    if (!f.rev && f.due > 0 && typeof dueList === "function" && dueList().length === 0) { f.rev = 1; addDice(1, "今天的复习全部完成"); }
  }
  saveM(); refresh();
}
function onRound(id, s, n){
  if (!M || !ready || n < 5) return;
  var now = Date.now(); if (now - lastRoundT < 3000) return; lastRoundT = now;
  var f = fl(), nm = {"joshi":"助词练习", "ws-box":"听力/单词", "rv-box":"综合测试"}[id] || "小游戏";
  if (f.rounds < CFG.GAME_ROUNDS_PER_DAY) { f.rounds++; addDice(1, "完成一轮" + nm); }
  if (id === "joshi" && s / n >= 0.8) addDice(1, "助词获胜（" + s + "/" + n + "）");
  if (id === "rv-box" && s / n >= 0.7) addDice(1, "综合测试 70% 以上");
  M.lastAct = today(); saveM(); refresh();
}
function hookRecord(){
  if (typeof window.record !== "function" || window.record.__mono) return;
  var orig = window.record;
  var w = function(ok, cats){ var r = orig.apply(this, arguments); try { onAnswer(ok, "main"); } catch(e){ console.error(e); } return r; };
  w.__mono = true; window.record = w;
}
// 小游戏（助词 / 听力单词 / 综合测试）的答题
document.addEventListener("click", function(e){
  var b = e.target.closest && e.target.closest(".opt");
  if (!b || b.disabled || !b.closest("#joshi, #ws-box, #rv-box")) return;
  setTimeout(function(){
    if (b.classList.contains("right")) onAnswer(true, "mini");
    else if (b.classList.contains("wrong")) onAnswer(false, "mini");
  }, 0);
}, true);
// 小游戏一轮结束
var seenCel = new WeakSet();
new MutationObserver(function(muts){
  if (!M) return;
  muts.forEach(function(m){
    m.addedNodes.forEach(function(nd){
      if (nd.nodeType !== 1) return;
      var list = nd.matches(".celebrate") ? [nd] : Array.prototype.slice.call(nd.querySelectorAll(".celebrate"));
      list.forEach(function(el){
        if (seenCel.has(el)) return; seenCel.add(el);
        var box = el.closest("#joshi, #ws-box, #rv-box"); if (!box) return;
        var tx = el.textContent; if (!/本轮|综合测试/.test(tx)) return;
        var mm = tx.match(/(\d+)\s*\/\s*(\d+)/); if (mm) onRound(box.id, +mm[1], +mm[2]);
      });
    });
  });
}).observe(document.body, {childList:true, subtree:true});

// ===== 题库（机会卡、学校、问路） =====
function JL(i){ var a = window.JOSHI_L || JLD; return a[i] || 1; }
function distinct(arr, t, f){
  var seen = {}; seen[f(t)] = 1; var out = [];
  shuf(arr).forEach(function(x){ var v = f(x); if (!seen[v] && out.length < 3) { seen[v] = 1; out.push(x); } });
  return out;
}
function makeQ(kind){
  var L = curLesson(), W = window.WORDS2 || [], J = window.JOSHIQ || [], CF = (typeof CONF !== "undefined") ? CONF : [];
  var w = W.filter(function(x){ return !L || x[3] <= L; }); if (w.length < 4) w = W;
  var hasK = function(x){ return x[1] && x[1] !== x[0]; };
  var rd = w.filter(hasK); if (rd.length < 4) rd = W.filter(hasK);
  var jq = J.map(function(_, i){ return i; }).filter(function(i){ return !L || JL(i) <= L; });
  if (!jq.length) jq = J.map(function(_, i){ return i; });
  var cf = CF.length ? ((L && typeof poolByUnit === "function") ? poolByUnit(CF) : CF.map(function(_, i){ return i; })) : [];
  var kinds = [];
  if (w.length >= 4) kinds.push("mean");
  if (rd.length >= 4) kinds.push("read");
  if (jq.length) kinds.push("joshi");
  if (cf.length) kinds.push("conf");
  var k = (kind && kinds.indexOf(kind) >= 0) ? kind : rpick(kinds);
  if (!k) return null;
  if (k === "mean") {
    var t = rpick(w), ds = distinct(W, t, function(x){ return x[2]; });
    return {head:"这个词是什么意思？", q:h(t[1] || t[0]) + (hasK(t) ? ' <span class="muted">（' + h(t[0]) + '）</span>' : ''),
      o:[t].concat(ds).map(function(x){ return h(x[2]); }), a:0, ex:""};
  }
  if (k === "read") {
    var r = rpick(rd), rs = distinct(rd, r, function(x){ return x[0]; });
    return {head:"这个汉字怎么读？", q:h(r[1]), o:[r].concat(rs).map(function(x){ return h(x[0]); }), a:0, ex:h(r[1]) + " = " + h(r[2])};
  }
  if (k === "joshi") {
    var jj = J[rpick(jq)];
    return {head:"选出正确的助词", q:h(jj.s).replace("＿", '<span class="blank">　</span>'),
      o:jj.o.map(h), a:jj.o.indexOf(jj.a), ex:h(jj.zh) + "<br>" + h(jj.e)};
  }
  var c = CF[rpick(cf)];
  return {head:"易混淆：选出正确的一项", q:h(c.q).replace("＿＿", '<span class="blank">　？　</span>') + '<div class="muted" style="font-size:14px">' + c.zh + '</div>',
    o:c.o.map(h), a:c.a, ex:c.ex};
}
function quiz(n, reward, kind, title){
  lock = true; refresh();
  var i = 0, ok = 0;
  function next(){
    if (i >= n) {
      var g = ok * reward;
      if (g) M.cash += g;
      log(title + " 答对 " + ok + "/" + n + (g ? " +" + money(g) : ""));
      if (ok === n) burst();
      return finish(h(title) + '：答对 <b>' + ok + ' / ' + n + '</b>' + (g ? '，奖励 <b>+' + money(g) + '</b>！' : '，这次没有奖励，下次加油！'));
    }
    var q = makeQ(kind);
    if (!q) return finish("题库还没准备好。");
    var e = $m("mono-ev"), ord = shuf(q.o.map(function(_, k){ return k; }));
    e.innerHTML = '<div class="box" style="background:#fff;border:1px solid var(--line)"><div class="qtop">' + h(title) + ' · 第 ' + (i + 1) + ' / ' + n + ' 题</div>' +
      '<div class="qhead">' + q.head + '</div><div style="font-size:22px;margin:8px 0">' + q.q + '</div>' +
      ord.map(function(k){ return '<button class="opt" data-k="' + k + '">' + q.o[k] + '</button>'; }).join("") + '<div id="mo-qfb"></div></div>';
    e.querySelectorAll(".opt").forEach(function(b){
      b.onclick = function(){
        if (b.disabled) return;
        var right = +b.dataset.k === q.a; if (right) ok++;
        M.lastAct = today();
        e.querySelectorAll(".opt").forEach(function(x){ x.disabled = true; if (+x.dataset.k === q.a) x.classList.add("right"); });
        if (!right) b.classList.add("wrong");
        $m("mo-qfb").innerHTML = (right ? '<div class="ok-h">✅ 正确！</div>' : '<div class="ng-h">❌ 正确答案是「' + q.o[q.a] + '」</div>') +
          (q.ex ? '<div class="note">' + q.ex + '</div>' : '') +
          '<div class="btns"><button class="btn main" id="mo-qn">' + (i + 1 < n ? '下一题' : '看结果') + '</button></div>';
        $m("mo-qn").onclick = function(){ i++; next(); };
      };
    });
  }
  next();
}

// ===== 卡片 =====
function shock(k, r, name){
  var df = 0, cnt = 0;
  Object.keys(M.own).forEach(function(ci){
    (M.own[ci].inv || []).forEach(function(p){ if (p.k === k) { var nv = Math.round(p.val * (1 + r)); df += nv - p.val; p.val = nv; cnt++; } });
  });
  log(name + " " + IND[k].n + " " + (df >= 0 ? "+" : "") + money(df));
  finish(cnt ? name + '：你的' + IND[k].n + '投资 <b>' + (df >= 0 ? '+' : '') + money(df) + '</b>' : name + '，不过你没有' + IND[k].n + '投资，没受影响。');
}
var CHANCE = [
  {t:"📝 自己挑战", d:"答一道日语题，答对 +500，答错 0。", f:function(){ quiz(1, 500, null, "📝 自己挑战"); }},
  {t:"🔥 连环题", d:"连答 3 题，每答对一题 +200。", f:function(){ quiz(3, 200, null, "🔥 连环题"); }},
  {t:"🔤 读音挑战", d:"看汉字选读音，答对 +400。", f:function(){ quiz(1, 400, "read", "🔤 读音挑战"); }},
  {t:"🧩 助词挑战", d:"答对一道助词题 +300。", f:function(){ quiz(1, 300, "joshi", "🧩 助词挑战"); }},
  {t:"🎓 奖学金", d:"认真学习的奖励 +300。", f:function(){ M.cash += 300; log("🎓 奖学金 +300"); finish("🎓 奖学金 +300 到账！"); }},
  {t:"🎲 骰子礼包", d:"获得 2 次掷骰子机会。", f:function(){ addDice(2, "机会卡"); finish("🎲 多了 2 次掷骰子机会！"); }},
  {t:"🎫 免费机票", d:"免费飞到任意一个首都。", f:function(){ airport("", 0); }},
  {t:"🏁 直达起点", d:"直接前往起点，领工资。", f:function(){
    M.pos = 0; M.laps++; M.cash += CFG.SALARY; if (!O || O.laps >= M.laps) M.rateWin = true;
    log("🏁 直达起点 +" + CFG.SALARY); renderStrip(); finish("🏁 回到起点，领到 " + money(CFG.SALARY) + "！"); }}
];
var FATE = [
  {t:"🌪️ 台风来袭", d:"你所有的旅游业投资 -20%。", f:function(){ shock("tour", -0.2, "🌪️ 台风来袭"); }},
  {t:"🤖 科技突破", d:"你所有的科技投资 +15%。", f:function(){ shock("tech", 0.15, "🤖 科技突破"); }},
  {t:"🌾 大丰收", d:"你所有的农业投资 +10%。", f:function(){ shock("agri", 0.10, "🌾 大丰收"); }},
  {t:"⛽ 油价暴跌", d:"你所有的能源投资 -15%。", f:function(){ shock("energy", -0.15, "⛽ 油价暴跌"); }},
  {t:"💴 日元升值", d:"有东京的人，东京投资全部 +10%；没有东京就奖励 +200。", f:function(){
    if (ownerOf(0) === curPid && M.own[0]) {
      var df = 0; M.own[0].inv.forEach(function(p){ var nv = Math.round(p.val * 1.1); df += nv - p.val; p.val = nv; });
      log("💴 日元升值 东京 +" + money(df)); finish("💴 东京的投资增加了 +" + money(df) + "！");
    } else { M.cash += 200; log("💴 日元升值 +200"); finish("💴 换汇赚了一点，+200！"); } }},
  {t:"🚔 超速被抓", d:"直接进监狱。", f:function(){ goJail("🚔 超速被抓，进监狱！"); }},
  {t:"🎁 送对方骰子", d:"送给{O} 2 次掷骰子机会。", f:function(){
    M.giftOut = (M.giftOut || 0) + 2; log("🎁 送了对方 2 次骰子");
    finish("🎁 你送给 " + h(nameOf(oid())) + " 2 次掷骰子机会。好朋友一起进步！"); }},
  {t:"🍜 请客吃拉面", d:"请{O}吃拉面，付给她 300。", f:function(){ payO(300); log("🍜 请客 -300"); finish("🍜 请 " + h(nameOf(oid())) + " 吃了拉面，-300。"); }},
  {t:"🤒 感冒看医生", d:"付医药费 200。", f:function(){ M.cash -= 200; log("🤒 看医生 -200"); finish("🤒 看医生花了 200，多喝热水！"); }},
  {t:"⬅️ 迷路了", d:"后退 3 步。", f:function(){ M.pos = (M.pos - 3 + N) % N; renderStrip(); log("⬅️ 后退 3 步"); land(false); }},
  {t:"⚖️ 易混淆挑战", d:"答对 +300，答错 0。", f:function(){ quiz(1, 300, "conf", "⚖️ 易混淆挑战"); }}
];
function drawCard(list, title, extra){
  var c = rpick(list);
  ev('<div class="qhead">' + title + '</div><div class="celebrate">' + c.t + '</div><div>' + c.d.replace("{O}", h(nameOf(oid()))) + '</div>' + extra,
    [{t:"好的", main:1, f:c.f}]);
}

// ===== 界面 =====
function isOpen(){ return !!$m("mono-ov"); }
function openMono(){
  if (!ready || !M) { toast("正在连接，请稍等…"); return; }
  if (!isOpen()) {
    var ov = document.createElement("div");
    ov.id = "mono-ov";
    ov.innerHTML = '<div class="card" id="mono-box"><div id="mono-top"></div><div id="mono-strip" class="mstrip"></div><div id="mono-ev"></div><div id="mono-act" class="btns"></div></div>';
    document.body.appendChild(ov);
  }
  evHome();
}
function closeMono(){
  if (busy || lock) { toast("先把这一步做完再关闭哦"); return; }
  var ov = $m("mono-ov"); if (ov) ov.remove();
  if (M.news) { M.news = null; saveM(); }
  refresh();
}
function refresh(){ entry(); if (!isOpen()) return; renderTop(); renderStrip(); renderAct(); }

function tileName(i){
  var b = B[i];
  if (b.t === "sp") return SP[b.k].e + " " + SP[b.k].n;
  var c = C[b.c];
  return b.t === "cap" ? c.f + " " + c.cap.n : c.cs[b.j].e + " " + c.cs[b.j].n;
}
function statBox(id, P, cash){
  if (!P) return '<div style="background:#f1efe8"><b>' + h(nameOf(id)) + '</b><br><span class="muted">还没开始玩</span></div>';
  return '<div style="background:' + pbg(id) + ';color:' + pcol(id) + '"><b>' + h(nameOf(id)) + '</b>' + (P.jail ? ' 🏛️' : '') +
    '<br>💰 ' + money(cash) + (cash < 0 ? ' <b>（欠银行）</b>' : '') +
    '<br>🎲 ' + P.dice + ' 次 · 🏠 ' + Object.keys(P.own).length + ' 座首都' +
    '<br>第 ' + (P.laps + 1) + ' 圈 · ' + tileName(P.pos) +
    '<br>税率 ' + P.rate + '%' + (P.p2p > 0 ? ' · 欠对方 ' + money(P.p2p) : '') + '</div>';
}
function creditOffer(){
  return (M.loanReq && O && O.credit && O.credit.t === M.loanReq.t && O.credit.at > (M.creditUsed || 0)) ? O.credit : null;
}
function pendingCount(){
  return (O && O.loanReq && O.loanReq.t > (M.loanAnsT || 0) ? 1 : 0) + (creditOffer() ? 1 : 0);
}
function noticeHtml(){
  var s = "", on = h(nameOf(oid()));
  if (O && O.loanReq && O.loanReq.t > (M.loanAnsT || 0)) {
    var mx = Math.max(0, Math.floor(myCash()));
    s += '<div class="task">📬 ' + on + ' 想向你借 <b>' + money(O.loanReq.amt) + '</b> 金币（每天 0.5% 利息付给你，她当天做满 ' + CFG.GOAL + ' 题就免息）。<br>你愿意借给她多少？' +
      '<div class="inputrow"><input type="number" id="mo-lend" min="0" max="' + mx + '" value="' + Math.min(O.loanReq.amt, mx) + '">' +
      '<button class="btn main" id="mo-lend-ok">借出</button><button class="btn" id="mo-lend-no">拒绝</button></div>' +
      '<div class="muted">你现在最多能借 ' + money(mx) + '</div></div>';
  }
  var cr = creditOffer();
  if (cr) {
    if (cr.amt > 0) s += '<div class="task">💌 ' + on + ' 同意借给你最多 <b>' + money(cr.amt) + '</b>。你要借多少？' +
      '<div class="inputrow"><input type="number" id="mo-take" min="1" max="' + cr.amt + '" value="' + cr.amt + '">' +
      '<button class="btn main" id="mo-take-ok">借这么多</button><button class="btn" id="mo-take-no">不借了</button></div></div>';
    else s += '<div class="task">' + on + ' 这次没有借给你。 <button class="mini" id="mo-take-no">知道了</button></div>';
  } else if (M.loanReq) s += '<div class="muted">已向 ' + on + ' 申请借 ' + money(M.loanReq.amt) + '，等她回复…</div>';
  return s;
}
function bindNotices(){
  var a = $m("mo-lend-ok");
  if (a) a.onclick = function(){
    var mx = Math.max(0, Math.floor(myCash())), v = Math.max(0, Math.min(Math.floor(+$m("mo-lend").value || 0), mx));
    M.loanAnsT = O.loanReq.t; M.credit = {amt:v, t:O.loanReq.t, at:Date.now()};
    log("答应借给 " + nameOf(oid()) + " 最多 " + money(v)); saveM(); refresh();
  };
  var b = $m("mo-lend-no");
  if (b) b.onclick = function(){ M.loanAnsT = O.loanReq.t; M.credit = {amt:0, t:O.loanReq.t, at:Date.now()}; saveM(); refresh(); };
  var c = $m("mo-take-ok");
  if (c) c.onclick = function(){
    var cr = creditOffer(); if (!cr) return;
    var v = Math.max(0, Math.min(Math.floor(+$m("mo-take").value || 0), cr.amt));
    M.creditUsed = cr.at; M.loanReq = null;
    if (v > 0) { M.cash += v; M.taken = (M.taken || 0) + v; M.p2p = (M.p2p || 0) + v; log("💰 向 " + nameOf(oid()) + " 借了 " + money(v)); toast("💰 借到 " + money(v)); }
    saveM(); refresh();
  };
  var d = $m("mo-take-no");
  if (d) d.onclick = function(){ var cr = creditOffer(); if (cr) M.creditUsed = cr.at; M.loanReq = null; saveM(); refresh(); };
}
function renderTop(){
  var html = '<div class="dash-top"><div class="qhead">🎲 日语大富翁</div><button class="btn" id="mo-close">关闭</button></div>' +
    '<div class="mstat">' + statBox(curPid, M, myCash()) + statBox(oid(), O, oCash()) + '</div>' +
    '<div class="muted" style="margin-top:6px">过路费 = 首都净资产 × <b>' + rateEff() + '%</b>（两人税率中较高的那个）</div>';
  var w = warnText(); if (w) html += '<div class="hint">' + w + '</div>';
  if (M.news && M.news.length) html += '<div class="note">' + M.news.map(h).join("<br>") + '</div>';
  html += noticeHtml();
  $m("mono-top").innerHTML = html;
  $m("mo-close").onclick = closeMono;
  bindNotices();
}
function tok(id){ return '<span class="mtok" style="background:' + pcol(id) + '">' + h(nameOf(id).slice(0, 1)) + '</span>'; }
function renderStrip(){
  var el = $m("mono-strip"); if (!el) return;
  var s = "";
  for (var k = -2; k <= 10; k++) {
    var i = (M.pos + k + N) % N, b = B[i], ic, nm, sub = "", bd = "var(--line)";
    if (b.t === "sp") { ic = SP[b.k].e; nm = SP[b.k].n; }
    else if (b.t === "cap") {
      var c = C[b.c], ow = ownerOf(b.c); ic = c.f; nm = c.cap.n;
      sub = ow ? h(nameOf(ow)) : money(price(b.c)); if (ow) bd = pcol(ow);
    } else { var c2 = C[b.c], x = c2.cs[b.j]; ic = x.e; nm = x.n; sub = c2.n; }
    s += '<div class="mtile' + (k === 0 ? ' cur' : '') + '" style="border-color:' + bd + '"><span class="ic">' + ic + '</span>' + h(nm) +
      '<div class="muted" style="font-size:11px">' + sub + '</div>' + (M.pos === i ? tok(curPid) : '') + (O && O.pos === i ? tok(oid()) : '') + '</div>';
  }
  el.innerHTML = s;
  var cu = el.querySelector(".cur"); if (cu) el.scrollLeft = Math.max(0, cu.offsetLeft - el.offsetLeft - 90);
}
function renderAct(){
  var el = $m("mono-act"); if (!el) return;
  var off = busy || lock;
  el.innerHTML = '<button class="btn main" id="mo-roll" ' + (off || M.dice <= 0 ? 'disabled' : '') + '>🎲 掷骰子（还有 ' + M.dice + ' 次）</button>' +
    (M.jail ? '<button class="btn" id="mo-bail" ' + (off || myCash() < CFG.JAIL_FEE ? 'disabled' : '') + '>付 ' + CFG.JAIL_FEE + ' 出狱</button>' : '') +
    ['mo-props:🗺️ 首都', 'mo-loan:💰 借钱/还钱', 'mo-rate:⚙️ 税率', 'mo-how:🎯 怎么拿骰子', 'mo-log:📜 记录'].map(function(x){
      var p = x.split(":"); return '<button class="btn" id="' + p[0] + '" ' + (off ? 'disabled' : '') + '>' + p[1] + '</button>';
    }).join("");
  $m("mo-roll").onclick = roll;
  var bl = $m("mo-bail"); if (bl) bl.onclick = function(){ M.cash -= CFG.JAIL_FEE; M.jail = false; M.js = 0; log("🔓 付 " + CFG.JAIL_FEE + " 出狱"); finish("🔓 付了 " + CFG.JAIL_FEE + "，出狱啦！"); };
  $m("mo-props").onclick = propsPanel; $m("mo-loan").onclick = loanPanel; $m("mo-rate").onclick = ratePanel;
  $m("mo-how").onclick = howPanel; $m("mo-log").onclick = logPanel;
  var br = M.buyRight;
  if (br && !off && ownerOf(br.ci) === oid()) {
    var bb = document.createElement("button");
    bb.className = "btn"; bb.textContent = "🤝 收购 " + C[br.ci].cap.n;
    bb.onclick = function(){ buyoutOffer(br.ci, capHead(br.ci)); };
    el.insertBefore(bb, el.children[1]);
  }
function ev(html, btns){
  var e = $m("mono-ev"); if (!e) return;
  e.innerHTML = '<div class="box" style="background:#fff;border:1px solid var(--line)">' + html + '<div class="btns" id="mo-evb"></div></div>';
  var bb = $m("mo-evb");
  (btns || []).forEach(function(b){
    var x = document.createElement("button");
    x.className = "btn" + (b.main ? " main" : ""); x.textContent = b.t; if (b.dis) x.disabled = true;
    x.onclick = b.f; bb.appendChild(x);
  });
  e.querySelectorAll("[data-say]").forEach(function(x){ x.onclick = function(){ if (typeof speak === "function") speak(x.dataset.say); }; });
}
function evHome(){
  lock = false;
  ev('<div class="muted">' + (M.jail ? '你在监狱里：掷出两个相同点数、连对 3 题、或付 ' + CFG.JAIL_FEE + ' 就能出狱。'
    : '掷骰子出发吧！做题攒骰子：连对 5 题、每天做满 ' + CFG.GOAL + ' 题、完成复习、玩小游戏都能拿到。') + '</div>');
  refresh();
}
function finish(html){ lock = false; ev(html, [{t:"好的", main:1, f:evHome}]); saveM(); refresh(); }

// ===== 掷骰子、移动、落地 =====
var FACES = ["⚀","⚁","⚂","⚃","⚄","⚅"];
function roll(){
  if (busy || lock || M.dice <= 0) return;
  busy = true; M.dice--; M.rolled = true; M.rateWin = false; M.news = null; M.buyRight = null;
  var a = 1 + Math.floor(Math.random() * 6), b = 1 + Math.floor(Math.random() * 6), k = 0;
  refresh();
  var e = $m("mono-ev");
  var t = setInterval(function(){
    k++;
    e.innerHTML = '<div class="mdice">' + rpick(FACES) + rpick(FACES) + '</div>';
    if (k >= 8) {
      clearInterval(t);
      e.innerHTML = '<div class="mdice">' + FACES[a - 1] + FACES[b - 1] + '</div><div style="text-align:center">掷出 <b>' + (a + b) + '</b> 点' + (a === b ? '（两个一样！）' : '') + '</div>';
      setTimeout(function(){ afterRoll(a, b); }, 500);
    }
  }, 80);
}
function afterRoll(a, b){
  if (M.jail) {
    if (a === b) { M.jail = false; M.js = 0; log("🔓 掷出相同点数出狱"); toast("🔓 掷出相同点数，出狱啦！"); walk(a + b); }
    else { busy = false; log("🏛️ 没掷出相同点数"); finish('🏛️ 没有掷出相同点数，还在监狱里。<br>连对 3 题或者付 ' + CFG.JAIL_FEE + ' 也能出狱。'); }
    return;
  }
  walk(a + b);
}
function walk(n){
  var passed = false;
  (function step(){
    if (n <= 0) { busy = false; land(passed); return; }
    M.pos = (M.pos + 1) % N; n--;
    if (M.pos === 0) {
      passed = true; M.laps++; M.cash += CFG.SALARY;
      toast("🏁 经过起点，领工资 +" + money(CFG.SALARY));
      log("🏁 经过起点 +" + CFG.SALARY + "（进入第 " + (M.laps + 1) + " 圈）");
      if (!O || O.laps >= M.laps) M.rateWin = true;
    }
    renderStrip();
    setTimeout(step, 110);
  })();
}
function land(passed){
  var b = B[M.pos]; lock = true; refresh();
  var extra = passed && M.rateWin ? '<div class="cheer">🏁 你经过了起点，而且 ' + h(nameOf(oid())) + ' 的圈数不比你少，现在可以调整过路费税率（关掉这一步后点 ⚙️ 税率，下次掷骰子前有效）。</div>' : '';
  if (b.t === "cap") return landCap(b.c, extra);
  if (b.t === "city") return landCity(b.c, b.j, extra);
  switch (b.k) {
    case "START": return finish('🏁 正好停在起点！' + extra);
    case "CHANCE": return drawCard(CHANCE, "❓ 机会", extra);
    case "FATE": return drawCard(FATE, "🔮 命运", extra);
    case "PARK":
      if (Math.random() < 0.5) { var g = 100 + Math.floor(Math.random() * 3) * 100; M.cash += g; log("🌳 公园捡到 " + g); return finish('🌳 在公园散步，捡到了 <b>' + g + '</b> 金币！' + extra); }
      return finish('🌳 在公园的长椅上休息一下，看看风景。' + extra);
    case "SCHOOL": return ev('<div class="qhead">🏫 日语学校</div>连答 3 题，每答对一题奖励 200。' + extra, [{t:"开始答题", main:1, f:function(){ quiz(3, 200, null, "🏫 日语学校"); }}]);
    case "AIR": return airport(extra, CFG.AIR_FEE);
    case "JAIL": return finish('🏛️ 只是路过参观监狱，不用担心。' + extra);
    case "POLICE": return goJail('🚔 被警察带走了！直接进监狱。' + extra);
  }
  finish("继续旅行！");
}
function goJail(msg){
  M.jail = true; M.js = 0; M.pos = JAIL_POS; log("🚔 进监狱"); renderStrip();
  finish(msg + '<br>出狱方法：掷出两个相同点数、连对 3 题、或付 ' + CFG.JAIL_FEE + '。');
}
function wordHtml(w){
  return '<div class="row"><span class="lbl">日语</span><b>' + h(w[0]) + '</b> = ' + h(w[1]) + ' <button class="mini" data-say="' + h(w[0]) + '">🔊</button></div>';
}
function capHead(ci){
  var c = C[ci];
  return '<div class="qhead">' + c.f + ' ' + h(c.cap.n) + ' <span class="muted">（' + h(c.n) + '首都）</span></div><div>' + h(c.cap.i) + '</div>' +
    wordHtml(c.cap.w) + '<div class="muted">世界 GDP 第 ' + rank(ci) + ' 名 · 地价 ' + money(price(ci)) + '</div>';
}
function landCap(ci, extra){
  var ow = ownerOf(ci), p = price(ci), hd = capHead(ci) + extra;
  if (!ow) {
    var can = myCash() >= p;
    return ev(hd + '<div class="row">这座首都还没有主人，要买下吗？' + (can ? '' : '<br><span class="err">钱不够（现在有 ' + money(myCash()) + '）</span>') + '</div>', [
      {t:"买下（" + money(p) + "）", main:1, dis:!can, f:function(){
        M.cash -= p; M.own[ci] = {t:Date.now(), inv:[]}; log("🏠 买下 " + C[ci].cap.n + " -" + money(p)); burst();
        finish('🎉 恭喜！<b>' + h(C[ci].cap.n) + '</b> 是你的了！以后 ' + h(nameOf(oid())) + ' 路过要付过路费。<br>走到这里或这个国家的城市时，可以追加投资，让过路费更贵。'); }},
      {t:"不买", f:function(){ finish("没有买，继续旅行。"); }}]);
  }
  if (ow === curPid) {
    return ev(hd + '<div class="cheer">这是你的首都！净资产 ' + money(netOf(M, ci)) + '，别人路过要付 ' + money(Math.round(netOf(M, ci) * rateEff() / 100)) + '。</div>', [
      {t:"💼 追加投资", main:1, f:function(){ investPanel(ci); }},
      {t:"先不投资", f:function(){ finish("下次再来投资。"); }}]);
  }
  var r = rateEff(), net = netOf(O, ci), toll = Math.max(1, Math.round(net * r / 100));
  payO(toll); log("💸 在 " + C[ci].cap.n + " 付过路费 " + money(toll));
  var msg = hd + '<div class="diag">这是 ' + h(nameOf(oid())) + ' 的首都！净资产 ' + money(net) + ' × ' + r + '% = 过路费 <b>' + money(toll) + '</b></div>';
  if (myCash() < 0) msg += '<div class="hint">钱不够，变成欠银行 ' + money(-myCash()) + '（每天 1% 利息）。现在<b>每答对 1 题就 +100</b>，快去做题还债！也可以向 ' + h(nameOf(oid())) + ' 借钱（每天 0.5%，当天做满 ' + CFG.GOAL + ' 题免息）。</div>';
  buyoutOffer(ci, msg);
}
  // ===== 收购对方的首都 =====
function bpOf(ci){ return Math.round(netOf(O, ci) * (1 + CFG.BUYOUT_PREMIUM)); }
function buyoutOffer(ci, msg){
  M.buyRight = {ci:ci, t:Date.now()};
  var p = bpOf(ci), mc = myCash(), on = h(nameOf(oid())), gap = p - mc;
  var html = msg + '<div class="task">🤝 <b>你可以收购这座首都！</b><br>' +
    '收购价 = 净资产 ' + money(netOf(O, ci)) + ' × ' + Math.round((1 + CFG.BUYOUT_PREMIUM) * 100) + '% = <b>' + money(p) + '</b><br>' +
    '必须连同里面的投资一起买，一次付清，不能分期。<br>你现在有 ' + money(mc) + '。' +
    (gap > 0 ? '还差 <b>' + money(gap) + '</b>：可以向银行借高利贷补上（最多 ' + money(CFG.BUYOUT_BANK_MAX) + '，每天 1%），或者先向 ' + on + ' 借钱。' : '') +
    '<br><span class="muted">收购权到你下次掷骰子前都有效。</span></div>';
  var btns = [];
  if (gap <= 0) btns.push({t:"🤝 用现金收购（" + money(p) + "）", main:1, f:function(){ doBuyout(ci, false); }});
  else if (mc - p >= -CFG.BUYOUT_BANK_MAX) btns.push({t:"🏦 借高利贷 " + money(gap) + " 收购", main:1, f:function(){ doBuyout(ci, true); }});
  else btns.push({t:"差太多，借高利贷也不够", dis:true, f:function(){}});
  btns.push({t:"💰 去向 " + nameOf(oid()) + " 借钱", f:loanPanel});
  btns.push({t:"不收购", f:evHome});
  lock = false;
  ev(html, btns); saveM(); refresh();
}
function doBuyout(ci, useBank){
  if (!M.buyRight || M.buyRight.ci !== ci || ownerOf(ci) !== oid()) return finish("现在不能收购这座首都了。");
  var p = bpOf(ci), mc = myCash();
  if (mc < p && (!useBank || mc - p < -CFG.BUYOUT_BANK_MAX)) return finish("钱不够，不能收购。");
  var src = O.own[ci];
  payO(p);   // 一次付清，对方马上到账
  M.own[ci] = {t:Date.now(), take:src.t, paid:p,
    inv:(src.inv || []).map(function(x){ return {k:x.k, amt:x.val, val:x.val}; })};
  M.buyRight = null;
  log("🤝 以 " + money(p) + " 收购了 " + C[ci].cap.n + (mc < p ? "（借高利贷 " + money(p - mc) + "）" : ""));
  burst();
  finish('🎉 收购成功！<b>' + h(C[ci].cap.n) + '</b> 连同里面的投资都是你的了。' +
    (myCash() < 0 ? '<div class="hint">现在欠银行 ' + money(-myCash()) + '，每天 1% 利息。欠债期间每答对 1 题 +100，快去做题还债！</div>' : ''));

}
function landCity(ci, j, extra){
  var c = C[ci], x = c.cs[j];
  var hd = '<div class="qhead">' + x.e + ' ' + h(x.n) + ' <span class="muted">（' + c.f + ' ' + h(c.n) + '）</span></div><div>' + h(x.i) + '</div>' + wordHtml(x.w) + extra;
  if (ownerOf(ci) === curPid) {
    var bn = Math.max(50, Math.round(netOf(M, ci) * 0.03));
    M.cash += bn; log("💰 " + x.n + " 老板分红 +" + money(bn));
    return ev(hd + '<div class="cheer">' + h(c.cap.n) + ' 是你的首都，银行给你分红 <b>+' + money(bn) + '</b>！</div>', [
      {t:"💼 去投资 " + c.cap.n, f:function(){ investPanel(ci); }},
      {t:"好的", main:1, f:function(){ finish("继续旅行！"); }}]);
  }
  if (Math.random() < 0.4) {
    return ev(hd + '<div class="task">🗺️ 当地人问你一道日语题，答对奖励 100。</div>', [{t:"答题", main:1, f:function(){ quiz(1, 100, null, "🗺️ 问路小测"); }}]);
  }
  M.cash += 50; log("📍 " + x.n + " 打卡 +50");
  finish(hd + '<div class="cheer">📍 打卡成功 +50！</div>');
}
function airport(extra, fee){
  var can = myCash() >= fee;
  var opts = C.map(function(c, i){ var ow = ownerOf(i); return '<option value="' + i + '">' + c.f + ' ' + c.cap.n + (ow ? '（' + nameOf(ow) + '）' : '（' + money(price(i)) + '）') + '</option>'; }).join("");
  ev('<div class="qhead">✈️ ' + (fee ? '国际机场' : '免费机票') + '</div>' + (fee ? '付 ' + fee + ' 可以飞到任意一个首都。' : '选一个想去的首都：') + extra +
    '<div><select id="mo-fly">' + opts + '</select></div>', [
    {t:fee ? "起飞（" + fee + "）" : "起飞", main:1, dis:!can, f:function(){
      var ci = +$m("mo-fly").value; M.cash -= fee; M.pos = capPos(ci);
      log("✈️ 飞到 " + C[ci].cap.n); renderStrip(); toast("✈️ 到达 " + C[ci].cap.n); landCap(ci, ""); }},
    {t:"不飞了", f:function(){ finish("留在原地，继续旅行。"); }}]);
}
function investPanel(ci){
  lock = true; refresh();
  var own = M.own[ci]; if (!own) return finish("这里不是你的首都。");
  var list = (own.inv || []).map(function(p, i){
    var g = IND[p.k] || IND.mfg, d = p.val - p.amt;
    return '<div class="ex">' + g.n + ' 投入 ' + money(p.amt) + ' → 现在 <b>' + money(p.val) + '</b> <span style="color:' + (d >= 0 ? 'var(--accent)' : 'var(--ng)') + '">' + (d >= 0 ? '+' : '') + money(d) + '</span> <button class="mini" data-sell="' + i + '">撤资</button></div>';
  }).join("") || '<div class="muted">还没有投资。</div>';
  var opts = Object.keys(IND).map(function(k){ var g = IND[k]; return '<option value="' + k + '"' + (k === lastInd ? ' selected' : '') + '>' + g.n + '（每天 ' + Math.round(g.lo * 100) + '% ～ +' + Math.round(g.hi * 100) + '%）</option>'; }).join("");
  ev('<div class="qhead">💼 ' + C[ci].f + ' ' + h(C[ci].cap.n) + ' 的投资</div><div class="muted">投资让首都净资产变高，过路费也跟着变贵。每天第一次打开时结算赚赔，风险越大起伏越大。</div>' + list +
    '<div class="row">选行业：<select id="mo-ind">' + opts + '</select></div><div class="muted">你现在有 ' + money(myCash()) + '</div>',
    [500, 1000, 2000, 5000].map(function(a){
      return {t:"投 " + money(a), dis:myCash() < a, f:function(){
        var k = $m("mo-ind").value; lastInd = k;
        M.cash -= a; own.inv.push({k:k, amt:a, val:a});
        log("💼 " + C[ci].cap.n + " 投资" + IND[k].n + " " + money(a)); saveM(); investPanel(ci); }};
    }).concat([{t:"完成", main:1, f:function(){ finish("投资完成！" + h(C[ci].cap.n) + " 净资产 " + money(netOf(M, ci)) + "。"); }}]));
  $m("mono-ev").querySelectorAll("[data-sell]").forEach(function(x){
    x.onclick = function(){
      var i = +x.dataset.sell, p = own.inv[i]; if (!p) return;
      M.cash += p.val; own.inv.splice(i, 1);
      log("撤资 " + (IND[p.k] || IND.mfg).n + " +" + money(p.val)); saveM(); investPanel(ci);
    };
  });
}

// ===== 面板 =====
function propsPanel(){
  var rows = C.map(function(c, i){
    var ow = ownerOf(i), P = ow === curPid ? M : (ow ? O : null), net = P ? netOf(P, i) : 0;
    return '<tr><td>' + c.f + ' ' + h(c.cap.n) + '<div class="muted">GDP 第 ' + rank(i) + '</div></td><td>' + money(price(i)) + '</td><td>' +
      (ow ? '<b style="color:' + pcol(ow) + '">' + h(nameOf(ow)) + '</b>' : '—') + '</td><td>' + (ow ? money(net) : '') + '</td><td>' +
      (ow ? money(Math.round(net * rateEff() / 100)) : '') + '</td></tr>';
  }).join("");
  ev('<div class="qhead">🗺️ 全部首都（按路线顺序）</div><table><tr><th>首都</th><th>地价</th><th>主人</th><th>净资产</th><th>过路费</th></tr>' + rows + '</table>',
    [{t:"返回", main:1, f:evHome}]);
}
function loanPanel(){
  var mc = myCash(), on = nameOf(oid()), btn = [];
  var canPay = Math.max(0, Math.min(M.p2p || 0, Math.floor(mc)));
  var html = '<div class="qhead">💰 借钱 / 还钱</div><div class="row">你的现金：<b>' + money(mc) + '</b></div>';
  if (mc < 0) html += '<div class="hint">欠银行高利贷 ' + money(-mc) + '，每天 1% 利息。欠债期间每答对 1 题 +100，直到回正。</div>';
  html += '<div class="row">你欠 ' + h(on) + '：<b>' + money(M.p2p || 0) + '</b>（每天 0.5%，当天做满 ' + CFG.GOAL + ' 题免息）</div>';
  if (O && O.p2p > 0) html += '<div class="row">' + h(on) + ' 欠你：<b>' + money(O.p2p) + '</b></div>';
  if (!M.loanReq) html += '<div class="row">想向 ' + h(on) + ' 借多少？<input type="number" id="mo-req" min="100" step="100" value="2000"></div>';
  else html += '<div class="muted">已经申请借 ' + money(M.loanReq.amt) + '，等 ' + h(on) + ' 回复。</div>';
  if (M.p2p > 0) html += '<div class="row">还多少？（最多 ' + money(canPay) + '）<input type="number" id="mo-pay" min="1" value="' + canPay + '"></div>';
  if (!M.loanReq) btn.push({t:"申请借钱", main:1, f:function(){
    var v = Math.floor(+$m("mo-req").value || 0); if (v < 100) { toast("最少借 100"); return; }
    M.loanReq = {amt:v, t:Date.now()}; log("📮 向 " + on + " 申请借 " + money(v)); saveM(); toast("申请已发送"); loanPanel(); }});
  else btn.push({t:"取消申请", f:function(){ M.loanReq = null; saveM(); loanPanel(); }});
  function repay(v){
    var mx = Math.max(0, Math.min(M.p2p || 0, Math.floor(myCash()))); v = Math.max(0, Math.min(v, mx));
    if (!v) { toast("现在没有钱可以还"); return; }
    payO(v); M.p2p -= v; log("💸 还给 " + on + " " + money(v)); saveM(); toast("已还 " + money(v)); loanPanel();
  }
  if (M.p2p > 0) {
    btn.push({t:"还这么多", f:function(){ repay(Math.floor(+$m("mo-pay").value || 0)); }});
    btn.push({t:"能还多少还多少", f:function(){ repay(M.p2p); }});
  }
  btn.push({t:"返回", f:evHome});
  ev(html, btn);
}
function ratePanel(){
  var on = h(nameOf(oid())), can = M.rateWin || !M.rolled;
  var html = '<div class="qhead">⚙️ 过路费税率</div><div class="row">你：<b>' + M.rate + '%</b>　' + on + '：<b>' + (O ? O.rate + '%' : '—') + '</b>　现在按 <b>' + rateEff() + '%</b> 收</div>' +
    '<div class="muted">过路费 = 首都净资产 × 两人税率中较高的那个。你定得越高，别人付你越多，你去别人那也付越多。</div>';
  if (can) {
    html += '<div class="row">新的税率（' + CFG.RATE_MIN + '～' + CFG.RATE_MAX + '%）：<input type="number" id="mo-r" min="' + CFG.RATE_MIN + '" max="' + CFG.RATE_MAX + '" value="' + M.rate + '"></div>';
    ev(html, [{t:"保存", main:1, f:function(){
      var v = Math.max(CFG.RATE_MIN, Math.min(CFG.RATE_MAX, Math.round(+$m("mo-r").value || M.rate)));
      M.rate = v; if (M.rolled) M.rateWin = false;
      log("⚙️ 税率改成 " + v + "%"); saveM(); toast("税率已改成 " + v + "%"); evHome(); }}, {t:"返回", f:evHome}]);
  } else {
    html += '<div class="hint">现在不能改。要等你经过起点，而且 ' + on + ' 走的圈数不比你少（你第 ' + (M.laps + 1) + ' 圈，' + on + ' 第 ' + (O ? O.laps + 1 : 1) + ' 圈）。<br>经过起点后，要在下一次掷骰子前改好。</div>';
    ev(html, [{t:"返回", main:1, f:evHome}]);
  }
}
function howPanel(){
  var f = fl(), t = today(), dn = S.days[t] || 0, due = typeof dueList === "function" ? dueList().length : 0;
  function r(a, b, c){ return '<tr><td>' + a + '</td><td><b>' + b + '</b></td><td class="muted">' + c + '</td></tr>'; }
  ev('<div class="qhead">🎯 怎么拿骰子（最多攒 ' + CFG.MAX_DICE + ' 次）</div><table>' +
    r("连对 5 题（练习、小游戏都算）", "+1", "每连对 5 题一次") +
    r("今天做满 " + CFG.GOAL + " 题（复习题也算）", "+2", dn + " / " + CFG.GOAL + (f.goal ? " ✅" : "")) +
    r("今天到期的复习全部做完", "+1", f.rev ? "✅ 已拿到" : (f.due > 0 ? "还剩 " + due + " 题" : "今天没有到期复习")) +
    r("玩完一轮小游戏（5 题以上）", "+1", "今天 " + f.rounds + " / " + CFG.GAME_ROUNDS_PER_DAY) +
    r("助词一轮正确率 80% 以上", "+1", "额外奖励") +
    r("综合测试正确率 70% 以上", "+1", "额外奖励") +
    r("前一天 PK 赢了", "+1", "第二天打开时发") +
    r("机会卡、对方送的", "+2", "") + '</table>' +
    '<h3>金币</h3><div>连对 3 题 +100；欠债时每答对 1 题 +100；经过起点 +' + money(CFG.SALARY) + '。</div>' +
    '<div class="hint">骰子可以一直攒着，但<b>连续 3 天不做题就清零</b>。</div>', [{t:"返回", main:1, f:evHome}]);
}
function logPanel(){
  ev('<div class="qhead">📜 最近记录</div>' + (M.log.length ? M.log.map(function(x){ return '<div class="ex">' + h(x) + '</div>'; }).join("") : '<div class="muted">还没有记录。</div>'),
    [{t:"返回", main:1, f:evHome}]);
}

// ===== 首页入口卡片、隐藏旧的环游世界 =====
function entry(){
  var dash = $m("dash"); if (!dash || !M || !ready) return;
  var e = $m("mono-card");
  if (!e) {
    e = document.createElement("div");
    e.id = "mono-card"; e.className = "card"; e.style.cursor = "pointer"; e.onclick = openMono;
    dash.parentNode.insertBefore(e, dash.nextSibling);
  }
  var notes = [], w = warnText(), pc = pendingCount();
  if (w) notes.push(w);
  if (pc) notes.push("📬 有 " + pc + " 条借钱消息");
  var html = '<div class="dash-top"><div><b>🎲 日语大富翁</b><div class="muted">' + (M.jail ? '🏛️ 在监狱里 · ' : '') + '第 ' + (M.laps + 1) + ' 圈 · ' + tileName(M.pos) + '</div></div>' +
    '<div style="text-align:right"><div class="dash-big">🎲 × ' + M.dice + '</div><div class="muted">💰 ' + money(myCash()) + '</div></div></div>' +
    notes.map(function(n){ return '<div class="hint">' + n + '</div>'; }).join("") +
    '<div class="btns"><button class="btn main">进入大富翁</button></div>';
  if (e._h !== html) { e._h = html; e.innerHTML = html; }
}
function hideTravel(){
  var core = ["q","res","pk","dash","mastery","cal","units","plan","mono-card","mono-map"];
  document.querySelectorAll("#main h3, #main summary, #main .qhead, #main b").forEach(function(x){
    if (/环游世界|世界跑道/.test(x.textContent)) {
      var c = x.closest(".card");
      if (c && core.indexOf(c.id) < 0) c.style.display = "none";
    }
  });
}
// 给地图用：把大富翁的状态开放出去（只读）
window.MONO = {st:function(){ return (M && ready) ? {M:M, O:O, B:B, C:C, N:N, me:curPid, other:oid(), owner:ownerOf, tileName:tileName} : null; }};
// ===== 主循环 =====
setInterval(function(){
  if (typeof setup === "undefined" || setup || typeof S !== "object" || !S || typeof pid !== "string") return;
  hookRecord();
  if (curPid !== pid) { init(); return; }
  if (!ready) return;
  if (!cloud) { var o = loadLocal(oid()); O = o ? fix(o) : null; }
  var t = today();
  if (M.fl.d !== t || M.lastSettle !== t) { fl(); settle(); saveM(); }
  entry(); hideTravel();
}, 1000);

})();
