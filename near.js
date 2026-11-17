const DETECT=[["masu"],["masu","mashita"],["masu","masen"],["masu","mashou"],["te"],["ta"],["nai"],["nai","adjPast"],["pot"],["pot","masu"],["pot","nai"],["pot","ta"],["pas"],["pas","ta"],["pas","masu","mashita"],["cau"],["cau","te"],["teiru"],["teiru","masu"],["ba"],["vol"],["imp"],["ta","tara"]];

function nmList(v,op){
  let M={};
  if(v.t==="g"){
    const ch=v.k.slice(-1),R=ROW[ch],st=v.k.slice(0,-1);
    const teE=["って","んで","いて","いで","して"];
    M={
      te:[...teE.map(e=>st+e),st+R[1]+"て"],
      ta:[...teE.map(e=>st+e.replace("て","た").replace("で","だ")),st+R[1]+"た"],
      masu:[st+R[0]+"ます",st+"ます",st+R[3]+"ます"],
      nai:[st+R[1]+"ない",st+R[3]+"ない",ch==="う"?st+"あない":st+"ない"],
      pot:[st+R[3]+"られる",st+R[0]+"れる",st+R[1]+"れる"],
      pas:[st+R[3]+"る",st+R[0]+"られる",st+R[1]+"れる"],
      cau:[st+R[0]+"させる",st+R[3]+"させる",st+R[0]+"れる"],
      ba:[st+R[1]+"ば",st+R[0]+"ば",v.k+"れば"],
      vol:[st+R[1]+"よう",st+"よう",v.k+"よう"],
      imp:[st+R[1]+"ろ",st+"ろ",st+R[4]+"う"]
    };
  } else if(v.t==="i"){
    const st=v.k.slice(0,-1);
    M={
      te:[st+"って",st+"いて",v.k+"て"],
      ta:[st+"った",st+"いた",v.k+"た"],
      masu:[v.k+"ます",st+"ります",st+"れます"],
      nai:[v.k+"ない",st+"らない",st+"れない"],
      pot:[st+"れる",st+"させる",st+"れれる"],
      pas:[st+"れる",st+"らる",st+"させられる"],
      cau:[st+"せる",st+"られる",st+"らせる"],
      ba:[st+"ば",v.k+"ば",st+"たら"],
      vol:[st+"ろう",v.k+"う",st+"ろ"],
      imp:[st+"れ",st+"よう",v.k+"な"]
    };
  } else if(v.t==="s"){
    const P=v.k.slice(0,-2);
    M={
      te:[P+"すて",P+"しって",P+"さて"],
      ta:[P+"すた",P+"しった",P+"さた"],
      masu:[P+"するます",P+"すます",P+"さます"],
      nai:[P+"さない",P+"すない",P+"せない"],
      pot:[P+"される",P+"しられる",P+"すれる"],
      pas:[P+"できる",P+"しられる",P+"すられる"],
      cau:[P+"しさせる",P+"される",P+"すさせる"],
      ba:[P+"しれば",P+"せば",P+"さば"],
      vol:[P+"そう",P+"するよう",P+"さよう"],
      imp:[P+"すろ",P+"しよう",P+"せろ"]
    };
  }
  return M[op]||[];
}

function formOpts(v,op,correct){
  const seen=new Set([correct]),out=[];
  shuffle(nmList(v,op)).forEach(x=>{if(out.length<2&&!seen.has(x)){seen.add(x);out.push(x);}});
  shuffle(ALL1.filter(o=>o!==op)).forEach(o=>{
    if(out.length>=3) return;
    const x=OPS[o].fn(base(v)).k;
    if(!seen.has(x)){seen.add(x);out.push(x);}
  });
  return shuffle([correct,...out]);
}

function sentenceFollow(v,usedOp){
  if(!v.ex||!v.ex.length) return null;
  const cands=[];
  v.ex.forEach(e=>{
    let best=null;
    DETECT.forEach(ops=>{
      const s=run(v,ops);
      if(!s) return;
      const f=s[s.length-1];
      if(e.ja.includes(f.k)&&(!best||f.k.length>best.f.k.length)) best={ops,f};
    });
    if(best&&best.ops[0]!==usedOp) cands.push({e,ops:best.ops,f:best.f});
  });
  if(!cands.length) return null;
  const c=pick(cands),o1=c.ops[0],tail=c.ops.slice(1),k=c.f.k;
  const seen=new Set([k]),out=[];
  const baseK=OPS[o1].fn(base(v)).k;
  let near=[];
  if(!tail.length) near=nmList(v,o1);
  else if(k.startsWith(baseK.slice(0,-1))){
    const suf=k.slice(baseK.length-1);
    near=nmList(v,o1).map(x=>x.slice(0,-1)+suf);
  }
  shuffle(near).forEach(x=>{if(out.length<2&&!seen.has(x)){seen.add(x);out.push(x);}});
  const alts=[];
  DETECT.forEach(ops=>{if(ops[0]===o1&&ops.join()!==c.ops.join()) alts.push(ops);});
  ALL1.forEach(o=>{if(o!==o1) alts.push([o,...tail]);});
  shuffle(alts).forEach(ops=>{
    if(out.length>=3) return;
    const s=run(v,ops);
    if(!s) return;
    const x=s[s.length-1].k;
    if(!seen.has(x)){seen.add(x);out.push(x);}
  });
  if(out.length<3) return null;
  return {v,e:c.e,ops:c.ops,k,blank:c.e.ja.replace(k,"＿＿"),opts:shuffle([k,...out])};
}

const nearVerbs=()=>VERBS.filter(x=>x.t!=="k");

window.speedNext=function(){
  const v=pick(nearVerbs()),op=pick(singleOps());
  const f=OPS[op].fn(base(v));
  G.stage="form";
  G.q={v,op,f,opts:formOpts(v,op,f.k)};
  renderSpeed();
};
window.renderSpeed=function(){
  const left=Math.max(0,G.end-Date.now());
  const head=`<div class="qhead">⏱ 60秒挑战</div>
    <div class="tbar"><div id="sbar" style="width:${left/600}%"></div></div>
    <div class="gstat"><span>答对 ${G.score} 题</span><span>${G.combo>=2?"🔥 "+G.combo+" Combo":""}</span><span id="stime">${Math.ceil(left/1000)} 秒</span></div>`;
  let body;
  if(G.stage==="sent"){
    const s=G.q2;
    body=`<div class="muted">✓ 追加一题：在句子里填入「${s.v.k}」的正确形式</div>
      <div class="box"><div class="big">${blankify(s.blank)}</div><div class="muted">${esc(s.e.zh)}</div></div>
      ${s.opts.map((o,i)=>`<button class="gbtn" onclick="speedPick(${i})">${esc(o)}</button>`).join("")}`;
  } else {
    const q=G.q;
    body=`<div class="box" style="text-align:center"><div class="big2">${q.v.k}（${q.v.zh}）→ ${OPS[q.op].label}</div></div>
      ${q.opts.map((o,i)=>`<button class="gbtn" onclick="speedPick(${i})">${esc(o)}</button>`).join("")}`;
  }
  $("q").innerHTML=head+body+`<div class="gfb">${G.fb}</div>`;
};
window.speedPick=function(i){
  if(!G.run||G.id!=="speed") return;
  if(G.stage==="sent"){
    const s=G.q2,o=s.opts[i];
    if(o===undefined) return;
    if(o===s.k){G.score++;G.combo++;G.maxc=Math.max(G.maxc,G.combo);G.fb=`✓ ${esc(s.e.ja)}`;}
    else{G.combo=0;G.fb=`✗ 正确是「${esc(s.k)}」：${esc(s.e.ja)}`;}
    speedNext();
    return;
  }
  const q=G.q,o=q.opts[i];
  if(o===undefined) return;
  if(o===q.f.k){
    G.score++;G.combo++;G.maxc=Math.max(G.maxc,G.combo);
    G.fb="✓ 正确！";
    const fol=sentenceFollow(q.v,q.op);
    if(fol){G.q2=fol;G.stage="sent";renderSpeed();return;}
  } else {
    G.combo=0;
    G.fb=`✗ ${q.v.k}的${OPS[q.op].label}是「${q.f.k}」，「${esc(o)}」${nmList(q.v,q.op).includes(o)?"是常见的错误写法":"是别的形态"}`;
  }
  speedNext();
};

CATN.near="易错形辨析";
TYPES.push("near");

function showNear(o){
  const v=pick(nearVerbs()),op=pick(singleOps());
  const f=OPS[op].fn(base(v));
  cur=Object.assign({type:"near",v,op,f,opts:formOpts(v,op,f.k),stage:"form"},o||{});
  phase="ask"; firstTry=true;
  $("q").innerHTML=qHead("易错形辨析")+`
    <div class="box"><div class="muted">选出正确的形式（有些选项是常见的错误写法）</div>
    <div class="big">${fmt(v)}（${v.zh}）→ ${OPS[op].label}</div></div>`+
    cur.opts.map((x,i)=>`<button class="opt" data-i="${i}" onclick="answerNear(${i},this)">${esc(x)}</button>`).join("");
  renderAll();
}
function answerNear(i,el){
  if(phase!=="ask") return;
  const c=cur,vi=VERBS.indexOf(c.v);
  if(c.stage==="sent"){
    const s=c.fol,ok=s.opts[i]===s.k;
    markChoice(s.opts.indexOf(s.k),el,ok);
    const cheers=record(ok,"near");
    if(!ok) srsAdd({kind:"chain",vi,ops:s.ops,j:s.ops.length-1,cat:opCat(s.ops[s.ops.length-1])});
    save();
    SPK=s.e.ja;
    finish(ok,`<div class="row">正确答案：「${esc(s.k)}」（${s.ops.map(o=>OPS[o].label).join(" ＋ ")}）</div>
      <div class="row">完整句子：${esc(s.e.ja)}<button class="mini" onclick="speak(SPK)">朗读</button></div>
      <div class="muted">${esc(s.e.zh)}</div>`,cheers);
    return;
  }
  const ok=c.opts[i]===c.f.k;
  markChoice(c.opts.indexOf(c.f.k),el,ok);
  const cheers=record(ok,["near",opCat(c.op)]);
  if(!ok) srsAdd({kind:"chain",vi,ops:[c.op],j:0,cat:opCat(c.op)});
  save();
  if(ok){
    const fol=sentenceFollow(c.v,c.op);
    if(fol){
      c.stage="sent"; c.fol=fol;
      $("q").innerHTML=qHead("易错形辨析 · 追加题")+
        cheers.map(t=>`<div class="celebrate">${t}</div>`).join("")+`
        <div class="ok-h">✓ ${c.v.k}的${OPS[c.op].label}是「${esc(c.f.k)}」！</div>
        <div class="box"><div class="muted">追加一题：在句子里填入「${c.v.k}」的正确形式（换了一种形态）</div>
        <div class="big">${blankify(fol.blank)}</div><div class="muted">${esc(fol.e.zh)}</div></div>`+
        fol.opts.map((x,j)=>`<button class="opt" data-i="${j}" onclick="answerNear(${j},this)">${esc(x)}</button>`).join("");
      renderAll();
      return;
    }
  }
  const wrongNote=!ok&&nmList(c.v,c.op).includes(c.opts[i])?`<div class="note">「${esc(c.opts[i])}」是常见的错误写法。</div>`:"";
  SPK=c.f.k;
  finish(ok,`<div class="row">正确答案：「${fmt(c.f)}」<button class="mini" onclick="speak(SPK)">朗读</button></div>
    ${wrongNote}<div class="hint">技巧：${HINT[c.op]||""}</div>`,cheers);
}

const _startTypeBeforeNear=window.startType;
window.startType=function(t,o){
  if(t==="near") return showNear(o||{});
  return _startTypeBeforeNear(t,o);
};
const CYCLE3=["chain","near","mix","jlpt","chain","fix","near","parse","conf","chain","fill","write","cls","weak"];
window.pickSmart=function(){
  const due=dueList();
  if(due.length) return {type:"review",item:due[0]};
  S.smartN=(S.smartN||0)+1;
  let t=CYCLE3[S.smartN%CYCLE3.length];
  if(t==="write"&&!AIKEY&&!cloud) t="fix";
  if(TYPES.includes(t)&&catMastered(t)&&Math.random()<0.6) t="chain";
  if(t==="weak"){
    const w=weakCats();
    if(w.length) return {type:"weak",cat:w[0]};
    t="chain";
  }
  return {type:t};
};
