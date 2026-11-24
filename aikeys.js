// aikeys.js — Gemini 备用密钥 + 切换 DeepSeek / 通义千问
// 密钥只存在浏览器 localStorage（jp-aicfg），不写进代码
(function(){
var CFG_KEY = "jp-aicfg";
var DS_BASE = "https://api.deepseek.com", DS_MODEL = "deepseek-flash";
var QW_BASE = {
  intl: "https://dashscope-intl.aliyuncs.com/compatible-mode/v1",
  cn:   "https://dashscope.aliyuncs.com/compatible-mode/v1"
};
var QW_MODEL = "qwen-plus";
var DEF = {provider:"gemini", gemini2:"", ds:"", qw:"", qwRegion:"intl", fallback:true};

function cfg(){
  try { return Object.assign({}, DEF, JSON.parse(localStorage.getItem(CFG_KEY) || "{}")); }
  catch(e){ return Object.assign({}, DEF); }
}
function saveCfg(c){ try { localStorage.setItem(CFG_KEY, JSON.stringify(c)); } catch(e){} }

var _fetch = window.fetch.bind(window);

// ---------- Gemini 格式 ⇄ OpenAI 格式 ----------
function partsText(parts){ return (parts || []).map(function(p){ return p.text || ""; }).join(""); }

function g2o(body, model){
  var msgs = [], si = body.systemInstruction || body.system_instruction;
  if (si) { var st = typeof si === "string" ? si : partsText(si.parts); if (st) msgs.push({role:"system", content:st}); }
  (body.contents || []).forEach(function(c){
    var t = partsText(c.parts);
    if (t) msgs.push({role: c.role === "model" ? "assistant" : "user", content: t});
  });
  var gc = body.generationConfig || body.generation_config || {};
  var o = {model: model, messages: msgs, stream: false};

  if (gc.temperature != null) o.temperature = gc.temperature;
  if (gc.maxOutputTokens) o.max_tokens = gc.maxOutputTokens;
  if ((gc.responseMimeType || gc.response_mime_type) === "application/json") {
    o.response_format = {type: "json_object"};
    if (!/json/i.test(JSON.stringify(msgs))) msgs.unshift({role:"system", content:"只输出 JSON。"});
  }
  return o;
}

async function callOpenAI(base, key, model, gbody){
  var r = await _fetch(base + "/chat/completions", {
    method: "POST",
    headers: {"Content-Type": "application/json", "Authorization": "Bearer " + key},
    body: JSON.stringify(g2o(gbody, model))
  });
  var txt = await r.text();
  if (!r.ok) return {ok:false, status:r.status, txt:txt};
  var j = JSON.parse(txt);
  var text = (j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content) || "";
  return {ok:true, text:text, gem:{candidates:[{content:{role:"model", parts:[{text:text}]}, finishReason:"STOP", index:0}]}};
}

// 按 ai.js 原本请求的方式（普通 / 流式）包装回去
function wrap(gem, url){
  var J = {"Content-Type": "application/json"};
  if (url.indexOf("streamGenerateContent") >= 0) {
    if (/[?&]alt=sse/.test(url))
      return new Response("data: " + JSON.stringify(gem) + "\r\n\r\n", {status:200, headers:{"Content-Type":"text/event-stream"}});
    return new Response(JSON.stringify([gem]), {status:200, headers:J});
  }
  return new Response(JSON.stringify(gem), {status:200, headers:J});
}


function withKey(url, init, key){
  var u = url.replace(/([?&]key=)[^&]*/, "$1" + encodeURIComponent(key));
  var h = new Headers((init && init.headers) || {});
  if (h.has("x-goog-api-key")) h.set("x-goog-api-key", key);
  return [u, Object.assign({}, init, {headers: h})];
}

// ---------- 小提示 ----------
function toast(msg){
  var t = document.createElement("div");
  t.textContent = msg;
  t.style.cssText = "position:fixed;left:50%;bottom:20px;transform:translateX(-50%);background:#222;color:#fff;padding:8px 14px;border-radius:8px;font-size:14px;z-index:9999;max-width:90%";
  document.body.appendChild(t);
  setTimeout(function(){ t.remove(); }, 3500);
}
function used(name, i){
  window.AI_USED = name;
  if (i > 0) toast("前面的 AI 暂时不可用，已自动换成：" + name);
}

// ---------- 拦截发往 Gemini 的请求 ----------
window.fetch = async function(input, init){
  var url = typeof input === "string" ? input : (input instanceof URL ? input.href : "");
  if (!url || url.indexOf("generativelanguage.googleapis.com") < 0) return _fetch(input, init);
  var gbody;
  try { gbody = JSON.parse(init && init.body); } catch(e){ return _fetch(input, init); }

  var c = cfg();
  var order = [c.provider].concat(["gemini","deepseek","qwen"].filter(function(p){ return p !== c.provider; }));
  if (!c.fallback) order = [c.provider];


  var steps = [];
  order.forEach(function(p){
    if (p === "gemini") {
      steps.push({name:"Gemini", run:function(){ return _fetch(url, init); }});
      if (c.gemini2) steps.push({name:"Gemini 备用密钥", run:function(){ var a = withKey(url, init, c.gemini2); return _fetch(a[0], a[1]); }});
    }
    if (p === "deepseek" && c.ds) steps.push({name:"DeepSeek", oa:function(){ return callOpenAI(DS_BASE, c.ds, DS_MODEL, gbody); }});
    if (p === "qwen" && c.qw) steps.push({name:"通义千问", oa:function(){ return callOpenAI(QW_BASE[c.qwRegion] || QW_BASE.intl, c.qw, QW_MODEL, gbody); }});
  });

  var last = null, lastErr = null;
  for (var i = 0; i < steps.length; i++) {
    var s = steps[i];
    try {
      if (s.run) {
        var r = await s.run();
        if (r.ok) { used(s.name, i); return r; }
        last = r;
      } else {
        var o = await s.oa();
        if (o.ok) { used(s.name, i); return wrap(o.gem, url); }
        last = new Response(o.txt, {status: o.status});
      }
    } catch(e){ lastErr = e; }
  }
  if (last) return last;
  throw lastErr || new Error("没有可用的 AI 密钥");
};

// ---------- 设置界面 ----------
function ui(){
  var main = document.getElementById("main");

  if (!main || document.getElementById("aicfg")) return;
  var d = document.createElement("div");
  d.className = "card"; d.id = "aicfg";
  d.innerHTML =
    '<details><summary>AI 设置（备用密钥 / 切换 AI）</summary><div class="setup">' +
    '<label>优先使用</label><select id="ac-p"><option value="gemini">Gemini</option><option value="deepseek">DeepSeek</option><option value="qwen">通义千问</option></select>' +
    '<label>Gemini 备用密钥（第一把出错时自动换这把）</label><input type="password" id="ac-g2" autocomplete="off">' +
    '<label>DeepSeek 密钥</label><input type="password" id="ac-ds" autocomplete="off">' +
    '<label>通义千问密钥</label><input type="password" id="ac-qw" autocomplete="off">' +
    '<label>通义千问账号地区</label><select id="ac-qr"><option value="intl">国际版（新加坡）</option><option value="cn">中国大陆（北京）</option></select>' +
    '<label><input type="checkbox" id="ac-fb"> 出错时自动换下一家</label>' +
    '<div class="btns"><button class="btn main" id="ac-save">保存</button><button class="btn" id="ac-test">测试已填的密钥</button></div>' +
    '<div id="ac-msg" class="muted" style="white-space:pre-line"></div>' +
    '<div class="muted">密钥只存在这台设备的浏览器里，换手机或电脑要再填一次。原来的 Gemini 主密钥不变，仍然在 Firebase 里。</div>' +
    '</div></details>';
  main.appendChild(d);

  var c = cfg(), $ = function(id){ return document.getElementById(id); };
  $("ac-p").value = c.provider; $("ac-g2").value = c.gemini2; $("ac-ds").value = c.ds;
  $("ac-qw").value = c.qw; $("ac-qr").value = c.qwRegion; $("ac-fb").checked = c.fallback;

  function read(){
    return {provider:$("ac-p").value, gemini2:$("ac-g2").value.trim(), ds:$("ac-ds").value.trim(),
            qw:$("ac-qw").value.trim(), qwRegion:$("ac-qr").value, fallback:$("ac-fb").checked};
  }
  $("ac-save").onclick = function(){ saveCfg(read()); $("ac-msg").textContent = "✅ 已保存"; };

  $("ac-test").onclick = async function(){
    var c = read(), out = [], ping = {contents:[{role:"user", parts:[{text:"只回答：OK"}]}], generationConfig:{maxOutputTokens:20}};
    $("ac-msg").textContent = "测试中…";
    function netErr(e){ return "❌ 连不上（网络问题，或该服务不允许网页直接调用）"; }
    if (c.gemini2) {

      try {
        var r = await _fetch("https://generativelanguage.googleapis.com/v1beta/models?key=" + encodeURIComponent(c.gemini2));
        out.push("Gemini 备用：" + (r.ok ? "✅ 可用" : "❌ 错误 " + r.status));
      } catch(e){ out.push("Gemini 备用：" + netErr(e)); }
    }
    if (c.ds) {
      try { var o = await callOpenAI(DS_BASE, c.ds, DS_MODEL, ping);
            out.push("DeepSeek：" + (o.ok ? "✅ 回复「" + o.text.slice(0, 20) + "」" : "❌ 错误 " + o.status)); }
      catch(e){ out.push("DeepSeek：" + netErr(e)); }
    }
    if (c.qw) {
      try { var q = await callOpenAI(QW_BASE[c.qwRegion], c.qw, QW_MODEL, ping);
            out.push("通义千问：" + (q.ok ? "✅ 回复「" + q.text.slice(0, 20) + "」" : "❌ 错误 " + q.status + "（地区选对了吗？）")); }
      catch(e){ out.push("通义千问：" + netErr(e)); }
    }
    $("ac-msg").textContent = out.length ? out.join("\n") : "还没有填任何备用密钥";
  };
}
ui();
})();
