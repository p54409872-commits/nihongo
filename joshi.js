// joshi.js — 助词练习（独立模块）
// JOSHIQ 只能在最后追加，不能删除、不能调换顺序（错题按位置记录）
(function(){
window.JOSHIQ = [
{s:"わたし＿マリアです。",a:"は",o:["は","が","を","に"],zh:"我是玛丽亚。",e:"「は」提示话题：说到“我”嘛，是玛丽亚。自我介绍的基本句型 AはBです。"},
{s:"これ＿わたしの本です。",a:"は",o:["は","を","に","で"],zh:"这是我的书。",e:"「は」把“这个”拿出来当话题，后面加以说明。"},
{s:"あれは だれ＿かさですか。",a:"の",o:["の","が","を","と"],zh:"那是谁的伞？",e:"「の」表示所属：だれのかさ = 谁的伞。"},
{s:"これは 日本＿車です。",a:"の",o:["の","で","に","へ"],zh:"这是日本的车。",e:"「の」连接两个名词，这里表示产地。"},
{s:"（わたしは学生です。）ミラーさん＿学生です。",a:"も",o:["も","は","が","と"],zh:"米勒先生也是学生。",e:"「も」=“也”，表示和前面说的情况相同。"},
{s:"毎朝 6時＿起きます。",a:"に",o:["に","で","を","へ"],zh:"每天早上6点起床。",e:"具体的时间点用「に」。注意：毎朝、今日、明日 这类词后面不加「に」。"},
{s:"9時＿5時まで 働きます。",a:"から",o:["から","まで","より","に"],zh:"从9点工作到5点。",e:"「から」表示起点，「まで」表示终点。"},
{s:"銀行は 9時から 3時＿です。",a:"まで",o:["まで","から","に","で"],zh:"银行从9点开到3点。",e:"「まで」表示到什么时候为止。"},
{s:"京都＿行きます。",a:"へ",o:["へ","を","で","が"],zh:"去京都。",e:"「へ」表示移动的方向。行く・来る・帰る 的目的地用「へ」（也可以用「に」）。"},
{s:"電車＿会社へ 行きます。",a:"で",o:["で","に","を","と"],zh:"坐电车去公司。",e:"「で」表示手段、交通工具。注意：走路是「歩いて」，不加「で」。"},
{s:"友達＿日本へ 来ました。",a:"と",o:["と","で","に","を"],zh:"和朋友一起来了日本。",e:"「と」表示一起做事的人。一个人做的时候用「ひとりで」。"},
{s:"パン＿食べます。",a:"を",o:["を","が","に","で"],zh:"吃面包。",e:"「を」表示动作的对象（宾语）。"},
{s:"駅＿新聞を 買います。",a:"で",o:["で","に","を","へ"],zh:"在车站买报纸。",e:"做动作的场所用「で」。「に」是存在的场所，两者不要混。"},
{s:"わたしは 日本語＿わかります。",a:"が",o:["が","を","は","に"],zh:"我懂日语。",e:"わかる、好き、上手、ある 这类表示能力、喜好、拥有的词，对象用「が」，不用「を」。"},
{s:"わたしは 犬＿好きです。",a:"が",o:["が","を","に","で"],zh:"我喜欢狗。",e:"好き・嫌い 的对象用「が」。"},
{s:"机の 上＿猫が います。",a:"に",o:["に","で","を","へ"],zh:"桌子上有只猫。",e:"存在的场所用「に」（います・あります）。"},
{s:"あそこ＿男の人が います。",a:"に",o:["に","で","は","を"],zh:"那边有个男人。",e:"「场所に 人/物が います/あります」是固定句型。"},
{s:"橋＿渡ります。",a:"を",o:["を","で","に","が"],zh:"过桥。",e:"移动时经过的地方用「を」：橋を渡る、道を歩く、公園を散歩する。"},
{s:"7時に うち＿出ます。",a:"を",o:["を","から","に","で"],zh:"7点出门。",e:"离开的地方用「を」：うちを出る、大学を卒業する。"},
{s:"次の 駅で 電車＿降ります。",a:"を",o:["を","に","で","が"],zh:"在下一站下电车。",e:"「降りる」用「を」（从交通工具离开），「乗る」用「に」。"},
{s:"バス＿乗ります。",a:"に",o:["に","を","で","へ"],zh:"上公交车。",e:"「乗る」的对象用「に」：バスに乗る。可以对照上一题「を降りる」一起记。"},
{s:"田中さん＿電話を かけます。",a:"に",o:["に","を","と","で"],zh:"给田中打电话。",e:"动作的对象（给谁）用「に」：人に電話をかける、人にあげる。"},
{s:"木村さん＿花を もらいました。",a:"に",o:["に","を","で","が"],zh:"从木村那里收到了花。",e:"もらう 的“从谁那里”用「に」，也可以用「から」。"},
{s:"りんご＿みかんを 買いました。",a:"や",o:["や","を","で","が"],zh:"买了苹果、橘子等。",e:"「や」是不完全列举（还有别的）；「と」是全部列举。"},
{s:"東京は ソウル＿寒いです。",a:"より",o:["より","から","まで","ほど"],zh:"东京比首尔冷。",e:"「AはBより～」= A比B更～。「ほど」要和否定一起用：BほどＸくない。"},
{s:"雨が 降っています＿、傘を 持って行きます。",a:"から",o:["から","まで","より","けど"],zh:"在下雨，所以带伞去。",e:"句子后面的「から」表示原因、理由。"},
{s:"何＿食べませんか。",a:"か",o:["か","も","を","が"],zh:"要不要吃点什么？",e:"疑问词+「か」=“某个”：何か（什么东西）、だれか（某人）。"},
{s:"だれ＿来ませんでした。",a:"も",o:["も","か","が","を"],zh:"谁也没来。",e:"疑问词+「も」+否定 = 全部否定：だれも、何も、どこも。"},

{s:"毎日 図書館＿勉強します。",a:"で",o:["で","に","を","へ"],zh:"每天在图书馆学习。",e:"做动作（勉強する）的场所用「で」。"},
{s:"この 町＿住んでいます。",a:"に",o:["に","で","を","へ"],zh:"住在这个城市。",e:"住む 是“待在某处”的状态，用「に」：〜に住んでいます。"},
{s:"雨＿降っています。",a:"が",o:["が","は","を","に"],zh:"在下雨。",e:"眼前看到的现象、新信息用「が」描述。"},
{s:"ドア＿開きました。",a:"が",o:["が","を","に","で"],zh:"门开了。",e:"自动词（開く）：主语+「が」。门自己开了。"},
{s:"（わたしは）ドア＿開けました。",a:"を",o:["を","が","に","で"],zh:"（我）把门打开了。",e:"他动词（開ける）：有人去做，对象用「を」。和上一题对照：開く(自)が／開ける(他)を。"},
{s:"わたしは 母＿手紙を 書きます。",a:"に",o:["に","を","と","で"],zh:"我给妈妈写信。",e:"“给谁”用「に」。"},
{s:"日本語＿上手ですね。",a:"が",o:["が","を","に","で"],zh:"日语很好嘛。",e:"上手・下手 的对象用「が」。"},
{s:"来年 大学＿入ります。",a:"に",o:["に","を","へ","で"],zh:"明年上大学。",e:"入る 的“进入哪里”用「に」。对比：大学を出る（离开用を）。"},
{s:"東京＿大阪まで 新幹線で 3時間です。",a:"から",o:["から","より","に","で"],zh:"从东京到大阪坐新干线要3小时。",e:"「AからBまで」= 从A到B，距离和时间都可以用。"},
{s:"これは わたし＿作った 料理です。",a:"が",o:["が","は","を","で"],zh:"这是我做的菜。",e:"修饰名词的小句里，主语用「が」（口语也常用「の」），不用「は」。"},
{s:"ここ＿写真を 撮らないで ください。",a:"で",o:["で","に","を","へ"],zh:"请不要在这里拍照。",e:"做动作的场所用「で」。"},
{s:"一日＿3回 薬を 飲みます。",a:"に",o:["に","で","を","が"],zh:"一天吃三次药。",e:"「期间に＋次数」表示频率：一週間に2回、一日に3回。"},
{s:"象は 鼻＿長いです。",a:"が",o:["が","は","を","の"],zh:"大象鼻子长。",e:"「AはBがC」：A是大话题，B是具体哪一部分。"}
];

var J = {mode:"rand", list:[], i:0, score:0, answered:false};

function esc(t){ return String(t).replace(/[&<>"]/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]; }); }
function shuf(a){ for(var i=a.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)); var t=a[i]; a[i]=a[j]; a[j]=t; } return a; }

// 进度：有 S 就存进 S.joshi（跟着云同步），否则存在本机
function store(){
  if (window.S && typeof S === "object") {
    if (!S.joshi) S.joshi = {done:0, ok:0, wrong:{}};
    return S.joshi;
  }
  try { return JSON.parse(localStorage.getItem("jp-joshi")) || {done:0, ok:0, wrong:{}}; }
  catch(e){ return {done:0, ok:0, wrong:{}}; }
}
function persist(st){
  if (window.S && typeof S === "object") { if (typeof window.save === "function") window.save(); }
  else { try { localStorage.setItem("jp-joshi", JSON.stringify(st)); } catch(e){} }

}

function box(){
  var c = document.getElementById("joshi");
  if (!c) {
    c = document.createElement("div");
    c.id = "joshi"; c.className = "card hidden";
    var q = document.getElementById("q");
    q.parentNode.insertBefore(c, q);
  }
  return c;
}

function addTab(){
  var t = document.getElementById("tabs");
  if (!t || document.getElementById("tab-joshi")) return;
  var b = document.createElement("button");
  b.id = "tab-joshi"; b.className = "tab"; b.textContent = "助词";
  b.onclick = open;
  t.appendChild(b);
}

function open(){
  document.querySelectorAll("#tabs .tab").forEach(function(x){ x.classList.remove("on"); });
  document.getElementById("tab-joshi").classList.add("on");
  document.getElementById("q").classList.add("hidden");
  var r = document.getElementById("res"); if (r) r.classList.add("hidden");
  box().classList.remove("hidden");
  menu();
}
function close(){
  var c = document.getElementById("joshi"); if (c) c.classList.add("hidden");

  document.getElementById("q").classList.remove("hidden");
  var b = document.getElementById("tab-joshi"); if (b) b.classList.remove("on");
}

function menu(){
  var st = store(), nw = Object.keys(st.wrong).length;
  var rate = st.done ? Math.round(st.ok / st.done * 100) : 0;
  box().innerHTML =
    '<div class="qhead">助词练习</div>' +
    '<div class="muted">题库 ' + JOSHIQ.length + ' 题 · 已做 ' + st.done + ' 次 · 正确率 ' + rate + '% · 错题 ' + nw + ' 道</div>' +
    '<div class="btns">' +
      '<button class="btn main" id="j-rand">随机 10 题</button>' +
      '<button class="btn" id="j-all">按顺序全做</button>' +
      '<button class="btn" id="j-wrong"' + (nw ? '' : ' disabled') + '>错题重练（' + nw + '）</button>' +
    '</div>';
  document.getElementById("j-rand").onclick = function(){ start("rand"); };
  document.getElementById("j-all").onclick = function(){ start("all"); };
  document.getElementById("j-wrong").onclick = function(){ start("wrong"); };
}

function start(mode){
  var all = JOSHIQ.map(function(_, i){ return i; });
  if (mode === "wrong") J.list = shuf(Object.keys(store().wrong).map(Number));
  else if (mode === "all") J.list = all;
  else J.list = shuf(all).slice(0, 10);
  J.mode = mode; J.i = 0; J.score = 0; J.answered = false;
  render();
}

function render(){
  var c = box();
  if (J.i >= J.list.length) {

    c.innerHTML = '<div class="celebrate">本轮结束：' + J.score + ' / ' + J.list.length + '</div>';
    var d = document.createElement("div"); c.appendChild(d);
    var keep = c.innerHTML; menu(); c.innerHTML = keep.replace('<div></div>', '') + c.innerHTML;
    // 重新绑定按钮
    document.getElementById("j-rand").onclick = function(){ start("rand"); };
    document.getElementById("j-all").onclick = function(){ start("all"); };
    document.getElementById("j-wrong").onclick = function(){ start("wrong"); };
    return;
  }
  var k = J.list[J.i], q = JOSHIQ[k];
  var sent = esc(q.s).replace("＿", '<span class="blank" id="jblank">　</span>');
  c.innerHTML =
    '<div class="qtop">助词练习' + (J.mode === "wrong" ? ' · 错题重练' : '') + ' · ' + (J.i + 1) + ' / ' + J.list.length + '</div>' +
    '<div class="qhead">选出正确的助词</div>' +
    '<div class="box"><span class="big">' + sent + '</span></div>' +
    shuf(q.o.slice()).map(function(o){ return '<button class="opt" data-o="' + o + '">' + o + '</button>'; }).join("") +
    '<div id="jfb"></div>';
  c.querySelectorAll(".opt").forEach(function(b){ b.onclick = function(){ answer(b, k); }; });
}

function answer(b, k){
  if (J.answered) return; J.answered = true;
  var q = JOSHIQ[k], ok = b.dataset.o === q.a, st = store();
  st.done++;
  if (ok) {
    st.ok++; J.score++;
    if (st.wrong[k] && --st.wrong[k] <= 0) delete st.wrong[k];
  } else {
    st.wrong[k] = 2; // 错了要连续答对2次才移出错题
  }
  persist(st);
  box().querySelectorAll(".opt").forEach(function(x){

    x.disabled = true;
    if (x.dataset.o === q.a) x.classList.add("right");
    else if (x === b) x.classList.add("wrong");
  });
  document.getElementById("jblank").textContent = q.a;
  document.getElementById("jfb").innerHTML =
    (ok ? '<div class="ok-h">✅ 正确</div>' : '<div class="ng-h">❌ 应该是「' + esc(q.a) + '」</div>') +
    '<div class="muted">' + esc(q.zh) + '</div>' +
    '<div class="note">' + esc(q.e) + '</div>' +
    '<div class="btns"><button class="btn main" id="jnext">下一题</button></div>';
  document.getElementById("jnext").onclick = function(){ J.i++; J.answered = false; render(); };
}

// 点其他题型按钮时，自动收起助词练习
document.addEventListener("click", function(e){
  var t = e.target.closest && e.target.closest("#tabs .tab");
  if (t && t.id !== "tab-joshi") close();
}, true);

// app.js 重画题型栏时，把「助词」按钮补回去
var tabs = document.getElementById("tabs");
if (tabs) new MutationObserver(addTab).observe(tabs, {childList: true});
addTab();
})();
