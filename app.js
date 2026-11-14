const $=id=>document.getElementById(id);
const ROW={"う":"わいうえお","く":"かきくけこ","ぐ":"がぎぐげご","す":"さしすせそ","つ":"たちつてと","ぬ":"なにぬねの","ぶ":"ばびぶべぼ","む":"まみむめも","る":"らりるれろ"};
const VOICE=["pot","pas","cau","cp","cpS"];
const row=(f,i)=>ROW[f.k.slice(-1)][i];
const cut=(f,n,add,t)=>({k:f.k.slice(0,f.k.length-n)+add,r:f.r.slice(0,f.r.length-n)+add,t});
function gTe(f,ta){
  const ch=f.k.slice(-1);
  const m={"う":"っ","つ":"っ","る":"っ","む":"ん","ぶ":"ん","ぬ":"ん","く":"い","ぐ":"い","す":"し"};
  let s=m[ch],v=["む","ぶ","ぬ","ぐ"].includes(ch);
  if(f.k==="行く"){s="っ";v=false;}
  return s+(v?(ta?"だ":"で"):(ta?"た":"て"));
}
function V(f,g,i,s,k,t){
  if(f.t==="g") return cut(f,1,g(f),t);
  if(f.t==="i") return cut(f,1,i,t);
  if(f.t==="s") return cut(f,2,s,t);
  return {k:"来"+k[1],r:k[0]+k[1],t};
}
const OPS={
  pot:{label:"可能形",fn:f=>V(f,f=>row(f,3)+"る","られる","できる",["こ","られる"],"i")},
  pas:{label:"被动形",fn:f=>V(f,f=>row(f,0)+"れる","られる","される",["こ","られる"],"i")},
  cau:{label:"使役形",fn:f=>V(f,f=>row(f,0)+"せる","させる","させる",["こ","させる"],"i")},
  cp:{label:"使役被动形",fn:f=>V(f,f=>row(f,0)+"せられる","させられる","させられる",["こ","させられる"],"i")},
  cpS:{label:"使役被动形（短）",fn:f=>V(f,f=>row(f,0)+"される","させられる","させられる",["こ","させられる"],"i")},
  nai:{label:"否定形（ない）",fn:f=>V(f,f=>row(f,0)+"ない","ない","しない",["こ","ない"],"adj")},
  masu:{label:"ます形",fn:f=>V(f,f=>row(f,1)+"ます","ます","します",["き","ます"],"masu")},
  te:{label:"て形",fn:f=>V(f,f=>gTe(f,false),"て","して",["き","て"],"end")},
  ta:{label:"た形（过去）",fn:f=>V(f,f=>gTe(f,true),"た","した",["き","た"],"ta")},
  ba:{label:"ば条件形",fn:f=>V(f,f=>row(f,3)+"ば","れば","すれば",["く","れば"],"end")},
  vol:{label:"意向形",fn:f=>V(f,f=>row(f,4)+"う","よう","しよう",["こ","よう"],"end")},
  imp:{label:"命令形",fn:f=>V(f,f=>row(f,3),"ろ","しろ",["こ","い"],"end")},
  teiru:{label:"ている形",fn:f=>{const x=OPS.te.fn(f);return {k:x.k+"いる",r:x.r+"いる",t:"i"};}},

  adjPast:{label:"过去否定（なかった）",fn:f=>cut(f,1,"かった","ta")},
  adjTe:{label:"なくて形",fn:f=>cut(f,1,"くて","end")},
  adjBa:{label:"なければ（ば条件）",fn:f=>cut(f,1,"ければ","end")},
  tara:{label:"たら条件形",fn:f=>cut(f,0,"ら","end")},
  masen:{label:"礼貌否定（ません）",fn:f=>cut(f,1,"せん","masen")},
  mashita:{label:"礼貌过去（ました）",fn:f=>cut(f,1,"した","end")},
  mashou:{label:"礼貌意向（ましょう）",fn:f=>cut(f,1,"しょう","end")},
  msd:{label:"礼貌过去否定（ませんでした）",fn:f=>cut(f,0,"でした","end")}
};
const CATN={masu:"ます形",te:"て形",ta:"た形",nai:"ない形",pot:"可能形",pas:"被动形",cau:"使役形",cp:"使役被动形",ba:"ば条件形",tara:"たら条件形",vol:"意向形",imp:"命令形",teiru:"ている形",adjPast:"なかった",adjTe:"なくて",adjBa:"なければ",masen:"ません",mashita:"ました",mashou:"ましょう",msd:"ませんでした",cls:"动词分类",conf:"易混淆辨析",fill:"句子填空",match:"连线"};
const TYPES=["cls","conf","fill","match"];
const opCat=op=>op==="cpS"?"cp":op;

function allowed(st){
  if(["g","i","s","k"].includes(st.t)){
    if(st.voice||st.teiru) return ["nai","masu","te","ta","ba"];
    return ["pot","pas","cau","cp","nai","masu","te","ta","ba","vol","imp","teiru"];
  }
  return ({adj:["adjPast","adjTe","adjBa"],ta:["tara"],masu:["masen","mashita","mashou"],masen:["msd"]})[st.t]||[];
}
const base=v=>({k:v.k,r:v.r,t:v.t,voice:null,teiru:false,fl:{}});
function run(verb,ops){
  let st=base(verb);
  const steps=[];
  for(const op of ops){
    if(!OPS[op]||!allowed(st).includes(op==="cpS"?"cp":op)) return null;
    const x=OPS[op].fn(st);
    const fl={...st.fl};
    if(op==="nai"||op==="masen") fl.neg=true;
    if(["ta","adjPast","mashita","msd"].includes(op)) fl.past=true;
    if(op==="masu"||op==="masen") fl.pol=true;
    if(["tara","ba","adjBa"].includes(op)) fl.cond=true;

    if(op==="te"||op==="adjTe") fl.te=true;
    if(op==="vol") fl.vol=true;
    if(op==="imp") fl.imp=true;
    if(op==="mashou") fl.mashou=true;
    st={k:x.k,r:x.r,t:x.t,voice:VOICE.includes(op)?(op==="cpS"?"cp":op):st.voice,teiru:st.teiru||op==="teiru",fl,op};
    steps.push(st);
  }
  return steps;
}
function zh(st,vzh){
  const v=vzh||chain.verb.zh, fl=st.fl||{};
  const core={pas:"被"+v,cau:"让人"+v,cp:"被迫"+v}[st.voice]||v;
  let s;
  if(st.voice==="pot") s=fl.neg?(fl.past?"没能":"不能")+v:"能"+v+(fl.past?"了":"");
  else if(st.teiru) s=fl.neg?(fl.past?"当时还没":"还没")+core:(fl.past?"当时正在／已经":"正在／已经")+core;
  else s=fl.neg?(fl.past?"没有":"不")+core:core+(fl.past?"了":"");
  if(fl.cond) s="如果"+s;
  if(fl.te) s+="（て形，连接下文）";
  if(fl.vol) s="打算"+s+"／"+s+"吧";
  if(fl.imp) s+="！（命令）";
  if(fl.mashou) s="一起"+s+"吧";
  if(fl.pol&&!fl.mashou) s+="（礼貌）";
  return s;
}

const fmtDate=d=>d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
const today=()=>fmtDate(new Date());
function dayDiff(a,b){const p=s=>{const [y,m,d]=s.split("-").map(Number);return new Date(y,m-1,d);};return Math.round((p(b)-p(a))/864e5);}
const md=s=>{const [y,m,d]=s.split("-").map(Number);return m+"/"+d;};
function addDays(s,n){const [y,m,d]=s.split("-").map(Number);return fmtDate(new Date(y,m-1,d+n));}
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const pick=a=>a[Math.floor(Math.random()*a.length)];

const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const k=Math.floor(Math.random()*(i+1));[a[i],a[k]]=[a[k],a[i]];}return a;};
function wpick(a,w){const s=w.reduce((x,y)=>x+y,0);let r=Math.random()*s;for(let i=0;i<a.length;i++){r-=w[i];if(r<=0)return a[i];}return a[a.length-1];}
const norm=s=>s.trim().replace(/[\s。．.、，,「」]/g,"");
const fmt=f=>f.k===f.r?f.k:f.k+"（"+f.r+"）";
const findVerb=k=>[...VERBS,...TRAPS].find(v=>v.k===k);
const blankify=q=>esc(q).replace("＿＿",'<span class="blank">　？　</span>');

const OFFS=[1,3,7,10,21];
function srsKeyOf(it){return it.kind+"|"+(it.kind==="chain"?it.vi+"|"+it.ops.join()+"|"+it.j:it.id);}

const KEYP="jp-book-";
let PROFILES=null;
try{PROFILES=JSON.parse(localStorage.getItem("jp-profiles"));}catch(e){}
if(!PROFILES) PROFILES=[{id:"yueyue",name:"yueyue小朋友"},{id:"jiejie",name:"姐姐"}];
const storeProfiles=()=>{try{localStorage.setItem("jp-profiles",JSON.stringify(PROFILES));}catch(e){}};
let pid="jiejie";
try{pid=localStorage.getItem("jp-current")||"jiejie";}catch(e){}
if(!PROFILES.some(p=>p.id===pid)) pid=PROFILES[0].id;

let setup=true;
let room="",cloud=false,connectedRoom="",syncState="local",started=false;
try{room=localStorage.getItem("jp-room")||"";}catch(e){}
let DEVICE="";
try{DEVICE=localStorage.getItem("jp-device")||"";if(!DEVICE){DEVICE=Math.random().toString(36).slice(2);localStorage.setItem("jp-device",DEVICE);}}catch(e){DEVICE=Math.random().toString(36).slice(2);}
const CACHE={};

const fresh=()=>({n:1,total:0,correct:0,streak:0,best:0,wrong:[],units:{},start:today(),days:{},daysOk:{},checkins:{},course:0,goal:20,srs:[],cat:{},mastered:0,smartN:0});
function normalize(d){
  const x=Object.assign(fresh(),d||{});
  if(!x.checkins) x.checkins={};
  if(!x.daysOk) x.daysOk={};
  if(!x.goal) x.goal=20;

  if(!Array.isArray(x.srs)) x.srs=[];
  if(!x.cat) x.cat={};
  if(!x.mastered) x.mastered=0;
  UNITS.forEach(u=>{if(!x.units[u.id]) x.units[u.id]={done:0,ok:0,recent:[],passed:false};});
  if(Array.isArray(x.wrong)&&x.wrong.length){
    x.wrong.forEach(w=>{
      if(!VERBS[w.vi]) return;
      const it={kind:"chain",vi:w.vi,ops:w.ops,j:w.j,cat:opCat(w.ops[w.j])};
      const k=srsKeyOf(it);
      if(!x.srs.some(e=>e.key===k)) x.srs.push({...it,key:k,stage:0,wrong:today(),due:today()});
    });
    x.wrong=[];
  }
  return x;
}
function readLocal(id){
  let d=null;
  try{d=JSON.parse(localStorage.getItem(KEYP+id));}catch(e){}
  if(!d&&id==="jiejie"){try{d=JSON.parse(localStorage.getItem("jp-course-v1"));}catch(e){}}
  return normalize(d);
}
const readData=id=>(cloud&&CACHE[id])?CACHE[id]:readLocal(id);
let S=readLocal(pid);
const getData=id=>id===pid?S:readData(id);

const roomRef=()=>FB.doc(FB.db,"rooms",room);
const playerRef=id=>FB.doc(FB.db,"rooms",room,"players",id);
let saveTimer=null;
function save(){
  try{localStorage.setItem(KEYP+pid,JSON.stringify(S));localStorage.setItem("jp-current",pid);}catch(e){}
  if(cloud){
    CACHE[pid]=S;

    clearTimeout(saveTimer);
    syncState="saving"; renderSync();
    saveTimer=setTimeout(pushCloud,800);
  }
}
function pushCloud(){
  FB.setDoc(playerRef(pid),{json:JSON.stringify(S),updated:Date.now(),dev:DEVICE})
    .then(()=>{syncState="ok";renderSync();})
    .catch(e=>{console.error(e);syncState="fail";renderSync();});
}
function applyNames(n){
  if(!Array.isArray(n)) return;
  n.forEach((x,i)=>{if(PROFILES[i]&&x) PROFILES[i].name=x;});
  storeProfiles();
}
async function connectCloud(){
  try{
    const rs=await FB.getDoc(roomRef());
    if(rs.exists()) applyNames(rs.data().names);
    for(const p of PROFILES){
      const ps=await FB.getDoc(playerRef(p.id));
      if(ps.exists()) CACHE[p.id]=normalize(JSON.parse(ps.data().json));
      else{
        const loc=readLocal(p.id);
        CACHE[p.id]=loc;
        if(loc.total>0) await FB.setDoc(playerRef(p.id),{json:JSON.stringify(loc),updated:Date.now(),dev:DEVICE});
      }
    }
    cloud=true; connectedRoom=room; syncState="ok";
    S=CACHE[pid];
    FB.onSnapshot(roomRef(),snap=>{
      if(!snap.exists()) return;

      applyNames(snap.data().names);
      if(!setup){renderHeader();renderPK();}
    });
    PROFILES.forEach(p=>FB.onSnapshot(playerRef(p.id),snap=>{
      if(!snap.exists()||snap.metadata.hasPendingWrites) return;
      const v=snap.data();
      if(v.dev===DEVICE) return;
      CACHE[p.id]=normalize(JSON.parse(v.json));
      if(p.id===pid) S=CACHE[p.id];
      if(!setup){
        renderPK();
        if(p.id===pid){renderDash();renderTabs();renderMastery();renderCal();renderUnits();renderPlan();}
      }
    }));
  }catch(e){
    console.error(e);
    cloud=false; syncState="fail";
  }
}

const acc=U=>U.recent.length?U.recent.reduce((a,b)=>a+b,0)/U.recent.length:0;
const curUnit=()=>{const u=UNITS.find(u=>!S.units[u.id].passed);return u?u.id:7;};
const nameOf=id=>PROFILES.find(p=>p.id===id).name;
const pname=()=>nameOf(pid);
const otherId=()=>PROFILES.find(p=>p.id!==pid).id;
function plan(){const p=[];UNITS.forEach(u=>{for(let i=0;i<Math.ceil(u.total/S.goal);i++)p.push(u.id);});p.push("R","R");return p;}

function srsValid(e){
  if(e.kind==="chain"){const v=VERBS[e.vi];if(!v)return false;const s=run(v,e.ops);return !!(s&&e.j<s.length);}
  if(e.kind==="conf") return !!CONF[e.id];
  if(e.kind==="fill") return !!FILL[e.id];
  if(e.kind==="cls") return !!findVerb(e.id);

  return false;
}
function dueList(){const t=today();return S.srs.filter(e=>e.due<=t&&srsValid(e)).sort((a,b)=>a.due<b.due?-1:a.due>b.due?1:0);}
function srsAdd(it){
  const k=srsKeyOf(it), t=today();
  const e=S.srs.find(x=>x.key===k);
  if(e){e.stage=0;e.wrong=t;e.due=addDays(t,1);}
  else S.srs.push({...it,key:k,stage:0,wrong:t,due:addDays(t,1)});
}
function srsHit(key){
  const e=S.srs.find(x=>x.key===key);
  if(!e) return null;
  const t=today();
  if(e.due>t) return "early";
  e.stage++;
  if(e.stage>=OFFS.length){S.srs=S.srs.filter(x=>x!==e);S.mastered++;return "done";}
  let nd=addDays(e.wrong,OFFS[e.stage]);
  const min=addDays(t,1);
  if(nd<min) nd=min;
  e.due=nd;
  return "next";
}

function catHit(c,ok){
  if(!c) return;
  const e=S.cat[c]||(S.cat[c]={n:0,ok:0,r:[]});
  e.n++; if(ok) e.ok++;
  e.r.push(ok?1:0); e.r=e.r.slice(-20);
}
const catAcc=c=>{const e=S.cat[c];return e&&e.r.length?e.r.reduce((a,b)=>a+b,0)/e.r.length:null;};
const catMastered=c=>{const e=S.cat[c];return !!(e&&e.n>=15&&catAcc(c)>=0.9);};
function weakCats(){return Object.keys(S.cat).filter(c=>S.cat[c].r.length>=5&&catAcc(c)<0.7).sort((a,b)=>catAcc(a)-catAcc(b));}


let chain=null,j=0,phase="none",firstTry=true,mode="smart",selUnit=1,level=2,justPassed=false,lastOk=false,reviewIdx=0,reviewEarly=false,cur={type:"none"},SPK="";

function speak(text){
  if(!window.speechSynthesis){alert("这个浏览器不支持朗读");return;}
  speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(text);
  u.lang="ja-JP"; u.rate=0.9;
  speechSynthesis.speak(u);
}
function speakEx(i){speak(chain.verb.ex[i].ja);}

function setTitle(){
  const t=`${PROFILES[0].name}和${PROFILES[1].name}的练习册`;
  $("title").textContent=t;
  document.title=t;
}

function showLogin(stage,msg){
  setup=true; phase="none";
  setTitle();
  $("main").classList.add("hidden");
  const el=$("setup");
  el.classList.remove("hidden");
  let h="";
  if(stage==="pwd"){
    h=`<h3 style="margin-top:0">请输入密码</h3>
      <div class="muted">两个人用同一个密码（8位以上，只用字母和数字）。第一次使用时输入一个新密码，就会创建你们的专属空间。</div>
      <label>密码</label>
      <input type="password" id="pwd" autocomplete="current-password">
      <label style="display:flex;align-items:center;gap:6px"><input type="checkbox" id="rem" checked> 在这台设备上记住密码</label>
      <div class="err" id="perr">${msg||""}</div>

      <div class="btns"><button class="btn main" onclick="submitPwd()">进入</button></div>`;
  } else if(stage==="names"){
    const isNew=!cloud&&!!window.FB;
    h=`<h3 style="margin-top:0">${isNew?"创建新的空间":"修改名字"}</h3>
      ${isNew?`<div class="note">没有找到这个密码对应的空间。如果你们以前已经设置过，请点「返回」检查密码；如果是第一次使用，写下两个人的名字就会创建。</div>`:""}
      <label>选手1</label><input type="text" id="n1" value="${esc(PROFILES[0].name)}">
      <label>选手2</label><input type="text" id="n2" value="${esc(PROFILES[1].name)}">
      <div class="err" id="serr"></div>
      <div class="btns">
        <button class="btn main" onclick="saveRoomNames()">${isNew?"创建":"保存"}</button>
        <button class="btn" onclick="${isNew?"showLogin('pwd')":"showLogin('who')"}">返回</button>
      </div>`;
  } else {
    const status=window.FB?(cloud?"☁ 已连接云端，记录永久保存，换设备也不会丢":"⚠ 云端没有连接，记录只保存在这台设备上"):"记录只保存在这台设备上";
    h=`<h3 style="margin-top:0">你是谁？</h3>
      ${PROFILES.map((p,i)=>`<button class="whobtn w${i}" onclick="chooseWho('${p.id}')">${esc(p.name)}</button>`).join("")}
      <div class="muted">${status}</div>
      <div class="btns">
        <button class="link" onclick="showLogin('names')">修改名字</button>
        ${window.FB?`<button class="link" onclick="logout()">退出密码</button>`:""}
      </div>`;
  }
  el.innerHTML=h;
  const f=$("pwd");
  if(f) f.focus();
}

async function submitPwd(){
  const v=$("pwd").value.trim();
  const perr=$("perr");
  if(!/^[A-Za-z0-9_-]{8,40}$/.test(v)){perr.textContent="密码要8位以上，只能用字母和数字";return;}
  const remember=$("rem").checked;

  if(cloud&&connectedRoom&&v!==connectedRoom){
    try{localStorage.setItem("jp-room",v);}catch(e){}
    location.reload(); return;
  }
  room=v;
  perr.style.color="var(--muted)"; perr.textContent="连接中…";
  try{
    const rs=await FB.getDoc(roomRef());
    try{ if(remember) localStorage.setItem("jp-room",room); else localStorage.removeItem("jp-room"); }catch(e){}
    if(rs.exists()&&Array.isArray(rs.data().names)){
      applyNames(rs.data().names);
      if(!cloud) await connectCloud();
      if(!cloud){perr.style.color="";perr.textContent="连接失败，请检查网络后再试。";return;}
      showLogin("who");
    } else showLogin("names");
  }catch(e){
    console.error(e);
    perr.style.color=""; perr.textContent="连接失败，请检查网络后再试。";
  }
}

async function saveRoomNames(){
  const a=$("n1").value.trim(), b=$("n2").value.trim();
  const serr=$("serr");
  if(!a||!b){serr.textContent="两个名字都要写哦";return;}
  if(a===b){serr.textContent="两个名字不能一样";return;}
  PROFILES[0].name=a.slice(0,12); PROFILES[1].name=b.slice(0,12);
  storeProfiles();
  if(window.FB&&room){
    try{await FB.setDoc(roomRef(),{names:[PROFILES[0].name,PROFILES[1].name],updated:Date.now()},{merge:true});}
    catch(e){console.error(e);serr.textContent="保存失败，请检查网络后再试。";return;}
    if(!cloud) await connectCloud();

  }
  showLogin("who");
}

function logout(){
  try{localStorage.removeItem("jp-room");}catch(e){}
  location.reload();
}

function chooseWho(id){
  pid=id;
  S=readData(pid);
  setup=false;
  $("setup").classList.add("hidden");
  $("main").classList.remove("hidden");
  mode="smart"; reviewIdx=0; reviewEarly=false; justPassed=false;
  selUnit=Math.min(curUnit(),6);
  save();
  newQuestion();
  window.scrollTo(0,0);
}

function genOps(verb,mn,mx){
  const L=mn+Math.floor(Math.random()*(mx-mn+1));
  const ops=[];
  for(let i=0;i<L;i++){
    const cur0=ops.length?run(verb,ops).at(-1):base(verb);
    let c=allowed(cur0);
    if(!c.length) break;
    if(i===0&&Math.random()<0.5) c=c.filter(o=>VOICE.includes(o));
    if(L-i>1){
      const c2=c.filter(o=>{const s=run(verb,[...ops,o]);return s&&allowed(s.at(-1)).length>0;});

      if(c2.length) c=c2;
    }
    ops.push(pick(c));
  }
  return ops;
}
function build(verb,ops){
  let alt=null;
  if(ops[0]==="cp"&&verb.t==="g"&&verb.k.slice(-1)!=="す") alt=run(verb,["cpS",...ops.slice(1)]);
  return {verb,ops,steps:run(verb,ops),alt};
}
function pickTpl(u){
  const weak=weakCats();
  const w=u.tpl.map(t=>{const c=opCat(t[t.length-1]);return catMastered(c)?0.25:(weak.includes(c)?2:1);});
  return wpick(u.tpl,w).slice();
}
function unitOps(verb){
  const u=UNITS[selUnit-1];
  return u.tpl?pickTpl(u):genOps(verb,4,6);
}
function weakOps(c){
  const cu=Math.min(curUnit(),6), res=[];
  UNITS.forEach(u=>{
    if(u.id>cu+1||!u.tpl) return;
    u.tpl.forEach(t=>{const cs=t.map(opCat);const i=cs.indexOf(c);if(i>=0) res.push(t.slice(0,i+1));});
  });
  if(res.length) return pick(res);
  if(OPS[c]&&allowed(base(VERBS[0])).includes(c)) return [c];
  return null;
}
function poolByUnit(arr){
  const cu=Math.min(curUnit(),6);

  const idx=arr.map((x,i)=>i).filter(i=>arr[i].u<=cu+1);
  return idx.length>=5?idx:arr.map((x,i)=>i);
}

const CYCLE=["chain","match","chain","conf","fill","chain","cls","weak"];
function pickSmart(){
  const due=dueList();
  if(due.length) return {type:"review",item:due[0]};
  S.smartN=(S.smartN||0)+1;
  let t=CYCLE[S.smartN%CYCLE.length];
  if(TYPES.includes(t)&&catMastered(t)&&Math.random()<0.6) t="chain";
  if(t==="weak"){
    const w=weakCats();
    if(w.length) return {type:"weak",cat:w[0]};
    t="chain";
  }
  return {type:t};
}
function startItem(p){
  if(p.type==="review") return startReview(p.item);
  if(p.type==="weak"){
    const c=p.cat;
    if(TYPES.includes(c)) return startType(c,{weak:c});
    const ops=weakOps(c);
    if(ops) return startChain(pick(VERBS),ops,{weak:c,tip:c});
    return startType("chain",{});
  }
  return startType(p.type,{});
}
function startType(t,o){
  if(t==="match") return showMatch(o);
  if(t==="conf") return showConf(pick(poolByUnit(CONF)),o);

  if(t==="fill") return showFill(pick(poolByUnit(FILL)),o);
  if(t==="cls") return showCls(o);
  const v=pick(VERBS);
  return startChain(v,unitOps(v),Object.assign({unit:selUnit},o));
}
function startChain(verb,ops,o){
  chain=build(verb,ops);
  j=(o&&o.j)||0;
  cur=Object.assign({type:"chain"},o||{});
  showChain();
}
function startReview(it){
  const o={review:it};
  if(it.kind==="chain"){
    chain=build(VERBS[it.vi],it.ops);
    j=it.j;
    cur={type:"chain",review:it};
    return showChain();
  }
  if(it.kind==="conf") return showConf(it.id,o);
  if(it.kind==="fill") return showFill(it.id,o);
  if(it.kind==="cls") return showCls(o,findVerb(it.id));
}

function newQuestion(){
  $("res").classList.add("hidden");
  if(mode==="tips") return showTips();
  if(mode==="smart") return startItem(pickSmart());
  if(mode==="review"){
    const list=reviewEarly?S.srs.filter(srsValid).sort((a,b)=>a.due<b.due?-1:1):dueList();
    if(!list.length) return showReviewEmpty();
    return startReview(reviewEarly?list[reviewIdx%list.length]:list[0]);

  }
  const v=pick(VERBS);
  if(mode==="course") return startChain(v,unitOps(v),{unit:selUnit});
  const [mn,mx]=({1:[2,3],2:[3,4],3:[4,6]})[level];
  return startChain(v,genOps(v,mn,mx),{});
}

function next(){
  S.n++; save();
  if(cur.type==="chain"&&!cur.review&&!justPassed&&j<chain.steps.length-1){j++;showChain();return;}
  if(justPassed){justPassed=false;selUnit=Math.min(curUnit(),6);}
  if(mode==="review"&&reviewEarly) reviewIdx++;
  newQuestion();
}
function retry(){
  phase="ask";
  const input=$("ans");
  input.disabled=false; input.value=""; input.focus();
  $("res").classList.add("hidden");
}

function topLabel(){
  if(cur.review) return `🔁 复习 · 第 ${cur.review.stage+1}/5 轮（第一次错在 ${md(cur.review.wrong)}）`;
  if(cur.weak) return `⚡ 薄弱点特训：${CATN[cur.weak]||cur.weak}`;
  if(cur.unit){
    const u=UNITS[cur.unit-1],U=S.units[cur.unit];
    return U.done<u.total?`单元${u.id}「${u.name}」 · 第 ${U.done+1}/${u.total} 题`:`单元${u.id}「${u.name}」 · 巩固练习（最近20题正确率 ${Math.round(acc(U)*100)}%）`;
  }
  return mode==="smart"?"智能练习":"自由练习";
}
const qHead=title=>`<div class="qtop">${esc(pname())} 正在答题 · ${topLabel()}</div><div class="qhead">第${S.n}题｜${title}</div>`;


function record(ok,cats){
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
  const oid=otherId(),oc=getData(oid).days[d]||0;
  if(oc>0&&before<=oc&&before+1>oc) cheers.push(`你超过了${esc(nameOf(oid))}！今天暂时领先！`);
  else if(oc>0&&before+1===oc) cheers.push(`追平了${esc(nameOf(oid))}！再做一题就领先了！`);
  if(mode==="smart"||mode==="course") S.course++;
  [].concat(cats).forEach(c=>catHit(c,ok));
  return cheers;
}
function unitHit(ok,cheers){
  const u=UNITS[cur.unit-1],U=S.units[cur.unit];
  U.done++; if(ok) U.ok++;
  U.recent.push(ok?1:0); U.recent=U.recent.slice(-20);
  if(!U.passed&&U.done>=u.total){
    if(acc(U)>=0.8){
      U.passed=true; justPassed=true;
      const nx=UNITS[cur.unit];
      cheers.push(`恭喜通过单元${u.id}「${u.name}」！`+(nx?`已解锁单元${nx.id}「${nx.name}」（${nx.lv}）。`:"全部6个单元都完成了，太厉害了！"));
    } else if(U.done===u.total){
      cheers.push(`单元${u.id}的${u.total}题做完了！最近20题正确率 ${Math.round(acc(U)*100)}%，再巩固几题达到80%就能过关。`);
    }
  }
}

function srsAfter(item,ok,cheers){
  const key=srsKeyOf(item);
  if(cur.review){
    if(ok){
      const r=srsHit(key);
      if(r==="done") cheers.push("这道题经过5轮复习，已经彻底掌握！以后不会再出了。");
      else if(r==="next"){const e=S.srs.find(x=>x.key===key);cheers.push(`复习通过！下次复习：${md(e.due)}`);}
      else if(r==="early"){const e=S.srs.find(x=>x.key===key);if(e) cheers.push(`提前复习答对了，按原计划 ${md(e.due)} 再复习。`);}
    } else {
      srsAdd(item);
      cheers.push("这次复习没答对，会从明天开始重新安排复习。");
    }
  } else if(!ok){
    srsAdd(item);
    cheers.push("已加入复习计划：明天、第3天、第7天、第10天、第21天各复习一次。");
  }
}
function nextLabel(){
  if(justPassed) return "进入下一单元";
  if(cur.type==="chain"&&!cur.review&&j<chain.steps.length-1) return "下一题（再加一步）";
  return "下一题";
}
function finish(ok,body,cheers){
  firstTry=false; lastOk=ok; phase=ok?"done":"wrong";
  let h=ok?`<div class="ok-h">第${S.n}题：完全正确！</div><div class="praise">${pick(PRAISE)}</div>`
          :`<div class="ng-h">第${S.n}题：还差一点</div><div class="comfort">${pick(COMFORT)}</div>`;
  cheers.forEach(c=>{h+=`<div class="celebrate">${c}</div>`;});
  h+=body;
  const canRetry=!ok&&(cur.type==="chain"||cur.type==="fill");
  h+=`<div class="btns">${canRetry?'<button class="btn" onclick="retry()">再试一次</button>':""}<button class="btn main" onclick="next()">${nextLabel()}</button></div>`;
  const r=$("res");
  r.innerHTML=h;

  r.classList.remove("hidden");
  renderAll();
}

function showChain(){
  phase="ask"; firstTry=true;
  const {verb,steps}=chain,t=steps[j],known=j?steps[j-1]:null;
  const s=Math.min(5,j+1);
  $("res").classList.add("hidden");
  $("q").innerHTML=qHead(OPS[t.op].label)+`
    <div class="muted">难度：${"★".repeat(s)+"☆".repeat(5-s)}　本动词第 ${j+1}/${steps.length} 步</div>
    ${cur.tip?`<div class="hint">技巧：${HINT[cur.tip]||HINT[t.op]||""}</div>`:""}
    <div class="box"><div class="muted">指定动词原形</div><div class="big">${fmt(verb)}</div><div>${verb.zh}</div></div>
    <div class="row"><span class="lbl">目标</span>${esc(zh(t))}</div>
    <div class="row"><span class="lbl">已知</span>${known?`${fmt(known)} ＝ ${esc(zh(known))}`:`原形 ${fmt(verb)}`}</div>
    <div class="row"><span class="lbl">要求</span>在已知形式的基础上变成「${OPS[t.op].label}」。写标准完整形式，不使用ら抜き言葉，只写一个动词。</div>
    <div class="inputrow">
      <input type="text" id="ans" placeholder="汉字或假名都可以" autocomplete="off" oninput="$('err').textContent=''">
      <button class="btn main" onclick="submitChain()">提交</button>
    </div>
    <div class="err" id="err"></div>
    ${cur.tip?"":`<button class="link" onclick="$('hint').classList.toggle('hidden')">看提示</button><div class="hint hidden" id="hint">${HINT[t.op]||""}</div>`}`;
  $("ans").focus();
  renderAll();
}

function variants(pre){
  const vIdx=pre.findIndex(o=>VOICE.includes(o));
  const rest=vIdx>=0?pre.filter((o,i)=>i!==vIdx):pre.slice();
  const list=[rest,["pot",...rest],["pas",...rest],["cau",...rest],["cp",...rest]];
  if(vIdx<0) list.push(["teiru",...rest]);
  return list.filter(v=>v.join()!==pre.join());

}
function lastOf(ops){
  if(!ops.length) return {...base(chain.verb),op:null};
  const s=run(chain.verb,ops);
  return s?s.at(-1):null;
}
const routeLabel=ops=>ops.length?ops.map(o=>OPS[o].label).join(" → "):"原形";
function diagnose(val){
  const {verb,steps}=chain,t=steps[j],pre=chain.ops.slice(0,j+1);
  if(["i","k"].includes(verb.t)&&t.voice==="pot"){
    if(val===t.k.replace("られ","れ")||val===t.r.replace("られ","れ"))
      return "这是「ら抜き言葉」（漏掉了「ら」）。口语里常听到，但标准形式要保留「られ」。";
  }
  for(let i=0;i<j;i++){
    if(val===steps[i].k||val===steps[i].r)
      return `你写到「${OPS[steps[i].op].label}」就停了，还差后面的「${OPS[t.op].label}」。`;
  }
  if(val===verb.k||val===verb.r) return "你写的是原形，还没有变形。";
  for(const v of variants(pre)){
    const l=lastOf(v);
    if(l&&(val===l.k||val===l.r))
      return `你写的是「${routeLabel(v)}」，意思是“${esc(zh(l))}”。本题要的是“${esc(zh(t))}”。`;
  }
  return "形式不对。对照下面的变形路线，找出是哪一步出了问题。";
}
function compareRows(){
  const pre=chain.ops.slice(0,j+1);
  const vIdx=pre.findIndex(o=>VOICE.includes(o));
  const rest=vIdx>=0?pre.filter((o,i)=>i!==vIdx):pre.slice();
  const cand=[pre,rest,["pot",...rest],["pas",...rest]];
  if(vIdx<0) cand.push(["teiru",...rest]);
  const seen=new Set(),rows=[];

  for(const v of cand){
    const l=lastOf(v);
    if(!l||seen.has(l.k)) continue;
    seen.add(l.k);
    rows.push({cur:v===pre,zh:zh(l),f:l});
  }
  return rows;
}
function chainDetail(val,ok){
  const {verb,steps,alt}=chain,t=steps[j];
  SPK=t.k;
  let h=`<div class="row">你的答案：「${esc(val)}」</div>
    <div class="row">正确答案：「${fmt(t)}」<button class="mini" onclick="speak(SPK)">朗读</button></div>`;
  if(alt) h+=`<div class="muted">也可以说「${fmt(alt[j])}」（使役被动的短形式，口语常用）</div>`;
  if(!ok) h+=`<div class="diag">${diagnose(val)}</div>`;
  h+=`<h3>一、完整变形路线</h3><div class="muted">动词类别：${CLS[verb.t]}</div>
    <table><tr><th>步骤</th><th>形式</th><th>意思</th></tr>
    <tr><td>原形</td><td>${fmt(verb)}</td><td>${verb.zh}</td></tr>`;
  for(let i=0;i<=j;i++){
    const s=steps[i];
    h+=`<tr class="${i===j?"cur":""}"><td>${OPS[s.op].label}</td><td>${fmt(s)}</td><td>${esc(zh(s))}</td></tr>`;
  }
  h+=`</table>`;
  const rows=compareRows();
  if(rows.length>=2){
    h+=`<h3>二、相似形式的区别</h3><table><tr><th>中文</th><th>日语</th><th></th></tr>`;
    rows.forEach(r=>{h+=`<tr class="${r.cur?"cur":""}"><td>${esc(r.zh)}</td><td>${fmt(r.f)}</td><td>${r.cur?"本题":""}</td></tr>`;});
    h+=`</table>`;
  }
  if(["i","k"].includes(verb.t)&&(t.voice==="pot"||t.voice==="pas"))
    h+=`<div class="note">注意：二类动词和「来る」的可能形与被动形同形（都是〜られる），实际交流时要看上下文判断。</div>`;
  if(verb.ex&&verb.ex.length){

    h+=`<h3>三、应用场景（「${verb.k}」在实际中的用法）</h3>`;
    verb.ex.forEach((e,i)=>{
      h+=`<div class="ex"><span class="lv">${e.s}</span> <span class="exja">${e.ja}</span><button class="mini" onclick="speakEx(${i})">朗读</button><div class="muted">${e.zh}</div></div>`;
    });
  }
  return h;
}
function submitChain(){
  if(phase!=="ask") return;
  const input=$("ans");
  const val=norm(input.value);
  if(!val){$("err").textContent="请先输入答案";return;}
  const {verb,steps,alt}=chain,t=steps[j];
  const accepted=[t.k,t.r];
  if(alt) accepted.push(alt[j].k,alt[j].r);
  const ok=accepted.includes(val);
  let cheers=[];
  if(firstTry){
    cheers=record(ok,opCat(t.op));
    if(cur.unit) unitHit(ok,cheers);
    srsAfter({kind:"chain",vi:VERBS.indexOf(verb),ops:chain.ops,j,cat:opCat(t.op)},ok,cheers);
    save();
  }
  input.disabled=true;
  finish(ok,chainDetail(val,ok),cheers);
}

function showConf(id,o){
  cur=Object.assign({type:"conf",id},o||{});
  phase="ask"; firstTry=true;
  const c=CONF[id];
  const order=shuffle(c.o.map((x,i)=>i));

  $("q").innerHTML=qHead("易混淆辨析")+`
    <div class="box"><div class="big">${blankify(c.q)}</div><div class="muted">${c.zh}</div></div>
    <div class="muted">选出正确的一项：</div>`+
    order.map(i=>`<button class="opt" data-i="${i}" onclick="answerConf(${i},this)">${esc(c.o[i])}</button>`).join("");
  renderAll();
}
function answerConf(i,el){
  if(phase!=="ask") return;
  const c=CONF[cur.id],ok=i===c.a;
  document.querySelectorAll(".opt").forEach(b=>{b.disabled=true;if(+b.dataset.i===c.a) b.classList.add("right");});
  if(!ok) el.classList.add("wrong");
  const cheers=record(ok,"conf");
  srsAfter({kind:"conf",id:cur.id,cat:"conf"},ok,cheers);
  save();
  SPK=c.q.replace(/（[^）]*）/g,"").replace("＿＿",c.o[c.a]);
  finish(ok,`<div class="row">正确答案：「${esc(c.o[c.a])}」</div>
    <div class="row">完整句子：${esc(SPK)}<button class="mini" onclick="speak(SPK)">朗读</button></div>
    <div class="note">${c.ex}</div>`,cheers);
}

function showCls(o,v){
  const verb=v||(Math.random()<0.5?pick(TRAPS):pick(VERBS));
  cur=Object.assign({type:"cls",verb},o||{});
  phase="ask"; firstTry=true;
  $("q").innerHTML=qHead("动词分类")+`
    <div class="box"><div class="muted">这个动词是几类？</div><div class="big">${fmt(verb)}</div><div>${verb.zh}</div></div>`+
    [["g","一类（五段）"],["i","二类（一段）"],["s","三类（不规则）"]].map(([t,l])=>`<button class="opt" data-t="${t}" onclick="answerCls('${t}',this)">${l}</button>`).join("");
  renderAll();
}
function clsReason(v){
  if(v.t==="s"||v.t==="k") return "三类只有「する」「来る」和「〜する」动词，需要单独记。";
  const pre=v.r.slice(-2,-1);

  const ie="いきしちにひみりぎじびぴえけせてねへめれげぜべぺ";
  if(v.t==="i") return `以「る」结尾，「る」前面的「${pre}」是い段或え段，所以是二类。`;
  if(v.r.slice(-1)==="る"&&ie.includes(pre)) return `虽然「る」前面的「${pre}」是い段或え段，看起来像二类，但「${v.k}」是例外，属于一类。要专门记的例外：帰る・入る・走る・知る・切る・要る・減る・喋る。`;
  return "结尾不是「い段／え段＋る」，所以是一类（五段）。";
}
function answerCls(t,el){
  if(phase!=="ask") return;
  const v=cur.verb, vt=v.t==="k"?"s":v.t, ok=t===vt;
  document.querySelectorAll(".opt").forEach(b=>{b.disabled=true;if(b.dataset.t===vt) b.classList.add("right");});
  if(!ok) el.classList.add("wrong");
  const cheers=record(ok,"cls");
  srsAfter({kind:"cls",id:v.k,cat:"cls"},ok,cheers);
  save();
  finish(ok,`<div class="row">「${fmt(v)}」是 <b>${CLS[v.t]}</b></div><div class="note">${clsReason(v)}</div>`,cheers);
}

function showFill(id,o){
  cur=Object.assign({type:"fill",id},o||{});
  phase="ask"; firstTry=true;
  const f=FILL[id];
  $("q").innerHTML=qHead("句子填空")+`
    <div class="box"><div class="big">${blankify(f.b)}</div><div class="muted">${f.zh}</div></div>
    <div class="row"><span class="lbl">提示</span>用「${f.v}」的「${f.f}」</div>
    <div class="inputrow">
      <input type="text" id="ans" placeholder="只填空格里的部分" autocomplete="off" oninput="$('err').textContent=''">
      <button class="btn main" onclick="submitFill()">提交</button>
    </div>
    <div class="err" id="err"></div>`;
  $("ans").focus();
  renderAll();
}
function submitFill(){

  if(phase!=="ask") return;
  const input=$("ans");
  const val=norm(input.value);
  if(!val){$("err").textContent="请先输入答案";return;}
  const f=FILL[cur.id],ok=f.a.includes(val);
  let cheers=[];
  if(firstTry){
    cheers=record(ok,[f.c,"fill"]);
    srsAfter({kind:"fill",id:cur.id,cat:f.c},ok,cheers);
    save();
  }
  input.disabled=true;
  SPK=f.b.replace("＿＿",f.a[0]);
  const kana=f.a.find(x=>/^[ぁ-ゖー]+$/.test(x));
  finish(ok,`<div class="row">你的答案：「${esc(val)}」</div>
    <div class="row">正确答案：「${f.a[0]}」${kana?`（${kana}）`:""}</div>
    ${f.a.length>2?`<div class="muted">也可以：${f.a[1]}</div>`:""}
    <div class="row">完整句子：${esc(SPK)}<button class="mini" onclick="speak(SPK)">朗读</button></div>
    ${!ok?`<div class="hint">技巧：${HINT[f.c]||""}</div>`:""}`,cheers);
}

const MATCH_OPS={1:["masu","te","ta","nai"],2:["masu","te","ta","nai"],3:["pot","te","ta","nai","masu"],4:["pot","ba","vol","imp","te"],5:["pas","cau","pot","ba","vol"],6:["pas","cau","cp","pot","ba","vol","imp"]};
function showMatch(o){
  const cu=Math.min(curUnit(),6);
  const op=pick(MATCH_OPS[cu]);
  const items=[],seen=new Set();
  for(const v of shuffle(VERBS)){
    const f=OPS[op].fn(base(v));
    if(seen.has(f.k)) continue;
    seen.add(f.k); items.push({v,f});
    if(items.length===4) break;
  }

  cur=Object.assign({type:"match",op,items,right:shuffle([0,1,2,3]),pairs:{},sel:null},o||{});
  phase="ask"; firstTry=true;
  renderMatch();
  renderAll();
}
function renderMatch(){
  const c=cur;
  const L=c.items.map((x,i)=>{
    const p=c.pairs[i]!==undefined;
    return `<button class="mt ${c.sel===i?"sel":""} ${p?"paired c"+i:""}" onclick="mSel(${i})">${esc(x.v.k)} <span class="muted">${x.v.zh}</span></button>`;
  }).join("");
  const R=c.right.map(ri=>{
    const li=Object.keys(c.pairs).find(k=>c.pairs[k]===ri);
    return `<button class="mt ${li!==undefined?"paired c"+li:""}" onclick="mPick(${ri})">${esc(c.items[ri].f.k)}</button>`;
  }).join("");
  $("q").innerHTML=qHead("连线："+OPS[c.op].label)+`
    <div class="muted">先点左边的动词，再点右边对应的「${OPS[c.op].label}」。连错了可以重新点。</div>
    <div class="mgrid"><div>${L}</div><div>${R}</div></div>
    <div class="btns"><button class="btn main" ${Object.keys(c.pairs).length<4?"disabled":""} onclick="checkMatch()">检查</button></div>`;
}
function mSel(i){if(phase!=="ask")return;cur.sel=i;renderMatch();}
function mPick(ri){
  if(phase!=="ask"||cur.sel===null) return;
  for(const k in cur.pairs) if(cur.pairs[k]===ri) delete cur.pairs[k];
  cur.pairs[cur.sel]=ri; cur.sel=null;
  renderMatch();
}
function checkMatch(){
  if(phase!=="ask") return;
  const c=cur; let allOk=true; const rows=[];
  c.items.forEach((x,i)=>{
    const ok=c.pairs[i]===i;

    if(!ok){allOk=false;srsAdd({kind:"chain",vi:VERBS.indexOf(x.v),ops:[c.op],j:0,cat:opCat(c.op)});}
    rows.push(`<tr><td>${x.v.k}</td><td>${ok?"✓":"✗ "+esc(c.items[c.pairs[i]].f.k)}</td><td>${fmt(x.f)}</td></tr>`);
  });
  const cheers=record(allOk,[opCat(c.op),"match"]);
  if(!allOk) cheers.push("连错的动词已加入复习计划。");
  save();
  finish(allOk,`<table><tr><th>动词</th><th>你的连线</th><th>正确答案</th></tr>${rows.join("")}</table>
    <div class="hint" style="margin-top:10px">技巧：${HINT[c.op]}</div>`,cheers);
}

function showTips(){
  phase="none"; cur={type:"none"};
  $("q").innerHTML=`<h3 style="margin-top:0">技巧手册</h3>`+
    TIPS.map(t=>`<details class="tip"><summary>${t.t}</summary><div class="tipb">${t.b}</div></details>`).join("")+
    `<h3>各种变形的规则</h3>`+
    Object.keys(HINT).map(k=>`<details class="tip"><summary>${OPS[k].label}</summary><div class="tipb">${HINT[k]}</div></details>`).join("");
  renderAll();
}
function showReviewEmpty(){
  phase="none"; cur={type:"none"};
  $("q").innerHTML=`<div class="ok-h">今天没有到期的复习题！</div>
    <p>复习计划里还有 ${S.srs.length} 题，会在到期那天自动出现。</p>
    <div class="btns">
      ${S.srs.length?`<button class="btn" onclick="reviewEarly=true;reviewIdx=0;newQuestion()">提前复习</button>`:""}
      <button class="btn main" onclick="setMode('smart')">去智能练习</button>
    </div>`;
  renderAll();
}

function setMode(m){
  mode=m; reviewIdx=0; reviewEarly=false; justPassed=false;
  if(m==="course"||m==="smart") selUnit=Math.min(curUnit(),6);

  newQuestion();
}
function selectUnit(id){mode="course";selUnit=id;justPassed=false;newQuestion();}
function setLevel(v){level=+v;newQuestion();}
function setGoal(v){
  S.goal=+v;
  const d=today();
  if((S.days[d]||0)>=S.goal) S.checkins[d]=true;
  save(); renderAll();
}
function checkinStreak(){
  const d=new Date();
  if(!S.checkins[fmtDate(d)]) d.setDate(d.getDate()-1);
  let k=0;
  while(S.checkins[fmtDate(d)]){k++;d.setDate(d.getDate()-1);}
  return k;
}

function renderSync(){
  const el=$("sync");
  if(!el) return;
  const m={local:"本机保存",saving:"☁ 同步中…",ok:"☁ 已同步",fail:"⚠ 云端同步失败（已存在本机）"};
  el.textContent=m[syncState];
  el.className="sync"+(syncState==="fail"?" fail":"");
}
function renderHeader(){
  setTitle();
  $("profiles").innerHTML=`<span class="muted">现在是：</span><b>${esc(pname())}</b>
    <button class="link" style="margin:0 6px" onclick="showLogin('who')">切换身份</button>
    <span id="sync"></span>`;
  $("greet").textContent=`${pname()}，我是最棒的，今天也加油呀！`;
  renderSync();

}
function winner(a,b){
  if(a.c!==b.c) return a.c>b.c?0:1;
  if(a.ok!==b.ok) return a.ok>b.ok?0:1;
  return -1;
}
function renderPK(){
  const t=today();
  const D=PROFILES.map(p=>getData(p.id));
  const now=D.map((d,i)=>({name:PROFILES[i].name,c:d.days[t]||0,ok:d.daysOk[t]||0}));
  const max=Math.max(1,...now.map(x=>x.c));
  const w=winner(now[0],now[1]);
  let msg;
  if(now[0].c===0&&now[1].c===0) msg="今天的PK还没开始，谁先来？";
  else if(w===-1) msg="目前平手！再加把劲！";
  else msg=`${esc(now[w].name)} 暂时领先${now[w].c!==now[1-w].c?` ${now[w].c-now[1-w].c} 题`:"（答对数更多）"}！`;
  let h=`<h3 style="margin-top:0">今日PK（${md(t)}）${cloud?'<span class="muted">　实时同步中</span>':""}</h3>`;
  now.forEach((x,i)=>{
    h+=`<div class="pkrow"><div class="pkname"><span>${w===i?'<span class="crown">♛ </span>':""}${esc(x.name)}</span><span>${x.c} 题（答对 ${x.ok}）</span></div>
      <div class="pkbar"><div class="p${i}" style="width:${x.c/max*100}%"></div></div></div>`;
  });
  h+=`<div class="pkmsg">${msg}</div>`;
  const dates=new Set();
  D.forEach(d=>Object.keys(d.days).forEach(k=>{if(k!==t&&d.days[k]>0) dates.add(k);}));
  const list=[...dates].sort().reverse();
  const wins=[0,0,0];
  const rows=list.map(k=>{
    const a={c:D[0].days[k]||0,ok:D[0].daysOk[k]||0},b={c:D[1].days[k]||0,ok:D[1].daysOk[k]||0};
    const r=winner(a,b);
    wins[r===-1?2:r]++;
    return {k,a,b,r};
  });

  h+=`<h3>历史战绩</h3><div class="muted">${esc(PROFILES[0].name)} 胜 ${wins[0]} 场 ｜ ${esc(PROFILES[1].name)} 胜 ${wins[1]} 场 ｜ 平局 ${wins[2]} 场</div>`;
  if(rows.length){
    h+=`<table style="margin-top:8px"><tr><th>日期</th><th>${esc(PROFILES[0].name)}</th><th>${esc(PROFILES[1].name)}</th><th>结果</th></tr>`;
    rows.slice(0,14).forEach(x=>{
      h+=`<tr><td>${md(x.k)}</td><td>${x.a.c}（对${x.a.ok}）</td><td>${x.b.c}（对${x.b.ok}）</td><td>${x.r===-1?"平局":"♛ "+esc(PROFILES[x.r].name)}</td></tr>`;
    });
    h+=`</table>`;
  } else h+=`<div class="muted" style="margin-top:6px">从明天开始，每天的PK结果都会记录在这里。</div>`;
  h+=`<div class="muted" style="margin-top:8px">规则：比当天刷题数（每题只算第一次作答），题数一样比答对数。每天0点开始新一轮，以前的结果永久保存在战绩里。</div>`;
  $("pk").innerHTML=h;
}
function renderDash(){
  const P=plan(),t=today(),tc=S.days[t]||0,g=S.goal;
  const cal=Math.min(P.length,dayDiff(S.start,t)+1);
  const prog=Math.floor(S.course/g)+1;
  const dayNow=Math.min(prog,P.length);
  const ahead=dayNow-cal;
  const pct=S.total?Math.round(S.correct/S.total*100):0;
  let msg;
  if(prog>P.length) msg=`${P.length}天计划全部完成！接下来用复习和自由练习保持手感。`;
  else if(tc===0) msg=`今天还没开始。${g}题大约${Math.round(g*0.8)}分钟，先做5题热热身也很好。`;
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
        <div class="dash-big">${Math.min(tc,g)} / ${g} 题${tc>g?`<span class="muted">　＋超前 ${tc-g} 题</span>`:""}</div></div>
      <div class="muted" style="text-align:right">每日目标
        <select onchange="setGoal(this.value)">${[10,15,20,30].map(x=>`<option value="${x}" ${x===g?"selected":""}>${x}题</option>`).join("")}</select>
        <br>总正确率 ${pct}% ｜ 最佳连对 ${S.best}</div>
    </div>
    <div class="barw"><div style="width:${Math.min(100,tc/g*100)}%"></div></div>
    <div class="muted">按日历：计划第 ${cal} 天　｜　按完成量：第 ${dayNow} 天（${planTxt}）</div>
    <div class="task">📋 今日任务：到期复习 <b>${due}</b> 题（智能练习会先出）${weak.length?`　｜　薄弱点：<b>${weak.join("、")}</b>（会优先特训）`:""}</div>
    <div class="cheer">${msg}</div>`;
}
function renderTabs(){
  const due=dueList().length;
  const tabs=[["smart","智能练习"],["course","课程"],["review",`复习（${due}）`],["tips","技巧手册"],["free","自由练习"]];
  $("tabs").innerHTML=tabs.map(([m,l])=>`<button class="tab ${mode===m?"on":""}" onclick="setMode('${m}')">${l}</button>`).join("")+
    (mode==="free"?`<select onchange="setLevel(this.value)">
      <option value="1" ${level===1?"selected":""}>入门（2～3步）</option>
      <option value="2" ${level===2?"selected":""}>标准（3～4步）</option>
      <option value="3" ${level===3?"selected":""}>挑战（4～6步）</option></select>`:"");
}
function renderMastery(){
  const keys=Object.keys(S.cat).filter(k=>S.cat[k].r.length>0).sort((a,b)=>catAcc(a)-catAcc(b));
  let h=`<h3 style="margin-top:0">${esc(pname())}的熟练度</h3>
    <div class="muted">复习计划中 ${S.srs.length} 题 ｜ 今天到期 ${dueList().length} 题 ｜ 已彻底掌握 ${S.mastered} 题</div>`;
  if(!keys.length) h+=`<div class="muted" style="margin-top:8px">做几题之后，这里会显示每种题型的熟练度。</div>`;
  else h+=keys.map(k=>{
    const a=catAcc(k),e=S.cat[k];
    const st=e.r.length<5?["练习中","mid"]:(a>=0.9&&e.n>=15)?["已熟练 ✓","good"]:a<0.7?["薄弱 ⚠","bad"]:["良好","mid"];
    return `<div class="mrow"><div>${CATN[k]||k}</div><div class="mbar"><div class="${st[1]}" style="width:${Math.round(a*100)}%"></div></div><div class="mst ${st[1]}">${st[0]}</div><div class="muted">${Math.round(a*100)}% · ${e.n}题</div></div>`;
  }).join("");
  h+=`<div class="muted" style="margin-top:8px">薄弱＝最近正确率低于70%，会优先特训；已熟练＝做过15题以上并且最近正确率90%以上，之后会少出。</div>`;

  $("mastery").innerHTML=h;
}
function renderCal(){
  const cells=[];
  const d=new Date();
  d.setDate(d.getDate()-27);
  for(let i=0;i<28;i++){
    const key=fmtDate(d),c=S.days[key]||0,done=!!S.checkins[key];
    const cls=done?"done":c?"part":"";
    cells.push(`<div class="cell ${cls} ${i===27?"today":""}" title="${key}：${c}题"><div>${d.getMonth()+1}/${d.getDate()}</div><b>${done?"✓":c?c:""}</b></div>`);
    d.setDate(d.getDate()+1);
  }
  $("cal").innerHTML=`<h3 style="margin-top:0">${esc(pname())}的打卡记录</h3>
    <div class="muted">累计打卡 ${Object.keys(S.checkins).length} 天 ｜ 连续打卡 ${checkinStreak()} 天 ｜ 深绿✓＝完成当天目标，浅绿数字＝做了几题</div>
    <div class="cal">${cells.join("")}</div>`;
}
function renderUnits(){
  const cu=curUnit();
  $("units").innerHTML=`<h3 style="margin-top:0">${esc(pname())}的课程单元</h3>`+UNITS.map(u=>{
    const U=S.units[u.id],lock=u.id>cu;
    const st=U.passed?"✓ 已通过":lock?"未解锁":"进行中";
    const a=U.recent.length?Math.round(acc(U)*100)+"%":"—";
    return `<div class="unit ${lock?"lock":""} ${mode==="course"&&selUnit===u.id?"sel":""}" ${lock?"":`onclick="selectUnit(${u.id})"`}>
      <div><b>单元${u.id} ${u.name}</b><span class="lv">${u.lv}</span><div class="muted">${u.desc}</div></div>
      <div class="ur"><div>${Math.min(U.done,u.total)}/${u.total}</div><div class="muted">${st} · 近20题 ${a}</div></div>
    </div>`;
  }).join("")+`<div class="muted">过关条件：单元题数做满，并且最近20题正确率达到80%。智能练习里的变形题也会算进单元进度。</div>`;
}
function renderPlan(){
  const P=plan(),t=today(),cal=Math.min(P.length,dayDiff(S.start,t)+1),prog=Math.floor(S.course/S.goal)+1;
  let h=`<details><summary>查看${esc(pname())}的${P.length}天学习计划（每天${S.goal}题）</summary><table><tr><th>天</th><th>内容</th><th>状态</th></tr>`;
  P.forEach((p,i)=>{

    const d=i+1;
    const name=p==="R"?"总复习（复习＋自由练习）":`单元${p} ${UNITS[p-1].name}（${UNITS[p-1].lv}）`;
    let st=d<prog?"✓ 完成":d===prog?"← 你在这里":"";
    if(d===cal) st+=(st?" ":"")+"（今天）";
    h+=`<tr class="${d===prog?"cur":""}"><td>第${d}天</td><td>${name}</td><td>${st}</td></tr>`;
  });
  h+=`</table><div class="muted" style="margin-top:8px">可以超前做，计划会按完成量往前推。改每日目标后，计划天数会自动调整。</div></details>`;
  $("plan").innerHTML=h;
}
function renderAll(){
  if(setup) return;
  renderHeader();renderDash();renderTabs();renderPK();renderMastery();renderCal();renderUnits();renderPlan();
}

document.addEventListener("keydown",e=>{
  if(e.key!=="Enter"||e.isComposing) return;
  if(setup){
    if(document.activeElement&&document.activeElement.id==="pwd") submitPwd();
    return;
  }
  if(phase==="ask"){
    if(cur.type==="chain") submitChain();
    else if(cur.type==="fill") submitFill();
  } else if(phase==="done") next();
});

async function start(){
  if(started) return;
  started=true;
  if(!window.FB){showLogin("who");return;}
  if(room){
    await connectCloud();

    if(cloud){showLogin("who");return;}
  }
  showLogin("pwd");
}
window.addEventListener("fb-ready",start);
setTimeout(()=>{if(!started){if(window.FB===undefined) window.FB=null;start();}},8000);
