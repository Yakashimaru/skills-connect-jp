// Navbar — matches exact project dark maroon color scheme
// On /discover renders a filter bar with custom checkbox dropdown panels
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'

// ─── Project palette (matches rest of app exactly) ────────────────────────────
const C = {
  brand:    '#5C0A1E',   // deep maroon — primary brand
  brandDk:  '#3A0612',   // darkest maroon — hover states
  brandMd:  '#7A1030',   // mid maroon
  text:     '#1A0208',   // near-black maroon — headings / body text
  muted:    '#7A6060',   // muted text
  gold:     '#B8860B',   // gold accent
  goldDk:   '#9A6F09',   // gold hover
  cream:    '#FDF0E0',   // warm cream background
  border:   '#E8DDD5',   // warm border
  soft:     '#FDF8F2',   // softest bg for hover
}

const links = [
  { path: '/', label: 'nav.home' },
  { path: '/discover', label: 'nav.discover' },
  { path: '/meetups', label: 'nav.meetups' },
]

const howItWorksItems = [
  { hash: '#how-it-works', label: 'nav.how_it_works' },
  { hash: '#fees', label: 'nav.fees' },
  { hash: '#faq', label: 'nav.faq' },
]

// ─── Types ────────────────────────────────────────────────────────────────────
type OptionGroup = { group: string; groupKey?: string; items: { value: string; label: string }[] }
type FilterState = Record<string, boolean>

// ─── Japanese city name lookup (keyed by the romaji label stored in LOCATION_OPTIONS) ──
const JA_CITY: Record<string, string> = {
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

// ─── Filter data (location names are proper nouns — no translation needed) ────

const LOCATION_OPTIONS: OptionGroup[] = [
  { group: '🌐', items: [{ value: 'online', label: 'nav.loc_online' }] },
  { group: 'Hokkaido', groupKey: 'nav.loc_hokkaido', items: [
    { value: 'sapporo', label: 'Sapporo' }, { value: 'asahikawa', label: 'Asahikawa' },
    { value: 'hakodate', label: 'Hakodate' }, { value: 'kushiro', label: 'Kushiro' },
    { value: 'obihiro', label: 'Obihiro' }, { value: 'kitami', label: 'Kitami' },
    { value: 'tomakomai', label: 'Tomakomai' }, { value: 'otaru', label: 'Otaru' },
    { value: 'ebetsu', label: 'Ebetsu' }, { value: 'chitose', label: 'Chitose' },
    { value: 'wakkanai', label: 'Wakkanai' }, { value: 'nemuro', label: 'Nemuro' },
    { value: 'furano', label: 'Furano' }, { value: 'noboribetsu', label: 'Noboribetsu' },
    { value: 'abashiri', label: 'Abashiri' }, { value: 'yubari', label: 'Yubari' },
  ]},
  { group: 'Aomori', groupKey: 'nav.loc_aomori', items: [
    { value: 'aomori', label: 'Aomori' }, { value: 'hachinohe', label: 'Hachinohe' },
    { value: 'hirosaki', label: 'Hirosaki' }, { value: 'towada', label: 'Towada' },
    { value: 'mutsu', label: 'Mutsu' }, { value: 'misawa', label: 'Misawa' },
  ]},
  { group: 'Iwate', groupKey: 'nav.loc_iwate', items: [
    { value: 'morioka', label: 'Morioka' }, { value: 'ichinoseki', label: 'Ichinoseki' },
    { value: 'hanamaki', label: 'Hanamaki' }, { value: 'kamaishi', label: 'Kamaishi' },
    { value: 'miyako', label: 'Miyako' }, { value: 'kuji', label: 'Kuji' },
  ]},
  { group: 'Miyagi', groupKey: 'nav.loc_miyagi', items: [
    { value: 'sendai', label: 'Sendai' }, { value: 'ishinomaki', label: 'Ishinomaki' },
    { value: 'natori', label: 'Natori' }, { value: 'shiogama', label: 'Shiogama' },
    { value: 'kesennuma', label: 'Kesennuma' },
  ]},
  { group: 'Akita', groupKey: 'nav.loc_akita', items: [
    { value: 'akita', label: 'Akita' }, { value: 'yokote', label: 'Yokote' },
    { value: 'noshiro', label: 'Noshiro' }, { value: 'kazuno', label: 'Kazuno' },
  ]},
  { group: 'Yamagata', groupKey: 'nav.loc_yamagata', items: [
    { value: 'yamagata', label: 'Yamagata' }, { value: 'yonezawa', label: 'Yonezawa' },
    { value: 'tsuruoka', label: 'Tsuruoka' }, { value: 'sakata', label: 'Sakata' },
  ]},
  { group: 'Fukushima', groupKey: 'nav.loc_fukushima', items: [
    { value: 'fukushima', label: 'Fukushima' }, { value: 'koriyama', label: 'Koriyama' },
    { value: 'iwaki', label: 'Iwaki' }, { value: 'aizuwakamatsu', label: 'Aizuwakamatsu' },
    { value: 'shirakawa', label: 'Shirakawa' },
  ]},
  { group: 'Ibaraki', groupKey: 'nav.loc_ibaraki', items: [
    { value: 'mito', label: 'Mito' }, { value: 'tsukuba', label: 'Tsukuba' },
    { value: 'hitachi', label: 'Hitachi' }, { value: 'tsuchiura', label: 'Tsuchiura' },
    { value: 'toride', label: 'Toride' },
  ]},
  { group: 'Tochigi', groupKey: 'nav.loc_tochigi', items: [
    { value: 'utsunomiya', label: 'Utsunomiya' }, { value: 'ashikaga', label: 'Ashikaga' },
    { value: 'sano', label: 'Sano' }, { value: 'nikko', label: 'Nikko' },
  ]},
  { group: 'Gunma', groupKey: 'nav.loc_gunma', items: [
    { value: 'maebashi', label: 'Maebashi' }, { value: 'takasaki', label: 'Takasaki' },
    { value: 'isesaki', label: 'Isesaki' }, { value: 'kiryu', label: 'Kiryu' },
  ]},
  { group: 'Saitama', groupKey: 'nav.loc_saitama', items: [
    { value: 'saitama', label: 'Saitama' }, { value: 'kawaguchi', label: 'Kawaguchi' },
    { value: 'kawagoe', label: 'Kawagoe' }, { value: 'koshigaya', label: 'Koshigaya' },
    { value: 'tokorozawa', label: 'Tokorozawa' }, { value: 'kumagaya', label: 'Kumagaya' },
    { value: 'iruma', label: 'Iruma' }, { value: 'kuki', label: 'Kuki' },
  ]},
  { group: 'Chiba', groupKey: 'nav.loc_chiba', items: [
    { value: 'chiba', label: 'Chiba' }, { value: 'funabashi', label: 'Funabashi' },
    { value: 'matsudo', label: 'Matsudo' }, { value: 'kashiwa', label: 'Kashiwa' },
    { value: 'ichikawa', label: 'Ichikawa' }, { value: 'urayasu', label: 'Urayasu' },
    { value: 'narita', label: 'Narita' }, { value: 'tateyama', label: 'Tateyama' },
  ]},
  { group: 'Tokyo (Wards)', groupKey: 'nav.loc_tokyo_wards', items: [
    { value: 'shinjuku', label: 'Shinjuku' }, { value: 'shibuya', label: 'Shibuya' },
    { value: 'minato', label: 'Minato' }, { value: 'chiyoda', label: 'Chiyoda' },
    { value: 'chuo', label: 'Chuo' }, { value: 'bunkyo', label: 'Bunkyo' },
    { value: 'toshima', label: 'Toshima' }, { value: 'sumida', label: 'Sumida' },
    { value: 'koto', label: 'Koto' }, { value: 'taito', label: 'Taito' },
    { value: 'nerima', label: 'Nerima' }, { value: 'nakano', label: 'Nakano' },
    { value: 'suginami', label: 'Suginami' }, { value: 'setagaya', label: 'Setagaya' },
    { value: 'shinagawa', label: 'Shinagawa' }, { value: 'adachi', label: 'Adachi' },
    { value: 'edogawa', label: 'Edogawa' },
  ]},
  { group: 'Tokyo (Cities)', groupKey: 'nav.loc_tokyo_cities', items: [
    { value: 'hachioji', label: 'Hachioji' }, { value: 'machida', label: 'Machida' },
    { value: 'tachikawa', label: 'Tachikawa' }, { value: 'fuchu', label: 'Fuchu' },
    { value: 'musashino', label: 'Musashino' }, { value: 'mitaka', label: 'Mitaka' },
    { value: 'ome', label: 'Ome' },
  ]},
  { group: 'Kanagawa', groupKey: 'nav.loc_kanagawa', items: [
    { value: 'yokohama', label: 'Yokohama' }, { value: 'kawasaki', label: 'Kawasaki' },
    { value: 'sagamihara', label: 'Sagamihara' }, { value: 'fujisawa', label: 'Fujisawa' },
    { value: 'yokosuka', label: 'Yokosuka' }, { value: 'hiratsuka', label: 'Hiratsuka' },
    { value: 'odawara', label: 'Odawara' }, { value: 'kamakura', label: 'Kamakura' },
    { value: 'ebina', label: 'Ebina' }, { value: 'zushi', label: 'Zushi' },
  ]},
  { group: 'Niigata', groupKey: 'nav.loc_niigata', items: [
    { value: 'niigata', label: 'Niigata' }, { value: 'nagaoka', label: 'Nagaoka' },
    { value: 'joetsu', label: 'Joetsu' }, { value: 'sanjo', label: 'Sanjo' },
  ]},
  { group: 'Toyama', groupKey: 'nav.loc_toyama', items: [
    { value: 'toyama', label: 'Toyama' }, { value: 'takaoka', label: 'Takaoka' },
    { value: 'himi', label: 'Himi' }, { value: 'kurobe', label: 'Kurobe' },
  ]},
  { group: 'Ishikawa', groupKey: 'nav.loc_ishikawa', items: [
    { value: 'kanazawa', label: 'Kanazawa' }, { value: 'komatsu', label: 'Komatsu' },
    { value: 'nanao', label: 'Nanao' }, { value: 'wajima', label: 'Wajima' },
  ]},
  { group: 'Fukui', groupKey: 'nav.loc_fukui', items: [
    { value: 'fukui', label: 'Fukui' }, { value: 'sabae', label: 'Sabae' },
    { value: 'tsuruga', label: 'Tsuruga' }, { value: 'obama', label: 'Obama' },
  ]},
  { group: 'Yamanashi', groupKey: 'nav.loc_yamanashi', items: [
    { value: 'kofu', label: 'Kofu' }, { value: 'fujiyoshida', label: 'Fujiyoshida' },
  ]},
  { group: 'Nagano', groupKey: 'nav.loc_nagano', items: [
    { value: 'nagano', label: 'Nagano' }, { value: 'matsumoto', label: 'Matsumoto' },
    { value: 'ueda', label: 'Ueda' }, { value: 'iida', label: 'Iida' },
    { value: 'suwa', label: 'Suwa' }, { value: 'saku', label: 'Saku' },
    { value: 'azumino', label: 'Azumino' }, { value: 'shiojiri', label: 'Shiojiri' },
  ]},
  { group: 'Gifu', groupKey: 'nav.loc_gifu', items: [
    { value: 'gifu', label: 'Gifu' }, { value: 'ogaki', label: 'Ogaki' },
    { value: 'tajimi', label: 'Tajimi' }, { value: 'takayama', label: 'Takayama' },
    { value: 'seki', label: 'Seki' },
  ]},
  { group: 'Shizuoka', groupKey: 'nav.loc_shizuoka', items: [
    { value: 'shizuoka', label: 'Shizuoka' }, { value: 'hamamatsu', label: 'Hamamatsu' },
    { value: 'numazu', label: 'Numazu' }, { value: 'fuji', label: 'Fuji' },
    { value: 'mishima', label: 'Mishima' }, { value: 'atami', label: 'Atami' },
    { value: 'kakegawa', label: 'Kakegawa' },
  ]},
  { group: 'Aichi', groupKey: 'nav.loc_aichi', items: [
    { value: 'nagoya', label: 'Nagoya' }, { value: 'toyota', label: 'Toyota' },
    { value: 'okazaki', label: 'Okazaki' }, { value: 'toyohashi', label: 'Toyohashi' },
    { value: 'ichinomiya', label: 'Ichinomiya' }, { value: 'kasugai', label: 'Kasugai' },
    { value: 'anjo', label: 'Anjo' }, { value: 'seto', label: 'Seto' },
    { value: 'gamagori', label: 'Gamagori' },
  ]},
  { group: 'Mie', groupKey: 'nav.loc_mie', items: [
    { value: 'tsu', label: 'Tsu' }, { value: 'yokkaichi', label: 'Yokkaichi' },
    { value: 'ise', label: 'Ise' }, { value: 'suzuka', label: 'Suzuka' },
  ]},
  { group: 'Shiga', groupKey: 'nav.loc_shiga', items: [
    { value: 'otsu', label: 'Otsu' }, { value: 'kusatsu', label: 'Kusatsu' },
    { value: 'nagahama', label: 'Nagahama' }, { value: 'moriyama', label: 'Moriyama' },
  ]},
  { group: 'Kyoto', groupKey: 'nav.loc_kyoto', items: [
    { value: 'kyoto', label: 'Kyoto' }, { value: 'uji', label: 'Uji' },
    { value: 'maizuru', label: 'Maizuru' }, { value: 'kameoka', label: 'Kameoka' },
    { value: 'fukuchiyama', label: 'Fukuchiyama' },
  ]},
  { group: 'Osaka', groupKey: 'nav.loc_osaka', items: [
    { value: 'osaka', label: 'Osaka' }, { value: 'sakai', label: 'Sakai' },
    { value: 'higashiosaka', label: 'Higashiosaka' }, { value: 'hirakata', label: 'Hirakata' },
    { value: 'toyonaka', label: 'Toyonaka' }, { value: 'suita', label: 'Suita' },
    { value: 'takatsuki', label: 'Takatsuki' }, { value: 'neyagawa', label: 'Neyagawa' },
    { value: 'kishiwada', label: 'Kishiwada' },
  ]},
  { group: 'Hyogo', groupKey: 'nav.loc_hyogo', items: [
    { value: 'kobe', label: 'Kobe' }, { value: 'amagasaki', label: 'Amagasaki' },
    { value: 'nishinomiya', label: 'Nishinomiya' }, { value: 'himeji', label: 'Himeji' },
    { value: 'akashi', label: 'Akashi' }, { value: 'takarazuka', label: 'Takarazuka' },
    { value: 'itami', label: 'Itami' }, { value: 'ashiya', label: 'Ashiya' },
    { value: 'awaji', label: 'Awaji' }, { value: 'toyooka', label: 'Toyooka' },
  ]},
  { group: 'Nara', groupKey: 'nav.loc_nara', items: [
    { value: 'nara', label: 'Nara' }, { value: 'kashihara', label: 'Kashihara' },
    { value: 'ikoma', label: 'Ikoma' }, { value: 'tenri', label: 'Tenri' },
  ]},
  { group: 'Wakayama', groupKey: 'nav.loc_wakayama', items: [
    { value: 'wakayama', label: 'Wakayama' }, { value: 'shingu', label: 'Shingu' },
    { value: 'tanabe', label: 'Tanabe' },
  ]},
  { group: 'Tottori', groupKey: 'nav.loc_tottori', items: [
    { value: 'tottori', label: 'Tottori' }, { value: 'yonago', label: 'Yonago' },
  ]},
  { group: 'Shimane', groupKey: 'nav.loc_shimane', items: [
    { value: 'matsue', label: 'Matsue' }, { value: 'izumo', label: 'Izumo' },
    { value: 'hamada', label: 'Hamada' },
  ]},
  { group: 'Okayama', groupKey: 'nav.loc_okayama', items: [
    { value: 'okayama', label: 'Okayama' }, { value: 'kurashiki', label: 'Kurashiki' },
    { value: 'tsuyama', label: 'Tsuyama' },
  ]},
  { group: 'Hiroshima', groupKey: 'nav.loc_hiroshima', items: [
    { value: 'hiroshima', label: 'Hiroshima' }, { value: 'fukuyama', label: 'Fukuyama' },
    { value: 'kure', label: 'Kure' }, { value: 'onomichi', label: 'Onomichi' },
    { value: 'hatsukaichi', label: 'Hatsukaichi' },
  ]},
  { group: 'Yamaguchi', groupKey: 'nav.loc_yamaguchi', items: [
    { value: 'yamaguchi', label: 'Yamaguchi' }, { value: 'shimonoseki', label: 'Shimonoseki' },
    { value: 'ube', label: 'Ube' }, { value: 'iwakuni', label: 'Iwakuni' },
    { value: 'hagi', label: 'Hagi' },
  ]},
  { group: 'Tokushima', groupKey: 'nav.loc_tokushima', items: [
    { value: 'tokushima', label: 'Tokushima' }, { value: 'naruto', label: 'Naruto' },
    { value: 'anan', label: 'Anan' },
  ]},
  { group: 'Kagawa', groupKey: 'nav.loc_kagawa', items: [
    { value: 'takamatsu', label: 'Takamatsu' }, { value: 'marugame', label: 'Marugame' },
    { value: 'kanonji', label: 'Kanonji' },
  ]},
  { group: 'Ehime', groupKey: 'nav.loc_ehime', items: [
    { value: 'matsuyama', label: 'Matsuyama' }, { value: 'imabari', label: 'Imabari' },
    { value: 'niihama', label: 'Niihama' }, { value: 'uwajima', label: 'Uwajima' },
  ]},
  { group: 'Kochi', groupKey: 'nav.loc_kochi', items: [
    { value: 'kochi', label: 'Kochi' }, { value: 'nankoku', label: 'Nankoku' },
    { value: 'shimanto', label: 'Shimanto' },
  ]},
  { group: 'Fukuoka', groupKey: 'nav.loc_fukuoka', items: [
    { value: 'fukuoka', label: 'Fukuoka' }, { value: 'kitakyushu', label: 'Kitakyushu' },
    { value: 'kurume', label: 'Kurume' }, { value: 'dazaifu', label: 'Dazaifu' },
    { value: 'onojo', label: 'Onojo' }, { value: 'yanagawa', label: 'Yanagawa' },
  ]},
  { group: 'Saga', groupKey: 'nav.loc_saga', items: [
    { value: 'saga', label: 'Saga' }, { value: 'karatsu', label: 'Karatsu' },
    { value: 'tosu', label: 'Tosu' },
  ]},
  { group: 'Nagasaki', groupKey: 'nav.loc_nagasaki', items: [
    { value: 'nagasaki', label: 'Nagasaki' }, { value: 'sasebo', label: 'Sasebo' },
    { value: 'isahaya', label: 'Isahaya' }, { value: 'goto', label: 'Goto' },
    { value: 'tsushima-ng', label: 'Tsushima' },
  ]},
  { group: 'Kumamoto', groupKey: 'nav.loc_kumamoto', items: [
    { value: 'kumamoto', label: 'Kumamoto' }, { value: 'yatsushiro', label: 'Yatsushiro' },
    { value: 'aso', label: 'Aso' }, { value: 'yamaga', label: 'Yamaga' },
  ]},
  { group: 'Oita', groupKey: 'nav.loc_oita', items: [
    { value: 'oita', label: 'Oita' }, { value: 'beppu', label: 'Beppu' },
    { value: 'nakatsu', label: 'Nakatsu' }, { value: 'yufu', label: 'Yufu' },
  ]},
  { group: 'Miyazaki', groupKey: 'nav.loc_miyazaki', items: [
    { value: 'miyazaki', label: 'Miyazaki' }, { value: 'miyakonojo', label: 'Miyakonojo' },
    { value: 'nobeoka', label: 'Nobeoka' }, { value: 'hyuga', label: 'Hyuga' },
  ]},
  { group: 'Kagoshima', groupKey: 'nav.loc_kagoshima', items: [
    { value: 'kagoshima', label: 'Kagoshima' }, { value: 'kirishima', label: 'Kirishima' },
    { value: 'kanoya', label: 'Kanoya' }, { value: 'amami', label: 'Amami' },
    { value: 'yakushima', label: 'Yakushima' }, { value: 'ibusuki', label: 'Ibusuki' },
  ]},
  { group: 'Okinawa', groupKey: 'nav.loc_okinawa', items: [
    { value: 'naha', label: 'Naha' }, { value: 'okinawa-city', label: 'Okinawa City' },
    { value: 'urasoe', label: 'Urasoe' }, { value: 'ginowan', label: 'Ginowan' },
    { value: 'nago', label: 'Nago' }, { value: 'miyakojima', label: 'Miyakojima' },
    { value: 'ishigaki', label: 'Ishigaki' }, { value: 'yonaguni', label: 'Yonaguni' },
    { value: 'chatan', label: 'Chatan' },
  ]},
]


// ─── FilterDropdown ───────────────────────────────────────────────────────────
interface FilterDropdownProps {
  label: string
  options?: OptionGroup[]
  flatOptions?: { value: string; label: string }[]
  selected: FilterState
  onChange: (val: string) => void
  onClear: () => void
  searchable?: boolean
  wide?: boolean
}

function FilterDropdown({ label, options, flatOptions, selected, onChange, onClear, searchable, wide }: FilterDropdownProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const count = Object.values(selected).filter(Boolean).length

  const filteredGroups = options
    ? options.map(g => ({ ...g, items: query ? g.items.filter(i => i.label.toLowerCase().includes(query.toLowerCase())) : g.items })).filter(g => g.items.length > 0)
    : []
  const filteredFlat = flatOptions
    ? (query ? flatOptions.filter(i => i.label.toLowerCase().includes(query.toLowerCase())) : flatOptions)
    : []

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-sm border rounded-full px-4 py-2 transition-all cursor-pointer whitespace-nowrap"
        style={count > 0
          ? { backgroundColor: C.brand, borderColor: C.brand, color: '#fff', fontWeight: 600 }
          : { backgroundColor: '#fff', borderColor: C.border, color: C.muted }
        }
      >
        <span>{label}</span>
        {count > 0 && (
          <span className="text-xs rounded-full w-4 h-4 flex items-center justify-center leading-none font-bold"
            style={{ backgroundColor: C.gold, color: '#fff' }}>
            {count}
          </span>
        )}
        <svg className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          className={`absolute top-full mt-2 bg-white rounded-2xl shadow-xl z-50 overflow-hidden flex flex-col ${wide ? 'w-72' : 'w-56'}`}
          style={{ maxHeight: '360px', border: `0.5px solid ${C.border}`, boxShadow: `0 8px 24px rgba(92,10,30,0.12)` }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3" style={{ backgroundColor: C.brand, borderBottom: `1px solid ${C.brandDk}` }}>
            <span className="text-xs font-semibold text-white uppercase tracking-wider">{label}</span>
            {count > 0 && (
              <button onClick={(e) => { e.stopPropagation(); onClear() }}
                className="text-xs font-medium text-white/70 hover:text-white transition-colors">
                {t('nav.filter_clear')}
              </button>
            )}
          </div>

          {/* Search */}
          {searchable && (
            <div className="px-3 py-2" style={{ borderBottom: `1px solid ${C.border}` }}>
              <input
                type="text" value={query} onChange={e => setQuery(e.target.value)}
                placeholder={t('nav.filter_search')}
                className="w-full text-sm rounded-lg px-3 py-1.5 outline-none"
                style={{ backgroundColor: C.cream, color: C.text }}
              />
            </div>
          )}

          {/* Options list */}
          <div className="overflow-y-auto flex-1">
            {options && filteredGroups.map(group =>
              group.group === '🌐' ? (
                <div key="online" style={{ borderBottom: `1px solid ${C.border}` }}>
                  {group.items.map(item => (
                    <OptionRow key={item.value} item={item} checked={!!selected[item.value]} onChange={onChange} />
                  ))}
                </div>
              ) : (
                <div key={group.group}>
                  <div className="px-4 py-1.5 text-xs font-semibold uppercase tracking-wider sticky top-0"
                    style={{ backgroundColor: C.cream, color: C.brand }}>
                    {group.groupKey ? t(group.groupKey) : group.group}
                  </div>
                  {group.items.map(item => (
                    <OptionRow key={item.value} item={item} checked={!!selected[item.value]} onChange={onChange} />
                  ))}
                </div>
              )
            )}
            {flatOptions && filteredFlat.map(item => (
              <OptionRow key={item.value} item={item} checked={!!selected[item.value]} onChange={onChange} />
            ))}
            {((options && filteredGroups.length === 0) || (flatOptions && filteredFlat.length === 0)) && (
              <div className="px-4 py-6 text-center text-sm" style={{ color: C.muted }}>{t('nav.filter_no_results')}</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function OptionRow({ item, checked, onChange }: { item: { value: string; label: string }; checked: boolean; onChange: (v: string) => void }) {
  const { t, i18n } = useTranslation()
  const display = i18n.language === 'ja' ? (JA_CITY[item.label] ?? t(item.label)) : t(item.label)
  return (
    <label
      className="flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors"
      style={{ backgroundColor: checked ? C.cream : undefined }}
      onMouseOver={e => { if (!checked) (e.currentTarget as HTMLElement).style.backgroundColor = C.soft }}
      onMouseOut={e => { if (!checked) (e.currentTarget as HTMLElement).style.backgroundColor = '' }}
    >
      <input type="checkbox" checked={checked} onChange={() => onChange(item.value)}
        className="w-4 h-4 rounded flex-shrink-0" style={{ accentColor: C.brand }} />
      <span className="text-sm" style={{ color: checked ? C.brand : C.text, fontWeight: checked ? 600 : 400 }}>
        {display}
      </span>
    </label>
  )
}

// ─── Main Navbar ──────────────────────────────────────────────────────────────
export default function Navbar() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { isLoggedIn, logout } = useAuth()
  const { t, i18n } = useTranslation()
  const isDiscover = pathname === '/discover'

  const [search, setSearch] = useState('')
  const [avatarOpen, setAvatarOpen] = useState(false)
  const [howItWorksOpen, setHowItWorksOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const avatarRef = useRef<HTMLDivElement>(null)
  const howItWorksRef = useRef<HTMLDivElement>(null)

  const [categoryFilter, setCategoryFilter] = useState<FilterState>({})
  const [locationFilter, setLocationFilter] = useState<FilterState>({})
  const [ageFilter, setAgeFilter] = useState<FilterState>({})
  const [priceFilter, setPriceFilter] = useState<FilterState>({})
  const [genderFilter, setGenderFilter] = useState<FilterState>({})
  const [verifiedOnly, setVerifiedOnly] = useState(false)

  const toggle = useCallback((setter: React.Dispatch<React.SetStateAction<FilterState>>) => (val: string) => {
    setter(prev => ({ ...prev, [val]: !prev[val] }))
  }, [])
  const clear = useCallback((setter: React.Dispatch<React.SetStateAction<FilterState>>) => () => setter({}), [])

  const categoryOptions = useMemo((): OptionGroup[] => [
    { group: `🌐 ${t('nav.cat_group_language')}`, items: [
      { value: 'english', label: t('nav.cat_english') }, { value: 'chinese', label: t('nav.cat_chinese') },
      { value: 'japanese', label: t('nav.cat_japanese') }, { value: 'spanish', label: t('nav.cat_spanish') },
      { value: 'french', label: t('nav.cat_french') }, { value: 'korean', label: t('nav.cat_korean') },
      { value: 'language-other', label: t('nav.cat_language_other') },
    ]},
    { group: `💬 ${t('nav.cat_group_social')}`, items: [
      { value: 'conversation', label: t('nav.cat_conversation') }, { value: 'companionship', label: t('nav.cat_companionship') },
      { value: 'event', label: t('nav.cat_event') }, { value: 'travel-social', label: t('nav.cat_travel') },
    ]},
    { group: `💼 ${t('nav.cat_group_business')}`, items: [
      { value: 'coaching', label: t('nav.cat_coaching') }, { value: 'presentation', label: t('nav.cat_presentation') },
      { value: 'advisory', label: t('nav.cat_advisory') }, { value: 'assistance', label: t('nav.cat_assistance') },
    ]},
    { group: `🏋️ ${t('nav.cat_group_fitness')}`, items: [
      { value: 'personal-training', label: t('nav.cat_personal_training') }, { value: 'instructor', label: t('nav.cat_instructor') },
    ]},
    { group: `📚 ${t('nav.cat_group_education')}`, items: [
      { value: 'tutoring', label: t('nav.cat_tutoring') }, { value: 'mentorship', label: t('nav.cat_mentorship') },
    ]},
    { group: `✈️ ${t('nav.cat_group_travel')}`, items: [
      { value: 'tour-guide', label: t('nav.cat_tour_guide') }, { value: 'local-guide', label: t('nav.cat_local_guide') },
      { value: 'communication-support', label: t('nav.cat_communication_support') },
    ]},
    { group: `💻 ${t('nav.cat_group_online')}`, items: [{ value: 'online', label: t('nav.cat_online') }] },
    { group: `➕ ${t('nav.cat_group_other')}`, items: [{ value: 'others', label: t('nav.cat_others') }] },
  ], [t])

  const ageOptions = useMemo(() => [
    { value: '20s', label: t('nav.age_20s') }, { value: '30s', label: t('nav.age_30s') },
    { value: '40s', label: t('nav.age_40s') }, { value: '50plus', label: t('nav.age_50plus') },
  ], [t])

  const priceOptions = useMemo(() => [
    { value: 'under5k', label: t('nav.price_under') },
    { value: '5k-10k', label: t('nav.price_mid') },
    { value: 'over10k', label: t('nav.price_over') },
  ], [t])

  const genderOptions = useMemo(() => [
    { value: 'male', label: t('nav.gender_male') },
    { value: 'female', label: t('nav.gender_female') },
    { value: 'any', label: t('nav.gender_any') },
  ], [t])

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) setAvatarOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <header className="bg-white sticky top-0 z-20" style={{ borderBottom: `0.5px solid ${C.border}`, boxShadow: '0 1px 8px rgba(92,10,30,0.08)' }}>

      {/* Main nav row */}
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <NavLink to="/" className="text-xl font-semibold tracking-tight" style={{ color: C.brand }}>
          skillconnect
        </NavLink>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <NavLink key={link.path} to={link.path} end={link.path === '/'}
              className={({ isActive }) => `text-sm transition-colors ${isActive ? 'font-semibold' : 'hover:opacity-80'}`}
              style={({ isActive }) => ({ color: isActive ? C.text : C.muted })}
            >
              {t(link.label)}
            </NavLink>
          ))}

          {/* How it works hover dropdown */}
          <div ref={howItWorksRef} className="relative"
            onMouseEnter={() => setHowItWorksOpen(true)}
            onMouseLeave={() => setHowItWorksOpen(false)}
          >
            <NavLink to="/how-it-works"
              className={({ isActive }) => `text-sm transition-colors flex items-center gap-1 ${isActive ? 'font-semibold' : ''}`}
              style={({ isActive }) => ({ color: isActive ? C.text : C.muted })}
            >
              {t('nav.how_it_works')}
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
                style={{ transform: howItWorksOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                <path d="M1 3L5 7L9 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </NavLink>
            {howItWorksOpen && (
              <div className="absolute left-0 top-full pt-2 z-30">
                <div className="bg-white rounded-2xl shadow-lg py-2 min-w-[160px]" style={{ border: `0.5px solid ${C.border}` }}>
                  {howItWorksItems.map(item => (
                    <a key={item.hash} href={`/how-it-works${item.hash}`}
                      className="block px-4 py-2.5 text-sm transition-colors"
                      style={{ color: C.muted }}
                      onMouseOver={e => { (e.currentTarget as HTMLElement).style.backgroundColor = C.soft; (e.currentTarget as HTMLElement).style.color = C.text }}
                      onMouseOut={e => { (e.currentTarget as HTMLElement).style.backgroundColor = ''; (e.currentTarget as HTMLElement).style.color = C.muted }}
                      onClick={() => setHowItWorksOpen(false)}
                    >
                      {t(item.label)}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          <NavLink to="/contact"
            className={({ isActive }) => `text-sm transition-colors ${isActive ? 'font-semibold' : ''}`}
            style={({ isActive }) => ({ color: isActive ? C.text : C.muted })}
          >
            {t('nav.contact')}
          </NavLink>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Language toggle */}
          <button
            onClick={() => i18n.changeLanguage(i18n.language === 'ja' ? 'en' : 'ja')}
            className="text-xs font-medium px-2.5 py-1 rounded-full transition-colors"
            style={{ border: `1px solid ${C.border}`, color: C.muted }}
            onMouseOver={e => { (e.currentTarget as HTMLElement).style.borderColor = C.brand; (e.currentTarget as HTMLElement).style.color = C.brand }}
            onMouseOut={e => { (e.currentTarget as HTMLElement).style.borderColor = C.border; (e.currentTarget as HTMLElement).style.color = C.muted }}
          >
            {i18n.language === 'ja' ? 'EN' : 'JA'}
          </button>

          {isLoggedIn ? (
            <div className="relative" ref={avatarRef}>
              <button onClick={() => setAvatarOpen(!avatarOpen)} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="avatar"
                  className="w-9 h-9 rounded-full object-cover"
                  style={{ border: `2px solid ${C.border}` }} />
              </button>
              {avatarOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-2xl shadow-lg py-2 z-30"
                  style={{ border: `0.5px solid ${C.border}`, boxShadow: `0 4px 16px rgba(92,10,30,0.1)` }}>
                  {[
                    { to: '/dashboard', label: t('nav.dashboard') },
                    { to: '/profile/1', label: t('nav.my_profile') },
                    { to: '/chat', label: t('nav.messages') },
                  ].map(item => (
                    <NavLink key={item.to} to={item.to} onClick={() => setAvatarOpen(false)}
                      className="block px-4 py-2.5 text-sm transition-colors"
                      style={{ color: C.text }}
                      onMouseOver={e => (e.currentTarget as HTMLElement).style.backgroundColor = C.soft}
                      onMouseOut={e => (e.currentTarget as HTMLElement).style.backgroundColor = ''}>
                      {item.label}
                    </NavLink>
                  ))}
                  <hr className="my-1" style={{ borderColor: C.border }} />
                  <button onClick={() => { logout(); setAvatarOpen(false); navigate('/') }}
                    className="block w-full text-left px-4 py-2.5 text-sm transition-colors"
                    style={{ color: C.brand }}
                    onMouseOver={e => (e.currentTarget as HTMLElement).style.backgroundColor = C.soft}
                    onMouseOut={e => (e.currentTarget as HTMLElement).style.backgroundColor = ''}>
                    {t('nav.logout')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <NavLink to="/login" className="text-sm transition-colors" style={{ color: C.muted }}
                onMouseOver={e => (e.currentTarget as HTMLElement).style.color = C.text}
                onMouseOut={e => (e.currentTarget as HTMLElement).style.color = C.muted}>
                {t('nav.login')}
              </NavLink>
              <NavLink to="/signup"
                className="text-sm text-white font-medium px-5 py-2 rounded-full transition-colors"
                style={{ backgroundColor: C.brand }}
                onMouseOver={e => (e.currentTarget as HTMLElement).style.backgroundColor = C.brandDk}
                onMouseOut={e => (e.currentTarget as HTMLElement).style.backgroundColor = C.brand}>
                {t('nav.signup')}
              </NavLink>
            </div>
          )}

          <button className="md:hidden text-xl transition-colors" style={{ color: C.muted }}
            onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden px-6 py-4 flex flex-col gap-4 bg-white" style={{ borderTop: `0.5px solid ${C.border}` }}>
          {links.map((link) => (
            <NavLink key={link.path} to={link.path} end={link.path === '/'}
              onClick={() => setMobileOpen(false)}
              className="text-sm transition-colors"
              style={({ isActive }) => ({ color: isActive ? C.text : C.muted, fontWeight: isActive ? 600 : 400 })}>
              {t(link.label)}
            </NavLink>
          ))}
          <div className="flex flex-col gap-1 pl-3" style={{ borderLeft: `2px solid ${C.border}` }}>
            {howItWorksItems.map(item => (
              <a key={item.hash} href={`/how-it-works${item.hash}`}
                onClick={() => setMobileOpen(false)}
                className="text-sm" style={{ color: C.muted }}>
                {t(item.label)}
              </a>
            ))}
          </div>
          {!isLoggedIn && (
            <div className="flex gap-3 pt-2" style={{ borderTop: `0.5px solid ${C.border}` }}>
              <NavLink to="/login" onClick={() => setMobileOpen(false)} className="text-sm" style={{ color: C.muted }}>{t('nav.login')}</NavLink>
              <NavLink to="/signup" onClick={() => setMobileOpen(false)}
                className="text-sm text-white px-4 py-1.5 rounded-full font-medium"
                style={{ backgroundColor: C.brand }}>
                {t('nav.signup')}
              </NavLink>
            </div>
          )}
        </div>
      )}

      {/* Filter bar — only on /discover */}
      {isDiscover && (
        <div style={{ borderTop: `0.5px solid ${C.border}` }}>
          <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-2 flex-wrap">
            {/* Search */}
            <div className="relative flex-1 min-w-[180px] max-w-xs">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: C.muted }}>🔍</span>
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder={t('nav.search_placeholder')}
                className="w-full pl-9 pr-4 py-2 text-sm rounded-full outline-none transition-colors"
                style={{ backgroundColor: C.cream, color: C.text }}
              />
            </div>

            <div className="h-5 w-px mx-1" style={{ backgroundColor: C.border }} />

            <FilterDropdown label={t('nav.filter_category')} options={categoryOptions} selected={categoryFilter} onChange={toggle(setCategoryFilter)} onClear={clear(setCategoryFilter)} searchable />
            <FilterDropdown label={t('nav.filter_location')} options={LOCATION_OPTIONS} selected={locationFilter} onChange={toggle(setLocationFilter)} onClear={clear(setLocationFilter)} searchable wide />
            <FilterDropdown label={t('nav.filter_age')} flatOptions={ageOptions} selected={ageFilter} onChange={toggle(setAgeFilter)} onClear={clear(setAgeFilter)} />
            <FilterDropdown label={t('nav.filter_price')} flatOptions={priceOptions} selected={priceFilter} onChange={toggle(setPriceFilter)} onClear={clear(setPriceFilter)} />
            <FilterDropdown label={t('nav.filter_gender')} flatOptions={genderOptions} selected={genderFilter} onChange={toggle(setGenderFilter)} onClear={clear(setGenderFilter)} />

            <label className="flex items-center gap-2 cursor-pointer ml-1">
              <input type="checkbox" checked={verifiedOnly} onChange={e => setVerifiedOnly(e.target.checked)}
                className="w-4 h-4" style={{ accentColor: C.brand }} />
              <span className="text-sm whitespace-nowrap" style={{ color: C.muted }}>
                {t('nav.verified_only')}
              </span>
            </label>
          </div>
        </div>
      )}
    </header>
  )
}
