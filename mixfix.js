// mixfix.js — 同词辨形：检查前可以随时修改配对（覆盖 more.js 的 renderMix / xSel / xPick）

window.renderMix = function(){
  const c = cur;
  if (c.rsel === undefined) c.rsel = null;
  const L = c.items.map((x, i) => {
    const p = c.pairs[i] !== undefined;
    return `<button class="mt ${c.sel === i ? "sel" : ""} ${p ? "paired c" + i : ""}" onclick="xSel(${i})">${esc(x.f.k)}<small>${esc(x.f.r)}</small></button>`;
  }).join("");
  const R = c.right.map(ri => {
    const li = Object.keys(c.pairs).find(k => c.pairs[k] === ri);
    return `<button class="mt ${c.rsel === ri ? "sel" : ""} ${li !== undefined ? "paired c" + li : ""}" onclick="xPick(${ri})">${esc(c.items[ri].zh)}</button>`;
  }).join("");
  $("q").innerHTML = qHead("同词辨形：" + c.v.k + "（" + c.v.zh + "）") + `
    <div class="muted">都是「${c.v.k}」变出来的，长得很像。左右各点一个就能配成一对，哪边先点都可以。配错了？点一下已经配好的格子就能拆开重配。</div>
    <div class="mgrid"><div>${L}</div><div>${R}</div></div>
    <div class="btns"><button class="btn main" ${Object.keys(c.pairs).length < 4 ? "disabled" : ""} onclick="checkMix()">检查</button></div>`;
};

function mixPair(li, ri){
  for (const k in cur.pairs) if (cur.pairs[k] === ri) delete cur.pairs[k];
  cur.pairs[li] = ri;
  cur.sel = null; cur.rsel = null;
}

window.xSel = function(i){
  if (phase !== "ask") return;
  if (cur.rsel !== null && cur.rsel !== undefined) mixPair(i, cur.rsel);          // 已选右边 → 直接配对
  else if (cur.sel === i) cur.sel = null;                                          // 再点一次 → 取消选中
  else if (cur.pairs[i] !== undefined) { delete cur.pairs[i]; cur.sel = i; }       // 点已配好的 → 拆开并选中
  else cur.sel = i;
  renderMix();

};

window.xPick = function(ri){
  if (phase !== "ask") return;
  if (cur.sel !== null && cur.sel !== undefined) mixPair(cur.sel, ri);             // 已选左边 → 直接配对
  else if (cur.rsel === ri) cur.rsel = null;                                       // 再点一次 → 取消选中
  else {
    const li = Object.keys(cur.pairs).find(k => cur.pairs[k] === ri);
    if (li !== undefined) delete cur.pairs[li];                                    // 点已配好的 → 拆开
    cur.rsel = ri;                                                                 // 并选中它
  }
  renderMix();
};
