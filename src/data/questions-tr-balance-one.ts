import type { Difficulty } from "../lib/config";
import type { GameCategory } from "../lib/categories";
import type { Question } from "../lib/types";

const sources = {
  jantar: "https://whc.unesco.org/en/list/1338/",
  kenya: "https://whc.unesco.org/en/list/800",
  socotra: "https://whc.unesco.org/en/list/1263",
  olympics: "https://library.olympics.com/digitalCollection/DigitalCollectionAttachmentDownloadHandler.ashx?documentId=3703315&parentDocumentId=172552&skipCopyright=true&skipWatermark=true",
  winter: "https://newsroom.olympics.com/record/1298",
  computing: "https://www.computerhistory.org/timeline/computers/",
  oscars: "https://www.oscars.org/oscars/ceremonies/2005",
  nobel2016: "https://www.nobelprize.org/prizes/literature/2016/summary/",
  nobel2017: "https://www.nobelprize.org/prizes/literature/2017/ceremony-speech/",
  nobel2018: "https://www.nobelprize.org/prizes/literature/2018/tokarczuk/biographical/",
  nobel2021: "https://www.nobelprize.org/uploads/2021/10/press-literatureprize2021.pdf",
  nobel2022: "https://www.nobelprize.org/prizes/literature/2022/summary/",
  nobel2023: "https://www.nobelprize.org/prizes/literature/2023/bio-bibliography/",
  unOrgans: "https://www.un.org/en/about-us/un-charter/chapter-3",
  unBodies: "https://www.un.org/en/about-us/main-bodies",
  unCouncil: "https://www.un.org/en/about-us/membership-of-principal-un-organs",
} as const;

type Category = Exclude<GameCategory, "mixed">;
type Row = readonly [string, Difficulty, Category, string, readonly [string, string, string, string], string, keyof typeof sources];

const rows: readonly Row[] = [
  ["trm001", "easy", "history", "Jantar Mantar tarihî gözlemevi hangi ülkededir?", ["Hindistan", "İran", "Mısır", "Çin"], "UNESCO, Jantar Mantar gözlemevini Hindistan'ın Jaipur kentinde kaydeder.", "jantar"],
  ["trm002", "medium", "history", "Jaipur'daki Jantar Mantar gözlemevi hangi yüzyılın ilk yarısında inşa edildi?", ["18. yüzyıl", "12. yüzyıl", "15. yüzyıl", "20. yüzyıl"], "UNESCO yapıyı 18. yüzyılın ilk yarısına tarihler.", "jantar"],
  ["trm003", "expert", "history", "Jantar Mantar gözlemevini hangi hükümdar yaptırdı?", ["Jai Singh II", "Ekber Şah", "Şah Cihan", "Aşoka"], "UNESCO gözlemevinin kurucusunu Jai Singh II olarak belirtir.", "jantar"],
  ["trm004", "hard", "history", "Jantar Mantar'ın yaklaşık kaç ana sabit gözlem aracı vardır?", ["20", "2", "100", "200"], "UNESCO yaklaşık 20 ana sabit araçtan söz eder.", "jantar"],
  ["trm005", "medium", "history", "Jantar Mantar'ın taş araçları esas olarak neyi gözlemlemek için tasarlandı?", ["Gök cisimlerinin konumlarını", "Okyanus akıntılarını", "Deprem dalgalarını", "Yeraltı sularını"], "UNESCO araçların astronomik konumları çıplak gözle gözlemlemek için yapıldığını açıklar.", "jantar"],
  ["trm006", "expert", "history", "Jantar Mantar gözlemevi UNESCO Dünya Mirası Listesi'ne hangi yıl alındı?", ["2010", "1972", "1990", "2020"], "UNESCO'nun listeye alınma tarihi 2010'dur.", "jantar"],
  ["trm007", "medium", "history", "Jantar Mantar hangi tarihî dönemin sonlarında gelişen astronomi geleneğini yansıtır?", ["Babür dönemi", "Roma dönemi", "Viking dönemi", "Aztek dönemi"], "UNESCO gözlemevini Babür döneminin sonundaki bilimsel kültürle ilişkilendirir.", "jantar"],

  ["trm008", "easy", "geography", "Kenya Dağı hangi kıtadadır?", ["Afrika", "Asya", "Avrupa", "Güney Amerika"], "UNESCO Kenya Dağı'nı Doğu Afrika'da konumlandırır.", "kenya"],
  ["trm009", "medium", "geography", "Kenya Dağı Afrika'nın kaçıncı en yüksek zirvesidir?", ["İkinci", "Birinci", "Üçüncü", "Beşinci"], "UNESCO Kenya Dağı'nı Afrika'nın ikinci en yüksek zirvesi olarak tanımlar.", "kenya"],
  ["trm010", "expert", "geography", "Kenya Dağı'nın en yüksek noktası yaklaşık kaç metredir?", ["5.199 metre", "3.199 metre", "7.199 metre", "9.199 metre"], "UNESCO en yüksek noktayı 5.199 metre olarak kaydeder.", "kenya"],
  ["trm011", "medium", "geography", "Kenya Dağı jeolojik olarak hangi yapının kalıntısıdır?", ["Sönmüş bir volkan", "Mercan adası", "Göktaşı krateri", "Kum tepesi"], "UNESCO Kenya Dağı'nın eski ve sönmüş bir volkan olduğunu belirtir.", "kenya"],
  ["trm012", "easy", "geography", "Sokotra Takımadaları hangi ülkeye bağlıdır?", ["Yemen", "Umman", "Somali", "Hindistan"], "UNESCO Sokotra'yı Yemen Dünya Mirası alanı olarak listeler.", "socotra"],
  ["trm013", "medium", "geography", "Sokotra Takımadaları hangi okyanusun kuzeybatısındadır?", ["Hint Okyanusu", "Atlas Okyanusu", "Pasifik Okyanusu", "Arktik Okyanusu"], "UNESCO adaları Hint Okyanusu'nun kuzeybatısında konumlandırır.", "socotra"],
  ["trm014", "expert", "geography", "UNESCO'ya göre Sokotra Takımadaları kaç ada ve kaç kayalık adacıktan oluşur?", ["Dört ada, iki kayalık adacık", "İki ada, dört kayalık adacık", "Altı ada, hiç adacık yok", "Bir ada, bir adacık"], "UNESCO dört ada ve iki kayalık adacıktan oluştuğunu yazar.", "socotra"],

  ["trm015", "easy", "sports", "İlk modern Olimpiyat Oyunları 1896'da hangi kentte yapıldı?", ["Atina", "Paris", "Roma", "Londra"], "IOC arşivi ilk modern Oyunları 1896 Atina olarak listeler.", "olympics"],
  ["trm016", "medium", "sports", "1896 Atina Oyunları'nda maratonu hangi sporcu kazandı?", ["Spyridon Louis", "James Connolly", "Paavo Nurmi", "Jesse Owens"], "IOC, 1896 maraton kazananını Spyridon Louis olarak kaydeder.", "olympics"],
  ["trm017", "expert", "sports", "Modern Olimpiyatların ilk şampiyonu James Connolly hangi dalda kazandı?", ["Üç adım atlama", "Maraton", "Disk atma", "Yüzme"], "IOC, Connolly'nin 1896'da üç adım atlamayı kazandığını belirtir.", "olympics"],
  ["trm018", "medium", "sports", "1900 Paris Olimpiyatları hangi büyük etkinlik kapsamında düzenlendi?", ["Dünya Fuarı", "Dünya Kupası", "Avrupa Şampiyonası", "Kış Oyunları"], "IOC arşivi 1900 Oyunlarının Paris'teki uluslararası fuar çerçevesinde yapıldığını belirtir.", "olympics"],
  ["trm019", "hard", "sports", "IOC verilerine göre kadın sporcular ilk kez hangi modern Olimpiyatlarda yer aldı?", ["1900 Paris", "1896 Atina", "1924 Paris", "1948 Londra"], "IOC, 1900 Paris için kadın katılımcıları kaydeder; 1896'da yalnız erkekler yarışmıştı.", "olympics"],
  ["trm020", "medium", "sports", "İlk Kış Olimpiyatları sonradan hangi Fransız kentindeki 1924 etkinliği olarak kabul edildi?", ["Chamonix", "Grenoble", "Lyon", "Nice"], "IOC, 1924 Chamonix etkinliğinin sonradan ilk Kış Olimpiyatı sayıldığını açıklar.", "winter"],
  ["trm021", "expert", "sports", "1896 Atina Oyunlarında IOC kayıtlarına göre kaç spor dalı vardı?", ["9", "4", "19", "29"], "IOC arşivi 1896 Oyunlarında dokuz spor dalı listeler.", "olympics"],

  ["trm022", "hard", "technology", "Manchester Baby'nin ilk programı hangi yıl çalıştı?", ["1948", "1938", "1958", "1968"], "Computer History Museum, ilk programın 21 Haziran 1948'de çalıştığını kaydeder.", "computing"],
  ["trm023", "expert", "technology", "Manchester Baby'nin ilk çalışan programını kim yazdı?", ["Tom Kilburn", "Maurice Wilkes", "John Mauchly", "Seymour Cray"], "Computer History Museum ilk programı Tom Kilburn'ün yazdığını belirtir.", "computing"],
  ["trm024", "medium", "technology", "EDSAC bilgisayarı hangi üniversitede yapıldı?", ["Cambridge", "Oxford", "Stanford", "MIT"], "Computer History Museum, EDSAC'ın Cambridge Üniversitesinde yapıldığını kaydeder.", "computing"],
  ["trm025", "hard", "technology", "EDSAC projesine hangi bilgisayar öncüsü liderlik etti?", ["Maurice Wilkes", "Alan Kay", "Steve Wozniak", "Gordon Moore"], "Computer History Museum projeyi Maurice Wilkes'ın yönettiğini belirtir.", "computing"],
  ["trm026", "medium", "technology", "PDP-8 bilgisayarını hangi şirket geliştirdi?", ["Digital Equipment Corporation", "Apple", "Atari", "Microsoft"], "Computer History Museum PDP-8'i DEC ürünü olarak tanımlar.", "computing"],
  ["trm027", "expert", "technology", "Cray-1'in C biçimli tasarımı neyi kısaltarak hız kazandırdı?", ["Sinyal tellerinin uzunluğunu", "Klavyedeki tuş sayısını", "Disk çapını", "Ekran kablosunu"], "Computer History Museum C biçiminin telleri ve sinyal yolculuğunu kısalttığını açıklar.", "computing"],
  ["trm028", "medium", "technology", "1975'te Popular Electronics kapağında yer alan bilgisayar kiti hangisiydi?", ["Altair 8800", "IBM 5150", "Macintosh", "Commodore 64"], "Computer History Museum 1975 kapağını Altair 8800 ile ilişkilendirir.", "computing"],
  ["trm029", "hard", "technology", "Altair 8800 için BASIC yorumlayıcısını hangi ikili geliştirdi?", ["Bill Gates ve Paul Allen", "Steve Jobs ve Steve Wozniak", "John Mauchly ve J. Presper Eckert", "Gordon Bell ve Edson de Castro"], "Computer History Museum Altair BASIC'i Gates ve Allen ile ilişkilendirir.", "computing"],

  ["trm030", "easy", "cinema_television", "2005 Oscar töreninde En İyi Film ödülünü hangi yapım kazandı?", ["Million Dollar Baby", "The Aviator", "Ray", "Sideways"], "Akademi'nin 2005 En İyi Film kazananı Million Dollar Baby'dir.", "oscars"],
  ["trm031", "medium", "cinema_television", "2005'te En İyi Erkek Oyuncu Oscar'ını Ray ile kim kazandı?", ["Jamie Foxx", "Leonardo DiCaprio", "Johnny Depp", "Clint Eastwood"], "Akademi, Ray performansıyla Jamie Foxx'u ödüllendirdi.", "oscars"],
  ["trm032", "medium", "cinema_television", "2005'te En İyi Kadın Oyuncu Oscar'ını kim kazandı?", ["Hilary Swank", "Kate Winslet", "Annette Bening", "Imelda Staunton"], "Akademi, Million Dollar Baby için Hilary Swank'e ödül verdi.", "oscars"],
  ["trm033", "hard", "cinema_television", "2005'te En İyi Animasyon Filmi Oscar'ını hangi yapım kazandı?", ["The Incredibles", "Shrek 2", "Shark Tale", "Finding Nemo"], "Akademi'nin 2005 animasyon filmi kazananı The Incredibles'dır.", "oscars"],
  ["trm034", "hard", "cinema_television", "2005'te The Aviator ile En İyi Yardımcı Kadın Oyuncu kim seçildi?", ["Cate Blanchett", "Natalie Portman", "Virginia Madsen", "Sophie Okonedo"], "Akademi ödülü The Aviator'daki rolüyle Cate Blanchett'e verdi.", "oscars"],
  ["trm035", "medium", "cinema_television", "2005'te Million Dollar Baby ile yönetmenlik Oscar'ını kim aldı?", ["Clint Eastwood", "Martin Scorsese", "Alexander Payne", "Mike Leigh"], "Akademi'nin 2005 yönetmenlik kazananı Clint Eastwood'dur.", "oscars"],
  ["trm036", "expert", "cinema_television", "2005'te En İyi Özgün Senaryo Oscar'ını hangi film kazandı?", ["Eternal Sunshine of the Spotless Mind", "The Aviator", "Hotel Rwanda", "Vera Drake"], "Akademi'nin 2005 özgün senaryo ödülü Eternal Sunshine of the Spotless Mind'a gitti.", "oscars"],

  ["trm037", "medium", "language_literature", "2016 Nobel Edebiyat Ödülü'nü hangi müzisyen ve söz yazarı kazandı?", ["Bob Dylan", "Leonard Cohen", "Paul Simon", "Bruce Springsteen"], "Nobel'in 2016 Edebiyat Ödülü Bob Dylan'a verildi.", "nobel2016"],
  ["trm038", "medium", "language_literature", "The Remains of the Day romanının yazarı kimdir?", ["Kazuo Ishiguro", "Haruki Murakami", "Ian McEwan", "Salman Rushdie"], "Nobel sunuş konuşması The Remains of the Day romanını Ishiguro'nun eseri olarak anar.", "nobel2017"],
  ["trm039", "hard", "language_literature", "Kazuo Ishiguro'nun eserlerinde sık görülen ilişki hangisidir?", ["Bugün ile geçmiş ve bellek", "Spor ile beslenme", "Astronomi ile jeoloji", "Mimari ile matematik"], "Nobel sunuş konuşması Ishiguro'nun kitaplarında geçmiş ve bellek ilişkisini vurgular.", "nobel2017"],
  ["trm040", "medium", "language_literature", "2018 Nobel Edebiyat Ödülü'nü hangi Polonyalı yazar kazandı?", ["Olga Tokarczuk", "Wisława Szymborska", "Annie Ernaux", "Svetlana Aleksiyeviç"], "Nobel biyografisi 2018 ödül sahibini Olga Tokarczuk olarak tanıtır.", "nobel2018"],
  ["trm041", "expert", "language_literature", "2021 Nobel Edebiyat Ödülü sahibi Abdulrazak Gurnah nerede doğdu?", ["Zanzibar", "Londra", "Kahire", "Nairobi"], "Nobel basın açıklaması Gurnah'ın Zanzibar'da doğduğunu belirtir.", "nobel2021"],
  ["trm042", "medium", "language_literature", "Annie Ernaux'nun eserlerinde hangi konu özellikle öne çıkar?", ["Kişisel ve toplumsal bellek", "Uzay madenciliği", "Antik denizcilik", "Spor istatistikleri"], "Nobel ödül gerekçesi Ernaux'nun kişisel belleği ve onun toplumsal sınırlarını incelediğini vurgular.", "nobel2022"],
  ["trm043", "expert", "language_literature", "Jon Fosse'nin eserlerinde kullandığı Norveççe yazı dili hangisidir?", ["Nynorsk", "Bokmål", "İzlandaca", "Danca"], "Nobel biyobibliyografisi Fosse'nin eserlerinin Nynorsk ile yazıldığını belirtir.", "nobel2023"],

  ["trm044", "easy", "general_knowledge", "BM'nin ülkelerin temsil edildiği ana müzakere organı hangisidir?", ["Genel Kurul", "Sekretarya", "Uluslararası Adalet Divanı", "Vesayet Konseyi"], "BM, Genel Kurulu ana müzakere ve temsil organı olarak tanımlar.", "unBodies"],
  ["trm045", "medium", "general_knowledge", "Birleşmiş Milletler'in kaç ana organı vardır?", ["Altı", "Dört", "Sekiz", "On"], "BM Şartı altı ana organ sayar.", "unOrgans"],
  ["trm046", "medium", "general_knowledge", "Aşağıdakilerden hangisi BM'nin ana organlarından biridir?", ["Uluslararası Adalet Divanı", "Dünya Bankası", "UNICEF", "Dünya Sağlık Örgütü"], "BM Şartı Uluslararası Adalet Divanını ana organlar arasında sayar.", "unOrgans"],
  ["trm047", "hard", "general_knowledge", "BM Güvenlik Konseyinde kaç daimi üye bulunur?", ["Beş", "Üç", "On", "On beş"], "BM, Güvenlik Konseyinin beş daimi üyesi olduğunu belirtir.", "unCouncil"],
  ["trm048", "hard", "general_knowledge", "BM Genel Kurulu Güvenlik Konseyine kaç geçici üye seçer?", ["On", "Beş", "Yirmi", "Yirmi beş"], "BM, Genel Kurulun on geçici üyeyi seçtiğini açıklar.", "unCouncil"],
  ["trm049", "medium", "general_knowledge", "BM'nin altı ana organından New York'ta bulunmayan tek organı hangisidir?", ["Uluslararası Adalet Divanı", "Genel Kurul", "Güvenlik Konseyi", "Sekretarya"], "BM, Uluslararası Adalet Divanını New York dışındaki tek ana organ olarak belirtir.", "unBodies"],
  ["trm050", "expert", "general_knowledge", "BM Şartı'nda ana organ olarak yer alan vesayetle ilgili kurum hangisidir?", ["Vesayet Konseyi", "Avrupa Konseyi", "Kalkınma Bankası", "Dünya Ticaret Örgütü"], "BM Şartı Vesayet Konseyini altı ana organdan biri olarak sayar.", "unOrgans"],
];

export const turkishBalanceOne: readonly Question[] = rows.map(([id, difficulty, category, question, options, explanation, source]) => ({
  id, difficulty, category, question,
  choices: [
    { id: `${id}-0`, text: options[0] },
    { id: `${id}-1`, text: options[1] },
    { id: `${id}-2`, text: options[2] },
    { id: `${id}-3`, text: options[3] },
  ],
  correctAnswer: `${id}-0`, explanation, sourceUrl: sources[source], reviewedAt: "2026-10-15",
}));
