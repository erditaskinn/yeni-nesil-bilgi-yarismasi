import type { Difficulty } from "../lib/config";
import type { GameCategory } from "../lib/categories";
import type { Question } from "../lib/types";

const sources = {
  narrowing: "https://tdk.gov.tr/icerik/yazim-kurallari/unlu-daralmasi/",
  institutions: "https://tdk.gov.tr/icerik/sikca-sorulan-sorular/kurum-ve-kurulus-adlarindan-sonra-gelen-ekler-kesme-isareti-ile-ayrilir-mi/",
  abbreviations: "https://tdk.gov.tr/icerik/yazim-kurallari/kisaltmalar/",
  numbers: "https://tdk.gov.tr/icerik/yazim-kurallari/sayilarin-yazilisi/",
  separate: "https://tdk.gov.tr/icerik/yazim-kurallari/ayri-yazilan-birlesik-kelimeler/",
  joined: "https://tdk.gov.tr/icerik/yazim-kurallari/bitisik-yazilan-birlesik-kelimeler/",
  circumflex: "https://tdk.gov.tr/icerik/yazim-kurallari/duzeltme-isareti/",
  han: "https://www.nobelprize.org/prizes/literature/2024/han/facts/",
  hanBio: "https://www.nobelprize.org/prizes/literature/2024/bio-bibliography/",
  fosse: "https://www.nobelprize.org/prizes/literature/2023/bio-bibliography/",
  ernaux: "https://www.nobelprize.org/prizes/literature/2022/ernaux/facts/",
  ernauxBio: "https://www.nobelprize.org/prizes/literature/2022/bio-bibliography/",
} as const;

function q(
  id: string, difficulty: Difficulty, question: string,
  options: [string, string, string, string], explanation: string,
  source: keyof typeof sources,
): Question {
  return {
    id, difficulty, category: "language_literature" as Exclude<GameCategory, "mixed">, question,
    choices: [
      { id: `${id}-0`, text: options[0] },
      { id: `${id}-1`, text: options[1] },
      { id: `${id}-2`, text: options[2] },
      { id: `${id}-3`, text: options[3] },
    ],
    correctAnswer: `${id}-0`, explanation, sourceUrl: sources[source], reviewedAt: "2026-10-14",
  };
}

export const turkishMilestoneThree: readonly Question[] = [
  q("trf001", "easy", "'Başlamak' fiilinin şimdiki zaman çekiminde doğru yazım hangisidir?",
    ["Başlıyor", "Başlayor", "Başlayıyor", "Başliyor"], "TDK'ye göre başla-yor biçiminde a ünlüsü daralarak başlıyor olur.", "narrowing"),
  q("trf002", "medium", "'İzlemek' fiilinin şimdiki zaman çekiminde hangi ünlü daralması görülür?",
    ["e ünlüsü i olur", "e ünlüsü a olur", "i ünlüsü e olur", "e ünlüsü o olur"], "TDK, izle-yor biçiminin izliyor olarak yazıldığını açıklar.", "narrowing"),
  q("trf003", "medium", "TDK'ye göre kurum adından sonra gelen ekin doğru yazımı hangisidir?",
    ["Türk Dil Kurumundan", "Türk Dil Kurumu'ndan", "Türk Dil Kurumun'dan", "Türk Dil Kurumu ndan"], "Kurum ve kuruluş adlarına gelen ekler kesme işaretiyle ayrılmaz.", "institutions"),
  q("trf004", "easy", "TDK kurallarına göre 'Türkiye Büyük Millet Meclisi' kısaltması hangisidir?",
    ["TBMM", "Tbmm", "T.B.M.M", "TBmM"], "TDK, kurum adlarının ilk harflerinden oluşturulan TBMM kısaltmasını büyük harflerle yazar.", "abbreviations"),
  q("trf005", "medium", "TDK'nin kısaltma listesinde 'güneydoğu' yönü nasıl kısaltılır?",
    ["GD", "DG", "GÜ", "GO"], "TDK, güneydoğu yönü için GD kısaltmasını verir.", "abbreviations"),
  q("trf006", "medium", "Sıra sayısı ekle yazıldığında TDK'ye göre hangisi doğrudur?",
    ["2'nci", "2.'nci", "2nci", "2. nci"], "TDK, rakamdan sonra kesme işareti ve ek yazıldığında ayrıca nokta konmamasını ister.", "numbers"),
  q("trf007", "easy", "TDK'ye göre hangi söz ayrı yazılır?",
    ["Ön söz", "Birkaç", "Hiçbir", "Herhangi"], "TDK, ön sözü ayrı; birkaç, hiçbir ve herhangiyi bitişik yazar.", "separate"),
  q("trf008", "medium", "TDK'ye göre hangi birleşik fiil ayrı yazılır?",
    ["Kabul etmek", "Kaybolmak", "Hissetmek", "Affetmek"], "TDK, ilk kelimesinde ses değişmesi olmayan yardımcı fiilli birleşikleri ayrı yazar: kabul etmek.", "separate"),
  q("trf009", "easy", "TDK'ye göre hangi belirsizlik sözü bitişik yazılır?",
    ["Hiçbir", "Her şey", "Bir şey", "Pek çok"], "TDK, hiçbir sözünü gelenekleşmiş bitişik yazılan belirsizlik sözcükleri arasında sayar.", "joined"),
  q("trf010", "medium", "TDK'ye göre 'henüz' anlamındaki sözcüğün doğru yazımı hangisidir?",
    ["Hâlâ", "Hala", "Hâla", "Halâ"], "TDK, hâlâ (henüz) ile hala (babanın kız kardeşi) sözcüklerini düzeltme işaretiyle ayırır.", "circumflex"),
  q("trf011", "easy", "2024 Nobel Edebiyat Ödülü'nü hangi yazar aldı?",
    ["Han Kang", "Jon Fosse", "Annie Ernaux", "Orhan Pamuk"], "Nobel'in 2024 edebiyat ödülü sahibi Han Kang'dır.", "han"),
  q("trf012", "medium", "Han Kang'ın Nobel kayıtlarında geçen romanlarından biri hangisidir?",
    ["The Vegetarian", "The Road", "Beloved", "The Trial"], "Nobel biyografisi The Vegetarian'ı Han Kang'ın yapıtları arasında sayar.", "han"),
  q("trf013", "hard", "Han Kang'ın Human Acts romanı hangi şehirdeki tarihsel olaydan hareket eder?",
    ["Gwangju", "Busan", "Seul", "İncheon"], "Nobel biyobibliyografisi Human Acts'in Gwangju'daki 1980 olaylarıyla bağlantısını açıklar.", "hanBio"),
  q("trf014", "medium", "Nobel kaydına göre Han Kang yazarlık hayatına hangi türde başladı?",
    ["Şiir", "Tiyatro", "Deneme", "Gezi yazısı"], "Nobel kayıtlarına göre Han Kang 1993'te şiir yayımlayarak yazarlığa başladı.", "han"),
  q("trf015", "easy", "2023 Nobel Edebiyat Ödülü'nü hangi yazar kazandı?",
    ["Jon Fosse", "Han Kang", "Annie Ernaux", "Gabriel García Márquez"], "Nobel'in 2023 edebiyat ödülünün sahibi Norveçli yazar Jon Fosse'dir.", "fosse"),
  q("trf016", "medium", "Jon Fosse eserlerini Norveççenin hangi yazı standardında kaleme alır?",
    ["Nynorsk", "Bokmål", "Danca", "İzlandaca"], "Nobel biyobibliyografisi Jon Fosse'nin eserlerini Nynorsk dil standardında yazdığını belirtir.", "fosse"),
  q("trf017", "hard", "Jon Fosse'nin ilk romanının adı nedir?",
    ["Raudt, svart", "Septology", "Nokon kjem til å komme", "Morgon og kveld"], "Nobel biyobibliyografisi Fosse'nin 1983 tarihli ilk romanını Raudt, svart olarak kaydeder.", "fosse"),
  q("trf018", "easy", "2022 Nobel Edebiyat Ödülü hangi yazara verildi?",
    ["Annie Ernaux", "Han Kang", "Jon Fosse", "Olga Tokarczuk"], "Nobel'in 2022 edebiyat ödülü sahibi Annie Ernaux'dur.", "ernaux"),
  q("trf019", "medium", "Nobel Edebiyat Ödülü sahibi Annie Ernaux hangi ülkede doğdu?",
    ["Fransa", "Belçika", "Kanada", "İsviçre"], "Nobel biyografisi Annie Ernaux'nun Fransa'nın Lillebonne kentinde doğduğunu belirtir.", "ernaux"),
  q("trf020", "hard", "Nobel biyobibliyografisine göre Annie Ernaux'nun 1974'te yayımlanan ilk kitabı hangisidir?",
    ["Les armoires vides", "La place", "Les années", "Une femme"], "Nobel biyobibliyografisi Ernaux'nun ilk kitabını Les armoires vides olarak kaydeder.", "ernauxBio"),
];
