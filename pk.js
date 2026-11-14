const MIN=50;
document.head.insertAdjacentHTML("beforeend",`<style>
.yest{background:var(--blue-bg);color:var(--blue);border-radius:8px;padding:10px 12px;margin-top:10px;font-size:14px;line-height:1.8}
td.lazy{color:var(--ng);font-size:13px}
td.miss{color:var(--warn);font-size:13px}
td.okd{font-size:14px}
</style>`);

function ensureGoal(){ if(!S.goal||S.goal<MIN) S.goal=MIN; }
function dayStat(d,k){ const c=d.days[k]||0, ok=(d.daysOk||{})[k]||0; return {c,ok,p:c?ok/c:0}; }
const pct=x=>Math.round(x.p*100);
function judge(a,b){
  const qa=a.c>=MIN, qb=b.c>=MIN;
  if(qa&&qb){
    if(a.p!==b.p) return {w:a.p>b.p?0:1};
    if(a.c!==b.c) return {w:a.c>b.c?0:1};
    return {w:-1};
  }
  if(qa) return {w:0};
  if(qb) return {w:1};
  return {w:-1,none:true};
}
function lazyDays(d,k){
  let n=0,t=k;
  while(t>=d.start&&!(d.days[t]>0)&&n<400){n++;t=addDays(t,-1);}
  return n;
}
function lazyMsg(n){
  if(n<=1) return "今天偷懒了一天，明天补回来哦～";
  if(n===2) return "连续偷懒2天了！单词都快不认识你了。";
  if(n===3) return "偷懒第3天⚠ 动词变形开始生锈了……";
  if(n<=6) return `已经偷懒${n}天了！对手正在悄悄拉开差距！`;

  if(n<=13) return `偷懒${n}天🔥 一周多没练了，再不回来就要从头开始了！`;
  return `偷懒${n}天……练习册在角落里哭泣，快回来吧😭`;
}
function statusText(d,k){
  if(k<d.start) return {txt:"—",cls:""};
  const x=dayStat(d,k);
  if(x.c===0) return {txt:"😴 "+lazyMsg(lazyDays(d,k)),cls:"lazy"};
  if(x.c<MIN) return {txt:`${pct(x)}%（${x.c}题）· 未达标`,cls:"miss"};
  return {txt:`${pct(x)}%（${x.c}题）`,cls:"okd"};
}

function record(ok,cats){
  ensureGoal();
  const cheers=[];
  S.total++;
  if(ok){S.correct++;S.streak++;S.best=Math.max(S.best,S.streak);}
  else S.streak=0;
  if(ok&&[5,10,20,30,50,100].includes(S.streak)) cheers.push(`连续答对 ${S.streak} 题！状态非常好！`);
  const d=today(),before=S.days[d]||0;
  S.days[d]=before+1;
  S.daysOk[d]=(S.daysOk[d]||0)+(ok?1:0);
  if(before+1===S.goal){S.checkins[d]=true;cheers.push(`打卡成功！今天的 ${S.goal} 题完成了，${esc(pname())}是最棒的！继续做就是超前进度。`);}
  else if(before+1>S.goal&&(before+1-S.goal)%10===0) cheers.push(`今天已经超前做了 ${before+1-S.goal} 题，太拼了！`);
  const oid=otherId(),on=esc(nameOf(oid)),o=dayStat(getData(oid),d),me=dayStat(S,d);
  if(me.c===MIN){
    cheers.push(o.c>=MIN
      ?`你也达标了！现在比正确率：你 ${pct(me)}% vs ${on} ${pct(o)}%`
      :`你先达到 ${MIN} 题了！现在正确率 ${pct(me)}%，${on}还差 ${MIN-o.c} 题。`);
  } else if(me.c>MIN&&me.c%10===0&&o.c>=MIN){
    cheers.push(`正确率对比：你 ${pct(me)}% vs ${on} ${pct(o)}%，${me.p>=o.p?"保持住！":"加油追上去！"}`);
  }
  if(mode==="smart"||mode==="course") S.course++;

  [].concat(cats).forEach(c=>catHit(c,ok));
  return cheers;
}

function renderPK(){
  const t=today(),y=addDays(t,-1);
  const D=PROFILES.map(p=>getData(p.id));
  const first=D.map(d=>d.start).sort()[0];
  const now=D.map(d=>dayStat(d,t));
  const jn=judge(now[0],now[1]);
  let h=`<h3 style="margin-top:0">今日PK（${md(t)}）· 比正确率</h3>
    <div class="muted">每人每天至少 ${MIN} 题才算达标，达标的人比正确率。每天晚上12点（0点）出结果。</div>`;
  now.forEach((x,i)=>{
    const d=D[i],lz=y>=d.start?lazyDays(d,y):0;
    let st;
    if(x.c===0) st=lz>0?`今天还没开始 · 已经连续偷懒 ${lz} 天了，快回来！`:"今天还没开始";
    else if(x.c<MIN) st=`还差 ${MIN-x.c} 题达标`;
    else st="已达标 ✓";
    h+=`<div class="pkrow">
      <div class="pkname"><span>${jn.w===i?'<span class="crown">♛ </span>':""}${esc(PROFILES[i].name)}</span><span>${x.c} 题 · 正确率 ${x.c?pct(x)+"%":"—"}</span></div>
      <div class="pkbar"><div class="p${i}" style="width:${Math.min(100,x.c/MIN*100)}%"></div></div>
      <div class="muted">${st}</div></div>`;
  });
  let msg;
  if(now[0].c===0&&now[1].c===0) msg="今天的PK还没开始，谁先来？";
  else if(jn.none) msg=`还没有人达标，先完成 ${MIN} 题才有资格比正确率！`;
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
}

function renderDash(){
  ensureGoal();
  const P=plan(),t=today(),tc=S.days[t]||0,g=S.goal;
  const cal=Math.min(P.length,dayDiff(S.start,t)+1);
  const prog=Math.floor(S.course/g)+1;
  const dayNow=Math.min(prog,P.length);
  const ahead=dayNow-cal;
  const allPct=S.total?Math.round(S.correct/S.total*100):0;

  const td=dayStat(S,t);
  let msg;
  if(prog>P.length) msg=`${P.length}天计划全部完成！接下来用复习和自由练习保持手感。`;
  else if(tc===0) msg=`今天还没开始。${g}题大约${Math.round(g*0.6)}分钟，先做10题热热身也很好。`;
  else if(tc<g) msg=`还差 ${g-tc} 题就能打卡了，加油！`;
  else msg="今天已打卡 ✓ 想多做就继续，超前的题都会算进计划进度。";
  if(prog<=P.length){
    if(ahead>0) msg+=` 你目前超前计划 ${ahead} 天。`;
    else if(ahead<0) msg+=` 比日历计划慢 ${-ahead} 天，没关系，按自己的节奏来，每做一题都算数。`;
  }
  const pu=P[dayNow-1];
  const planTxt=pu==="R"?"总复习":`单元${pu}「${UNITS[pu-1].name}」`;
  const due=dueList().length;
  const weak=weakCats().slice(0,3).map(c=>CATN[c]||c);
  $("dash").innerHTML=`
    <div class="dash-top">
      <div><span class="muted">${esc(pname())} 的今日目标</span>
        <div class="dash-big">${Math.min(tc,g)} / ${g} 题${tc>g?`<span class="muted">　＋超前 ${tc-g} 题</span>`:""}</div>
        <div class="muted">今日正确率 ${tc?pct(td)+"%":"—"}</div></div>
      <div class="muted" style="text-align:right">每日目标
        <select onchange="setGoal(this.value)">${[50,80,100].map(x=>`<option value="${x}" ${x===g?"selected":""}>${x}题</option>`).join("")}</select>
        <br>总正确率 ${allPct}% ｜ 最佳连对 ${S.best}</div>
    </div>
    <div class="barw"><div style="width:${Math.min(100,tc/g*100)}%"></div></div>
    <div class="muted">按日历：计划第 ${cal} 天　｜　按完成量：第 ${dayNow} 天（${planTxt}）</div>
    <div class="task">📋 今日任务：到期复习 <b>${due}</b> 题（智能练习会先出）${weak.length?`　｜　薄弱点：<b>${weak.join("、")}</b>（会优先特训）`:""}</div>
    <div class="cheer">${msg}</div>`;
}
