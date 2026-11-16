const PUZZLES=[
  {zh:"能请您今天之内确认资料吗？",p:["今日中に","資料を","確認して","いただけますか。"]},
  {zh:"和部长商量之后再联系您。",p:["部長と","相談した","うえで","ご連絡します。"]},
  {zh:"为了日语变好，每天都在练习。",p:["日本語が","上手に","なるように","毎日","練習しています。"]},
  {zh:"尽管下着雨，比赛也没有取消。",p:["雨が","降っていた","にもかかわらず","試合は","中止に","なりませんでした。"]},
  {zh:"小时候被妈妈逼着学钢琴。",p:["子どものころ","母に","ピアノを","習わされました。"]},
  {zh:"明天之前必须提交报告。",p:["明日までに","報告書を","提出しなければ","なりません。"]},
  {zh:"到了车站之后请打电话。",p:["駅に","着いたら","電話して","ください。"]},
  {zh:"这道菜看起来普通，其实非常好吃。",p:["この料理は","見た目の","わりに","とても","おいしいです。"]},
  {zh:"入金还没有确认。",p:["まだ","入金を","確認して","いません。"]},
  {zh:"请让我考虑一下。",p:["少し","考えさせて","ください。"]},
  {zh:"朋友在我生日时送了我礼物。",p:["友だちが","誕生日に","プレゼントを","くれました。"]},
  {zh:"太忙了，没有吃午饭的时间。",p:["忙しくて","昼ご飯を","食べる","時間が","ありませんでした。"]},
  {zh:"能请您教我新系统的用法吗？",p:["新しい","システムの","使い方を","教えて","いただけますか。"]},
  {zh:"下个月要调到大阪工作了。",p:["来月","大阪に","転勤する","ことに","なりました。"]},
  {zh:"想趁年轻去各个国家看看。",p:["若い","うちに","いろいろな国へ","行ってみたいです。"]}
];

const BADGES=[
  {id:"first",i:"🌱",n:"第一步",d:"答对第1题",c:s=>s.correct>=1},
  {id:"q100",i:"📘",n:"百题达人",d:"累计答题100题",c:s=>s.total>=100},
  {id:"q500",i:"📚",n:"五百题",d:"累计答题500题",c:s=>s.total>=500},
  {id:"q1000",i:"🏛",n:"千题之路",d:"累计答题1000题",c:s=>s.total>=1000},
  {id:"q3000",i:"👑",n:"题海霸主",d:"累计答题3000题",c:s=>s.total>=3000},
  {id:"c10",i:"🔥",n:"十连对",d:"连续答对10题",c:s=>s.best>=10},
  {id:"c30",i:"⚡",n:"三十连对",d:"连续答对30题",c:s=>s.best>=30},
  {id:"d3",i:"📅",n:"三日坚持",d:"连续打卡3天",c:s=>streakOf(s)>=3},
  {id:"d7",i:"🗓",n:"一周不断",d:"连续打卡7天",c:s=>streakOf(s)>=7},
  {id:"d30",i:"🏆",n:"月度铁人",d:"连续打卡30天",c:s=>streakOf(s)>=30},
  {id:"u1",i:"🎯",n:"首个单元",d:"通过任意1个单元",c:s=>passedN(s)>=1},
  {id:"u6",i:"🎓",n:"全部通关",d:"通过全部6个单元",c:s=>passedN(s)>=6},
  {id:"n4",i:"✈️",n:"踏入N4",d:"跑道到达N4区",c:s=>s.correct>=300},

  {id:"n3",i:"🌏",n:"踏入N3",d:"跑道到达N3区",c:s=>s.correct>=800},
  {id:"n1",i:"🌟",n:"环游世界",d:"跑完全程",c:s=>s.correct>=4500},
  {id:"m10",i:"🧠",n:"记忆大师",d:"彻底掌握10道错题",c:s=>(s.mastered||0)>=10},
  {id:"pk1",i:"🥇",n:"PK首胜",d:"赢下一天的PK",c:s=>pkWins()>=1},
  {id:"pk10",i:"🏅",n:"PK十胜",d:"赢下10天的PK",c:s=>pkWins()>=10},
  {id:"g60",i:"⏱",n:"手速达人",d:"60秒挑战答对20题",c:s=>((s.games||{}).best60||0)>=20},
  {id:"gfall",i:"🧱",n:"分类高手",d:"掉落分类得30分",c:s=>((s.games||{}).bestFall||0)>=30},
  {id:"gmatch",i:"✨",n:"消除王",d:"消消乐60秒内完成",c:s=>!!((s.games||{}).bestMatch)&&s.games.bestMatch<=60},
  {id:"gpuz",i:"🧩",n:"拼句达人",d:"句子拼图一轮5句全对",c:s=>((s.games||{}).bestPuz||0)>=5}
];

document.head.insertAdjacentHTML("beforeend",`<style>
.ggrid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:10px}
.gcard{border:1px solid var(--line);border-radius:12px;padding:12px;background:#fff}
.gcard .gi{font-size:30px}
.gcard .gn{font-size:17px;font-weight:bold;margin:2px 0}
.bgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(92px,1fr));gap:8px;margin-top:8px}
.badge{text-align:center;border-radius:10px;padding:8px 4px;background:var(--gold-bg);font-size:12px;line-height:1.4}
.badge b{font-size:26px;display:block}
.badge.off{background:#f1efe8;opacity:.45;filter:grayscale(1)}
.tbar{height:10px;background:var(--line);border-radius:5px;overflow:hidden;margin:8px 0}
.tbar div{height:100%;background:var(--pink);transition:width .2s linear}
.gstat{display:flex;justify-content:space-between;font-size:15px;font-weight:bold}
.gbtn{display:block;width:100%;padding:14px;font-size:20px;margin-top:8px;border:2px solid var(--line);border-radius:10px;background:#fff;cursor:pointer;color:var(--ink)}
.gfb{min-height:24px;font-size:15px;margin-top:6px}
.fallbox{position:relative;height:340px;background:linear-gradient(#eaf3fb,#fff);border:1px solid var(--line);border-radius:12px;overflow:hidden;margin-top:10px}
.fblock{position:absolute;padding:8px 16px;background:var(--pink);color:#fff;border-radius:10px;font-size:22px;font-weight:bold;text-align:center;white-space:nowrap}
.fblock small{display:block;font-size:12px;font-weight:normal;opacity:.85}
.bins{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:8px}
.bins button{padding:16px 4px;font-size:16px;border-radius:10px;border:2px solid var(--accent);background:var(--accent-bg);cursor:pointer;color:var(--ink)}
.tiles{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:10px}
.tile{min-height:66px;padding:6px;border-radius:10px;border:2px solid var(--line);background:#fff;cursor:pointer;font-size:14px;color:var(--ink)}

.tile.ja{font-size:17px;font-weight:bold}
.tile.sel{border-color:var(--accent);background:var(--accent-bg)}
.tile.bad{border-color:var(--ng);background:var(--ng-bg)}
.tile.gone{visibility:hidden}
.chips{display:flex;flex-wrap:wrap;gap:8px;min-height:54px;padding:8px;border:1px dashed var(--line);border-radius:10px;margin-top:8px}
.chips.built{background:var(--accent-bg)}
.chip2{padding:8px 12px;border-radius:8px;background:#fff;border:1px solid var(--line);cursor:pointer;font-size:17px;color:var(--ink)}
.big2{font-size:24px;font-weight:bold;color:var(--accent)}
</style>`);

let G={run:false};
function stopGame(){
  G.run=false;
  if(G.timer) clearInterval(G.timer);
  if(G.raf) cancelAnimationFrame(G.raf);
}
function streakOf(s){
  const d=new Date();
  if(!s.checkins[fmtDate(d)]) d.setDate(d.getDate()-1);
  let k=0;
  while(s.checkins[fmtDate(d)]){k++;d.setDate(d.getDate()-1);}
  return k;
}
const passedN=s=>Object.values(s.units||{}).filter(u=>u.passed).length;
function pkWins(){
  if(typeof judge!=="function") return 0;
  const me=PROFILES.findIndex(p=>p.id===pid);
  const D=PROFILES.map(p=>getData(p.id));
  let k=D.map(d=>d.start).sort()[0],w=0,g=0;
  const t=today();
  while(k<t&&g<500){
    const s=D.map(d=>dayStat(d,k));

    if(judge(s[0],s[1]).w===me) w++;
    k=addDays(k,1); g++;
  }
  return w;
}
function initBadges(){
  if(S.badges) return;
  S.badges={};
  BADGES.forEach(b=>{try{if(b.c(S)) S.badges[b.id]=today();}catch(e){}});
}
function checkBadges(){
  initBadges();
  const nb=[];
  BADGES.forEach(b=>{
    if(S.badges[b.id]) return;
    try{if(b.c(S)){S.badges[b.id]=today();nb.push(b);}}catch(e){}
  });
  return nb;
}
const games=()=>S.games||(S.games={});
const otherGames=()=>getData(otherId()).games||{};
function singleOps(){
  const cu=Math.min(curUnit(),6);
  let o=["masu","te","ta","nai"];
  if(cu>=3) o.push("pot");
  if(cu>=4) o.push("ba","vol","imp");
  if(cu>=5) o.push("pas","cau");
  return o;
}
const ALL1=["masu","te","ta","nai","pot","pas","cau","ba","vol","imp"];

function showGameHub(){

  stopGame();
  initBadges();
  const my=games(),ot=otherGames(),on=esc(nameOf(otherId()));
  const cards=[
    {i:"⏱",n:"60秒挑战",d:"60秒内选出正确的变形，答对越多越好。",b:`我的最佳 ${my.best60||0} 题 ｜ ${on} ${ot.best60||0} 题`,f:"startSpeed()"},
    {i:"🧱",n:"掉落分类",d:"动词往下掉，落地前放进一类／二类／三类的篮子。",b:`我的最佳 ${my.bestFall||0} 分 ｜ ${on} ${ot.bestFall||0} 分`,f:"startFall()"},
    {i:"✨",n:"变形消消乐",d:"把日语变形和中文意思配对消除，越快越好。",b:`我的最快 ${my.bestMatch?my.bestMatch+"秒":"—"} ｜ ${on} ${ot.bestMatch?ot.bestMatch+"秒":"—"}`,f:"startMatch()"},
    {i:"🧩",n:"句子拼图",d:"把打乱的词块拼成正确的句子，一轮5句。",b:`我的最好 ${my.bestPuz||0}/5 ｜ ${on} ${ot.bestPuz||0}/5`,f:"startPuz()"}
  ];
  const got=BADGES.filter(b=>S.badges[b.id]).length;
  $("q").innerHTML=`<div class="qhead">🎮 游戏中心</div>
    <div class="muted">游戏不计入每日50题和PK，但会记录最高分、赢取徽章。</div>
    <div class="ggrid">${cards.map(c=>`<div class="gcard"><div class="gi">${c.i}</div><div class="gn">${c.n}</div>
      <div class="muted">${c.d}</div><div class="muted" style="margin:6px 0">${c.b}</div>
      <button class="btn main" onclick="${c.f}">开始</button></div>`).join("")}</div>
    <h3>🏅 ${esc(pname())}的徽章墙（${got}/${BADGES.length}）</h3>
    <div class="bgrid">${BADGES.map(b=>`<div class="badge ${S.badges[b.id]?"":"off"}" title="${b.d}"><b>${b.i}</b>${b.n}<div class="muted">${S.badges[b.id]?md(S.badges[b.id])+" 获得":b.d}</div></div>`).join("")}</div>`;
  renderAll();
}
function gameEnd(title,lines,again){
  stopGame();
  const nb=checkBadges();
  save();
  $("q").innerHTML=`<div class="qhead">${title}</div>
    ${lines.map(l=>`<div class="row">${l}</div>`).join("")}
    ${nb.map(b=>`<div class="celebrate">🏅 获得新徽章：${b.i} ${b.n}（${b.d}）</div>`).join("")}
    <div class="btns"><button class="btn main" onclick="${again}">再玩一次</button><button class="btn" onclick="showGameHub()">返回游戏中心</button></div>`;
  renderAll();
}

function startSpeed(){
  stopGame();

  G={run:true,id:"speed",score:0,combo:0,maxc:0,end:Date.now()+60000,fb:""};
  speedNext();
  G.timer=setInterval(speedTick,200);
}
function speedNext(){
  const ops=singleOps();
  const v=pick(VERBS),op=pick(ops);
  const f=OPS[op].fn(base(v));
  const seen=new Set([f.k]),wr=[];
  shuffle(ALL1.filter(o=>o!==op)).forEach(o=>{
    if(wr.length>=3) return;
    const x=OPS[o].fn(base(v));
    if(!seen.has(x.k)){seen.add(x.k);wr.push(x);}
  });
  G.q={v,op,f,opts:shuffle([f,...wr])};
  renderSpeed();
}
function renderSpeed(){
  const left=Math.max(0,G.end-Date.now());
  const q=G.q;
  $("q").innerHTML=`<div class="qhead">⏱ 60秒挑战</div>
    <div class="tbar"><div id="sbar" style="width:${left/600}%"></div></div>
    <div class="gstat"><span>答对 ${G.score} 题</span><span>${G.combo>=2?"🔥 "+G.combo+" Combo":""}</span><span id="stime">${Math.ceil(left/1000)} 秒</span></div>
    <div class="box" style="text-align:center"><div class="big2">${q.v.k}（${q.v.zh}）→ ${OPS[q.op].label}</div></div>
    ${q.opts.map((o,i)=>`<button class="gbtn" onclick="speedPick(${i})">${esc(o.k)}</button>`).join("")}
    <div class="gfb">${G.fb}</div>`;
}
function speedPick(i){
  if(!G.run||G.id!=="speed") return;
  const q=G.q,o=q.opts[i];
  if(!o) return;
  if(o.k===q.f.k){G.score++;G.combo++;G.maxc=Math.max(G.maxc,G.combo);G.fb="✓ 正确！";}

  else{G.combo=0;G.fb=`✗ ${q.v.k}的${OPS[q.op].label}是「${q.f.k}」`;}
  speedNext();
}
function speedTick(){
  if(!G.run||G.id!=="speed") return;
  const left=G.end-Date.now();
  if(left<=0){
    const g=games(),old=g.best60||0;
    g.best60=Math.max(old,G.score);
    const ot=otherGames().best60||0,on=esc(nameOf(otherId()));
    gameEnd("⏱ 时间到！",[
      `<span class="big2">答对 ${G.score} 题</span>　最高连击 ${G.maxc}`,
      G.score>old?"🎉 刷新了自己的最高纪录！":`自己的最高纪录：${old} 题`,
      ot?(G.score>ot?`比 ${on} 的纪录（${ot} 题）还多！`:`${on} 的纪录是 ${ot} 题，再加油！`):""
    ],"startSpeed()");
    return;
  }
  const b=$("sbar"),t=$("stime");
  if(b) b.style.width=(left/600)+"%";
  if(t) t.textContent=Math.ceil(left/1000)+" 秒";
}

function startFall(){
  stopGame();
  G={run:true,id:"fall",score:0,lives:3,speed:40,y:0,last:performance.now(),fb:"",v:null};
  $("q").innerHTML=`<div class="qhead">🧱 掉落分类</div>
    <div class="gstat"><span id="fscore">得分 0</span><span id="flives">❤️❤️❤️</span></div>
    <div class="fallbox" id="fallbox"><div class="fblock" id="fblock"></div></div>
    <div class="bins">
      <button onclick="fallPick('g')">一类（五段）</button>
      <button onclick="fallPick('i')">二类（一段）</button>
      <button onclick="fallPick('s')">三类</button>

    </div>
    <div class="gfb" id="ffb">电脑上也可以按键盘 1／2／3</div>`;
  renderAll();
  fallNew();
  G.raf=requestAnimationFrame(fallLoop);
}
function fallNew(){
  G.v=Math.random()<0.4?pick(TRAPS):pick(VERBS);
  G.y=0;
  const b=$("fblock");
  if(!b) return;
  b.innerHTML=`${G.v.k}<small>${G.v.r}</small>`;
  b.style.left=(8+Math.random()*50)+"%";
  b.style.top="0px";
}
function fallLoop(t){
  if(!G.run||G.id!=="fall") return;
  const box=$("fallbox"),b=$("fblock");
  if(!box||!b){stopGame();return;}
  const dt=Math.min(0.1,(t-G.last)/1000);
  G.last=t;
  G.y+=G.speed*dt;
  const H=box.clientHeight-b.offsetHeight;
  if(G.y>=H){fallMiss(`没接住！「${G.v.k}」是${CLS[G.v.t]}`);}
  else b.style.top=G.y+"px";
  if(G.run) G.raf=requestAnimationFrame(fallLoop);
}
function fallPick(t){
  if(!G.run||G.id!=="fall"||!G.v) return;
  const vt=G.v.t==="k"?"s":G.v.t;
  if(t===vt){
    G.score++;

    G.speed*=1.07;
    $("fscore").textContent="得分 "+G.score;
    $("ffb").textContent=`✓「${G.v.k}」是${CLS[G.v.t]}`;
    fallNew();
  } else fallMiss(`✗「${G.v.k}」是${CLS[G.v.t]}`);
}
function fallMiss(msg){
  G.lives--;
  $("flives").textContent="❤️".repeat(Math.max(0,G.lives))+"🤍".repeat(3-Math.max(0,G.lives));
  $("ffb").textContent=msg;
  if(G.lives<=0){
    const g=games(),old=g.bestFall||0;
    g.bestFall=Math.max(old,G.score);
    const ot=otherGames().bestFall||0,on=esc(nameOf(otherId()));
    gameEnd("🧱 游戏结束",[
      `<span class="big2">得分 ${G.score}</span>`,
      `最后一题：${msg}`,
      G.score>old?"🎉 刷新了自己的最高纪录！":`自己的最高纪录：${old} 分`,
      ot?(G.score>ot?`超过了 ${on} 的纪录（${ot} 分）！`:`${on} 的纪录是 ${ot} 分`):""
    ],"startFall()");
    return;
  }
  fallNew();
}

function startMatch(){
  stopGame();
  const ops=singleOps(),pairs=[],seenK=new Set(),seenZ=new Set();
  for(const v of shuffle(VERBS)){
    if(pairs.length>=8) break;
    const f=OPS[pick(ops)].fn(base(v));
    const z=zh({...f,fl:{},voice:null},v.zh);

    const s=run(v,[f.op||""]);
    pairs.push(null);
    pairs.pop();
    if(seenK.has(f.k)) continue;
    const st=run(v,[pickOpFor(v,f,ops)]);
    if(!st) continue;
    const ff=st[0],zz=zh(ff,v.zh);
    if(seenK.has(ff.k)||seenZ.has(zz)) continue;
    seenK.add(ff.k); seenZ.add(zz);
    pairs.push({ja:ff.k,zh:zz});
  }
  const tiles=[];
  pairs.forEach((p,i)=>{tiles.push({p:i,t:"ja",x:p.ja});tiles.push({p:i,t:"zh",x:p.zh});});
  G={run:true,id:"match",tiles:shuffle(tiles),sel:null,left:pairs.length,start:Date.now(),pen:0,bad:[]};
  renderMatchG();
  G.timer=setInterval(()=>{const e=$("mtime");if(e&&G.run&&G.id==="match") e.textContent=matchTime()+" 秒";},250);
}
function pickOpFor(v,f,ops){
  const c=ops.filter(o=>OPS[o].fn(base(v)).k===f.k);
  return c.length?c[0]:ops[0];
}
const matchTime=()=>Math.round((Date.now()-G.start)/1000+G.pen);
function renderMatchG(){
  $("q").innerHTML=`<div class="qhead">✨ 变形消消乐</div>
    <div class="gstat"><span>还剩 ${G.left} 对</span><span id="mtime">${matchTime()} 秒</span></div>
    <div class="muted">点一张日语变形，再点它对应的中文意思。配错罚时3秒。</div>
    <div class="tiles">${G.tiles.map((t,i)=>`<button class="tile ${t.t==="ja"?"ja":""} ${t.gone?"gone":""} ${G.sel===i?"sel":""} ${G.bad.includes(i)?"bad":""}" onclick="mTap(${i})">${esc(t.x)}</button>`).join("")}</div>`;
  renderAll();
}
function mTap(i){
  if(!G.run||G.id!=="match") return;
  const t=G.tiles[i];

  if(t.gone) return;
  if(G.sel===null){G.sel=i;G.bad=[];renderMatchG();return;}
  if(G.sel===i){G.sel=null;renderMatchG();return;}
  const a=G.tiles[G.sel];
  if(a.p===t.p&&a.t!==t.t){
    a.gone=t.gone=true;
    G.left--;
    G.sel=null;
    if(G.left<=0){
      const sec=matchTime(),g=games(),old=g.bestMatch;
      if(!old||sec<old) g.bestMatch=sec;
      const ot=otherGames().bestMatch,on=esc(nameOf(otherId()));
      gameEnd("✨ 全部消除！",[
        `<span class="big2">用时 ${sec} 秒</span>（含罚时 ${G.pen} 秒）`,
        !old||sec<old?"🎉 刷新了自己的最快纪录！":`自己的最快纪录：${old} 秒`,
        ot?(sec<ot?`比 ${on} 的纪录（${ot} 秒）还快！`:`${on} 的纪录是 ${ot} 秒`):""
      ],"startMatch()");
      return;
    }
  } else {
    G.pen+=3;
    G.bad=[G.sel,i];
    G.sel=null;
  }
  renderMatchG();
}

function startPuz(){
  stopGame();
  G={run:true,id:"puz",ids:shuffle(PUZZLES.map((x,i)=>i)).slice(0,5),k:0,ok:0,done:false};
  puzRound();
}

function puzRound(){
  const p=PUZZLES[G.ids[G.k]];
  let chips=shuffle(p.p.map((t,i)=>({t,i})));
  if(chips.every((c,i)=>c.i===i)&&chips.length>1) chips.push(chips.shift());
  G.pool=chips; G.built=[]; G.done=false;
  renderPuz();
}
function renderPuz(msg){
  const p=PUZZLES[G.ids[G.k]];
  $("q").innerHTML=`<div class="qhead">🧩 句子拼图（第 ${G.k+1}/5 句）</div>
    <div class="gstat"><span>已拼对 ${G.ok} 句</span></div>
    <div class="box"><div class="big">${esc(p.zh)}</div></div>
    <div class="muted">按顺序点下面的词块拼成句子，点上面已放好的词块可以拿回来。</div>
    <div class="chips built">${G.built.map((c,i)=>`<button class="chip2" onclick="puzBack(${i})">${esc(c.t)}</button>`).join("")}</div>
    <div class="chips">${G.pool.map((c,i)=>`<button class="chip2" onclick="puzAdd(${i})">${esc(c.t)}</button>`).join("")}</div>
    <div class="gfb">${msg||""}</div>
    <div class="btns">${G.done?`<button class="btn main" onclick="puzNext()">${G.k<4?"下一句":"看结果"}</button>`:`<button class="btn main" ${G.pool.length?"disabled":""} onclick="puzCheck()">检查</button>`}</div>`;
  renderAll();
}
function puzAdd(i){if(G.done)return;G.built.push(G.pool.splice(i,1)[0]);renderPuz();}
function puzBack(i){if(G.done)return;G.pool.push(G.built.splice(i,1)[0]);renderPuz();}
function puzCheck(){
  const p=PUZZLES[G.ids[G.k]];
  const ok=G.built.map(c=>c.t).join("")===p.p.join("");
  if(ok) G.ok++;
  G.done=true;
  SPK=p.p.join("");
  renderPuz(`${ok?"✓ 正确！":"✗ 正确顺序："}${ok?"":esc(p.p.join(" ／ "))}　<button class="mini" onclick="speak(SPK)">朗读</button>`);
}
function puzNext(){
  G.k++;
  if(G.k<5){puzRound();return;}

  const g=games(),old=g.bestPuz||0;
  g.bestPuz=Math.max(old,G.ok);
  gameEnd("🧩 拼图完成",[
    `<span class="big2">拼对 ${G.ok}/5 句</span>`,
    G.ok===5?"🎉 全部正确！":`自己的最好成绩：${Math.max(old,G.ok)}/5`
  ],"startPuz()");
}

document.addEventListener("keydown",e=>{
  if(!G.run) return;
  if(G.id==="fall"&&["1","2","3"].includes(e.key)) fallPick(["g","i","s"][+e.key-1]);
  if(G.id==="speed"&&["1","2","3","4"].includes(e.key)) speedPick(+e.key-1);
});

const _recBeforeGame=window.record;
window.record=function(ok,cats){
  initBadges();
  const ch=_recBeforeGame(ok,cats);
  checkBadges().forEach(b=>ch.push(`🏅 获得新徽章：${b.i} ${b.n}（${b.d}）`));
  return ch;
};
const _nqBeforeGame=window.newQuestion;
window.newQuestion=function(){
  stopGame();
  if(mode==="game"){$("res").classList.add("hidden");phase="none";cur={type:"none"};return showGameHub();}
  return _nqBeforeGame();
};
const _tabsBeforeGame=window.renderTabs;
window.renderTabs=function(){
  _tabsBeforeGame();
  const t=$("tabs");
  const b=document.createElement("button");

  b.className="tab"+(mode==="game"?" on":"");
  b.textContent="🎮 游戏";
  b.onclick=()=>setMode("game");
  t.insertBefore(b,t.querySelector("select"));
};
