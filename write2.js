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

const withTimeout=(p,ms)=>Promise.race([p,new Promise(r=>setTimeout(()=>r(null),ms))]);

const _showWriteBeforeW2=window.showWrite;
window.showWrite=function(id,o){
  _showWriteBeforeW2(id,o);
  document.querySelectorAll("#q .row").forEach(el=>{
    if(el.textContent.includes("さくら先生会帮你批改")||el.textContent.includes("用日语写出整句"))
      el.innerHTML=`<span class="lbl">要求</span>用日语写出整句，汉字或假名都可以。提交后马上显示参考答案和说明。`;
  });
};

window.submitWrite=function(){
  if(phase!=="ask") return;
  const raw=$("ans").value.trim();
  if(!raw){$("err").textContent="请先写句子";return;}
  const w=WRITEQ[cur.id];
  cur.raw=raw;
  cur.aiNote="";
  $("ans").disabled=true;
  if(w.a.some(x=>norm(x)===norm(raw))) return writeDone(true);
  phase="selfcheck";
  SPK=w.a[0];
  const m=WRITE_WHY[cur.id]||"";
  const r=$("res");
  r.innerHTML=`<div class="simple">
      <div>你的句子：「${esc(raw)}」</div>
      <div>✅ 参考答案：「${esc(w.a.join(" ／ "))}」<button class="mini" onclick="speak(SPK)">朗读</button></div>
      ${m?`<div>💡 为什么：${esc(m)}</div>`:""}
    </div>
    <div class="muted">对照一下：意思和语法都一样就算对（标点、空格不用管）。</div>
    <div class="btns">
      <button class="btn main" onclick="writeJudge(true)">我写对了</button>
      <button class="btn" onclick="writeJudge(false)">有错误</button>
    </div>
    <div class="btns"><button class="btn" id="aigrade" onclick="aiGradeWrite()">🤖 不确定？请さくら先生批改我的句子</button></div>
    <div id="aigradebox"></div>`;
  r.classList.remove("hidden");
  r.scrollIntoView({behavior:"smooth",block:"start"});
};

function writeJudge(ok){
  if(phase!=="selfcheck") return;
  writeDone(ok);
}

function writeDone(ok){
  phase="ask";
  const w=WRITEQ[cur.id];
  const cheers=record(ok,"write");
  srsAfter({kind:"write",id:cur.id,cat:"write"},ok,cheers);
  save();
  SPK=w.a[0];
  const m=WRITE_WHY[cur.id]||"";
  finish(ok,`<div class="row">你的句子：「${esc(cur.raw)}」</div>
    <div class="row">参考答案：「${esc(w.a.join(" ／ "))}」<button class="mini" onclick="speak(SPK)">朗读</button></div>
    ${m?`<div class="note">💡 ${esc(m)}</div>`:""}${cur.aiNote||""}`,cheers);
}

async function aiGradeWrite(){
  const btn=$("aigrade"),box=$("aigradebox");
  if(!btn||!box) return;
  btn.disabled=true;
  box.innerHTML=`<div class="muted">さくら先生批改中…（需要网络，一般几秒钟）</div>`;
  const w=WRITEQ[cur.id];
  if(typeof ensureKey==="function") await ensureKey();
  if(typeof AIKEY==="undefined"||!AIKEY||typeof geminiJSON!=="function"){
    box.innerHTML=`<div class="note">AI 暂时用不了（还没设置密钥）。可以先对照参考答案自己判断。</div>`;
    return;
  }
  const prompt=`你是日语老师。学习者要把中文翻译成日语。
中文：${w.zh}
参考答案：${w.a.join(" ／ ")}
学习者的回答：${cur.raw}
请判断学习者的回答意思是否正确、语法是否正确、是否自然。参考答案只是参考，其他正确自然的说法也算对。
只用JSON回答：{"ok":意思正确且没有语法错误时为true,"corrected":"修改后的自然日语","comment":"用中文简短说明：她写的是什么意思、哪里不对或者为什么可以，60字以内"}`;
  const j=await withTimeout(geminiJSON(prompt),15000);
  if(!j||typeof j.ok!=="boolean"){
    box.innerHTML=`<div class="note">网络有点慢或者 AI 暂时忙不过来，稍后可以再试一次。先对照参考答案自己判断也可以。</div>`;
    btn.disabled=false;
    return;
  }
  const html=`<div class="simple">
    <div>${j.ok?"✅ さくら先生：你的句子是对的！":"❌ さくら先生：你的句子有问题。"}</div>
    ${j.comment?`<div>${esc(j.comment)}</div>`:""}
    ${j.corrected?`<div>更自然的说法：「${esc(j.corrected)}」</div>`:""}
  </div>`;
  box.innerHTML=html+`<div class="muted">看完后点上面的「我写对了」或「有错误」继续。</div>`;
  cur.aiNote=html;
}
