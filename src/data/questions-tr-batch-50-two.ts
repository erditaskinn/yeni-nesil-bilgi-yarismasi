import type { Difficulty } from "../lib/config";
import type { GameCategory } from "../lib/categories";
import type { Question } from "../lib/types";

const sources = {
  athens: "https://library.olympics.com/digitalCollection/DigitalCollectionAttachmentDownloadHandler.ashx?documentId=3703315&parentDocumentId=172552&skipCopyright=true&skipWatermark=true",
  paris: "https://library.olympics.com/Default/basicfilesdownload.ashx?itemGuid=2ECE9BE9-EA5F-4F0F-97DF-84C75B6BC60A",
  winter: "https://library.olympics.com/Default/basicfilesdownload.ashx?itemId=1002",
  yellowstone: "https://www.nps.gov/yell/learn/nature/geology.htm",
  yellowstoneUnesco: "https://whc.unesco.org/en/list/28",
  whales: "https://whc.unesco.org/en/list/1186",
  icefjord: "https://whc.unesco.org/en/list/1149",
  atlantic: "https://oceanservice.noaa.gov/facts/atlantic.html",
  angkor: "https://whc.unesco.org/en/list/668",
  petra: "https://whc.unesco.org/en/list/326",
  stonehenge: "https://whc.unesco.org/en/list/373",
  acropolis: "https://whc.unesco.org/en/list/404",
  nightwatch: "https://www.rijksmuseum.nl/en/stories/10-things/story/10-things-about-rembrandts-night-watch",
  vermeer: "https://www.nationalgallery.org.uk/paintings/johannes-vermeer-a-young-woman-standing-at-a-virginal",
  bosch: "https://www.museodelprado.es/en/the-collection/art-work/the-garden-of-earthly-delights-triptych/02388242-6d6a-4e9e-a992-e1311eab3609",
  ishiguro: "https://www.nobelprize.org/uploads/2018/06/bio-bibl-12.pdf",
  gurnah: "https://www.nobelprize.org/uploads/2021/10/biobibliography-literatureprize2021.pdf",
  dylan: "https://www.nobelprize.org/prizes/literature/2016/summary/",
  alexievich: "https://www.nobelprize.org/prizes/literature/2015/alexievich/lecture/",
} as const;

type Category = Exclude<GameCategory, "mixed">;
type Row = readonly [string, Difficulty, Category, string, readonly [string, string, string, string], string, keyof typeof sources];

const rows: readonly Row[] = [
  ["trh001", "medium", "sports", "1896 Atina Olimpiyatları'nda toplam kaç yarışma düzenlendi?", ["43", "16", "95", "120"], "IOC arşivine göre ilk modern olimpiyatların programında 43 yarışma vardı.", "athens"],
  ["trh002", "hard", "sports", "İlk modern olimpiyatlarda ilk şampiyon olan James Connolly hangi dalda kazandı?", ["Üç adım atlama", "Maraton", "Yüksek atlama", "Disk atma"], "James Connolly 1896 Atina'da üç adım atlamayı kazanarak ilk modern olimpiyat şampiyonu oldu.", "athens"],
  ["trh003", "medium", "sports", "1896 Atina olimpiyat maratonunu hangi atlet kazandı?", ["Spyridon Louis", "James Connolly", "Paavo Nurmi", "Jesse Owens"], "IOC arşivi 1896 maratonunun galibini Yunan atlet Spyridon Louis olarak kaydeder.", "athens"],
  ["trh004", "hard", "sports", "1896 Atina Olimpiyatları hangi tarihler arasında yapıldı?", ["6-15 Nisan", "1-10 Ocak", "14 Mayıs-28 Ekim", "25 Ocak-5 Şubat"], "IOC arşivine göre Atina oyunları 6-15 Nisan 1896 tarihlerinde düzenlendi.", "athens"],
  ["trh005", "easy", "sports", "1900 Yaz Olimpiyatları hangi kentte yapıldı?", ["Paris", "Roma", "Londra", "Berlin"], "IOC kayıtlarında 1900 Yaz Olimpiyatları'nın ev sahibi Paris'tir.", "paris"],
  ["trh006", "medium", "sports", "1900 Paris Olimpiyatları'nda kadın sporcular ilk kez katıldığında kaç kadın yarıştı?", ["22", "2", "50", "100"], "IOC arşivi 1900 Paris oyunlarında 22 kadın sporcunun yer aldığını kaydeder.", "paris"],
  ["trh007", "hard", "sports", "1900 Paris Olimpiyatları programında kaç spor dalı vardı?", ["19", "9", "6", "30"], "IOC arşivinde Paris 1900 programı 19 spor dalı olarak verilir.", "paris"],
  ["trh008", "hard", "sports", "1900 Paris Olimpiyatları'nda kaç yarışma etkinliği düzenlendi?", ["95", "43", "16", "150"], "IOC Paris 1900 bilgi notu 95 etkinlik kaydeder.", "paris"],
  ["trh009", "medium", "sports", "İlk Kış Olimpiyatları 1924'te hangi Fransız kentinde düzenlendi?", ["Chamonix", "Grenoble", "Albertville", "Lille"], "IOC arşivinde 1924 Kış Oyunları'nın yeri Chamonix olarak geçer.", "winter"],
  ["trh010", "expert", "sports", "1924 Chamonix Kış Oyunları'na IOC kaydına göre kaç sporcu katıldı?", ["258", "997", "241", "22"], "IOC bilgi notu Chamonix 1924'e 258 sporcunun katıldığını belirtir.", "winter"],

  ["trh011", "easy", "geography", "Yellowstone Milli Parkı ağırlıklı olarak ABD'nin hangi eyaletindedir?", ["Wyoming", "Florida", "Nevada", "Alaska"], "UNESCO'ya göre Yellowstone'un yüzde 96'sı Wyoming eyaletindedir.", "yellowstoneUnesco"],
  ["trh012", "medium", "geography", "Yellowstone'un termal kaynaklarında yaygın olan püskürtmeli oluşumun adı nedir?", ["Gayzer", "Fiyort", "Delta", "Mercan resifi"], "NPS, Yellowstone'da yüzlerce aktif gayzer bulunduğunu açıklar.", "yellowstone"],
  ["trh013", "hard", "geography", "Yellowstone'daki aktif gayzerler dünyadaki toplamın yaklaşık ne kadarını oluşturur?", ["Yarısından fazlasını", "Onda birini", "Tamamını", "Yüzde birini"], "NPS'ye göre dünyadaki aktif gayzerlerin yarısından fazlası Yellowstone'dadır.", "yellowstone"],
  ["trh014", "medium", "geography", "Balina fosilleriyle tanınan Wadi Al-Hitan hangi ülkededir?", ["Mısır", "Fas", "Ürdün", "Sudan"], "UNESCO, Wadi Al-Hitan alanını Mısır'ın Batı Çölü'nde konumlandırır.", "whales"],
  ["trh015", "hard", "geography", "Wadi Al-Hitan fosilleri hangi canlı grubunun evrimini gösterir?", ["Balinalar", "Kuşlar", "Atlar", "Kaplumbağalar"], "UNESCO bu alanın eski balinaların karadan denize geçişine ışık tuttuğunu belirtir.", "whales"],
  ["trh016", "medium", "geography", "Ilulissat Buz Fiyordu hangi adada yer alır?", ["Grönland", "İzlanda", "Büyük Britanya", "Madagaskar"], "UNESCO'ya göre Ilulissat Buz Fiyordu Grönland'ın batı kıyısındadır.", "icefjord"],
  ["trh017", "hard", "geography", "Ilulissat Buz Fiyordu hangi kutup dairesinin kuzeyindedir?", ["Kuzey Kutup Dairesi", "Güney Kutup Dairesi", "Ekvator", "Yengeç Dönencesi"], "UNESCO alanı Kuzey Kutup Dairesi'nin yaklaşık 250 km kuzeyinde tanımlar.", "icefjord"],
  ["trh018", "easy", "geography", "Dünyanın ikinci büyük okyanus havzası hangisidir?", ["Atlas Okyanusu", "Hint Okyanusu", "Arktik Okyanusu", "Güney Okyanusu"], "NOAA, Atlas Okyanusu'nu Pasifik'ten sonra ikinci büyük okyanus havzası olarak tanımlar.", "atlantic"],
  ["trh019", "hard", "geography", "NOAA'ya göre Atlas Okyanusu Dünya yüzeyinin yaklaşık yüzde kaçını kaplar?", ["20", "5", "50", "70"], "NOAA Atlas Okyanusu'nun Dünya yüzeyinin yaklaşık yüzde 20'sini kapladığını belirtir.", "atlantic"],
  ["trh020", "expert", "geography", "UNESCO'ya göre Yellowstone'un Wyoming dışında uzandığı iki eyalet hangileridir?", ["Montana ve Idaho", "Utah ve Nevada", "Colorado ve Arizona", "Washington ve Oregon"], "UNESCO, parkın yüzde 3'ünü Montana'da ve yüzde 1'ini Idaho'da kaydeder.", "yellowstoneUnesco"],

  ["trh021", "medium", "history", "Angkor'daki Khmer başkentlerinin kalıntıları yaklaşık hangi yüzyıllara aittir?", ["9-15. yüzyıllar", "1-3. yüzyıllar", "16-20. yüzyıllar", "MÖ 5-1. yüzyıllar"], "UNESCO Angkor'daki Khmer başkentlerini 9. ile 15. yüzyıllar arasına tarihler.", "angkor"],
  ["trh022", "hard", "history", "Angkor alanındaki Preah Khan tapınağı tarihsel olarak hangi işlevle de ilişkilendirilir?", ["Tıp eğitimi", "Deniz feneri", "Para basımı", "Astronomi gözlemevi"], "UNESCO, Preah Khan'ın bir tıp üniversitesi sayıldığını belirtir.", "angkor"],
  ["trh023", "hard", "history", "UNESCO'ya göre Petra hangi üç tarihsel dönem boyunca yerleşim gördü?", ["Nebati, Roma ve Bizans", "İnka, Maya ve Aztek", "Selçuklu, Osmanlı ve Cumhuriyet", "Viking, Norman ve Tudor"], "Petra'nın su yönetim sistemi Nebati, Roma ve Bizans dönemlerinde yerleşimi mümkün kıldı.", "petra"],
  ["trh024", "medium", "history", "Petra'nın çöl ortamında gelişmesini sağlayan önemli mühendislik başarısı neydi?", ["Su yönetimi", "Buz depolama", "Deniz ulaşımı", "Rüzgâr türbinleri"], "UNESCO, Petra'nın kurak alanda yaşanmasını sağlayan kapsamlı su sistemini vurgular.", "petra"],
  ["trh025", "medium", "history", "Stonehenge ile birlikte UNESCO alanının adında geçen diğer tarih öncesi yerleşim hangisidir?", ["Avebury", "Pompeii", "Knossos", "Efes"], "UNESCO Dünya Mirası alanının adı Stonehenge, Avebury and Associated Sites'tır.", "stonehenge"],
  ["trh026", "hard", "history", "UNESCO'ya göre Stonehenge ve Avebury anıtları hangi iki çağın tören geleneklerini yansıtır?", ["Neolitik ve Tunç Çağı", "Demir ve Orta Çağ", "Roma ve Rönesans", "Paleolitik ve Sanayi Çağı"], "UNESCO alanın Neolitik ve Tunç Çağı tören ve gömü geleneklerini yansıttığını belirtir.", "stonehenge"],
  ["trh027", "medium", "history", "Atina Akropolisi'ndeki büyük yapım programı hangi devlet adamının döneminde yürütüldü?", ["Perikles", "Büyük İskender", "Julius Caesar", "Augustus"], "UNESCO, 5. yüzyıldaki Akropolis yapım programını Perikles'in liderliğiyle ilişkilendirir.", "acropolis"],
  ["trh028", "hard", "history", "Atina Akropolisi'nin anıtsal giriş yapısının adı nedir?", ["Propylaia", "Kolezyum", "Pantheon", "Ziggurat"], "UNESCO, Propylaia'yı Akropolis'in anıtsal girişi olarak tanımlar.", "acropolis"],
  ["trh029", "expert", "history", "Akropolis'te Parthenon ve Erechtheion'un da inşa edildiği büyük program hangi yüzyıldadır?", ["MÖ 5. yüzyıl", "MÖ 1. yüzyıl", "MS 5. yüzyıl", "MS 15. yüzyıl"], "UNESCO, bu büyük anıtların MÖ 5. yüzyılda inşa edildiğini belirtir.", "acropolis"],
  ["trh030", "hard", "history", "UNESCO'ya göre Angkor alanı Dünya Mirası Tehlike Listesi'nden hangi yıl çıkarıldı?", ["2004", "1992", "1985", "2015"], "UNESCO, Angkor'un Tehlike Listesi'nden 2004'te çıkarıldığını kaydeder.", "angkor"],

  ["trh031", "easy", "arts_culture", "Gece Devriyesi tablosunu kim yaptı?", ["Rembrandt", "Vermeer", "Bosch", "Monet"], "Rijksmuseum'un Gece Devriyesi eseri Rembrandt'a aittir.", "nightwatch"],
  ["trh032", "medium", "arts_culture", "Rembrandt'ın Gece Devriyesi tablosu hangi yılda tamamlandı?", ["1642", "1503", "1789", "1905"], "Rijksmuseum, Gece Devriyesi'nin tarihini 1642 olarak verir.", "nightwatch"],
  ["trh033", "hard", "arts_culture", "Gece Devriyesi tablosundaki birlik hangi yüzbaşının komutasındadır?", ["Frans Banninck Cocq", "Napolyon Bonapart", "Vincent van Gogh", "Johannes Vermeer"], "Rijksmuseum resimdeki milis birliğinin yüzbaşısını Frans Banninck Cocq olarak belirtir.", "nightwatch"],
  ["trh034", "medium", "arts_culture", "Gece Devriyesi bugün hangi müzede sergilenir?", ["Rijksmuseum", "Prado", "Louvre", "Uffizi"], "Gece Devriyesi Amsterdam'daki Rijksmuseum koleksiyonundadır.", "nightwatch"],
  ["trh035", "medium", "arts_culture", "Bir Virginalin Başında Duran Genç Kadın tablosu hangi ressamındır?", ["Johannes Vermeer", "Rembrandt", "El Greco", "Goya"], "National Gallery eseri Johannes Vermeer'e atfeder.", "vermeer"],
  ["trh036", "hard", "arts_culture", "Vermeer'in Bir Virginalin Başında Duran Genç Kadın tablosundaki virginal nedir?", ["Klavye çalgısı", "Bir çiçek", "Deniz aracı", "Dans türü"], "National Gallery, virginali resimde görülen bir klavye çalgısı olarak açıklar.", "vermeer"],
  ["trh037", "hard", "arts_culture", "Vermeer'in Bir Virginalin Başında Duran Genç Kadın tablosu yaklaşık hangi döneme tarihlenir?", ["1670-1672", "1450-1452", "1820-1822", "1920-1922"], "National Gallery tabloyu yaklaşık 1670-1672 yıllarına tarihler.", "vermeer"],
  ["trh038", "easy", "arts_culture", "Dünyevi Zevkler Bahçesi üçlemesinin ressamı kimdir?", ["Hieronymus Bosch", "Pablo Picasso", "Salvador Dalí", "Claude Monet"], "Prado, üç panelli eseri Hieronymus Bosch'un yapıtı olarak kaydeder.", "bosch"],
  ["trh039", "medium", "arts_culture", "Dünyevi Zevkler Bahçesi tablosunun bulunduğu müze hangisidir?", ["Prado", "Tate Modern", "Metropolitan", "Rijksmuseum"], "Dünyevi Zevkler Bahçesi Madrid'deki Prado Müzesi koleksiyonundadır.", "bosch"],
  ["trh040", "hard", "arts_culture", "Dünyevi Zevkler Bahçesi nasıl bir resim düzenlemesine sahiptir?", ["Üç kanatlı tablo", "Tekli fresk", "Mozaik döşeme", "Heykel grubu"], "Prado eseri bir triptik, yani üç kanatlı tablo olarak tanımlar.", "bosch"],

  ["trh041", "easy", "language_literature", "2016 Nobel Edebiyat Ödülü hangi müzisyene verildi?", ["Bob Dylan", "Elton John", "David Bowie", "Paul McCartney"], "Nobel'in resmî kaydı 2016 Edebiyat Ödülü sahibini Bob Dylan olarak verir.", "dylan"],
  ["trh042", "easy", "language_literature", "2017 Nobel Edebiyat Ödülü'nü hangi yazar kazandı?", ["Kazuo Ishiguro", "Abdulrazak Gurnah", "Bob Dylan", "Annie Ernaux"], "Nobel biyobibliyografisi 2017 ödülünü Kazuo Ishiguro'ya atfeder.", "ishiguro"],
  ["trh043", "medium", "language_literature", "Kazuo Ishiguro Japonya'nın hangi kentinde doğdu?", ["Nagasaki", "Tokyo", "Osaka", "Kyoto"], "Nobel biyografisine göre Ishiguro Nagasaki'de doğdu.", "ishiguro"],
  ["trh044", "medium", "language_literature", "Kazuo Ishiguro'nun sinemaya da uyarlanan 1989 tarihli romanı hangisidir?", ["Günden Kalanlar", "Beni Asla Bırakma", "Uçurtma Avcısı", "Körlük"], "Nobel biyografisi The Remains of the Day romanını 1989'a tarihler ve film uyarlamasını belirtir.", "ishiguro"],
  ["trh045", "hard", "language_literature", "Kazuo Ishiguro'nun 1982'de yayımlanan ilk romanının adı nedir?", ["A Pale View of Hills", "Never Let Me Go", "Nocturnes", "The Buried Giant"], "Nobel biyobibliyografisi ilk romanını A Pale View of Hills olarak kaydeder.", "ishiguro"],
  ["trh046", "easy", "language_literature", "2021 Nobel Edebiyat Ödülü'nü hangi yazar kazandı?", ["Abdulrazak Gurnah", "Kazuo Ishiguro", "Bob Dylan", "Jon Fosse"], "Nobel'in 2021 biyobibliyografisi ödül sahibini Abdulrazak Gurnah olarak kaydeder.", "gurnah"],
  ["trh047", "medium", "language_literature", "Abdulrazak Gurnah hangi adada büyüdü?", ["Zanzibar", "Girit", "Sicilya", "Madagaskar"], "Nobel biyografisine göre Gurnah Zanzibar'da büyüdü.", "gurnah"],
  ["trh048", "hard", "language_literature", "Abdulrazak Gurnah 1960'ların sonunda mülteci olarak hangi ülkeye gitti?", ["İngiltere", "Kanada", "İsveç", "Hindistan"], "Nobel biyobibliyografisi Gurnah'ın 1960'ların sonunda İngiltere'ye mülteci olarak gittiğini belirtir.", "gurnah"],
  ["trh049", "medium", "language_literature", "2015 Nobel Edebiyat Ödülü sahibi Svetlana Aleksiyeviç Nobel konuşmasını hangi dilde yaptı?", ["Rusça", "İngilizce", "Fransızca", "İsveççe"], "Nobel kaydı Aleksiyeviç'in 2015 konuşmasının Rusça yapıldığını belirtir.", "alexievich"],
  ["trh050", "hard", "language_literature", "Kazuo Ishiguro'nun Beni Asla Bırakma romanı hangi yılda yayımlandı?", ["2005", "1982", "1989", "2017"], "Nobel biyobibliyografisi Never Let Me Go romanını 2005'e tarihler.", "ishiguro"],
];

export const turkishFiftyTwo: readonly Question[] = rows.map(([id, difficulty, category, question, options, explanation, source]) => ({
  id, difficulty, category, question,
  choices: [
    { id: `${id}-0`, text: options[0] },
    { id: `${id}-1`, text: options[1] },
    { id: `${id}-2`, text: options[2] },
    { id: `${id}-3`, text: options[3] },
  ],
  correctAnswer: `${id}-0`, explanation, sourceUrl: sources[source], reviewedAt: "2026-10-14",
}));
