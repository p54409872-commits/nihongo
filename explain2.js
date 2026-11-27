// explain2.js — 答题后加一个「🔍 拆开看」讲解框：拆开每一块 → 合起来 → 为什么 → 中文类比 → 同类说法
// 不改原来的讲解，只在下面追加。句型库 PATTERNS 可以随时往里加。
(function(){

var css = document.createElement("style");
css.textContent =
  ".ex2{background:#eef5ff;border-left:4px solid var(--blue);border-radius:10px;padding:12px 16px;margin:12px 0;font-size:15px;line-height:1.9}" +
  ".ex2-h{font-weight:bold;color:var(--blue);font-size:16px;margin-bottom:4px}" +
  ".ex2-p b{font-size:17px}" +
  ".ex2-s{font-weight:bold;margin:6px 0 2px}" +
  ".ex2 ul{margin:2px 0 0 20px;padding:0}";
document.head.appendChild(css);

function E(s){ return typeof esc === "function" ? esc(String(s)) : String(s); }

// ---------- 句型库：越具体的放越前面 ----------
// 每条：re = 匹配的写法；f(s, v, m) 返回讲解。s = 前面的动词部分（如「返さ」），v = 动词中文（如「还」）
var PATTERNS = [
  {re:/(なければ|なくては|ないと)(なりません|ならない|いけません|いけない|だめ|ダメ)|なくちゃ|なきゃ/, f:function(s, v, m){
    return {
      parts: m[1] ? [[s + m[1], "如果不" + v + "的话"], [m[2], "不行"]]
                  : [[s + m[0], "「なければならない」的口语缩短，后面的「不行」省略了"]],
      sum: "“不" + v + "的话不行” → <b>必须" + v + "</b>",
      why: "日语表达“必须”时，习惯用<b>双重否定</b>：“不做的话不行”。两个否定抵消，意思就变成肯定的“必须”。",
      zh: ["不" + v + "不行", "非" + v + "不可"],
      same: [[s + "なければなりません", "正式、礼貌"], [s + "なくてはいけません", "也很常用"], [s + "ないといけない", "口语"], [s + "なきゃ", "很口语，和朋友说"]],
      vs: s + "なくてもいいです ＝ 不" + v + "也可以（意思正好相反）"
    };
  }},
  {re:/なくても(いいです|いい|かまいません|大丈夫)/, f:function(s, v, m){
    return {
      parts: [[s + "なくても", "就算不" + v + "也"], [m[1], "可以 / 没关系"]],

      sum: "“就算不" + v + "也可以” → <b>不用" + v + "</b>",
      why: "「〜ても」＝ 就算…也。前面换成否定「なくても」＝ 就算不…也。所以意思是“不必、不用”。",
      zh: ["不" + v + "也行", "不用" + v],
      same: [[s + "なくてもいいです", "礼貌"], [s + "なくてもかまいません", "更正式"], [s + "なくても大丈夫", "口语"]],
      vs: s + "なければなりません ＝ 必须" + v + "（意思正好相反）"
    };
  }},
  {re:/(て|で)は(いけません|いけない|だめ|ダメ|なりません)|(ちゃ|じゃ)(いけない|いけません|だめ|ダメ)/, f:function(s, v, m){
    var te = m[1] || (m[3] === "ちゃ" ? "て" : "で");
    return {
      parts: [[s + (m[1] ? te + "は" : m[3]), "如果" + v + "的话"], [m[2] || m[4], "不行"]],
      sum: "“" + v + "的话不行” → <b>不可以" + v + "</b>",
      why: "「〜ては」＝ 如果做了…的话，后面接「いけません（不行）」，就是“禁止、不许”。",
      zh: ["不许" + v, "不准" + v],
      same: [[s + te + "はいけません", "礼貌"], [s + (te === "て" ? "ちゃ" : "じゃ") + "だめ", "口语"]],
      vs: s + te + "もいいです ＝ 可以" + v + "（意思正好相反）"
    };
  }},
  {re:/(て|で)も(いいです|いい|かまいません|大丈夫)/, f:function(s, v, m){
    return {
      parts: [[s + m[1] + "も", "就算" + v + "也"], [m[2], "可以"]],
      sum: "“就算" + v + "也没关系” → <b>可以" + v + "</b>",
      why: "「〜てもいい」表示允许：“做了也没关系”。问别人能不能做时说「〜てもいいですか」。",
      zh: ["可以" + v, v + "也没关系"],
      same: [[s + m[1] + "もいいです", "礼貌"], [s + m[1] + "もかまいません", "更正式"]],
      vs: s + m[1] + "はいけません ＝ 不可以" + v + "（意思正好相反）"
    };
  }},
  {re:/ないでください/, f:function(s, v){
    return {
      parts: [[s + "ないで", "不" + v + "（的状态下）"], ["ください", "请"]],
      sum: "<b>请不要" + v + "</b>",

      why: "「ないで」＝ 在不…的状态下，加上「ください（请）」，就是礼貌地请对方不要做。",
      zh: ["请不要" + v, "别" + v],
      same: [[s + "ないでください", "礼貌"], [s + "ないで", "口语，对家人朋友"]]
    };
  }},
  {re:/(て|で)ください/, f:function(s, v, m){
    return {
      parts: [[s + m[1], v + "（て形）"], ["ください", "请"]],
      sum: "<b>请" + v + "</b>",
      why: "「て形 + ください」是礼貌地请别人做事。",
      zh: ["请" + v],
      same: [[s + m[1] + "ください", "礼貌"], [s + m[1], "口语，对家人朋友"]]
    };
  }},
  {re:/ない(ほう|方)がいい/, f:function(s, v, m){
    return {
      parts: [[s + "ない", "不" + v], [m[1] + "が", "那一边"], ["いい", "好"]],
      sum: "“不" + v + "的那一边比较好” → <b>最好别" + v + "</b>",
      why: "「〜ほうがいい」是给建议：比较两种做法，说“这一边比较好”。",
      zh: ["最好别" + v, "还是不要" + v + "吧"]
    };
  }},
  {re:/(た|だ)(ほう|方)がいい/, f:function(s, v, m){
    return {
      parts: [[s + m[1], v + "了（た形）"], [m[2] + "が", "那一边"], ["いい", "好"]],
      sum: "<b>最好" + v + "</b>",
      why: "给建议时用「た形 + ほうがいい」，口气比较肯定，表示“这样做比较好”。",
      zh: ["最好" + v, "还是" + v + "吧"],
      vs: s.replace(/[っんいし]$/, "") + "ないほうがいい ＝ 最好别" + v
    };
  }},
  {re:/ことが(できます|できる|できました|できません|できない)/, f:function(s, v, m){

    var neg = /ません|ない/.test(m[1]);
    return {
      parts: [[s + "こと", v + "这件事"], ["が", "（表示对象）"], [m[1], neg ? "做不到" : "能做到"]],
      sum: "<b>" + (neg ? "不能" : "能") + v + "</b>",
      why: "「动词原形 + ことができる」＝ 能做某事。意思和可能形一样，但更正式。",
      zh: [(neg ? "不能" : "能") + v, (neg ? "不会" : "会") + v]
    };
  }},
  {re:/(た|だ)ことが(あります|ある|ありません|ない)/, f:function(s, v, m){
    var neg = /ません|ない/.test(m[2]);
    return {
      parts: [[s + m[1] + "こと", v + "过的事"], ["が", "（表示对象）"], [m[2], neg ? "没有" : "有"]],
      sum: "“" + (neg ? "没有" : "有") + v + "过的经历” → <b>" + (neg ? "从来没" + v + "过" : "曾经" + v + "过") + "</b>",
      why: "「た形 + ことがある」说的是经历：以前有没有做过。",
      zh: [(neg ? "没" : "") + v + "过"]
    };
  }},
  {re:/うと(思|おも)/, f:function(s, v){
    return {
      parts: [[s + "う", "意向形：" + v + "吧"], ["と思います", "我想"]],
      sum: "“我想着要" + v + "” → <b>打算" + v + "</b>",
      why: "「意向形 + と思う」＝ 心里想着“做吧”，就是打算、准备做。",
      zh: ["打算" + v, "准备" + v]
    };
  }},
  {re:/(て|で)しま(う|った|います|いました)|ちゃった|じゃった/, f:function(s, v, m){
    return {
      parts: [[s + (m[1] || m[0]), v + "（て形）"], [m[2] ? "しま" + m[2] : "", "完了 / 收拾不了了"]].filter(function(p){ return p[0]; }),
      sum: "<b>" + v + "完了</b>，或者<b>不小心" + v + "了</b>（带一点遗憾）",
      why: "「〜てしまう」有两个意思：① 全部做完；② 做了不该做的事，觉得可惜。口语里常说「〜ちゃう / 〜じゃう」。",
      zh: [v + "完了", "不小心" + v + "了"]
    };

  }},
  {re:/(て|で)お(く|きます|きました|いた|いて)|(と|ど)(く|いた)/, f:function(s, v, m){
    return {
      parts: [[s + (m[1] || m[3]), v + "（て形）"], [m[2] ? "お" + m[2] : m[4], "放着 / 预先准备好"]],
      sum: "<b>事先" + v + "好</b>",
      why: "「〜ておく」＝ 为了以后方便，先把事情做好放在那里。口语说「〜とく」。",
      zh: ["先" + v + "好", "预先" + v]
    };
  }},
  {re:/(て|で)(います|いる|いました|いません|いない)/, f:function(s, v, m){
    return {
      parts: [[s + m[1], v + "（て形）"], [m[2], "在 / 处于"]],
      sum: "<b>正在" + v + "</b>，或者<b>" + v + "了之后一直是这个状态</b>",
      why: "「〜ている」有两个用法：① 动作正在进行（正在吃）；② 结果一直保持（结婚了 → 已婚状态）。",
      zh: ["正在" + v, "一直" + v + "着"]
    };
  }},
  {re:/ながら/, f:function(s, v){
    return {
      parts: [[s + "ながら", "一边" + v]],
      sum: "<b>一边" + v + "，一边做后面的事</b>",
      why: "「ます形去掉ます + ながら」＝ 同时做两件事，后面那件才是主要的。",
      zh: ["一边" + v + "一边…"]
    };
  }},
  {re:/(たら|だら)/, f:function(s, v, m){
    return {
      parts: [[s + m[1], "如果" + v + "了的话 / " + v + "了之后"]],
      sum: "<b>如果" + v + "的话</b>，或者<b>" + v + "之后</b>",
      why: "「た形 + ら」既能表示假设（如果），也能表示时间先后（…之后）。是最常用的条件说法。",
      zh: ["如果" + v + "的话", v + "了以后"]
    };

  }},
  {re:/([えけせてねへめれげべぺ])ば/, f:function(s, v, m){
    return {
      parts: [[s + m[1] + "ば", "如果" + v + "的话"]],
      sum: "<b>如果" + v + "，就…</b>",
      why: "「ば形」表示条件：只要满足前面，后面就会成立。多用在一般规律和建议里。",
      zh: ["如果" + v + "就…", "只要" + v + "就…"]
    };
  }},
  {re:/たい(です|。|と|$)/, f:function(s, v){
    return {
      parts: [[s + "たい", "想" + v]],
      sum: "<b>想" + v + "</b>",
      why: "「ます形去掉ます + たい」表示自己的愿望。说别人想做什么时要用「〜たがっている」。",
      zh: ["想" + v, "想要" + v]
    };
  }}
];

// ---------- 取出前面的动词部分（「本を返さなければ」→「返さ」） ----------
function stemBefore(text, idx){
  var pre = text.slice(Math.max(0, idx - 6), idx), cut = -1;
  "をにがはでとも、。 　".split("").forEach(function(ch){ cut = Math.max(cut, pre.lastIndexOf(ch)); });
  return pre.slice(cut + 1);
}
function clean(z){ return (String(z || "").split(/[；;、，,／\/（(]/)[0].trim()) || "做"; }
function verbZh(ans){
  try { if (cur && cur.type === "chain" && chain && chain.verb) return clean(chain.verb.zh); } catch(e){}
  try { if (cur && cur.type === "fill") { var vb = findVerb(FILL[cur.id].v); if (vb) return clean(vb.zh); } } catch(e){}
  try { var o = cur && (cur.v || cur.verb); if (o && o.zh) return clean(o.zh); } catch(e){}
  var best = null, bl = 0;
  try {

    VERBS.forEach(function(v){
      var base = /する$/.test(v.k) ? v.k.slice(0, -2) : v.k.slice(0, -1);
      if (base.length > bl && ans.indexOf(base) >= 0) { best = v; bl = base.length; }
    });
  } catch(e){}
  return best ? clean(best.zh) : "做";
}

// ---------- 找到这道题的正确答案 ----------
function getTexts(res){
  var t = res.textContent, m = t.match(/正确(?:的是|答案)[：:]?\s*「([^」]+)」/), full = "";
  try {
    if (cur.type === "fill") { var f = FILL[cur.id]; full = f.b.replace("＿＿", f.a[0]); }
    else if (cur.type === "conf") { var c = CONF[cur.id]; full = c.q.replace(/（[^）]*）/g, "").replace("＿＿", c.o[c.a]); }
  } catch(e){}
  if (!full && typeof SPK === "string" && SPK && t.indexOf(SPK) >= 0) full = SPK;
  return [m ? m[1] : "", full].filter(Boolean);
}

function build(){
  var res = document.getElementById("res");
  if (!res || res.classList.contains("hidden") || res.querySelector(".ex2")) return;
  var texts = getTexts(res);
  for (var t = 0; t < texts.length; t++) {
    for (var i = 0; i < PATTERNS.length; i++) {
      var m = texts[t].match(PATTERNS[i].re);
      if (!m) continue;
      var s = stemBefore(texts[t], m.index), chunk = s + m[0];
      var x = PATTERNS[i].f(s, verbZh(chunk), m);
      var html = '<div class="ex2-h">🔍 拆开看「' + E(chunk) + '」</div>' +
        x.parts.map(function(p){ return '<div class="ex2-p"><b>' + E(p[0]) + '</b>' + (p[1] ? ' ＝ ' + p[1] : '') + '</div>'; }).join("") +
        '<div class="ex2-s">👉 合起来：' + x.sum + '</div>' +

        (x.why ? '<div>💡 ' + x.why + '</div>' : '') +
        (x.zh ? '<div>🇨🇳 中文也有类似说法：' + x.zh.map(function(z){ return '“' + E(z) + '”'; }).join(" / ") + '</div>' : '') +
        (x.same ? '<div>📚 同样意思的说法：<ul>' + x.same.map(function(z){ return '<li>' + E(z[0]) + (z[1] ? ' <span class="muted">（' + z[1] + '）</span>' : '') + '</li>'; }).join("") + '</ul></div>' : '') +
        (x.vs ? '<div>↔️ 对比：' + E(x.vs) + '</div>' : '');
      var box = document.createElement("div");
      box.className = "ex2"; box.innerHTML = html;
      var bs = res.querySelectorAll(":scope > .btns");
      if (bs.length) res.insertBefore(box, bs[bs.length - 1]); else res.appendChild(box);
      return;
    }
  }
}

// ---------- 接在原来的 finish（出结果）后面 ----------
function hook(){
  if (typeof window.finish !== "function" || window.finish.__ex2) return;
  var orig = window.finish;
  var w = function(){ var r = orig.apply(this, arguments); setTimeout(build, 60); return r; };
  w.__ex2 = true; window.finish = w;
}
hook();
setInterval(function(){ hook(); build(); }, 1000);

})();
