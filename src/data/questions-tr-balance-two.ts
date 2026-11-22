import type { Difficulty } from "../lib/config";
import type { GameCategory } from "../lib/categories";
import type { Question } from "../lib/types";

const sources = {
  nanMadol: "https://whc.unesco.org/en/list/1503/",
  rapaNui: "https://whc.unesco.org/en/list/715",
  sargasso: "https://oceanservice.noaa.gov/facts/sargassosea.html",
  oceanDepth: "https://oceanexplorer.noaa.gov/ocean-fact/ocean-depth/",
  sea: "https://oceanservice.noaa.gov/facts/oceanorsea.html",
  fjords: "https://whc.unesco.org/en/list/1195/",
  javelin: "https://worldathletics.org/disciplines/throwing-event/javelin-throw",
  hammer: "https://worldathletics.org/disciplines/throwing-event/hammer-throw",
  discus: "https://worldathletics.org/disciplines/throws/discus-throw",
  fortran: "https://www.ibm.com/history/fortran",
  network: "https://www.computerhistory.org/timeline/networking-the-web/",
  oscars2015: "https://www.oscars.org/oscars/ceremonies/2015",
  munro: "https://www.nobelprize.org/prizes/literature/2013/munro/facts/",
  moYan: "https://www.nobelprize.org/prizes/literature/2012/yan/facts/",
  coetzee: "https://www.nobelprize.org/prizes/literature/2003/coetzee/biographical/",
  muller: "https://www.nobelprize.org/prizes/literature/2009/bio-bibliography/",
  morrison: "https://www.nobelprize.org/prizes/literature/1993/press-release/",
  worldBank: "https://www.worldbank.org/en/archive/history",
  brettonWoods: "https://www.worldbank.org/en/archive/history/exhibits/Bretton-Woods-and-the-Birth-of-the-World-Bank",
  bankImf: "https://www.worldbank.org/en/about/history/the-world-bank-group-and-the-imf",
  smallpox: "https://www.who.int/news-room/spotlight/history-of-vaccination/history-of-smallpox-vaccination",
  smallpoxStatus: "https://www.who.int/emergencies/situations/smallpox",
} as const;

type Category = Exclude<GameCategory, "mixed">;
type Row = readonly [string, Difficulty, Category, string, readonly [string, string, string, string], string, keyof typeof sources];

const rows: readonly Row[] = [
  ["trn001", "easy", "history", "Nan Madol antik yerleşimi hangi okyanus bölgesindedir?", ["Pasifik Okyanusu", "Atlas Okyanusu", "Akdeniz", "Hint Okyanusu"], "UNESCO, Nan Madol'u Pasifik adaları kültürünün bir mirası olarak tanımlar.", "nanMadol"],
  ["trn002", "medium", "history", "Nan Madol hangi adanın açıklarında kurulmuştur?", ["Pohnpei", "Bali", "Kıbrıs", "Madagaskar"], "UNESCO yapıları Pohnpei Adası kıyısındaki adacıklarda konumlandırır.", "nanMadol"],
  ["trn003", "expert", "history", "Nan Madol hangi hanedanın törensel merkeziydi?", ["Saudeleur", "Ming", "İnka", "Ptolemaios"], "UNESCO Nan Madol'u Saudeleur hanedanının tören merkezi olarak kaydeder.", "nanMadol"],
  ["trn004", "hard", "history", "Nan Madol'un anıtsal duvarlarında hangi taş kullanıldı?", ["Bazalt", "Mermer", "Kireçtaşı", "Granit"], "UNESCO, yapıların sütun biçimli büyük bazalt taşlarla kurulduğunu açıklar.", "nanMadol"],
  ["trn005", "medium", "history", "Rapa Nui kültürünün büyük taş heykellerine ne ad verilir?", ["Moai", "Stupa", "Obelisk", "Menhir"], "UNESCO, Rapa Nui'nin dev taş figürlerini moai olarak adlandırır.", "rapaNui"],
  ["trn006", "hard", "history", "UNESCO'ya göre Rapa Nui'nin moai heykelleri ağırlıkla hangi yüzyıllar arasında yapıldı?", ["10. ve 16. yüzyıllar arasında", "1. ve 3. yüzyıllar arasında", "17. ve 19. yüzyıllar arasında", "19. ve 20. yüzyıllar arasında"], "UNESCO bu anıtsal geleneği 10. ile 16. yüzyıllar arasına tarihler.", "rapaNui"],
  ["trn007", "expert", "history", "Rapa Nui Ulusal Parkı UNESCO Dünya Mirası Listesi'ne hangi yıl girdi?", ["1995", "1975", "2005", "2015"], "UNESCO Rapa Nui'nin listeye alınma yılını 1995 olarak verir.", "rapaNui"],

  ["trn008", "easy", "geography", "Sargasso Denizi hangi okyanusun içindedir?", ["Atlas Okyanusu", "Pasifik Okyanusu", "Hint Okyanusu", "Arktik Okyanusu"], "NOAA, Sargasso Denizi'nin Atlas Okyanusu içinde bulunduğunu belirtir.", "sargasso"],
  ["trn009", "medium", "geography", "Sargasso Denizi'ni diğer denizlerden ayıran özellik hangisidir?", ["Kara sınırı bulunmaması", "Tamamen buzla kaplı olması", "Okyanusa bağlı olmaması", "Tatlı su içermesi"], "NOAA, Sargasso'yu kara sınırı olmayan tek deniz olarak tanımlar.", "sargasso"],
  ["trn010", "hard", "geography", "UNESCO mirası Geirangerfjord hangi ülkededir?", ["Norveç", "İzlanda", "İsveç", "Kanada"], "UNESCO Geirangerfjord'u Norveç'in batısında konumlandırır.", "fjords"],
  ["trn011", "expert", "geography", "UNESCO'ya göre Geirangerfjord ile Nærøyfjord birbirinden yaklaşık kaç kilometre uzaktadır?", ["120", "12", "1.200", "2.500"], "UNESCO iki fiyordun yaklaşık 120 kilometre arayla bulunduğunu belirtir.", "fjords"],
  ["trn012", "medium", "geography", "UNESCO'nun Batı Norveç Fiyortları alanındaki ikinci fiyort Geirangerfjord ile birlikte hangisidir?", ["Nærøyfjord", "Sognefjord", "Hardangerfjord", "Oslofjord"], "UNESCO alan adında Geirangerfjord ile Nærøyfjord'u birlikte sayar.", "fjords"],
  ["trn013", "hard", "geography", "NOAA'ya göre denizler genellikle okyanuslara kıyasla nasıl alanlardır?", ["Daha küçük ve kısmen karayla çevrili", "Daha büyük ve tamamen tatlı su", "Daima buzla kaplı", "Yalnız yer altında bulunan"], "NOAA, denizleri genellikle okyanusların küçük ve karayla çevrili bölümleri olarak açıklar.", "sea"],
  ["trn014", "expert", "geography", "NOAA'nın Challenger Deep için verdiği derinlik yaklaşık kaç metredir?", ["10.935", "5.935", "15.935", "20.935"], "NOAA okyanusun en derin noktasını yaklaşık 10.935 metre olarak ölçer.", "oceanDepth"],

  ["trn015", "easy", "sports", "Cirit atmada fırlatılan araç neye benzer?", ["Metal uçlu uzun mızrağa", "Yuvarlak diske", "İçi hava dolu topa", "Tel bağlı çekice"], "World Athletics ciridi metal uçlu uzun mızrak benzeri araç olarak tanımlar.", "javelin"],
  ["trn016", "medium", "sports", "Erkekler cirit atma olimpiyat programına hangi yıl girdi?", ["1908", "1896", "1932", "1960"], "World Athletics erkekler ciridinin 1908'de olimpiyat programına alındığını belirtir.", "javelin"],
  ["trn017", "expert", "sports", "Kadınlar cirit atma olimpiyat programına hangi yıl girdi?", ["1932", "1900", "1952", "1988"], "World Athletics kadınlar ciridinin 1932'de olimpiyat programına alındığını kaydeder.", "javelin"],
  ["trn018", "medium", "sports", "Çekiç atmada metal top sporcu tarafından neyle çevrilir?", ["Çelik telle bağlı tutamaçla", "Tahta sopayla", "Lastik raketle", "Yaylı iplikle"], "World Athletics çekiç aracını çelik telle tutamaca bağlı metal top olarak tanımlar.", "hammer"],
  ["trn019", "expert", "sports", "Kadınlar çekiç atma olimpiyat programına ilk kez hangi yıl girdi?", ["2000", "1928", "1964", "2016"], "World Athletics, kadınlar çekiç atmanın 2000 Sidney Oyunlarında başladığını kaydeder.", "hammer"],
  ["trn020", "hard", "sports", "Erkekler olimpik disk atmada disk kaç kilogramdır?", ["2 kilogram", "1 kilogram", "4 kilogram", "7,26 kilogram"], "World Athletics erkekler disk ağırlığını 2 kilogram olarak verir.", "discus"],
  ["trn021", "expert", "sports", "Kadınlar disk atma olimpiyat programına hangi yıl eklendi?", ["1928", "1896", "1956", "2000"], "World Athletics, kadınlar disk atmanın olimpiyatlara 1928'de girdiğini belirtir.", "discus"],

  ["trn022", "easy", "technology", "Fortran hangi alandaki işleri kolaylaştırmak için geliştirildi?", ["Bilimsel ve matematiksel hesaplama", "Video düzenleme", "Uydu fotoğrafçılığı", "Sosyal medya paylaşımı"], "IBM, Fortran'ın bilim insanları ve mühendislerin hesaplamalarını kodlamasını kolaylaştırdığını anlatır.", "fortran"],
  ["trn023", "medium", "technology", "Fortran adının açılımı hangi kavramdan gelir?", ["Formula Translation", "Formal Transport", "Foreign Transfer", "Format Transformation"], "IBM, Fortran adının formula translation sözlerinden türediğini belirtir.", "fortran"],
  ["trn024", "hard", "technology", "Fortran'ın ilk ticari sürümü hangi yıl çıktı?", ["1957", "1947", "1967", "1977"], "IBM, Fortran'ın ticari çıkışını 1957 olarak tarihler.", "fortran"],
  ["trn025", "expert", "technology", "Fortran geliştirme ekibinin başlıca öncüsü kimdi?", ["John Backus", "Dennis Ritchie", "Tim Berners-Lee", "Alan Kay"], "IBM, John Backus'ı Fortran'ın başlıca yazarı olarak tanıtır.", "fortran"],
  ["trn026", "medium", "technology", "Ağ üzerinden e-postada @ işaretinin seçimi kime bağlanır?", ["Ray Tomlinson", "Steve Jobs", "John Backus", "James Gosling"], "Computer History Museum @ işaretinin ağ e-postasında Ray Tomlinson tarafından seçildiğini kaydeder.", "network"],
  ["trn027", "hard", "technology", "Erken dönem ağ e-postalarının önemli bir bölümü hangi araştırma ağında taşındı?", ["ARPANET", "Bluetooth", "Wi-Fi 6", "NFC"], "Computer History Museum, 1973'e gelindiğinde ARPANET trafiğinin büyük bölümünü e-postanın oluşturduğunu açıklar.", "network"],
  ["trn028", "expert", "technology", "İnternetin temel ağ protokol takımının yaygın kısaltması hangisidir?", ["TCP/IP", "HTML/CSS", "USB/HDMI", "PNG/JPEG"], "Computer History Museum, ARPA'nın internet protokollerini TCP/IP olarak anar.", "network"],

  ["trn029", "easy", "cinema_television", "2015 Oscar töreninde En İyi Film ödülünü hangi yapım aldı?", ["Birdman", "Boyhood", "Whiplash", "The Imitation Game"], "Akademi'nin 2015 En İyi Film ödülü Birdman'e verildi.", "oscars2015"],
  ["trn030", "medium", "cinema_television", "2015'te En İyi Erkek Oyuncu Oscar'ını kim kazandı?", ["Eddie Redmayne", "Michael Keaton", "Benedict Cumberbatch", "Bradley Cooper"], "Akademi, The Theory of Everything için Eddie Redmayne'i ödüllendirdi.", "oscars2015"],
  ["trn031", "medium", "cinema_television", "2015'te Still Alice ile En İyi Kadın Oyuncu kim seçildi?", ["Julianne Moore", "Reese Witherspoon", "Rosamund Pike", "Marion Cotillard"], "Akademi'nin 2015 kadın oyuncu ödülü Julianne Moore'a gitti.", "oscars2015"],
  ["trn032", "hard", "cinema_television", "2015'te En İyi Yardımcı Erkek Oyuncu Oscar'ını Whiplash ile kim kazandı?", ["J. K. Simmons", "Ethan Hawke", "Edward Norton", "Mark Ruffalo"], "Akademi, Whiplash performansıyla J. K. Simmons'ı ödüllendirdi.", "oscars2015"],
  ["trn033", "expert", "cinema_television", "2015'te En İyi Yardımcı Kadın Oyuncu Oscar'ını hangi filmle Patricia Arquette kazandı?", ["Boyhood", "Wild", "Into the Woods", "Birdman"], "Akademi, Patricia Arquette'i Boyhood filmiyle ödüllendirdi.", "oscars2015"],
  ["trn034", "hard", "cinema_television", "2015 Oscar töreninde En İyi Animasyon Filmi hangisiydi?", ["Big Hero 6", "The Boxtrolls", "Song of the Sea", "How to Train Your Dragon 2"], "Akademi'nin 2015 animasyon ödülü Big Hero 6'ya verildi.", "oscars2015"],
  ["trn035", "expert", "cinema_television", "2015'te En İyi Görüntü Yönetimi Oscar'ını Birdman ile kim aldı?", ["Emmanuel Lubezki", "Roger Deakins", "Robert Yeoman", "Dick Pope"], "Akademi, Birdman'in görüntü yönetimi için Emmanuel Lubezki'yi ödüllendirdi.", "oscars2015"],

  ["trn036", "easy", "language_literature", "Beloved romanının yazarı kimdir?", ["Toni Morrison", "Alice Munro", "Herta Müller", "Annie Ernaux"], "Nobel'in 1993 basın açıklaması Beloved romanını Toni Morrison'ın eseri olarak anar.", "morrison"],
  ["trn037", "medium", "language_literature", "Nobel yazarı Herta Müller hangi ülkede doğdu?", ["Romanya", "Almanya", "Avusturya", "İsviçre"], "Nobel biyobibliyografisi Müller'in Romanya'nın Banat bölgesinde doğduğunu belirtir.", "muller"],
  ["trn038", "expert", "language_literature", "Alice Munro'nun öykülerinde sık rastlanan ikili hangisidir?", ["Bellek ve gerçeklik", "Uzay ve zaman", "Spor ve beslenme", "Jeoloji ve kimya"], "Nobel, Munro'nun öykülerinde bellek ile gerçeklik ilişkisine dikkat çeker.", "munro"],
  ["trn039", "medium", "language_literature", "1993 Nobel Edebiyat Ödülü'nü hangi Amerikalı yazar kazandı?", ["Toni Morrison", "Alice Munro", "Herta Müller", "Louise Glück"], "Nobel 1993 Edebiyat Ödülü'nün sahibini Toni Morrison olarak kaydeder.", "morrison"],
  ["trn040", "hard", "language_literature", "Herta Müller'in 2009 tarihli, sürgünü ele alan romanı hangisidir?", ["Atemschaukel", "Beloved", "Red Sorghum", "The Remains of the Day"], "Nobel biyobibliyografisi Atemschaukel'i Müller'in sürgün temalı eseri olarak anar.", "muller"],
  ["trn041", "expert", "language_literature", "Mo Yan'ın anlatımı hangi edebî yaklaşımla ilişkilendirilir?", ["Büyülü gerçekçilik", "Natüralizm", "Klasisizm", "Fütürizm"], "Nobel, Mo Yan'ın anlatımında büyülü gerçekçilik izleri bulunduğunu belirtir.", "moYan"],
  ["trn042", "hard", "language_literature", "2003 Nobel Edebiyat Ödülü sahibi J. M. Coetzee hangi kentte doğdu?", ["Cape Town", "Johannesburg", "Londra", "Sydney"], "Nobel biyografisi Coetzee'nin Cape Town'da doğduğunu kaydeder.", "coetzee"],
  ["trn043", "expert", "language_literature", "J. M. Coetzee edebiyat çalışmalarından önce İngiltere'de hangi meslekte çalıştı?", ["Bilgisayar programcılığı", "Deniz kaptanlığı", "Cerrahlık", "Mimarlık"], "Nobel biyografisi Coetzee'nin İngiltere'de bilgisayar programcısı olarak çalıştığını belirtir.", "coetzee"],

  ["trn044", "easy", "general_knowledge", "Bretton Woods Konferansı'nın doğmasına katkı sağladığı iki kurum hangileridir?", ["Dünya Bankası ve IMF", "WHO ve UNESCO", "NATO ve UNICEF", "CERN ve ESA"], "Dünya Bankası arşivi, konferansta Dünya Bankası ve IMF'nin kuruluş temellerinin atıldığını açıklar.", "brettonWoods"],
  ["trn045", "medium", "general_knowledge", "Bretton Woods Konferansı hangi yıl yapıldı?", ["1944", "1919", "1960", "1972"], "Dünya Bankası arşivi konferansı Temmuz 1944'e tarihler.", "worldBank"],
  ["trn046", "medium", "general_knowledge", "Bretton Woods Konferansı'na kaç ülkenin temsilcileri katıldı?", ["44", "14", "84", "144"], "Dünya Bankası arşivi 44 ülkenin katılımını kaydeder.", "brettonWoods"],
  ["trn047", "hard", "general_knowledge", "Dünya Bankası Grubunun başlıca amacı hangisidir?", ["Yoksulluğu azaltıp kalkınmayı desteklemek", "Spor kurallarını belirlemek", "Küresel hava durumunu izlemek", "Sinema ödüllerini düzenlemek"], "Dünya Bankası, gelişmekte olan ülkelerde yoksulluğu azaltma ve refahı artırma misyonunu açıklar.", "bankImf"],
  ["trn048", "expert", "general_knowledge", "Bretton Woods'taki 1944 toplantısı hangi ABD eyaletinde yapıldı?", ["New Hampshire", "California", "Texas", "Florida"], "Dünya Bankası arşivi toplantıyı New Hampshire'daki Bretton Woods'ta konumlandırır.", "brettonWoods"],
  ["trn049", "hard", "general_knowledge", "WHO hangi hastalığın dünya çapında yok edildiğini 1980'de ilan etti?", ["Çiçek hastalığı", "Sıtma", "Verem", "Kızamık"], "WHO, çiçek hastalığının 1980'de eradike edildiğinin ilan edildiğini kaydeder.", "smallpoxStatus"],
  ["trn050", "expert", "general_knowledge", "WHO'nun küresel çiçek hastalığı eradikasyon programı hangi yıl başladı?", ["1959", "1929", "1979", "1999"], "WHO, çiçek hastalığını yok etme programını 1959'da başlattığını anlatır.", "smallpox"],
];

export const turkishBalanceTwo: readonly Question[] = rows.map(([id, difficulty, category, question, options, explanation, source]) => ({
  id, difficulty, category, question,
  choices: [
    { id: `${id}-0`, text: options[0] },
    { id: `${id}-1`, text: options[1] },
    { id: `${id}-2`, text: options[2] },
    { id: `${id}-3`, text: options[3] },
  ],
  correctAnswer: `${id}-0`, explanation, sourceUrl: sources[source], reviewedAt: "2026-10-15",
}));
