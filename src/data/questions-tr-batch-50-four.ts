import type { Difficulty } from "../lib/config";
import type { GameCategory } from "../lib/categories";
import type { Question } from "../lib/types";

const sources = {
  olympics: "https://library.olympics.com/digitalCollection/DigitalCollectionAttachmentDownloadHandler.ashx?documentId=3703315&parentDocumentId=172552&skipCopyright=true&skipWatermark=true",
  mexico: "https://library.olympics.com/Default/basicfilesdownload.ashx?itemGuid=2ECE9BE9-EA5F-4F0F-97DF-84C75B6BC60A",
  beamon: "https://library.olympics.com/digitalCollection/DigitalCollectionAttachmentDownloadHandler.ashx?documentId=2953709&parentDocumentId=2953706&skipCopyright=true&skipWatermark=true",
  pompei: "https://whc.unesco.org/en/list/829",
  limes: "https://whc.unesco.org/en/list/430",
  venice: "https://whc.unesco.org/en/list/394",
  reef: "https://whc.unesco.org/en/list/154",
  sundarbans: "https://whc.unesco.org/en/list/798",
  oscars1980: "https://www.oscars.org/oscars/ceremonies/1980",
  oscars1990: "https://www.oscars.org/oscars/ceremonies/1990",
  llosa: "https://www.nobelprize.org/uploads/2018/06/bio-bibl-5.pdf",
  transtromer: "https://www.nobelprize.org/prizes/literature/2011/transtromer/facts/",
  moyan: "https://www.nobelprize.org/prizes/literature/2012/yan/facts/",
  munro: "https://www.nobelprize.org/prizes/literature/2013/munro/facts/",
} as const;

type Category = Exclude<GameCategory, "mixed">;
type Row = readonly [string, Difficulty, Category, string, readonly [string, string, string, string], string, keyof typeof sources];

const rows: readonly Row[] = [
  ["trj001", "easy", "sports", "1968 Yaz Olimpiyatları hangi kentte yapıldı?", ["Meksiko", "Tokyo", "Roma", "Helsinki"], "IOC arşivine göre 1968 Yaz Olimpiyatları Meksiko'da düzenlendi.", "mexico"],
  ["trj002", "medium", "sports", "1968 Meksiko Olimpiyatları hangi tarihler arasında yapıldı?", ["12-27 Ekim", "6-15 Nisan", "19 Temmuz-3 Ağustos", "25 Ocak-5 Şubat"], "IOC arşivi Meksiko oyunlarını 12-27 Ekim 1968'e tarihler.", "mexico"],
  ["trj003", "hard", "sports", "1968 Meksiko Olimpiyatları'nda kaç spor dalı vardı?", ["18", "9", "17", "26"], "IOC arşivinde Meksiko 1968 programı 18 spor dalından oluşur.", "mexico"],
  ["trj004", "hard", "sports", "1968 Meksiko Olimpiyatları'nda kaç yarışma etkinliği vardı?", ["172", "43", "95", "149"], "IOC arşivi Meksiko 1968 için 172 etkinlik kaydeder.", "mexico"],
  ["trj005", "medium", "sports", "1968 Meksiko Olimpiyatları'nın yüksek rakımı özellikle hangi sporcuları zorladı?", ["Dayanıklılık sporcularını", "Satranç oyuncularını", "Yüzücüleri", "Eskrimcileri"], "IOC, yaklaşık 2300 metrelik rakımdaki düşük oksijenin dayanıklılık sporcularını zorladığını açıklar.", "mexico"],
  ["trj006", "medium", "sports", "Bob Beamon 1968 Olimpiyatları'nda hangi atletizm dalında 8,90 metreye ulaştı?", ["Uzun atlama", "Üç adım atlama", "Yüksek atlama", "Sırıkla atlama"], "IOC arşivi Bob Beamon'ın Meksiko'daki 8,90 metrelik uzun atlamasını kaydeder.", "beamon"],
  ["trj007", "hard", "sports", "1968 Olimpiyatları açılışındaki olimpiyat ateşini hangi Meksikalı sporcu yaktı?", ["Norma Enriqueta Basilio", "Wilma Rudolph", "Věra Čáslavská", "Nadia Comăneci"], "IOC arşivi açılış ateşini Norma Enriqueta Basilio de Sotelo'nun yaktığını kaydeder.", "mexico"],
  ["trj008", "easy", "sports", "1952 Yaz Olimpiyatları hangi kentte yapıldı?", ["Helsinki", "Meksiko", "Paris", "Atina"], "IOC kayıtlarında 1952 oyunlarının ev sahibi Helsinki'dir.", "olympics"],
  ["trj009", "hard", "sports", "1952 Helsinki Olimpiyatları'nda kaç spor dalı vardı?", ["17", "6", "18", "19"], "IOC bilgi notu Helsinki 1952'de 17 spor dalı bulunduğunu belirtir.", "olympics"],
  ["trj010", "expert", "sports", "1952 Helsinki Olimpiyatları'nda stadyumdaki ilk meşaleyi yakan ünlü koşucu kimdi?", ["Paavo Nurmi", "Bob Beamon", "James Connolly", "Spyridon Louis"], "IOC, Paavo Nurmi'nin stadyumdaki ilk kazanı yaktığını, ardından Hannes Kolehmainen'in kuledeki kazanı yaktığını belirtir.", "olympics"],

  ["trj011", "easy", "history", "Pompeii kentini MS 79'da hangi yanardağın patlaması örttü?", ["Vezüv", "Etna", "Fuji", "Kilimanjaro"], "UNESCO, Pompeii ve Herculaneum'un MS 79'daki Vezüv patlamasıyla örtüldüğünü belirtir.", "pompei"],
  ["trj012", "medium", "history", "Pompeii ile aynı patlamada örtülen Roma kentlerinden biri hangisiydi?", ["Herculaneum", "Atina", "Kartaca", "Efes"], "UNESCO, Pompeii ile Herculaneum'un aynı Vezüv patlamasında örtüldüğünü kaydeder.", "pompei"],
  ["trj013", "medium", "history", "Pompeii ve Herculaneum arkeolojik alanıyla birlikte UNESCO adında hangi yer geçer?", ["Torre Annunziata", "Machu Picchu", "Petra", "Angkor"], "UNESCO miras alanı Pompeii, Herculaneum ve Torre Annunziata'yı birlikte içerir.", "pompei"],
  ["trj014", "hard", "history", "Pompeii buluntuları özellikle hangi uygarlığın günlük yaşamına ışık tutar?", ["Roma", "İnka", "Maya", "Osmanlı"], "UNESCO, bu arkeolojik alanların Roma kent yaşamının eşsiz bir kesitini koruduğunu belirtir.", "pompei"],
  ["trj015", "hard", "history", "Vezüv patlaması Pompeii ve Herculaneum'u hangi yüzyılda örttü?", ["MS 1. yüzyıl", "MÖ 5. yüzyıl", "MS 5. yüzyıl", "MS 15. yüzyıl"], "UNESCO'nun verdiği MS 79 tarihi birinci yüzyıla karşılık gelir.", "pompei"],
  ["trj016", "medium", "history", "Roma İmparatorluğu'nun sınır savunma hattı genel olarak hangi adla bilinir?", ["Limes", "Agora", "Akropolis", "Forum"], "UNESCO Roma sınır sistemini Roman Limes adıyla açıklar.", "limes"],
  ["trj017", "medium", "history", "Hadrian Duvarı hangi imparatorun emriyle inşa edildi?", ["Hadrian", "Augustus", "Neron", "Konstantin"], "UNESCO, duvarın MS 122'de İmparator Hadrian'ın emriyle yapıldığını belirtir.", "limes"],
  ["trj018", "hard", "history", "Hadrian Duvarı'nın yapımına hangi yılda başlandı?", ["MS 122", "MS 79", "MS 476", "MÖ 44"], "UNESCO Hadrian Duvarı'nın inşasını MS 122'ye tarihler.", "limes"],
  ["trj019", "hard", "history", "Hadrian Duvarı Roma'nın hangi eyaletinin kuzey sınırında yer alıyordu?", ["Britannia", "Gallia", "Africa", "Asia"], "UNESCO, Hadrian Duvarı'nı Roma'nın Britannia eyaletinin kuzey sınırındaki engel olarak tanımlar.", "limes"],
  ["trj020", "expert", "history", "UNESCO'ya göre Roma Limes'i en geniş döneminde yaklaşık kaç kilometreye ulaşıyordu?", ["5.000", "500", "50", "50.000"], "UNESCO, Roma İmparatorluğu'nun en geniş sınır hattını yaklaşık 5.000 km olarak verir.", "limes"],

  ["trj021", "medium", "geography", "UNESCO'ya göre Venedik kenti yaklaşık kaç küçük ada üzerine kurulmuştur?", ["118", "18", "28", "218"], "UNESCO, Venedik'in 118 küçük ada üzerinde kurulduğunu belirtir.", "venice"],
  ["trj022", "medium", "geography", "Venedik, İtalya'nın hangi bölgesinde bulunur?", ["Kuzeydoğu", "Güneybatı", "Orta-güney", "Kuzeybatı"], "UNESCO, Venedik ve lagününü İtalya'nın kuzeydoğusundaki Veneto bölgesinde konumlandırır.", "venice"],
  ["trj023", "hard", "geography", "Venedik'in suyla çevrili yerleşimini tanımlayan coğrafi oluşum nedir?", ["Lagün", "Fiyort", "Delta", "Kanyon"], "UNESCO alanın adını Venedik ve Lagünü olarak kaydeder.", "venice"],
  ["trj024", "easy", "geography", "Büyük Set Resifi hangi ülkenin kıyısındadır?", ["Avustralya", "Hindistan", "Brezilya", "Güney Afrika"], "UNESCO, Büyük Set Resifi'ni Avustralya'nın Queensland kıyılarıyla ilişkilendirir.", "reef"],
  ["trj025", "medium", "geography", "Büyük Set Resifi hangi Avustralya eyaletinin kıyısı boyunca uzanır?", ["Queensland", "Victoria", "Tazmanya", "Batı Avustralya"], "UNESCO, Büyük Set Resifi alanını Queensland kıyıları boyunca tanımlar.", "reef"],
  ["trj026", "hard", "geography", "UNESCO'ya göre Büyük Set Resifi yaklaşık kaç ayrı resiften oluşur?", ["2.500", "250", "25", "25.000"], "UNESCO, Büyük Set Resifi'nde yaklaşık 2.500 ayrı resif bulunduğunu belirtir.", "reef"],
  ["trj027", "easy", "geography", "Sundarbans hangi doğal bitki örtüsüyle ünlüdür?", ["Mangrov ormanı", "İğne yapraklı orman", "Tundra", "Bozkır"], "UNESCO, Sundarbans'ı büyük bir mangrov ormanı olarak tanımlar.", "sundarbans"],
  ["trj028", "medium", "geography", "Sundarbans ormanları hangi körfezin kıyısındadır?", ["Bengal Körfezi", "Meksika Körfezi", "Basra Körfezi", "Hudson Körfezi"], "UNESCO, Sundarbans'ın Bengal Körfezi kıyısında yer aldığını belirtir.", "sundarbans"],
  ["trj029", "hard", "geography", "Sundarbans deltasını oluşturan üç büyük akarsu hangileridir?", ["Ganj, Brahmaputra ve Meghna", "Nil, Kongo ve Nijer", "Amazon, Orinoco ve Paraná", "Tuna, Ren ve Elbe"], "UNESCO, Sundarbans'ı Ganj, Brahmaputra ve Meghna nehirlerinin deltasında konumlandırır.", "sundarbans"],
  ["trj030", "medium", "geography", "Sundarbans'ın simgesel büyük kedisi hangisidir?", ["Bengal kaplanı", "Aslan", "Leopar", "Çita"], "UNESCO, Sundarbans faunası içinde Bengal kaplanını özellikle belirtir.", "sundarbans"],

  ["trj031", "easy", "cinema_television", "1980 Oscar töreninin En İyi Film ödülü hangi yapıma verildi?", ["Kramer vs. Kramer", "Yıldız Savaşları", "Rocky", "Sürücü Bayan Daisy"], "Akademi'nin 1980 En İyi Film kazananı Kramer vs. Kramer'dır.", "oscars1980"],
  ["trj032", "medium", "cinema_television", "1980'de Kramer vs. Kramer ile En İyi Erkek Oyuncu kim seçildi?", ["Dustin Hoffman", "Al Pacino", "Jack Lemmon", "Peter Sellers"], "Akademi, 1980 erkek oyuncu ödülünü Dustin Hoffman'a verdi.", "oscars1980"],
  ["trj033", "medium", "cinema_television", "1980'de Norma Rae ile En İyi Kadın Oyuncu kim seçildi?", ["Sally Field", "Meryl Streep", "Bette Midler", "Jane Fonda"], "Akademi'nin 1980 kadın oyuncu kazananı Sally Field'dır.", "oscars1980"],
  ["trj034", "hard", "cinema_television", "1980'de Kramer vs. Kramer ile En İyi Yardımcı Kadın Oyuncu kim kazandı?", ["Meryl Streep", "Sally Field", "Jane Alexander", "Candice Bergen"], "Akademi, 1980 yardımcı kadın oyuncu ödülünü Meryl Streep'e verdi.", "oscars1980"],
  ["trj035", "hard", "cinema_television", "1980'de Kramer vs. Kramer ile yönetmenlik Oscar'ını kim aldı?", ["Robert Benton", "Francis Ford Coppola", "Bob Fosse", "Woody Allen"], "Akademi'nin 1980 yönetmenlik ödülü Robert Benton'a verildi.", "oscars1980"],
  ["trj036", "easy", "cinema_television", "1990 Oscar töreninde En İyi Film hangisiydi?", ["Sürücü Bayan Daisy", "Benim Sol Ayağım", "Ölü Ozanlar Derneği", "Zafer"], "Akademi'nin 1990 En İyi Film kazananı Driving Miss Daisy'dir.", "oscars1990"],
  ["trj037", "medium", "cinema_television", "1990'da My Left Foot ile En İyi Erkek Oyuncu kim seçildi?", ["Daniel Day-Lewis", "Morgan Freeman", "Tom Cruise", "Robin Williams"], "Akademi 1990 erkek oyuncu ödülünü Daniel Day-Lewis'e verdi.", "oscars1990"],
  ["trj038", "medium", "cinema_television", "1990'da Driving Miss Daisy ile En İyi Kadın Oyuncu ödülünü kim aldı?", ["Jessica Tandy", "Michelle Pfeiffer", "Jessica Lange", "Isabelle Adjani"], "Akademi'nin 1990 kadın oyuncu kazananı Jessica Tandy'dir.", "oscars1990"],
  ["trj039", "hard", "cinema_television", "1990'da Glory ile En İyi Yardımcı Erkek Oyuncu kim seçildi?", ["Denzel Washington", "Dan Aykroyd", "Marlon Brando", "Martin Landau"], "Akademi, 1990 yardımcı erkek oyuncu ödülünü Denzel Washington'a verdi.", "oscars1990"],
  ["trj040", "hard", "cinema_television", "1990'da Born on the Fourth of July ile yönetmenlik Oscar'ını kim kazandı?", ["Oliver Stone", "Bruce Beresford", "Woody Allen", "Kenneth Branagh"], "Akademi'nin 1990 yönetmenlik ödülü Oliver Stone'a verildi.", "oscars1990"],

  ["trj041", "easy", "language_literature", "2010 Nobel Edebiyat Ödülü'nü hangi Perulu yazar kazandı?", ["Mario Vargas Llosa", "Mo Yan", "Tomas Tranströmer", "Kazuo Ishiguro"], "Nobel biyografisi 2010 ödül sahibini Perulu yazar Mario Vargas Llosa olarak kaydeder.", "llosa"],
  ["trj042", "medium", "language_literature", "Mario Vargas Llosa Peru'nun hangi kentinde doğdu?", ["Arequipa", "Lima", "Cusco", "Trujillo"], "Nobel biyografisine göre Vargas Llosa Arequipa'da doğdu.", "llosa"],
  ["trj043", "easy", "language_literature", "2011 Nobel Edebiyat Ödülü hangi İsveçli şaire verildi?", ["Tomas Tranströmer", "Bob Dylan", "Mo Yan", "Alice Munro"], "Nobel kaydı 2011 ödül sahibini Tomas Tranströmer olarak belirtir.", "transtromer"],
  ["trj044", "medium", "language_literature", "Şair Tomas Tranströmer edebiyat dışında hangi meslekte çalıştı?", ["Psikolog", "Astronot", "Mimar", "Cerrah"], "Nobel biyografisi Tranströmer'in psikolog olarak da çalıştığını kaydeder.", "transtromer"],
  ["trj045", "easy", "language_literature", "2012 Nobel Edebiyat Ödülü'nü hangi Çinli yazar kazandı?", ["Mo Yan", "Mario Vargas Llosa", "Haruki Murakami", "Kazuo Ishiguro"], "Nobel'in 2012 Edebiyat Ödülü sahibi Mo Yan'dır.", "moyan"],
  ["trj046", "medium", "language_literature", "Mo Yan'ın sinemaya da uyarlanan romanı hangisidir?", ["Kızıl Darı", "Günden Kalanlar", "Körlük", "Beyaz Kale"], "Nobel biyografisi Red Sorghum romanını Mo Yan'ın uluslararası çıkışı olarak kaydeder.", "moyan"],
  ["trj047", "hard", "language_literature", "Mo Yan hangi Çin eyaletinde büyüdü?", ["Shandong", "Sichuan", "Yunnan", "Guangdong"], "Nobel biyografisi Mo Yan'ın Shandong eyaletindeki bir çiftçi ailesinde büyüdüğünü belirtir.", "moyan"],
  ["trj048", "easy", "language_literature", "2013 Nobel Edebiyat Ödülü'nü hangi Kanadalı yazar aldı?", ["Alice Munro", "Margaret Atwood", "Annie Ernaux", "Olga Tokarczuk"], "Nobel, 2013 Edebiyat Ödülü'nü Alice Munro'ya verdi.", "munro"],
  ["trj049", "medium", "language_literature", "Alice Munro özellikle hangi edebî türde ustalığıyla tanınır?", ["Kısa öykü", "Epik şiir", "Tiyatro oyunu", "Masal derlemesi"], "Nobel, Munro'yu çağdaş kısa öykünün ustası olarak tanımlar.", "munro"],
  ["trj050", "hard", "language_literature", "Alice Munro Kanada'nın hangi kasabasında doğdu?", ["Wingham", "Ottawa", "Vancouver", "Quebec"], "Nobel biyografisine göre Alice Munro Wingham, Ontario'da doğdu.", "munro"],
];

export const turkishFiftyFour: readonly Question[] = rows.map(([id, difficulty, category, question, options, explanation, source]) => ({
  id, difficulty, category, question,
  choices: [
    { id: `${id}-0`, text: options[0] },
    { id: `${id}-1`, text: options[1] },
    { id: `${id}-2`, text: options[2] },
    { id: `${id}-3`, text: options[3] },
  ],
  correctAnswer: `${id}-0`, explanation, sourceUrl: sources[source], reviewedAt: "2026-10-15",
}));
