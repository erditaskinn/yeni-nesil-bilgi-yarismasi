import type { Difficulty } from "../lib/config";
import type { GameCategory } from "../lib/categories";
import type { Question } from "../lib/types";

const sources = {
  penalty: "https://www.theifab.com/laws/latest/the-penalty-kick/",
  field: "https://www.theifab.com/laws/latest/the-field-of-play/",
  oscars1940: "https://www.oscars.org/oscars/ceremonies/1940",
  oscars1941: "https://www.oscars.org/oscars/ceremonies/1941",
  http: "https://www.rfc-editor.org/rfc/rfc9110.html",
  ebru: "https://ich.unesco.org/en/RL/ebru-turkish-art-of-marbling-00644",
  karagoz: "https://ich.unesco.org/en/RL/karagz-00180",
  coffee: "https://ich.unesco.org/en/RL/turkish-coffee-culture-and-tradition-00645",
  archery: "https://ich.unesco.org/en/RL/traditional-turkish-archery-01367",
  sema: "https://ich.unesco.org/en/RL/mevlevi-sema-ceremony-00100",
  units: "https://www.nist.gov/pml/owm/metric-si/si-units",
  prefixes: "https://www.nist.gov/pml/owm/metric-si-prefixes",
} as const;

type Category = Exclude<GameCategory, "mixed">;
type Row = readonly [string, Difficulty, Category, string, readonly [string, string, string, string], string, keyof typeof sources];

const rows: readonly Row[] = [
  ["tri001", "easy", "sports", "Futbolda penaltı vuruşundan top doğrudan kaleye girerse gol sayılabilir mi?", ["Evet", "Hayır", "Yalnız uzatmada", "Yalnız kaleci topa dokunursa"], "IFAB kuralları penaltı vuruşundan doğrudan gol atılabileceğini belirtir.", "penalty"],
  ["tri002", "medium", "sports", "Penaltıyı kullanan oyuncu top başka bir oyuncuya değmeden yeniden oynarsa ne olur?", ["Rakibe endirekt serbest vuruş verilir", "Gol sayılır", "Köşe vuruşu verilir", "Oyun devam eder"], "IFAB'a göre penaltıyı kullanan kişi top başka birine değmeden ikinci kez oynayamaz.", "penalty"],
  ["tri003", "medium", "sports", "Penaltı vuruşunda top hangi yöne vurulmalıdır?", ["İleri", "Geri", "Mutlaka sola", "Mutlaka sağa"], "IFAB penaltı topunun ileri doğru vurulmasını şart koşar.", "penalty"],
  ["tri004", "hard", "sports", "Penaltı sırasında diğer oyuncular penaltı noktasından en az kaç metre uzakta olmalıdır?", ["9,15", "2", "5,5", "16,5"], "IFAB, vuruşu yapan ve kaleci dışındaki oyuncular için en az 9,15 metre uzaklık ister.", "penalty"],
  ["tri005", "hard", "sports", "Penaltı vuruşunda kaleci topa vuruluncaya kadar nerede kalmalıdır?", ["Kale çizgisinde", "Penaltı noktasında", "Orta çizgide", "Kale alanı dışında"], "IFAB'a göre kaleci vuruş anına kadar direkler arasında kale çizgisinde bulunur.", "penalty"],
  ["tri006", "medium", "sports", "Penaltı kullanılırken top ne zaman oyuna girer?", ["Vurulup belirgin biçimde hareket edince", "Hakem düdük çalınca", "Kaleci yer değiştirince", "Top kale çizgisini geçince"], "IFAB'a göre top vurulup belirgin biçimde hareket ettiğinde oyundadır.", "penalty"],
  ["tri007", "hard", "sports", "Penaltıyı kullanan oyuncunun topu doğrudan kaleye şutlamak yerine takım arkadaşına pas vermesi mümkün müdür?", ["Evet, top ileri giderse", "Hayır, mutlaka şut çekmelidir", "Yalnız uzatmada", "Yalnız kaleci izin verirse"], "IFAB, ileri vurulan ve ikinci kez dokunulmayan penaltı topuyla pas verilmesine izin verir.", "penalty"],
  ["tri008", "medium", "sports", "Uluslararası futbol maçlarında taç çizgisinin uzunluğu en az kaç metredir?", ["100", "64", "75", "120"], "IFAB, uluslararası maçlar için saha uzunluğunu en az 100 metre olarak tanımlar.", "field"],
  ["tri009", "hard", "sports", "Futbolda kale alanının çizgileri kale direklerinin içinden kaç metre uzakta başlar?", ["5,5", "9,15", "11", "16,5"], "IFAB kale alanı yan sınırlarını direklerin içinden 5,5 metre uzakta belirler.", "field"],
  ["tri010", "hard", "sports", "Futbolda ceza alanının çizgileri kale direklerinin içinden kaç metre uzakta başlar?", ["16,5", "5,5", "9,15", "11"], "IFAB ceza alanı yan sınırlarını direklerin içinden 16,5 metre uzakta belirler.", "field"],

  ["tri011", "easy", "cinema_television", "1940 Oscar töreninde En İyi Film ödülünü hangi yapım kazandı?", ["Rüzgâr Gibi Geçti", "Rebecca", "Ben-Hur", "Yurttaş Kane"], "Akademi arşivine göre 1940 töreninin En İyi Film ödülü Rüzgâr Gibi Geçti'ye verildi.", "oscars1940"],
  ["tri012", "medium", "cinema_television", "Rüzgâr Gibi Geçti ile 1940'ta En İyi Kadın Oyuncu Oscar'ını kim aldı?", ["Vivien Leigh", "Ginger Rogers", "Olivia de Havilland", "Bette Davis"], "Akademi'nin 1940 kaydı En İyi Kadın Oyuncu ödülünü Vivien Leigh'e verir.", "oscars1940"],
  ["tri013", "medium", "cinema_television", "Rüzgâr Gibi Geçti ile 1940'ta En İyi Yardımcı Kadın Oyuncu ödülünü kim kazandı?", ["Hattie McDaniel", "Judy Garland", "Greer Garson", "Joan Fontaine"], "Hattie McDaniel, Akademi'nin 1940 yardımcı kadın oyuncu kazananıdır.", "oscars1940"],
  ["tri014", "hard", "cinema_television", "Rüzgâr Gibi Geçti filminin 1940 Oscar töreninde ödül alan yönetmeni kimdi?", ["Victor Fleming", "Alfred Hitchcock", "William Wyler", "Frank Capra"], "Akademi, 1940 yönetmenlik ödülünü Victor Fleming'e verdi.", "oscars1940"],
  ["tri015", "hard", "cinema_television", "1940 töreninde Rüzgâr Gibi Geçti'nin En İyi Senaryo ödülü kime verildi?", ["Sidney Howard", "Orson Welles", "Billy Wilder", "John Ford"], "Akademi arşivinde filmin senaryo ödülünün sahibi Sidney Howard'dır.", "oscars1940"],
  ["tri016", "medium", "cinema_television", "1941 Oscar töreninde The Philadelphia Story ile En İyi Erkek Oyuncu kim seçildi?", ["James Stewart", "Henry Fonda", "Laurence Olivier", "Charles Chaplin"], "Akademi, 1941 erkek oyuncu ödülünü James Stewart'a verdi.", "oscars1941"],
  ["tri017", "medium", "cinema_television", "1941'de Kitty Foyle ile En İyi Kadın Oyuncu ödülünü kim kazandı?", ["Ginger Rogers", "Joan Fontaine", "Katharine Hepburn", "Bette Davis"], "Akademi'nin 1941 kadın oyuncu kazananı Ginger Rogers'tır.", "oscars1941"],
  ["tri018", "hard", "cinema_television", "1941'de The Westerner filmiyle En İyi Yardımcı Erkek Oyuncu kim seçildi?", ["Walter Brennan", "James Stewart", "Jack Oakie", "Henry Fonda"], "Akademi 1941 yardımcı erkek oyuncu ödülünü Walter Brennan'a verdi.", "oscars1941"],
  ["tri019", "hard", "cinema_television", "1941'de The Grapes of Wrath ile En İyi Yardımcı Kadın Oyuncu ödülünü kim aldı?", ["Jane Darwell", "Judith Anderson", "Ruth Hussey", "Ginger Rogers"], "Akademi'nin 1941 yardımcı kadın oyuncu kazananı Jane Darwell'dir.", "oscars1941"],
  ["tri020", "expert", "cinema_television", "1941 Oscar töreninde The Philadelphia Story filminin senaryo ödülünü kim kazandı?", ["Donald Ogden Stewart", "Sidney Howard", "Orson Welles", "Robert Riskin"], "Akademi, The Philadelphia Story senaryosuyla Donald Ogden Stewart'ı ödüllendirdi.", "oscars1941"],

  ["tri021", "easy", "technology", "Bir web kaynağının güncel içeriğini almak için kullanılan HTTP yöntemi hangisidir?", ["GET", "DELETE", "PUT", "TRACE"], "RFC 9110, GET yöntemini hedef kaynağın güncel temsilini aktarmak için tanımlar.", "http"],
  ["tri022", "medium", "technology", "Bir web kaynağının başlık bilgisini gövdesini almadan istemek için hangi HTTP yöntemi kullanılır?", ["HEAD", "POST", "DELETE", "CONNECT"], "RFC 9110'a göre HEAD, GET'e benzer ancak yanıt içeriğini aktarmaz.", "http"],
  ["tri023", "medium", "technology", "HTTP'de hedef kaynağın mevcut temsilini yeni içerikle değiştirmeyi amaçlayan yöntem hangisidir?", ["PUT", "GET", "HEAD", "TRACE"], "RFC 9110, PUT isteğinin hedef kaynağın temsilini istek içeriğiyle değiştirmeyi amaçladığını belirtir.", "http"],
  ["tri024", "medium", "technology", "Bir sunucudan kaynağın kaldırılmasını isteyen HTTP yöntemi hangisidir?", ["DELETE", "GET", "OPTIONS", "HEAD"], "RFC 9110, DELETE yöntemini hedef kaynakla bağlantının kaldırılması isteği olarak tanımlar.", "http"],
  ["tri025", "easy", "technology", "HTTP 200 durum kodu genel olarak neyi bildirir?", ["İstek başarılı", "Kaynak bulunamadı", "Sunucu geçici olarak kullanılamıyor", "Kalıcı yönlendirme"], "RFC 9110'a göre 200 OK isteğin başarılı olduğunu bildirir.", "http"],
  ["tri026", "easy", "technology", "HTTP 404 durum kodu ne anlama gelir?", ["Kaynak bulunamadı", "İstek başarılı", "Yeni kaynak oluşturuldu", "Sunucu meşgul"], "RFC 9110, 404 Not Found kodunu istenen kaynak bulunamadığında tanımlar.", "http"],
  ["tri027", "medium", "technology", "Bir HTTP kaynağının kalıcı olarak taşındığını hangi durum kodu bildirir?", ["301", "200", "404", "503"], "RFC 9110'da 301 kodu Moved Permanently, yani kalıcı taşınmadır.", "http"],
  ["tri028", "medium", "technology", "HTTP 503 durum kodu hangi durumu bildirir?", ["Hizmet kullanılamıyor", "İstek başarılı", "Kaynak kalıcı taşındı", "Kaynak oluşturuldu"], "RFC 9110, 503 Service Unavailable kodunu hizmetin geçici olarak kullanılamaması için tanımlar.", "http"],
  ["tri029", "hard", "technology", "İsteğin ardından yeni kaynak oluştuğunda HTTP'de yaygın başarı kodu hangisidir?", ["201", "301", "404", "503"], "RFC 9110, 201 Created durum kodunu bir veya daha fazla yeni kaynak oluşturulmasıyla ilişkilendirir.", "http"],
  ["tri030", "hard", "technology", "İşlem başarılı ama yanıtta içerik gönderilmiyorsa hangi HTTP kodu uygundur?", ["204", "404", "301", "503"], "RFC 9110, 204 No Content kodunu başarılı fakat yanıt içeriği olmayan işlemler için tanımlar.", "http"],

  ["tri031", "easy", "turkiye", "Ebru sanatında desen önce hangi yüzeyde oluşturulur?", ["Yoğunlaştırılmış sıvı yüzeyinde", "Cam levhada", "Taş duvarda", "Kuru toprakta"], "UNESCO'ya göre Ebru desenleri sıvı yüzeyinde oluşturulup kâğıda aktarılır.", "ebru"],
  ["tri032", "medium", "turkiye", "Ebru sanatı UNESCO Somut Olmayan Kültürel Miras Listesi'ne hangi yıl girdi?", ["2014", "2009", "2019", "2022"], "UNESCO, Ebru sanatının 2014'te listeye kaydedildiğini belirtir.", "ebru"],
  ["tri033", "medium", "turkiye", "Karagöz gösterisinde figürler hangi sanat türünün parçasıdır?", ["Gölge oyunu", "Bale", "Opera", "Pandomim"], "UNESCO, Karagöz'ü Türkiye'ye özgü bir gölge tiyatrosu olarak tanımlar.", "karagoz"],
  ["tri034", "hard", "turkiye", "Karagöz tasvirleri geleneksel olarak hangi malzemeden yapılır?", ["Deve veya öküz derisinden", "Demir levhadan", "Camdan", "Mermerden"], "UNESCO, tasvirlerin deve ya da öküz derisinden yapıldığını belirtir.", "karagoz"],
  ["tri035", "medium", "turkiye", "Karagöz oyunundaki başlıca iki karakterden biri Karagöz, diğeri kimdir?", ["Hacivat", "Keloğlan", "Nasreddin Hoca", "Dede Korkut"], "UNESCO, geleneksel oyunun iki ana kişisini Karagöz ve Hacivat olarak belirtir.", "karagoz"],
  ["tri036", "medium", "turkiye", "Türk kahvesi kültürü UNESCO Somut Olmayan Kültürel Miras Listesi'ne hangi yıl kaydedildi?", ["2013", "2003", "2009", "2023"], "UNESCO, Türk kahvesi kültürünü 2013'te listeye aldı.", "coffee"],
  ["tri037", "easy", "turkiye", "Geleneksel Türk kahvesi hangi kapta yavaşça pişirilir?", ["Cezve", "Semaver", "Çaydanlık", "Tencere"], "UNESCO, öğütülmüş kahvenin suyla cezvede yavaşça pişirildiğini anlatır.", "coffee"],
  ["tri038", "medium", "turkiye", "Geleneksel Türk okçuluğu UNESCO listesine hangi yıl girdi?", ["2019", "2008", "2013", "2024"], "UNESCO, geleneksel Türk okçuluğunu 2019'da listeye kaydetti.", "archery"],
  ["tri039", "medium", "turkiye", "Mevlevi Sema töreninin tarihsel merkezi hangi şehirdir?", ["Konya", "Edirne", "Trabzon", "Antalya"], "UNESCO'ya göre Mevlevilik 1273'te Konya'da kuruldu.", "sema"],
  ["tri040", "hard", "turkiye", "Mevlevi Sema töreninde dönen semazenler dönüşü sürdürmek için hangi ayağı kullanır?", ["Sağ ayak", "Sol ayak", "İki ayak eşit", "Hiçbiri"], "UNESCO, semazenlerin sol ayakları üzerinde dönüp sağ ayaklarıyla hareketi sürdürdüğünü açıklar.", "sema"],

  ["tri041", "easy", "general_knowledge", "SI sisteminde uzunluğun temel birimi hangisidir?", ["Metre", "Litre", "Gram", "Saat"], "NIST, uzunluk için SI temel birimini metre olarak listeler.", "units"],
  ["tri042", "easy", "general_knowledge", "SI sisteminde zamanın temel birimi hangisidir?", ["Saniye", "Dakika", "Saat", "Gün"], "NIST, zaman için SI temel birimini saniye olarak listeler.", "units"],
  ["tri043", "medium", "general_knowledge", "SI sisteminde elektrik akımının temel birimi hangisidir?", ["Amper", "Volt", "Watt", "Ohm"], "NIST, elektrik akımının SI temel birimini amper olarak belirtir.", "units"],
  ["tri044", "medium", "general_knowledge", "SI sisteminde termodinamik sıcaklığın temel birimi hangisidir?", ["Kelvin", "Santigrat derece", "Fahrenhayt", "Joule"], "NIST, termodinamik sıcaklığın SI temel birimini kelvin olarak verir.", "units"],
  ["tri045", "hard", "general_knowledge", "SI sisteminde madde miktarının temel birimi hangisidir?", ["Mol", "Gram", "Newton", "Pascal"], "NIST, madde miktarı için temel birimi mol olarak listeler.", "units"],
  ["tri046", "hard", "general_knowledge", "SI sisteminde ışık şiddetinin temel birimi hangisidir?", ["Kandela", "Lümen", "Lux", "Watt"], "NIST, ışık şiddetinin temel birimini kandela olarak tanımlar.", "units"],
  ["tri047", "medium", "general_knowledge", "SI'da 'kilo' öneki kaç katı belirtir?", ["Bin", "Yüz", "Bir milyon", "Bir milyar"], "NIST önek tablosunda kilo 10 üzeri 3, yani bin kattır.", "prefixes"],
  ["tri048", "medium", "general_knowledge", "SI'da 'mega' öneki kaç katı belirtir?", ["Bir milyon", "Bin", "Bir milyar", "Bir trilyon"], "NIST önek tablosunda mega 10 üzeri 6, yani bir milyon kattır.", "prefixes"],
  ["tri049", "hard", "general_knowledge", "SI'da 'mikro' öneki hangi kesri belirtir?", ["Milyonda bir", "Binde bir", "Yüzde bir", "Milyarda bir"], "NIST'e göre mikro öneki 10 üzeri eksi 6, yani milyonda birdir.", "prefixes"],
  ["tri050", "hard", "general_knowledge", "SI'da 'nano' öneki hangi kesri belirtir?", ["Milyarda bir", "Milyonda bir", "Binde bir", "Trilyonda bir"], "NIST'e göre nano öneki 10 üzeri eksi 9, yani milyarda birdir.", "prefixes"],
];

export const turkishFiftyThree: readonly Question[] = rows.map(([id, difficulty, category, question, options, explanation, source]) => ({
  id, difficulty, category, question,
  choices: [
    { id: `${id}-0`, text: options[0] },
    { id: `${id}-1`, text: options[1] },
    { id: `${id}-2`, text: options[2] },
    { id: `${id}-3`, text: options[3] },
  ],
  correctAnswer: `${id}-0`, explanation, sourceUrl: sources[source], reviewedAt: "2026-10-15",
}));
