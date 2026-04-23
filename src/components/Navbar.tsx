// Navbar — persistent top bar across all pages
// On /discover, renders a filter bar with custom checkbox dropdown panels
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useState, useRef, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'

const links = [
  { path: '/', label: 'Home' },
  { path: '/discover', label: 'Discover' },
  { path: '/meetups', label: 'Meetups' },
  { path: '/how-it-works', label: 'How it works' },
  { path: '/contact', label: 'Contact' },
]

// ─── Types ────────────────────────────────────────────────────────────────────
type OptionGroup = { group: string; items: { value: string; label: string }[] }
type FilterState = Record<string, boolean>

// ─── Filter data ──────────────────────────────────────────────────────────────
const CATEGORY_OPTIONS: OptionGroup[] = [
  { group: '🌐 Language', items: [
    { value: 'english', label: 'English' },
    { value: 'chinese', label: 'Chinese' },
    { value: 'japanese', label: 'Japanese' },
    { value: 'spanish', label: 'Spanish' },
    { value: 'french', label: 'French' },
    { value: 'korean', label: 'Korean' },
    { value: 'language-other', label: 'Other language' },
  ]},
  { group: '💬 Social', items: [
    { value: 'conversation', label: 'Conversation' },
    { value: 'companionship', label: 'Companionship' },
    { value: 'event', label: 'Event' },
    { value: 'travel-social', label: 'Travel' },
  ]},
  { group: '💼 Business', items: [
    { value: 'coaching', label: 'Coaching' },
    { value: 'presentation', label: 'Presentation' },
    { value: 'advisory', label: 'Advisory' },
    { value: 'assistance', label: 'Assistance' },
  ]},
  { group: '🏋️ Fitness', items: [
    { value: 'personal-training', label: 'Personal training' },
    { value: 'instructor', label: 'Instructor' },
  ]},
  { group: '📚 Education', items: [
    { value: 'tutoring', label: 'Tutoring' },
    { value: 'mentorship', label: 'Mentorship' },
  ]},
  { group: '✈️ Travel', items: [
    { value: 'tour-guide', label: 'Tour guide' },
    { value: 'local-guide', label: 'Local guide' },
    { value: 'communication-support', label: 'Communication support' },
  ]},
  { group: '💻 Online', items: [{ value: 'online', label: 'Online' }] },
  { group: '➕ Other', items: [{ value: 'others', label: 'Others' }] },
]

const LOCATION_OPTIONS: OptionGroup[] = [
  { group: '🌐', items: [{ value: 'online', label: '🌐 Online' }] },
  { group: 'Hokkaido', items: [
    { value: 'sapporo', label: 'Sapporo' }, { value: 'asahikawa', label: 'Asahikawa' },
    { value: 'hakodate', label: 'Hakodate' }, { value: 'kushiro', label: 'Kushiro' },
    { value: 'obihiro', label: 'Obihiro' }, { value: 'kitami', label: 'Kitami' },
    { value: 'tomakomai', label: 'Tomakomai' }, { value: 'otaru', label: 'Otaru' },
    { value: 'ebetsu', label: 'Ebetsu' }, { value: 'chitose', label: 'Chitose' },
    { value: 'eniwa', label: 'Eniwa' }, { value: 'ishikari', label: 'Ishikari' },
    { value: 'iwamizawa', label: 'Iwamizawa' }, { value: 'wakkanai', label: 'Wakkanai' },
    { value: 'rumoi', label: 'Rumoi' }, { value: 'nayoro', label: 'Nayoro' },
    { value: 'nemuro', label: 'Nemuro' }, { value: 'monbetsu', label: 'Monbetsu' },
    { value: 'abashiri', label: 'Abashiri' }, { value: 'bibai', label: 'Bibai' },
    { value: 'akabira', label: 'Akabira' }, { value: 'mikasa', label: 'Mikasa' },
    { value: 'fukagawa', label: 'Fukagawa' }, { value: 'furano', label: 'Furano' },
    { value: 'noboribetsu', label: 'Noboribetsu' }, { value: 'date-hk', label: 'Date' },
    { value: 'yubari', label: 'Yubari' }, { value: 'sunagawa', label: 'Sunagawa' },
    { value: 'takikawa', label: 'Takikawa' }, { value: 'shibetsu', label: 'Shibetsu' },
    { value: 'nakashibetsu', label: 'Nakashibetsu' }, { value: 'betsukai', label: 'Betsukai' },
  ]},
  { group: 'Aomori', items: [
    { value: 'aomori', label: 'Aomori' }, { value: 'hachinohe', label: 'Hachinohe' },
    { value: 'hirosaki', label: 'Hirosaki' }, { value: 'towada', label: 'Towada' },
    { value: 'mutsu', label: 'Mutsu' }, { value: 'goshogawara', label: 'Goshogawara' },
    { value: 'kuroishi', label: 'Kuroishi' }, { value: 'tsugaru', label: 'Tsugaru' },
    { value: 'misawa', label: 'Misawa' }, { value: 'sannohe', label: 'Sannohe' },
  ]},
  { group: 'Iwate', items: [
    { value: 'morioka', label: 'Morioka' }, { value: 'ichinoseki', label: 'Ichinoseki' },
    { value: 'oshu', label: 'Oshu' }, { value: 'kitakami', label: 'Kitakami' },
    { value: 'hanamaki', label: 'Hanamaki' }, { value: 'kamaishi', label: 'Kamaishi' },
    { value: 'ofunato', label: 'Ofunato' }, { value: 'miyako', label: 'Miyako' },
    { value: 'rikuzentakata', label: 'Rikuzentakata' }, { value: 'ninohe', label: 'Ninohe' },
    { value: 'kuji', label: 'Kuji' },
  ]},
  { group: 'Miyagi', items: [
    { value: 'sendai', label: 'Sendai' }, { value: 'ishinomaki', label: 'Ishinomaki' },
    { value: 'osaki', label: 'Osaki' }, { value: 'tome', label: 'Tome' },
    { value: 'natori', label: 'Natori' }, { value: 'shiogama', label: 'Shiogama' },
    { value: 'tagajo', label: 'Tagajo' }, { value: 'kesennuma', label: 'Kesennuma' },
    { value: 'shiroishi', label: 'Shiroishi' }, { value: 'kurihara', label: 'Kurihara' },
  ]},
  { group: 'Akita', items: [
    { value: 'akita', label: 'Akita' }, { value: 'yokote', label: 'Yokote' },
    { value: 'daisen', label: 'Daisen' }, { value: 'noshiro', label: 'Noshiro' },
    { value: 'yuzawa', label: 'Yuzawa' }, { value: 'kazuno', label: 'Kazuno' },
    { value: 'odate', label: 'Odate' }, { value: 'nikaho', label: 'Nikaho' },
  ]},
  { group: 'Yamagata', items: [
    { value: 'yamagata', label: 'Yamagata' }, { value: 'yonezawa', label: 'Yonezawa' },
    { value: 'tsuruoka', label: 'Tsuruoka' }, { value: 'sakata', label: 'Sakata' },
    { value: 'shinjo', label: 'Shinjo' }, { value: 'kaminoyama', label: 'Kaminoyama' },
    { value: 'tendo', label: 'Tendo' }, { value: 'higashine', label: 'Higashine' },
  ]},
  { group: 'Fukushima', items: [
    { value: 'fukushima', label: 'Fukushima' }, { value: 'koriyama', label: 'Koriyama' },
    { value: 'iwaki', label: 'Iwaki' }, { value: 'aizuwakamatsu', label: 'Aizuwakamatsu' },
    { value: 'sukagawa', label: 'Sukagawa' }, { value: 'shirakawa', label: 'Shirakawa' },
    { value: 'minamisoma', label: 'Minamisoma' }, { value: 'soma', label: 'Soma' },
  ]},
  { group: 'Ibaraki', items: [
    { value: 'mito', label: 'Mito' }, { value: 'tsukuba', label: 'Tsukuba' },
    { value: 'hitachi', label: 'Hitachi' }, { value: 'tsuchiura', label: 'Tsuchiura' },
    { value: 'hitachinaka', label: 'Hitachinaka' }, { value: 'ryugasaki', label: 'Ryugasaki' },
    { value: 'kasama', label: 'Kasama' }, { value: 'moriya', label: 'Moriya' },
    { value: 'toride', label: 'Toride' }, { value: 'bando', label: 'Bando' },
  ]},
  { group: 'Tochigi', items: [
    { value: 'utsunomiya', label: 'Utsunomiya' }, { value: 'oyama', label: 'Oyama' },
    { value: 'tochigi', label: 'Tochigi' }, { value: 'ashikaga', label: 'Ashikaga' },
    { value: 'sano', label: 'Sano' }, { value: 'nikko', label: 'Nikko' },
    { value: 'kanuma', label: 'Kanuma' }, { value: 'nasushiobara', label: 'Nasushiobara' },
  ]},
  { group: 'Gunma', items: [
    { value: 'maebashi', label: 'Maebashi' }, { value: 'takasaki', label: 'Takasaki' },
    { value: 'ota-gm', label: 'Ota' }, { value: 'isesaki', label: 'Isesaki' },
    { value: 'kiryu', label: 'Kiryu' }, { value: 'numata', label: 'Numata' },
    { value: 'shibukawa', label: 'Shibukawa' }, { value: 'tatebayashi', label: 'Tatebayashi' },
  ]},
  { group: 'Saitama', items: [
    { value: 'saitama', label: 'Saitama' }, { value: 'kawaguchi', label: 'Kawaguchi' },
    { value: 'kawagoe', label: 'Kawagoe' }, { value: 'soka', label: 'Soka' },
    { value: 'koshigaya', label: 'Koshigaya' }, { value: 'tokorozawa', label: 'Tokorozawa' },
    { value: 'ageo', label: 'Ageo' }, { value: 'kasukabe', label: 'Kasukabe' },
    { value: 'kumagaya', label: 'Kumagaya' }, { value: 'toda', label: 'Toda' },
    { value: 'sayama', label: 'Sayama' }, { value: 'konosu', label: 'Konosu' },
    { value: 'iruma', label: 'Iruma' }, { value: 'kuki', label: 'Kuki' },
  ]},
  { group: 'Chiba', items: [
    { value: 'chiba', label: 'Chiba' }, { value: 'funabashi', label: 'Funabashi' },
    { value: 'matsudo', label: 'Matsudo' }, { value: 'kashiwa', label: 'Kashiwa' },
    { value: 'ichikawa', label: 'Ichikawa' }, { value: 'urayasu', label: 'Urayasu' },
    { value: 'narita', label: 'Narita' }, { value: 'narashino', label: 'Narashino' },
    { value: 'yachiyo', label: 'Yachiyo' }, { value: 'ichihara', label: 'Ichihara' },
    { value: 'choshi', label: 'Choshi' }, { value: 'noda', label: 'Noda' },
    { value: 'tateyama', label: 'Tateyama' }, { value: 'kamogawa', label: 'Kamogawa' },
  ]},
  { group: 'Tokyo (Wards)', items: [
    { value: 'shinjuku', label: 'Shinjuku' }, { value: 'shibuya', label: 'Shibuya' },
    { value: 'minato', label: 'Minato' }, { value: 'chiyoda', label: 'Chiyoda' },
    { value: 'chuo', label: 'Chuo' }, { value: 'bunkyo', label: 'Bunkyo' },
    { value: 'toshima', label: 'Toshima' }, { value: 'sumida', label: 'Sumida' },
    { value: 'koto', label: 'Koto' }, { value: 'taito', label: 'Taito' },
    { value: 'arakawa', label: 'Arakawa' }, { value: 'kita-ward', label: 'Kita' },
    { value: 'itabashi', label: 'Itabashi' }, { value: 'nerima', label: 'Nerima' },
    { value: 'nakano', label: 'Nakano' }, { value: 'suginami', label: 'Suginami' },
    { value: 'setagaya', label: 'Setagaya' }, { value: 'meguro', label: 'Meguro' },
    { value: 'shinagawa', label: 'Shinagawa' }, { value: 'ota', label: 'Ota' },
    { value: 'adachi', label: 'Adachi' }, { value: 'katsushika', label: 'Katsushika' },
    { value: 'edogawa', label: 'Edogawa' },
  ]},
  { group: 'Tokyo (Cities)', items: [
    { value: 'hachioji', label: 'Hachioji' }, { value: 'machida', label: 'Machida' },
    { value: 'tachikawa', label: 'Tachikawa' }, { value: 'fuchu', label: 'Fuchu' },
    { value: 'chofu', label: 'Chofu' }, { value: 'musashino', label: 'Musashino' },
    { value: 'mitaka', label: 'Mitaka' }, { value: 'koganei', label: 'Koganei' },
    { value: 'kokubunji', label: 'Kokubunji' }, { value: 'hino', label: 'Hino' },
    { value: 'ome', label: 'Ome' }, { value: 'akishima', label: 'Akishima' },
  ]},
  { group: 'Kanagawa', items: [
    { value: 'yokohama', label: 'Yokohama' }, { value: 'kawasaki', label: 'Kawasaki' },
    { value: 'sagamihara', label: 'Sagamihara' }, { value: 'fujisawa', label: 'Fujisawa' },
    { value: 'yokosuka', label: 'Yokosuka' }, { value: 'hiratsuka', label: 'Hiratsuka' },
    { value: 'chigasaki', label: 'Chigasaki' }, { value: 'odawara', label: 'Odawara' },
    { value: 'atsugi', label: 'Atsugi' }, { value: 'yamato', label: 'Yamato' },
    { value: 'kamakura', label: 'Kamakura' }, { value: 'ebina', label: 'Ebina' },
    { value: 'zushi', label: 'Zushi' }, { value: 'hadano', label: 'Hadano' },
  ]},
  { group: 'Niigata', items: [
    { value: 'niigata', label: 'Niigata' }, { value: 'nagaoka', label: 'Nagaoka' },
    { value: 'joetsu', label: 'Joetsu' }, { value: 'sanjo', label: 'Sanjo' },
    { value: 'kashiwazaki', label: 'Kashiwazaki' }, { value: 'shibata', label: 'Shibata' },
    { value: 'myoko', label: 'Myoko' }, { value: 'ojiya', label: 'Ojiya' },
  ]},
  { group: 'Toyama', items: [
    { value: 'toyama', label: 'Toyama' }, { value: 'takaoka', label: 'Takaoka' },
    { value: 'imizu', label: 'Imizu' }, { value: 'himi', label: 'Himi' },
    { value: 'uozu', label: 'Uozu' }, { value: 'kurobe', label: 'Kurobe' },
  ]},
  { group: 'Ishikawa', items: [
    { value: 'kanazawa', label: 'Kanazawa' }, { value: 'komatsu', label: 'Komatsu' },
    { value: 'hakusan', label: 'Hakusan' }, { value: 'nanao', label: 'Nanao' },
    { value: 'wajima', label: 'Wajima' }, { value: 'suzu', label: 'Suzu' },
  ]},
  { group: 'Fukui', items: [
    { value: 'fukui', label: 'Fukui' }, { value: 'sabae', label: 'Sabae' },
    { value: 'echizen', label: 'Echizen' }, { value: 'tsuruga', label: 'Tsuruga' },
    { value: 'obama', label: 'Obama' }, { value: 'awara', label: 'Awara' },
  ]},
  { group: 'Yamanashi', items: [
    { value: 'kofu', label: 'Kofu' }, { value: 'fujiyoshida', label: 'Fujiyoshida' },
    { value: 'nirasaki', label: 'Nirasaki' }, { value: 'minami-alps', label: 'Minami-Alps' },
    { value: 'hokuto-ym', label: 'Hokuto' }, { value: 'otsuki', label: 'Otsuki' },
  ]},
  { group: 'Nagano', items: [
    { value: 'nagano', label: 'Nagano' }, { value: 'matsumoto', label: 'Matsumoto' },
    { value: 'ueda', label: 'Ueda' }, { value: 'iida', label: 'Iida' },
    { value: 'suwa', label: 'Suwa' }, { value: 'chino', label: 'Chino' },
    { value: 'okaya', label: 'Okaya' }, { value: 'ina', label: 'Ina' },
    { value: 'komoro', label: 'Komoro' }, { value: 'saku', label: 'Saku' },
    { value: 'azumino', label: 'Azumino' }, { value: 'shiojiri', label: 'Shiojiri' },
    { value: 'omachi', label: 'Omachi' }, { value: 'iiyama', label: 'Iiyama' },
  ]},
  { group: 'Gifu', items: [
    { value: 'gifu', label: 'Gifu' }, { value: 'ogaki', label: 'Ogaki' },
    { value: 'tajimi', label: 'Tajimi' }, { value: 'kakamigahara', label: 'Kakamigahara' },
    { value: 'takayama', label: 'Takayama' }, { value: 'gero', label: 'Gero' },
    { value: 'mino', label: 'Mino' }, { value: 'seki', label: 'Seki' },
    { value: 'ena', label: 'Ena' }, { value: 'minokamo', label: 'Minokamo' },
  ]},
  { group: 'Shizuoka', items: [
    { value: 'shizuoka', label: 'Shizuoka' }, { value: 'hamamatsu', label: 'Hamamatsu' },
    { value: 'numazu', label: 'Numazu' }, { value: 'fuji', label: 'Fuji' },
    { value: 'fujinomiya', label: 'Fujinomiya' }, { value: 'mishima', label: 'Mishima' },
    { value: 'atami', label: 'Atami' }, { value: 'ito', label: 'Ito' },
    { value: 'shimada', label: 'Shimada' }, { value: 'kakegawa', label: 'Kakegawa' },
    { value: 'iwata', label: 'Iwata' }, { value: 'fujieda', label: 'Fujieda' },
    { value: 'yaizu', label: 'Yaizu' }, { value: 'susono', label: 'Susono' },
  ]},
  { group: 'Aichi', items: [
    { value: 'nagoya', label: 'Nagoya' }, { value: 'toyota', label: 'Toyota' },
    { value: 'okazaki', label: 'Okazaki' }, { value: 'toyohashi', label: 'Toyohashi' },
    { value: 'ichinomiya', label: 'Ichinomiya' }, { value: 'kasugai', label: 'Kasugai' },
    { value: 'anjo', label: 'Anjo' }, { value: 'toyokawa', label: 'Toyokawa' },
    { value: 'seto', label: 'Seto' }, { value: 'handa', label: 'Handa' },
    { value: 'komaki', label: 'Komaki' }, { value: 'gamagori', label: 'Gamagori' },
    { value: 'tokoname', label: 'Tokoname' }, { value: 'inuyama', label: 'Inuyama' },
    { value: 'chiryuu', label: 'Chiryuu' }, { value: 'tahara', label: 'Tahara' },
  ]},
  { group: 'Mie', items: [
    { value: 'tsu', label: 'Tsu' }, { value: 'yokkaichi', label: 'Yokkaichi' },
    { value: 'suzuka', label: 'Suzuka' }, { value: 'matsusaka', label: 'Matsusaka' },
    { value: 'ise', label: 'Ise' }, { value: 'kuwana', label: 'Kuwana' },
    { value: 'nabari', label: 'Nabari' }, { value: 'owase', label: 'Owase' },
    { value: 'kumano', label: 'Kumano' },
  ]},
  { group: 'Shiga', items: [
    { value: 'otsu', label: 'Otsu' }, { value: 'kusatsu', label: 'Kusatsu' },
    { value: 'higashiomi', label: 'Higashiomi' }, { value: 'nagahama', label: 'Nagahama' },
    { value: 'moriyama', label: 'Moriyama' }, { value: 'omihachiman', label: 'Omihachiman' },
    { value: 'maibara', label: 'Maibara' }, { value: 'ritto', label: 'Ritto' },
    { value: 'koka', label: 'Koka' }, { value: 'takashima', label: 'Takashima' },
  ]},
  { group: 'Kyoto', items: [
    { value: 'kyoto', label: 'Kyoto' }, { value: 'uji', label: 'Uji' },
    { value: 'kameoka', label: 'Kameoka' }, { value: 'joyo', label: 'Joyo' },
    { value: 'nagaokakyo', label: 'Nagaokakyo' }, { value: 'maizuru', label: 'Maizuru' },
    { value: 'fukuchiyama', label: 'Fukuchiyama' }, { value: 'kyotanabe', label: 'Kyotanabe' },
    { value: 'ayabe', label: 'Ayabe' }, { value: 'miyazu', label: 'Miyazu' },
  ]},
  { group: 'Osaka', items: [
    { value: 'osaka', label: 'Osaka' }, { value: 'sakai', label: 'Sakai' },
    { value: 'higashiosaka', label: 'Higashiosaka' }, { value: 'hirakata', label: 'Hirakata' },
    { value: 'toyonaka', label: 'Toyonaka' }, { value: 'suita', label: 'Suita' },
    { value: 'takatsuki', label: 'Takatsuki' }, { value: 'ibaraki-os', label: 'Ibaraki' },
    { value: 'neyagawa', label: 'Neyagawa' }, { value: 'kadoma', label: 'Kadoma' },
    { value: 'moriguchi', label: 'Moriguchi' }, { value: 'yao', label: 'Yao' },
    { value: 'tondabayashi', label: 'Tondabayashi' }, { value: 'kishiwada', label: 'Kishiwada' },
    { value: 'sennan', label: 'Sennan' }, { value: 'izumisano', label: 'Izumisano' },
  ]},
  { group: 'Hyogo', items: [
    { value: 'kobe', label: 'Kobe' }, { value: 'amagasaki', label: 'Amagasaki' },
    { value: 'nishinomiya', label: 'Nishinomiya' }, { value: 'himeji', label: 'Himeji' },
    { value: 'akashi', label: 'Akashi' }, { value: 'kakogawa', label: 'Kakogawa' },
    { value: 'takarazuka', label: 'Takarazuka' }, { value: 'itami', label: 'Itami' },
    { value: 'ashiya', label: 'Ashiya' }, { value: 'sanda', label: 'Sanda' },
    { value: 'tamba', label: 'Tamba' }, { value: 'toyooka', label: 'Toyooka' },
    { value: 'awaji', label: 'Awaji' }, { value: 'ako', label: 'Ako' },
    { value: 'sumoto', label: 'Sumoto' },
  ]},
  { group: 'Nara', items: [
    { value: 'nara', label: 'Nara' }, { value: 'kashihara', label: 'Kashihara' },
    { value: 'ikoma', label: 'Ikoma' }, { value: 'yamatokoriyama', label: 'Yamatokoriyama' },
    { value: 'tenri', label: 'Tenri' }, { value: 'sakurai', label: 'Sakurai' },
    { value: 'gojo', label: 'Gojo' }, { value: 'kashiba', label: 'Kashiba' },
  ]},
  { group: 'Wakayama', items: [
    { value: 'wakayama', label: 'Wakayama' }, { value: 'kainan', label: 'Kainan' },
    { value: 'hashimoto', label: 'Hashimoto' }, { value: 'shingu', label: 'Shingu' },
    { value: 'tanabe', label: 'Tanabe' }, { value: 'arida', label: 'Arida' },
    { value: 'gobo', label: 'Gobo' },
  ]},
  { group: 'Tottori', items: [
    { value: 'tottori', label: 'Tottori' }, { value: 'yonago', label: 'Yonago' },
    { value: 'kurayoshi', label: 'Kurayoshi' }, { value: 'sakaiminato', label: 'Sakaiminato' },
  ]},
  { group: 'Shimane', items: [
    { value: 'matsue', label: 'Matsue' }, { value: 'hamada', label: 'Hamada' },
    { value: 'izumo', label: 'Izumo' }, { value: 'masuda', label: 'Masuda' },
    { value: 'oda', label: 'Oda' }, { value: 'unnan', label: 'Unnan' },
  ]},
  { group: 'Okayama', items: [
    { value: 'okayama', label: 'Okayama' }, { value: 'kurashiki', label: 'Kurashiki' },
    { value: 'tsuyama', label: 'Tsuyama' }, { value: 'tamano', label: 'Tamano' },
    { value: 'kasaoka', label: 'Kasaoka' }, { value: 'niimi', label: 'Niimi' },
    { value: 'maniwa', label: 'Maniwa' },
  ]},
  { group: 'Hiroshima', items: [
    { value: 'hiroshima', label: 'Hiroshima' }, { value: 'fukuyama', label: 'Fukuyama' },
    { value: 'kure', label: 'Kure' }, { value: 'higashihiroshima', label: 'Higashihiroshima' },
    { value: 'onomichi', label: 'Onomichi' }, { value: 'mihara', label: 'Mihara' },
    { value: 'hatsukaichi', label: 'Hatsukaichi' }, { value: 'akitakata', label: 'Akitakata' },
  ]},
  { group: 'Yamaguchi', items: [
    { value: 'yamaguchi', label: 'Yamaguchi' }, { value: 'shimonoseki', label: 'Shimonoseki' },
    { value: 'ube', label: 'Ube' }, { value: 'shunan', label: 'Shunan' },
    { value: 'hofu', label: 'Hofu' }, { value: 'iwakuni', label: 'Iwakuni' },
    { value: 'nagato', label: 'Nagato' }, { value: 'hagi', label: 'Hagi' },
    { value: 'yanai', label: 'Yanai' },
  ]},
  { group: 'Tokushima', items: [
    { value: 'tokushima', label: 'Tokushima' }, { value: 'naruto', label: 'Naruto' },
    { value: 'anan', label: 'Anan' }, { value: 'komatsushima', label: 'Komatsushima' },
    { value: 'yoshinogawa', label: 'Yoshinogawa' }, { value: 'mima', label: 'Mima' },
  ]},
  { group: 'Kagawa', items: [
    { value: 'takamatsu', label: 'Takamatsu' }, { value: 'marugame', label: 'Marugame' },
    { value: 'sakaide', label: 'Sakaide' }, { value: 'sanuki', label: 'Sanuki' },
    { value: 'higashikagawa', label: 'Higashikagawa' }, { value: 'zentsuji', label: 'Zentsuji' },
    { value: 'kanonji', label: 'Kanonji' },
  ]},
  { group: 'Ehime', items: [
    { value: 'matsuyama', label: 'Matsuyama' }, { value: 'imabari', label: 'Imabari' },
    { value: 'uwajima', label: 'Uwajima' }, { value: 'niihama', label: 'Niihama' },
    { value: 'saijo', label: 'Saijo' }, { value: 'yawatahama', label: 'Yawatahama' },
    { value: 'ozu', label: 'Ozu' }, { value: 'iyo', label: 'Iyo' },
  ]},
  { group: 'Kochi', items: [
    { value: 'kochi', label: 'Kochi' }, { value: 'nankoku', label: 'Nankoku' },
    { value: 'sukumo', label: 'Sukumo' }, { value: 'susaki', label: 'Susaki' },
    { value: 'muroto', label: 'Muroto' }, { value: 'aki', label: 'Aki' },
    { value: 'tosa', label: 'Tosa' }, { value: 'shimanto', label: 'Shimanto' },
  ]},
  { group: 'Fukuoka', items: [
    { value: 'fukuoka', label: 'Fukuoka' }, { value: 'kitakyushu', label: 'Kitakyushu' },
    { value: 'kurume', label: 'Kurume' }, { value: 'omuta', label: 'Omuta' },
    { value: 'iizuka', label: 'Iizuka' }, { value: 'nogata', label: 'Nogata' },
    { value: 'munakata', label: 'Munakata' }, { value: 'dazaifu', label: 'Dazaifu' },
    { value: 'onojo', label: 'Onojo' }, { value: 'yanagawa', label: 'Yanagawa' },
    { value: 'tagawa', label: 'Tagawa' }, { value: 'nakama', label: 'Nakama' },
  ]},
  { group: 'Saga', items: [
    { value: 'saga', label: 'Saga' }, { value: 'karatsu', label: 'Karatsu' },
    { value: 'tosu', label: 'Tosu' }, { value: 'imari', label: 'Imari' },
    { value: 'takeo', label: 'Takeo' }, { value: 'ureshino', label: 'Ureshino' },
    { value: 'kanzaki', label: 'Kanzaki' },
  ]},
  { group: 'Nagasaki', items: [
    { value: 'nagasaki', label: 'Nagasaki' }, { value: 'sasebo', label: 'Sasebo' },
    { value: 'isahaya', label: 'Isahaya' }, { value: 'omura', label: 'Omura' },
    { value: 'goto', label: 'Goto' }, { value: 'hirado', label: 'Hirado' },
    { value: 'tsushima-ng', label: 'Tsushima' }, { value: 'unzen', label: 'Unzen' },
  ]},
  { group: 'Kumamoto', items: [
    { value: 'kumamoto', label: 'Kumamoto' }, { value: 'yatsushiro', label: 'Yatsushiro' },
    { value: 'hitoyoshi', label: 'Hitoyoshi' }, { value: 'arao', label: 'Arao' },
    { value: 'minamata', label: 'Minamata' }, { value: 'tamana', label: 'Tamana' },
    { value: 'kikuchi', label: 'Kikuchi' }, { value: 'aso', label: 'Aso' },
    { value: 'yamaga', label: 'Yamaga' }, { value: 'uki', label: 'Uki' },
  ]},
  { group: 'Oita', items: [
    { value: 'oita', label: 'Oita' }, { value: 'beppu', label: 'Beppu' },
    { value: 'nakatsu', label: 'Nakatsu' }, { value: 'hita', label: 'Hita' },
    { value: 'saiki', label: 'Saiki' }, { value: 'usuki', label: 'Usuki' },
    { value: 'yufu', label: 'Yufu' }, { value: 'bungoono', label: 'Bungoono' },
  ]},
  { group: 'Miyazaki', items: [
    { value: 'miyazaki', label: 'Miyazaki' }, { value: 'miyakonojo', label: 'Miyakonojo' },
    { value: 'nobeoka', label: 'Nobeoka' }, { value: 'nichinan', label: 'Nichinan' },
    { value: 'kobayashi', label: 'Kobayashi' }, { value: 'hyuga', label: 'Hyuga' },
    { value: 'ebino', label: 'Ebino' }, { value: 'saito', label: 'Saito' },
  ]},
  { group: 'Kagoshima', items: [
    { value: 'kagoshima', label: 'Kagoshima' }, { value: 'kirishima', label: 'Kirishima' },
    { value: 'kanoya', label: 'Kanoya' }, { value: 'satsumasendai', label: 'Satsumasendai' },
    { value: 'amami', label: 'Amami' }, { value: 'ibusuki', label: 'Ibusuki' },
    { value: 'makurazaki', label: 'Makurazaki' }, { value: 'yakushima', label: 'Yakushima' },
    { value: 'tarumizu', label: 'Tarumizu' }, { value: 'akune', label: 'Akune' },
  ]},
  { group: 'Okinawa', items: [
    { value: 'naha', label: 'Naha' }, { value: 'okinawa-city', label: 'Okinawa City' },
    { value: 'urasoe', label: 'Urasoe' }, { value: 'uruma', label: 'Uruma' },
    { value: 'ginowan', label: 'Ginowan' }, { value: 'itoman', label: 'Itoman' },
    { value: 'tomigusuku', label: 'Tomigusuku' }, { value: 'nago', label: 'Nago' },
    { value: 'nanjo', label: 'Nanjo' }, { value: 'miyakojima', label: 'Miyakojima' },
    { value: 'ishigaki', label: 'Ishigaki' }, { value: 'yonaguni', label: 'Yonaguni' },
    { value: 'chatan', label: 'Chatan' }, { value: 'yomitan', label: 'Yomitan' },
    { value: 'onna', label: 'Onna' },
  ]},
]

const AGE_OPTIONS = [
  { value: '20s', label: '20s' },
  { value: '30s', label: '30s' },
  { value: '40s', label: '40s' },
  { value: '50plus', label: '50+' },
]

const PRICE_OPTIONS = [
  { value: 'under5k', label: 'Under ¥5,000/hr' },
  { value: '5k-10k', label: '¥5,000 – ¥10,000/hr' },
  { value: 'over10k', label: 'Over ¥10,000/hr' },
]

const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'any', label: 'Any' },
]

// ─── FilterDropdown component ─────────────────────────────────────────────────
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

function FilterDropdown({
  label, options, flatOptions, selected, onChange, onClear, searchable, wide
}: FilterDropdownProps) {
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

  const selectedCount = Object.values(selected).filter(Boolean).length

  // Build filtered groups for searchable dropdowns
  const filteredGroups: OptionGroup[] = options
    ? options.map(g => ({
        ...g,
        items: query
          ? g.items.filter(i => i.label.toLowerCase().includes(query.toLowerCase()))
          : g.items,
      })).filter(g => g.items.length > 0)
    : []

  const filteredFlat = flatOptions
    ? (query ? flatOptions.filter(i => i.label.toLowerCase().includes(query.toLowerCase())) : flatOptions)
    : []

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 text-sm border rounded-full px-4 py-2 transition-all cursor-pointer whitespace-nowrap
          ${selectedCount > 0
            ? 'border-teal-400 bg-teal-50 text-teal-700 font-medium'
            : 'border-gray-200 bg-white text-gray-500 hover:border-gray-400'
          }`}
      >
        <span>{label}</span>
        {selectedCount > 0 && (
          <span className="bg-teal-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center leading-none">
            {selectedCount}
          </span>
        )}
        <svg className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className={`absolute top-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden flex flex-col
          ${wide ? 'w-72' : 'w-56'}`}
          style={{ maxHeight: '360px' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</span>
            {selectedCount > 0 && (
              <button
                onClick={(e) => { e.stopPropagation(); onClear() }}
                className="text-xs text-teal-500 hover:text-teal-700 font-medium transition-colors"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Search input */}
          {searchable && (
            <div className="px-3 py-2 border-b border-gray-100">
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search..."
                className="w-full text-sm bg-gray-100 rounded-lg px-3 py-1.5 outline-none text-gray-700 placeholder-gray-400"
              />
            </div>
          )}

          {/* Options list */}
          <div className="overflow-y-auto flex-1">
            {/* Grouped options */}
            {options && filteredGroups.map(group => (
              group.group === '🌐' ? (
                <div key="online" className="border-b border-gray-100">
                  {group.items.map(item => (
                    <label key={item.value} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={!!selected[item.value]}
                        onChange={() => onChange(item.value)}
                        className="accent-teal-500 w-4 h-4 rounded flex-shrink-0"
                      />
                      <span className="text-sm text-gray-700">{item.label}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <div key={group.group}>
                  <div className="px-4 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50 sticky top-0">
                    {group.group}
                  </div>
                  {group.items.map(item => (
                    <label key={item.value} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={!!selected[item.value]}
                        onChange={() => onChange(item.value)}
                        className="accent-teal-500 w-4 h-4 rounded flex-shrink-0"
                      />
                      <span className="text-sm text-gray-700">{item.label}</span>
                    </label>
                  ))}
                </div>
              )
            ))}

            {/* Flat options */}
            {flatOptions && filteredFlat.map(item => (
              <label key={item.value} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={!!selected[item.value]}
                  onChange={() => onChange(item.value)}
                  className="accent-teal-500 w-4 h-4 rounded flex-shrink-0"
                />
                <span className="text-sm text-gray-700">{item.label}</span>
              </label>
            ))}

            {/* Empty state */}
            {((options && filteredGroups.length === 0) || (flatOptions && filteredFlat.length === 0)) && (
              <div className="px-4 py-6 text-center text-sm text-gray-400">No results</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main Navbar ──────────────────────────────────────────────────────────────
export default function Navbar() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { isLoggedIn, logout } = useAuth()
  const isDiscover = pathname === '/discover'

  const [search, setSearch] = useState('')
  const [avatarOpen, setAvatarOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const avatarRef = useRef<HTMLDivElement>(null)

  const [categoryFilter, setCategoryFilter] = useState<FilterState>({})
  const [locationFilter, setLocationFilter] = useState<FilterState>({})
  const [ageFilter, setAgeFilter] = useState<FilterState>({})
  const [priceFilter, setPriceFilter] = useState<FilterState>({})
  const [genderFilter, setGenderFilter] = useState<FilterState>({})
  const [verifiedOnly, setVerifiedOnly] = useState(false)

  const toggle = useCallback((setter: React.Dispatch<React.SetStateAction<FilterState>>) => (val: string) => {
    setter(prev => ({ ...prev, [val]: !prev[val] }))
  }, [])

  const clear = useCallback((setter: React.Dispatch<React.SetStateAction<FilterState>>) => () => {
    setter({})
  }, [])

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) setAvatarOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <header className="bg-white shadow-sm sticky top-0 z-20">
      {/* Main nav row */}
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <NavLink to="/" className="text-xl font-semibold text-teal-500 tracking-tight">
          skillconnect
        </NavLink>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/'}
              className={({ isActive }) =>
                `text-sm transition-colors ${isActive ? 'text-gray-900 font-medium' : 'text-gray-400 hover:text-gray-700'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <div className="relative" ref={avatarRef}>
              <button onClick={() => setAvatarOpen(!avatarOpen)} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="avatar" className="w-9 h-9 rounded-full object-cover border-2 border-teal-100" />
              </button>
              {avatarOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-2xl shadow-lg border border-gray-100 py-2 z-30">
                  <NavLink to="/dashboard" onClick={() => setAvatarOpen(false)} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">Dashboard</NavLink>
                  <NavLink to="/profile/1" onClick={() => setAvatarOpen(false)} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">My profile</NavLink>
                  <NavLink to="/chat" onClick={() => setAvatarOpen(false)} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">Messages</NavLink>
                  <hr className="my-1 border-gray-100" />
                  <button onClick={() => { logout(); setAvatarOpen(false); navigate('/') }} className="block w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-gray-50 transition-colors">
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <NavLink to="/login" className="text-sm text-gray-500 hover:text-gray-800 transition-colors">Log in</NavLink>
              <NavLink to="/signup" className="text-sm bg-teal-500 hover:bg-teal-600 text-white px-5 py-2 rounded-full transition-colors">Sign up</NavLink>
            </div>
          )}
          <button
            className="md:hidden text-gray-500 hover:text-gray-800 transition-colors text-xl"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-6 py-4 flex flex-col gap-4">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/'}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `text-sm transition-colors ${isActive ? 'text-gray-900 font-medium' : 'text-gray-400'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
          {!isLoggedIn && (
            <div className="flex gap-3 pt-2 border-t border-gray-100">
              <NavLink to="/login" onClick={() => setMobileOpen(false)} className="text-sm text-gray-500">Log in</NavLink>
              <NavLink to="/signup" onClick={() => setMobileOpen(false)} className="text-sm bg-teal-500 text-white px-4 py-1.5 rounded-full">Sign up</NavLink>
            </div>
          )}
        </div>
      )}

      {/* Filter bar — only on /discover */}
      {isDiscover && (
        <div className="border-t border-gray-100">
          <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-2 flex-wrap">

            {/* Search */}
            <div className="relative flex-1 min-w-[180px] max-w-xs">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search skills or people..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-gray-100 rounded-full outline-none text-gray-700 placeholder-gray-400 focus:bg-gray-200 transition-colors"
              />
            </div>

            <div className="h-5 w-px bg-gray-200 mx-1" />

            {/* Category */}
            <FilterDropdown
              label="Category"
              options={CATEGORY_OPTIONS}
              selected={categoryFilter}
              onChange={toggle(setCategoryFilter)}
              onClear={clear(setCategoryFilter)}
              searchable
            />

            {/* Location */}
            <FilterDropdown
              label="Location"
              options={LOCATION_OPTIONS}
              selected={locationFilter}
              onChange={toggle(setLocationFilter)}
              onClear={clear(setLocationFilter)}
              searchable
              wide
            />

            {/* Age */}
            <FilterDropdown
              label="Age"
              flatOptions={AGE_OPTIONS}
              selected={ageFilter}
              onChange={toggle(setAgeFilter)}
              onClear={clear(setAgeFilter)}
            />

            {/* Price */}
            <FilterDropdown
              label="Price"
              flatOptions={PRICE_OPTIONS}
              selected={priceFilter}
              onChange={toggle(setPriceFilter)}
              onClear={clear(setPriceFilter)}
            />

            {/* Gender */}
            <FilterDropdown
              label="Gender"
              flatOptions={GENDER_OPTIONS}
              selected={genderFilter}
              onChange={toggle(setGenderFilter)}
              onClear={clear(setGenderFilter)}
            />

            {/* Verified */}
            <label className="flex items-center gap-2 cursor-pointer ml-1">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={e => setVerifiedOnly(e.target.checked)}
                className="accent-teal-500 w-4 h-4"
              />
              <span className="text-sm text-gray-500 whitespace-nowrap">Verified only</span>
            </label>
          </div>
        </div>
      )}
    </header>
  )
}
