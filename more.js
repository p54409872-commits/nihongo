const MIX_SETS=[
  {u:1,ops:[["te"],["teiru"],["ta"],["ta","tara"]]},
  {u:2,ops:[["nai"],["nai","adjPast"],["nai","adjBa"],["nai","adjTe"]]},
  {u:3,ops:[["pot"],["pot","nai"],["pot","ta"],["pot","nai","adjPast"]]},
  {u:4,ops:[["ba"],["ta","tara"],["vol"],["imp"]]},
  {u:5,ops:[["pot","ta"],["pas","ta"],["cau","ta"],["cpS","ta"]]},
  {u:5,ops:[["nai"],["pot","nai"],["pas","nai"],["cau","nai"]]}
];

const WRITEQ=[
  {zh:"今天之内可以确认。",a:["今日中に確認できます。"],g:"可能形"},
  {zh:"资料已经发过去了。",a:["資料はもう送りました。"],g:"ました"},
  {zh:"可以请您确认一下这份资料吗？",a:["この資料を確認していただけますか。"],g:"〜ていただけますか"},
  {zh:"这笔入金我还没有确认。",a:["この入金はまだ確認していません。"],g:"まだ〜ていません"},
  {zh:"确认好之后，我联系您。",a:["確認できたら、ご連絡します。","確認したら、連絡します。"],g:"たら"},
  {zh:"明天之前必须提交报告。",a:["明日までに報告書を提出しなければなりません。"],g:"なければなりません"},
  {zh:"不好意思，明天我去不了公司。",a:["すみません、明日は会社に行けません。"],g:"可能形否定"},
  {zh:"我被部长表扬了。",a:["部長にほめられました。"],g:"被动形"},
  {zh:"小时候被妈妈逼着学钢琴。",a:["子どものころ、母にピアノを習わされました。","子どものころ、母にピアノを習わせられました。"],g:"使役被动形"},
  {zh:"如果下雨，我就不去了。",a:["雨が降ったら、行きません。"],g:"たら"},
  {zh:"我打算下个月去大阪。",a:["来月、大阪に行こうと思っています。"],g:"意向形＋と思っています"},
  {zh:"门开着。",a:["ドアが開いています。"],g:"自动词＋ている"},
  {zh:"朋友送了我一本书。",a:["友だちが本をくれました。"],g:"くれる"},
  {zh:"能请您稍等一下吗？",a:["少し待っていただけますか。","少々お待ちいただけますか。"],g:"〜ていただけますか"},
  {zh:"我正在找钥匙。",a:["鍵を探しています。"],g:"ている"},
  {zh:"我变得能用日语说明了。",a:["日本語で説明できるようになりました。"],g:"ようになる"},
  {zh:"这个会议室下午能用吗？",a:["この会議室は午後使えますか。"],g:"可能形"},
  {zh:"请让我考虑一下。",a:["少し考えさせてください。"],g:"使役形＋てください"},
  {zh:"不用担心。",a:["心配しなくてもいいです。"],g:"なくてもいい"},
  {zh:"我还没决定。",a:["まだ決めていません。"],g:"まだ〜ていません"}
];


const FIXQ=[
  {s:"明日、会社に来れますか。",w:"来れます",a:["来られます","こられます"],zh:"明天能来公司吗？",ex:"「来れる」是ら抜き言葉，标准形式是「来られる」。"},
  {s:"この映画はスマホで見れます。",w:"見れます",a:["見られます","みられます"],zh:"这部电影用手机就能看。",ex:"「見れる」是ら抜き言葉，标准形式是「見られる」。"},
  {s:"先生に作文を何回も書かれました。",w:"書かれました",a:["書かされました","書かせられました","かかされました","かかせられました"],zh:"被老师逼着把作文写了好几遍。",ex:"“被迫做”要用使役被动形；「書かれた」只是普通被动。"},
  {s:"窓が開けています。",w:"開けています",a:["開いています","あいています"],zh:"窗户开着。",ex:"主语是「窓が」，描述状态要用自动词「開く」→「開いている」。"},
  {s:"では、会議を始まりましょう。",w:"始まりましょう",a:["始めましょう","はじめましょう"],zh:"那么，开始开会吧。",ex:"「を」后面要用他动词「始める」。"},
  {s:"友だちが私にプレゼントをあげました。",w:"あげました",a:["くれました"],zh:"朋友送了我礼物。",ex:"别人给我要用「くれる」。"},
  {s:"昨日、田中さんに会いて、話しました。",w:"会いて",a:["会って","あって"],zh:"昨天见了田中，聊了聊。",ex:"「会う」的て形：う→って，所以是「会って」。"},
  {s:"急ぎて駅に行きました。",w:"急ぎて",a:["急いで","いそいで"],zh:"急急忙忙去了车站。",ex:"「ぐ」结尾的て形是「いで」：急ぐ→急いで。"},
  {s:"明日は早く起きなかったらなりません。",w:"起きなかったら",a:["起きなければ","おきなければ"],zh:"明天必须早起。",ex:"“必须”的固定说法是「〜なければなりません」。"},
  {s:"まだ宿題をしませんでした。",w:"しませんでした",a:["していません"],zh:"作业到现在还没做。",ex:"“到现在还没做”用「まだ〜ていません」；「〜ませんでした」是过去某个时间没做。"},
  {s:"部長は明日、大阪へ行けます。",w:"行けます",a:["行かれます","いかれます"],zh:"部长明天去大阪。（尊敬）",ex:"表示对上级动作的尊敬用「行かれます」（也可以说「いらっしゃいます」）；「行けます」是“能去”。"},
  {s:"私は子どもに野菜を食べさせられました。",w:"食べさせられました",a:["食べさせました","たべさせました"],zh:"我让孩子吃了蔬菜。",ex:"“让别人做”是使役「食べさせる」；「食べさせられる」是自己被迫吃。"},
  {s:"お金が足りるないです。",w:"足りるない",a:["足りない","たりない"],zh:"钱不够。",ex:"二类动词去る＋ない：足りる→足りない。"},
  {s:"帰るの時、電話してください。",w:"帰るの時",a:["帰る時","帰るとき","かえるとき"],zh:"回去的时候请打个电话。",ex:"动词可以直接修饰「時」，中间不加「の」。"},
  {s:"日本語が少し話せるようにしました。",w:"ようにしました",a:["ようになりました"],zh:"变得能说一点日语了。",ex:"能力自然发生变化用「〜ようになる」；「〜ようにする」是自己努力去做。"},
  {s:"駅に着くと、電話してください。",w:"着くと",a:["着いたら","ついたら"],zh:"到了车站请打电话。",ex:"后面是请求时不能用「と」，要用「たら」。"},
  {s:"彼は毎日公園で走るます。",w:"走るます",a:["走ります","はしります"],zh:"他每天在公园跑步。",ex:"「走る」看起来像二类，其实是一类（例外），ます形是「走ります」。"},
  {s:"この本は来週までに返さなくてもいいです。",w:"返さなくてもいいです",a:["返さなければなりません","かえさなければなりません"],zh:"这本书下周之前必须还。",ex:"“必须”用「〜なければなりません」；「〜なくてもいい」是“不必”。"}
];

const JLPTQ=[
  {lv:"N3",t:"g",q:"雨が降っている（　）、試合は中止にならなかった。",o:["にもかかわらず","おかげで","せいで","ばかりか"],a:0,zh:"尽管在下雨，比赛却没有取消。",ex:"「〜にもかかわらず」表示“尽管……却……”，前后意思相反。"},
  {lv:"N3",t:"g",q:"先生の（　）、試験に合格できました。",o:["おかげで","せいで","くせに","わりに"],a:0,zh:"多亏了老师，考试及格了。",ex:"好的结果用「おかげで」，不好的结果用「せいで」。"},
  {lv:"N3",t:"g",q:"寝坊した（　）、会議に遅れてしまった。",o:["せいで","おかげで","うちに","とおりに"],a:0,zh:"因为睡过头，开会迟到了。",ex:"导致不好结果的原因用「せいで」。"},
  {lv:"N3",t:"g",q:"若い（　）に、いろいろな国へ行ってみたい。",o:["うち","あいだ","まえ","ころ"],a:0,zh:"想趁年轻去各个国家看看。",ex:"「〜うちに」表示“趁……的时候”，在状态改变之前做某事。"},
  {lv:"N3",t:"g",q:"この仕事は今日中に終わらせる（　）。",o:["しかない","ことはない","わけがない","ほどだ"],a:0,zh:"这项工作只能今天之内完成。",ex:"「〜しかない」表示“只能……，别无选择”。"},
  {lv:"N4",t:"g",q:"日本に来て三年になる（　）、まだ富士山を見たことがない。",o:["のに","ので","から","ために"],a:0,zh:"来日本都三年了，却还没见过富士山。",ex:"「〜のに」表示结果和预期相反，带有意外或遗憾的语气。"},
  {lv:"N3",t:"g",q:"明日は休みだから、早く起きる（　）。",o:["必要はない","はずだ","ところだ","ようだ"],a:0,zh:"明天休息，不需要早起。",ex:"「〜必要はない」表示“没有必要……”。"},
  {lv:"N4",t:"g",q:"部長はもう帰った（　）です。電気が消えていますから。",o:["はず","つもり","ところ","ため"],a:0,zh:"部长应该已经回去了，因为灯关了。",ex:"根据线索推断“应该……”用「〜はずだ」；「つもり」是自己的打算。"},
  {lv:"N3",t:"g",q:"この料理は、見た目の（　）おいしい。",o:["わりに","について","によって","にとって"],a:0,zh:"这道菜看起来普通，没想到挺好吃。",ex:"「〜わりに」表示和预想的程度不一样（出乎意料）。"},
  {lv:"N2",t:"g",q:"この件は、部長と相談した（　）でお返事します。",o:["うえ","あと","まえ","ところ"],a:0,zh:"这件事和部长商量之后再答复您。",ex:"「〜たうえで」表示“先做……，在此基础上再……”，职场很常用。"},

  {lv:"N4",t:"g",q:"宿題が終わった（　）、遊びに行ってもいいよ。",o:["ら","と","ば","なら"],a:0,zh:"作业做完了就可以去玩哦。",ex:"“做完A之后B”并且后面是许可或请求，用「たら」。"},
  {lv:"N4",t:"g",q:"このペンはとても書き（　）です。",o:["やすい","にくい","かた","ながら"],a:0,zh:"这支笔很好写。",ex:"「ます形词干＋やすい」表示“容易……”；「にくい」是“难以……”。"},
  {lv:"N4",t:"g",q:"昨日は忙しくて、昼ご飯を食べる（　）もなかった。",o:["ひま","ため","はず","よう"],a:0,zh:"昨天太忙，连吃午饭的时间都没有。",ex:"「〜ひまもない」表示“连……的空闲都没有”。"},
  {lv:"N3",t:"g",q:"日本語が上手になる（　）、毎日練習しています。",o:["ように","ために","ことに","ところに"],a:0,zh:"为了日语变好，每天都在练习。",ex:"「上手になる」不是靠意志直接做到的动作，表示目的用「ように」；「ために」前面要接意志动词。"},
  {lv:"N4",t:"g",q:"お客様が（　）。（尊敬：客人来了）",o:["いらっしゃいました","まいりました","うかがいました","おりました"],a:0,zh:"客人来了。",ex:"「いらっしゃる」是「来る」的尊敬语；「まいる」「うかがう」是谦让语，用在自己身上。"},
  {lv:"N4",t:"g",q:"資料は私が（　）。（谦让：我带过去）",o:["お持ちします","お持ちになります","持たれます","持ってくださいます"],a:0,zh:"资料由我带过去。",ex:"「お＋ます形词干＋する」是谦让语，用于自己的动作；「お〜になる」是尊敬语。"},
  {lv:"N3",t:"g",q:"この問題は難しすぎて、子どもに（　）。",o:["わかるわけがない","わかるはずだ","わかることにした","わかるところだ"],a:0,zh:"这道题太难了，孩子不可能懂。",ex:"「〜わけがない」表示“不可能……”，语气很肯定。"},
  {lv:"N2",t:"star",q:"この件は ＿＿ ★ ＿＿ ＿＿ いたします。",o:["部長と","相談した","うえで","ご連絡"],a:1,full:"この件は部長と相談したうえでご連絡いたします。",zh:"这件事和部长商量之后再联系您。",ex:"正确顺序：部長と → 相談した → うえで → ご連絡。"},
  {lv:"N3",t:"star",q:"日本語が ＿＿ ＿＿ ＿＿ ★ 練習しています。",o:["上手に","なる","ように","毎日"],a:3,full:"日本語が上手になるように毎日練習しています。",zh:"为了日语变好，每天都在练习。",ex:"正确顺序：上手に → なる → ように → 毎日。"},
  {lv:"N3",t:"star",q:"雨が ★ ＿＿ ＿＿ ＿＿ 中止になりませんでした。",o:["降って","いた","にもかかわらず","試合は"],a:0,full:"雨が降っていたにもかかわらず試合は中止になりませんでした。",zh:"尽管下着雨，比赛也没有取消。",ex:"正确顺序：降って → いた → にもかかわらず → 試合は。"},
  {lv:"N3",t:"star",q:"子どもの ＿＿ ＿＿ ★ ＿＿ させられました。",o:["ころ","母に","毎日","ピアノの練習を"],a:2,full:"子どものころ母に毎日ピアノの練習をさせられました。",zh:"小时候每天都被妈妈逼着练钢琴。",ex:"正确顺序：ころ → 母に → 毎日 → ピアノの練習を。"},
  {lv:"N4",t:"star",q:"忙しくて ＿＿ ★ ＿＿ ＿＿ ありませんでした。",o:["昼ご飯を","食べる","時間が","ぜんぜん"],a:1,full:"忙しくて昼ご飯を食べる時間がぜんぜんありませんでした。",zh:"太忙了，完全没有吃午饭的时间。",ex:"正确顺序：昼ご飯を → 食べる → 時間が → ぜんぜん。"},
  {lv:"N3",t:"star",q:"この料理は ＿＿ ＿＿ ＿＿ ★ おいしいです。",o:["見た目","の","わりに","とても"],a:3,full:"この料理は見た目のわりにとてもおいしいです。",zh:"这道菜看起来普通，其实非常好吃。",ex:"正确顺序：見た目 → の → わりに → とても。"}
];

Object.assign(CATN,{mix:"同词辨形",write:"整句翻译",fix:"改错题",parse:"反向辨认",jlpt:"JLPT仿真"});
TYPES.push("mix","write","fix","parse","jlpt");

document.head.insertAdjacentHTML("beforeend",`<style>
.star{color:var(--ng);font-weight:bold}
.mt small{color:var(--muted);font-size:12px;margin-left:6px}
.score{font-size:18px;color:var(--gold);font-weight:bold}
</style>`);

const XB={};
function nextIdx(key,arr){
  let b=XB[key];
  if(!b||!b.q.length){
    const q=shuffle(arr.map((x,i)=>i));
    const last=b?b.last:undefined;
    if(last!==undefined&&q.length>1&&q[0]===last) q.push(q.shift());
    b=XB[key]={q,last};

  }
  const n=b.q.shift();
  b.last=n;
  return n;
}
function bindEnter(fn){
  const i=$("ans");
  if(!i) return;
  i.focus();
  i.addEventListener("keydown",e=>{
    if(e.key==="Enter"&&!e.isComposing){e.preventDefault();e.stopPropagation();fn();}
  });
}
function markChoice(correctIdx,el,ok){
  document.querySelectorAll(".opt").forEach(b=>{b.disabled=true;if(+b.dataset.i===correctIdx) b.classList.add("right");});
  if(!ok&&el) el.classList.add("wrong");
}

function showMix(o){
  const cu=Math.min(curUnit(),6);
  let sets=MIX_SETS.filter(s=>s.u<=cu+1);
  if(!sets.length) sets=[MIX_SETS[0]];
  const godan=VERBS.filter(x=>x.t==="g");
  for(let tries=0;tries<30;tries++){
    const set=pick(sets),v=pick(godan);
    const items=set.ops.map(ops=>{
      let o2=ops;
      if(o2[0]==="cpS"&&v.k.slice(-1)==="す") o2=["cp",...o2.slice(1)];
      const s=run(v,o2);
      return s?{ops:o2,f:s.at(-1)}:null;
    });
    if(items.some(x=>!x)) continue;

    if(new Set(items.map(x=>x.f.k)).size<4) continue;
    items.forEach(x=>{x.zh=zh(x.f,v.zh);});
    if(new Set(items.map(x=>x.zh)).size<4) continue;
    cur=Object.assign({type:"mix",v,items,right:shuffle([0,1,2,3]),pairs:{},sel:null},o||{});
    phase="ask"; firstTry=true;
    renderMix(); renderAll();
    return;
  }
  return _startType0("chain",o||{});
}
function renderMix(){
  const c=cur;
  const L=c.items.map((x,i)=>{
    const p=c.pairs[i]!==undefined;
    return `<button class="mt ${c.sel===i?"sel":""} ${p?"paired c"+i:""}" onclick="xSel(${i})">${esc(x.f.k)}<small>${esc(x.f.r)}</small></button>`;
  }).join("");
  const R=c.right.map(ri=>{
    const li=Object.keys(c.pairs).find(k=>c.pairs[k]===ri);
    return `<button class="mt ${li!==undefined?"paired c"+li:""}" onclick="xPick(${ri})">${esc(c.items[ri].zh)}</button>`;
  }).join("");
  $("q").innerHTML=qHead("同词辨形："+c.v.k+"（"+c.v.zh+"）")+`
    <div class="muted">都是「${c.v.k}」变出来的，长得很像。先点左边的形式，再点右边对应的意思。</div>
    <div class="mgrid"><div>${L}</div><div>${R}</div></div>
    <div class="btns"><button class="btn main" ${Object.keys(c.pairs).length<4?"disabled":""} onclick="checkMix()">检查</button></div>`;
}
function xSel(i){if(phase!=="ask")return;cur.sel=i;renderMix();}
function xPick(ri){
  if(phase!=="ask"||cur.sel===null) return;
  for(const k in cur.pairs) if(cur.pairs[k]===ri) delete cur.pairs[k];
  cur.pairs[cur.sel]=ri; cur.sel=null;
  renderMix();
}

function checkMix(){
  if(phase!=="ask") return;
  const c=cur; let allOk=true; const rows=[];
  const vi=VERBS.indexOf(c.v);
  c.items.forEach((x,i)=>{
    const ok=c.pairs[i]===i;
    if(!ok){allOk=false;srsAdd({kind:"chain",vi,ops:x.ops,j:x.ops.length-1,cat:opCat(x.ops[x.ops.length-1])});}
    rows.push(`<tr><td>${fmt(x.f)}</td><td>${ok?"✓":"✗ "+esc(c.items[c.pairs[i]].zh)}</td><td>${esc(x.zh)}</td></tr>`);
  });
  const cheers=record(allOk,"mix");
  if(!allOk) cheers.push("连错的形式已加入复习计划。");
  save();
  finish(allOk,`<table><tr><th>形式</th><th>你的连线</th><th>正确意思</th></tr>${rows.join("")}</table>
    <div class="hint" style="margin-top:10px">动词类别：${CLS[c.v.t]}。一类动词的可能形是え段＋る，被动是あ段＋れる，使役是あ段＋せる，使役被动是あ段＋される（せられる）。</div>`,cheers);
}

async function ensureKey(){
  if(AIKEY||!cloud) return;
  try{
    const rs=await FB.getDoc(roomRef());
    if(rs.exists()&&rs.data().aiKey){AIKEY=rs.data().aiKey;try{localStorage.setItem("jp-aikey",AIKEY);}catch(e){}}
  }catch(e){console.error(e);}
}
async function geminiJSON(prompt){
  const body={contents:[{role:"user",parts:[{text:prompt}]}],generationConfig:{temperature:0.2,maxOutputTokens:1500,responseMimeType:"application/json"}};
  for(let i=aiModelIdx;i<AI_MODELS.length;i++){
    let res;
    try{
      res=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${AI_MODELS[i]}:generateContent`,{
        method:"POST",headers:{"Content-Type":"application/json","x-goog-api-key":AIKEY},body:JSON.stringify(body)});
    }catch(e){return null;}
    if(!res.ok){if([429,404,400].includes(res.status)||res.status>=500) continue;return null;}

    const d=await res.json();
    const c=d.candidates&&d.candidates[0];
    let t=c&&c.content&&c.content.parts?c.content.parts.map(p=>p.text||"").join(""):"";
    t=t.replace(/```json|```/g,"").trim();
    try{return JSON.parse(t);}catch(e){return null;}
  }
  return null;
}

function showWrite(id,o){
  cur=Object.assign({type:"write",id},o||{});
  phase="ask"; firstTry=true;
  const w=WRITEQ[id];
  $("q").innerHTML=qHead("看中文写整句")+`
    <div class="box"><div class="big">${esc(w.zh)}</div></div>
    <div class="row"><span class="lbl">要求</span>用日语写出整句，汉字或假名都可以。${AIKEY?"さくら先生会帮你批改。":""}</div>
    <div class="inputrow">
      <input type="text" id="ans" placeholder="在这里写日语句子" autocomplete="off" oninput="$('err').textContent=''">
      <button class="btn main" onclick="submitWrite()">提交</button>
    </div>
    <div class="err" id="err"></div>
    <button class="link" onclick="$('whint').classList.toggle('hidden')">看提示</button>
    <div class="hint hidden" id="whint">这句话要用到：${esc(w.g)}</div>`;
  bindEnter(submitWrite);
  renderAll();
}
async function submitWrite(){
  if(phase!=="ask") return;
  const raw=$("ans").value.trim();
  if(!raw){$("err").textContent="请先写句子";return;}
  const w=WRITEQ[cur.id];
  phase="grading";

  $("ans").disabled=true;
  let res=null;
  if(w.a.some(x=>norm(x)===norm(raw))) res={ok:true,score:5,corrected:w.a[0],comment:"和参考答案一致，非常好！"};
  else{
    $("err").style.color="var(--muted)";
    $("err").textContent="さくら先生批改中…";
    await ensureKey();
    if(AIKEY){
      const prompt=`你是日语老师。学习者要把中文翻译成日语。
中文：${w.zh}
参考答案：${w.a.join(" ／ ")}
学习者的回答：${raw}
请判断学习者的回答意思是否正确、语法是否正确、是否自然。参考答案只是参考，其他正确自然的说法也算对。
只用JSON回答，格式：{"score":0到5的整数,"ok":意思正确且没有语法错误时为true,"corrected":"修改后的自然日语句子","comment":"用中文简短说明错误或表扬，60字以内"}`;
      const j=await geminiJSON(prompt);
      if(j&&typeof j.ok==="boolean") res={ok:j.ok,score:j.score,corrected:j.corrected||w.a[0],comment:j.comment||""};
    }
  }
  $("err").textContent=""; $("err").style.color="";
  if(!res){
    phase="selfcheck";
    SPK=w.a[0];
    const r=$("res");
    r.innerHTML=`<div class="note">AI 暂时无法批改，请对照参考答案自己判断：</div>
      <div class="row">你的句子：「${esc(raw)}」</div>
      <div class="row">参考答案：「${esc(w.a.join(" ／ "))}」<button class="mini" onclick="speak(SPK)">朗读</button></div>
      <div class="btns"><button class="btn main" onclick="selfJudge(true)">我写对了</button><button class="btn" onclick="selfJudge(false)">有错误</button></div>`;
    r.classList.remove("hidden");
    cur.raw=raw;
    return;
  }
  phase="ask";

  const cheers=record(!!res.ok,"write");
  srsAfter({kind:"write",id:cur.id,cat:"write"},!!res.ok,cheers);
  save();
  SPK=res.corrected||w.a[0];
  finish(!!res.ok,`<div class="row">你的句子：「${esc(raw)}」</div>
    ${res.score!==undefined&&res.score!==null?`<div class="row score">${"★".repeat(Math.max(0,Math.min(5,res.score)))}${"☆".repeat(5-Math.max(0,Math.min(5,res.score)))}　${res.score}/5</div>`:""}
    <div class="row">更自然的说法：「${esc(res.corrected||w.a[0])}」<button class="mini" onclick="speak(SPK)">朗读</button></div>
    ${res.comment?`<div class="note">${esc(res.comment)}</div>`:""}
    <div class="muted">参考答案：${esc(w.a.join(" ／ "))}</div>`,cheers);
}
function selfJudge(ok){
  if(phase!=="selfcheck") return;
  phase="ask";
  const w=WRITEQ[cur.id];
  const cheers=record(ok,"write");
  srsAfter({kind:"write",id:cur.id,cat:"write"},ok,cheers);
  save();
  SPK=w.a[0];
  finish(ok,`<div class="row">你的句子：「${esc(cur.raw)}」</div>
    <div class="row">参考答案：「${esc(w.a.join(" ／ "))}」<button class="mini" onclick="speak(SPK)">朗读</button></div>`,cheers);
}

function showFix(id,o){
  cur=Object.assign({type:"fix",id},o||{});
  phase="ask"; firstTry=true;
  const f=FIXQ[id];
  $("q").innerHTML=qHead("改错题")+`
    <div class="box"><div class="big">${esc(f.s)}</div><div class="muted">${esc(f.zh)}</div></div>
    <div class="row"><span class="lbl">要求</span>句子里有一处错误，写出<b>改正后的那一部分</b>。</div>
    <div class="inputrow">
      <input type="text" id="ans" placeholder="只写改正后的部分" autocomplete="off" oninput="$('err').textContent=''">
      <button class="btn main" onclick="submitFix()">提交</button>

    </div>
    <div class="err" id="err"></div>
    <button class="link" onclick="$('fhint').classList.toggle('hidden')">看提示（错在哪里）</button>
    <div class="hint hidden" id="fhint">错误的部分是「${esc(f.w)}」</div>`;
  bindEnter(submitFix);
  renderAll();
}
function submitFix(){
  if(phase!=="ask") return;
  const val=norm($("ans").value);
  if(!val){$("err").textContent="请先输入答案";return;}
  const f=FIXQ[cur.id];
  const fixed=f.s.replace(f.w,f.a[0]);
  const ok=f.a.some(x=>norm(x)===val)||val===norm(fixed);
  const cheers=record(ok,"fix");
  srsAfter({kind:"fix",id:cur.id,cat:"fix"},ok,cheers);
  save();
  $("ans").disabled=true;
  SPK=fixed;
  finish(ok,`<div class="row">错误：「${esc(f.w)}」→ 正确：「${esc(f.a[0])}」</div>
    <div class="row">改正后：${esc(fixed)}<button class="mini" onclick="speak(SPK)">朗读</button></div>
    <div class="note">${esc(f.ex)}</div>`,cheers);
}

function showParse(o,verb,ops){
  let v=verb,ops0=ops;
  if(!v){
    const cu=Math.min(curUnit(),6),tpls=[];
    UNITS.forEach(u=>{if(u.id<=cu+1&&u.tpl) u.tpl.forEach(t=>{if(t.length>=2) tpls.push(t);});});
    v=pick(VERBS.filter(x=>x.t==="g"));
    ops0=tpls.length?pick(tpls).slice():genOps(v,2,4);
  }

  const steps=run(v,ops0);
  if(!steps||!steps.length) return showMix(o);
  const target=steps[steps.length-1];
  const opts=[{ops:ops0,ok:true}];
  const seen=new Set([target.k]);
  const tryAdd=vv=>{
    if(opts.length>=4) return;
    const s=run(v,vv);
    if(!s||!s.length) return;
    const k=s[s.length-1].k;
    if(seen.has(k)) return;
    seen.add(k); opts.push({ops:vv,ok:false});
  };
  variants(ops0).forEach(tryAdd);
  if(opts.length<4&&ops0.length>=1){
    const prefix=ops0.slice(0,-1);
    const st=prefix.length?run(v,prefix)[prefix.length-1]:base(v);
    allowed(st).forEach(op=>tryAdd([...prefix,op]));
  }
  cur=Object.assign({type:"parse",v,ops:ops0,target,opts:shuffle(opts)},o||{});
  phase="ask"; firstTry=true;
  const label=x=>`${v.k} ＋ ${x.ops.map(op=>OPS[op].label).join(" ＋ ")}`;
  $("q").innerHTML=qHead("反向辨认")+`
    <div class="box"><div class="muted">这个形式是怎么变来的？</div><div class="big">${fmt(target)}</div></div>`+
    cur.opts.map((x,i)=>`<button class="opt" data-i="${i}" onclick="answerParse(${i},this)">${esc(label(x))}</button>`).join("");
  renderAll();
}
function answerParse(i,el){
  if(phase!=="ask") return;
  const c=cur,ok=c.opts[i].ok;
  const ci=c.opts.findIndex(x=>x.ok);
  markChoice(ci,el,ok);

  const vi=VERBS.indexOf(c.v);
  const cheers=record(ok,"parse");
  srsAfter({kind:"parse",id:vi+":"+c.ops.join(","),vi,ops:c.ops,cat:"parse"},ok,cheers);
  save();
  const steps=run(c.v,c.ops);
  SPK=c.target.k;
  finish(ok,`<div class="row">「${fmt(c.target)}」＝ ${esc(zh(c.target,c.v.zh))}<button class="mini" onclick="speak(SPK)">朗读</button></div>
    <table><tr><th>步骤</th><th>形式</th></tr><tr><td>原形</td><td>${fmt(c.v)}</td></tr>
    ${steps.map(s=>`<tr><td>${OPS[s.op].label}</td><td>${fmt(s)}</td></tr>`).join("")}</table>`,cheers);
}

function showJlpt(id,o){
  cur=Object.assign({type:"jlpt",id},o||{});
  phase="ask"; firstTry=true;
  const q=JLPTQ[id];
  const order=shuffle(q.o.map((x,i)=>i));
  const qtxt=esc(q.q).replace("★",'<span class="star">★</span>');
  $("q").innerHTML=qHead(`JLPT仿真题（${q.lv}）· ${q.t==="g"?"文法形式の判断":"文の組み立て"}`)+`
    <div class="box"><div class="big">${qtxt}</div></div>
    <div class="muted">${q.t==="g"?"（　）に入る最もよいものを選んでください。":"４つの言葉を正しい順番に並べたとき、<span class=\"star\">★</span> に入るものはどれですか。"}</div>`+
    order.map(i=>`<button class="opt" data-i="${i}" onclick="answerJlpt(${i},this)">${esc(q.o[i])}</button>`).join("");
  renderAll();
}
function answerJlpt(i,el){
  if(phase!=="ask") return;
  const q=JLPTQ[cur.id],ok=i===q.a;
  markChoice(q.a,el,ok);
  const cheers=record(ok,"jlpt");
  srsAfter({kind:"jlpt",id:cur.id,cat:"jlpt"},ok,cheers);
  save();
  SPK=q.t==="g"?q.q.replace(/（[^）]*）$/,"").replace("（　）",q.o[q.a]):q.full;
  finish(ok,`<div class="row">正确答案：「${esc(q.o[q.a])}」</div>

    <div class="row">完整句子：${esc(SPK)}<button class="mini" onclick="speak(SPK)">朗读</button></div>
    <div class="muted">${esc(q.zh)}</div>
    <div class="note">${esc(q.ex)}</div>`,cheers);
}

const _startType0=window.startType;
window.startType=function(t,o){
  o=o||{};
  if(t==="mix"||t==="match") return showMix(o);
  if(t==="write") return showWrite(nextIdx("write",WRITEQ),o);
  if(t==="fix") return showFix(nextIdx("fix",FIXQ),o);
  if(t==="parse") return showParse(o);
  if(t==="jlpt") return showJlpt(nextIdx("jlpt",JLPTQ),o);
  return _startType0(t,o);
};
const CYCLE2=["chain","mix","jlpt","chain","fix","parse","conf","chain","fill","write","cls","weak"];
window.pickSmart=function(){
  const due=dueList();
  if(due.length) return {type:"review",item:due[0]};
  S.smartN=(S.smartN||0)+1;
  let t=CYCLE2[S.smartN%CYCLE2.length];
  if(t==="write"&&!AIKEY&&!cloud) t="fix";
  if(TYPES.includes(t)&&catMastered(t)&&Math.random()<0.6) t="chain";
  if(t==="weak"){
    const w=weakCats();
    if(w.length) return {type:"weak",cat:w[0]};
    t="chain";
  }
  return {type:t};
};
const _srsValid0=window.srsValid;
window.srsValid=function(e){

  if(e.kind==="fix") return !!FIXQ[e.id];
  if(e.kind==="jlpt") return !!JLPTQ[e.id];
  if(e.kind==="write") return !!WRITEQ[e.id];
  if(e.kind==="parse"){const v=VERBS[e.vi];return !!(v&&run(v,e.ops));}
  return _srsValid0(e);
};
const _startReview0=window.startReview;
window.startReview=function(it){
  const o={review:it};
  if(it.kind==="fix") return showFix(it.id,o);
  if(it.kind==="jlpt") return showJlpt(it.id,o);
  if(it.kind==="write") return showWrite(it.id,o);
  if(it.kind==="parse") return showParse(o,VERBS[it.vi],it.ops);
  return _startReview0(it);
};

function backupDownload(){
  const data={app:"nihongo",version:1,time:new Date().toISOString(),profiles:PROFILES,players:{}};
  PROFILES.forEach(p=>{data.players[p.id]=getData(p.id);});
  const blob=new Blob([JSON.stringify(data)],{type:"application/json"});
  const a=document.createElement("a");
  a.href=URL.createObjectURL(blob);
  a.download=`nihongo-backup-${today()}.json`;
  document.body.appendChild(a);
  a.click();
  setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},1000);
  $("bkmsg").textContent="已下载备份："+a.download;
}
async function backupRestore(input){
  const file=input.files[0];
  input.value="";
  if(!file) return;

  let data;
  try{data=JSON.parse(await file.text());}catch(e){alert("文件读取失败，不是有效的备份文件。");return;}
  if(!data||data.app!=="nihongo"||!data.players){alert("这不是练习册的备份文件。");return;}
  if(!confirm(`确定要用 ${String(data.time).slice(0,10)} 的备份恢复吗？现在两个人的记录会被备份里的内容替换。`)) return;
  for(const p of PROFILES){
    const d=data.players[p.id];
    if(!d) continue;
    const x=normalize(d);
    CACHE[p.id]=x;
    try{localStorage.setItem(KEYP+p.id,JSON.stringify(x));}catch(e){}
    if(cloud){
      try{await FB.setDoc(playerRef(p.id),{json:JSON.stringify(x),updated:Date.now(),dev:"restore-"+Date.now()});}
      catch(e){console.error(e);alert("云端恢复失败，请检查网络后再试。");return;}
    }
  }
  if(Array.isArray(data.profiles)){
    applyNames(data.profiles.map(p=>p.name));
    if(cloud){try{await FB.setDoc(roomRef(),{names:PROFILES.map(p=>p.name)},{merge:true});}catch(e){}}
  }
  S=readData(pid);
  $("bkmsg").textContent="恢复完成！";
  renderAll();
  newQuestion();
}
(function(){
  const el=document.createElement("div");
  el.className="card"; el.id="backup";
  el.innerHTML=`<h3 style="margin-top:0">数据备份</h3>
    <div class="muted">把两个人的全部记录（进度、错题、打卡、PK）下载成一个文件保存。万一数据出问题，可以用这个文件恢复。建议每周备份一次。</div>
    <div class="btns">
      <button class="btn main" onclick="backupDownload()">下载备份</button>
      <label class="btn" style="cursor:pointer">从备份恢复<input type="file" accept=".json,application/json" style="display:none" onchange="backupRestore(this)"></label>

    </div>
    <div class="muted" id="bkmsg"></div>`;
  $("main").appendChild(el);
})();
