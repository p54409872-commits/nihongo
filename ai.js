let AIKEY="";
try{AIKEY=localStorage.getItem("jp-aikey")||"";}catch(e){}
const AI_MODELS=["gemini-3.6-flash","gemini-3.5-flash-lite","gemini-3.1-flash-lite"];
let aiModelIdx=0,aiMode="free",aiHist=[],aiBusy=false;
const AI_MODES={
  free:{n:"自由聊天",p:"自由聊天。聊日常生活、兴趣、天气、美食等轻松话题。如果是对话刚开始，先打招呼并抛出一个话题。"},
  work:{n:"职场会话",p:"职场会话。设计一个真实的职场场景（例如向上司汇报、给客户打电话、跟银行确认入金、和同事商量工作），你扮演对方，帮她练习敬语和财务相关表达。开始时先用中文说明场景和她扮演的角色，然后你先开口。"},
  trivia:{n:"生活小知识",p:"生活小知识。每次用简单的日语讲一个有趣的科普或生活小知识（日本文化、科学、健康、词语由来等），附中文翻译，然后问一个相关的小问题考考她。"},
  sentence:{n:"造句批改",p:"造句批改。每次给她一个动词和一个变形要求（优先使用她的薄弱点），请她用这个变形造一个句子。她造句后：按5分制打分，指出错误，给出更自然的说法和两个例句，然后出下一题。开始时直接出第一题。"},
  city:{n:"聊聊当前城市",p:"环游世界话题。她在练习网站的环游世界跑道上，现在到了{city}。围绕这座城市聊天：介绍文化、美食或景点，教3个相关的日语单词，再问她一个问题。"}
};

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
</style>`);

function aiSystem(){
  const weak=(typeof weakCats==="function")?weakCats().slice(0,3).map(c=>CATN[c]||c):[];
  let city="东京（東京）";
  if(typeof CITIES!=="undefined"&&typeof cityIdx==="function"){const c=CITIES[cityIdx(S.correct||0)];city=`${c.zh}（${c.ja}）`;}
  return `你是「さくら先生」，一位温柔又幽默的日语老师，正在陪成年学习者「${pname()}」练习日语。她的母语是中文，日语水平大约N4到N3，目标是N1，平时在日本工作和生活。
规则：
1. 主要用简单自然的日语回复，每句日语后面用（）附上中文翻译。
2. 如果她的日语有错误，先用「✏️ 订正：」指出，给出正确说法和简短的中文原因，然后再继续话题。没有错误时适当表扬。

3. 每次回复控制在150字左右，结尾提一个简单的问题，让对话继续。
4. 她用中文说话时，先告诉她这句话用日语怎么说，再继续聊。
5. 不要询问真实姓名、住址、电话、公司名等个人信息。
6. 她目前的薄弱点：${weak.length?weak.join("、"):"暂无"}，可以适当在对话里练习。
当前模式：${AI_MODES[aiMode].p.replace("{city}",city)}`;
}

async function callGemini(){
  const contents=aiHist.filter(m=>!m.err).slice(-16).map(m=>({role:m.role,parts:[{text:m.text}]}));
  while(contents.length&&contents[0].role!=="user") contents.shift();
  const body={systemInstruction:{parts:[{text:aiSystem()}]},contents,generationConfig:{temperature:0.8,maxOutputTokens:1500}};
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
    .map(l=>l.replace(/（[^）]*）/g,"").replace(/\([^)]*\)/g,"").replace(/[*✏️👉#]/g,""));
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

function renderAI(){
  $("q").innerHTML=`<div class="qhead">AI 日语伙伴 · さくら先生</div>
    <div class="muted">${esc(pname())}，用日语或中文跟我聊吧！日语写错了我会帮你订正。</div>
    <div class="aimodes">${Object.keys(AI_MODES).map(k=>`<button class="chip ${aiMode===k?"on":""}" onclick="aiSetMode('${k}')">${AI_MODES[k].n}</button>`).join("")}</div>
    <div id="ailog" class="ailog"></div>

    <div class="inputrow">
      <textarea id="aiin" rows="2" placeholder="输入日语或中文，按回车发送（Shift+回车换行）"></textarea>
      <button class="btn main" onclick="aiSubmit()">发送</button>
    </div>
    <div class="btns">
      <button class="link" onclick="aiReset()">换个话题</button>
      <button class="link" onclick="showKeySetup(true)">更换密钥</button>
    </div>
    <div class="muted">提醒：免费版的对话可能会被 Google 用来改进服务，请不要输入真实姓名、地址、公司名等个人信息。</div>`;
  renderLog();
  $("aiin").addEventListener("keydown",e=>{
    if(e.key==="Enter"&&!e.shiftKey&&!e.isComposing){e.preventDefault();aiSubmit();}
  });
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
