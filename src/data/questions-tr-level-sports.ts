import { levelBalanceQuestions as make } from "./level-balance-format";
const handball = "https://www.ihf.info/sites/default/files/2025-07/09A%20-%20Rules%20of%20the%20Game_Indoor%20Handball_E.pdf";
const rugby = "https://passport.world.rugby/laws-of-the-game/laws-by-number/1-the-ground";
const score = "https://passport.world.rugby/laws-of-the-game/laws-by-number/8-scoring";
export const levelSports = [
  ...make("tlpea", "sports", "easy", "https://www.worldarchery.sport/sport", [
    ["Okçulukta oku fırlatmak için hangi araç kullanılır?", ["Yay", "Raket", "Golf sopası", "Kürek"], "Okçuluk yay kullanılarak ok atılan spordur."],
  ]),
  ...make("tlpeg", "sports", "easy", "https://olympic.ca/sports/golf/", [
    ["Golfte topa vurmak için hangi araç kullanılır?", ["Golf sopası", "Yay", "Kürek", "Hokey pateni"], "Golfçüler farklı vuruşlar için sopalar kullanır."],
    ["Golfte topu mümkün olduğunca az vuruşla nereye ulaştırmaya çalışırsın?", ["Deliğe", "Kaleye", "Basket potasına", "Yüzme kulvarına"], "Golfün amacı topu az sayıda vuruşla deliğe sokmaktır."],
  ]),
  ...make("tlpei", "sports", "easy", "https://resources.specialolympics.org/sports-essentials/figure-skating", [
    ["Artistik buz pateni hangi zeminde yapılır?", ["Buzda", "Kumda", "Çimde", "Çakılda"], "Artistik patinaj buz üzerinde yapılan dönüş ve sıçramaları içerir."],
    ["Artistik buz pateni yapan sporcu ayağına ne giyer?", ["Buz pateni", "Palet", "Futbol kramponu", "Boks eldiveni"], "Sporcular buz üzerinde bıçaklı patenlerle kayar."],
  ]),
  ...make("tlpes", "sports", "easy", "https://olympic.ca/sports/skateboarding/", [
    ["Kaykayın zeminde ilerlemesini altındaki hangi parçalar sağlar?", ["Tekerlekler", "Yelkenler", "Paletler", "Kürekler"], "Kaykay, altına tekerlek bağlanmış bir tahta üzerinde gelişen spordur."],
  ]),
  ...make("tlper", "sports", "easy", "https://stillmed.olympic.org/media/Document%20Library/OlympicOrg/Factsheets-Reference-Documents/Games/Pictograms/Reference-document-The-Sports-Pictograms-of-the-OG-from-Tokyo-1964-to-Rio-2016.pdf", [
    ["Binicilik sporunda sporcu hangi hayvanla birlikte yarışır?", ["At", "Yunus", "Fil", "Köpek"], "Binicilik at ve binicinin birlikte yaptığı spordur."],
    ["Kürek yarışlarında sporcular neyin içinde ilerler?", ["Teknenin", "Otomobilin", "Uçağın", "Kızakların"], "Kürek yarışları su üzerinde teknelerle yapılır."],
    ["Kürek sporunda tekneyi ilerletmek için hangi araç kullanılır?", ["Kürek", "Tenis raketi", "Golf sopası", "Ok yayı"], "Kürekçiler küreklerle suyu iterek tekneyi ilerletir."],
  ]),
  ...make("tlphr", "sports", "hard", score, [
    ["Ragbi birliğinde normal bir try kaç puandır?", ["5", "2", "3", "7"], "World Rugby kural 8'e göre normal try beş puandır."],
    ["Ragbi birliğinde başarılı conversion vuruşu kaç puan getirir?", ["2", "1", "3", "5"], "Try sonrasındaki başarılı conversion iki puan getirir."],
    ["Ragbi birliğinde başarılı drop goal kaç puandır?", ["3", "2", "4", "5"], "Drop goal üç puan değerindedir."],
  ]),
  ...make("tlphh", "sports", "hard", handball, [
    ["Standart salon hentbol sahasının boyutları hangisidir?", ["40 × 20 metre", "28 × 15 metre", "18 × 9 metre", "105 × 68 metre"], "IHF kural 1 sahayı 40 metre uzunluk ve 20 metre genişlikle tanımlar."],
    ["Salon hentbol kalesinin iç genişliği ve yüksekliği sırasıyla kaç metredir?", ["3 ve 2", "2 ve 3", "4 ve 2", "7,32 ve 2,44"], "Hentbol kalesi içeriden 3 metre genişlikte ve 2 metre yüksekliktedir."],
    ["Hentbolda açık gol fırsatını engelleyen ihlal için kullanılan özel atışın mesafesi kaç metredir?", ["7", "6", "9", "11"], "IHF bu özel atışı 7 metre atışı olarak düzenler."],
  ]),
  ...make("tlpxr", "sports", "expert", rugby, [
    ["World Rugby standart tablosunda oyun alanının kale içi hariç asgari uzunluğu kaç metredir?", ["94", "90", "100", "110"], "Standart tabloda oyun alanı uzunluğu 94–100 metredir; istisnalar ilgili onaya tabidir."],
    ["World Rugby standart tablosunda saha genişliği hangi aralıktadır?", ["68–70 metre", "60–64 metre", "74–80 metre", "90–94 metre"], "Kural 1 genişliği 68–70 metre olarak verir."],
    ["Ragbi birliğinde standart kale içi alanın uzunluk aralığı hangisidir?", ["6–22 metre", "3–5 metre", "25–35 metre", "40–50 metre"], "World Rugby tablosundaki in-goal uzunluğu 6–22 metredir."],
    ["Ragbi birliğinde iki kale direğinin iç kenarları arasındaki mesafe kaç metredir?", ["5,6", "3", "7,32", "6,4"], "World Rugby kural 1 direkler arasını 5,6 metre olarak belirler."],
    ["Ragbi birliğinde üst kale çubuğunun yerden yüksekliği kaç metredir?", ["3", "2", "2,44", "4,5"], "Üst çubuğun üst kenarı yerden 3 metre yüksektedir."],
    ["Ragbi birliğinde kale direklerinin asgari yüksekliği kaç metredir?", ["3,4", "2,4", "4,4", "5,4"], "Kural 1, direklerin yüksekliğini en az 3,4 metre olarak verir."],
    ["Ragbi sahasındaki kesikli çizgileri oluşturan her çizgi parçası kaç metredir?", ["5", "1", "2", "10"], "Kural 1.5'e göre her kesik çizgi parçası 5 metre uzunluğundadır."],
    ["Ragbi birliğinde orta çizginin iki yanındaki başlama mesafesi çizgileri kaç metre uzaktadır?", ["10", "5", "15", "22"], "Orta çizginin iki tarafında 10 metre çizgileri yer alır."],
  ]),
  ...make("tlpxh", "sports", "expert", handball, [
    ["Salon hentbolunda kale direkleri ve üst çubuğun kare kesitinin kenarı kaç santimetredir?", ["8", "5", "10", "12"], "Kural 1.2 direk ve üst çubuklar için 8 santimetrelik kare kesit belirler."],
    ["Hentbolda kale direkleri arasındaki kale çizgisi kaç santimetre genişliğindedir?", ["8", "5", "10", "15"], "Kale çizgisi direkler arasında 8 santimetredir; diğer saha çizgileri 5 santimetredir."],
    ["Salon hentbolunda yan çizgiler boyunca güvenlik şeridi en az kaç metredir?", ["1", "0,5", "2", "3"], "Saha çevresinde yan çizgiler boyunca en az 1 metre güvenlik alanı gerekir."],
    ["Salon hentbolunda kale çizgilerinin arkasındaki güvenlik şeridi en az kaç metredir?", ["2", "1", "0,5", "4"], "Kale arkalarında güvenlik alanı en az 2 metredir."],
    ["Hentbolun 9 metre çizgisindeki kesik parçaların ve boşlukların her biri kaç santimetredir?", ["15", "5", "10", "30"], "Kural 1.5 hem çizgi parçalarını hem boşlukları 15 santimetre verir."],
    ["Hentbolun 7 metre atış çizgisinin kendi uzunluğu kaç metredir?", ["1", "3", "4", "7"], "Çizgi kaleden 7 metre uzakta, 1 metre uzunluğundadır."],
    ["Hentbolda değişim çizgisi orta çizgiden itibaren kaç metre uzanır?", ["4,5", "3", "6", "9"], "Her takımın değişim çizgisi orta çizgiden 4,5 metre uzanır."],
    ["IHF'nin merkezde tanımladığı başlama atışı alanının çapı kaç metredir?", ["4", "2", "6", "9"], "Başlama atışı alanı 4 metre çaplı dairedir; kullanım zorunluluğu yarışma düzeyine göre düzenlenir."],
  ]),
];
