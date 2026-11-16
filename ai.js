let AIKEY="";
try{AIKEY=localStorage.getItem("jp-aikey")||"";}catch(e){}
const AI_MODELS=["gemini-3.6-flash","gemini-3.5-flash-lite","gemini-3.1-flash-lite"];
let aiModelIdx=0,aiMode="free",aiHist=[],aiBusy=false;

const ROLE_TXT={
  random:"从同事、上司、其他部门的同事、客户中随机选一个",
  colleague:"同部门的同事",
  boss:"她的上司",
  other:"其他部门的同事",
  client:"客户（外部公司的人）",
  interviewer:"面试官（这是一场入职面试）"
};
const ROLE_NAME={random:"随机",colleague:"同事",boss:"上司",other:"其他部门同事",client:"客户",interviewer:"面试官",custom:"自己填"};

const AI_MODES={
  free:{n:"自由聊天",p:"自由聊天。聊日常生活、兴趣、天气、美食等轻松话题。如果是对话刚开始，先打招呼并抛出一个话题。"},
  work:{n:"职场会话"},
  trivia:{n:"生活小知识",p:"生活小知识。每次用简单的日语讲一个有趣的科普或生活小知识（日本文化、科学、健康、词语由来等），附中文翻译，然后问一个相关的小问题考考她。"},
  sentence:{n:"造句批改",p:"造句批改。每次给她一个动词和一个变形要求（优先使用她的薄弱点），请她用这个变形造一个句子。她造句后：按5分制打分，指出错误，给出更自然的说法和两个例句，然后出下一题。开始时直接出第一题。"},
  city:{n:"聊聊当前城市",p:"环游世界话题。她在练习网站的环游世界跑道上，现在到了{city}。围绕这座城市聊天：介绍文化、美食或景点，教3个相关的日语单词，再问她一个问题。"}
};
Object.defineProperty(AI_MODES.work,"p",{get(){
  const w=(S&&S.workScene)||{};
  const role=w.role==="custom"&&w.roleOther?w.roleOther:(ROLE_TXT[w.role||"random"]||ROLE_TXT.random);
  return `职场会话（这个模式下回复可以长一些，控制在300字以内）。设计一个真实的职场场景，你扮演对方，帮她练习敬语和职场表达。
场景用途：${w.use||"随机（例如汇报工作、打电话、开会、请假、确认入金或付款、和其他部门商量、接待客户等）"}
公司类型：${w.co||"随机（尽量贴近她在日本做财务工作的背景）"}
她的身份：${w.me||"在日本公司做财务工作的员工"}
你的身份：${role}
规则：
1. 开始时先用中文简短说明场景、她的角色和你的角色，然后你先用日语开口。

2. 根据你的身份调整敬语程度：你是客户、上司或面试官时用正式的敬语；你是同事时用です・ます体，可以稍微轻松。
3. 她回答后，如果日语或敬语有问题，先用「✏️ 订正：」指出并给出更合适的说法，再继续对话。
4. 对话进行5～8轮后，给出简短总结：用得好的表达、需要改进的敬语、两个这个场景常用的表达，然后问她要不要换一个场景。`;
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
.scene label{display:block;font-size:13px;color:var(--muted);margin:8px 0 2px}
.scene input,.scene select{width:100%;font-size:15px;padding:7px 9px;border:1px solid var(--line);border-radius:8px;font-family:inherit}
</style>`);

function aiSystem(){
  const weak=(typeof weakCats==="function")?weakCats().slice(0,3).map(c=>CATN[c]||c):[];
  let city="东京（東京）";
  if(typeof CITIES!=="undefined"&&typeof cityIdx==="function"){const c=CITIES[cityIdx(S.correct||0)];city=`${c.zh}（${c.ja}）`;}
  return `你是「さくら先生」，一位温柔又幽默的日语老师，正在陪成年学习者「${pname()}」练习日语。她的母语是中文，日语水平大约N4到N3，目标是N1，平时在日本工作和生活。
规则：
1. 主要用简单自然的日语回复，每句日语后面用（）附上中文翻译。
2. 如果她的日语有错误，先用「✏️ 订正：」指出，给出正确说法和简短的中文原因，然后再继续话题。没有错误时适当表扬。
3. 每次回复控制在150字左右（当前模式另有规定的除外），结尾提一个简单的问题，让对话继续。
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
    .map(l=>l.replace(/（[^）]*）/g,"").replace(/\([^)]*\)/g,"").replace(/[*✏️👉#💡👍]/g,""));
  speak(lines.join("。"));
}

function renderLog(){
  const el=$("ailog");
  if(!el) return;
