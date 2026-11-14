const LEVELS=[{n:"N5",s:0},{n:"N4",s:300},{n:"N3",s:800},{n:"N2",s:1600},{n:"N1",s:2800}];
const FINISH=4500;
const CITIES=[
  {lv:0,f:"🇯🇵",zh:"东京",ja:"東京",r:"とうきょう",c:"日本",lat:35.68,lon:139.69,t:"日本的首都，东京都市圈约有3700万人，是世界上人口最多的都市圈之一。出发！"},
  {lv:0,f:"🇰🇷",zh:"首尔",ja:"ソウル",r:"そうる",c:"韩国",lat:37.57,lon:126.98,t:"韩国首都，汉江穿城而过。韩文是15世纪由世宗大王主持创制的。"},
  {lv:0,f:"🇨🇳",zh:"北京",ja:"北京",r:"ぺきん",c:"中国",lat:39.90,lon:116.41,t:"中国首都，故宫是世界上现存规模最大的木结构古建筑群之一。"},
  {lv:0,f:"🇻🇳",zh:"河内",ja:"ハノイ",r:"はのい",c:"越南",lat:21.03,lon:105.85,t:"越南首都，名字的意思是“河之内”，因为城市在红河弯道的内侧。"},
  {lv:0,f:"🇹🇭",zh:"曼谷",ja:"バンコク",r:"ばんこく",c:"泰国",lat:13.76,lon:100.50,t:"泰国首都，它的泰语正式全名非常长，常被说是世界上名字最长的城市。"},
  {lv:0,f:"🇲🇾",zh:"吉隆坡",ja:"クアラルンプール",r:"くあらるんぷーる",c:"马来西亚",lat:3.14,lon:101.69,t:"马来西亚首都，名字在马来语里的意思是“泥泞的河口”。"},
  {lv:1,f:"🇸🇬",zh:"新加坡",ja:"シンガポール",r:"しんがぽーる",c:"新加坡",lat:1.35,lon:103.82,t:"一座城市就是一个国家。名字来自梵语，意思是“狮子城”。"},
  {lv:1,f:"🇦🇺",zh:"堪培拉",ja:"キャンベラ",r:"きゃんべら",c:"澳大利亚",lat:-35.28,lon:149.13,t:"澳大利亚首都。悉尼和墨尔本都想当首都，最后在两座城市之间新建了堪培拉。"},
  {lv:1,f:"🇳🇿",zh:"惠灵顿",ja:"ウェリントン",r:"うぇりんとん",c:"新西兰",lat:-41.29,lon:174.78,t:"新西兰首都，是世界上最南端的国家首都，以大风出名。"},
  {lv:1,f:"🇮🇳",zh:"新德里",ja:"ニューデリー",r:"にゅーでりー",c:"印度",lat:28.61,lon:77.21,t:"印度首都。印度在2023年超过中国，成为世界人口最多的国家。"},
  {lv:1,f:"🇳🇵",zh:"加德满都",ja:"カトマンズ",r:"かとまんず",c:"尼泊尔",lat:27.72,lon:85.32,t:"尼泊尔首都，海拔约1400米，是去珠穆朗玛峰的出发地之一。"},
  {lv:1,f:"🇮🇷",zh:"德黑兰",ja:"テヘラン",r:"てへらん",c:"伊朗",lat:35.69,lon:51.39,t:"伊朗首都，北边紧挨着高山，冬天在城市附近就能滑雪。"},
  {lv:2,f:"🇹🇷",zh:"安卡拉",ja:"アンカラ",r:"あんから",c:"土耳其",lat:39.93,lon:32.86,t:"土耳其首都。很多人以为是伊斯坦布尔，其实从1923年起首都就是安卡拉。"},
  {lv:2,f:"🇬🇷",zh:"雅典",ja:"アテネ",r:"あてね",c:"希腊",lat:37.98,lon:23.73,t:"希腊首都，民主制度和奥运会的发源地。帕特农神庙已经有约2400多年的历史。"},
  {lv:2,f:"🇪🇬",zh:"开罗",ja:"カイロ",r:"かいろ",c:"埃及",lat:30.04,lon:31.24,t:"埃及首都。附近吉萨的金字塔，是古代世界七大奇迹中唯一保存到今天的。"},
  {lv:2,f:"🇰🇪",zh:"内罗毕",ja:"ナイロビ",r:"ないろび",c:"肯尼亚",lat:-1.29,lon:36.82,t:"肯尼亚首都，城市旁边就有国家公园，能看到长颈鹿和狮子。"},
  {lv:2,f:"🇿🇦",zh:"比勒陀利亚",ja:"プレトリア",r:"ぷれとりあ",c:"南非",lat:-25.75,lon:28.19,t:"南非有三个首都，比勒陀利亚是行政首都。春天满城开紫色的蓝花楹。"},
  {lv:2,f:"🇲🇦",zh:"拉巴特",ja:"ラバト",r:"らばと",c:"摩洛哥",lat:34.02,lon:-6.84,t:"摩洛哥首都。很多人以为是更有名的卡萨布兰卡，其实首都是拉巴特。"},
  {lv:3,f:"🇪🇸",zh:"马德里",ja:"マドリード",r:"まどりーど",c:"西班牙",lat:40.42,lon:-3.70,t:"西班牙首都，位于国家正中央，海拔约650米，是欧洲海拔较高的首都之一。"},
  {lv:3,f:"🇫🇷",zh:"巴黎",ja:"パリ",r:"ぱり",c:"法国",lat:48.86,lon:2.35,t:"法国首都。埃菲尔铁塔建于1889年，建成时是世界上最高的建筑。"},
  {lv:3,f:"🇬🇧",zh:"伦敦",ja:"ロンドン",r:"ろんどん",c:"英国",lat:51.51,lon:-0.13,t:"英国首都。伦敦地铁1863年开通，是世界上第一条地铁。"},
  {lv:3,f:"🇩🇪",zh:"柏林",ja:"ベルリン",r:"べるりん",c:"德国",lat:52.52,lon:13.40,t:"德国首都。柏林墙在1989年倒塌，第二年东西德统一。"},
  {lv:3,f:"🇸🇪",zh:"斯德哥尔摩",ja:"ストックホルム",r:"すとっくほるむ",c:"瑞典",lat:59.33,lon:18.07,t:"瑞典首都，建在14个岛上。诺贝尔奖的颁奖典礼在这里举行（和平奖在奥斯陆）。"},
  {lv:3,f:"🇮🇸",zh:"雷克雅未克",ja:"レイキャビク",r:"れいきゃびく",c:"冰岛",lat:64.15,lon:-21.94,t:"冰岛首都，是世界上最北端的国家首都，冬天常常能看到极光。"},
  {lv:4,f:"🇨🇦",zh:"渥太华",ja:"オタワ",r:"おたわ",c:"加拿大",lat:45.42,lon:-75.70,t:"加拿大首都。冬天市中心的运河结冰后，变成一条很长的天然溜冰道。"},
  {lv:4,f:"🇺🇸",zh:"华盛顿",ja:"ワシントン",r:"わしんとん",c:"美国",lat:38.91,lon:-77.04,t:"美国首都，以第一任总统华盛顿命名，不属于任何一个州。"},
  {lv:4,f:"🇲🇽",zh:"墨西哥城",ja:"メキシコシティ",r:"めきしこしてぃ",c:"墨西哥",lat:19.43,lon:-99.13,t:"墨西哥首都，建在古代阿兹特克人的湖上城市遗址上，海拔约2240米。"},
  {lv:4,f:"🇧🇷",zh:"巴西利亚",ja:"ブラジリア",r:"ぶらじりあ",c:"巴西",lat:-15.79,lon:-47.88,t:"巴西首都，1960年新建的规划城市，从空中看整座城市像一架飞机。"},
  {lv:4,f:"🇦🇷",zh:"布宜诺斯艾利斯",ja:"ブエノスアイレス",r:"ぶえのすあいれす",c:"阿根廷",lat:-34.60,lon:-58.38,t:"阿根廷首都，探戈的发源地。名字的意思是“好空气”。"},
  {lv:4,f:"🇵🇪",zh:"利马",ja:"リマ",r:"りま",c:"秘鲁",lat:-12.05,lon:-77.04,t:"秘鲁首都，几乎全年不下雨，是去马丘比丘的出发地。"},
  {lv:4,f:"🏁",zh:"东京（终点）",ja:"東京",r:"とうきょう",c:"日本",lat:35.68,lon:139.69,t:"环游世界一周，回到东京！恭喜跑完 N1 全程！",fin:true}
];
(function(){
  LEVELS.forEach((L,li)=>{
    const end=li<LEVELS.length-1?LEVELS[li+1].s:FINISH;
    const cs=CITIES.filter(c=>c.lv===li&&!c.fin);
    cs.forEach((c,i)=>{c.at=Math.round(L.s+(end-L.s)*i/cs.length);});
  });
  CITIES.forEach(c=>{if(c.fin) c.at=FINISH;});
})();
const AVA=["🐰","🐱","🦊","🐼","🐻","🐨","🐯","🐧","🐶","🐹"];
let WORLD=null,worldLoading=false,travelSel=null;

document.head.insertAdjacentHTML("beforeend",`<style>
.track{display:flex;height:26px;border-radius:13px;overflow:hidden;margin:12px 0 4px;font-size:12px;font-weight:bold;color:#fff}
.seg{display:flex;align-items:center;justify-content:center}
.s0{background:#97c459}.s1{background:#5dcaa5}.s2{background:#378add}.s3{background:#7f77dd}.s4{background:#d4537e}
.lane{position:relative;height:32px;border-bottom:1px dashed var(--line)}
.runner{position:absolute;top:0;transform:translateX(-50%);font-size:24px;transition:left .5s}
.rinfo{font-size:14px;margin:6px 0}
.worldmap{width:100%;height:auto;margin-top:10px;border-radius:10px;display:block}
.citycard{background:var(--gold-bg);border-radius:10px;padding:12px 14px;margin-top:10px;font-size:14px;line-height:1.8}
.cityname{font-size:17px;font-weight:bold;color:var(--gold)}
.ava{font-size:20px;background:#fff;border:1px solid var(--line);border-radius:8px;margin:2px;cursor:pointer;padding:2px 6px}
.ava.on{border-color:var(--accent);background:var(--accent-bg)}
</style>`);

(function(){
  const el=document.createElement("div");
  el.className="card"; el.id="travel";
  $("pk").after(el);
})();

function cityIdx(n){let k=0;CITIES.forEach((c,i)=>{if(n>=c.at) k=i;});return k;}
function levelOf(n){
  if(n>=FINISH) return "N1 完赛";
  let k=0;LEVELS.forEach((L,i)=>{if(n>=L.s) k=i;});
  return LEVELS[k].n;
}
function avatarOf(i){const d=getData(PROFILES[i].id);return d.avatar||AVA[i]||"🐰";}
function setAvatar(a){S.avatar=a;save();renderTravel();}
function pickCity(i){travelSel=i;renderTravel();}
function loadWorld(){
  if(worldLoading||WORLD||!window.topojson) return;
  worldLoading=true;
  fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
    .then(r=>r.json())
    .then(j=>{WORLD=topojson.feature(j,j.objects.countries);if(!setup) renderTravel();})
    .catch(e=>{console.error(e);worldLoading=false;});
}

function renderTravel(){
  const el=$("travel");
  if(!el||setup) return;
  const D=PROFILES.map(p=>getData(p.id));
  const runs=D.map((d,i)=>{
    const n=d.correct||0,ci=cityIdx(n);
    return {i,n,ci,city:CITIES[ci],next:CITIES[ci+1],lv:levelOf(n),ava:avatarOf(i)};
  });
  const meI=PROFILES.findIndex(p=>p.id===pid);
  const me=runs[meI];
  let h=`<h3 style="margin-top:0">环游世界跑道 · 从 N5 跑到 N1</h3>
    <div class="muted">每答对 1 题前进 1 步，答对 ${FINISH} 题跑完全程，环游世界一周回到东京。</div>
    <div class="track">${LEVELS.map((L,li)=>{const end=li<LEVELS.length-1?LEVELS[li+1].s:FINISH;return `<div class="seg s${li}" style="width:${(end-L.s)/FINISH*100}%">${L.n}</div>`;}).join("")}</div>`;
  runs.forEach(r=>{h+=`<div class="lane"><div class="runner" style="left:${Math.max(2,Math.min(98,r.n/FINISH*100))}%">${r.ava}</div></div>`;});
  runs.forEach(r=>{
    h+=`<div class="rinfo">${r.ava} <b>${esc(PROFILES[r.i].name)}</b>：${r.lv} · 已答对 ${r.n} 题 · 现在在 ${r.city.f} ${r.city.zh}`+
      (r.next?`　下一站 ${r.next.f} ${r.next.zh}，还差 ${r.next.at-r.n} 题`:"　🏁 已完赛！")+`</div>`;
  });
  h+=`<div id="mapbox"></div>`;
  const sel=travelSel!==null?travelSel:me.ci;
  const c=CITIES[sel];
  if(sel<=me.ci){
    h+=`<div class="citycard"><div class="cityname">${c.f} ${c.zh} · ${c.ja}（${c.r}）<button class="mini" onclick="speak('${c.ja}')">朗读</button></div>
      <div class="muted">${c.c} · ${LEVELS[c.lv].n} 区</div><div>${c.t}</div></div>`;
  } else {
    h+=`<div class="citycard"><div class="cityname">${c.f} ${c.zh}</div><div>还没跑到这里，再答对 ${c.at-me.n} 题就能解锁这座城市的小知识。</div></div>`;
  }
  h+=`<div class="muted" style="margin-top:10px">点地图上的城市可以看介绍。${esc(pname())}的头像：${AVA.map(a=>`<button class="ava ${a===me.ava?"on":""}" onclick="setAvatar('${a}')">${a}</button>`).join("")}</div>`;
  el.innerHTML=h;
  drawMap(runs,me);
}

function drawMap(runs,me){
  const box=$("mapbox");
  if(!box) return;
  if(!window.d3||!window.topojson){box.innerHTML=`<div class="muted">地图加载失败，刷新页面试试。</div>`;return;}
  if(!WORLD){box.innerHTML=`<div class="muted">地图加载中…</div>`;loadWorld();return;}
  const W=720,H=370;
  const proj=d3.geoNaturalEarth1().fitSize([W,H],{type:"Sphere"});
  const path=d3.geoPath(proj);
  const svg=d3.create("svg").attr("viewBox",`0 0 ${W} ${H}`).attr("class","worldmap");
  svg.append("path").attr("d",path({type:"Sphere"})).attr("fill","#eaf3fb");
  svg.append("g").selectAll("path").data(WORLD.features).join("path")
    .attr("d",path).attr("fill","#dfe6d5").attr("stroke","#fff").attr("stroke-width",0.4);
  const coords=CITIES.map(c=>[c.lon,c.lat]);
  svg.append("path").attr("d",path({type:"LineString",coordinates:coords}))
    .attr("fill","none").attr("stroke","#9a9a9a").attr("stroke-dasharray","3 3").attr("stroke-width",1);
  const done=coords.slice(0,me.ci+1);
  if(done.length>1) svg.append("path").attr("d",path({type:"LineString",coordinates:done}))
    .attr("fill","none").attr("stroke","#993556").attr("stroke-width",2);
  CITIES.forEach((c,i)=>{
    if(c.fin) return;
    const [x,y]=proj([c.lon,c.lat]);
    svg.append("circle").attr("cx",x).attr("cy",y).attr("r",i<=me.ci?4.5:3.5)
      .attr("fill",i<=me.ci?"#0f6e56":"#bdbdbd").attr("stroke","#fff").attr("stroke-width",1)
      .style("cursor","pointer").on("click",()=>pickCity(i))
      .append("title").text(c.zh);
  });
  runs.forEach((r,k)=>{
    const [x,y]=proj([r.city.lon,r.city.lat]);
    svg.append("text").attr("x",x+(k?11:-11)).attr("y",y-6).attr("text-anchor","middle")
      .attr("font-size",20).text(r.ava);
  });
  box.innerHTML="";
  box.appendChild(svg.node());
}

const _prevRecord=window.record;
window.record=function(ok,cats){
  const b=cityIdx(S.correct),bl=levelOf(S.correct);
  const ch=_prevRecord(ok,cats);
  const a=cityIdx(S.correct),al=levelOf(S.correct);
  if(a>b){
    const c=CITIES[a];
    ch.push(c.fin?"🏁 环游世界一周回到东京！恭喜跑完 N1 全程！":`✈ 抵达新城市：${c.f} ${c.zh}（${c.ja}）！${c.t}`);
    travelSel=null;
  }
  if(al!==bl&&!CITIES[a].fin) ch.push(`🎉 升级到 ${al} 区域了！`);
  return ch;
};
const _prevRenderPK=window.renderPK;
window.renderPK=function(){_prevRenderPK();renderTravel();};
