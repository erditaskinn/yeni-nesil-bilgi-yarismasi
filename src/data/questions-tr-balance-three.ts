import type { Difficulty } from "../lib/config";
import type { GameCategory } from "../lib/categories";
import type { Question } from "../lib/types";

const sources = {
  academy: "https://www.oscars.org/oscars/rules-eligibility",
  un: "https://www.un.org/about-us/main-bodies",
  canyon: "https://whc.unesco.org/en/list/75/",
  angkor: "https://whc.unesco.org/en/list/668/",
  tdk: "https://yazim.tdk.gov.tr/",
  athletics: "https://worldathletics.org/our-sport",
  cern: "https://home.cern/science/computing/the-birth-of-the-web/short-history-web/",
} as const;

type Category = Exclude<GameCategory, "mixed">;
type Row = readonly [string, Difficulty, Category, string, readonly [string, string, string, string], string, keyof typeof sources];

const rows: readonly Row[] = [
  ["trp001", "easy", "cinema_television", "Bir filmde oyuncuların giyeceği kıyafetleri tasarlayan ekibin işi hangi Oscar dalıyla ilişkilidir?", ["Kostüm tasarımı", "Görüntü yönetimi", "Ses", "Kurgu"], "Akademi ödüllerinde kostüm tasarımı ayrı bir daldır.", "academy"],
  ["trp002", "easy", "cinema_television", "Bir filmin sahnelerini seçip sıralama işi hangi Oscar dalıyla ilişkilidir?", ["Film kurgusu", "Makyaj", "Özgün şarkı", "Kostüm"], "Akademi film kurgusunu ayrı bir ödül dalı olarak listeler.", "academy"],
  ["trp003", "medium", "cinema_television", "Var olan bir kitap ya da oyundan uyarlanan senaryo hangi Oscar yazarlık dalında değerlendirilir?", ["Uyarlama senaryo", "Özgün senaryo", "Özgün müzik", "Görsel efekt"], "Akademi yazarlık ödüllerinde uyarlama ve özgün senaryoyu ayrı dallar olarak sayar.", "academy"],
  ["trp004", "medium", "cinema_television", "Oyuncunun görünümünü saç ve yüz uygulamalarıyla oluşturan çalışma hangi Oscar dalındadır?", ["Makyaj ve saç tasarımı", "Kurgu", "Görüntü yönetimi", "Özgün müzik"], "Akademi makyaj ve saç tasarımına ayrı ödül verir.", "academy"],
  ["trp005", "medium", "cinema_television", "Bir film için bestelenmiş sözlü müziğin yarıştığı Oscar dalı hangisidir?", ["Özgün şarkı", "Özgün senaryo", "Görsel efekt", "Kurgu"], "Akademi özgün şarkıyı özgün film müziğinden ayrı değerlendirir.", "academy"],
  ["trp006", "medium", "cinema_television", "Bir filmin kamera görüntülerinin oluşturulması hangi Oscar dalının konusudur?", ["Görüntü yönetimi", "Kostüm tasarımı", "Ses", "Film kurgusu"], "Akademi görüntü yönetimini ayrı bir ödül dalı olarak tanımlar.", "academy"],
  ["trp007", "medium", "cinema_television", "Oscar'da mevcut bir esere dayanmadan yazılmış senaryo hangi dalda yarışır?", ["Özgün senaryo", "Uyarlama senaryo", "Özgün şarkı", "Belgesel kısa film"], "Akademi özgün senaryo ile uyarlama senaryoyu ayırır.", "academy"],
  ["trp008", "medium", "cinema_television", "Akademi kurallarında oyuncu performansı için hangi iki ayrı ödül konumu bulunur?", ["Başrol ve yardımcı rol", "Kısa film ve uzun film", "Kurgu ve görüntü", "Ses ve müzik"], "Akademi oyunculuk ödüllerinde başrol ve yardımcı rol ayrımı yapar.", "academy"],

  ["trp009", "easy", "general_knowledge", "BM Genel Kurulunda hangi ülkelerin temsilcileri bulunur?", ["Bütün üye ülkelerin", "Yalnız daimi üyelerin", "Yalnız Avrupa ülkelerinin", "Yalnız kurucu ülkelerin"], "BM, Genel Kurulun tüm üye devletleri temsil ettiğini açıklar.", "un"],
  ["trp010", "medium", "general_knowledge", "BM'nin barış ve güvenlik konularında birincil sorumlu organı hangisidir?", ["Güvenlik Konseyi", "UNESCO", "Dünya Sağlık Örgütü", "Uluslararası Para Fonu"], "BM Şartı barış ve güvenlikte birincil sorumluluğu Güvenlik Konseyine verir.", "un"],
  ["trp011", "medium", "general_knowledge", "BM'de ekonomik, sosyal ve çevresel konuları eşgüdümleyen ana organ hangisidir?", ["Ekonomik ve Sosyal Konsey", "Güvenlik Konseyi", "Vesayet Konseyi", "Sekretarya"], "BM Ekonomik ve Sosyal Konseyi bu alanların eşgüdümüyle görevlendirir.", "un"],
  ["trp012", "medium", "general_knowledge", "BM'nin günlük çalışmalarını yürüten idari yapısı hangisidir?", ["Sekretarya", "Genel Kurul", "Güvenlik Konseyi", "Uluslararası Adalet Divanı"], "BM Sekretaryası kuruluşun günlük işlerini yürütür.", "un"],
  ["trp013", "hard", "general_knowledge", "BM Genel Sekreteri, hangi organın önerisi üzerine Genel Kurulca atanır?", ["Güvenlik Konseyi", "Ekonomik ve Sosyal Konsey", "Vesayet Konseyi", "Uluslararası Adalet Divanı"], "BM Genel Sekreteri Güvenlik Konseyinin önerisiyle Genel Kurul tarafından atanır.", "un"],
  ["trp014", "hard", "general_knowledge", "BM Vesayet Konseyi, bütün vesayet bölgeleri bağımsızlığa erişince çalışmalarını hangi yılda askıya aldı?", ["1994", "1945", "1972", "2010"], "BM Vesayet Konseyinin çalışmalarını 1994'te askıya aldığını belirtir.", "un"],
  ["trp015", "expert", "general_knowledge", "BM Ekonomik ve Sosyal Konseyinin kaç üyesi vardır?", ["54", "15", "51", "193"], "BM, Ekonomik ve Sosyal Konseyin 54 üyeli olduğunu kaydeder.", "un"],

  ["trp016", "easy", "geography", "Büyük Kanyon'u şekillendiren başlıca doğal süreç hangisidir?", ["Akarsu aşındırması", "Buzul birikimi", "Lav püskürmesi", "Mercan büyümesi"], "UNESCO, kanyonun Colorado Nehri'nin aşındırmasıyla biçimlendiğini anlatır.", "canyon"],
  ["trp017", "easy", "geography", "Büyük Kanyon'un duvarlarında görülen yatay katmanlar en çok neyin izlerini taşır?", ["Yer tarihinin", "Günlük hava tahmininin", "Okyanus gelgit saatlerinin", "Ay evrelerinin"], "UNESCO, katmanların jeolojik tarihe ilişkin kayıt sunduğunu belirtir.", "canyon"],
  ["trp018", "medium", "geography", "Büyük Kanyon'un yer aldığı ABD eyaleti hangisidir?", ["Arizona", "Alaska", "Florida", "Maine"], "UNESCO, Büyük Kanyon'u Arizona eyaletinde konumlandırır.", "canyon"],
  ["trp019", "medium", "geography", "Büyük Kanyon'un tabakaları hangi bilim dalının incelemesine özellikle uygundur?", ["Jeoloji", "Dilbilim", "Müzikoloji", "Sosyoloji"], "UNESCO, kaya katmanlarının Dünya'nın jeolojik geçmişini görünür kıldığını açıklar.", "canyon"],
  ["trp020", "medium", "geography", "Büyük Kanyon'un yaklaşık derinliği hangi seçeneğe en yakındır?", ["1,5 kilometre", "15 metre", "150 kilometre", "15 kilometre"], "UNESCO Büyük Kanyon'un derinliğini yaklaşık 1,5 kilometre olarak verir.", "canyon"],
  ["trp021", "hard", "geography", "UNESCO'ya göre Büyük Kanyon'un uzunluğu yaklaşık kaç kilometredir?", ["445", "45", "1.445", "4.450"], "UNESCO, kanyonun yaklaşık 445 kilometre boyunca uzandığını kaydeder.", "canyon"],
  ["trp022", "expert", "geography", "UNESCO'ya göre Büyük Kanyon'un kaya katmanları yaklaşık kaç milyar yıllık geçmişi gösterir?", ["2 milyar", "20 milyon", "200 milyon", "20 milyar"], "UNESCO, yatay tabakaların yaklaşık iki milyar yıllık jeolojik tarihi yansıttığını açıklar.", "canyon"],

  ["trp023", "easy", "history", "Angkor Wat tapınağı hangi tarihî alanın içindedir?", ["Angkor", "Petra", "Pompeii", "Stonehenge"], "UNESCO, Angkor Wat'ı Angkor arkeoloji alanının ünlü tapınağı olarak anar.", "angkor"],
  ["trp024", "medium", "history", "Angkor kalıntıları Kamboçya'nın hangi ilinde yer alır?", ["Siem Reap", "Phnom Penh", "Battambang", "Kampot"], "UNESCO, Angkor'u Kamboçya'nın Siem Reap ilinde konumlandırır.", "angkor"],
  ["trp025", "hard", "history", "Angkor Thom'daki heykel süslemeleriyle tanınan tapınak hangisidir?", ["Bayon", "Parthenon", "Pantheon", "El Castillo"], "UNESCO, Bayon Tapınağı'nı Angkor Thom içindeki heykelli yapılar arasında sayar.", "angkor"],
  ["trp026", "expert", "history", "UNESCO'ya göre Angkor arkeoloji alanı ormanlık bölümlerle birlikte yaklaşık kaç kilometrekaredir?", ["400", "40", "4.000", "4"], "UNESCO Angkor alanını yaklaşık 400 kilometrekare olarak belirtir.", "angkor"],

  ["trp027", "easy", "language_literature", "Türkçede soru anlamı veren 'mi' nasıl yazılır?", ["Önceki sözcükten ayrı", "Önceki sözcüğe bitişik", "Yalnız büyük harfle", "Her zaman kesmeyle"], "TDK soru ekinin ayrı yazıldığını belirtir.", "tdk"],
  ["trp028", "easy", "language_literature", "'Ben de geliyorum' cümlesindeki 'de' nasıl yazılır?", ["Ayrı", "Bitişik", "Kesme işaretiyle", "Tireyle"], "TDK bağlaç olan da/de'nin ayrı yazıldığını açıklar.", "tdk"],
  ["trp029", "easy", "language_literature", "'Evde oturuyorum' cümlesindeki '-de' nasıl yazılır?", ["Sözcüğe bitişik", "Her zaman ayrı", "Kesme işaretiyle", "Noktadan sonra"], "TDK bulunma durumu ekinin sözcüğe bitişik yazıldığını açıklar.", "tdk"],
  ["trp030", "medium", "language_literature", "Özel adlara gelen çekim ekini ayırmak için hangi işaret kullanılır?", ["Kesme işareti", "Kısa çizgi", "Noktalı virgül", "Eğik çizgi"], "TDK özel adlara gelen çekim eklerinin kesme işaretiyle ayrıldığını açıklar.", "tdk"],
  ["trp031", "medium", "language_literature", "Bir açıklama ya da örnekler listesi başlamadan önce hangi noktalama işareti kullanılır?", ["İki nokta", "Kesme işareti", "Soru işareti", "Tırnak işareti"], "TDK iki noktayı açıklama ve örneklerden önce kullanılan işaretler arasında sayar.", "tdk"],
  ["trp032", "medium", "language_literature", "'Kitaptaki resim' sözünde 'ki' hangi görevde kullanıldığı için bitişiktir?", ["İlgi eki", "Bağlaç", "Ünlem", "Soru eki"], "TDK, ek olan -ki'yi sözcüğe bitişik yazar.", "tdk"],
  ["trp033", "hard", "language_literature", "'Öyle bir gün ki unutulmaz' cümlesindeki 'ki' nasıl yazılır?", ["Ayrı", "Bitişik", "Kesme işaretiyle", "Kısa çizgiyle"], "TDK bağlaç görevindeki ki'nin ayrı yazıldığını belirtir.", "tdk"],
  ["trp034", "hard", "language_literature", "TDK'ye göre 'ki' bağlacının kalıplaşarak bitişik yazıldığı sözcük hangisidir?", ["Çünkü", "Madem ki", "Oysa ki", "Demek ki"], "TDK çünkü sözcüğünü kalıplaşmış bitişik yazım örnekleri arasında sayar.", "tdk"],

  ["trp035", "easy", "sports", "Atletizmde engelli koşunun ayırt edici özelliği nedir?", ["Koşu yolunda engeller bulunması", "Raket kullanılması", "Topa vurulması", "Suda yüzülmesi"], "World Athletics engelli koşuları ayrı bir koşu dalı olarak listeler.", "athletics"],
  ["trp036", "easy", "sports", "Bayrak yarışında sporcular takım arkadaşına ne devreder?", ["Bayrak", "Raket", "Disk", "Cirit"], "World Athletics bayrak yarışlarını atletizm dalları arasında sayar.", "athletics"],
  ["trp037", "medium", "sports", "Atletizmde on farklı yarışmadan oluşan birleşik dalın adı nedir?", ["Dekatlon", "Maraton", "Heptatlon", "Triatlon"], "World Athletics dekatlonu birleşik yarışmalar arasında listeler.", "athletics"],
  ["trp038", "medium", "sports", "Atletizmde yedi yarışmadan oluşan birleşik dal hangisidir?", ["Heptatlon", "Dekatlon", "Maraton", "Pentatlon"], "World Athletics heptatlonu birleşik yarışmalar arasında sayar.", "athletics"],
  ["trp039", "medium", "sports", "Hangisi atletizmde atma dallarından biridir?", ["Gülle atma", "Sırıkla atlama", "400 metre koşu", "Yürüyüş"], "World Athletics gülle atmayı atma dalları arasında listeler.", "athletics"],
  ["trp040", "medium", "sports", "Hangisi atletizmde atlama dallarından biridir?", ["Üç adım atlama", "Disk atma", "Maraton", "400 metre engelli"], "World Athletics üç adım atlamayı atlama dalları arasında sayar.", "athletics"],
  ["trp041", "medium", "sports", "World Athletics 3000 metre engelli koşuyu hangi yarışma grubunda listeler?", ["Orta ve uzun mesafe koşuları", "Atma dalları", "Atlama dalları", "Bayrak yarışları"], "World Athletics 3000 metre engelliyi orta ve uzun mesafe koşuları arasında sayar.", "athletics"],
  ["trp042", "expert", "sports", "World Athletics'in yol yürüyüşü bölümünde 20 kilometrenin yanında hangi mesafe bulunur?", ["35 kilometre", "5 kilometre", "100 kilometre", "200 kilometre"], "World Athletics yürüyüş dallarında 20 ve 35 kilometreyi listeler.", "athletics"],

  ["trp043", "easy", "technology", "İlk Web sitesi hangi kuruluşta kuruldu?", ["CERN", "NASA", "UNESCO", "IBM"], "CERN ilk Web sitesinin kendi araştırma merkezinde kurulduğunu anlatır.", "cern"],
  ["trp044", "easy", "technology", "Web'in ilk döneminde sayfalar arasında geçiş sağlayan bağlantı fikrine ne denir?", ["Hiper metin", "Disket", "Piksel", "Kablo"], "CERN Web'in hiper metin belgelerini bağlantılarla ilişkilendirdiğini açıklar.", "cern"],
  ["trp045", "easy", "technology", "İlk Web sitesinin konusu neydi?", ["World Wide Web projesi", "Hava durumu", "Çevrim içi alışveriş", "Sinema biletleri"], "CERN ilk sitenin Web projesini anlattığını belirtir.", "cern"],
  ["trp046", "medium", "technology", "İlk Web sayfalarındaki arama işlevi neye dayanıyordu?", ["Anahtar sözcüklere", "Sesli komutlara", "Yüz tanımaya", "Uydu sinyallerine"], "CERN, ilk yıllardaki arama işlevinin anahtar sözcüklerle çalıştığını ve henüz arama motorları bulunmadığını açıklar.", "cern"],
  ["trp047", "hard", "technology", "Farklı bilgisayarlarda çalışabilen erken dönem 'line-mode' Web tarayıcısını kim yazdı?", ["Nicola Pellow", "Ada Lovelace", "Grace Hopper", "Hedy Lamarr"], "CERN, line-mode tarayıcıyı stajı sırasında Nicola Pellow'un yazdığını belirtir.", "cern"],
  ["trp048", "medium", "technology", "İlk yaygın grafik Web tarayıcılarından Mosaic'i hangi ABD kurumu geliştirdi?", ["NCSA", "NASA", "FBI", "UNESCO"], "CERN, Mosaic'in Illinois Üniversitesindeki NCSA tarafından çıkarıldığını açıklar.", "cern"],
  ["trp049", "hard", "technology", "CERN'e göre ABD'deki ilk Web sunucusu hangi laboratuvarda kuruldu?", ["SLAC", "Bell Labs", "NASA Ames", "MIT Media Lab"], "CERN, ABD'deki ilk Web sunucusunun SLAC'ta 1991'de açıldığını belirtir.", "cern"],
  ["trp050", "expert", "technology", "CERN'in Web geçmişine göre sistemin ilk kamuya açık adresi hangisiydi?", ["info.cern.ch", "www.nasa.gov", "w3.org", "ibm.com"], "CERN, ilk Web sunucusunun adresini info.cern.ch olarak kaydeder.", "cern"],
];

export const turkishBalanceThree: readonly Question[] = rows.map(([id, difficulty, category, question, options, explanation, source]) => ({
  id, difficulty, category, question,
  choices: options.map((text, index) => ({ id: `${id}-${index}`, text })) as unknown as Question["choices"],
  correctAnswer: `${id}-0`, explanation, sourceUrl: sources[source], reviewedAt: "2026-11-10",
}));
