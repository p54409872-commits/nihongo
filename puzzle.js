const PUZ_META=[
  {alt:[[1,0,2,3]],why:"日语的谓语（动词）一定放在句尾。「〜ていただけますか」是“能请您…吗”，前面接动词的て形「確認して」。时间「今日中に」和宾语「資料を」都放在动词前面，这两个的顺序可以互换。"},
  {alt:[],why:"「〜たうえで」表示“先…，在这个基础上再…”，前面接动词た形：「相談したうえで」。「部長と」（和部长）要放在「相談した」前面，最后才是「ご連絡します」。"},
  {alt:[[3,0,1,2,4]],why:"「〜ように」表示目的“为了能…”，接在「上手になる」这种不能靠意志直接做到的变化后面。「日本語が上手になるように」是一个整体，后面接主要动作「毎日練習しています」。"},
  {alt:[[3,0,1,2,4,5]],why:"「〜にもかかわらず」表示“尽管…却…”，前面接普通形「降っていた」。前半句「雨が降っていたにもかかわらず」说条件，后半句「試合は中止になりませんでした」说出乎意料的结果。「試合は」也可以放到句首。"},
  {alt:[[0,2,1,3]],why:"使役被动「習わされました」（被逼着学）放在句尾。「母に」表示是谁要求的，「ピアノを」是学的内容，时间「子どものころ」一般放在最前面。"},
  {alt:[[1,0,2,3]],why:"「〜なければなりません」表示“必须”，是固定搭配，「提出しなければ」后面一定接「なりません」。期限「明日までに」和宾语「報告書を」放在动词前面，顺序可以互换。"},
  {alt:[],why:"「〜たら」表示“…之后”，「駅に着いたら」是条件部分，要放在前面；后面接请求「電話してください」。「〜てください」是固定搭配，不能拆开。"},
  {alt:[],why:"「〜のわりに」表示“和…相比，出乎意料”，接在名词＋「の」后面：「見た目のわりに」。程度副词「とても」放在形容词「おいしい」前面。"},
  {alt:[[1,0,2,3]],why:"「まだ〜ていません」表示“还没…”。「まだ」可以放在句首，也可以放在宾语「入金を」后面；「確認していません」是一个整体，放在最后。"},
  {alt:[],why:"「〜させてください」是“请让我…”，使役形的て形「考えさせて」后面接「ください」。「少し」修饰动作，放在动词前面。"},
  {alt:[[1,0,2,3]],why:"日语的基本语序是：谁（〜が）＋什么时候（〜に）＋什么（〜を）＋动作。动词「くれました」一定在最后，时间「誕生日に」放在句首或主语后面都可以。「くれる」表示别人给我。"},
  {alt:[],why:"「食べる時間」是“吃饭的时间”，动词原形可以直接修饰名词，所以「食べる」紧挨在「時間が」前面。宾语「昼ご飯を」要放在它的动词「食べる」前面。"},
  {alt:[],why:"「新しいシステムの使い方」是一个名词短语：「新しい」修饰「システム」，「〜の使い方」是“…的用法”。后面接请求「教えていただけますか」。"},
  {alt:[],why:"「〜ことになりました」表示“（被）决定了…”，前面接动词原形「転勤する」。时间「来月」和地点「大阪に」放在动词前面。"},
  {alt:[],why:"「〜うちに」表示“趁…的时候”，接在形容词「若い」后面：「若いうちに」。「〜てみたい」是“想试着…”，放在句尾。"}
];

document.head.insertAdjacentHTML("beforeend",`<style>
.chip2{touch-action:none;user-select:none;-webkit-user-select:none}
.chip2.dragging{opacity:.3}
.pzghost{position:fixed;z-index:200;pointer-events:none;opacity:.9;box-shadow:0 4px 14px rgba(0,0,0,.18);transform:scale(1.05)}
.chips.over{outline:2px dashed var(--accent);outline-offset:2px}
.explain{background:var(--blue-bg);color:#1d3d5c;border-radius:10px;padding:12px 14px;margin:10px 0;font-size:15px;line-height:1.85}
.explain b{color:var(--blue)}
</style>`);

window.renderPuz=function(msg){
  const p=PUZZLES[G.ids[G.k]];
  $("q").innerHTML=`<div class="qhead">🧩 句子拼图（第 ${G.k+1}/5 句）</div>
    <div class="gstat"><span>已拼对 ${G.ok} 句</span></div>
    <div class="box"><div class="big">${esc(p.zh)}</div></div>

    <div class="muted">${G.done?"":"点一下词块放上去，或者按住拖到想要的位置；拖回下面就拿回来。"}</div>
    <div class="chips built" id="pzbuilt">${G.built.map((c,i)=>`<button class="chip2" data-w="b" data-i="${i}">${esc(c.t)}</button>`).join("")}</div>
    <div class="chips" id="pzpool">${G.pool.map((c,i)=>`<button class="chip2" data-w="p" data-i="${i}">${esc(c.t)}</button>`).join("")}</div>
    <div class="gfb">${msg||""}</div>
    <div class="btns">${G.done?`<button class="btn main" onclick="puzNext()">${G.k<4?"下一句":"看结果"}</button>`:`<button class="btn main" ${G.pool.length?"disabled":""} onclick="puzCheck()">检查</button>`}</div>`;
  if(!G.done) document.querySelectorAll("#pzbuilt .chip2,#pzpool .chip2").forEach(el=>el.addEventListener("pointerdown",pzDown));
  renderAll();
};
window.puzAdd=function(i){if(G.done)return;G.built.push(G.pool.splice(i,1)[0]);renderPuz();};
window.puzBack=function(i){if(G.done)return;G.pool.push(G.built.splice(i,1)[0]);renderPuz();};

let DR=null;
function pzDown(e){
  if(G.done) return;
  const el=e.currentTarget;
  DR={el,w:el.dataset.w,i:+el.dataset.i,x:e.clientX,y:e.clientY,moved:false,ghost:null,pid:e.pointerId};
  try{el.setPointerCapture(e.pointerId);}catch(err){}
  el.addEventListener("pointermove",pzMove);
  el.addEventListener("pointerup",pzUp,{once:true});
  el.addEventListener("pointercancel",pzCancel,{once:true});
}
function pzMove(e){
  if(!DR) return;
  const dx=e.clientX-DR.x,dy=e.clientY-DR.y;
  if(!DR.moved&&Math.hypot(dx,dy)>6){
    DR.moved=true;
    const r=DR.el.getBoundingClientRect();
    const g=DR.el.cloneNode(true);
    g.classList.add("pzghost");
    g.style.width=r.width+"px";
    document.body.appendChild(g);
    DR.ghost=g;

    DR.el.classList.add("dragging");
  }
  if(DR.moved){
    DR.ghost.style.left=(e.clientX-DR.ghost.offsetWidth/2)+"px";
    DR.ghost.style.top=(e.clientY-DR.ghost.offsetHeight/2)+"px";
    const b=$("pzbuilt");
    if(b) b.classList.toggle("over",inBox(b,e));
  }
}
function inBox(box,e){
  const r=box.getBoundingClientRect();
  return e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top-10&&e.clientY<=r.bottom+10;
}
function pzCancel(){
  if(!DR) return;
  DR.el.removeEventListener("pointermove",pzMove);
  if(DR.ghost) DR.ghost.remove();
  DR=null;
  renderPuz();
}
function pzUp(e){
  if(!DR) return;
  const d=DR;
  DR=null;
  d.el.removeEventListener("pointermove",pzMove);
  if(d.ghost) d.ghost.remove();
  d.el.classList.remove("dragging");
  if(!d.moved){
    if(d.w==="p") puzAdd(d.i); else puzBack(d.i);
    return;
  }
  const builtBox=$("pzbuilt");

  const item=d.w==="p"?G.pool.splice(d.i,1)[0]:G.built.splice(d.i,1)[0];
  if(builtBox&&inBox(builtBox,e)){
    const chips=[...builtBox.querySelectorAll(".chip2")].filter(c=>c!==d.el);
    let idx=chips.length;
    for(let k=0;k<chips.length;k++){
      const r=chips[k].getBoundingClientRect();
      if(e.clientY<r.top){idx=k;break;}
      if(e.clientY<=r.bottom&&e.clientX<r.left+r.width/2){idx=k;break;}
    }
    G.built.splice(idx,0,item);
  } else {
    G.pool.push(item);
  }
  renderPuz();
}

window.puzCheck=function(){
  const k=G.ids[G.k],p=PUZZLES[k],m=PUZ_META[k]||{};
  const order=G.built.map(c=>c.i).join();
  const std=p.p.map((x,i)=>i).join();
  const okStd=order===std||G.built.map(c=>c.t).join("")===p.p.join("");
  const okAlt=!okStd&&(m.alt||[]).some(a=>a.join()===order);
  const ok=okStd||okAlt;
  if(ok) G.ok++;
  G.done=true;
  SPK=okAlt?G.built.map(c=>c.t).join(""):p.p.join("");
  let msg;
  if(okStd) msg=`<div class="ok-h">✓ 正确！</div>`;
  else if(okAlt) msg=`<div class="ok-h">✓ 正确！你的语序也是对的。</div><div class="muted">标准语序：${esc(p.p.join(" ／ "))}</div>`;
  else msg=`<div class="ng-h">✗ 顺序不对</div>
    <div>你的顺序：${esc(G.built.map(c=>c.t).join(" ／ "))}</div>
    <div>✅ 正确顺序：${esc(p.p.join(" ／ "))}</div>`;

  msg+=`<div style="margin-top:6px">完整句子：${esc(SPK)} <button class="mini" onclick="speak(SPK)">朗读</button></div>`;
  if(m.why){
    msg+=ok
      ?`<details class="more"><summary>📘 为什么这样排</summary><div class="explain">${m.why}</div></details>`
      :`<div class="explain"><b>📘 为什么这样排</b><div>${m.why}</div></div>`;
  }
  renderPuz(msg);
};
