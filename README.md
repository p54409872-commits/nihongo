# 日语练习册（yueyue 和姐姐的 PK 练习网站）

网址：https://p54409872-commits.github.io/nihongo/

## 文件说明（index.html 里按这个顺序加载，顺序不能改）

| 文件 | 作用 |
|---|---|
| index.html | 页面骨架、样式、Firebase 配置，按顺序加载下面的脚本 |
| data.js | 动词、课程单元、易混淆题、填空题、变形规则、技巧手册 |
| words.js | 追加的延展动词（VERBS.push） |
| app.js | 核心：变形引擎、出题、判分、错题复习（1/3/7/10/21天）、登录、云同步、页面渲染 |
| pk.js | PK（比正确率，每天50题达标）和每日结果、偷懒提醒 |
| travel.js | 环游世界跑道和世界地图（用 d3 + topojson） |
| ai.js | AI 聊天「さくら先生」（Gemini API） |
| pin.js | 每个人的4位密码 |
| cityinfo.js | 城市介绍、当地时间、季节、英文名 |
| shuffle.js | 题目洗牌、重刷单元 |
| more.js | 新题型（同词辨形、整句翻译、改错、反向辨认、JLPT仿真）和数据备份 |
| season.js / en.js | 已合并进 cityinfo.js，没有被加载，可以忽略 |
| game.js | 游戏中心（60秒挑战、掉落分类、消消乐、句子拼图）和徽章 |

后面的文件通过 `window.函数名 = function(){...}` 覆盖前面文件的同名函数来增加功能。

## 数据存在哪里（不在代码里）

- Firebase 项目：nihongo-37daf（Cloud Firestore，免费 Spark 方案）
- `rooms/{网站密码}`：两个人的名字 names、个人密码哈希 pins、AI 密钥 aiKey
- `rooms/{网站密码}/players/{yueyue 或 jiejie}`：字段 json 里是这个人的全部进度（对象 S）
- 浏览器 localStorage 里有本机缓存（以 jp- 开头）
- 页面最下面的「数据备份」可以把两个人的进度下载成 json 文件

## Firestore 安全规则


    rules_version = '2';
    service cloud.firestore {
      match /databases/{database}/documents {
        match /rooms/{room} {
          allow get, create, update: if room.size() >= 8;
          match /players/{player} {
            allow get, create, update: if room.size() >= 8 && player in ['yueyue', 'jiejie'];
          }
        }
      }
    }

## 修改代码时必须遵守（否则会弄坏旧数据）

1. VERBS、CONF、FILL、FIXQ、JLPTQ、WRITEQ 等题库数组：只能在最后追加，不能删除、不能调换顺序（错题复习是按位置记录的）。
2. 新增的数据字段要在 app.js 的 normalize() 里补默认值，让旧数据也能用。
3. 不要改选手的 id（yueyue、jiejie），名字可以改。
4. 不要换 Firebase 项目，不要删除 rooms 里的数据。
5. AI 密钥绝对不要写进代码（项目是公开的），它存在 Firestore 里。

## 用到的外部服务

- GitHub Pages（网站托管）
- Firebase Cloud Firestore（数据同步）
- Google Gemini API 免费层（AI 聊天和整句批改，密钥在 Google AI Studio 申请）
- jsDelivr（d3、topojson、世界地图数据）

注意：中国大陆通常无法访问 GitHub Pages、Firebase 和 Gemini。
