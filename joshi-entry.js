// joshi-entry.js — 题型栏看不见时（比如闯关模式），在进度卡片下面显示独立的助词入口
(function(){
var qWasHidden = false;

function visible(el){ return !!(el && el.offsetParent !== null); }

function ensure(){
  var dash = document.getElementById("dash");
  if (!dash) return;
  var e = document.getElementById("joshi-entry");
  if (!e) {
    e = document.createElement("div");
    e.id = "joshi-entry"; e.className = "card";
    e.innerHTML = '<button class="btn main" id="joshi-go" style="width:100%"></button>';
    dash.parentNode.insertBefore(e, dash.nextSibling);
    document.getElementById("joshi-go").onclick = toggle;
  }
  // 题型栏看得见、而且里面有助词按钮，就不需要这个大按钮
  var tabOk = visible(document.getElementById("tabs")) && document.getElementById("tab-joshi");
  e.classList.toggle("hidden", !!tabOk);
  var j = document.getElementById("joshi"), isOpen = j && !j.classList.contains("hidden");
  document.getElementById("joshi-go").textContent = isOpen ? "⬅ 回到闯关练习" : "📝 助词练习";
}

function toggle(){
  var j = document.getElementById("joshi"), q = document.getElementById("q");
  if (j && !j.classList.contains("hidden")) {
    // 关闭助词，恢复原来的题目区
    j.classList.add("hidden");
    q.classList.toggle("hidden", qWasHidden);
  } else {
    qWasHidden = q.classList.contains("hidden");
    var t = document.getElementById("tab-joshi");
    if (t) t.click();   // 借用 joshi.js 里原来的打开功能
    var jj = document.getElementById("joshi");
    if (jj) jj.scrollIntoView({behavior: "smooth", block: "start"});
  }
  ensure();
}

setInterval(ensure, 1000);
ensure();
})();
