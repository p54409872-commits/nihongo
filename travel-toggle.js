// travel-toggle.js — 显示 / 隐藏旧的「环游世界」（按做题数量走的那张），默认隐藏
(function(){
var KEY = "jp-show-old-travel";
function isOn(){ try { return localStorage.getItem(KEY) === "1"; } catch(e){ return false; } }
window.SHOW_OLD_TRAVEL = isOn();

// 找到旧的「环游世界」卡片（排除大富翁自己的卡片）
function oldCard(){
  var found = null;
  document.querySelectorAll("#main h3, #main summary, #main .qhead, #main b").forEach(function(x){
    if (found || !/环游世界|世界跑道/.test(x.textContent)) return;
    var c = x.closest(".card");
    if (c && c.id !== "mono-card" && c.id !== "mono-map") found = c;
  });
  return found;
}

function ensure(){
  var anchor = document.getElementById("mono-map") || document.getElementById("mono-card");
  if (!anchor) return;
  var b = document.getElementById("old-travel-btn");
  if (!b) {
    b = document.createElement("div");
    b.id = "old-travel-btn";
    b.style.cssText = "margin:-6px 0 14px";
    b.innerHTML = '<button class="link" style="margin:0"></button>';
    b.firstChild.onclick = function(){
      window.SHOW_OLD_TRAVEL = !window.SHOW_OLD_TRAVEL;
      try { localStorage.setItem(KEY, window.SHOW_OLD_TRAVEL ? "1" : "0"); } catch(e){}
      var c = oldCard();
      if (c) {
        c.style.display = window.SHOW_OLD_TRAVEL ? "" : "none";

        if (window.SHOW_OLD_TRAVEL) c.scrollIntoView({behavior:"smooth", block:"start"});
      }
      ensure();
    };
  }
  if (b.previousElementSibling !== anchor) anchor.parentNode.insertBefore(b, anchor.nextSibling);
  var txt = window.SHOW_OLD_TRAVEL
    ? "🙈 隐藏旧的「环游世界」"
    : "🗺️ 显示旧的「环游世界」（按做题数量走的那张）";
  if (b.firstChild.textContent !== txt) b.firstChild.textContent = txt;
  // 打开状态下，确保它一直显示
  if (window.SHOW_OLD_TRAVEL) { var c = oldCard(); if (c && c.style.display === "none") c.style.display = ""; }
}
setInterval(ensure, 1000);
})();
