const BAGS={};
const _prevPool=window.poolByUnit;
window.poolByUnit=function(arr){
  const pool=_prevPool(arr);
  const key=arr===CONF?"conf":arr===FILL?"fill":"other";
  let b=BAGS[key];
  const sig=pool.join(",");
  if(!b||b.sig!==sig||!b.q.length){
    const q=shuffle(pool);
    const last=b?b.last:undefined;
    if(last!==undefined&&q.length>1&&q[0]===last) q.push(q.shift());
    b={sig,q,last};
    BAGS[key]=b;
  }
  const n=b.q.shift();
  b.last=n;
  return [n];
};

const _prevDue=window.dueList;
window.dueList=function(){return shuffle(_prevDue());};

function resetUnit(){
  const sel=$("resetsel");
  if(!sel) return;
  const id=+sel.value;
  const u=UNITS[id-1];
  if(!confirm(`确定要重刷单元${id}「${u.name}」吗？这个单元的题数和正确率会清零，其他记录不受影响。`)) return;
  const old=S.units[id];
  S.units[id]={done:0,ok:0,recent:[],passed:old.passed};
  save();
  mode="course"; selUnit=id; justPassed=false;

  newQuestion();
  window.scrollTo(0,0);
}

const _prevRenderUnits=window.renderUnits;
window.renderUnits=function(){
  _prevRenderUnits();
  const cu=curUnit();
  const opts=UNITS.filter(u=>u.id<=cu&&S.units[u.id].done>0)
    .map(u=>`<option value="${u.id}">单元${u.id} ${u.name}</option>`).join("");
  if(!opts) return;
  $("units").insertAdjacentHTML("beforeend",
    `<div class="btns" style="margin-top:12px"><span class="muted">重刷单元：</span>
     <select id="resetsel">${opts}</select>
     <button class="btn" onclick="resetUnit()">重刷</button></div>`);
};
