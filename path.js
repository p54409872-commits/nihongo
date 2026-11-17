const PATH=[
  {id:"masu",n:"ます形",lv:"N5",l:4,tpl:[["masu"]]},
  {id:"masen",n:"ません・ました・ませんでした",lv:"N5",l:4,tpl:[["masu","masen"],["masu","mashita"],["masu","masen","msd"]]},
  {id:"mashou",n:"ましょう",lv:"N5",l:6,tpl:[["masu","mashou"]]},
  {id:"te",n:"て形",lv:"N5",l:14,tpl:[["te"]]},
  {id:"teiru",n:"ている",lv:"N5",l:15,tpl:[["teiru"],["teiru","masu"],["teiru","nai"]]},
  {id:"nai",n:"ない形",lv:"N5",l:17,tpl:[["nai"]]},
  {id:"naku",n:"なければ・なくて",lv:"N5",l:17,tpl:[["nai","adjBa"],["nai","adjTe"]]},
  {id:"ta",n:"た形",lv:"N5",l:19,tpl:[["ta"]]},
  {id:"nakatta",n:"なかった（普通形）",lv:"N5",l:20,tpl:[["nai","adjPast"]]},
  {id:"tara",n:"たら条件形",lv:"N5",l:25,tpl:[["ta","tara"],["nai","adjPast","tara"]]},
  {id:"pot",n:"可能形",lv:"N4",l:27,tpl:[["pot"],["pot","nai"],["pot","masu"]]},
  {id:"vol",n:"意向形",lv:"N4",l:31,tpl:[["vol"]]},
  {id:"imp",n:"命令形",lv:"N4",l:33,tpl:[["imp"]]},
  {id:"ba",n:"ば条件形",lv:"N4",l:35,tpl:[["ba"],["nai","adjBa"]]},
  {id:"pas",n:"被动形",lv:"N4",l:37,tpl:[["pas"],["pas","ta"]]},
  {id:"cau",n:"使役形",lv:"N4",l:48,tpl:[["cau"],["cau","te"]]},
  {id:"cp",n:"使役被动形",lv:"N3",l:51,tpl:[["cp"],["cp","ta"]]}
];
const PATH_VERBS=["行く","来る","見る","書く","読む","話す","待つ","買う","飲む","会う","帰る","起きる",
  "使う","作る","聞く","遊ぶ","休む","持つ","取る","乗る","立つ","勉強する","教える","始める",
  "忘れる","出る","着る","洗う","泳ぐ","急ぐ","呼ぶ","払う","送る","働く","覚える","探す",
  "返す","手伝う","選ぶ","答える","考える","続ける","決める","調べる","受ける","連絡する","準備する","確認する"];

document.head.insertAdjacentHTML("beforeend",`<style>
.lmode{margin-top:10px;font-size:14px;display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.pathbox{margin-top:10px;background:var(--pink-bg);border-radius:10px;padding:10px 12px;font-size:14px}
.pathbox .barw div{background:var(--pink)}
.pathbox select{font-size:13px}
.pcfg{display:flex;flex-wrap:wrap;gap:10px;margin:6px 0}
.pitem{font-size:14px;padding:3px 0}
.nextbar{position:fixed;left:0;right:0;bottom:0;padding:10px 16px calc(10px + env(safe-area-inset-bottom));background:rgba(246,245,241,.96);border-top:1px solid var(--line);display:flex;justify-content:center;z-index:50}
.nextbar.hidden{display:none}
.nextbar .btn{width:100%;max-width:520px;font-size:18px;padding:14px}
body{padding-bottom:90px}
.conf{position:fixed;top:-40px;font-size:26px;z-index:99;pointer-events:none;animation:cfall 2.2s ease-in forwards}
@keyframes cfall{to{transform:translateY(110vh) rotate(360deg);opacity:.3}}
</style>`);

function isPath(){return (S.lmode||(pid==="yueyue"?"path":"adv"))==="path";}
function pcfg(){if(!S.pcfg) S.pcfg={lesson:5,target:120,day:20};return S.pcfg;}
const pT=()=>pcfg().target,pD=()=>pcfg().day,pR=()=>Math.round(pcfg().target*0.4);
function pathState(){if(!S.path) S.path={items:{}};return S.path;}
function itemOf(i){
  const st=pathState(),id=PATH[i].id;
  if(!st.items[id]) st.items[id]={done:0,day:"",dn:0,passed:false,tries:0};
  return st.items[id];
}
function curItem(){
  for(let i=0;i<PATH.length;i++) if(!itemOf(i).passed) return i;
  return PATH.length-1;
}
const itemLocked=i=>PATH[i].l>pcfg().lesson;
const dayN=d=>d.day===today()?d.dn:0;
function pathVerbs(i){
  const n=Math.min(PATH_VERBS.length,12+3*i);
  return PATH_VERBS.slice(0,n).map(k=>VERBS.find(v=>v.k===k)).filter(Boolean);
}
function nextPV(i){
  const L=pathVerbs(i);
  S.pV=((S.pV||0)+1)%100000;
  return L[S.pV%L.length];
}
function confetti(){
  const e=["🎉","✨","🌸","⭐","🎊","💮"];
  for(let k=0;k<26;k++){
    const s=document.createElement("span");
    s.className="conf";
    s.textContent=pick(e);
    s.style.left=(Math.random()*100)+"vw";
    s.style.animationDelay=(Math.random()*0.6)+"s";
    document.body.appendChild(s);
    setTimeout(()=>s.remove(),3000);
  }
}
function setLMode(v){
  S.lmode=v;
  if(v==="path"&&(!S.goal||S.goal>=50)) S.goal=25;
  save(); renderAll();
  if(mode==="smart") newQuestion();
}
function setPcfg(k,v){
  pcfg()[k]=+v;
  save(); renderAll();
  if(mode==="smart") newQuestion();
}

function optsFor(v,ops){
  const s=run(v,ops);
  if(!s) return null;
  const k=s[s.length-1].k;
  const o1=ops[0],tail=ops.slice(1);
  const baseK=OPS[o1].fn(base(v)).k;
  let near=[];
  if(typeof nmList==="function"){
    if(!tail.length) near=nmList(v,o1);
    else if(k.startsWith(baseK.slice(0,-1))){
      const suf=k.slice(baseK.length-1);
      near=nmList(v,o1).map(x=>x.slice(0,-1)+suf);
    }
  }
  const seen=new Set([k]),out=[];
  shuffle(near).forEach(x=>{if(out.length<2&&!seen.has(x)){seen.add(x);out.push(x);}});
  const alts=[];
  PATH.forEach(p=>p.tpl.forEach(t=>alts.push(t)));
  ["masu","te","ta","nai","pot","pas","cau","ba","vol","imp"].forEach(o=>alts.push([o,...tail]));
  shuffle(alts).forEach(a=>{
    if(out.length>=3) return;
    const r=run(v,a);
    if(!r) return;
    const x=r[r.length-1].k;
    if(!seen.has(x)){seen.add(x);out.push(x);}
  });
  if(out.length<3) return null;
  return {k,opts:shuffle([k,...out])};
}

function pathNear(v,op,o){
  const f=OPS[op].fn(base(v));
  const opts=(typeof formOpts==="function")?formOpts(v,op,f.k):(optsFor(v,[op])||{opts:[f.k]}).opts;
  cur=Object.assign({type:"near",v,op,f,opts,stage:"form"},o||{});
  phase="ask"; firstTry=true;
  $("q").innerHTML=qHead("易错形辨析")+`
    <div class="box"><div class="muted">选出正确的形式（有些选项是常见的错误写法）</div>
    <div class="big">${fmt(v)}（${v.zh}）→ ${OPS[op].label}</div></div>
    <div class="hint">技巧：${HINT[op]||""}</div>`+
    opts.map((x,i)=>`<button class="opt" data-i="${i}" onclick="answerNear(${i},this)">${esc(x)}</button>`).join("");
  renderAll();
}

function pathQuestion(i,o,old){
  const item=PATH[i],v=nextPV(i);
  const tag=old?{pathOld:i}:{pathItem:i};
  const singles=item.tpl.filter(t=>t.length===1).map(t=>t[0]);
  const r=Math.random();
  if(singles.length&&r<0.25&&typeof answerNear==="function") return pathNear(v,pick(singles),Object.assign({},o,tag));
  if(r<0.4){
    const cats=item.tpl.map(t=>opCat(t[t.length-1]));
    const idx=FILL.map((x,k)=>k).filter(k=>cats.includes(FILL[k].c));
    if(idx.length) return showFill(pick(idx),Object.assign({},o,tag));
  }
  S.pT=((S.pT||0)+1)%100000;
  const ops=item.tpl[S.pT%item.tpl.length].slice();
  return startChain(v,ops,Object.assign({tip:"auto"},o,tag));
}

function showTestReady(i){
  const item=PATH[i],d=itemOf(i);
  phase="none"; cur={type:"none"};
  $("q").innerHTML=`<div class="qhead">📝「${item.n}」已经练够 ${pT()} 题了！</div>
    <p>现在可以参加模拟测试：一共 10 题，错 3 题以内就通关，解锁下一关。${d.tries?`（这是第 ${d.tries+1} 次挑战，加油！）`:""}</p>
    <div class="hint">考前看一眼规则：<br>${[...new Set(item.tpl.map(t=>t[t.length-1]))].map(o=>OPS[o].label+"："+(HINT[o]||"")).join("<br>")}</div>
    <div class="btns"><button class="btn main" onclick="startPTest(${i})">开始测试</button></div>`;
  renderAll();
}

function pathStart(o){
  const i=curItem(),d=itemOf(i);
  const passed=PATH.map((p,k)=>k).filter(k=>itemOf(k).passed);
  const due=dueList();
  if(itemLocked(i)){
    if(due.length) return startReview(due[0]);
    if(passed.length) return pathQuestion(pick(passed),o,true);
