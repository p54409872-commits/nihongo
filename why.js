const FIX_SIMPLE=[
  {w:"「来れます」是口语里把「ら」省掉的说法，意思也是“能来”，日常会听到，但不是标准日语，考试和正式场合算错。",r:"「来られます」是「来る」标准的可能形，意思是“能来”。用在：问别人能不能来，尤其在公司、对客人、写邮件等正式场合。"},
  {w:"「見れます」是省掉「ら」的口语说法，意思也是“能看”，但不是标准形式。",r:"「見られます」是标准的“能看”。用在：介绍在哪里能看到，比如“这部电影在网上能看”，正式场合都用这个。"},
  {w:"「書かれました」意思是“被（人）写了”，只是普通的被动，没有“被逼着写”的意思。",r:"「書かされました」意思是“被逼着写了”。用在：说被别人要求做不想做的事，比如“被老师罚写作文”“被上司逼着写报告”。"},
  {w:"「開けています」意思是“（某人）正在打开”，是人的动作，不能用来说窗户自己的状态。",r:"「開いています」意思是“（窗户）开着”。用在：说东西现在的状态，比如“门开着”“店开着（营业中）”。"},
  {w:"「始まりましょう」不是正确的日语。「始まる」是“（事情）自己开始”，不能用来邀请别人一起做。",r:"「始めましょう」意思是“（我们）开始吧”。用在：主持会议、上课时说“那我们开始吧”。"},
  {w:"「あげました」意思是“（我）给了别人”，方向反了，句子说的是朋友给我。",r:"「くれました」意思是“（别人）给了我”。用在：说别人送你东西、帮你做事，比如“朋友送了我礼物”。"},
  {w:"「会いて」不是正确的日语，て形变错了。",r:"「会って」是「会う」的て形，用来接下一个动作：“见了面，然后聊了天”。用在：按顺序讲做过的几件事。"},
  {w:"「急ぎて」不是正确的日语，て形变错了。",r:"「急いで」意思是“急忙地、赶快”。用在：“急急忙忙去了车站”“请快一点（急いでください）”。"},
  {w:"「起きなかったらなりません」不是日语的说法。「なかったら」是“如果没起来的话”，和「なりません」接不上。",r:"「起きなければなりません」意思是“必须起床”。用在：说必须做的事，比如“明天必须早起”“必须交报告”。"},
  {w:"「しませんでした」意思是“（那时）没做”，是过去已经结束的事，和「まだ」（还）放在一起不自然。",r:"「していません」意思是“（到现在）还没做”。用在：“作业还没做”“邮件还没回”这种之后还会做的事。"},
  {w:"「行けます」意思是“部长能去”，只是在说能力，对上级没有表示尊敬。",r:"「行かれます」是对上级的尊敬说法，意思是“部长要去”。用在：在公司说上司、客户的行动。更礼貌可以说「いらっしゃいます」。"},
  {w:"「食べさせられました」意思是“我被逼着吃了”，变成自己被迫吃，和句子意思相反。",r:"「食べさせました」意思是“（我）让孩子吃了”。用在：父母让孩子做事、上司让下属做事。"},
  {w:"「足りるない」不是正确的日语，否定形变错了。",r:"「足りない」意思是“不够”。用在：“钱不够”“时间不够”“人手不够”。"},
  {w:"「帰るの時」不是正确的日语，动词后面不用加「の」再接「時」。",r:"「帰る時」意思是“回去的时候”。用在：“回家的时候请打电话”“下班的时候”。"},
  {w:"「話せるようにしました」意思是“我努力让自己能说”，重点在自己的努力，和“自然变得能说”不一样。",r:"「話せるようになりました」意思是“（慢慢地）变得能说了”。用在：说自己的进步，比如“日语变得能说一点了”“会游泳了”。"},
  {w:"「着くと」意思是“一到就（自然会）…”，后面不能接“请…”这种请求。",r:"「着いたら」意思是“到了之后”。用在：“到了请联系我”“做完了请告诉我”这种请求。"},
  {w:"「走るます」不是正确的日语，「走る」是一类动词，不能直接加ます。",r:"「走ります」是“跑步”的礼貌说法。用在：“他每天跑步”这种日常习惯。"},
  {w:"「返さなくてもいいです」意思是“不还也可以”，和句子要说的“必须还”正好相反。",r:"「返さなければなりません」意思是“必须还”。用在：说规定和截止日期，比如“下周之前必须还书”。"}
];

const SCENE={
  masu:"对长辈、同事、陌生人说话这种礼貌场合",
  masen:"礼貌地说“不做”，比如“我不喝酒”",
  mashita:"礼貌地说“做了”，比如汇报“资料已经发了”",
  mashou:"礼貌地邀请别人“一起…吧”",
  msd:"礼貌地说“那时没做”",
  te:"连接下一个动作，或者「〜てください」请别人做事",
  ta:"和朋友、家人说“做了”，或「〜たことがある」说经历",
  nai:"和朋友、家人说“不做”，或「〜ないでください」请别人别做",
  adjPast:"和朋友、家人说“那时没做”",
  adjTe:"「〜なくてもいい」（不必）、「〜なくて」（因为没…）",

  adjBa:"「〜なければならない」说“必须…”",
  tara:"“如果…／…之后”，后面可以接请求，比如“到了请联系我”",
  ba:"“只要…就…”的条件，常用于给建议",
  pot:"说自己或别人“能不能做”",
  pas:"说“被别人…”，或者在公司对上级表示尊敬",
  cau:"“让／叫别人做”，比如上司让下属、父母让孩子",
  cp:"“被逼着做”，比如被上司叫去加班",
  vol:"和朋友说“…吧”，或「〜ようと思う」说自己的打算",
  imp:"很强的命令，一般只在比赛、紧急情况或标志上用",
  teiru:"正在做的事，或持续的状态（住在、结婚了）"
};

document.head.insertAdjacentHTML("beforeend",`<style>
.simple{background:#fff;border:2px solid var(--line);border-radius:10px;padding:12px 14px;margin:10px 0;font-size:16px;line-height:1.9}
.simple div+div{margin-top:6px}
.more{margin-top:10px}
.more summary{font-size:14px;color:var(--accent);cursor:pointer}
#whyai .msg{max-width:100%}
</style>`);

function simpleWrong(val){
  const {verb,steps}=chain,t=steps[j],pre=chain.ops.slice(0,j+1);
  if(["i","k"].includes(verb.t)&&t.voice==="pot"&&(val===t.k.replace("られ","れ")||val===t.r.replace("られ","れ")))
    return `你写的「${val}」是口语里省掉「ら」的说法，日常会听到，但不是标准日语，考试和正式场合算错。`;
  if(val===verb.k||val===verb.r) return `你写的「${val}」是原形，还没有变形。`;
  for(let i=0;i<j;i++){
    if(val===steps[i].k||val===steps[i].r)
      return `你写的「${val}」意思是“${zh(steps[i])}”，还没变到最后一步，所以不对。`;
  }
  for(const v of variants(pre)){
    const l=lastOf(v);
    if(l&&(val===l.k||val===l.r))

      return `你写的「${val}」意思是“${zh(l)}”，和题目要的意思不一样，所以不对。`;
  }
  if(typeof specDiag==="function"){
    const sp=specDiag(val,j?steps[j-1]:base(verb),t.op,verb);
    if(sp) return `你写的「${val}」不是正确的日语形式：${sp}`;
  }
  return `你写的「${val}」不是正确的日语形式。`;
}

const _chainDetailBeforeWhy=window.chainDetail;
window.chainDetail=function(val,ok){
  let full=_chainDetailBeforeWhy(val,ok);
  try{
    const t=chain.steps[j];
    full=full.replace(/^\s*<div class="row">[\s\S]*?<\/div>\s*<div class="row">[\s\S]*?<\/div>/,"");
    full=full.replace(/<div class="diag">[\s\S]*?<\/div>/,"");
    const right=`✅ 正确的「${esc(t.k)}」（${esc(t.r)}）意思是“${esc(zh(t))}”。${SCENE[t.op]?"常用在："+SCENE[t.op]+"。":""}`;
    const simple=`<div class="simple">${ok?"":`<div>❌ ${esc(simpleWrong(val))}</div>`}<div>${right}<button class="mini" onclick="speak(SPK)">朗读</button></div></div>`;
    return `<div class="row">你的答案：「${esc(val)}」</div>${simple}<details class="more"><summary>查看详细解析（变形路线、规则、自他动词、例句）</summary>${full}</details>`;
  }catch(e){
    console.error(e);
    return full;
  }
};

async function geminiText(prompt){
  if(typeof ensureKey==="function") await ensureKey();
  if(typeof AIKEY==="undefined"||!AIKEY) return null;
  const body={contents:[{role:"user",parts:[{text:prompt}]}],generationConfig:{temperature:0.3,maxOutputTokens:900}};
  for(let i=aiModelIdx;i<AI_MODELS.length;i++){
    try{
      const res=await fetch("https://generativelanguage.googleapis.com/v1beta/models/"+AI_MODELS[i]+":generateContent",{

        method:"POST",headers:{"Content-Type":"application/json","x-goog-api-key":AIKEY},body:JSON.stringify(body)});
      if(!res.ok){
        if([429,404,400].includes(res.status)||res.status>=500) continue;
        return null;
      }
      const d=await res.json();
      const c=d.candidates&&d.candidates[0];
      const t=c&&c.content&&c.content.parts?c.content.parts.map(p=>p.text||"").join(""):"";
      return t.trim()||null;
    }catch(e){return null;}
  }
  return null;
}

async function askWhy(){
  const btn=$("whybtn"),box=$("whyai");
  if(!btn||!box) return;
  btn.disabled=true;
  box.innerHTML=`<div class="muted">さくら先生正在思考…</div>`;
  const basic=(typeof isPath==="function")&&isPath();
  const qText=($("q").innerText||"").replace(/看提示.*$/s,"").slice(0,700);
  const rText=($("res").innerText||"").replace(/查看详细解析[\s\S]*$/,"").replace(/🤖 问さくら先生[\s\S]*$/,"").slice(0,700);
  const prompt=`你是日语老师さくら先生。下面是一道日语练习题和批改结果，学习者答错了。
【题目】
${qText}
【批改结果】
${rText}
请只用两行中文回答，不讲语法术语：
第一行以「❌」开头：她写的答案是什么意思，为什么在这里不对。
第二行以「✅」开头：正确答案是什么意思，为什么对，一般用在什么场合（给一个生活或工作中的具体场景）。
${basic?"学习者是刚学一个月的初学者，两行加起来不超过60字，用最简单的话。":"两行加起来不超过120字。"}
不要用标题和markdown符号。`;

  const t=await geminiText(prompt);
  if(!t){
    box.innerHTML=`<div class="note">AI 暂时用不了（可能还没设置密钥，或者免费次数用完了）。可以先看上面的说明，或者去「AI聊天」里问。</div>`;
    btn.disabled=false;
    return;
  }
  box.innerHTML=`<div class="simple">${esc(t).replace(/\n+/g,"<br>")}</div>`;
}

const _finishBeforeWhy=window.finish;
window.finish=function(ok,body,cheers){
  let b=body;
  if(cur&&cur.type==="fix"&&FIX_SIMPLE[cur.id]){
    const s=FIX_SIMPLE[cur.id];
    const inp=$("ans");
    const val=inp?inp.value.trim():"";
    const f=FIXQ[cur.id];
    let mine="";
    if(!ok&&val&&norm(val)!==norm(f.w)) mine=`<div class="muted">你填的是「${esc(val)}」，正确的是「${esc(f.a[0])}」。想知道你写的意思，可以点下面的「问さくら先生」。</div>`;
    b=`<div class="simple"><div>❌ ${s.w}</div><div>✅ ${s.r}<button class="mini" onclick="speak(SPK)">朗读</button></div></div>${mine}<details class="more"><summary>查看完整句子</summary>${body}</details>`;
  }
  if(!ok) b+=`<div class="btns"><button class="btn" id="whybtn" onclick="askWhy()">🤖 问さくら先生：我写的为什么不对？</button></div><div id="whyai"></div>`;
  _finishBeforeWhy(ok,b,cheers);
};
