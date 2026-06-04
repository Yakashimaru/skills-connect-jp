export const SOCIAL_SKILLS = new Set([
  'companion', 'conversation', 'dining',
  'travel partner', 'activity partner', 'event date', 'study partner', 'friendship',
])

// Japanese display labels for values stored in DB as English strings.
// Each array is index-aligned with its English counterpart in EditProfile.tsx.

const TRAITS_EN = [
  'Adaptable','Adventurous','Ambitious','Ambivert','Analytical',
  'Calm','Caring','Cheerful','Compassionate','Confident','Considerate','Curious',
  'Detail-oriented','Diligent','Direct','Disciplined',
  'Easygoing','Emotional','Empathetic','Energetic','Extrovert',
  'Friendly',
  'Honest','Humble','Humorous',
  'Independent','Introvert',
  'Logical','Loyal',
  'Open-minded','Optimistic','Organised',
  'Passionate','Patient','Perfectionist','Persistent',
  'Reliable','Reserved','Responsible',
  'Sensitive','Spontaneous','Supportive',
  'Thoughtful',
]
const TRAITS_JA = [
  '適応力がある','冒険好き','向上心がある','両向的','分析的',
  '穏やか','思いやり','明るい','慈悲深い','自信がある','気遣いができる','好奇心旺盛',
  '細部重視','勤勉','率直','自律している',
  'おおらか','感情的','共感力が高い','エネルギッシュ','外向的',
  '友好的',
  '正直','謙虚','ユーモアがある',
  '自立している','内向的',
  '論理的','誠実',
  'オープンマインド','楽観的','几帳面',
  '情熱的','辛抱強い','完璧主義','粘り強い',
  '頼りになる','控えめ','責任感がある',
  '感受性豊か','自発的','サポーティブ',
  '思慮深い',
]

const INTERESTS_EN = [
  'Anime & Manga','Art',
  'Baking','Business',
  'Cooking','Cycling',
  'Dancing','Diving','DIY',
  'Economics',
  'Fashion','Finance','Fitness','Food',
  'Gaming','Gardening','Golf',
  'Hiking','History','Horse riding',
  'Investing',
  'Journaling',
  'Languages',
  'Martial arts','Meditation','Music',
  'Nature','Networking',
  'Painting','Pets','Philosophy','Photography','Poetry','Psychology',
  'Reading','Rock climbing','Running',
  'Science','Singing','Skiing','Socialising','Spirituality','Sports','Startups','Surfing','Swimming',
  'Tech','Tennis','Travel',
  'Volunteering',
  'Wellness','Wine & Dining','Writing',
  'Yoga',
]
const INTERESTS_JA = [
  'アニメ・マンガ','アート',
  'お菓子作り','ビジネス',
  '料理','サイクリング',
  'ダンス','ダイビング','DIY',
  '経済',
  'ファッション','ファイナンス','フィットネス','食',
  'ゲーム','ガーデニング','ゴルフ',
  'ハイキング','歴史','乗馬',
  '投資',
  'ジャーナリング',
  '語学',
  '武道','瞑想','音楽',
  '自然','ネットワーキング',
  '絵画','ペット','哲学','写真','詩','心理学',
  '読書','ロッククライミング','ランニング',
  '科学','歌','スキー','社交','スピリチュアリティ','スポーツ','スタートアップ','サーフィン','水泳',
  'テクノロジー','テニス','旅行',
  'ボランティア',
  'ウェルネス','ワイン・グルメ','ライティング',
  'ヨガ',
]

const SKILLS_EN = [
  'Advisory','App development','Assistance',
  'Business',
  'Coaching','Coder','Communication support','Cooking','Copywriting',
  'Data analysis','Designer','Dog Walker',
  'English','Event planning',
  'Finance','Fitness','French',
  'Golf','Graphic design',
  'Housekeeper',
  'Investing','Interpreter','IT support',
  'Japanese',
  'Korean',
  'Mandarin','Marketer','Marketing','Martial arts','Mentorship','Music instructor','Musician',
  'Personal Shopper','Personal training','Photographer','Presentation','Private Hire',
  'Spanish','Sports instructor',
  'Tour guide','Travel assistance','Tutor',
  'Video editing','Videographer',
  'Web development',
]
const SKILLS_JA = [
  'アドバイザリー','アプリ開発','アシスタンス',
  'ビジネス',
  'コーチング','コーダー','コミュニケーションサポート','料理','コピーライティング',
  'データ分析','デザイナー','ドッグウォーカー',
  '英語','イベント企画',
  'ファイナンス','フィットネス','フランス語',
  'ゴルフ','グラフィックデザイン',
  'ハウスキーパー',
  '投資','通訳','ITサポート',
  '日本語',
  '韓国語',
  '中国語','マーケター','マーケティング','武道','メンタリング','音楽インストラクター','ミュージシャン',
  'パーソナルショッパー','パーソナルトレーニング','フォトグラファー','プレゼンテーション','プライベートハイヤー',
  'スペイン語','スポーツインストラクター',
  'ツアーガイド','旅行サポート','個別指導',
  '動画編集','ビデオグラファー',
  'ウェブ開発',
]

const SOCIAL_EN = [
  'Activity Partner','Companion','Conversation',
  'Dining','Event Date','Friendship','Study Partner','Travel Partner',
]
const SOCIAL_JA = [
  'アクティビティパートナー','コンパニオン','会話',
  'ダイニング','イベントデート','フレンドシップ','スタディパートナー','トラベルパートナー',
]

const SKILLS_ZH = [
  '顾问','应用开发','协助',
  '商业',
  '辅导','程序员','沟通支持','烹饪','文案写作',
  '数据分析','设计师','遛狗',
  '英语','活动策划',
  '金融','健身','法语',
  '高尔夫','平面设计',
  '管家服务',
  '投资','口译','IT支持',
  '日语',
  '韩语',
  '普通话','营销人员','营销','武术','导师辅导','音乐老师','音乐人',
  '私人买手','私人训练','摄影师','演讲','私人雇佣',
  '西班牙语','运动教练',
  '导游','旅行协助','家教',
  '视频剪辑','摄像师',
  '网页开发',
]

const SOCIAL_ZH = [
  '活动伙伴','陪伴','对话交流',
  '餐饮约伴','活动约伴','友谊','学习伙伴','旅行伙伴',
]

const TRAITS_ZH = [
  '适应力强','爱冒险','有抱负','双向型','分析型',
  '冷静','有爱心','开朗','富有同情心','自信','体贴','好奇心强',
  '注重细节','勤奋','直接','自律',
  '随和','感性','共情力强','充满活力','外向',
  '友好',
  '诚实','谦逊','幽默',
  '独立','内向',
  '逻辑性强','忠诚',
  '思想开放','乐观','有条理',
  '热情','有耐心','完美主义','坚持不懈',
  '可靠','内敛','负责任',
  '敏感','自发','善于支持',
  '体贴周到',
]

const INTERESTS_ZH = [
  '动漫与漫画','艺术',
  '烘焙','商业',
  '烹饪','骑行',
  '舞蹈','潜水','DIY',
  '经济学',
  '时尚','金融','健身','美食',
  '游戏','园艺','高尔夫',
  '徒步','历史','骑马',
  '投资',
  '写日记',
  '语言',
  '武术','冥想','音乐',
  '自然','社交网络',
  '绘画','宠物','哲学','摄影','诗歌','心理学',
  '阅读','攀岩','跑步',
  '科学','唱歌','滑雪','社交','灵性','运动','创业','冲浪','游泳',
  '科技','网球','旅行',
  '志愿服务',
  '健康养生','美酒佳肴','写作',
  '瑜伽',
]

function buildMap(en: string[], ja: string[]): Record<string, string> {
  const map: Record<string, string> = {}
  en.forEach((k, i) => { map[k] = ja[i] })
  return map
}

export const JA_CITY: Record<string, string> = {
  Tokyo:'東京',
  // Hokkaido
  Sapporo:'札幌市', Asahikawa:'旭川市', Hakodate:'函館市', Kushiro:'釧路市',
  Obihiro:'帯広市', Kitami:'北見市', Tomakomai:'苫小牧市', Otaru:'小樽市',
  Ebetsu:'江別市', Chitose:'千歳市', Wakkanai:'稚内市', Nemuro:'根室市',
  Furano:'富良野市', Noboribetsu:'登別市', Abashiri:'網走市', Yubari:'夕張市',
  // Aomori
  Aomori:'青森市', Hachinohe:'八戸市', Hirosaki:'弘前市', Towada:'十和田市',
  Mutsu:'むつ市', Misawa:'三沢市',
  // Iwate
  Morioka:'盛岡市', Ichinoseki:'一関市', Hanamaki:'花巻市', Kamaishi:'釜石市',
  Miyako:'宮古市', Kuji:'久慈市',
  // Miyagi
  Sendai:'仙台市', Ishinomaki:'石巻市', Natori:'名取市', Shiogama:'塩竈市',
  Kesennuma:'気仙沼市',
  // Akita
  Akita:'秋田市', Yokote:'横手市', Noshiro:'能代市', Kazuno:'鹿角市',
  // Yamagata
  Yamagata:'山形市', Yonezawa:'米沢市', Tsuruoka:'鶴岡市', Sakata:'酒田市',
  // Fukushima
  Fukushima:'福島市', Koriyama:'郡山市', Iwaki:'いわき市', Aizuwakamatsu:'会津若松市',
  Shirakawa:'白河市',
  // Ibaraki
  Mito:'水戸市', Tsukuba:'つくば市', Hitachi:'日立市', Tsuchiura:'土浦市',
  Toride:'取手市',
  // Tochigi
  Utsunomiya:'宇都宮市', Ashikaga:'足利市', Sano:'佐野市', Nikko:'日光市',
  // Gunma
  Maebashi:'前橋市', Takasaki:'高崎市', Isesaki:'伊勢崎市', Kiryu:'桐生市',
  // Saitama
  Saitama:'さいたま市', Kawaguchi:'川口市', Kawagoe:'川越市', Koshigaya:'越谷市',
  Tokorozawa:'所沢市', Kumagaya:'熊谷市', Iruma:'入間市', Kuki:'久喜市',
  // Chiba
  Chiba:'千葉市', Funabashi:'船橋市', Matsudo:'松戸市', Kashiwa:'柏市',
  Ichikawa:'市川市', Urayasu:'浦安市', Narita:'成田市', Tateyama:'館山市',
  // Tokyo wards
  Shinjuku:'新宿区', Shibuya:'渋谷区', Minato:'港区', Chiyoda:'千代田区',
  Chuo:'中央区', Bunkyo:'文京区', Toshima:'豊島区', Sumida:'墨田区',
  Koto:'江東区', Taito:'台東区', Nerima:'練馬区', Nakano:'中野区',
  Suginami:'杉並区', Setagaya:'世田谷区', Shinagawa:'品川区', Adachi:'足立区',
  Edogawa:'江戸川区',
  // Tokyo cities
  Hachioji:'八王子市', Machida:'町田市', Tachikawa:'立川市', Fuchu:'府中市',
  Musashino:'武蔵野市', Mitaka:'三鷹市', Ome:'青梅市',
  // Kanagawa
  Yokohama:'横浜市', Kawasaki:'川崎市', Sagamihara:'相模原市', Fujisawa:'藤沢市',
  Yokosuka:'横須賀市', Hiratsuka:'平塚市', Odawara:'小田原市', Kamakura:'鎌倉市',
  Ebina:'海老名市', Zushi:'逗子市',
  // Niigata
  Niigata:'新潟市', Nagaoka:'長岡市', Joetsu:'上越市', Sanjo:'三条市',
  // Toyama
  Toyama:'富山市', Takaoka:'高岡市', Himi:'氷見市', Kurobe:'黒部市',
  // Ishikawa
  Kanazawa:'金沢市', Komatsu:'小松市', Nanao:'七尾市', Wajima:'輪島市',
  // Fukui
  Fukui:'福井市', Sabae:'鯖江市', Tsuruga:'敦賀市', Obama:'小浜市',
  // Yamanashi
  Kofu:'甲府市', Fujiyoshida:'富士吉田市',
  // Nagano
  Nagano:'長野市', Matsumoto:'松本市', Ueda:'上田市', Iida:'飯田市',
  Suwa:'諏訪市', Saku:'佐久市', Azumino:'安曇野市', Shiojiri:'塩尻市',
  // Gifu
  Gifu:'岐阜市', Ogaki:'大垣市', Tajimi:'多治見市', Takayama:'高山市', Seki:'関市',
  // Shizuoka
  Shizuoka:'静岡市', Hamamatsu:'浜松市', Numazu:'沼津市', Fuji:'富士市',
  Mishima:'三島市', Atami:'熱海市', Kakegawa:'掛川市',
  // Aichi
  Nagoya:'名古屋市', Toyota:'豊田市', Okazaki:'岡崎市', Toyohashi:'豊橋市',
  Ichinomiya:'一宮市', Kasugai:'春日井市', Anjo:'安城市', Seto:'瀬戸市',
  Gamagori:'蒲郡市',
  // Mie
  Tsu:'津市', Yokkaichi:'四日市市', Ise:'伊勢市', Suzuka:'鈴鹿市',
  // Shiga
  Otsu:'大津市', Kusatsu:'草津市', Nagahama:'長浜市', Moriyama:'守山市',
  // Kyoto
  Kyoto:'京都市', Uji:'宇治市', Maizuru:'舞鶴市', Kameoka:'亀岡市',
  Fukuchiyama:'福知山市',
  // Osaka
  Osaka:'大阪市', Sakai:'堺市', Higashiosaka:'東大阪市', Hirakata:'枚方市',
  Toyonaka:'豊中市', Suita:'吹田市', Takatsuki:'高槻市', Neyagawa:'寝屋川市',
  Kishiwada:'岸和田市',
  // Hyogo
  Kobe:'神戸市', Amagasaki:'尼崎市', Nishinomiya:'西宮市', Himeji:'姫路市',
  Akashi:'明石市', Takarazuka:'宝塚市', Itami:'伊丹市', Ashiya:'芦屋市',
  Awaji:'淡路市', Toyooka:'豊岡市',
  // Nara
  Nara:'奈良市', Kashihara:'橿原市', Ikoma:'生駒市', Tenri:'天理市',
  // Wakayama
  Wakayama:'和歌山市', Shingu:'新宮市', Tanabe:'田辺市',
  // Tottori
  Tottori:'鳥取市', Yonago:'米子市',
  // Shimane
  Matsue:'松江市', Izumo:'出雲市', Hamada:'浜田市',
  // Okayama
  Okayama:'岡山市', Kurashiki:'倉敷市', Tsuyama:'津山市',
  // Hiroshima
  Hiroshima:'広島市', Fukuyama:'福山市', Kure:'呉市', Onomichi:'尾道市',
  Hatsukaichi:'廿日市市',
  // Yamaguchi
  Yamaguchi:'山口市', Shimonoseki:'下関市', Ube:'宇部市', Iwakuni:'岩国市',
  Hagi:'萩市',
  // Tokushima
  Tokushima:'徳島市', Naruto:'鳴門市', Anan:'阿南市',
  // Kagawa
  Takamatsu:'高松市', Marugame:'丸亀市', Kanonji:'観音寺市',
  // Ehime
  Matsuyama:'松山市', Imabari:'今治市', Niihama:'新居浜市', Uwajima:'宇和島市',
  // Kochi
  Kochi:'高知市', Nankoku:'南国市', Shimanto:'四万十市',
  // Fukuoka
  Fukuoka:'福岡市', Kitakyushu:'北九州市', Kurume:'久留米市', Dazaifu:'太宰府市',
  Onojo:'大野城市', Yanagawa:'柳川市',
  // Saga
  Saga:'佐賀市', Karatsu:'唐津市', Tosu:'鳥栖市',
  // Nagasaki
  Nagasaki:'長崎市', Sasebo:'佐世保市', Isahaya:'諫早市', Goto:'五島市',
  Tsushima:'対馬市',
  // Kumamoto
  Kumamoto:'熊本市', Yatsushiro:'八代市', Aso:'阿蘇市', Yamaga:'山鹿市',
  // Oita
  Oita:'大分市', Beppu:'別府市', Nakatsu:'中津市', Yufu:'由布市',
  // Miyazaki
  Miyazaki:'宮崎市', Miyakonojo:'都城市', Nobeoka:'延岡市', Hyuga:'日向市',
  // Kagoshima
  Kagoshima:'鹿児島市', Kirishima:'霧島市', Kanoya:'鹿屋市', Amami:'奄美市',
  Yakushima:'屋久島', Ibusuki:'指宿市',
  // Okinawa
  Naha:'那覇市', 'Okinawa City':'沖縄市', Urasoe:'浦添市', Ginowan:'宜野湾市',
  Nago:'名護市', Miyakojima:'宮古島市', Ishigaki:'石垣市', Yonaguni:'与那国町',
  Chatan:'北谷町',
}

export const ZH_CITY: Record<string, string> = {
  'Online only': '仅线上',
  Tokyo:'东京',
  // Hokkaido
  Sapporo:'札幌市', Asahikawa:'旭川市', Hakodate:'函馆市', Kushiro:'钏路市',
  Obihiro:'带广市', Kitami:'北见市', Tomakomai:'苫小牧市', Otaru:'小樽市',
  Ebetsu:'江别市', Chitose:'千岁市', Wakkanai:'稚内市', Nemuro:'根室市',
  Furano:'富良野市', Noboribetsu:'登别市', Abashiri:'网走市', Yubari:'夕张市',
  // Aomori
  Aomori:'青森市', Hachinohe:'八户市', Hirosaki:'弘前市', Towada:'十和田市',
  Mutsu:'陆奥市', Misawa:'三泽市',
  // Iwate
  Morioka:'盛冈市', Ichinoseki:'一关市', Hanamaki:'花卷市', Kamaishi:'釜石市',
  Miyako:'宫古市', Kuji:'久慈市',
  // Miyagi
  Sendai:'仙台市', Ishinomaki:'石卷市', Natori:'名取市', Shiogama:'盐竈市',
  Kesennuma:'气仙沼市',
  // Akita
  Akita:'秋田市', Yokote:'横手市', Noshiro:'能代市', Kazuno:'鹿角市',
  // Yamagata
  Yamagata:'山形市', Yonezawa:'米泽市', Tsuruoka:'鹤冈市', Sakata:'酒田市',
  // Fukushima
  Fukushima:'福岛市', Koriyama:'郡山市', Iwaki:'磐城市', Aizuwakamatsu:'会津若松市',
  Shirakawa:'白河市',
  // Ibaraki
  Mito:'水户市', Tsukuba:'筑波市', Hitachi:'日立市', Tsuchiura:'土浦市',
  Toride:'取手市',
  // Tochigi
  Utsunomiya:'宇都宫市', Ashikaga:'足利市', Sano:'佐野市', Nikko:'日光市',
  // Gunma
  Maebashi:'前桥市', Takasaki:'高崎市', Isesaki:'伊势崎市', Kiryu:'桐生市',
  // Saitama
  Saitama:'埼玉市', Kawaguchi:'川口市', Kawagoe:'川越市', Koshigaya:'越谷市',
  Tokorozawa:'所泽市', Kumagaya:'熊谷市', Iruma:'入间市', Kuki:'久喜市',
  // Chiba
  Chiba:'千叶市', Funabashi:'船桥市', Matsudo:'松户市', Kashiwa:'柏市',
  Ichikawa:'市川市', Urayasu:'浦安市', Narita:'成田市', Tateyama:'馆山市',
  // Tokyo wards
  Shinjuku:'新宿区', Shibuya:'涩谷区', Minato:'港区', Chiyoda:'千代田区',
  Chuo:'中央区', Bunkyo:'文京区', Toshima:'丰岛区', Sumida:'墨田区',
  Koto:'江东区', Taito:'台东区', Nerima:'练马区', Nakano:'中野区',
  Suginami:'杉并区', Setagaya:'世田谷区', Shinagawa:'品川区', Adachi:'足立区',
  Edogawa:'江户川区',
  // Tokyo cities
  Hachioji:'八王子市', Machida:'町田市', Tachikawa:'立川市', Fuchu:'府中市',
  Musashino:'武藏野市', Mitaka:'三鹰市', Ome:'青梅市',
  // Kanagawa
  Yokohama:'横滨市', Kawasaki:'川崎市', Sagamihara:'相模原市', Fujisawa:'藤泽市',
  Yokosuka:'横须贺市', Hiratsuka:'平冢市', Odawara:'小田原市', Kamakura:'镰仓市',
  Ebina:'海老名市', Zushi:'逗子市',
  // Niigata
  Niigata:'新潟市', Nagaoka:'长冈市', Joetsu:'上越市', Sanjo:'三条市',
  // Toyama
  Toyama:'富山市', Takaoka:'高冈市', Himi:'冰见市', Kurobe:'黑部市',
  // Ishikawa
  Kanazawa:'金泽市', Komatsu:'小松市', Nanao:'七尾市', Wajima:'轮岛市',
  // Fukui
  Fukui:'福井市', Sabae:'鲭江市', Tsuruga:'敦贺市', Obama:'小浜市',
  // Yamanashi
  Kofu:'甲府市', Fujiyoshida:'富士吉田市',
  // Nagano
  Nagano:'长野市', Matsumoto:'松本市', Ueda:'上田市', Iida:'饭田市',
  Suwa:'诹访市', Saku:'佐久市', Azumino:'安昙野市', Shiojiri:'盐尻市',
  // Gifu
  Gifu:'岐阜市', Ogaki:'大垣市', Tajimi:'多治见市', Takayama:'高山市', Seki:'关市',
  // Shizuoka
  Shizuoka:'静冈市', Hamamatsu:'滨松市', Numazu:'沼津市', Fuji:'富士市',
  Mishima:'三岛市', Atami:'热海市', Kakegawa:'掛川市',
  // Aichi
  Nagoya:'名古屋市', Toyota:'丰田市', Okazaki:'冈崎市', Toyohashi:'丰桥市',
  Ichinomiya:'一宫市', Kasugai:'春日井市', Anjo:'安城市', Seto:'濑户市',
  Gamagori:'蒲郡市',
  // Mie
  Tsu:'津市', Yokkaichi:'四日市市', Ise:'伊势市', Suzuka:'铃鹿市',
  // Shiga
  Otsu:'大津市', Kusatsu:'草津市', Nagahama:'长滨市', Moriyama:'守山市',
  // Kyoto
  Kyoto:'京都市', Uji:'宇治市', Maizuru:'舞鶴市', Kameoka:'龟冈市',
  Fukuchiyama:'福知山市',
  // Osaka
  Osaka:'大阪市', Sakai:'堺市', Higashiosaka:'东大阪市', Hirakata:'枚方市',
  Toyonaka:'豊中市', Suita:'吹田市', Takatsuki:'高槻市', Neyagawa:'寝屋川市',
  Kishiwada:'岸和田市',
  // Hyogo
  Kobe:'神户市', Amagasaki:'尼崎市', Nishinomiya:'西宫市', Himeji:'姬路市',
  Akashi:'明石市', Takarazuka:'宝冢市', Itami:'伊丹市', Ashiya:'芦屋市',
  Awaji:'淡路市', Toyooka:'丰冈市',
  // Nara
  Nara:'奈良市', Kashihara:'橿原市', Ikoma:'生驹市', Tenri:'天理市',
  // Wakayama
  Wakayama:'和歌山市', Shingu:'新宫市', Tanabe:'田边市',
  // Tottori
  Tottori:'鳥取市', Yonago:'米子市',
  // Shimane
  Matsue:'松江市', Izumo:'出云市', Hamada:'浜田市',
  // Okayama
  Okayama:'冈山市', Kurashiki:'仓敷市', Tsuyama:'津山市',
  // Hiroshima
  Hiroshima:'广岛市', Fukuyama:'福山市', Kure:'吴市', Onomichi:'尾道市',
  Hatsukaichi:'廿日市市',
  // Yamaguchi
  Yamaguchi:'山口市', Shimonoseki:'下关市', Ube:'宇部市', Iwakuni:'岩国市',
  Hagi:'萩市',
  // Tokushima
  Tokushima:'德岛市', Naruto:'鸣门市', Anan:'阿南市',
  // Kagawa
  Takamatsu:'高松市', Marugame:'丸龟市', Kanonji:'观音寺市',
  // Ehime
  Matsuyama:'松山市', Imabari:'今治市', Niihama:'新居滨市', Uwajima:'宇和岛市',
  // Kochi
  Kochi:'高知市', Nankoku:'南国市', Shimanto:'四万十市',
  // Fukuoka
  Fukuoka:'福冈市', Kitakyushu:'北九州市', Kurume:'久留米市', Dazaifu:'太宰府市',
  Onojo:'大野城市', Yanagawa:'柳川市',
  // Saga
  Saga:'佐贺市', Karatsu:'唐津市', Tosu:'鸟栖市',
  // Nagasaki
  Nagasaki:'长崎市', Sasebo:'佐世保市', Isahaya:'谏早市', Goto:'五岛市',
  Tsushima:'对马市',
  // Kumamoto
  Kumamoto:'熊本市', Yatsushiro:'八代市', Aso:'阿苏市', Yamaga:'山鹿市',
  // Oita
  Oita:'大分市', Beppu:'别府市', Nakatsu:'中津市', Yufu:'由布市',
  // Miyazaki
  Miyazaki:'宫崎市', Miyakonojo:'都城市', Nobeoka:'延冈市', Hyuga:'日向市',
  // Kagoshima
  Kagoshima:'鹿儿岛市', Kirishima:'雾岛市', Kanoya:'鹿屋市', Amami:'奄美市',
  Yakushima:'屋久岛', Ibusuki:'指宿市',
  // Okinawa
  Naha:'那霸市', 'Okinawa City':'冲绳市', Urasoe:'浦添市', Ginowan:'宜野湾市',
  Nago:'名护市', Miyakojima:'宫古岛市', Ishigaki:'石垣市', Yonaguni:'与那国町',
  Chatan:'北谷町',
}

export const STAR_SIGN_JA: Record<string, string> = {
  aries: '牡羊座', taurus: '牡牛座', gemini: '双子座', cancer: '蟹座',
  leo: '獅子座', virgo: '乙女座', libra: '天秤座', scorpio: '蠍座',
  sagittarius: '射手座', capricorn: '山羊座', aquarius: '水瓶座', pisces: '魚座',
}

export const TRAIT_JA   = buildMap(TRAITS_EN,   TRAITS_JA)
export const INTEREST_JA = buildMap(INTERESTS_EN, INTERESTS_JA)
export const SKILL_JA   = buildMap(SKILLS_EN,   SKILLS_JA)
export const SOCIAL_SKILL_JA = buildMap(SOCIAL_EN, SOCIAL_JA)
export const SKILL_ZH        = buildMap(SKILLS_EN,    SKILLS_ZH)
export const SOCIAL_SKILL_ZH = buildMap(SOCIAL_EN,    SOCIAL_ZH)
export const TRAIT_ZH        = buildMap(TRAITS_EN,    TRAITS_ZH)
export const INTEREST_ZH     = buildMap(INTERESTS_EN, INTERESTS_ZH)
