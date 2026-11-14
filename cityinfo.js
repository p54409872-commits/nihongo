const CITY_INFO={
  "东京":{en:["Tokyo","Japan"],tz:"Asia/Tokyo",cu:"守时、排队、电车里很安静；古老的神社和摩天大楼并存，便利店几乎什么都能办。",fd:"寿司、天妇罗、拉面、月岛的文字烧。",se:"3月下旬～4月上旬赏樱，10～11月秋高气爽、红叶也漂亮。",pp:"浮世绘画家葛饰北斋（江户出身）、动画导演宫崎骏（东京出生）。",iv:"日本发明了方便面、卡拉OK、二维码（QR码）。"},
  "首尔":{en:["Seoul","South Korea"],tz:"Asia/Seoul",cu:"很重视长幼礼节，吃饭时晚辈要等长辈先动筷子；夜生活丰富，很多店开到深夜。",fd:"石锅拌饭、烤五花肉、炸鸡配啤酒、泡菜。",se:"4～5月春花、9～10月秋天最舒服。",pp:"创制韩文的世宗大王、名将李舜臣。",iv:"韩文字母；现存最早的金属活字印刷书籍《直指》出自14世纪的高丽。"},
  "北京":{en:["Beijing","China"],tz:"Asia/Shanghai",cu:"胡同文化、公园里遛鸟下棋跳舞，北京话带很多儿化音。",fd:"北京烤鸭、炸酱面、涮羊肉、豆汁儿。",se:"9～10月的秋天，天气晴朗不冷不热。",pp:"作家老舍、京剧大师梅兰芳都出生在北京。",iv:"中国的四大发明：造纸术、印刷术、火药、指南针。"},
  "河内":{en:["Hanoi","Vietnam"],tz:"Asia/Ho_Chi_Minh",cu:"满街摩托车，过马路要慢慢走；早上很多人在还剑湖边打太极、坐小板凳喝咖啡。",fd:"越南河粉、烤肉米线（Bún chả）、鸡蛋咖啡。",se:"10～12月凉爽干燥。",pp:"越南国父胡志明，他的陵墓就在河内。",iv:"据说鸡蛋咖啡1946年诞生于河内，因为当时牛奶短缺，就用蛋黄代替。"},
  "曼谷":{en:["Bangkok","Thailand"],tz:"Asia/Bangkok",cu:"“微笑之国”，见面双手合十说“萨瓦迪卡”；进寺庙要遮住肩膀和膝盖。",fd:"冬阴功汤、泰式炒河粉、芒果糯米饭。",se:"11～2月的凉季，不太热也少雨。",pp:"拉玛五世（朱拉隆功国王），推动了泰国的现代化。",iv:"功能饮料红牛最早起源于泰国。"},
  "吉隆坡":{en:["Kuala Lumpur","Malaysia"],tz:"Asia/Kuala_Lumpur",cu:"马来人、华人、印度人共同生活，节日特别多，常常一桌饭有三种文化。",fd:"椰浆饭（Nasi Lemak）、肉骨茶、拉茶。",se:"全年炎热，5～7月相对少雨。",pp:"奥斯卡影后杨紫琼是马来西亚人。",iv:"国油双子塔1998～2004年曾是世界最高的建筑。"},
  "新加坡":{en:["Singapore","Singapore"],tz:"Asia/Singapore",cu:"干净守规矩，乱丢垃圾会被罚款；英语、华语、马来语、泰米尔语都是官方语言。",fd:"海南鸡饭、辣椒螃蟹、叻沙。",se:"2～4月雨比较少。",pp:"建国总理李光耀。",iv:"新加坡的创新科技公司推出了著名的电脑声卡 Sound Blaster。"},
  "堪培拉":{en:["Canberra","Australia"],tz:"Australia/Sydney",cu:"生活悠闲，喜欢户外运动，打招呼说“G'day”。南半球季节和日本相反。",fd:"澳洲肉派、Vegemite 酱抹面包、各种海鲜。",se:"3～4月的秋天，天气稳定、树叶变色。",pp:"板球传奇唐·布拉德曼是澳大利亚人。",iv:"飞机的“黑匣子”（飞行记录仪）是澳大利亚人发明的。"},
  "惠灵顿":{en:["Wellington","New Zealand"],tz:"Pacific/Auckland",cu:"毛利文化很重要，传统问候是碰鼻子（Hongi）；大家都很爱橄榄球。",fd:"帕夫洛娃蛋糕、Hokey Pokey 冰淇淋、绿唇贻贝。",se:"12～3月的夏天。",pp:"和丹增·诺尔盖一起首次登顶珠峰的埃德蒙·希拉里是新西兰人。",iv:"新西兰是世界上第一个让女性拥有投票权的国家（1893年），也是商业蹦极的发源地。"},
  "新德里":{en:["New Delhi","India"],tz:"Asia/Kolkata",cu:"色彩鲜艳、宗教多样，街上常见牛；传统上用右手吃饭。",fd:"咖喱、黄油鸡、印度烤饼（Naan）、香料奶茶（Chai）。",se:"10～3月比较凉快。",pp:"“圣雄”甘地，德里有他的纪念地。",iv:"数字“0”的概念和现在通用的数字体系起源于印度，国际象棋的前身也来自印度。"},
  "加德满都":{en:["Kathmandu","Nepal"],tz:"Asia/Kathmandu",cu:"佛教和印度教融合，有被奉为“活女神”的库玛丽；尼泊尔的时区比印度快15分钟。",fd:"馍馍（Momo，类似饺子）、扁豆饭套餐（Dal Bhat）。",se:"10～11月天空最晴朗，最适合看雪山。",pp:"夏尔巴登山家丹增·诺尔盖。",iv:"冷知识：尼泊尔国旗是世界上唯一不是长方形的国旗。"},
  "德黑兰":{en:["Tehran","Iran"],tz:"Asia/Tehran",cu:"非常好客，有一套客气推让的礼仪（Taarof）；喝红茶时把方糖含在嘴里。",fd:"烤肉串、藏红花饭、波斯冰淇淋。",se:"4～5月、9～10月。",pp:"诗人哈菲兹；数学家花剌子米是波斯人，“算法 algorithm”一词就来自他的名字。",iv:"波斯地毯；古代的“风塔”是利用自然风降温的建筑，被称为古代空调。"},
  "安卡拉":{en:["Ankara","Türkiye (Turkey)"],tz:"Europe/Istanbul",cu:"一天离不开红茶，喝完土耳其咖啡还会用杯底的咖啡渣“占卜”。",fd:"旋转烤肉（Döner）、土耳其软糖、果仁蜜饼（Baklava）。",se:"4～6月、9～10月。",pp:"土耳其国父阿塔图尔克，他的陵墓在安卡拉。",iv:"“安哥拉”山羊和兔子的名字就来自安卡拉的旧称；郁金香也是从这一带传到荷兰的。"},
  "雅典":{en:["Athens","Greece"],tz:"Europe/Athens",cu:"生活节奏悠闲，爱在咖啡馆聊天；复活节是一年中最重要的节日。",fd:"希腊沙拉、穆萨卡、烤肉卷（Souvlaki）。",se:"4～6月、9～10月，避开盛夏酷暑。",pp:"哲学家苏格拉底、柏拉图。",iv:"民主制度、奥运会、悲剧和喜剧这样的戏剧形式都诞生在古希腊。"},
  "开罗":{en:["Cairo","Egypt"],tz:"Africa/Cairo",cu:"热闹又嘈杂，买东西习惯讨价还价，喜欢喝很甜的红茶。",fd:"Koshari（米饭、意面、扁豆混合）、蚕豆泥（Ful）、炸豆丸子。",se:"10～4月，夏天太热。",pp:"埃及艳后克利奥帕特拉；诺贝尔文学奖得主马哈福兹出生在开罗。",iv:"纸莎草纸，以及一年365天的太阳历。"},
  "内罗毕":{en:["Nairobi","Kenya"],tz:"Africa/Nairobi",cu:"斯瓦希里语打招呼说“Jambo”，“Hakuna Matata”的意思是“没问题”。",fd:"玉米糊（Ugali）、烤肉（Nyama Choma）。",se:"7～10月，可以去马赛马拉看动物大迁徙。",pp:"马拉松传奇基普乔格；种树运动发起人、诺贝尔和平奖得主旺加里·马塔伊。",iv:"2007年推出的手机支付 M-Pesa，让很多没有银行账户的人也能转账。"},
  "比勒陀利亚":{en:["Pretoria","South Africa"],tz:"Africa/Johannesburg",cu:"有11种官方语言，被称为“彩虹之国”；周末最爱户外烤肉聚会。",fd:"南非烤肉（Braai）、风干肉条（Biltong）。",se:"9～11月春天，10月左右蓝花楹盛开。",pp:"曼德拉的总统就职典礼就在比勒陀利亚举行。",iv:"世界首例人类心脏移植手术1967年在南非开普敦完成。"},
  "拉巴特":{en:["Rabat","Morocco"],tz:"Africa/Casablanca",cu:"用甜薄荷茶招待客人，在老城集市（Souk）里讨价还价。",fd:"塔吉锅、古斯米（Couscous）。",se:"3～5月、9～11月。",pp:"中世纪大旅行家伊本·白图泰是摩洛哥人。",iv:"位于菲斯的卡鲁因大学建于859年，常被认为是世界上最古老、至今仍在运作的大学。"},
  "马德里":{en:["Madrid","Spain"],tz:"Europe/Madrid",cu:"有午睡文化，晚饭很晚，常常晚上9～10点才开始吃。",fd:"西班牙海鲜饭、伊比利亚火腿、吉事果配热巧克力。",se:"4～6月、9～10月。",pp:"画家毕加索、《堂吉诃德》的作者塞万提斯。",iv:"现代平板拖把和加倍佳（Chupa Chups）棒棒糖都是西班牙人的发明。"},
  "巴黎":{en:["Paris","France"],tz:"Europe/Paris",cu:"很重视美食和生活情趣，朋友见面行贴面礼。",fd:"法棍、可颂、马卡龙。",se:"4～6月、9～10月。",pp:"在巴黎研究、两次获得诺贝尔奖的居里夫人；作家雨果。",iv:"摄影术（达盖尔）和电影——卢米埃尔兄弟1895年在巴黎举行了第一次电影放映。"},
  "伦敦":{en:["London","United Kingdom"],tz:"Europe/London",cu:"排队文化、下午茶，见面最爱聊天气。",fd:"炸鱼薯条、英式早餐、司康饼。",se:"5～9月，白天长、雨相对少。",pp:"在伦敦创作的莎士比亚、科学家牛顿。",iv:"万维网的发明者伯纳斯-李出生在伦敦；电视机也是英国人贝尔德最早演示的。"},
  "柏林":{en:["Berlin","Germany"],tz:"Europe/Berlin",cu:"守时，垃圾分类很严格，星期天大部分商店都关门。",fd:"咖喱香肠、德国猪肘、椒盐卷饼、啤酒。",se:"5～9月；12月有圣诞市集。",pp:"爱因斯坦曾在柏林工作多年。",iv:"德国人发明了汽车（奔驰，1886年）、活字印刷机（古腾堡）和阿司匹林。"},
  "斯德哥尔摩":{en:["Stockholm","Sweden"],tz:"Europe/Stockholm",cu:"有“Fika”文化，每天和同事朋友一起喝咖啡吃点心；很重视平等。",fd:"瑞典肉丸、肉桂卷、腌鲱鱼。",se:"6～8月，夏天白天特别长。",pp:"诺贝尔出生在斯德哥尔摩；ABBA 乐队也来自瑞典。",iv:"炸药（诺贝尔）、Spotify，以及植入式心脏起搏器。"},
  "雷克雅未克":{en:["Reykjavík","Iceland"],tz:"Atlantic/Reykjavik",cu:"人口很少，冰岛人的姓是“父亲名＋儿子／女儿”；大家都爱泡温泉。",fd:"冰岛热狗、Skyr 酸奶、羊肉汤。",se:"6～8月看极昼风景，9～3月看极光。",pp:"歌手比约克。",iv:"冰岛议会“阿尔庭”成立于930年，是世界上最古老的议会之一。"},
  "渥太华":{en:["Ottawa","Canada"],tz:"America/Toronto",cu:"很有礼貌，常说“sorry”；英语和法语都是官方语言。",fd:"普丁（薯条＋奶酪块＋肉汁）、枫糖浆、海狸尾甜饼（BeaverTails）。",se:"5月郁金香节，2月冬季狂欢节。",pp:"歌手席琳·迪翁是加拿大人。",iv:"胰岛素由加拿大科学家班廷等人在1921年发现；篮球是加拿大人奈史密斯发明的。"},
  "华盛顿":{en:["Washington, D.C.","United States"],tz:"America/New_York",cu:"美国的政治中心，史密森尼博物馆群免费参观。",fd:"半烟熏香肠（Half-smoke）、蓝蟹。",se:"3月底～4月初看樱花——这些樱花树是1912年东京送的。",pp:"林肯（林肯纪念堂就在这里）。",iv:"美国人发明了飞机（莱特兄弟），爱迪生让电灯泡走进了千家万户。"},
  "墨西哥城":{en:["Mexico City","Mexico"],tz:"America/Mexico_City",cu:"11月初的亡灵节用鲜花和骷髅装饰纪念亲人，街头常有马里亚奇乐队。",fd:"塔可、牛油果酱、玉米饼。",se:"3～5月，干燥温暖。",pp:"画家弗里达·卡罗出生在墨西哥城。",iv:"巧克力、玉米、辣椒都起源于墨西哥一带。"},
  "巴西利亚":{en:["Brasília","Brazil"],tz:"America/Sao_Paulo",cu:"巴西人热情，爱足球、桑巴和狂欢节。",fd:"巴西烤肉、黑豆炖肉饭（Feijoada）、奶酪面包。",se:"5～9月旱季。",pp:"“球王”贝利；设计了巴西利亚的建筑师尼迈耶。",iv:"巴西人桑托斯-杜蒙特是航空先驱，还推动了手表的普及。"},
  "布宜诺斯艾利斯":{en:["Buenos Aires","Argentina"],tz:"America/Argentina/Buenos_Aires",cu:"晚饭很晚，大家传着喝马黛茶；街头常能看到探戈表演。",fd:"阿根廷烤肉（Asado）、恩帕纳达馅饼、焦糖牛奶酱。",se:"10～12月春天、3～5月秋天。",pp:"梅西是阿根廷人；教皇方济各出生在布宜诺斯艾利斯。",iv:"圆珠笔在阿根廷取得专利；阿根廷也是最早用指纹破案的国家。"},
  "利马":{en:["Lima","Peru"],tz:"America/Lima",cu:"印加文化的故乡，被称为南美的“美食之都”。",fd:"酸橘汁腌鱼（Ceviche）、紫玉米饮料、秘鲁烤鸡。",se:"12～4月，利马的夏天阳光充足。",pp:"诺贝尔文学奖得主巴尔加斯·略萨是秘鲁人。",iv:"土豆原产于秘鲁一带，这里有几千个土豆品种。"}
};

CITY_INFO["东京（终点）"]=Object.assign({},CITY_INFO["东京"],{en:["Tokyo (Finish)","Japan"]});

document.head.insertAdjacentHTML("beforeend",`<style>
.enname{font-size:13px;font-weight:bold;letter-spacing:.5px;color:var(--gold);opacity:.75;margin-bottom:2px}
.cinfo{margin-top:8px;display:grid;gap:6px}
.cinfo div{background:rgba(255,255,255,.6);border-radius:8px;padding:6px 10px}
.cinfo b{color:var(--gold)}
.live{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}
.live span{background:#fff;border-radius:8px;padding:4px 10px;font-size:14px}
</style>`);

function cityTime(tz){
  try{
    const now=new Date();
    const t=new Intl.DateTimeFormat("zh-CN",{timeZone:tz,month:"numeric",day:"numeric",weekday:"short",hour:"2-digit",minute:"2-digit",hour12:false}).format(now);
    const off=z=>{const p=new Intl.DateTimeFormat("en-US",{timeZone:z,hour:"numeric",minute:"numeric",hour12:false,day:"numeric"}).formatToParts(now);const g=k=>+p.find(x=>x.type===k).value;return g("day")*1440+(g("hour")%24)*60+g("minute");};
    let diff=(off(tz)-off("Asia/Tokyo"))/60;
    if(diff>14) diff-=24*30;
    if(diff<-14) diff+=24*30;
    const d=Math.round(diff*4)/4;
    return t+(d===0?"（和东京一样）":`（比东京${d>0?"快":"慢"}${Math.abs(d)}小时）`);
  }catch(e){return "—";}
}

function seasonText(c,tz){
  let m;
  try{m=+new Intl.DateTimeFormat("en-US",{timeZone:tz||"Asia/Tokyo",month:"numeric"}).format(new Date());}
  catch(e){m=new Date().getMonth()+1;}
  if(Math.abs(c.lat)<23.5) return "🌴 热带地区，没有明显的四季，主要分旱季和雨季";
  const n=["冬","冬","春","春","春","夏","夏","夏","秋","秋","秋","冬"];
  const s=c.lat>=0?n[m-1]:n[(m+5)%12];
  const icon={春:"🌸",夏:"☀️",秋:"🍁",冬:"❄️"}[s];

  return `${icon} 当地现在是${s}天${c.lat<0?"（南半球，季节和日本相反）":""}`;
}

function showCityLive(c){
  const el=document.getElementById("citylive");
  if(!el||el.dataset.city!==c.zh) return;
  const info=CITY_INFO[c.zh]||{};
  el.innerHTML=`<span>🕐 当地时间 ${info.tz?cityTime(info.tz):"—"}</span><span>${seasonText(c,info.tz)}</span>`;
}

function addCityInfo(){
  const card=document.querySelector("#travel .citycard");
  if(!card||typeof CITIES==="undefined") return;
  const meCi=cityIdx(S.correct||0);
  const sel=travelSel!==null?travelSel:meCi;
  const c=CITIES[sel],info=CITY_INFO[c.zh];
  if(!info) return;
  card.insertAdjacentHTML("afterbegin",`<div class="enname">${info.en[0]} · ${info.en[1]}</div>`);
  if(sel>meCi) return;
  card.insertAdjacentHTML("beforeend",`
    <div class="live" id="citylive" data-city="${c.zh}"></div>
    <div class="cinfo">
      <div><b>🎎 风土人情</b>　${info.cu}</div>
      <div><b>🍜 美食</b>　${info.fd}</div>
      <div><b>📅 最佳季节</b>　${info.se}</div>
      <div><b>⭐ 相关名人</b>　${info.pp}</div>
      <div><b>💡 发明与第一</b>　${info.iv}</div>
    </div>`);
  showCityLive(c);
}

const _baseRenderTravel=window.renderTravel;

window.renderTravel=function(){_baseRenderTravel();addCityInfo();};

setInterval(()=>{
  const el=document.getElementById("citylive");
  if(!el||typeof CITIES==="undefined") return;
  const c=CITIES.find(x=>x.zh===el.dataset.city);
  if(c) showCityLive(c);
},60000);
