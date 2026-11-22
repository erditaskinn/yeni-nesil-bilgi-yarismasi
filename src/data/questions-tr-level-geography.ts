import { levelBalanceQuestions as make } from "./level-balance-format";
const namib = "https://whc.unesco.org/en/list/1430/";
const ice = "https://whc.unesco.org/en/list/1604/";
const lake = "https://whc.unesco.org/en/list/801/";
const parks = "https://whc.unesco.org/en/list/72/";
const panda = "https://whc.unesco.org/en/list/1213/";
export const levelGeography = [
  ...make("tlge", "geography", "easy", namib, [
    ["Rüzgârın yığdığı kum tepelerine ne denir?", ["Kumul", "Buzul", "Şelale", "Mağara"], "Namib'in kumulları rüzgârın taşıyıp biriktirdiği kumlardan oluşur."],
  ]),
  ...make("tlgnah", "geography", "hard", namib, [
    ["Namib Kum Denizi hangi millî parkın sınırları içinde kalır?", ["Namib-Naukluft", "Kruger", "Etosha", "Serengeti"], "UNESCO alanı bütünüyle Namib-Naukluft Parkı içinde konumlandırır."],
    ["UNESCO'nun Namib Kum Denizi açıklamasında akarsuların akış özelliği nasıl nitelenir?", ["Geçici akışlı", "Yıl boyunca eşit debili", "Buz altında sürekli akan", "Her zaman iki yönlü akan"], "UNESCO alanın yer şekilleri arasında geçici akarsuları da sayar."],
    ["Namib Kum Denizi hangi okyanusun güney bölümünün kıyısındadır?", ["Atlas Okyanusu", "Hint Okyanusu", "Büyük Okyanus", "Arktik Okyanusu"], "Alan Afrika'nın Güney Atlas kıyısındadır."],
  ]),
  ...make("tlgnax", "geography", "expert", namib, [
    ["UNESCO kaydında Namib Kum Denizi'nin alanı kaç hektardır?", ["3.077.700", "307.770", "899.500", "9.839.121"], "UNESCO sentezi alanı 3.077.700 hektar olarak verir."],
    ["Namib Kum Denizi'nin UNESCO'da belirtilen tampon bölgesi kaç hektardır?", ["899.500", "89.950", "3.077.700", "161.485"], "Tampon bölge 899.500 hektardır."],
    ["Namib Kum Denizi'ndeki iki kumul sistemi hangi ilişkiyle üst üste gelir?", ["Eski yarı pekişmiş sistemin üstünde genç etkin sistem", "Genç buz tabakasının üstünde mercan", "Eski lavın üstünde sürekli kar", "Birbiriyle bağlantısız iki granit sırası"], "UNESCO, eski yarı pekişmiş kumulların genç etkin kumullarla örtüldüğünü açıklar."],
    ["Namib kumlarını iç kesimlerden kıyıya taşıyan üçlü süreç hangisidir?", ["Akarsu, okyanus akıntısı ve rüzgâr", "Buzul, gelgit ve çığ", "Lav, deprem ve yıldırım", "Karst, çığ ve donma"], "Kumun uzun taşınım zinciri akarsu aşındırması, okyanus akıntıları ve rüzgârdan oluşur."],
  ]),
  ...make("tlgih", "geography", "hard", ice, [
    ["Vatnajökull Millî Parkı hangi ülkededir?", ["İzlanda", "Norveç", "Finlandiya", "İrlanda"], "Vatnajökull İzlanda'da yer alır."],
    ["Vatnajökull'daki jökulhlaup terimi hangi olayı anlatır?", ["Ani buzul taşkınını", "Kum fırtınasını", "Mercan ağarmasını", "Denizaltı heyelanını"], "Jökulhlaup, buzuldan aniden boşalan suyun oluşturduğu taşkındır."],
    ["Vatnajökull'daki volkan-buzul etkileşimi hangi ova türünü oluşturur?", ["Sandur", "Mercan ovası", "Lös ovası", "Tuz düzlüğü"], "Buzul erime sularının birikimleri sandur düzlükleri oluşturur."],
  ]),
  ...make("tlgix", "geography", "expert", ice, [
    ["UNESCO'ya göre Vatnajökull alanındaki on merkezî volkanın kaçı buzul altındadır?", ["Sekizi", "İkisi", "Dördü", "Altısı"], "On merkezî volkanın sekizi buzul altındadır."],
    ["UNESCO Vatnajökull kaydında levhaların yıllık ayrılmasını yaklaşık kaç milimetre verir?", ["19", "190", "1,9", "900"], "UNESCO'nun sentezinde yıllık ayrılma yaklaşık 19 milimetredir."],
    ["Vatnajökull UNESCO alanı yaklaşık kaç kilometrelik ıraksayan levha sınırını kapsar?", ["200", "20", "2000", "5000"], "Alan yaklaşık 200 kilometrelik levha sınırını içerir."],
    ["Vatnajökull buz örtüsü en büyük yayılımına hangi dönemin sonunda ulaştı?", ["18. yüzyılın", "12. yüzyılın", "15. yüzyılın", "20. yüzyılın"], "UNESCO, buz örtüsünün 18. yüzyıl sonunda en geniş durumuna ulaştığını belirtir."],
  ]),
  ...make("tlglh", "geography", "hard", lake, [
    ["Turkana Gölü çevresindeki Koobi Fora hangi özelliğiyle tanınır?", ["Fosil buluntularıyla", "Mercan resifleriyle", "Etkin buzullarıyla", "Tuzdan heykelleriyle"], "Koobi Fora memeli ve insan atalarına ait fosilleriyle önemlidir."],
    ["Turkana Gölü'nün renklerinden kaynaklanan takma adı hangisidir?", ["Yeşim Denizi", "Kızıl Deniz", "Gümüş Okyanus", "Beyaz Körfez"], "UNESCO gölün renginden dolayı Jade Sea, yani Yeşim Denizi adını kaydeder."],
    ["Turkana Gölü hangi büyük jeolojik sistem boyunca uzanır?", ["Doğu Afrika Rift Sistemi", "Alp kuşağı", "And dağ kuşağı", "Orta Atlas sırtı"], "Turkana, Doğu Afrika Rift vadisinde uzanır."],
  ]),
  ...make("tlglx", "geography", "expert", lake, [
    ["UNESCO Turkana Gölü Millî Parkları alanını kaç hektar olarak verir?", ["161.485", "16.148", "924.500", "3.077.700"], "Üç parkın toplam alanı 161.485 hektardır."],
    ["Turkana UNESCO alanındaki parklar hangi üçlüdür?", ["Sibiloi, Güney Ada ve Merkez Ada", "Kruger, Etosha ve Chobe", "Serengeti, Ngorongoro ve Tarangire", "Amboseli, Tsavo ve Nairobi"], "Alan Sibiloi ile Güney ve Merkez Ada millî parklarından oluşur."],
    ["UNESCO Turkana sentezinde gölün kuzey-güney uzunluğu kaç kilometredir?", ["249", "49", "749", "1249"], "Sentez metni kuzey-güney uzanışını 249 kilometre olarak verir."],
    ["Turkana çevresindeki Sibiloi hangi yılda millî park ilan edildi?", ["1973", "1953", "1983", "1993"], "UNESCO yönetim bölümüne göre Sibiloi 1973'te ilan edildi."],
  ]),
  ...make("tlgkh", "geography", "hard", parks, [
    ["Kluane-Wrangell-St. Elias-Glacier Bay-Tatshenshini-Alsek alanı hangi iki ülkeye yayılır?", ["Kanada ve ABD", "Kanada ve Rusya", "ABD ve Meksika", "Norveç ve İsveç"], "Sınır aşan alan Kanada ile ABD'de yer alır."],
    ["Kluane'nin içinde yer aldığı UNESCO alanı hangi buz örtüsü özelliğiyle tanınır?", ["En büyük kutup dışı buz alanını içermesi", "Hiç buzul içermemesi", "Yalnız deniz buzundan oluşması", "Tamamının tropik olması"], "UNESCO alanı dünyanın en büyük kutup dışı buz alanını içeren yer olarak tanımlar."],
    ["Kluane UNESCO alanının ABD tarafı hangi eyalettedir?", ["Alaska", "Florida", "Nevada", "Texas"], "Wrangell-St. Elias ve Glacier Bay bileşenleri Alaska'dadır."],
  ]),
  ...make("tlgkx", "geography", "expert", parks, [
    ["Kluane UNESCO alanında kıyıdan iç kesime buzsuz bağlantı sağlayan iki vadi hangisidir?", ["Tatshenshini ve Alsek", "Yukon ve Mackenzie", "Fraser ve Columbia", "Hudson ve Delaware"], "UNESCO bu iki vadiyi canlı göçü için kıyı-iç kesim bağlantısı olarak vurgular."],
    ["UNESCO Kluane ortak alanının toplam büyüklüğünü kaç hektar olarak verir?", ["9.839.121", "983.912", "1.482.000", "161.485"], "Bütünlük bölümünde toplam büyüklük 9.839.121 hektardır."],
    ["Kluane ortak UNESCO alanının kıyı uzunluğu yaklaşık kaç kilometredir?", ["1900", "190", "19", "19000"], "UNESCO alanın yaklaşık 1900 kilometre kıyı içerdiğini belirtir."],
    ["Kluane ortak UNESCO alanının Kanada'daki iki idari bölgesi hangisidir?", ["Yukon ve Britanya Kolumbiyası", "Ontario ve Québec", "Alberta ve Manitoba", "Nunavut ve Nova Scotia"], "Kanada bileşenleri Yukon ve Britanya Kolumbiyası'ndadır."],
  ]),
  ...make("tlgph", "geography", "hard", panda, [
    ["Sichuan Dev Panda Koruma Alanları hangi iki dağ kuşağında yer alır?", ["Qionglai ve Jiajin", "Alpler ve Pireneler", "Atlas ve Ahaggar", "Ural ve Kafkas"], "UNESCO bu alanları Qionglai ve Jiajin dağlarında konumlandırır."],
    ["Sichuan Dev Panda Koruma Alanlarında dev panda dışında hangi hayvan da korunur?", ["Kar leoparı", "Kutup ayısı", "Kanguru", "Afrika fili"], "UNESCO kar leoparı, kırmızı panda ve bulutlu parsı da sayar."],
    ["Sichuan panda alanları hangi habitat özelliğiyle özellikle önemlidir?", ["Dev pandanın kalan en büyük kesintisiz yaşam alanını içermesi", "Yalnız çölden oluşması", "Denizaltında bulunması", "Kalıcı kutup buzuyla örtülü olması"], "Alan dev pandanın kalan en büyük bitişik habitatını korur."],
  ]),
  ...make("tlgpx", "geography", "expert", panda, [
    ["Sichuan Dev Panda Koruma Alanları UNESCO açıklamasında kaç doğa rezervi içerir?", ["7", "3", "12", "21"], "UNESCO yedi doğa rezervi sayar."],
    ["Sichuan Dev Panda Koruma Alanlarının UNESCO açıklamasındaki manzara parkı sayısı kaçtır?", ["9", "4", "16", "27"], "Alan yedi rezervin yanı sıra dokuz manzara parkı içerir."],
    ["Sichuan Dev Panda Koruma Alanları UNESCO özetinde kaç hektarlık alan kaplar?", ["924.500", "92.450", "161.485", "3.077.700"], "Özet metin büyüklüğü 924.500 hektar olarak verir."],
    ["UNESCO'nun Sichuan panda alanları açıklamasındaki bitki türü aralığı hangisidir?", ["5000–6000", "500–600", "50–60", "50.000–60.000"], "Açıklamada 1000'den fazla cinse ait 5000–6000 bitki türü belirtilir."],
  ]),
];
