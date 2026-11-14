document.head.insertAdjacentHTML("beforeend",`<style>
.setup input.pinin{letter-spacing:12px;text-align:center;font-size:28px;max-width:220px;display:block}
</style>`);

let PINS={};
const pinOk=v=>/^\d{4}$/.test(v);
const remKey=id=>"jp-pinok-"+(room||"local")+"-"+id;

async function pinHash(id,pin){
  const buf=await crypto.subtle.digest("SHA-256",new TextEncoder().encode((room||"local")+"|"+id+"|"+pin));
  return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,"0")).join("");
}
async function loadPins(){
  if(cloud){
    try{const rs=await FB.getDoc(roomRef());return (rs.exists()&&rs.data().pins)||{};}
    catch(e){console.error(e);return null;}
  }
  try{return JSON.parse(localStorage.getItem("jp-pins"))||{};}catch(e){return {};}
}
async function savePin(id,h){
  if(cloud){await FB.setDoc(roomRef(),{pins:{[id]:h}},{merge:true});return;}
  const p=(await loadPins())||{};
  p[id]=h;
  localStorage.setItem("jp-pins",JSON.stringify(p));
}
function rememberMe(id,h){
  try{
    const cb=$("pinrem");
    if(cb&&cb.checked) localStorage.setItem(remKey(id),h);
    else localStorage.removeItem(remKey(id));
  }catch(e){}
}
function pinErr(t){const e=$("pinerr");if(e) e.textContent=t;}

const _origChoose=window.chooseWho;
window.chooseWho=async function(id){
  const p=await loadPins();
  if(p===null){alert("连接失败，请检查网络后再试。");return;}
  PINS=p;
  let r="";
  try{r=localStorage.getItem(remKey(id))||"";}catch(e){}
  if(PINS[id]&&r===PINS[id]) return _origChoose(id);
  showPin(id,PINS[id]?"enter":"create");
};

function showPin(id,stage){
  const name=esc(nameOf(id));
  const rem=`<label style="display:flex;align-items:center;gap:6px"><input type="checkbox" id="pinrem"> 在这台设备上记住我（自己的手机可以勾选）</label>`;
  const box=(i,ph)=>`<input type="password" id="${i}" class="pinin" inputmode="numeric" maxlength="4" autocomplete="off" placeholder="${ph||""}">`;
  let h;
  if(stage==="enter"){
    h=`<h3 style="margin-top:0">${name}，请输入你的4位密码</h3>
      ${box("pin1")}
      ${rem}
      <div class="err" id="pinerr"></div>
      <div class="btns">
        <button class="btn main" onclick="pinEnter('${id}')">进入</button>
        <button class="btn" onclick="showLogin('who')">返回</button>
        <button class="link" onclick="showPin('${id}','change')">修改密码</button>
      </div>`;
  } else if(stage==="create"){
    h=`<h3 style="margin-top:0">第一次使用：为 ${name} 设置4位数字密码</h3>
      <div class="muted">设置后，每次选「${name}」都要输入这个密码，别人就不能用你的名字刷题了。</div>
      <label>输入4位数字</label>${box("pin1")}
      <label>再输入一次</label>${box("pin2")}
      ${rem}
      <div class="err" id="pinerr"></div>
      <div class="btns">
        <button class="btn main" onclick="pinCreate('${id}')">设置并进入</button>
        <button class="btn" onclick="showLogin('who')">返回</button>
      </div>`;
  } else {
    h=`<h3 style="margin-top:0">修改 ${name} 的密码</h3>
      <label>旧密码</label>${box("pin0")}
      <label>新密码（4位数字）</label>${box("pin1")}
      <label>再输入一次新密码</label>${box("pin2")}
      ${rem}
      <div class="err" id="pinerr"></div>
      <div class="btns">
        <button class="btn main" onclick="pinChange('${id}')">保存并进入</button>
        <button class="btn" onclick="showPin('${id}','enter')">返回</button>
      </div>`;
  }
  $("setup").innerHTML=h;
  const first=$(stage==="change"?"pin0":"pin1");
  if(first) first.focus();
  $("setup").querySelectorAll(".pinin").forEach(el=>el.addEventListener("keydown",e=>{
    if(e.key!=="Enter"||e.isComposing) return;
    e.preventDefault();
    if(stage==="enter") pinEnter(id);
    else if(stage==="create") pinCreate(id);
    else pinChange(id);
  }));
}

async function pinEnter(id){
  const v=$("pin1").value.trim();
  if(!pinOk(v)){pinErr("请输入4位数字");return;}
  const h=await pinHash(id,v);
  if(h!==PINS[id]){$("pin1").value="";pinErr("密码不对，再试一次。");return;}
  rememberMe(id,h);
  _origChoose(id);
}
async function pinCreate(id){
  const a=$("pin1").value.trim(),b=$("pin2").value.trim();
  if(!pinOk(a)){pinErr("请输入4位数字");return;}
  if(a!==b){pinErr("两次输入的不一样，请重新输入。");return;}
  const h=await pinHash(id,a);
  try{await savePin(id,h);}catch(e){console.error(e);pinErr("保存失败，请检查网络后再试。");return;}
  PINS[id]=h;
  rememberMe(id,h);
  _origChoose(id);
}
async function pinChange(id){
  const o=$("pin0").value.trim(),a=$("pin1").value.trim(),b=$("pin2").value.trim();
  if(!pinOk(o)||!pinOk(a)){pinErr("请输入4位数字");return;}
  if((await pinHash(id,o))!==PINS[id]){pinErr("旧密码不对。");return;}
  if(a!==b){pinErr("两次输入的新密码不一样。");return;}
  const h=await pinHash(id,a);
  try{await savePin(id,h);}catch(e){console.error(e);pinErr("保存失败，请检查网络后再试。");return;}
  PINS[id]=h;
  rememberMe(id,h);
  _origChoose(id);
}

const _origLogout=window.logout;
window.logout=function(){
  try{Object.keys(localStorage).filter(k=>k.startsWith("jp-pinok-")).forEach(k=>localStorage.removeItem(k));}catch(e){}
  _origLogout();
};
