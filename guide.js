const GUIDE={
  masu:{n:"ます形（礼貌体）",use:"礼貌地说现在或将来要做的事",scene:"对上司、客户、店员、不太熟的人说话；工作邮件",ex:["明日、銀行に行きます。","明天去银行。"]},
  masen:{n:"ません（礼貌否定）",use:"礼貌地说“不做、不会做”",scene:"拒绝别人、说明自己不做某事",ex:["お酒は飲みません。","我不喝酒。"]},
  mashita:{n:"ました（礼貌过去）",use:"礼貌地说“做了”",scene:"汇报已经完成的工作、讲昨天做的事",ex:["資料はもう送りました。","资料已经发了。"]},
  msd:{n:"ませんでした（礼貌过去否定）",use:"礼貌地说“那时没做”",scene:"说明过去没做成的事、道歉",ex:["昨日は会社に行きませんでした。","昨天没去公司。"]},
  mashou:{n:"ましょう（礼貌提议）",use:"邀请对方一起做",scene:"开会时说“开始吧”、约同事朋友",ex:["では、始めましょう。","那我们开始吧。"]},
  te:{n:"て形",use:"连接下一个动作；后面接〜てください、〜ています、〜てもいい等很多句型",scene:"请别人做事、按顺序讲几件事",ex:["少し待ってください。","请稍等。"]},
  ta:{n:"た形（普通体过去）",use:"和熟人说“做了”；〜たことがある（说经历）",scene:"和朋友家人聊天、写日记",ex:["昨日、映画を見た。","昨天看了电影。"]},
  nai:{n:"ない形（普通体否定）",use:"和熟人说“不做”；〜ないでください（请不要）",scene:"和朋友家人聊天、提醒别人别做某事",ex:["宿題を忘れないでね。","别忘了作业哦。"]},
  adjPast:{n:"なかった（普通体过去否定）",use:"和熟人说“那时没做”",scene:"和朋友家人聊天",ex:["昨日は何も食べなかった。","昨天什么都没吃。"]},
  adjTe:{n:"なくて",use:"〜なくてもいい（不必做）；也可以表示“因为没…”",scene:"告诉别人不用做某事",ex:["明日は来なくてもいいです。","明天不用来。"]},
  adjBa:{n:"なければ",use:"〜なければなりません＝必须做",scene:"说规定、截止日期、必须做的事",ex:["明日までに出さなければなりません。","明天之前必须交。"]},
  tara:{n:"たら（如果／…之后）",use:"“如果…”或“…之后”，后面可以接请求",scene:"“到了请联系我”“做完了告诉我”",ex:["駅に着いたら、電話してください。","到了车站请打电话。"]},
  ba:{n:"ば条件形",use:"“只要…就…”，强调条件",scene:"给别人建议、说规律",ex:["急げば間に合います。","快一点的话就来得及。"]},
  pot:{n:"可能形",use:"说“能、会做某事”",scene:"问别人能不能做、说自己会什么",ex:["日本語が少し話せます。","我会说一点日语。"]},
  pas:{n:"被动形",use:"说“被别人…”；在公司说上级的动作时，也可以表示尊敬",scene:"被表扬、被批评、被叫到；说上司、客户的行动",ex:["先生にほめられました。","被老师表扬了。"]},
  cau:{n:"使役形",use:"“让／叫别人做”，主语是让别人做的人；「〜させてください」是“请让我做”",scene:"父母让孩子、上司让下属、老师让学生；礼貌地请求许可（少し考えさせてください＝请让我考虑一下）",ex:["子どもに野菜を食べさせました。","让孩子吃了蔬菜。"]},
  cp:{n:"使役被动形",use:"“被逼着做”，自己不想做但被别人要求做",scene:"抱怨被上司要求加班、被父母逼着学习",ex:["母にピアノを習わされました。","被妈妈逼着学了钢琴。"]},
  vol:{n:"意向形",use:"和熟人说“…吧”；〜ようと思う（说自己的打算）",scene:"约朋友、说自己的计划",ex:["週末、公園に行こう。","周末去公园吧。"]},
  imp:{n:"命令形",use:"很强的命令语气",scene:"运动比赛加油、紧急情况、交通标志；日常对人很少用",ex:["頑張れ！","加油！"]},
  teiru:{n:"ている",use:"正在做的事，或者一直持续的状态",scene:"“正在开会”“住在东京”“门开着”",ex:["今、会議をしています。","现在正在开会。"]}
};
const GUIDE_X={
  give:{n:"授受动词（あげる／くれる／もらう）",use:"看“谁给谁”：别人给我用くれる，我给别人用あげる，我收到用もらう",scene:"说收到礼物、别人帮了你、你帮了别人",ex:["友だちがプレゼントをくれました。","朋友送了我礼物。"]},
  jidou:{n:"自动词＋ている（状态）",use:"东西现在处于某种状态，用「〜が＋自动词ている」",scene:"“门开着”“灯亮着”“店开着”",ex:["窓が開いています。","窗户开着。"]},
  younaru:{n:"〜ようになる",use:"能力或习惯慢慢发生了变化（变得能…、开始…了）",scene:"说自己的进步：变得能说日语了、会游泳了",ex:["日本語が話せるようになりました。","变得能说日语了。"]},
  relcl:{n:"动词修饰名词（连体形）",use:"动词原形可以直接放在名词前面修饰它，中间不加「の」",scene:"“回家的时候”“吃饭的地方”“明天要见的人”",ex:["帰る時、電話してください。","回去的时候请打电话。"]}
};
const FIX_META=[
  {v:"来る",ops:["pot","masu"]},
  {v:"見る",ops:["pot","masu"]},
  {v:"書く",ops:["cp","masu","mashita"]},

  {x:"jidou"},
  {v:"始める",ops:["masu","mashou"]},
  {x:"give"},
  {v:"会う",ops:["te"]},
  {v:"急ぐ",ops:["te"]},
  {v:"起きる",ops:["nai","adjBa"]},
  {x:null,g:"teiru",note:"「まだ〜ていません」＝到现在还没做"},
  {v:"行く",ops:["pas","masu"],note:"这里的「行かれます」是对上级的尊敬用法"},
  {v:"食べる",ops:["cau","masu","mashita"]},
  {v:"足りる",ops:["nai"]},
  {x:"relcl"},
  {x:"younaru"},
  {v:"着く",ops:["ta","tara"],plain:["着く","着いた","着いたら"]},
  {v:"走る",ops:["masu"]},
  {v:"返す",ops:["nai","adjBa"]}
];
const CORE_OPS=["cp","cau","pas","pot","teiru","tara","ba","vol","imp","te","ta","adjBa","adjTe","adjPast","nai","mashou","msd","mashita","masen","masu"];

document.head.insertAdjacentHTML("beforeend",`<style>
.guide{background:#f3f0fb;color:#3c3489;border-radius:10px;padding:12px 14px;margin:10px 0;font-size:15px;line-height:1.85}
.guide b{color:#534ab7}
.guide div{margin-top:3px}
</style>`);

function verbObj(k){
  if(!k) return null;
  return (typeof findVerb==="function"&&findVerb(k))||VERBS.find(v=>v.k===k)||null;
}
function primaryOp(ops){
  for(const o of CORE_OPS) if(ops.includes(o)) return o;
  return ops[ops.length-1];
}

function guideHTML(opt){
  const g=opt.x?GUIDE_X[opt.x]:GUIDE[opt.g||primaryOp(opt.ops||[])];
  if(!g) return "";
  let route="",names="";
  if(opt.ops&&opt.ops.length){
    names=opt.ops.map(o=>OPS[o]?OPS[o].label:o).join(" → ");
    if(opt.plain) route=opt.plain.join(" → ");
    else if(opt.v){
      const s=run(opt.v,opt.ops);
      if(s) route=[opt.v.k,...s.map(x=>x.k)].join(" → ");
    }
  }
  const polite=opt.ops&&opt.ops.includes("masu")?`<div class="muted">最后用了ます形，是礼貌的说法。</div>`:"";
  return `<div class="guide"><b>📗 正确答案是什么形态</b>
    <div><b>形态：</b>${esc(names||g.n)}</div>
    ${route?`<div><b>怎么变：</b>${esc(route)}</div>`:""}
    <div><b>什么时候用：</b>${esc(g.use)}${opt.note?"（"+esc(opt.note)+"）":""}</div>
    <div><b>常见情境：</b>${esc(g.scene)}</div>
    <div><b>例句：</b>${esc(g.ex[0])}（${esc(g.ex[1])}）</div>
    ${polite}</div>`;
}
function guideForCur(){
  try{
    if(!cur) return "";
    if(cur.type==="chain"&&chain) return guideHTML({v:chain.verb,ops:chain.ops.slice(0,j+1)});
    if(cur.type==="near"){
      if(cur.stage==="sent"&&cur.fol) return guideHTML({v:cur.v,ops:cur.fol.ops});
      return guideHTML({v:cur.v,ops:[cur.op]});
    }
    if(cur.type==="parse") return guideHTML({v:cur.v,ops:cur.ops});
    if(cur.type==="fill"){
      const f=FILL[cur.id];

      return guideHTML({g:f.c,ops:[f.c].filter(o=>GUIDE[o])});
    }
    if(cur.type==="fix"){
      const m=FIX_META[cur.id];
      if(!m) return "";
      if(m.x) return guideHTML({x:m.x});
      if(m.g) return guideHTML({g:m.g,note:m.note});
      return guideHTML({v:verbObj(m.v),ops:m.ops,note:m.note,plain:m.plain});
    }
  }catch(e){console.error(e);}
  return "";
}

const _finishBeforeGuide=window.finish;
window.finish=function(ok,body,cheers){
  const g=guideForCur();
  let b=body;
  if(g){
    const mark=b.indexOf('<details class="more">');
    b=mark>=0?b.slice(0,mark)+g+b.slice(mark):g+b;
  }
  _finishBeforeGuide(ok,b,cheers);
};

if(typeof geminiText==="function"){
  const _geminiTextBeforeClean=window.geminiText;
  window.geminiText=async function(p){
    const t=await _geminiTextBeforeClean(p);
    if(!t) return t;
    return t.replace(/\*\*/g,"").replace(/^#+\s*/gm,"")
      .split("\n").filter(l=>!/^[\s\)\]）:：*\-—]*$/.test(l)).join("\n").trim();
  };

}
