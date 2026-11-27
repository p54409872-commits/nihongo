// mono-en.js — 大富翁：地名英语 + 介绍的英语、日语翻译（都能朗读）
(function(){

var CT = {
  "日本":"Japan","韩国":"South Korea","中国":"China","印度尼西亚":"Indonesia","澳大利亚":"Australia","印度":"India",
  "沙特阿拉伯":"Saudi Arabia","土耳其":"Türkiye (Turkey)","俄罗斯":"Russia","德国":"Germany","荷兰":"the Netherlands",
  "瑞士":"Switzerland","法国":"France","英国":"the United Kingdom","西班牙":"Spain","意大利":"Italy","巴西":"Brazil",
  "墨西哥":"Mexico","美国":"the United States","加拿大":"Canada","越南":"Vietnam","泰国":"Thailand","新加坡":"Singapore",
  "新西兰":"New Zealand","阿联酋":"the United Arab Emirates","埃及":"Egypt","肯尼亚":"Kenya","南非":"South Africa",
  "尼日利亚":"Nigeria","希腊":"Greece","瑞典":"Sweden","阿根廷":"Argentina","智利":"Chile"
};

// 地点：[英语名, 所属国家, 介绍的英语翻译, 介绍的日语翻译]
var PL = {
"东京":["Tokyo","日本","Tokyo is the capital of Japan and one of the largest cities in the world. Shibuya Crossing and Tokyo Tower are famous.","日本の首都で、世界でいちばん大きい都市の一つです。渋谷の交差点と東京タワーが有名です。"],
"大阪":["Osaka","日本","Osaka is called \"Japan's kitchen.\" Takoyaki and okonomiyaki are its famous foods.","「天下の台所」と呼ばれています。たこ焼きとお好み焼きが有名です。"],
"京都":["Kyoto","日本","Kyoto was Japan's capital for over a thousand years. There are temples and shrines everywhere.","千年以上、日本の都だった古い町です。お寺と神社がたくさんあります。"],
"札幌":["Sapporo","日本","Sapporo is the largest city in Hokkaido. It holds a big snow festival every February.","北海道でいちばん大きい町です。毎年二月に大きな雪まつりがあります。"],
"首尔":["Seoul","韩国","Seoul is the capital of South Korea. The Han River flows through the city, and Gyeongbokgung was the palace of the Joseon kings.","韓国の首都です。町の中を漢江が流れていて、景福宮は朝鮮王朝の王宮でした。"],
"釜山":["Busan","韩国","Busan is South Korea's second largest city, with beautiful beaches and a lively seafood market.","韓国で二番目に大きい町です。きれいな海岸とにぎやかな魚市場があります。"],
"济州岛":["Jeju Island","韩国","Jeju is a volcanic island famous for its tangerines and beautiful scenery.","火山でできた島です。みかんが有名で、けしきがとてもきれいです。"],
"庆州":["Gyeongju","韩国","Gyeongju was the capital of the Silla kingdom for a thousand years. It is called \"a museum without walls.\"","新羅の千年の都でした。「壁のない博物館」と呼ばれています。"],
"北京":["Beijing","中国","Beijing is the capital of China. It has the Forbidden City and the Great Wall, and over 3,000 years of history.","中国の首都です。故宮と万里の長城があり、三千年以上の歴史があります。"],
"上海":["Shanghai","中国","Shanghai is China's biggest business center. The Bund and the Oriental Pearl Tower are famous.","中国でいちばん大きい経済の中心です。外灘と東方明珠タワーが有名です。"],
"西安":["Xi'an","中国","Xi'an was the capital of thirteen dynasties. It is famous for the Terracotta Warriors.","十三の王朝の都でした。兵馬俑がとても有名です。"],
"成都":["Chengdu","中国","Chengdu is the home of the giant panda. Its hot pot is spicy and numbing.","パンダのふるさとです。火鍋はとても辛いです。"],
"雅加达":["Jakarta","印度尼西亚","Jakarta is the capital of Indonesia, with over ten million people. It is famous for traffic jams. A new capital, Nusantara, is being built.","インドネシアの首都で、人口は一千万人以上です。渋滞で有名です。新しい首都ヌサンタラを作っています。"],
"巴厘岛":["Bali","印度尼西亚","Bali is a popular holiday island with rice terraces, temples and surfing beaches.","人気のリゾートの島です。棚田やお寺、サーフィンの海岸があります。"],
"日惹":["Yogyakarta","印度尼西亚","Near Yogyakarta is Borobudur, the largest Buddhist temple in the world.","近くに世界でいちばん大きい仏教の遺跡、ボロブドゥールがあります。"],
"万隆":["Bandung","印度尼西亚","Bandung is a cool highland city surrounded by volcanoes.","すずしい高原の町で、まわりにいくつも火山があります。"],
"堪培拉":["Canberra","澳大利亚","Canberra was planned and built to be the capital. It lies between Sydney and Melbourne.","首都にするために計画して作られた町です。シドニーとメルボルンの間にあります。"],
"悉尼":["Sydney","澳大利亚","Sydney is Australia's largest city, with the Opera House and the Harbour Bridge.","オーストラリアでいちばん大きい町です。オペラハウスとハーバーブリッジがあります。"],

"墨尔本":["Melbourne","澳大利亚","Melbourne is a city of coffee and trams. It is often called one of the most livable cities.","コーヒーと路面電車の町です。住みやすい町としてよく選ばれます。"],
"凯恩斯":["Cairns","澳大利亚","Cairns is the starting point for diving on the Great Barrier Reef, full of colorful fish.","グレートバリアリーフでダイビングをするときの出発地です。海にはカラフルな魚がたくさんいます。"],
"新德里":["New Delhi","印度","New Delhi is the capital of India. It has India Gate and the Red Fort.","インドの首都です。インド門とレッド・フォートがあります。"],
"孟买":["Mumbai","印度","Mumbai is India's largest city and the home of Bollywood movies.","インドでいちばん大きい町で、ボリウッド映画の中心です。"],
"阿格拉":["Agra","印度","The Taj Mahal, built of white marble, is in Agra.","白い大理石で作られたタージ・マハルがあります。"],
"班加罗尔":["Bengaluru","印度","Bengaluru is called \"India's Silicon Valley\" and has many IT companies.","「インドのシリコンバレー」と呼ばれ、IT企業がたくさんあります。"],
"利雅得":["Riyadh","沙特阿拉伯","Riyadh is a big city in the desert. In summer it is often over 45 degrees.","砂漠の中の大きな町です。夏はよく45度をこえます。"],
"吉达":["Jeddah","沙特阿拉伯","Jeddah is a port city on the Red Sea.","紅海の港町です。"],
"欧拉":["AlUla","沙特阿拉伯","AlUla has huge strange rocks in the desert and the ruins of a 2,000-year-old city.","砂漠に大きなふしぎな岩と、二千年前の町の遺跡があります。"],
"达曼":["Dammam","沙特阿拉伯","Dammam is the center of Saudi Arabia's oil industry.","サウジアラビアの石油産業の中心です。"],
"安卡拉":["Ankara","土耳其","Ankara is the capital of Türkiye. The tomb of Atatürk, the founder of the country, is here.","トルコの首都です。建国の父アタテュルクのお墓があります。"],
"伊斯坦布尔":["Istanbul","土耳其","Istanbul is a city on two continents, Europe and Asia.","ヨーロッパとアジア、二つの大陸にまたがる町です。"],
"卡帕多奇亚":["Cappadocia","土耳其","In Cappadocia, hundreds of hot-air balloons rise together in the morning over strange-shaped rocks.","朝、何百もの気球がいっしょに空に上がります。地面にはふしぎな形の岩がたくさんあります。"],
"安塔利亚":["Antalya","土耳其","Antalya is a holiday city on the Mediterranean, famous for sunshine and beaches.","地中海のリゾートの町で、太陽と砂浜が有名です。"],
"莫斯科":["Moscow","俄罗斯","Moscow is the capital of Russia. It has Red Square and the Kremlin, and winters are very cold.","ロシアの首都です。赤の広場とクレムリンがあり、冬はとても寒いです。"],
"圣彼得堡":["Saint Petersburg","俄罗斯","Saint Petersburg has the Hermitage Museum. In summer there are \"white nights\" when it never gets dark.","エルミタージュ美術館があります。夏は暗くならない「白夜」があります。"],
"喀山":["Kazan","俄罗斯","Kazan is where Russian culture and Tatar culture meet.","ロシアの文化とタタールの文化がまじわる町です。"],
"符拉迪沃斯托克":["Vladivostok","俄罗斯","Vladivostok is the end of the Trans-Siberian Railway, and it is very close to Japan.","シベリア鉄道の終点で、日本にとても近いです。"],
"柏林":["Berlin","德国","Berlin is the capital of Germany. It has the Brandenburg Gate and remains of the Berlin Wall.","ドイツの首都です。ブランデンブルク門とベルリンの壁の跡があります。"],
"慕尼黑":["Munich","德国","Munich holds Oktoberfest every autumn and is the home of BMW.","毎年秋にビール祭りがあり、BMWのふるさとでもあります。"],
"法兰克福":["Frankfurt","德国","Frankfurt is Germany's financial center. The European Central Bank is here.","ドイツの金融の中心で、ヨーロッパ中央銀行があります。"],
"汉堡":["Hamburg","德国","Hamburg is Germany's largest port city.","ドイツでいちばん大きい港町です。"],
"阿姆斯特丹":["Amsterdam","荷兰","Amsterdam is a city of canals and bicycles. There are more bikes than people.","運河と自転車の町です。人より自転車のほうが多いです。"],
"鹿特丹":["Rotterdam","荷兰","Rotterdam is the largest port in Europe.","ヨーロッパでいちばん大きい港です。"],
"海牙":["The Hague","荷兰","The Dutch government and the International Court of Justice are in The Hague.","政府と国際司法裁判所があります。"],
"小孩堤防":["Kinderdijk","荷兰","At Kinderdijk, nineteen old windmills stand in a row. It is a World Heritage Site.","十九の古い風車がならんでいて、世界遺産です。"],
"伯尔尼":["Bern","瑞士","Bern is the capital of Switzerland. The old town has an astronomical clock and a bear park.","スイスの首都です。古い町に天文時計があり、クマの公園もあります。"],
"苏黎世":["Zurich","瑞士","Zurich is Switzerland's largest city, famous for banks and chocolate.","スイスでいちばん大きい町で、銀行とチョコレートが有名です。"],
"日内瓦":["Geneva","瑞士","Geneva has a giant fountain on its lake and the UN's European headquarters.","湖に大きな噴水があり、国連のヨーロッパ本部もあります。"],
"采尔马特":["Zermatt","瑞士","Zermatt is a ski town below the Matterhorn. Gasoline cars are not allowed.","マッターホルンのふもとのスキーの町です。ガソリン車は走れません。"],
"巴黎":["Paris","法国","Paris is the capital of France, with the Eiffel Tower and the Louvre.","フランスの首都で、エッフェル塔とルーブル美術館があります。"],
"尼斯":["Nice","法国","Nice is on the Mediterranean \"Blue Coast,\" where the sea is very blue.","地中海の「コート・ダジュール」にあり、海がとても青いです。"],

"里昂":["Lyon","法国","Lyon is called the food capital of France.","フランスのグルメの都と呼ばれています。"],
"波尔多":["Bordeaux","法国","Bordeaux is a world-famous wine region.","世界的に有名なワインの産地です。"],
"伦敦":["London","英国","London is the capital of the United Kingdom, with Big Ben and the London Eye.","イギリスの首都で、ビッグ・ベンとロンドン・アイがあります。"],
"爱丁堡":["Edinburgh","英国","Edinburgh is the capital of Scotland, with an old castle on the hill.","スコットランドの首都で、丘の上に古いお城があります。"],
"曼彻斯特":["Manchester","英国","Manchester has two world-famous football teams.","世界的に有名なサッカーチームが二つあります。"],
"牛津":["Oxford","英国","Oxford is a university city with more than 900 years of history.","九百年以上の歴史がある大学の町です。"],
"马德里":["Madrid","西班牙","Madrid is the capital of Spain, with the Prado Museum and the Royal Palace.","スペインの首都で、プラド美術館と王宮があります。"],
"巴塞罗那":["Barcelona","西班牙","Gaudí's Sagrada Família has been under construction for over a hundred years.","ガウディのサグラダ・ファミリアは、百年以上たってもまだ工事中です。"],
"塞维利亚":["Seville","西班牙","Seville is the home of flamenco.","フラメンコのふるさとです。"],
"瓦伦西亚":["Valencia","西班牙","Valencia is the birthplace of paella.","パエリアが生まれた町です。"],
"罗马":["Rome","意大利","Rome is the capital of Italy, with the 2,000-year-old Colosseum. \"Rome wasn't built in a day.\"","イタリアの首都で、二千年前のコロッセオがあります。「ローマは一日にして成らず」。"],
"威尼斯":["Venice","意大利","Venice is built on water. People travel by gondola.","水の上の町で、ゴンドラで移動します。"],
"佛罗伦萨":["Florence","意大利","Florence is the birthplace of the Renaissance, full of art.","ルネサンスが生まれた町で、芸術作品がたくさんあります。"],
"米兰":["Milan","意大利","Milan is a world fashion capital with a fashion week every year.","世界のファッションの都で、毎年ファッションウィークがあります。"],
"巴西利亚":["Brasília","巴西","Brasília was built on empty land in 1960. The city is shaped like an airplane.","1960年に何もない土地に作られた首都で、町の形が飛行機に似ています。"],
"里约热内卢":["Rio de Janeiro","巴西","Rio de Janeiro has the Christ statue on the mountain and a lively carnival.","山の上のキリスト像と、にぎやかなカーニバルがあります。"],
"圣保罗":["São Paulo","巴西","São Paulo is the largest city in South America. Many descendants of Japanese immigrants live there.","南米でいちばん大きい町で、日系人がたくさん住んでいます。"],
"马瑙斯":["Manaus","巴西","Manaus is a city in the middle of the Amazon rainforest.","アマゾンの熱帯雨林の中にある町です。"],
"墨西哥城":["Mexico City","墨西哥","Mexico City was built on an ancient lake. It was once the capital of the Aztec Empire.","昔の湖の上に作られた大きな町で、アステカ帝国の都でした。"],
"坎昆":["Cancún","墨西哥","Cancún is a holiday resort on the Caribbean Sea.","カリブ海のリゾートです。"],
"瓜纳华托":["Guanajuato","墨西哥","Guanajuato is a small city with colorful houses all over the hills.","坂にカラフルな家がならぶ小さな町です。"],
"瓜达拉哈拉":["Guadalajara","墨西哥","Guadalajara is the home of mariachi music.","マリアッチ音楽のふるさとです。"],
"华盛顿":["Washington, D.C.","美国","Washington, D.C. is the capital of the United States, with the White House and the Capitol.","アメリカの首都で、ホワイトハウスと国会議事堂があります。"],
"纽约":["New York","美国","New York is the largest city in the United States, with the Statue of Liberty.","アメリカでいちばん大きい町で、自由の女神があります。"],
"洛杉矶":["Los Angeles","美国","Hollywood is in Los Angeles, and many movie stars live there.","ハリウッドがあり、映画スターがたくさん住んでいます。"],
"旧金山":["San Francisco","美国","San Francisco has the red Golden Gate Bridge and is often foggy.","赤いゴールデンゲートブリッジがあり、よく霧が出ます。"],
"渥太华":["Ottawa","加拿大","Ottawa is the capital of Canada. In winter its canal becomes a very long skating rink.","カナダの首都です。冬は運河がとても長いスケートリンクになります。"],
"多伦多":["Toronto","加拿大","Toronto is Canada's largest city, with the tall CN Tower.","カナダでいちばん大きい町で、高いCNタワーがあります。"],
"温哥华":["Vancouver","加拿大","Vancouver lies between the mountains and the sea.","山と海にかこまれた町です。"],
"魁北克城":["Quebec City","加拿大","Quebec City is an old French-speaking city whose streets look like Europe.","フランス語を話す古い町で、ヨーロッパのような町並みです。"],
"河内":["Hanoi","越南","Hanoi is the capital of Vietnam, with Hoan Kiem Lake and the Old Quarter. There are lots of motorbikes on the roads.","ベトナムの首都です。ホアンキエム湖と旧市街があり、道にはバイクがとても多いです。"],
"下龙湾":["Ha Long Bay","越南","In Ha Long Bay, more than a thousand limestone islands rise from the sea. It is a World Heritage Site.","海に千以上の岩の島が立っていて、世界遺産です。"],

"会安":["Hoi An","越南","Hoi An is an old port town filled with colorful lanterns at night.","古い港町で、夜はカラフルなちょうちんでいっぱいです。"],
"胡志明市":["Ho Chi Minh City","越南","Ho Chi Minh City, once called Saigon, is Vietnam's largest and liveliest city.","ベトナムでいちばん大きい町で、昔はサイゴンと呼ばれていました。とてもにぎやかです。"],
"曼谷":["Bangkok","泰国","Bangkok is the capital of Thailand, with the golden Grand Palace and floating markets.","タイの首都で、金色にかがやく王宮と水上マーケットがあります。"],
"大城":["Ayutthaya","泰国","Ayutthaya was the capital of an old kingdom and has many ruins of ancient temples.","昔の王朝の都で、古いお寺の遺跡がたくさんあります。"],
"清迈":["Chiang Mai","泰国","Chiang Mai is an old city in the north where you can visit elephant sanctuaries.","北の古い町で、ゾウの保護センターに行けます。"],
"普吉岛":["Phuket","泰国","Phuket is Thailand's largest island, famous for its beaches.","タイでいちばん大きい島で、海岸が有名です。"],
"新加坡":["Singapore","新加坡","Singapore is a city that is also a country. It is clean and neat, and is called the \"Garden City.\"","一つの町がそのまま一つの国です。きれいで整っていて、「ガーデンシティ」と呼ばれています。"],
"滨海湾":["Marina Bay","新加坡","Marina Bay has a hotel with three towers joined at the top, and glowing Supertrees.","屋上がつながった三つのビルのホテルと、光るスーパーツリーがあります。"],
"圣淘沙":["Sentosa","新加坡","Sentosa is a holiday island with an amusement park and beaches.","遊園地と海岸があるリゾートの島です。"],
"牛车水":["Chinatown","新加坡","Chinatown in Singapore is full of street food.","シンガポールのチャイナタウンで、屋台の食べ物がとても多いです。"],
"惠灵顿":["Wellington","新西兰","Wellington is the capital of New Zealand. It is so windy that it is called the \"Windy City.\"","ニュージーランドの首都です。風がとても強くて「風の町」と呼ばれています。"],
"奥克兰":["Auckland","新西兰","Auckland is New Zealand's largest city, with a harbor full of sailboats.","ニュージーランドでいちばん大きい町で、港にヨットがたくさんあります。"],
"罗托鲁瓦":["Rotorua","新西兰","Rotorua is a city of hot springs, where you can also see traditional Māori culture.","温泉の町で、マオリの伝統文化も見られます。"],
"皇后镇":["Queenstown","新西兰","Queenstown is the adventure capital, where you can try bungee jumping and paragliding.","冒険の町で、バンジージャンプやパラグライダーができます。"],
"阿布扎比":["Abu Dhabi","阿联酋","Abu Dhabi is the capital of the UAE, with the white Sheikh Zayed Grand Mosque.","アラブ首長国連邦の首都で、真っ白なシェイク・ザイード・モスクがあります。"],
"迪拜":["Dubai","阿联酋","Dubai has the world's tallest building, the Burj Khalifa.","世界でいちばん高いビル、ブルジュ・ハリファがあります。"],
"沙迦":["Sharjah","阿联酋","Sharjah is called the cultural capital of the UAE and has many museums.","UAEの文化の都と呼ばれ、博物館がたくさんあります。"],
"阿莱茵":["Al Ain","阿联酋","Al Ain is an oasis city in the desert with many date palm trees.","砂漠の中のオアシスの町で、ナツメヤシの木がたくさんあります。"],
"开罗":["Cairo","埃及","Cairo is the capital of Egypt. Just outside the city are the Pyramids of Giza and the Sphinx.","エジプトの首都で、町のすぐ外にギザのピラミッドとスフィンクスがあります。"],
"亚历山大":["Alexandria","埃及","Alexandria is an ancient city on the Mediterranean that once had the world's largest library.","地中海の古い町で、昔は世界でいちばん大きい図書館がありました。"],
"卢克索":["Luxor","埃及","Luxor has more ancient Egyptian temples than anywhere else. It is called an open-air museum.","古代エジプトの神殿がいちばん多い場所で、「屋外博物館」と呼ばれています。"],
"阿斯旺":["Aswan","埃及","Aswan is on the upper Nile, where you can sail on the river. The Nile is one of the longest rivers in the world.","ナイル川の上流の町で、帆船で川を旅できます。ナイル川は世界でいちばん長い川の一つです。"],
"内罗毕":["Nairobi","肯尼亚","Nairobi is the capital of Kenya. Next to the city is a national park where you can see giraffes.","ケニアの首都で、町のとなりにキリンが見られる国立公園があります。"],
"纳库鲁":["Nakuru","肯尼亚","At Lake Nakuru you can often see huge flocks of flamingos.","湖でよくフラミンゴのむれが見られます。"],
"马赛马拉":["Maasai Mara","肯尼亚","Maasai Mara is a great grassland where over a million wildebeest migrate each year, and there are many lions.","大草原で、毎年百万頭以上のヌーが大移動します。ライオンもたくさんいます。"],
"蒙巴萨":["Mombasa","肯尼亚","Mombasa is a port city on the Indian Ocean with white sandy beaches.","インド洋の港町で、白い砂浜があります。"],
"比勒陀利亚":["Pretoria","南非","South Africa has three capitals, and Pretoria is the administrative one. In spring the city is full of purple jacaranda flowers.","南アフリカには首都が三つあり、ここは行政の首都です。春は町じゅうがむらさきのジャカランダの花でいっぱいです。"],
"约翰内斯堡":["Johannesburg","南非","Johannesburg grew into a big city after gold was discovered there.","金が見つかってできた大きな町です。"],
"德班":["Durban","南非","Durban is a surfing city on the Indian Ocean.","インド洋のサーフィンの町です。"],
"开普敦":["Cape Town","南非","Cape Town has Table Mountain, flat like a table, and penguins live by the sea.","テーブルのように平らなテーブルマウンテンがあり、海べにはペンギンが住んでいます。"],
"阿布贾":["Abuja","尼日利亚","Abuja became Nigeria's capital in 1991, replacing Lagos. Huge Zuma Rock stands outside the city.","1991年にラゴスから首都がうつされました。町の外に大きなズマ・ロックがあります。"],
"卡诺":["Kano","尼日利亚","Kano is a thousand-year-old city in the north with ancient dye pits.","北の千年の古い町で、昔からの布をそめる池があります。"],

"拉各斯":["Lagos","尼日利亚","Lagos is one of the most populous cities in Africa, and African pop music is very popular here.","アフリカで人口がいちばん多い町の一つで、アフリカのポップ音楽がとても人気です。"],
"卡拉巴尔":["Calabar","尼日利亚","Every Christmas, Calabar holds one of Africa's biggest street carnival parades.","毎年クリスマスに、アフリカでいちばん大きいパレードの一つがあります。"],
"雅典":["Athens","希腊","Athens is the capital of Greece. The Parthenon on the hill is over 2,000 years old, and the first modern Olympics were held here.","ギリシャの首都です。丘の上に二千年以上前のパルテノン神殿があり、第一回の近代オリンピックもここで開かれました。"],
"塞萨洛尼基":["Thessaloniki","希腊","Thessaloniki is Greece's second largest city, with a White Tower by the sea.","ギリシャで二番目に大きい町で、海のそばに白い塔があります。"],
"奥林匹亚":["Olympia","希腊","Olympia is where the ancient Olympic Games were held. The Olympic flame is still lit here today.","古代オリンピックが開かれた場所で、今もオリンピックの聖火はここで点けられます。"],
"圣托里尼":["Santorini","希腊","On Santorini, white houses with blue roofs line the volcanic cliffs, and the sunsets are beautiful.","白いかべと青い屋根の家が火山のがけにならんでいて、夕日がとてもきれいです。"],
"斯德哥尔摩":["Stockholm","瑞典","Stockholm is built on fourteen islands. Most of the Nobel Prizes are awarded here.","十四の島の上に作られた首都で、ノーベル賞のほとんどがここで授与されます。"],
"乌普萨拉":["Uppsala","瑞典","Uppsala has the oldest university in the Nordic countries.","北欧でいちばん古い大学があります。"],
"基律纳":["Kiruna","瑞典","Kiruna is a small town inside the Arctic Circle where you can see the northern lights in winter.","北極圏の中の小さな町で、冬はオーロラが見られます。"],
"哥德堡":["Gothenburg","瑞典","Gothenburg is a port city on the west coast, famous for seafood.","西の海岸の港町で、海産物が有名です。"],
"布宜诺斯艾利斯":["Buenos Aires","阿根廷","Buenos Aires is the capital of Argentina and the birthplace of tango.","アルゼンチンの首都で、タンゴが生まれた町です。"],
"伊瓜苏":["Iguazú Falls","阿根廷","The huge Iguazú Falls are on the border between Argentina and Brazil.","アルゼンチンとブラジルの国境に、大きなイグアスの滝があります。"],
"乌斯怀亚":["Ushuaia","阿根廷","Ushuaia is one of the southernmost cities in the world. Ships leave from here for Antarctica.","世界でいちばん南にある町の一つで、ここから船で南極に行けます。"],
"门多萨":["Mendoza","阿根廷","Mendoza is a wine region at the foot of the Andes.","アンデス山脈のふもとのワインの産地です。"],
"圣地亚哥":["Santiago","智利","Santiago is the capital of Chile. Behind the city are the snowy Andes Mountains.","チリの首都で、町のうしろに雪の積もったアンデス山脈があります。"],
"瓦尔帕莱索":["Valparaíso","智利","Valparaíso is a port city whose hillsides are covered with colorful murals.","坂にカラフルな壁画がたくさんかかれた港町です。"],
"阿塔卡马":["Atacama","智利","Atacama is one of the driest deserts in the world, with a beautiful starry sky at night.","世界でいちばん乾いた砂漠の一つで、夜の星空がとてもきれいです。"],
"复活节岛":["Easter Island","智利","Easter Island is a small island in the Pacific with nearly a thousand giant moai statues.","太平洋の小さな島で、千近くの大きなモアイ像があります。"]
};
var KEYS = Object.keys(PL).sort(function(a, b){ return b.length - a.length; });

function E(s){ return typeof esc === "function" ? esc(String(s)) : String(s); }

// 先认标题开头的名字（「🥟 牛车水 （🇸🇬 新加坡）」→ 牛车水），认不出再在整段里找
function findName(text){
  var head = text.split("（")[0].trim().split(/\s+/).pop();
  if (PL[head]) return head;
  var part = text.split("（")[0];
  for (var i = 0; i < KEYS.length; i++) if (part.indexOf(KEYS[i]) >= 0) return KEYS[i];
  for (var k = 0; k < KEYS.length; k++) if (text.indexOf(KEYS[k]) >= 0) return KEYS[k];
  return null;
}


// ---------- 朗读 ----------
function say(t, lang, slow){
  if (!window.speechSynthesis) { alert("这个浏览器不支持朗读"); return; }
  speechSynthesis.cancel();
  var u = new SpeechSynthesisUtterance(t);
  u.lang = lang; u.rate = slow ? 0.7 : 0.9;
  var vs = speechSynthesis.getVoices() || [], re = lang === "ja-JP" ? /^ja/i : /^en[-_]US/i;
  var v = vs.filter(function(x){ return re.test(x.lang); })[0] || (lang !== "ja-JP" ? vs.filter(function(x){ return /^en/i.test(x.lang); })[0] : null);
  if (v) u.voice = v;
  speechSynthesis.speak(u);
}
document.addEventListener("click", function(e){
  var b = e.target.closest && e.target.closest("[data-en],[data-ja]");
  if (!b) return;
  e.preventDefault(); e.stopPropagation();
  if (b.hasAttribute("data-en")) say(b.getAttribute("data-en"), "en-US", b.hasAttribute("data-slow"));
  else say(b.getAttribute("data-ja"), "ja-JP", b.hasAttribute("data-slow"));
}, true);

// ---------- 加到大富翁的事件框和首都表里 ----------
function enhance(){
  var ev = document.getElementById("mono-ev");
  if (!ev) return;
  var q = ev.querySelector(".qhead");
  if (q && !(q.nextElementSibling && q.nextElementSibling.classList.contains("en-row"))) {
    var key = findName(q.textContent);
    if (key) {
      var p = PL[key];
      // 1) 英语地名
      var row = document.createElement("div");
      row.className = "row en-row";

      row.innerHTML = '<span class="lbl" style="background:var(--blue-bg);color:var(--blue)">英语</span>' +
        '<b style="font-size:17px">' + E(p[0]) + '</b> <button class="mini" data-en="' + E(p[0]) + '">🔊</button>' +
        ' <button class="mini" data-en="' + E(p[0]) + '" data-slow>🐢</button>' +
        ' <span class="muted">· ' + E(CT[p[1]] || "") + '</span>';
      q.parentNode.insertBefore(row, q.nextSibling);
      // 2) 中文介绍下面：英语、日语翻译
      var intro = row.nextElementSibling;
      if (intro && intro.tagName === "DIV" && !intro.className) {
        var tr = document.createElement("div");
        tr.className = "tr-box";
        tr.style.cssText = "background:#f7f6f2;border-radius:8px;padding:8px 12px;margin:6px 0;line-height:1.8";
        tr.innerHTML =
          '<div>🇬🇧 ' + E(p[2]) + ' <button class="mini" data-en="' + E(p[2]) + '">🔊</button></div>' +
          '<div>🇯🇵 ' + E(p[3]) + ' <button class="mini" data-ja="' + E(p[3]) + '">🔊</button></div>';
        intro.parentNode.insertBefore(tr, intro.nextSibling);
      }
    }
  }
  // 3) 「🗺️ 首都」表格：每个首都下面加英语名
  ev.querySelectorAll("table td:first-child").forEach(function(td){
    if (td.querySelector(".en2")) return;
    var key = findName(td.textContent);
    if (!key) return;
    var d = document.createElement("div");
    d.className = "muted en2";
    d.innerHTML = E(PL[key][0]) + ' <button class="mini" data-en="' + E(PL[key][0]) + '">🔊</button>';
    td.appendChild(d);
  });
}

var pending = false;
new MutationObserver(function(){

  if (pending) return;
  pending = true;
  requestAnimationFrame(function(){ pending = false; enhance(); });
}).observe(document.body, {childList:true, subtree:true});

})();
