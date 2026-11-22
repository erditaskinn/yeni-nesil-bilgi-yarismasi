import type { Difficulty } from "../lib/config";
import type { GameCategory } from "../lib/categories";
import type { Question } from "../lib/types";

const sources = {
  tennis: "https://www.itftennis.com/en/about-us/organisation/tennis-glossary/",
  ibmFloppy: "https://www.ibm.com/history/floppy-disk",
  ibmPc: "https://www.ibm.com/history/personal-computer",
  cern: "https://home.cern/science/computing/the-birth-of-the-web/short-history-web/",
  mohenjo: "https://whc.unesco.org/en/list/138",
  persepolis: "https://whc.unesco.org/en/list/114",
  chichen: "https://whc.unesco.org/en/list/483",
  oscars2000: "https://www.oscars.org/oscars/ceremonies/2000",
  oscars2010: "https://www.oscars.org/oscars/ceremonies/2010",
  un: "https://www.un.org/en/about-us/history-of-the-un",
  unMembers: "https://www.un.org/en/about-us/growth-in-un-membership",
  who: "https://www.who.int/about/history/",
  heritage: "https://whc.unesco.org/en/convention",
  unesco: "https://www.unesco.org/en/about-us/practical-info",
} as const;

type Category = Exclude<GameCategory, "mixed">;
type Row = readonly [string, Difficulty, Category, string, readonly [string, string, string, string], string, keyof typeof sources];

const rows: readonly Row[] = [
  ["trk001", "easy", "sports", "Teniste bir oyunun ilk puanı nasıl anons edilir?", ["15", "10", "20", "30"], "ITF puanlamasında ilk kazanılan sayı 15 olarak anons edilir.", "tennis"],
  ["trk002", "easy", "sports", "Teniste 'love' hangi puanı ifade eder?", ["Sıfır", "Bir", "İki", "Üç"], "ITF sözlüğüne göre love, teniste sıfır puandır.", "tennis"],
  ["trk003", "medium", "sports", "Teniste her iki oyuncu da üçer puan aldığında duruma ne denir?", ["Deuce", "Ace", "Set", "Lob"], "ITF sözlüğüne göre iki tarafın da 40 puana ulaştığı eşitliğin adı deuce'tur.", "tennis"],
  ["trk004", "medium", "sports", "Teniste deuce sonrasında kazanılan ilk puana ne denir?", ["Avantaj", "Set", "Maç", "Servis kırma"], "ITF, deuce sonrasında öne geçiren puanı avantaj olarak tanımlar.", "tennis"],
  ["trk005", "medium", "sports", "Teniste avantajlı oyuncu bir sonraki puanı kaybederse skor neye döner?", ["Deuce", "Oyun biter", "Set biter", "15-15"], "ITF puanlamasında avantajlı oyuncu puanı kaybedince skor yeniden deuce olur.", "tennis"],
  ["trk006", "hard", "sports", "Teniste normal bir oyunu kazanmak için asgari kaç puan ve kaç puan fark gerekir?", ["Dört puan ve iki fark", "Üç puan ve bir fark", "Beş puan ve üç fark", "İki puan ve iki fark"], "ITF bir oyunun en az dört puan ve iki puan farkla kazanıldığını açıklar.", "tennis"],
  ["trk007", "medium", "sports", "Teniste rakibin üzerinden aşacak biçimde yükseltilen vuruşun adı nedir?", ["Lob", "Slice", "Smash", "Vole"], "ITF sözlüğünde lob, rakibin başının üzerinden gönderilen vuruştur.", "tennis"],
  ["trk008", "hard", "sports", "Teniste top yere düştükten hemen sonra yapılan vuruşa ne denir?", ["Yarım vole", "Smash", "Lob", "Servis"], "ITF, half volley vuruşunu top seker sekmez yapılan vuruş olarak tanımlar.", "tennis"],
  ["trk009", "medium", "sports", "Teniste baş üstünden aşağı yönlü güçlü vuruş hangisidir?", ["Smash", "Slice", "Lob", "Yarım vole"], "ITF sözlüğüne göre smash, top baş yüksekliğinin üzerinden aşağıya vurulur.", "tennis"],
  ["trk010", "hard", "sports", "Teniste 'topspin' topa hangi dönüşü verir?", ["İleri dönüş", "Geri dönüş", "Hiç dönüş vermez", "Yalnız yana dönüş"], "ITF topspin'i topun ileri dönüşü ve daha yüksek sekmesiyle açıklar.", "tennis"],

  ["trk011", "easy", "technology", "IBM ilk disket sürücülerini hangi yıl satmaya başladı?", ["1971", "1950", "1984", "2001"], "IBM tarihçesine göre disket sürücülerinin satışı 1971'de başladı.", "ibmFloppy"],
  ["trk012", "medium", "technology", "IBM'nin ilk disketlerinin çapı kaç inçti?", ["8", "3,5", "5,25", "12"], "IBM ilk disketlerin 8 inçlik olduğunu belirtir.", "ibmFloppy"],
  ["trk013", "hard", "technology", "IBM'nin 1984'te PC için tanıttığı yüksek yoğunluklu disketin kapasitesi neydi?", ["1,2 MB", "1,44 KB", "64 MB", "1 GB"], "IBM, 1984'teki yüksek yoğunluklu PC disketini 1,2 MB kapasiteyle tanıttı.", "ibmFloppy"],
  ["trk014", "hard", "technology", "IBM'nin 1986'da tanıttığı 3,5 inçlik disketin kapasitesi neydi?", ["1,44 MB", "1,2 KB", "10 MB", "640 MB"], "IBM'nin 3,5 inçlik 1986 disketi 1,44 MB veri saklıyordu.", "ibmFloppy"],
  ["trk015", "medium", "technology", "IBM 5150 kişisel bilgisayarını hangi yıl tanıttı?", ["1981", "1971", "1991", "2001"], "IBM tarihçesi 5150 PC'nin Ağustos 1981'de tanıtıldığını belirtir.", "ibmPc"],
  ["trk016", "hard", "technology", "İlk IBM PC'nin model numarası neydi?", ["5150", "4004", "8086", "68000"], "IBM tarihçesinde özgün kişisel bilgisayar IBM 5150 olarak geçer.", "ibmPc"],
  ["trk017", "medium", "technology", "Tim Berners-Lee ile 1990 Web önerisini hazırlayan Belçikalı mühendis kimdi?", ["Robert Cailliau", "Alan Turing", "Vint Cerf", "Linus Torvalds"], "CERN, Web önerisinin Robert Cailliau ile birlikte hazırlandığını kaydeder.", "cern"],
  ["trk018", "medium", "technology", "İlk Web tarayıcısının sayfayı görüntülemek dışında dikkat çekici işlevi neydi?", ["Sayfayı düzenleyebilmesi", "Video kaydedebilmesi", "Dosya sıkıştırabilmesi", "Yazıcı onarabilmesi"], "CERN'e göre Berners-Lee'nin ilk tarayıcısı sayfaları doğrudan düzenleyebiliyordu.", "cern"],
  ["trk019", "hard", "technology", "Farklı bilgisayarlarda çalışabilen erken dönem basit Web tarayıcısına ne deniyordu?", ["Line-mode browser", "Mosaic 3D", "Opera Mini", "Lynx Mobile"], "CERN, NeXT dışındaki sistemler için line-mode tarayıcı geliştirildiğini anlatır.", "cern"],
  ["trk020", "hard", "technology", "İlk uluslararası World Wide Web konferansı 1994'te nerede yapıldı?", ["CERN", "NASA", "IBM", "UNESCO"], "CERN, ilk uluslararası Web konferansının Mayıs 1994'te kendi merkezinde düzenlendiğini belirtir.", "cern"],

  ["trk021", "easy", "history", "Mohenjo-daro hangi eski uygarlığın kentsel mirasıdır?", ["İndus uygarlığı", "Roma uygarlığı", "İnka uygarlığı", "Khmer uygarlığı"], "UNESCO Mohenjo-daro'yu İndus uygarlığının büyük kentlerinden biri olarak tanımlar.", "mohenjo"],
  ["trk022", "medium", "history", "Mohenjo-daro hangi günümüz ülkesinde yer alır?", ["Pakistan", "Hindistan", "İran", "Nepal"], "UNESCO, Mohenjo-daro kalıntılarını Pakistan'ın Sindh eyaletinde konumlandırır.", "mohenjo"],
  ["trk023", "hard", "history", "Mohenjo-daro'nun belirgin tarihsel özelliği hangisidir?", ["Planlı kent düzeni", "Roma su kemerleri", "Gotik katedraller", "İnka terasları"], "UNESCO, aşağı kentin düzenli planını erken şehir planlamasının kanıtı olarak anlatır.", "mohenjo"],
  ["trk024", "medium", "history", "Persepolis hangi eski imparatorluğun başkentlerindendi?", ["Ahameniş", "İnka", "Roma", "Aztek"], "UNESCO, Persepolis'i Ahameniş İmparatorluğu'nun kraliyet kenti olarak tanımlar.", "persepolis"],
  ["trk025", "medium", "history", "Persepolis'in büyük terasını başlatan hükümdar kimdi?", ["Büyük Darius", "Büyük İskender", "Augustus", "Kiros II"], "UNESCO, büyük terasın MÖ 518 dolayında Darius tarafından başlatıldığını belirtir.", "persepolis"],
  ["trk026", "hard", "history", "Persepolis hangi yüzyılda inşa edilmeye başlandı?", ["MÖ 6. yüzyıl", "MÖ 2. yüzyıl", "MS 6. yüzyıl", "MS 12. yüzyıl"], "UNESCO'nun verdiği yaklaşık MÖ 518 tarihi, MÖ 6. yüzyıldır.", "persepolis"],
  ["trk027", "easy", "history", "Chichen Itza hangi eski kültürlerle ilişkilidir?", ["Maya ve Toltek", "Roma ve Etrüsk", "İnka ve Aztek", "Hitit ve Frig"], "UNESCO, Chichen Itza'yı Maya ve Toltek geleneklerinin birleştiği alan olarak tanımlar.", "chichen"],
  ["trk028", "medium", "history", "Chichen Itza'daki El Castillo hangi tanrıya adanmış tapınak olarak da bilinir?", ["Kukulkan", "Zeus", "Ra", "Athena"], "UNESCO, El Castillo'yu Kukulkan Tapınağı olarak da anar.", "chichen"],
  ["trk029", "hard", "history", "Chichen Itza'daki dairesel gözlemevinin adı nedir?", ["El Caracol", "Parthenon", "Apadana", "Propylaia"], "UNESCO, dairesel gözlemevini El Caracol adıyla kaydeder.", "chichen"],
  ["trk030", "hard", "history", "Chichen Itza'da yerleşimi kolaylaştıran doğal su çukurlarına ne denir?", ["Senot", "Fiyort", "Vaha", "Kanal"], "UNESCO, yerleşimin yakınındaki cenote adlı doğal su boşluklarını açıklar.", "chichen"],

  ["trk031", "easy", "cinema_television", "2000 Oscar töreninin En İyi Film kazananı hangisiydi?", ["American Beauty", "The Matrix", "The Sixth Sense", "The Insider"], "Akademi'nin 2000 En İyi Film ödülü American Beauty'ye verildi.", "oscars2000"],
  ["trk032", "medium", "cinema_television", "2000'de American Beauty ile En İyi Erkek Oyuncu kim seçildi?", ["Kevin Spacey", "Russell Crowe", "Sean Penn", "Denzel Washington"], "Akademi, 2000 erkek oyuncu ödülünü Kevin Spacey'ye verdi.", "oscars2000"],
  ["trk033", "medium", "cinema_television", "2000'de Boys Don't Cry ile En İyi Kadın Oyuncu kim kazandı?", ["Hilary Swank", "Annette Bening", "Meryl Streep", "Julianne Moore"], "Akademi'nin 2000 kadın oyuncu kazananı Hilary Swank'tır.", "oscars2000"],
  ["trk034", "hard", "cinema_television", "2000'de American Beauty ile yönetmenlik Oscar'ını kim aldı?", ["Sam Mendes", "Spike Jonze", "Michael Mann", "M. Night Shyamalan"], "Akademi, yönetmenlik ödülünü Sam Mendes'e verdi.", "oscars2000"],
  ["trk035", "hard", "cinema_television", "2000'de Girl, Interrupted ile yardımcı kadın oyuncu Oscar'ını kim kazandı?", ["Angelina Jolie", "Toni Collette", "Catherine Keener", "Chloë Sevigny"], "Akademi, 2000 yardımcı kadın oyuncu ödülünü Angelina Jolie'ye verdi.", "oscars2000"],
  ["trk036", "easy", "cinema_television", "2010 Oscar töreninin En İyi Film kazananı hangisiydi?", ["The Hurt Locker", "Avatar", "District 9", "Up in the Air"], "Akademi, 2010 En İyi Film ödülünü The Hurt Locker'a verdi.", "oscars2010"],
  ["trk037", "medium", "cinema_television", "2010'da The Hurt Locker ile yönetmenlik Oscar'ını kim aldı?", ["Kathryn Bigelow", "James Cameron", "Quentin Tarantino", "Jason Reitman"], "Akademi'nin 2010 yönetmenlik kazananı Kathryn Bigelow'dur.", "oscars2010"],
  ["trk038", "medium", "cinema_television", "2010'da Crazy Heart ile En İyi Erkek Oyuncu kim kazandı?", ["Jeff Bridges", "George Clooney", "Colin Firth", "Morgan Freeman"], "Akademi, 2010 erkek oyuncu ödülünü Jeff Bridges'e verdi.", "oscars2010"],
  ["trk039", "medium", "cinema_television", "2010'da The Blind Side ile En İyi Kadın Oyuncu kim kazandı?", ["Sandra Bullock", "Helen Mirren", "Meryl Streep", "Carey Mulligan"], "Akademi, 2010 kadın oyuncu ödülünü Sandra Bullock'a verdi.", "oscars2010"],
  ["trk040", "hard", "cinema_television", "2010'da Inglourious Basterds ile yardımcı erkek oyuncu Oscar'ını kim kazandı?", ["Christoph Waltz", "Matt Damon", "Stanley Tucci", "Woody Harrelson"], "Akademi, 2010 yardımcı erkek oyuncu ödülünü Christoph Waltz'a verdi.", "oscars2010"],

  ["trk041", "easy", "general_knowledge", "Birleşmiş Milletler resmen hangi yılda kuruldu?", ["1945", "1919", "1960", "1972"], "BM tarihçesine göre kuruluş 1945'te gerçekleşti.", "un"],
  ["trk042", "medium", "general_knowledge", "Birleşmiş Milletler Günü hangi tarihtedir?", ["24 Ekim", "7 Nisan", "16 Kasım", "1 Ocak"], "BM Şartı'nın yürürlüğe girdiği 24 Ekim 1945, kuruluş günüdür.", "un"],
  ["trk043", "medium", "general_knowledge", "BM Şartı'nın hazırlandığı 1945 konferansı hangi kentte yapıldı?", ["San Francisco", "Paris", "Cenevre", "New York"], "BM tarihçesi 1945 uluslararası konferansını San Francisco'da konumlandırır.", "un"],
  ["trk044", "hard", "general_knowledge", "Birleşmiş Milletler'in kurucu üye sayısı kaçtı?", ["51", "50", "100", "193"], "BM üye tarihi 1945'teki ilk üye sayısını 51 olarak kaydeder.", "unMembers"],
  ["trk045", "easy", "general_knowledge", "Dünya Sağlık Örgütü'nün İngilizce kısaltması hangisidir?", ["WHO", "WTO", "UNDP", "IAEA"], "WHO, World Health Organization adının kısaltmasıdır.", "who"],
  ["trk046", "medium", "general_knowledge", "Dünya Sağlık Günü hangi tarihte kutlanır?", ["7 Nisan", "24 Ekim", "16 Kasım", "1 Haziran"], "WHO anayasasının yürürlüğe girdiği 7 Nisan Dünya Sağlık Günü'dür.", "who"],
  ["trk047", "hard", "general_knowledge", "Dünya Sağlık Örgütü'nün anayasası hangi yıl yürürlüğe girdi?", ["1948", "1945", "1958", "1972"], "WHO tarihçesi anayasanın 7 Nisan 1948'de yürürlüğe girdiğini kaydeder.", "who"],
  ["trk048", "medium", "general_knowledge", "UNESCO Dünya Mirası Sözleşmesi hangi yılda kabul edildi?", ["1972", "1945", "1985", "2000"], "UNESCO, kültürel ve doğal miras sözleşmesini 16 Kasım 1972'de kabul etti.", "heritage"],
  ["trk049", "medium", "general_knowledge", "UNESCO Dünya Mirası Sözleşmesi hangi iki miras türünü birlikte korumayı amaçlar?", ["Kültürel ve doğal", "Yalnız yazılı ve sözlü", "Yalnız bilimsel ve sportif", "Yalnız deniz ve uzay"], "UNESCO sözleşmesi kültürel ve doğal mirası birlikte ele alır.", "heritage"],
  ["trk050", "easy", "general_knowledge", "UNESCO'nun genel merkezi hangi şehirdedir?", ["Paris", "Cenevre", "Roma", "Londra"], "UNESCO, ana merkezinin Paris'te olduğunu belirtir.", "unesco"],
];

export const turkishFiftyFive: readonly Question[] = rows.map(([id, difficulty, category, question, options, explanation, source]) => ({
  id, difficulty, category, question,
  choices: [
    { id: `${id}-0`, text: options[0] },
    { id: `${id}-1`, text: options[1] },
    { id: `${id}-2`, text: options[2] },
    { id: `${id}-3`, text: options[3] },
  ],
  correctAnswer: `${id}-0`, explanation, sourceUrl: sources[source], reviewedAt: "2026-10-15",
}));
