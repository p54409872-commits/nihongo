let AIKEY="";
try{AIKEY=localStorage.getItem("jp-aikey")||"";}catch(e){}
const AI_MODELS=["gemini-3.6-flash","gemini-3.5-flash-lite","gemini-3.1-flash-lite"];
let aiModelIdx=0,aiMode="free",aiHist=[],aiBusy=false;

const SC_OPTS={
  place:{label:"情景",o:{random:"随机",it:"职场（IT行业）",fin:"职场（财务）",interview:"面试",life:"日常生活",shop:"一起逛街／购物",food:"餐厅／咖啡店",friends:"朋友聚会",date:"恋爱／约会",travel:"旅行",custom:"自己设定"},ph:"例如：在日本的游戏公司开项目会议"},
  me:{label:"我的身份",o:{random:"随机",interviewee:"面试者",staff:"公司员工",newbie:"新人",girl:"女生",lover:"恋人",friend:"朋友",customer:"顾客",custom:"自己设定"},ph:"例如：刚来日本留学的研究生"},
  other:{label:"对方的身份",o:{random:"随机",hr:"人事面试官",manager:"某个经理",client:"客户",boss:"领导／上司",dept:"跨部门同事",coworker:"同事",bf:"男朋友",bestie:"闺蜜",rival:"死对头",clerk:"店员",stranger:"陌生人",custom:"自己设定"},ph:"例如：隔壁部门很严格的课长"},
  rel:{label:"关系和进展",o:{random:"随机",first:"第一次见面",second:"第二次见面",often:"见过很多次（熟悉）",notclose:"认识但不太熟",stranger:"完全陌生",iv1:"第一次面试",iv2:"第二次面试（最终面试）",custom:"自己设定"},ph:"例如：吵架之后第一次见面"}
};
function scVal(k){
  const sc=(S&&S.scene)||{};
  const v=sc[k]||"random";
  if(v==="custom") return sc[k+"X"]||"随机";
  return SC_OPTS[k].o[v]||"随机";
}

const AI_MODES={
  free:{n:"自由聊天",p:"自由聊天。聊日常生活、兴趣、天气、美食等轻松话题。如果是对话刚开始，先打招呼并抛出一个话题。"},
  work:{n:"情景会话"},
  trivia:{n:"生活小知识",p:"生活小知识。每次用简单的日语讲一个有趣的科普或生活小知识（日本文化、科学、健康、词语由来等），附中文翻译，然后问一个相关的小问题考考她。"},
  sentence:{n:"造句批改",p:"造句批改。每次给她一个动词和一个变形要求（优先使用她的薄弱点），请她用这个变形造一个句子。她造句后：按5分制打分，指出错误，给出更自然的说法和两个例句，然后出下一题。开始时直接出第一题。"},
  city:{n:"聊聊当前城市",p:"环游世界话题。她在练习网站的环游世界跑道上，现在到了{city}。围绕这座城市聊天：介绍文化、美食或景点，教3个相关的日语单词，再问她一个问题。"}
};
Object.defineProperty(AI_MODES.work,"p",{get(){
  const sc=(S&&S.scene)||{};
  return `情景会话（这个模式下回复可以长一些，控制在300字以内）。今天的日期是${today()}。
情景：${scVal("place")}
她的身份：${scVal("me")}
你的身份：${scVal("other")}
两人的关系和进展：${scVal("rel")}
${sc.topic?`她想聊的话题：${sc.topic}`:""}
${sc.hot?"对话里自然地加入一个和当前季节或近期社会话题有关的内容。你无法实时上网，不要编造具体的新闻细节，不确定的事情用一般性的说法。":""}
规则：
1. 写着“随机”的部分由你来决定，尽量多样化，不要总是职场或财务。开始时先用中文简短说明情景、她的身份、你的身份和两人的关系，然后你先用日语开口。
2. 根据身份和关系调整说话方式：面试官、客户、上司用正式敬语；同事用です・ます体；朋友、闺蜜、恋人、熟人用自然的口语（タメ口），并提醒她这是口语说法。第一次见面要礼貌，熟悉之后可以更随意。
3. 她回答后，如果日语不自然或敬语用错，先用「✏️ 订正：」指出，给出在这个身份和关系下更自然的说法，再继续对话。
4. 恋爱、约会的情景保持轻松、健康、温馨；“死对头”角色可以斗嘴，但不要人身攻击。
5. 对话进行6～8轮后，给出简短总结：用得好的表达、需要改进的地方、两个这个情景的常用表达，然后问她要不要换个情景。`;
}});

document.head.insertAdjacentHTML("beforeend",`<style>
.aimodes{display:flex;flex-wrap:wrap;gap:6px;margin:10px 0}
.chip{padding:6px 12px;border-radius:16px;border:1px solid var(--line);background:#fff;cursor:pointer;font-size:14px}
.chip.on{background:var(--pink);color:#fff;border-color:var(--pink)}
.ailog{max-height:460px;overflow-y:auto;border:1px solid var(--line);border-radius:10px;padding:10px;margin:10px 0;background:#fafaf7}
.msg{padding:9px 13px;border-radius:12px;margin:8px 0;max-width:90%;font-size:15px;line-height:1.75;word-break:break-word}
.msg.me{background:var(--pink-bg);margin-left:auto}
.msg.bot{background:#fff;border:1px solid var(--line)}
#aiin{flex:1;min-width:0;font-size:16px;padding:8px 10px;border:1px solid var(--line);border-radius:8px;resize:vertical;font-family:inherit}
.steps{font-size:15px;line-height:1.9;padding-left:20px}
.scbar{display:flex;align-items:center;gap:10px;flex-wrap:wrap;background:var(--blue-bg);color:var(--blue);border-radius:8px;padding:8px 12px;font-size:14px;margin-top:6px}
.scene label{display:block;font-size:13px;color:var(--muted);margin:10px 0 2px}
.scene input[type=text],.scene select{width:100%;font-size:15px;padding:7px 9px;border:1px solid var(--line);border-radius:8px;font-family:inherit}
</style>`);

function aiSystem(){
  const weak=(typeof weakCats==="function")?weakCats().slice(0,3).map(c=>CATN[c]||c):[];
  let city="东京（東京）";
  if(typeof CITIES!=="undefined"&&typeof cityIdx==="function"){const c=CITIES[cityIdx(S.correct||0)];city=`${c.zh}（${c.ja}）`;}
  return `你是「さくら先生」，一位温柔又幽默的日语老师，正在陪成年学习者「${pname()}」练习日语。她的母语是中文，日语水平大约N4到N3，目标是N1，住在日本。
规则：
1. 主要用自然的日语回复，每句日语后面用（）附上中文翻译。
2. 如果她的日语有错误，先用「✏️ 订正：」指出，给出正确说法和简短的中文原因，然后再继续话题。没有错误时适当表扬。
3. 每次回复控制在150字左右（当前模式另有规定的除外），结尾提一个问题或留一句话，让对话继续。
4. 她用中文说话时，先告诉她这句话用日语怎么说，再继续聊。
5. 不要询问真实姓名、住址、电话、公司名等个人信息。
6. 她目前的薄弱点：${weak.length?weak.join("、"):"暂无"}，可以适当在对话里练习。
当前模式：${AI_MODES[aiMode].p.replace("{city}",city)}`;
}

async function callGemini(){
  const contents=aiHist.filter(m=>!m.err).slice(-16).map(m=>({role:m.role,parts:[{text:m.text}]}));
  while(contents.length&&contents[0].role!=="user") contents.shift();
  const body={systemInstruction:{parts:[{text:aiSystem()}]},contents,generationConfig:{temperature:0.9,maxOutputTokens:1500}};
  let last="";
  for(let i=aiModelIdx;i<AI_MODELS.length;i++){
    let res;
    try{
      res=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${AI_MODELS[i]}:generateContent`,{
        method:"POST",
        headers:{"Content-Type":"application/json","x-goog-api-key":AIKEY},
        body:JSON.stringify(body)
      });
    }catch(e){throw new Error("网络连接失败，请检查网络后再试。");}
    if(res.ok){
      aiModelIdx=i;
      const d=await res.json();
      const c=d.candidates&&d.candidates[0];
      const t=c&&c.content&&c.content.parts?c.content.parts.map(p=>p.text||"").join(""):"";
      if(!t.trim()) throw new Error("这次没有生成回复，换个说法再试试。");
      return t.trim();
    }
    let msg="";
    try{const j=await res.json();msg=(j.error&&j.error.message)||"";}catch(e){}
    if(/API key/i.test(msg)) throw new Error("密钥无效，请点下面的「更换密钥」重新粘贴。");
    last=msg;
    if(res.status===429||res.status===404||res.status===400||res.status>=500) continue;
    throw new Error("出错了："+msg);
  }
  console.error(last);
  throw new Error("暂时连不上 AI（可能是免费次数用完了，每分钟和每天都有上限），过一会儿再试。");
}

function fmtAI(t){return esc(t).replace(/\*\*(.+?)\*\*/g,"<b>$1</b>").replace(/\n/g,"<br>");}
function aiSpeak(i){
  const lines=aiHist[i].text.split("\n")
    .filter(l=>/[ぁ-んァ-ヶ]/.test(l))
    .map(l=>l.replace(/（[^）]*）/g,"").replace(/\([^)]*\)/g,"").replace(/[*✏️👉#💡👍【】]/g,""));
  speak(lines.join("。"));
}

function renderLog(){
  const el=$("ailog");
  if(!el) return;
  el.innerHTML=aiHist.map((m,i)=>{
    if(m.hidden) return "";
    if(m.role==="user") return `<div class="msg me">${esc(m.text).replace(/\n/g,"<br>")}</div>`;
    return `<div class="msg bot">${fmtAI(m.text)}${m.err?"":`<div><button class="mini" style="margin:6px 0 0" onclick="aiSpeak(${i})">朗读日语</button></div>`}</div>`;
  }).join("")+(aiBusy?`<div class="msg bot muted">さくら先生正在输入…</div>`:"");
  el.scrollTop=el.scrollHeight;
}

function sceneSummary(){
  const sc=S.scene||{};
  return `情景：${scVal("place")} ｜ 我：${scVal("me")} ｜ 对方：${scVal("other")} ｜ 关系：${scVal("rel")}${sc.topic?" ｜ 话题："+sc.topic:""}${sc.hot?" ｜ 含时事":""}`;
}

function renderAI(){
  $("q").innerHTML=`<div class="qhead">AI 日语伙伴 · さくら先生</div>
    <div class="muted">${esc(pname())}，用日语或中文跟我聊吧！日语写错了我会帮你订正。</div>
    <div class="aimodes">${Object.keys(AI_MODES).map(k=>`<button class="chip ${aiMode===k?"on":""}" onclick="aiSetMode('${k}')">${AI_MODES[k].n}</button>`).join("")}</div>
    ${aiMode==="work"?`<div class="scbar"><span>当前情景：${esc(sceneSummary())}</span><button class="btn" onclick="showSceneSetup()">设定情景</button></div>`:""}
    <div id="ailog" class="ailog"></div>
    <div class="inputrow">
      <textarea id="aiin" rows="2" placeholder="输入日语或中文，按回车发送（Shift+回车换行）"></textarea>
      <button class="btn main" onclick="aiSubmit()">发送</button>
    </div>
    <div class="btns">
      <button class="link" onclick="aiReset()">换个话题</button>
      ${aiMode==="work"?`<button class="link" onclick="showSceneSetup()">设定情景</button>`:""}
      <button class="link" onclick="showKeySetup(true)">更换密钥</button>
    </div>
    <div class="muted">提醒：免费版的对话可能会被 Google 用来改进服务，请不要输入真实姓名、地址、公司名等个人信息。</div>`;
  renderLog();
  $("aiin").addEventListener("keydown",e=>{
    if(e.key==="Enter"&&!e.shiftKey&&!e.isComposing){e.preventDefault();aiSubmit();}
  });
}

function showSceneSetup(){
  const sc=S.scene||{};
  const log=$("ailog");
  if(!log) return;
  const field=k=>{
    const d=SC_OPTS[k],v=sc[k]||"random";
    return `<label>${d.label}</label>
      <select id="sc_${k}" onchange="$('sc_${k}X').style.display=this.value==='custom'?'block':'none'">
        ${Object.keys(d.o).map(o=>`<option value="${o}" ${v===o?"selected":""}>${d.o[o]}</option>`).join("")}
      </select>
      <input type="text" id="sc_${k}X" value="${esc(sc[k+"X"]||"")}" placeholder="${d.ph}" style="margin-top:6px;display:${v==="custom"?"block":"none"}">`;
  };
  log.innerHTML=`<div class="msg bot scene" style="max-width:100%">
    <b>设定情景</b>
    <div class="muted">每一项都可以选「随机」，交给 AI 安排。请不要写真实姓名、具体公司名等个人信息。</div>
    ${field("place")}${field("me")}${field("other")}${field("rel")}
    <label>想聊的话题（可以不填）</label>
    <input type="text" id="sc_topic" value="${esc(sc.topic||"")}" placeholder="例如：最近看的日剧、年末的忘年会、新开的店">
    <label style="display:flex;align-items:center;gap:6px;margin-top:10px"><input type="checkbox" id="sc_hot" ${sc.hot?"checked":""}> 加入季节和时事话题（AI 不能实时上网，不会是最新新闻）</label>
    <div class="btns">
      <button class="btn main" onclick="sceneStart(false)">按这个情景开始</button>
      <button class="btn" onclick="sceneStart(true)">全部随机</button>
    </div>
  </div>`;
  log.scrollTop=0;
}
function sceneStart(clear){
  if(clear) S.scene={};
  else{
    const sc={};
    ["place","me","other","rel"].forEach(k=>{
      sc[k]=$("sc_"+k).value;
      const x=$("sc_"+k+"X").value.trim();
      if(x) sc[k+"X"]=x.slice(0,60);
    });
    sc.topic=$("sc_topic").value.trim().slice(0,80);
    sc.hot=$("sc_hot").checked;
    S.scene=sc;
  }
  save();
  aiHist=[];
  renderAI();
  aiSend("请开始。",true);
}

async function aiSend(text,hidden){
  aiHist.push({role:"user",text,hidden});
  aiBusy=true; renderLog();
  try{
    const reply=await callGemini();
    aiHist.push({role:"model",text:reply});
  }catch(e){
    aiHist.push({role:"model",text:"⚠ "+e.message,err:true});
  }
  aiBusy=false;
  if(mode==="ai") renderLog();
}
function aiSubmit(){
  const ta=$("aiin");
  if(!ta||aiBusy) return;
  const v=ta.value.trim();
  if(!v) return;
  ta.value="";
  aiSend(v,false);
}
function aiSetMode(k){aiMode=k;aiHist=[];renderAI();aiSend("请开始。",true);}
function aiReset(){aiHist=[];renderAI();aiSend("请开始。",true);}

function showKeySetup(change){
  $("q").innerHTML=`<div class="qhead">设置 AI 密钥（只需要一次）</div>
    <ol class="steps">
      <li>打开 <a href="https://aistudio.google.com/app/apikey" target="_blank">Google AI Studio</a>，用 Google 账号登录。</li>
      <li>点「Create API key」创建密钥，复制那串以 AIza 开头的字符。</li>
      <li>粘贴到下面，点「保存」。</li>
    </ol>
    <div class="note">密钥会保存在你们的云端空间里，另一个人的设备会自动读取，不用重复设置。⚠ 不要把密钥贴进 GitHub 的代码里。</div>
    <input type="password" id="aikey" placeholder="粘贴密钥" style="width:100%">
    <div class="err" id="kerr"></div>
    <div class="btns">
      <button class="btn main" onclick="saveKey()">保存</button>
      ${change&&AIKEY?'<button class="btn" onclick="renderAI()">取消</button>':""}
    </div>`;
}
async function saveKey(){
  const v=$("aikey").value.trim();
  if(v.length<20){$("kerr").textContent="密钥看起来不完整，请重新复制。";return;}
  AIKEY=v;
  try{localStorage.setItem("jp-aikey",v);}catch(e){}
  if(cloud){try{await FB.setDoc(roomRef(),{aiKey:v},{merge:true});}catch(e){console.error(e);}}
  aiModelIdx=0; aiHist=[];
  renderAI();
  aiSend("请开始。",true);
}

async function showAI(){
  phase="none"; cur={type:"none"};
  if(!AIKEY&&cloud){
    try{
      const rs=await FB.getDoc(roomRef());
      if(rs.exists()&&rs.data().aiKey){
        AIKEY=rs.data().aiKey;
        try{localStorage.setItem("jp-aikey",AIKEY);}catch(e){}
      }
    }catch(e){console.error(e);}
  }
  if(mode!=="ai") return;
  if(!AIKEY){showKeySetup(false);renderAll();return;}
  renderAI();
  renderAll();
  if(!aiHist.length) aiSend("请开始。",true);
}

const _prevNewQuestion=window.newQuestion;
window.newQuestion=function(){
  if(mode==="ai"){$("res").classList.add("hidden");return showAI();}
  return _prevNewQuestion();
};
const _prevRenderTabs=window.renderTabs;
window.renderTabs=function(){
  _prevRenderTabs();
  const t=$("tabs");
  const b=document.createElement("button");
  b.className="tab"+(mode==="ai"?" on":"");
  b.textContent="AI聊天";
  b.onclick=()=>setMode("ai");
  t.insertBefore(b,t.querySelector("select"));
};
