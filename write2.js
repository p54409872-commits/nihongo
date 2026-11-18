const WRITE_WHY=[
  "“可以确认”是“能做到”，用可能形「確認できる」（する→できる）。「今日中に」是“今天之内”。",
  "“已经…了”用「もう＋ました」。资料是话题，用「は」。",
  "请对方做事最礼貌的说法是「〜ていただけますか」（能请您…吗），比「〜てください」更客气，适合对上司、客户。",
  "“还没…”要用「まだ〜ていません」，表示到现在为止还没做、之后会做。不要用「〜ませんでした」。",
  "“…之后（就）…”用「〜たら」。对客户说“我联系您”用谦让的「ご連絡します」。",
  "“必须”用「〜なければなりません」；“…之前”的期限用「までに」，不是「まで」。",
  "“去不了”是“不能去”，要用可能形的否定「行けません」。「行きません」是“不去”，听起来像是自己不想去。「明日は」用「は」带出对比的语气。",
  "“被…”用被动形「ほめられる」，做动作的人（部长）用「に」。",
  "“被逼着做”用使役被动「習わされる（習わせられる）」，逼你的人用「に」。",
  "“如果…的话”用「〜たら」：降ったら。“就不去了”是说自己的决定，用「行きません」。",
  "“打算…”用「意向形＋と思っています」：行こうと思っています。比「行きます」更能表达这是自己的计划。",
  "门自己处于开着的状态，用自动词「開く」＋ている：開いています，主语用「が」。",
  "别人给我东西用「くれる」，不是「あげる」。",
  "请对方等一下，礼貌的说法是「〜ていただけますか」；对客人还可以说「少々お待ちいただけますか」。",
  "“正在做”用「〜ています」：探しています。",
  "“变得能…了”用「可能形＋ようになりました」：説明できるようになりました。",
  "“能用吗”用可能形「使える」。会议室是话题，用「は」。",
  "“请让我…”用「使役形＋てください」：考えさせてください。职场里委婉地说“让我考虑一下”很常用。",
  "“不用…、不必…”用「〜なくてもいいです」。",
  "“还没决定”用「まだ〜ていません」，表示到现在还没做。"
];
const WRITE_R=[
  "きょうじゅうにかくにんできます","しりょうはもうおくりました","このしりょうをかくにんしていただけますか",
  "このにゅうきんはまだかくにんしていません","かくにんできたらごれんらくします",
  "あしたまでにほうこくしょをていしゅつしなければなりません","すみませんあしたはかいしゃにいけません",
  "ぶちょうにほめられました","こどものころははにピアノをならわされました","あめがふったらいきません",
  "らいげつおおさかにいこうとおもっています","ドアがあいています","ともだちがほんをくれました",
  "すこしまっていただけますか","かぎをさがしています","にほんごでせつめいできるようになりました",
  "このかいぎしつはごごつかえますか","すこしかんがえさせてください","しんぱいしなくてもいいです","まだきめていません"
];
const WRITE_ALT=[
  ["今日中には確認できます","今日中に確認することができます","今日中に確認できる"],
  ["もう資料を送りました","資料をもう送りました","もう資料は送りました","資料はもう送信しました"],
  ["この資料は確認していただけますか","この資料を確認してもらえますか","この資料を確認していただけませんか","この資料をご確認いただけますか","この資料をご確認いただけませんか"],
  ["この入金をまだ確認していません","まだこの入金を確認していません","この入金はまだ確認できていません"],
  ["確認できたら連絡します","確認したらご連絡します","確認できましたらご連絡します","確認しましたらご連絡いたします","確認できたらご連絡いたします"],
  ["報告書を明日までに提出しなければなりません","明日までに報告書を出さなければなりません","明日までに報告書を提出しなければならない","明日までに報告書を提出しないといけません","明日までに報告書を提出しなくてはいけません"],
  ["すみません明日会社に行けません","すみません明日は会社へ行けません","申し訳ありません明日は会社に行けません","すみません明日は出社できません","すみません明日は会社に行くことができません"],
  ["部長にほめられた"],
  ["子どものとき母にピアノを習わされました","子どものころ母にピアノを習わせられました","子どものころピアノを母に習わされました"],
  ["雨が降ったら行かないです","雨だったら行きません","雨が降ったら行きません"],
  ["来月大阪へ行こうと思っています","来月大阪に行くつもりです","来月大阪に行こうと思います"],
  ["ドアは開いています","ドアが開いている"],
  ["友だちは本をくれました","友だちが私に本をくれました","友だちに本をもらいました","友だちから本をもらいました"],
  ["少々待っていただけますか","ちょっと待っていただけますか","少しお待ちいただけますか","少々お待ちいただけませんか","少し待っていただけませんか","少し待ってもらえますか"],
  ["鍵を探している"],
  ["日本語で説明することができるようになりました"],
  ["この会議室は午後使用できますか","この会議室は午後に使えますか","午後この会議室は使えますか","この会議室午後使えますか","この会議室は午後使うことができますか"],
  ["ちょっと考えさせてください","少し考えさせていただけますか","少し考えさせていただけませんか"],
  ["心配しなくていいです","心配しなくても大丈夫です","心配しないでください"],
  ["まだ決まっていません","まだ決めてない"]
];
const ORTHO=[["子供","子ども"],["友達","友だち"],["褒め","ほめ"],["下さい","ください"],["出来","でき"],["頃","ころ"],["かぎ","鍵"],["扉","ドア"],["時","とき"]];
const PNOTE={
  "は→を":"「を」表示动作的对象；「は」会把它变成话题，带“…的话”的对比语气。",
  "を→は":"这里用「は」把它当作话题来说更自然。",
  "が→を":"「を」表示动作的对象；「が」表示主语，或用在可能形、自动词前面。",
  "を→が":"可能形和自动词前面通常用「が」。",
  "に→で":"「で」表示动作发生的地点或方式；「に」表示到达点、对象或时间。",
  "で→に":"「に」表示到达的地点、对象或时间；「で」表示动作发生的地点。",
  "→は":"这里加「は」表示话题或对比。",
  "は→":"这里不需要「は」。",
  "→を":"动作的对象要用「を」标出来。",
  "→に":"这里需要「に」表示对象、时间或到达点。"
};

document.head.insertAdjacentHTML("beforeend",`<style>
.dr{color:var(--ng);background:var(--ng-bg);text-decoration:line-through;border-radius:3px}
.da{color:var(--accent);background:var(--accent-bg);font-weight:bold;border-radius:3px}
</style>`);

const withTimeout=(p,ms)=>Promise.race([p,new Promise(r=>setTimeout(()=>r(null),ms))]);
function wnorm(s){
  let t=String(s).replace(/[\s　、。，,．.！!？?・「」『』（）()]/g,"");
  ORTHO.forEach(([a,b])=>{t=t.split(a).join(b);});
  return t;
}
function lcsOps(a,b){
  const n=a.length,m=b.length;
  const dp=Array.from({length:n+1},()=>new Array(m+1).fill(0));
  for(let i=n-1;i>=0;i--) for(let j=m-1;j>=0;j--)
    dp[i][j]=a[i]===b[j]?dp[i+1][j+1]+1:Math.max(dp[i+1][j],dp[i][j+1]);
  const ops=[];
  let i=0,j=0;
  while(i<n&&j<m){
    if(a[i]===b[j]){ops.push(["=",a[i]]);i++;j++;}
    else if(dp[i+1][j]>=dp[i][j+1]){ops.push(["-",a[i]]);i++;}
    else{ops.push(["+",b[j]]);j++;}
  }
  while(i<n) ops.push(["-",a[i++]]);
  while(j<m) ops.push(["+",b[j++]]);
  return {ops,score:dp[0][0]};
}
function diffView(user,ref){
  const {ops}=lcsOps(user,ref);
  let u="",r="";
  const hunks=[];
  let cur=null;
  ops.forEach(([t,c])=>{
    if(t==="="){u+=esc(c);r+=esc(c);if(cur){hunks.push(cur);cur=null;}return;}
    if(!cur) cur=["",""];
    if(t==="-"){u+=`<span class="dr">${esc(c)}</span>`;cur[0]+=c;}
    else{r+=`<span class="da">${esc(c)}</span>`;cur[1]+=c;}
  });
  if(cur) hunks.push(cur);
  return {u,r,hunks};
}

const _showWriteBeforeW3=window.showWrite;
window.showWrite=function(id,o){
  _showWriteBeforeW3(id,o);
  document.querySelectorAll("#q .row").forEach(el=>{
    if(el.textContent.includes("用日语写出整句"))
      el.innerHTML=`<span class="lbl">要求</span>用日语写出整句，汉字或假名都可以。提交后自动判断对错。`;
  });
};

window.submitWrite=function(){
  if(phase!=="ask") return;
  const raw=$("ans").value.trim();
  if(!raw){$("err").textContent="请先写句子";return;}
  const id=cur.id,w=WRITEQ[id];
  cur.raw=raw;
  $("ans").disabled=true;
  const u=wnorm(raw);
  const primary=w.a.map(wnorm);
  const accepted=[...primary,...(WRITE_ALT[id]||[]).map(wnorm),wnorm(WRITE_R[id]||"")].filter(Boolean);
  const ok=accepted.includes(u);
  const cheers=record(ok,"write");
  srsAfter({kind:"write",id,cat:"write"},ok,cheers);
  save();
  SPK=w.a[0];
  const why=WRITE_WHY[id]||"";
  let body;
  if(ok){
    const isPrimary=primary.includes(u);
    body=`<div class="simple">
      <div>✅ 你的句子：「${esc(raw)}」${isPrimary?"":"（这个说法也可以）"}</div>
      ${isPrimary?"":`<div>参考答案：「${esc(w.a[0])}」</div>`}
      <div>💡 为什么：${esc(why)}<button class="mini" onclick="speak(SPK)">朗读</button></div></div>`;
  } else {
    let best=primary[0],bs=-1;
    [...primary,...(WRITE_ALT[id]||[]).map(wnorm)].forEach(c=>{
      const s=lcsOps(u,c).score/Math.max(u.length,c.length);
      if(s>bs){bs=s;best=c;}
    });
    const d=diffView(u,best);
    const lines=d.hunks.slice(0,4).map(([a,b])=>{
      const note=PNOTE[`${a}→${b}`];
      return `「${esc(a)||"（没有）"}」→「${esc(b)||"（不要）"}」${note?"："+note:""}`;
    });
    body=`<div class="simple">
      <div>❌ 你的句子：${d.u}</div>
      <div>✅ 正确答案：${d.r}<button class="mini" onclick="speak(SPK)">朗读</button></div>
      ${lines.length?`<div><b>差别：</b><br>${lines.join("<br>")}</div>`:""}
      <div>💡 为什么：${esc(why)}</div>
      <div class="muted">红色是你多写或写错的，绿色是正确答案里应该有的。</div></div>
      <div class="btns"><button class="btn" id="appeal" onclick="appealWrite(${id})">🤖 我觉得我的也对，请さくら先生确认</button></div>
      <div id="appealbox"></div>`;
  }
  finish(ok,body,cheers);
};

async function appealWrite(id){
  const btn=$("appeal"),box=$("appealbox");
  if(!btn||!box) return;
  btn.disabled=true;
  box.innerHTML=`<div class="muted">さくら先生确认中…（需要网络，一般几秒钟）</div>`;
  if(typeof ensureKey==="function") await ensureKey();
  if(typeof AIKEY==="undefined"||!AIKEY||typeof geminiJSON!=="function"){
    box.innerHTML=`<div class="note">AI 暂时用不了（还没设置密钥）。</div>`;
    return;
  }
  const w=WRITEQ[id];
  const prompt=`你是严格的日语老师。学习者要把中文翻译成日语。
中文：${w.zh}
参考答案：${w.a.join(" ／ ")}
学习者的回答：${cur.raw}
请判断学习者的回答在意思和语法上是否都正确、自然。参考答案只是参考，其他正确自然的说法也算对。
只用JSON回答：{"ok":意思正确且没有语法错误时为true,"comment":"用中文简短说明，50字以内"}`;
  const j=await withTimeout(geminiJSON(prompt),15000);
  if(!j||typeof j.ok!=="boolean"){
    box.innerHTML=`<div class="note">网络有点慢或者 AI 暂时忙不过来，稍后可以再试一次。</div>`;
    btn.disabled=false;
    return;
  }
  if(j.ok){
    S.correct++;
    const d=today();
    S.daysOk[d]=(S.daysOk[d]||0)+1;
    const e=S.cat&&S.cat.write;
    if(e){e.ok++;if(e.r.length) e.r[e.r.length-1]=1;}
    if(!cur.review) S.srs=S.srs.filter(x=>x.key!=="write|"+id);
    save();
    box.innerHTML=`<div class="simple"><div>✅ さくら先生：你的句子也是对的，已经改为正确！</div>${j.comment?`<div>${esc(j.comment)}</div>`:""}</div>`;
    renderAll();
  } else {
    box.innerHTML=`<div class="simple"><div>❌ さくら先生：你的句子确实有问题。</div>${j.comment?`<div>${esc(j.comment)}</div>`:""}</div>`;
  }
}
