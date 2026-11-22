import type { GameCategory } from "../lib/categories";
import type { Difficulty } from "../lib/config";
import type { Question } from "../lib/types";

const sources = {
  plants: "https://www.ars.usda.gov/northeast-area/docs/biocontrol-4-kids/plants-are-important/",
  atmosphere: "https://science.nasa.gov/earth/facts/",
  body: "https://www.nhlbi.nih.gov/health/heart",
  honey: "https://www.fs.usda.gov/wildflowers/pollinators/animals/bees.shtml",
  temperature: "https://www.nist.gov/pml/owm/si-units-temperature",
  continents: "https://education.nationalgeographic.org/resource/continent/",
  sahara: "https://www.britannica.com/place/Sahara-desert-Africa",
  japan: "https://www.britannica.com/place/Japan",
  compass: "https://repository.library.noaa.gov/view/noaa/38235/noaa_38235_DS1.pdf",
  brazil: "https://www.britannica.com/place/Brazil",
  colosseum: "https://whc.unesco.org/en/list/91/",
  stonehenge: "https://whc.unesco.org/en/list/373/",
  petra: "https://whc.unesco.org/en/list/326/",
  acropolis: "https://whc.unesco.org/en/list/404/",
  greatWall: "https://whc.unesco.org/en/list/438/",
  met: "https://www.metmuseum.org/learn/educators/curriculum-resources",
  getty: "https://www.getty.edu/education/teachers/classroom_resources/",
  olympics: "https://www.olympics.com/ioc/olympic-rings",
  ifab: "https://www.theifab.com/laws/latest/the-players/",
  basketball: "https://www.fiba.basketball/en/rules",
  swimming: "https://www.worldaquatics.com/about",
  computer: "https://edu.gcfglobal.org/en/computerbasics/",
  usb: "https://www.usb.org/about",
  battery: "https://www.energy.gov/science/doe-explainsbatteries",
  film: "https://www.oscars.org/",
  animation: "https://www.oscars.org/oscars/ceremonies/2003",
  tdkAlphabet: "https://tdk.gov.tr/icerik/yazim-kurallari/ses-harf-ve-alfabe/",
  tdkPunctuation: "https://tdk.gov.tr/icerik/yazim-kurallari/noktalama-isaretleri-aciklamalar/",
  tdkDictionary: "https://sozluk.gov.tr/",
  unesco: "https://www.unesco.org/en/about-us",
  trFlag: "https://www.tccb.gov.tr/en/presidency/turkishflag/",
  trRepublic: "https://www.meb.gov.tr/bakan-tekinin-29-ekim-cumhuriyet-bayrami-mesaji/haber/42330/tr",
  goturkiye: "https://goturkiye.com/",
  anitkabir: "https://www.anitkabir.tsk.tr/",
  constitution: "https://www.anayasa.gov.tr/tr/mevzuat/anayasa/",
  istanbul: "https://dev.goturkiye.com/istanbul",
  nist: "https://www.nist.gov/pml/owm/metric-si/si-units",
  calendar: "https://www.timeanddate.com/calendar/",
  traffic: "https://mutcd.fhwa.dot.gov/",
  who: "https://www.who.int/tools/your-life-your-health/other-health-topics/health-and-the-environment/washing-hands",
} as const;

type Source = keyof typeof sources;
type Category = Exclude<GameCategory, "mixed">;
type Row = readonly [string, Category, string, readonly [string, string, string, string], string, Source];

const rows: readonly Row[] = [
  ["tfe001", "science_nature", "Bitkiler fotosentez sırasında enerji için en çok hangi kaynaktan yararlanır?", ["Güneş ışığı", "Ay ışığı", "Rüzgâr", "Ses"], "Bitkiler, fotosentezde güneş ışığının enerjisinden yararlanır.", "plants"],
  ["tfe002", "science_nature", "Kanı vücuda pompalayan organ hangisidir?", ["Kalp", "Mide", "Akciğer", "Böbrek"], "Kalp, kanı dolaşım sistemi boyunca pompalar.", "body"],
  ["tfe003", "science_nature", "Balı arılar hangi maddeden yapar?", ["Çiçeklerden topladıkları nektardan", "Kumdan", "Yapraklardan", "Yağmur suyundan"], "Bal arıları çiçeklerden nektar toplar ve bal üretir.", "honey"],
  ["tfe004", "science_nature", "Bir termometre temel olarak neyi ölçer?", ["Sıcaklığı", "Uzunluğu", "Ağırlığı", "Hızı"], "Termometre sıcaklığı ölçmek için kullanılır.", "temperature"],
  ["tfe005", "science_nature", "Dünya'yı çevreleyen gaz tabakasına ne ad verilir?", ["Atmosfer", "Manto", "Çekirdek", "Yörünge"], "Dünya'yı çevreleyen gaz tabakası atmosferdir.", "atmosphere"],

  ["tfe006", "geography", "Sahra Çölü hangi kıtadadır?", ["Afrika", "Avrupa", "Asya", "Güney Amerika"], "Sahra, Afrika kıtasının kuzeyinde uzanır.", "sahara"],
  ["tfe007", "geography", "Brezilya hangi kıtada yer alır?", ["Güney Amerika", "Afrika", "Avrupa", "Okyanusya"], "Brezilya, Güney Amerika'da bulunan bir ülkedir.", "brazil"],
  ["tfe008", "geography", "Japonya'nın başkenti hangi şehirdir?", ["Tokyo", "Seul", "Pekin", "Bangkok"], "Japonya'nın başkenti Tokyo'dur.", "japan"],
  ["tfe009", "geography", "Güneşin doğduğu yön hangisidir?", ["Doğu", "Batı", "Kuzey", "Güney"], "Güneş doğu yönünde doğar ve batı yönünde batar.", "compass"],
  ["tfe010", "geography", "Dünya'nın en büyük kıtası hangisidir?", ["Asya", "Avrupa", "Afrika", "Antarktika"], "Asya, yüzölçümü en büyük kıtadır.", "continents"],

  ["tfe011", "history", "Kolezyum hangi İtalya şehrindedir?", ["Roma", "Venedik", "Milano", "Napoli"], "Kolezyum, Roma'daki antik bir amfitiyatrodur.", "colosseum"],
  ["tfe012", "history", "Stonehenge hangi ülkededir?", ["İngiltere", "İspanya", "Yunanistan", "Mısır"], "Stonehenge, İngiltere'de bulunan tarih öncesi taş anıttır.", "stonehenge"],
  ["tfe013", "history", "Petra antik kenti hangi ülkededir?", ["Ürdün", "İtalya", "Hindistan", "Meksika"], "Petra, Ürdün'deki tarihi bir kaya oyma kentidir.", "petra"],
  ["tfe014", "history", "Akropolis adıyla tanınan antik alan hangi şehirdedir?", ["Atina", "Paris", "Berlin", "Londra"], "Atina Akropolisi, Yunanistan'ın başkenti Atina'dadır.", "acropolis"],
  ["tfe015", "history", "Çin Seddi hangi ülkede bulunur?", ["Çin", "Japonya", "Hindistan", "Moğolistan"], "Çin Seddi, Çin'deki tarihî savunma yapılarının genel adıdır.", "greatWall"],

  ["tfe016", "arts_culture", "Bir ressam tuvale boya sürmek için genellikle hangi aracı kullanır?", ["Fırça", "Çekiç", "Tarak", "Kaşık"], "Fırça, boya uygulamakta kullanılan temel resim araçlarındandır.", "getty"],
  ["tfe017", "arts_culture", "Bir müzik eserinin bestesini yapan kişiye ne denir?", ["Besteci", "Heykeltıraş", "Fotoğrafçı", "Oyuncu"], "Müzik eserini besteleyen kişiye besteci denir.", "met"],
  ["tfe018", "arts_culture", "Heykel yapan sanatçı hangi sanat dalıyla uğraşır?", ["Heykel", "Mimari", "Fotoğraf", "Dans"], "Heykeltıraş, üç boyutlu sanat eserleri üretir.", "getty"],
  ["tfe019", "arts_culture", "Müze koleksiyonlarında sergilenen tarihî nesnelere genel olarak ne denir?", ["Eser", "Reklam", "Bilet", "Taslak"], "Müzeler sanat ve tarih açısından değer taşıyan eserleri korur ve sergiler.", "met"],
  ["tfe020", "arts_culture", "Bir tiyatro oyununda sahnede rol yapan kişiye ne denir?", ["Oyuncu", "Hakem", "Mimar", "Bahçıvan"], "Tiyatro oyuncuları sahnede karakterleri canlandırır.", "getty"],

  ["tfe021", "sports", "Basketbolda sayı kazanmak için topu nereye atmaya çalışırsın?", ["Potaya", "Kaleye", "Fileye", "Kukaya"], "Basketbolda takımlar topu rakip potadan geçirerek sayı kazanmaya çalışır.", "basketball"],
  ["tfe022", "sports", "Futbolda kaleyi korumakla görevli oyuncunun adı nedir?", ["Kaleci", "Forvet", "Hakem", "Antrenör"], "Kaleci, takımının kalesini savunur.", "ifab"],
  ["tfe023", "sports", "Tenis oynarken topa vurmak için genellikle hangi araç kullanılır?", ["Raket", "Sopa", "Yarasa", "Disk"], "Tenis oyuncuları topa raketle vurur.", "olympics"],
  ["tfe024", "sports", "Yüzme yarışında sporcular hangi ortamda kulaç atar?", ["Havuzda", "Buz pistinde", "Kum sahasında", "Bisiklet yolunda"], "Yüzme yarışları genellikle yarış havuzlarında yapılır.", "swimming"],
  ["tfe025", "sports", "Olimpiyat simgesinde kaç iç içe geçmiş halka vardır?", ["Beş", "Üç", "Dört", "Altı"], "Olimpiyat simgesi beş iç içe geçmiş halkadan oluşur.", "olympics"],

  ["tfe026", "technology", "Bilgisayarda yazı yazmak için en çok hangi aygıt kullanılır?", ["Klavye", "Hoparlör", "Mikrofon", "Yazıcı"], "Klavye, bilgisayara yazı ve komut girmek için kullanılır.", "computer"],
  ["tfe027", "technology", "Bilgisayarın görüntü ve yazıları gösteren bölümü hangisidir?", ["Ekran", "Klavye", "Fare", "Kasa vidası"], "Ekran, bilgisayarın görsel çıktısını gösterir.", "computer"],
  ["tfe028", "technology", "Kağıda metin veya fotoğraf basmak için hangi aygıt kullanılır?", ["Yazıcı", "Tarayıcı", "Klavye", "Kulaklık"], "Yazıcı, dijital içeriğin kağıda aktarılmasını sağlar.", "computer"],
  ["tfe029", "technology", "USB bellek çoğunlukla ne amaçla kullanılır?", ["Dosya saklamak ve taşımak", "Ekranı temizlemek", "Ses yükseltmek", "Pil şarjını ölçmek"], "USB bellek, dosyaları depolayıp başka aygıtlara taşımaya yarar.", "usb"],
  ["tfe030", "technology", "Bir pilin temel görevi nedir?", ["Elektrik enerjisi sağlamak", "İnterneti hızlandırmak", "Görüntüyü büyütmek", "Kağıt basmak"], "Pil, bağlı olduğu aygıta elektrik enerjisi sağlar.", "battery"],

  ["tfe031", "cinema_television", "Bir film gösterilirken görüntüler sinema salonunda genellikle nereye yansıtılır?", ["Beyaz perdeye", "Sahne arkasına", "Tavana", "Bilet gişesine"], "Sinema filmleri salondaki büyük perde üzerinde gösterilir.", "film"],
  ["tfe032", "cinema_television", "Bir filmin çekim ve anlatımını yöneten kişiye ne denir?", ["Yönetmen", "Seyirci", "Biletçi", "Müzisyen"], "Yönetmen, filmin sanatsal ve anlatımsal kararlarını yönlendirir.", "film"],
  ["tfe033", "cinema_television", "Bir filmi izleyen kişiye ne denir?", ["Seyirci", "Yapımcı", "Kameraman", "Senarist"], "Filmi izleyen kişilere seyirci denir.", "film"],
  ["tfe034", "cinema_television", "Çizimlerin veya bilgisayarda oluşturulan görüntülerin hareket ediyormuş gibi gösterildiği film türü hangisidir?", ["Animasyon", "Belgesel", "Haber", "Canlı yayın"], "Animasyon, art arda gösterilen çizim veya görüntülerle hareket yanılsaması oluşturur.", "animation"],
  ["tfe035", "cinema_television", "Televizyonda bir dizinin bölümlerini genellikle nerede izlersin?", ["Ekranda", "Radyoda", "Gazetede", "Hoparlörün içinde"], "Televizyon programları ve diziler ekranda görüntülü olarak izlenir.", "film"],

  ["tfe036", "language_literature", "Bir kitabı yazan kişiye ne denir?", ["Yazar", "Okur", "Çizer", "Editör masası"], "Bir kitabı kaleme alan kişiye yazar denir.", "tdkDictionary"],
  ["tfe037", "language_literature", "Bir metindeki cümlelerin sonuna çoğunlukla hangi işaret konur?", ["Nokta", "Virgül", "Kesme işareti", "Tire"], "Tamamlanmış cümlelerin sonuna genellikle nokta konur.", "tdkPunctuation"],
  ["tfe038", "language_literature", "Bir soru cümlesinin sonuna hangi noktalama işareti konur?", ["Soru işareti", "Noktalı virgül", "İki nokta", "Kesme işareti"], "Soru anlamı taşıyan cümlelerin sonuna soru işareti konur.", "tdkPunctuation"],
  ["tfe039", "language_literature", "Bir şiirin dizelerini yazan kişiye ne denir?", ["Şair", "Ressam", "Oyuncu", "Besteci"], "Şiir yazan kişiye şair denir.", "tdkDictionary"],
  ["tfe040", "language_literature", "Türkçe metinlerde özel adların ilk harfi nasıl yazılır?", ["Büyük harfle", "Her zaman küçük harfle", "Rakamla", "Noktayla"], "Özel adlar büyük harfle başlar.", "tdkPunctuation"],

  ["tfe041", "turkiye", "Anıtkabir hangi devlet adamının anıt mezarıdır?", ["Mustafa Kemal Atatürk'ün", "Fatih Sultan Mehmet'in", "Kanuni Sultan Süleyman'ın", "Mimar Sinan'ın"], "Anıtkabir, Mustafa Kemal Atatürk'ün anıt mezarıdır.", "anitkabir"],
  ["tfe042", "turkiye", "Türkiye bayrağında ay ve yıldız hangi renktedir?", ["Beyaz", "Mavi", "Yeşil", "Sarı"], "Türk bayrağında beyaz ay ve yıldız kırmızı zemin üzerinde yer alır.", "trFlag"],
  ["tfe043", "turkiye", "Türkiye'de Cumhuriyet Bayramı hangi tarihte kutlanır?", ["29 Ekim", "23 Nisan", "19 Mayıs", "30 Ağustos"], "Cumhuriyet Bayramı her yıl 29 Ekim'de kutlanır.", "trRepublic"],
  ["tfe044", "turkiye", "İstanbul hangi iki kıta üzerinde yer alır?", ["Avrupa ve Asya", "Asya ve Afrika", "Avrupa ve Afrika", "Kuzey ve Güney Amerika"], "İstanbul'un toprakları Avrupa ve Asya kıtalarına yayılır.", "istanbul"],
  ["tfe045", "turkiye", "Türkiye'nin resmî dili hangisidir?", ["Türkçe", "İtalyanca", "Arapça", "Rusça"], "Türkiye'nin resmî dili Türkçedir.", "constitution"],

  ["tfe046", "general_knowledge", "Bir haftada kaç gün vardır?", ["Yedi", "Beş", "Altı", "Sekiz"], "Bir hafta yedi günden oluşur.", "calendar"],
  ["tfe047", "general_knowledge", "Bir saatte kaç dakika vardır?", ["Altmış", "Otuz", "Yüz", "Yirmi dört"], "Bir saat altmış dakikadır.", "nist"],
  ["tfe048", "general_knowledge", "Bir metrede kaç santimetre vardır?", ["Yüz", "On", "Elli", "Bin"], "Bir metre yüz santimetreye eşittir.", "nist"],
  ["tfe049", "general_knowledge", "Trafik ışığında kırmızı ışık sürücüye ne yapmasını söyler?", ["Durmasını", "Hızlanmasını", "Geri gitmesini", "Korna çalmasını"], "Kırmızı trafik ışığında araçlar durmalıdır.", "traffic"],
  ["tfe050", "general_knowledge", "Ellerimizi sabunla yıkamak en çok hangi amaçla yapılır?", ["Temizlenmek ve sağlığı korumak", "Daha hızlı koşmak", "Daha iyi duymak", "Boyumuzu uzatmak"], "Sabunla el yıkamak temizliği sağlar ve hastalıkların yayılmasını azaltmaya yardımcı olur.", "who"],
];

export const turkishEasyFoundations: readonly Question[] = rows.map(([id, category, question, options, explanation, source]) => ({
  id,
  difficulty: "easy" satisfies Difficulty,
  category,
  question,
  choices: options.map((text, index) => ({ id: `${id}-${index}`, text })) as unknown as Question["choices"],
  correctAnswer: `${id}-0`,
  explanation,
  sourceUrl: sources[source],
  reviewedAt: "2026-11-09",
}));
