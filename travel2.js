document.head.insertAdjacentHTML("beforeend",`<style>
.tbar2{display:flex;justify-content:flex-end;margin-top:-8px}
.tcollapsed #mapbox,.tcollapsed .citycard,.tcollapsed .foot{display:none}
.foot{margin-top:10px;font-size:14px}
.foot .fc{display:inline-block;margin:3px;padding:4px 10px;border-radius:14px;border:1px solid var(--line);background:#fff;cursor:pointer;font-size:13px}
.foot .fc.on{background:var(--gold-bg);border-color:var(--gold);font-weight:bold}
.tnav{display:flex;justify-content:space-between;gap:8px;margin-top:10px}
.mstar{cursor:pointer}
</style>`);

(function(){
  const t=document.getElementById("travel"),g=document.getElementById("greet");
  if(t&&g) g.after(t);
})();

let TCOLL=false;
try{TCOLL=localStorage.getItem("jp-tcoll")==="1";}catch(e){}

function toggleTravel(){
  TCOLL=!TCOLL;
  try{localStorage.setItem("jp-tcoll",TCOLL?"1":"0");}catch(e){}
  renderTravel();
}
function travelStep(d){
  const meCi=cityIdx(S.correct||0);
  let s=(travelSel!==null?travelSel:meCi)+d;
  s=Math.max(0,Math.min(meCi,s));
  travelSel=s;
  renderTravel();
}
function addStars(meCi){
  const svg=document.querySelector("#mapbox svg");

  if(!svg||!window.d3) return;
  const proj=d3.geoNaturalEarth1().fitSize([720,370],{type:"Sphere"});
  const s=d3.select(svg);
  CITIES.forEach((c,i)=>{
    if(c.fin||i>meCi) return;
    const [x,y]=proj([c.lon,c.lat]);
    s.append("text").attr("x",x).attr("y",y+4).attr("text-anchor","middle")
      .attr("font-size",12).attr("class","mstar").text("⭐")
      .on("click",()=>pickCity(i))
      .append("title").text(c.zh);
  });
}

const _renderTravelBeforeT2=window.renderTravel;
window.renderTravel=function(){
  _renderTravelBeforeT2();
  const el=document.getElementById("travel");
  if(!el||setup) return;
  el.classList.toggle("tcollapsed",TCOLL);
  const meCi=cityIdx(S.correct||0);
  const sel=travelSel!==null?travelSel:meCi;
  const h3=el.querySelector("h3");
  if(h3) h3.insertAdjacentHTML("afterend",`<div class="tbar2"><button class="link" style="margin:0" onclick="toggleTravel()">${TCOLL?"展开地图 ▾":"收起地图 ▴"}</button></div>`);
  const card=el.querySelector(".citycard");
  if(card){
    if(sel<=meCi){
      card.insertAdjacentHTML("beforeend",`<div class="tnav">
        <button class="btn" ${sel<=0?"disabled":""} onclick="travelStep(-1)">‹ 上一站</button>
        <button class="btn" ${sel>=meCi?"disabled":""} onclick="travelStep(1)">下一站 ›</button></div>`);
    }
    const list=CITIES.slice(0,meCi+1).map((c,i)=>
      `<span class="fc ${i===sel?"on":""}" onclick="pickCity(${i})">⭐ ${c.f} ${c.zh}</span>`).join("");

    card.insertAdjacentHTML("afterend",`<div class="foot"><b>⭐ ${esc(pname())}的旅行足迹（${meCi+1} 座城市）</b><div>${list}</div></div>`);
  }
  addStars(meCi);
}
