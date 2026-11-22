import type { Difficulty } from "../lib/config";
import type { GameCategory } from "../lib/categories";
import type { Question } from "../lib/types";

const sources = {
  offside: "https://www.theifab.com/laws/latest/offside/",
  throwIn: "https://www.theifab.com/laws/latest/the-throw-in/",
  corner: "https://www.theifab.com/laws/latest/the-corner-kick/",
  goalKick: "https://www.theifab.com/laws/latest/the-goal-kick/",
  ball: "https://www.theifab.com/laws/latest/the-ball/",
  wcag: "https://www.w3.org/TR/WCAG22/",
  oscars1950: "https://www.oscars.org/oscars/ceremonies/1950",
  oscars1960: "https://www.oscars.org/oscars/ceremonies/1960",
  oscars1970: "https://www.oscars.org/oscars/ceremonies/1970",
  galapagos: "https://whc.unesco.org/en/list/1",
  serengeti: "https://whc.unesco.org/en/list/156",
  iguazu: "https://whc.unesco.org/en/list/303",
  namib: "https://whc.unesco.org/en/list/1430",
  kathmandu: "https://whc.unesco.org/en/list/121",
  vatican: "https://whc.unesco.org/en/list/286",
  greatWall: "https://whc.unesco.org/en/list/438",
  taj: "https://whc.unesco.org/en/list/252",
} as const;

type Category = Exclude<GameCategory, "mixed">;
type Row = readonly [string, Difficulty, Category, string, readonly [string, string, string, string], string, keyof typeof sources];

const rows: readonly Row[] = [
  ["trg001", "easy", "sports", "Taç atışından top doğrudan rakip kaleye girerse hangi karar verilir?", ["Kale vuruşu", "Gol", "Köşe vuruşu", "Penaltı"], "IFAB'a göre taç atışından doğrudan gol olmaz; rakip kaleye giren top için kale vuruşu verilir.", "throwIn"],
  ["trg002", "medium", "sports", "Taç atışını kullanan oyuncu top başka birine değmeden yeniden topa vurursa ne verilir?", ["Endirekt serbest vuruş", "Penaltı", "Köşe vuruşu", "Hakem atışı"], "IFAB, taç atan oyuncunun ikinci dokunuşunu endirekt serbest vuruşla cezalandırır.", "throwIn"],
  ["trg003", "medium", "sports", "Doğrudan köşe vuruşundan rakip kaleye gol atılabilir mi?", ["Evet", "Hayır, daima ofsayttır", "Yalnız kaleci dokunursa", "Yalnız uzatmada"], "IFAB, köşe vuruşundan rakip kaleye doğrudan gol atılabileceğini belirtir.", "corner"],
  ["trg004", "medium", "sports", "Kale vuruşundan top doğrudan rakip kaleye girerse sonuç nedir?", ["Gol", "Kale vuruşu tekrarı", "Taç atışı", "Endirekt serbest vuruş"], "IFAB, kale vuruşundan rakip kaleye doğrudan gol atılabileceğini söyler.", "goalKick"],
  ["trg005", "easy", "sports", "Taç atışından topu doğrudan alan oyuncu için ofsayt kararı verilir mi?", ["Hayır", "Her zaman", "Yalnız kendi yarı sahasında", "Yalnız ceza sahasında"], "IFAB kuralı doğrudan taç atışından top alan oyuncuya ofsayt uygulanmadığını belirtir.", "offside"],
  ["trg006", "medium", "sports", "Köşe vuruşundan topu doğrudan alan oyuncu için hangi ofsayt kuralı geçerlidir?", ["Ofsayt verilmez", "Daima ofsayt verilir", "Yalnız kaleci karar verir", "Penaltı verilir"], "IFAB'a göre doğrudan köşe vuruşundan top alan oyuncu ofsaytla cezalandırılmaz.", "offside"],
  ["trg007", "hard", "sports", "IFAB'a göre futbol topunun çevresi kaç santimetre aralığında olmalıdır?", ["68-70", "60-62", "72-74", "80-82"], "IFAB oyun topunun çevresini 68 ile 70 santimetre arasında tanımlar.", "ball"],
  ["trg008", "hard", "sports", "Maç başlangıcında futbol topunun ağırlığı IFAB'a göre hangi aralıktadır?", ["410-450 gram", "300-340 gram", "500-550 gram", "600-650 gram"], "IFAB, maç başında topun 410 ile 450 gram arasında olmasını ister.", "ball"],
  ["trg009", "hard", "sports", "Taç atışı sırasında rakipler atışı yapan oyuncudan en az kaç metre uzak durmalıdır?", ["2", "1", "5", "9,15"], "IFAB taç atışını yapan oyuncuya rakiplerin en az iki metre uzaklıkta durmasını ister.", "throwIn"],
  ["trg010", "medium", "sports", "Kale vuruşundan topu doğrudan alan oyuncu için ofsayt kararı verilir mi?", ["Hayır", "Evet", "Yalnız uzatmada", "Yalnız kaleci kendi yarı sahasındaysa"], "IFAB, kale vuruşundan doğrudan top alan oyuncuyu ofsayttan muaf tutar.", "offside"],

  ["trg011", "easy", "technology", "WCAG'ye göre anlam taşıyan bir görselin erişilebilir karşılığı ne olmalıdır?", ["Metin alternatifi", "Yalnız renkli çerçeve", "Otomatik müzik", "Daha büyük dosya"], "WCAG 2.2, metin dışı içerik için eşdeğer amaçlı metin alternatifi ister.", "wcag"],
  ["trg012", "medium", "technology", "WCAG'nin klavye erişimi ilkesi hangi kullanıcıya özellikle yardımcı olur?", ["Fare kullanamayan kişiye", "Yalnız daha hızlı internete", "Yalnız baskı alan kişiye", "Yalnız yöneticiye"], "WCAG, işlevlerin klavye üzerinden kullanılabilmesini öngörür.", "wcag"],
  ["trg013", "medium", "technology", "Bir kullanıcı klavyeyle bir öğeye geçince o öğenin seçili olduğunun görünmesine ne denir?", ["Görünür odak", "Önbellek", "Piksel sıkıştırma", "Alan adı"], "WCAG 2.4.7, klavye odağı göstergesinin görünür olmasını ister.", "wcag"],
  ["trg014", "hard", "technology", "WCAG AA düzeyinde normal metin için asgari kontrast oranı kaçtır?", ["4,5:1", "2:1", "3:1", "10:1"], "WCAG 1.4.3 normal metin için en az 4,5:1 kontrast oranı belirtir.", "wcag"],
  ["trg015", "medium", "technology", "WCAG 1.4.4'e göre metin işlev kaybı olmadan yüzde kaça büyütülebilmelidir?", ["200", "110", "125", "500"], "WCAG metnin yardımcı teknoloji olmadan yüzde 200'e kadar büyütülebilmesini ister.", "wcag"],
  ["trg016", "medium", "technology", "Önceden kaydedilmiş konuşmalı bir videonun erişilebilirliği için WCAG ne ister?", ["Altyazı", "Otomatik oynatma", "Sürekli tekrar", "Sessize alma zorunluluğu"], "WCAG 1.2.2, önceden kaydedilmiş sesli video için altyazı gerektirir.", "wcag"],
  ["trg017", "medium", "technology", "Bir web sayfasının ana dilinin programatik olarak belirtilmesi hangi WCAG ölçütüdür?", ["Sayfanın dili", "Görsel kontrastı", "Bağlantı hızı", "Dosya türü"], "WCAG 3.1.1 sayfanın varsayılan insan dilinin belirlenebilir olmasını ister.", "wcag"],
  ["trg018", "hard", "technology", "WCAG'ye göre hatalı doldurulan form alanında hatanın nasıl gösterilmesi gerekir?", ["Metinle tanımlanarak", "Yalnız kırmızı renkle", "Sadece ses çalarak", "Gizli tutularak"], "WCAG 3.3.1, otomatik saptanan girdideki hatanın kullanıcıya metinle açıklanmasını ister.", "wcag"],
  ["trg019", "medium", "technology", "WCAG'deki klavye tuzağı yasağı neyi önler?", ["Odağın bir bileşenden klavyeyle çıkarılamamasını", "Farenin hızlı hareketini", "Klavye dilinin değişmesini", "Şifrenin yanlış yazılmasını"], "WCAG 2.1.2, klavye odağının bir bileşende hapsolmamasını ister.", "wcag"],
  ["trg020", "hard", "technology", "WCAG 2.2'de odak görünürlüğüyle ilgili yeni ölçütlerden biri hangisidir?", ["Odağın örtülmemesi", "DNS önbelleği", "Dosya sıkıştırması", "Şifreleme anahtarı"], "WCAG 2.2, Focus Not Obscured ölçütünü ekleyerek odaktaki öğenin örtülmemesini ele alır.", "wcag"],

  ["trg021", "medium", "cinema_television", "1950 Oscar töreninde En İyi Film ödülünü hangi yapım kazandı?", ["All the King's Men", "The Heiress", "Battleground", "A Letter to Three Wives"], "Akademi'nin 1950 töreninde En İyi Film All the King's Men seçildi.", "oscars1950"],
  ["trg022", "hard", "cinema_television", "All the King's Men ile 1950'de En İyi Erkek Oyuncu Oscar'ını kim aldı?", ["Broderick Crawford", "Gregory Peck", "Kirk Douglas", "John Wayne"], "Akademi'nin 1950 oyuncu ödülü Broderick Crawford'a verildi.", "oscars1950"],
  ["trg023", "hard", "cinema_television", "The Heiress filmiyle 1950'de En İyi Kadın Oyuncu kim seçildi?", ["Olivia de Havilland", "Deborah Kerr", "Jeanne Crain", "Loretta Young"], "Akademi kayıtlarında 1950 kadın oyuncu ödülünü Olivia de Havilland kazandı.", "oscars1950"],
  ["trg024", "expert", "cinema_television", "A Letter to Three Wives ile 1950 yönetmenlik Oscar'ını kim kazandı?", ["Joseph L. Mankiewicz", "Robert Rossen", "William Wyler", "Carol Reed"], "Akademi, 1950 yönetmenlik ödülünü Joseph L. Mankiewicz'e verdi.", "oscars1950"],
  ["trg025", "medium", "cinema_television", "1960 Oscar töreninin En İyi Film kazananı hangisiydi?", ["Ben-Hur", "Anatomy of a Murder", "The Nun's Story", "Room at the Top"], "Akademi'nin 1960 En İyi Film ödülü Ben-Hur'a gitti.", "oscars1960"],
  ["trg026", "hard", "cinema_television", "Ben-Hur ile 1960'ta En İyi Erkek Oyuncu ödülünü kim kazandı?", ["Charlton Heston", "James Stewart", "Laurence Harvey", "Jack Lemmon"], "Akademi arşivinde 1960 erkek oyuncu ödülünün sahibi Charlton Heston'dır.", "oscars1960"],
  ["trg027", "hard", "cinema_television", "Room at the Top ile 1960'ta En İyi Kadın Oyuncu kim seçildi?", ["Simone Signoret", "Elizabeth Taylor", "Audrey Hepburn", "Doris Day"], "Akademi 1960 kadın oyuncu ödülünü Simone Signoret'e verdi.", "oscars1960"],
  ["trg028", "hard", "cinema_television", "Ben-Hur ile 1960 yönetmenlik Oscar'ını kim aldı?", ["William Wyler", "Billy Wilder", "George Stevens", "Jack Clayton"], "Akademi'nin 1960 yönetmenlik kazananı William Wyler'dır.", "oscars1960"],
  ["trg029", "medium", "cinema_television", "1970 Oscar töreninde En İyi Film ödülünü hangi yapım kazandı?", ["Midnight Cowboy", "Z", "Hello, Dolly!", "Anne of the Thousand Days"], "Akademi'nin 1970 En İyi Film ödülü Midnight Cowboy'a verildi.", "oscars1970"],
  ["trg030", "hard", "cinema_television", "1970 Oscar'ında En İyi Kadın Oyuncu ödülünü kim kazandı?", ["Maggie Smith", "Jane Fonda", "Liza Minnelli", "Jean Simmons"], "Akademi 1970 kadın oyuncu ödülünü The Prime of Miss Jean Brodie için Maggie Smith'e verdi.", "oscars1970"],

  ["trg031", "easy", "geography", "Galápagos Adaları hangi okyanustadır?", ["Büyük Okyanus", "Atlas Okyanusu", "Hint Okyanusu", "Arktik Okyanusu"], "UNESCO, Galápagos takımadalarını Büyük Okyanus'ta konumlandırır.", "galapagos"],
  ["trg032", "medium", "geography", "Galápagos Adaları, Ekvador ana karasından yaklaşık kaç kilometre uzaktadır?", ["1.000", "50", "200", "5.000"], "UNESCO, adaların Ekvador kıyısından yaklaşık 1.000 kilometre uzakta olduğunu belirtir.", "galapagos"],
  ["trg033", "hard", "geography", "UNESCO'ya göre Galápagos takımadalarında kaç büyük ada vardır?", ["19", "4", "50", "127"], "UNESCO, takımadada 19 büyük ada ve çok sayıda küçük ada, adacık ve kaya bulunduğunu belirtir.", "galapagos"],
  ["trg034", "easy", "geography", "Serengeti Ulusal Parkı hangi Afrika ülkesindedir?", ["Tanzanya", "Mısır", "Fas", "Namibya"], "UNESCO'nun Serengeti Ulusal Parkı alanı Tanzanya'da yer alır.", "serengeti"],
  ["trg035", "medium", "geography", "Serengeti'nin geniş düzlüklerinde baskın doğal bitki örtüsü hangisidir?", ["Savan", "Tundra", "Tayga", "Muson ormanı"], "UNESCO, Serengeti'yi yaklaşık 1,5 milyon hektarlık savan alanı olarak tanımlar.", "serengeti"],
  ["trg036", "medium", "geography", "Serengeti'deki yıllık göç hangi iki ülkeye yayılan bir ekosistemdedir?", ["Tanzanya ve Kenya", "Mısır ve Libya", "Fas ve Cezayir", "Namibya ve Angola"], "UNESCO, büyük otçul göçünün Tanzanya ve Kenya'ya yayıldığını açıklar.", "serengeti"],
  ["trg037", "easy", "geography", "Iguazú Şelaleleri hangi iki ülkenin sınırındaki alandadır?", ["Arjantin ve Brezilya", "Şili ve Peru", "Uruguay ve Paraguay", "Kolombiya ve Venezuela"], "UNESCO, Iguazú şelale sistemini Arjantin-Brezilya sınırında konumlandırır.", "iguazu"],
  ["trg038", "hard", "geography", "UNESCO'ya göre Iguazú şelale sistemi yaklaşık kaç metre genişliğe yayılır?", ["2.700", "270", "700", "7.000"], "UNESCO, Iguazú şelale cephesinin yaklaşık 2.700 metreye yayıldığını belirtir.", "iguazu"],
  ["trg039", "medium", "geography", "Namib Kum Denizi hangi ülkenin sınırları içindedir?", ["Namibya", "Botsvana", "Angola", "Güney Afrika"], "UNESCO, Namib Kum Denizi'nin bütünüyle Namibya'da bulunduğunu belirtir.", "namib"],
  ["trg040", "hard", "geography", "Namib Kum Denizi'nin kıyı kumullarını etkileyen ayırt edici doğal olay nedir?", ["Sis", "Muson yağmuru", "Kar fırtınası", "Volkan külü"], "UNESCO, Namib'i sisin etkilediği geniş kumul alanlarına sahip kıyı çölü olarak tanımlar.", "namib"],

  ["trg041", "medium", "history", "UNESCO'ya göre Çin Seddi'nin eski tahkimatlarını birleştiren hükümdar kimdi?", ["Qin Shi Huang", "Kubila Han", "Sun Yat-sen", "Mao Zedong"], "UNESCO, MÖ yaklaşık 220'de Qin Shi Huang'ın mevcut savunma hatlarını birleştirdiğini belirtir.", "greatWall"],
  ["trg042", "medium", "history", "Çin Seddi'nin inşası hangi hanedana kadar devam etti?", ["Ming", "Osmanlı", "Gupta", "Ptolemaios"], "UNESCO, Çin Seddi'ndeki çalışmaların Ming hanedanına kadar sürdüğünü belirtir.", "greatWall"],
  ["trg043", "hard", "history", "UNESCO'ya göre Çin Seddi'nin doğudaki başlangıç noktası neresidir?", ["Shanhaiguan", "Jiayuguan", "Pekin", "Nankin"], "UNESCO, Çin Seddi'nin doğuda Hebei'deki Shanhaiguan'dan başladığını belirtir.", "greatWall"],
  ["trg044", "hard", "history", "UNESCO'ya göre Çin Seddi'nin batıdaki uç noktası neresidir?", ["Jiayuguan", "Shanhaiguan", "Şanghay", "Xi'an"], "UNESCO, savunma hattının batıda Gansu'daki Jiayuguan'a uzandığını açıklar.", "greatWall"],
  ["trg045", "medium", "history", "Katmandu Vadisi UNESCO miras alanı kaç anıt bölgesinden oluşur?", ["7", "3", "12", "20"], "UNESCO, Katmandu Vadisi mirasını yedi anıt bölgesi olarak tanımlar.", "kathmandu"],
  ["trg046", "hard", "history", "Katmandu Vadisi'ndeki en eski Budist stupası hangi anıt topluluğundadır?", ["Swayambhu", "Bauddhanath", "Pashupati", "Changu Narayan"], "UNESCO, vadinin en eski Budist stupasının Swayambhu topluluğunda olduğunu belirtir.", "kathmandu"],
  ["trg047", "hard", "history", "UNESCO'ya göre Nepal'in en büyük stupası hangi Katmandu anıt bölgesindedir?", ["Bauddhanath", "Swayambhu", "Pashupati", "Patan Durbar"], "UNESCO, Bauddhanath topluluğunda Nepal'in en büyük stupasının yer aldığını kaydeder.", "kathmandu"],
  ["trg048", "medium", "history", "Vatikan Şehir Devleti'nin sınırlarını tanımlayan Lateran Antlaşması hangi yılda yapıldı?", ["1929", "1870", "1945", "1965"], "UNESCO, bağımsız Vatikan Devleti'nin 11 Şubat 1929 tarihli Lateran Antlaşması'yla tanımlandığını belirtir.", "vatican"],
  ["trg049", "hard", "history", "UNESCO'ya göre Vatikan Şehir Devleti'nin yüzölçümü yaklaşık kaç hektardır?", ["44", "4", "440", "4.400"], "UNESCO, Vatikan'ın Roma merkezinde yaklaşık 44 hektarlık alanı kapsadığını belirtir.", "vatican"],
  ["trg050", "medium", "history", "UNESCO'ya göre Tac Mahal'in ana türbesi yaklaşık hangi yıllar arasında yapıldı?", ["1631-1648", "1453-1492", "1776-1800", "1914-1930"], "UNESCO, beyaz mermer Tac Mahal'in 1631 ile 1648 arasında inşa edildiğini kaydeder.", "taj"],
];

export const turkishFiftyOne: readonly Question[] = rows.map(([id, difficulty, category, question, options, explanation, source]) => ({
  id, difficulty, category, question,
  choices: [
    { id: `${id}-0`, text: options[0] },
    { id: `${id}-1`, text: options[1] },
    { id: `${id}-2`, text: options[2] },
    { id: `${id}-3`, text: options[3] },
  ],
  correctAnswer: `${id}-0`, explanation, sourceUrl: sources[source], reviewedAt: "2026-10-14",
}));
