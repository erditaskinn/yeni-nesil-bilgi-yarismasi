import type { Difficulty } from "../lib/config";
import type { GameCategory } from "../lib/categories";
import type { Question } from "../lib/types";

const sources = {
  okavango: "https://whc.unesco.org/en/list/1432",
  ghats: "https://whc.unesco.org/en/list/1342",
  glaciers: "https://whc.unesco.org/en/list/145",
  gluck: "https://www.nobelprize.org/prizes/literature/2020/summary/",
  modiano: "https://www.nobelprize.org/prizes/literature/2014/modiano/facts/",
  handke: "https://www.nobelprize.org/prizes/literature/2019/bio-bibliography/",
  klimt: "https://www.belvedere.at/en/permanent-collection",
  guernica: "https://guernica.museoreinasofia.es/en",
  timbuktu: "https://whc.unesco.org/en/list/119",
  fes: "https://whc.unesco.org/en/list/170",
  apple: "https://computerhistory.org/apple-timeline/",
  upc: "https://www.ibm.com/history/upc",
  ramac: "https://www.ibm.com/history/ramac",
  physics1901: "https://www.nobelprize.org/prizes/physics/1901/summary/",
  medicine1901: "https://www.nobelprize.org/prizes/medicine/1901/summary/",
  peace1901: "https://www.nobelprize.org/prizes/peace/1901/summary/",
  literature1901: "https://www.nobelprize.org/prizes/literature/1901/summary/",
  nobel: "https://www.nobelprize.org/alfred-nobel/",
} as const;

type Category = Exclude<GameCategory, "mixed">;
type Row = readonly [string, Difficulty, Category, string, readonly [string, string, string, string], string, keyof typeof sources];

const rows: readonly Row[] = [
  ["trl001", "easy", "geography", "Okavango Deltası hangi Afrika ülkesindedir?", ["Botsvana", "Mısır", "Kenya", "Fas"], "UNESCO, Okavango Deltası'nı Botsvana'nın kuzeybatısında konumlandırır.", "okavango"],
  ["trl002", "medium", "geography", "Okavango Deltası'nın diğer birçok deltadan temel farkı nedir?", ["Denize ulaşmaması", "Tamamen donması", "Tuzlu deniz suyu taşıması", "Volkan kraterinde bulunması"], "UNESCO, Okavango'yu denize çıkışı olmayan büyük bir iç delta olarak tanımlar.", "okavango"],
  ["trl003", "hard", "geography", "Okavango Deltası'nın suları hangi çöl havzasının kumlarına karışır?", ["Kalahari", "Sahra", "Gobi", "Atacama"], "UNESCO'ya göre Okavango suları Kalahari Havzası'nın kumlarına akar.", "okavango"],
  ["trl004", "easy", "geography", "Batı Gat Dağları hangi ülkededir?", ["Hindistan", "Nepal", "Pakistan", "İran"], "UNESCO Batı Gat Dağları'nı Hindistan'ın batı kıyısına paralel uzanan bir sıra olarak tanımlar.", "ghats"],
  ["trl005", "medium", "geography", "Batı Gat Dağları hangi iklimsel olayı etkiler?", ["Muson yağışlarını", "Kutup gecesini", "Çöl kum fırtınalarını", "Kuzey ışıklarını"], "UNESCO, Batı Gat ekosistemlerinin Hindistan muson düzenini etkilediğini belirtir.", "ghats"],
  ["trl006", "hard", "geography", "UNESCO'ya göre Batı Gat Dağları yaklaşık kaç kilometre boyunca uzanır?", ["1.600", "160", "16.000", "600"], "UNESCO, Batı Gat Dağları'nın yaklaşık 1.600 kilometrelik bir hat oluşturduğunu kaydeder.", "ghats"],
  ["trl007", "medium", "geography", "Los Glaciares Milli Parkı hangi ülkededir?", ["Arjantin", "Norveç", "Kanada", "Yeni Zelanda"], "UNESCO, Los Glaciares parkını Arjantin Patagonyası'nda konumlandırır.", "glaciers"],
  ["trl008", "hard", "geography", "Perito Moreno Buzulu hangi göle doğru uzanır?", ["Argentino Gölü", "Baykal Gölü", "Van Gölü", "Titicaca Gölü"], "UNESCO, Perito Moreno Buzulu'nun Argentino Gölü'ne ilerlediğini belirtir.", "glaciers"],

  ["trl009", "easy", "language_literature", "2020 Nobel Edebiyat Ödülü hangi Amerikalı şaire verildi?", ["Louise Glück", "Alice Munro", "Annie Ernaux", "Olga Tokarczuk"], "Nobel'in 2020 Edebiyat Ödülü sahibi şair Louise Glück'tür.", "gluck"],
  ["trl010", "medium", "language_literature", "Louise Glück özellikle hangi edebiyat türündeki eserleriyle tanınır?", ["Şiir", "Tiyatro", "Tarih romanı", "Bilimkurgu"], "Nobel açıklaması Glück'ün şiirsel sesini ödüllendirir.", "gluck"],
  ["trl011", "easy", "language_literature", "2014 Nobel Edebiyat Ödülü'nü hangi Fransız yazar kazandı?", ["Patrick Modiano", "Albert Camus", "Jean-Paul Sartre", "Michel Houellebecq"], "Nobel kaydı 2014 ödül sahibini Patrick Modiano olarak verir.", "modiano"],
  ["trl012", "medium", "language_literature", "Patrick Modiano'nun eserlerinde hangi şehir sık sık önemli rol oynar?", ["Paris", "Roma", "Tokyo", "İstanbul"], "Nobel biyografisi Paris'in Modiano'nun yapıtlarında merkezi yeri olduğunu belirtir.", "modiano"],
  ["trl013", "hard", "language_literature", "Patrick Modiano'nun yapıtlarında öne çıkan temalardan biri hangisidir?", ["Bellek ve kimlik", "Uzay seyahati", "Deniz biyolojisi", "Spor rekorları"], "Nobel biyografisi Modiano'nun eserlerinde bellek, unutma ve kimlik temalarını vurgular.", "modiano"],
  ["trl014", "easy", "language_literature", "2019 Nobel Edebiyat Ödülü hangi Avusturyalı yazara verildi?", ["Peter Handke", "Jon Fosse", "Mo Yan", "Bob Dylan"], "Nobel'in 2019 Edebiyat Ödülü sahibi Avusturyalı yazar Peter Handke'dir.", "handke"],
  ["trl015", "medium", "language_literature", "Peter Handke'nin 1966'da yayımlanan ilk romanı hangisidir?", ["Die Hornissen", "Septology", "The Vegetarian", "Dora Bruder"], "Nobel biyobibliyografisi Handke'nin ilk romanını Die Hornissen olarak kaydeder.", "handke"],
  ["trl016", "hard", "language_literature", "Peter Handke'nin izleyicilere doğrudan seslenmesiyle tanınan oyunu hangisidir?", ["Publikumsbeschimpfung", "Hamlet", "Godot'yu Beklerken", "Üç Kuruşluk Opera"], "Nobel, Handke'nin Offending the Audience adıyla bilinen Publikumsbeschimpfung oyununu anlatır.", "handke"],

  ["trl017", "easy", "arts_culture", "Öpücük tablosunu hangi Avusturyalı ressam yaptı?", ["Gustav Klimt", "Egon Schiele", "Edvard Munch", "Claude Monet"], "Belvedere koleksiyonunda Öpücük, Gustav Klimt'in eseri olarak kayıtlıdır.", "klimt"],
  ["trl018", "medium", "arts_culture", "Klimt'in Öpücük tablosu hangi müzede sergilenir?", ["Belvedere", "Louvre", "Prado", "Rijksmuseum"], "Belvedere, Öpücük tablosunu kalıcı koleksiyonunun başlıca eseri olarak sergiler.", "klimt"],
  ["trl019", "hard", "arts_culture", "Klimt'in Öpücük tablosu yaklaşık hangi yıllarda yapıldı?", ["1908-1909", "1608-1609", "1808-1809", "2008-2009"], "Belvedere tabloyu 1908'de başlayıp 1909'da tamamlanan bir eser olarak tarihler.", "klimt"],
  ["trl020", "easy", "arts_culture", "Guernica tablosunun ressamı kimdir?", ["Pablo Picasso", "Salvador Dalí", "Gustav Klimt", "Joan Miró"], "Reina Sofía Müzesi Guernica'yı Picasso'nun eseri olarak tanımlar.", "guernica"],
  ["trl021", "medium", "arts_culture", "Picasso'nun Guernica eseri ilk kez 1937'de hangi kentin sergisinde gösterildi?", ["Paris", "Madrid", "Londra", "New York"], "Müze, Guernica'nın 1937 Paris Sergisi'ndeki İspanyol pavyonunda ilk kez gösterildiğini belirtir.", "guernica"],
  ["trl022", "hard", "arts_culture", "Guernica tablosu 1992'den beri hangi müzededir?", ["Reina Sofía", "Prado", "Louvre", "Uffizi"], "Reina Sofía'nın proje kaydı eserin 1992'den beri müzede bulunduğunu belirtir.", "guernica"],

  ["trl023", "easy", "history", "Sankore Üniversitesi ile tanınan tarihî Afrika kenti hangisidir?", ["Timbuktu", "Fes", "Kahire", "Kartaca"], "UNESCO, Timbuktu'yu Sankore Üniversitesi'yle ilişkilendirir.", "timbuktu"],
  ["trl024", "medium", "history", "Timbuktu hangi yüzyıllarda önemli bir düşünce ve eğitim merkeziydi?", ["15. ve 16. yüzyıllar", "3. ve 4. yüzyıllar", "8. ve 9. yüzyıllar", "19. ve 20. yüzyıllar"], "UNESCO, Timbuktu'nun düşünsel doruğunu 15. ve 16. yüzyıllara yerleştirir.", "timbuktu"],
  ["trl025", "hard", "history", "Timbuktu'nun üç büyük camisinden biri hangisidir?", ["Sidi Yahia", "Süleymaniye", "Kurtuba", "Kubbetü's-Sahra"], "UNESCO, Djingareyber, Sankore ve Sidi Yahia'yı Timbuktu'nun üç büyük camisi olarak sayar.", "timbuktu"],
  ["trl026", "easy", "history", "Fes Medinası hangi ülkededir?", ["Fas", "Mısır", "Tunus", "Cezayir"], "UNESCO, Fes Medinası'nı Fas'ın tarihî kent merkezi olarak kaydeder.", "fes"],
  ["trl027", "medium", "history", "Fes kentinin kuruluşu hangi hanedanla ilişkilidir?", ["İdrisiler", "Osmanlılar", "Emeviler", "Memlükler"], "UNESCO, erken Fes yerleşimini İdrisi hanedanına bağlar.", "fes"],
  ["trl028", "hard", "history", "Fes hangi yüzyıllarda Meriniler döneminde doruğa ulaştı?", ["13. ve 14. yüzyıllar", "5. ve 6. yüzyıllar", "9. ve 10. yüzyıllar", "19. ve 20. yüzyıllar"], "UNESCO, Fes'in Meriniler dönemindeki zirvesini 13. ve 14. yüzyıllara tarihler.", "fes"],

  ["trl029", "easy", "technology", "Apple II bilgisayarı hangi yıl tanıtıldı?", ["1977", "1967", "1987", "1997"], "Computer History Museum, Apple II'nin 1977'de tanıtıldığını kaydeder.", "apple"],
  ["trl030", "medium", "technology", "Apple'ın grafik arayüz ve fare içeren 1983 modeli hangisiydi?", ["Lisa", "Apple II", "iMac", "Mac mini"], "Computer History Museum, Lisa'yı 1983'te grafik arayüz ve fareyle tanıtılan model olarak açıklar.", "apple"],
  ["trl031", "medium", "technology", "İlk Macintosh bilgisayarı hangi yıl tanıtıldı?", ["1984", "1974", "1994", "2004"], "Computer History Museum, Macintosh tanıtımını Ocak 1984'e tarihler.", "apple"],
  ["trl032", "hard", "technology", "Apple ekibinin 1979'da gördüğü grafik arayüz çalışmaları hangi araştırma merkezindeydi?", ["Xerox PARC", "CERN", "NASA Ames", "Bell Labs"], "Computer History Museum, Apple ekibinin Xerox PARC'taki Smalltalk arayüzünden etkilendiğini belirtir.", "apple"],
  ["trl033", "easy", "technology", "Mağazalarda ürünlerin taranmasını sağlayan UPC hangi teknolojidir?", ["Barkod", "Uydu sinyali", "Ses tanıma", "Manyetik pusula"], "IBM, UPC'yi makinelerce taranabilen bir ürün barkodu olarak tanımlar.", "upc"],
  ["trl034", "medium", "technology", "İlk UPC barkodu 1974'te hangi ürün üzerinde okutuldu?", ["Sakız paketi", "Gazete", "Süt kutusu", "Kitap"], "IBM tarihçesi ilk UPC taramasının Wrigley's Juicy Fruit sakızında yapıldığını belirtir.", "upc"],
  ["trl035", "medium", "technology", "IBM 305 RAMAC hangi depolama yeniliğiyle tanınır?", ["Rastgele erişimli disk sürücüsü", "CD-ROM", "USB bellek", "Bulut depolama"], "IBM, RAMAC'ı rastgele erişimli disk sürücüsü kullanan ilk bilgisayar olarak tanımlar.", "ramac"],
  ["trl036", "hard", "technology", "IBM 305 RAMAC hangi yılda tanıtıldı?", ["1956", "1936", "1976", "1996"], "IBM tarihçesi RAMAC'ın 1956'da tanıtıldığını belirtir.", "ramac"],

  ["trl037", "easy", "general_knowledge", "İlk Nobel ödülleri hangi yılda verildi?", ["1901", "1801", "1951", "2001"], "Nobel'in resmî arşivindeki ilk fizik ödülü 1901 tarihlidir.", "physics1901"],
  ["trl038", "medium", "general_knowledge", "İlk Nobel Fizik Ödülü'nü kim kazandı?", ["Wilhelm Röntgen", "Albert Einstein", "Marie Curie", "Niels Bohr"], "Nobel'in 1901 fizik ödülü Wilhelm Conrad Röntgen'e verildi.", "physics1901"],
  ["trl039", "medium", "general_knowledge", "1901'deki ilk Nobel Tıp Ödülü hangi bilim insanına verildi?", ["Emil von Behring", "Alexander Fleming", "Louis Pasteur", "Robert Koch"], "Nobel arşivi 1901 Tıp Ödülü sahibini Emil von Behring olarak kaydeder.", "medicine1901"],
  ["trl040", "hard", "general_knowledge", "İlk Nobel Barış Ödülü'nü hangi ikili paylaştı?", ["Henry Dunant ve Frédéric Passy", "Marie ve Pierre Curie", "Einstein ve Bohr", "Fleming ve Chain"], "Nobel arşivinde 1901 Barış Ödülü Henry Dunant ve Frédéric Passy arasında paylaşılır.", "peace1901"],
  ["trl041", "hard", "general_knowledge", "İlk Nobel Edebiyat Ödülü'nü kim aldı?", ["Sully Prudhomme", "Rabindranath Tagore", "Orhan Pamuk", "Bob Dylan"], "Nobel'in 1901 Edebiyat Ödülü Sully Prudhomme'a verildi.", "literature1901"],
  ["trl042", "easy", "general_knowledge", "Nobel ödüllerine adını veren Alfred Nobel hangi şehirde doğdu?", ["Stockholm", "Paris", "Oslo", "Cenevre"], "Nobel'in resmî biyografisine göre Alfred Nobel Stockholm'de doğdu.", "nobel"],
];

export const turkishFinalFortyTwo: readonly Question[] = rows.map(([id, difficulty, category, question, options, explanation, source]) => ({
  id, difficulty, category, question,
  choices: [
    { id: `${id}-0`, text: options[0] },
    { id: `${id}-1`, text: options[1] },
    { id: `${id}-2`, text: options[2] },
    { id: `${id}-3`, text: options[3] },
  ],
  correctAnswer: `${id}-0`, explanation, sourceUrl: sources[source], reviewedAt: "2026-10-15",
}));
