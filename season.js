window.loadWx=function(){};

function citySeason(c,tz){
  let m;
  try{m=+new Intl.DateTimeFormat("en-US",{timeZone:tz||"Asia/Tokyo",month:"numeric"}).format(new Date());}
  catch(e){m=new Date().getMonth()+1;}
  if(Math.abs(c.lat)<23.5) return "🌴 热带地区，没有明显的四季，主要分旱季和雨季";
  const n=["冬","冬","春","春","春","夏","夏","夏","秋","秋","秋","冬"];
  const s=c.lat>=0?n[m-1]:n[(m+5)%12];
  const icon={春:"🌸",夏:"☀️",秋:"🍁",冬:"❄️"}[s];
  return `${icon} 当地现在是${s}天${c.lat<0?"（南半球，季节和日本相反）":""}`;
}

window.fillLive=function(c){
  const el=$("citylive");
  if(!el||el.dataset.city!==c.zh) return;
  const info=CITY_INFO[c.zh]||{};
  el.innerHTML=`<span>🕐 当地时间 ${info.tz?cityTime(info.tz):"—"}</span><span>${citySeason(c,info.tz)}</span>`;
};
