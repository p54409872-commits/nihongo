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
    return showCls(o,pick(pathVerbs(0)));
  }
  if(d.done>=pT()) return showTestReady(i);
  if(due.length&&Math.random()<0.35) return startReview(due[0]);
  if(dayN(d)>=pD()){
    if(due.length) return startReview(due[0]);
    if(passed.length) return pathQuestion(pick(passed),o,true);
    return showCls(o,pick(pathVerbs(0)));
  }
  if(passed.length&&Math.random()<0.15) return pathQuestion(pick(passed),o,true);
  return pathQuestion(i,o,false);
}

function sentQs(item){
  const res=[];
  VERBS.forEach(v=>{
    (v.ex||[]).forEach(e=>{
      item.tpl.forEach(ops=>{
        const s=run(v,ops);
        if(!s) return;
        const k=s[s.length-1].k;
        if(!e.ja.includes(k)) return;
        const o=optsFor(v,ops);
        if(o) res.push({kind:"sent",v,ops,k,e,opts:o.opts});
      });
    });
  });
  return shuffle(res);
}

function buildTest(i){
  const item=PATH[i],qs=sentQs(item).slice(0,5);
  let g=0;
  while(qs.length<10&&g<300){
    g++;
    const v=pick(pathVerbs(i)),ops=pick(item.tpl);
    if(qs.some(q=>q.v===v&&q.ops.join()===ops.join())) continue;
    const o=optsFor(v,ops);
    if(o) qs.push({kind:"form",v,ops,k:o.k,opts:o.opts});
  }
  return shuffle(qs);
}

let PT=null;
function startPTest(i){
  PT={i,qs:buildTest(i),k:0,wrong:0,ans:null};
  cur={type:"ptest"};
  phase="ptest";
  renderPTest();
}
function renderPTest(){
  const q=PT.qs[PT.k],item=PATH[PT.i];
  const body=q.kind==="sent"
    ?`<div class="box"><div class="muted">在空格里选出正确的形式</div><div class="big">${blankify(q.e.ja)}</div><div class="muted">${esc(q.e.zh)}</div></div>`
    :`<div class="box"><div class="muted">选出正确的形式</div><div class="big">${fmt(q.v)}（${q.v.zh}）→ ${q.ops.map(o=>OPS[o].label).join(" ＋ ")}</div></div>`;
  $("q").innerHTML=`<div class="qtop">${esc(pname())} · 闯关测试</div>
    <div class="qhead">📝「${item.n}」模拟测试 · 第 ${PT.k+1}/${PT.qs.length} 题</div>
    <div class="muted">JLPT 风格的原创测试题。错 4 题以上要回去再练一下。目前错了 ${PT.wrong} 题。</div>`+
    body+q.opts.map((x,j)=>`<button class="opt" data-i="${j}" onclick="answerPTest(${j},this)">${esc(x)}</button>`).join("")+
    `<div id="ptfb"></div>`;
  hideBar(); renderAll(); scrollQ();
}

function answerPTest(j,el){
  if(!PT||PT.ans!==null) return;
  const q=PT.qs[PT.k];
  PT.ans=j;
  const ok=q.opts[j]===q.k;
  markChoice(q.opts.indexOf(q.k),el,ok);
  if(!ok){
    PT.wrong++;
    srsAdd({kind:"chain",vi:VERBS.indexOf(q.v),ops:q.ops,j:q.ops.length-1,cat:opCat(q.ops[q.ops.length-1])});
  }
  const ch=record(ok,opCat(q.ops[q.ops.length-1]));
  save();
  $("ptfb").innerHTML=(ok?`<div class="ok-h">✓ 正确</div>`:`<div class="ng-h">✗ 正确答案是「${esc(q.k)}」</div>`)+
    (q.kind==="sent"?`<div class="muted">${esc(q.e.ja)}</div>`:"")+
    ch.map(c=>`<div class="celebrate">${c}</div>`).join("");
  showBar(PT.k<PT.qs.length-1?"下一题 →":"看测试结果 →");
}
function ptestNext(){
  if(!PT||PT.ans===null) return;
  PT.k++; PT.ans=null;
  if(PT.k<PT.qs.length) renderPTest();
  else endPTest();
}
function endPTest(){
  const i=PT.i,d=itemOf(i),item=PATH[i],total=PT.qs.length,score=total-PT.wrong;
  let h;
  if(PT.wrong>=4){
    d.done=Math.max(0,pT()-pR());
    d.tries=(d.tries||0)+1;
    h=`<div class="ng-h">得分 ${score}/${total}，还差一点点</div>
      <p>错了 ${PT.wrong} 题。我们回去把「${item.n}」再练 ${pR()} 题，然后再考一次。第一次没过很正常，多练几次就稳了！</p>
      <div class="hint">复习一下规则：<br>${[...new Set(item.tpl.map(t=>t[t.length-1]))].map(o=>OPS[o].label+"："+(HINT[o]||"")).join("<br>")}</div>`;

  } else {
    d.passed=true;
    d.passDate=today();
    const nx=PATH[i+1];
    h=`<div class="ok-h">🎉 得分 ${score}/${total}，「${item.n}」通关！</div>
      <p>${nx?(nx.l>pcfg().lesson?`下一关「${nx.n}」在课本第 ${nx.l} 课，等课本学到了再来挑战。这段时间会帮你复习学过的内容。`:`下一关：「${nx.n}」（${nx.lv}）。${esc(pname())}太棒了，继续加油！`):"全部关卡都完成了！"}</p>`;
    confetti();
  }
  save();
  PT=null; phase="none";
  $("q").innerHTML=`<div class="qhead">📝 测试结果</div>${h}<div class="btns"><button class="btn main" onclick="newQuestion()">继续练习</button></div>`;
  hideBar(); renderAll(); scrollQ();
}

const _recBeforePath=window.record;
window.record=function(ok,cats){
  const ch=_recBeforePath(ok,cats);
  if(isPath()&&cur&&cur.pathItem!==undefined){
    const d=itemOf(cur.pathItem),t=today();
    if(d.day!==t){d.day=t;d.dn=0;}
    d.done++; d.dn++;
    const nm=PATH[cur.pathItem].n;
    if(d.done===pT()) ch.push(`🎯「${nm}」已经练够 ${pT()} 题！接下来可以参加模拟测试了。`);
    else if(d.dn===pD()) ch.push(`今天「${nm}」已经练了 ${pD()} 题，新内容就到这里。接下来复习以前学过的内容，分几天练记得更牢！`);
  }
  if(ok&&isPath()){
    const m={3:"👍 连对3题，好的开始！",8:"🌟 连对8题，越来越稳了！",15:"🔥 连对15题！太厉害了！",25:"🏆 连对25题！已经掌握得很好了！",40:"👑 连对40题！简直是变形小达人！"}[S.streak];
    if(m){ch.push(m);if(S.streak>=15) confetti();}
  }
  return ch;
};


const _topLabelBeforePath=window.topLabel;
window.topLabel=function(){
  if(cur&&cur.pathItem!==undefined&&!cur.review){
    const d=itemOf(cur.pathItem);
    return `🌱 闯关「${PATH[cur.pathItem].n}」 · ${d.done}/${pT()}（今天 ${dayN(d)}/${pD()}）`;
  }
  if(cur&&cur.pathOld!==undefined) return `🔁 复习已通关的「${PATH[cur.pathOld].n}」`;
  return _topLabelBeforePath();
};

const _pickSmartBeforePath=window.pickSmart;
window.pickSmart=function(){
  if(!isPath()) return _pickSmartBeforePath();
  if(itemOf(curItem()).passed) return _pickSmartBeforePath();
  return {type:"path"};
};
const _startTypeBeforePath=window.startType;
window.startType=function(t,o){
  if(t==="path") return pathStart(o||{});
  return _startTypeBeforePath(t,o);
};

window.ensureGoal=function(){
  if(isPath()){if(!S.goal||S.goal<15) S.goal=25;}
  else if(!S.goal||S.goal<MIN) S.goal=MIN;
};
window.dayStat=function(d,k){
  const c=d.days[k]||0,ok=(d.daysOk||{})[k]||0;
  return {c,ok,p:c?ok/c:0,g:d.goal||MIN};
};
window.judge=function(a,b){
  const qa=a.c>=(a.g||MIN),qb=b.c>=(b.g||MIN);

  if(qa&&qb){
    if(a.p!==b.p) return {w:a.p>b.p?0:1};
    if(a.c!==b.c) return {w:a.c>b.c?0:1};
    return {w:-1};
  }
  if(qa) return {w:0};
  if(qb) return {w:1};
  return {w:-1,none:true};
};
window.statusText=function(d,k){
  if(k<d.start) return {txt:"—",cls:""};
  const x=dayStat(d,k);
  if(x.c===0) return {txt:"😴 "+lazyMsg(lazyDays(d,k)),cls:"lazy"};
  if(x.c<x.g) return {txt:`${pct(x)}%（${x.c}/${x.g}题）· 未达标`,cls:"miss"};
  return {txt:`${pct(x)}%（${x.c}题）`,cls:"okd"};
};
window.renderPK=function(){
  const t=today(),y=addDays(t,-1);
  const D=PROFILES.map(p=>getData(p.id));
  const first=D.map(d=>d.start).sort()[0];
  const now=D.map(d=>dayStat(d,t));
  const jn=judge(now[0],now[1]);
  let h=`<h3 style="margin-top:0">今日PK（${md(t)}）· 比正确率</h3>
    <div class="muted">每个人完成自己的每日目标就算达标（${esc(PROFILES[0].name)} ${now[0].g} 题，${esc(PROFILES[1].name)} ${now[1].g} 题），达标的人比正确率。每天晚上12点出结果。</div>`;
  now.forEach((x,i)=>{
    const d=D[i],lz=y>=d.start?lazyDays(d,y):0;
    let st;
    if(x.c===0) st=lz>0?`今天还没开始 · 已经连续偷懒 ${lz} 天了，快回来！`:"今天还没开始";
    else if(x.c<x.g) st=`还差 ${x.g-x.c} 题达标`;
    else st="已达标 ✓";
    h+=`<div class="pkrow">
      <div class="pkname"><span>${jn.w===i?'<span class="crown">♛ </span>':""}${esc(PROFILES[i].name)}</span><span>${x.c}/${x.g} 题 · 正确率 ${x.c?pct(x)+"%":"—"}</span></div>

      <div class="pkbar"><div class="p${i}" style="width:${Math.min(100,x.c/x.g*100)}%"></div></div>
      <div class="muted">${st}</div></div>`;
  });
  let msg;
  if(now[0].c===0&&now[1].c===0) msg="今天的PK还没开始，谁先来？";
  else if(jn.none) msg="还没有人完成每日目标，先达标才有资格比正确率！";
  else if(jn.w===-1) msg="两个人正确率和题数都一样，平手！";
  else msg=`${esc(PROFILES[jn.w].name)} 暂时领先！`;
  h+=`<div class="pkmsg">${msg}</div>`;
  if(y>=first){
    const ys=D.map(d=>dayStat(d,y)),jy=judge(ys[0],ys[1]);
    h+=`<div class="yest"><b>昨日结果（${md(y)}）：</b>${jy.w>=0?"♛ "+esc(PROFILES[jy.w].name)+" 获胜！":jy.none?"两个人都没达标，无人获胜。":"平局！"}`+
      D.map((d,i)=>`<div>${esc(PROFILES[i].name)}：${statusText(d,y).txt}</div>`).join("")+`</div>`;
  }
  const wins=[0,0,0],rows=[];
  let k=first,guard=0;
  while(k<t&&guard<400){
    const s=D.map(d=>dayStat(d,k)),r=judge(s[0],s[1]);
    if(r.w>=0) wins[r.w]++; else if(!r.none) wins[2]++;
    rows.push({k,r});
    k=addDays(k,1); guard++;
  }
  h+=`<h3>每日战绩</h3><div class="muted">${esc(PROFILES[0].name)} 胜 ${wins[0]} 场 ｜ ${esc(PROFILES[1].name)} 胜 ${wins[1]} 场 ｜ 平局 ${wins[2]} 场</div>`;
  if(rows.length){
    h+=`<table style="margin-top:8px"><tr><th>日期</th><th>${esc(PROFILES[0].name)}</th><th>${esc(PROFILES[1].name)}</th><th>结果</th></tr>`;
    rows.reverse().slice(0,14).forEach(x=>{
      h+=`<tr><td>${md(x.k)}</td>`+D.map(d=>{const s=statusText(d,x.k);return `<td class="${s.cls}">${s.txt}</td>`;}).join("")+
        `<td>${x.r.w>=0?"♛ "+esc(PROFILES[x.r.w].name):x.r.none?"无人达标":"平局"}</td></tr>`;
    });
    h+=`</table>`;
  } else h+=`<div class="muted" style="margin-top:6px">从明天开始，每天的结果都会记录在这里。</div>`;
  $("pk").innerHTML=h;

  if(typeof renderTravel==="function") renderTravel();
};

const _renderDashBeforePath=window.renderDash;
window.renderDash=function(){
  _renderDashBeforePath();
  const p=isPath();
  if(p){
    const sel=document.querySelector('#dash select[onchange^="setGoal"]');
    if(sel) sel.innerHTML=[15,20,25,30,40,50].map(x=>`<option value="${x}" ${x===S.goal?"selected":""}>${x}题</option>`).join("");
  }
  let h=`<div class="lmode"><span>学习模式：</span>
    <select onchange="setLMode(this.value)">
      <option value="path" ${p?"selected":""}>🌱 闯关（按《大家的日语》顺序，一个语法练够再考试）</option>
      <option value="adv" ${!p?"selected":""}>🚀 进阶（各种题型随机混合）</option>
    </select></div>`;
  if(p){
    const c=pcfg(),i=curItem(),d=itemOf(i),item=PATH[i];
    let status;
    if(d.passed) status="✓ 全部通关";
    else if(itemLocked(i)) status=`🔒 等课本学到第 ${item.l} 课再解锁，现在先复习学过的内容`;
    else if(d.done>=pT()) status="📝 可以参加模拟测试了";
    else status=`练习 ${d.done}/${pT()} ｜ 今天新题 ${dayN(d)}/${pD()}`;
    h+=`<div class="pathbox">
      <div class="pcfg">
        <label>课本进度：<select onchange="setPcfg('lesson',this.value)">${Array.from({length:51},(x,k)=>k+1).map(n=>`<option value="${n}" ${n===c.lesson?"selected":""}>${n===51?"初级学完（TRY N3）":"第 "+n+" 课"}</option>`).join("")}</select></label>
        <label>每个语法练习量：<select onchange="setPcfg('target',this.value)">${[80,120,200].map(n=>`<option value="${n}" ${n===c.target?"selected":""}>${n}题</option>`).join("")}</select></label>
        <label>每天新题：<select onchange="setPcfg('day',this.value)">${[15,20,30,40].map(n=>`<option value="${n}" ${n===c.day?"selected":""}>${n}题</option>`).join("")}</select></label>
      </div>
      <b>当前关卡 ${i+1}/${PATH.length}：「${item.n}」（${item.lv}・第 ${item.l>50?"N3":item.l} 课）</b><br>${status}${d.tries?` ｜ 已重练 ${d.tries} 次`:""}
      <div class="barw"><div style="width:${Math.min(100,d.done/pT()*100)}%"></div></div>
      <details><summary>查看全部关卡</summary>${PATH.map((it,k)=>{

        const x=itemOf(k);
        const icon=x.passed?"✅":itemLocked(k)?"🔒":k===i?"▶️":"⬜";
        return `<div class="pitem">${icon} ${k+1}. ${it.n}（${it.l>50?"TRY N3":"第"+it.l+"课"}）${x.passed?" 通关":k===i&&!itemLocked(k)?` ${x.done}/${pT()}`:""}</div>`;
      }).join("")}</details></div>`;
  }
  $("dash").insertAdjacentHTML("beforeend",h);
};

document.body.insertAdjacentHTML("beforeend",`<div id="nextbar" class="nextbar hidden"><button class="btn main" id="nextbtn" onclick="stickyNext()">下一题 →</button></div>`);
function showBar(label){
  $("nextbtn").textContent=label||"下一题 →";
  $("nextbar").classList.remove("hidden");
}
function hideBar(){const b=$("nextbar");if(b) b.classList.add("hidden");}
function scrollQ(){const q=$("q");if(q&&!setup) q.scrollIntoView({behavior:"smooth",block:"start"});}
function stickyNext(){
  if(PT) return ptestNext();
  hideBar();
  next();
}
const _finishBeforeBar=window.finish;
window.finish=function(ok,body,cheers){
  _finishBeforeBar(ok,body,cheers);
  showBar(nextLabel()+" →");
  const r=$("res");
  if(r) r.scrollIntoView({behavior:"smooth",block:"start"});
};
const _showChainBeforeBar=window.showChain;
window.showChain=function(){
  hideBar();
  _showChainBeforeBar();
  scrollQ();

};
const _retryBeforeBar=window.retry;
window.retry=function(){
  hideBar();
  _retryBeforeBar();
};
const _nqBeforeBar=window.newQuestion;
window.newQuestion=function(){
  hideBar();
  PT=null;
  const r=_nqBeforeBar();
  scrollQ();
  return r;
};
