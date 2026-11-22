import type { Difficulty } from "../lib/config";
import type { GameCategory } from "../lib/categories";
import type { Question } from "../lib/types";

const sources = {
  nobel: "https://www.nobelprize.org/ceremony/the-nobel-prize-award-ceremonies-and-banquets/",
  nobelHistory: "https://www.nobelprize.org/nobel_organizations/nobelfoundation/history/",
  icrc: "https://www.icrc.org/en/document/red-cross-red-crescent-and-red-crystal-what-do-they-mean-one-word-protection",
  icrcMovement: "https://www.icrc.org/en/about-international-red-cross-and-red-crescent-movement",
  book: "https://www.unesco.org/en/days/world-book-and-copyright",
  literacy: "https://www.unesco.org/en/days/literacy",
  days: "https://www.un.org/observances/list-days-weeks",
  si: "https://www.bipm.org/en/measurement-units/si-base-units",
  prefixes: "https://www.bipm.org/en/measurement-units/si-prefixes",
} as const;

type Category = Exclude<GameCategory, "mixed">;
type Row = readonly [string, Difficulty, Category, string, readonly [string, string, string, string], string, keyof typeof sources];

const rows: readonly Row[] = [
  ["tru001", "easy", "general_knowledge", "Nobel Barış Ödülü hangi şehirde verilir?", ["Oslo", "Stockholm", "Paris", "Cenevre"], "Nobel'in resmî açıklamasına göre Barış Ödülü Oslo'da verilir.", "nobel"],
  ["tru002", "medium", "general_knowledge", "Nobel fizik ve kimya ödüllerinin töreni hangi şehirde yapılır?", ["Stockholm", "Oslo", "Brüksel", "Londra"], "Nobel, fizik ve kimya ödüllerinin Stockholm'de verildiğini açıklar.", "nobel"],
  ["tru003", "medium", "general_knowledge", "Nobel ödül törenleri her yıl hangi tarihte düzenlenir?", ["10 Aralık", "1 Ocak", "23 Nisan", "24 Ekim"], "Nobel Vakfı, törenlerin Alfred Nobel'in ölüm yıl dönümü olan 10 Aralık'ta yapıldığını belirtir.", "nobel"],
  ["tru004", "medium", "general_knowledge", "Alfred Nobel'in vasiyetindeki beş alana sonradan eklenen ödül alanı hangisidir?", ["Ekonomi bilimleri", "Matematik", "Mimarlık", "Sinema"], "Nobel Vakfı, ekonomi bilimleri ödülünün diğer beş alandan sonra oluşturulduğunu açıklar.", "nobelHistory"],
  ["tru005", "medium", "general_knowledge", "Nobel ödülü kazanan kişiye verilen madalya ve diplomanın yanında başka ne vardır?", ["Para ödülü", "Üniversite diploması", "Pasaport", "Olimpiyat bileti"], "Nobel Vakfı, ödülün madalya, kişisel diploma ve nakit ödülden oluştuğunu belirtir.", "nobelHistory"],
  ["tru006", "easy", "general_knowledge", "Kızılhaç ve Kızılay amblemleri çatışma bölgelerinde öncelikle neyi gösterir?", ["Koruma ve insani yardım", "Spor kulübünü", "Ticaret merkezini", "Siyasi partiyi"], "ICRC, amblemlerin yaralılar ile onlara yardım edenleri korumayı gösterdiğini açıklar.", "icrc"],
  ["tru007", "medium", "general_knowledge", "ICRC'ye göre Kızılhaç ve Kızılay amblemleri hangi tür simgeler değildir?", ["Dinî simgeler", "Koruyucu simgeler", "İnsani yardım simgeleri", "Tanıtıcı simgeler"], "ICRC, bu amblemlerin dinî simgeler olmadığını özellikle belirtir.", "icrc"],
  ["tru008", "medium", "general_knowledge", "Kızılhaç ve Kızılay'ın yanı sıra tanınan üçüncü insani yardım amblemi hangisidir?", ["Kızıl Kristal", "Mavi Yıldız", "Yeşil Daire", "Beyaz Üçgen"], "ICRC, üçüncü amblem olarak Kızıl Kristal'i listeler.", "icrcMovement"],
  ["tru009", "medium", "general_knowledge", "Kızılhaç/Kızılay ambleminin çatışma sırasında sağlık personelini korumak için gösterilmesi hangi kullanımdır?", ["Koruyucu kullanım", "Ticari kullanım", "Eğlence amaçlı kullanım", "Reklam kullanımı"], "ICRC, sağlık görevlileri için amblemin bu şekilde kullanımına koruyucu kullanım der.", "icrc"],
  ["tru010", "medium", "general_knowledge", "Kızılhaç/Kızılay ambleminin bir ulusal derneğin logosunda yer alması hangi kullanımdır?", ["Tanıtıcı kullanım", "Askerî kamuflaj", "Ticari marka devri", "Seçim kampanyası"], "ICRC, ulusal dernekleri tanıtan logo kullanımını koruyucu kullanımdan ayırır.", "icrc"],
  ["tru011", "easy", "general_knowledge", "UNESCO'nun Dünya Kitap ve Telif Hakkı Günü hangi tarihtedir?", ["23 Nisan", "1 Ocak", "8 Mart", "10 Aralık"], "UNESCO, Dünya Kitap ve Telif Hakkı Günü'nü 23 Nisan'da kutlar.", "book"],
  ["tru012", "medium", "general_knowledge", "UNESCO her yıl Dünya Kitap ve Telif Hakkı Günü kapsamında hangi unvanı seçer?", ["Dünya Kitap Başkenti", "Dünya Spor Başkenti", "Dünya Uzay Başkenti", "Dünya Sağlık Başkenti"], "UNESCO, bu gün kapsamında Dünya Kitap Başkenti seçildiğini açıklar.", "book"],
  ["tru013", "medium", "general_knowledge", "Uluslararası Okuryazarlık Günü hangi tarihte kutlanır?", ["8 Eylül", "23 Nisan", "21 Mart", "24 Ekim"], "UNESCO, Uluslararası Okuryazarlık Günü tarihini 8 Eylül olarak verir.", "literacy"],
  ["tru014", "easy", "general_knowledge", "Birleşmiş Milletlerin Dünya Su Günü hangi tarihtedir?", ["22 Mart", "22 Haziran", "22 Eylül", "22 Aralık"], "BM'nin uluslararası günler listesinde Dünya Su Günü 22 Mart'tadır.", "days"],
  ["tru015", "medium", "general_knowledge", "Birleşmiş Milletlerin İnsan Hakları Günü hangi tarihtedir?", ["10 Aralık", "10 Ocak", "10 Mayıs", "10 Ağustos"], "BM'nin uluslararası günler listesinde İnsan Hakları Günü 10 Aralık'tadır.", "days"],
  ["tru016", "medium", "general_knowledge", "Birleşmiş Milletlerin Uluslararası Barış Günü hangi tarihtedir?", ["21 Eylül", "21 Mart", "21 Haziran", "21 Aralık"], "BM, Uluslararası Barış Günü'nü 21 Eylül olarak listeler.", "days"],
  ["tru017", "easy", "general_knowledge", "SI birim sisteminde kütlenin temel birimi hangisidir?", ["Kilogram", "Metre", "Saniye", "Kelvin"], "BIPM'nin SI temel birimler tablosunda kütle birimi kilogramdır.", "si"],
  ["tru018", "medium", "general_knowledge", "SI'da 'milli' öneki bir birimin kaçta birini anlatır?", ["Binde birini", "Yüzde birini", "Onda birini", "Milyonda birini"], "BIPM, milli önekini 10 üzeri eksi 3 olarak tanımlar.", "prefixes"],
  ["tru019", "medium", "general_knowledge", "SI'da 'santi' öneki bir birimin kaçta birini anlatır?", ["Yüzde birini", "Binde birini", "Onda birini", "Milyonda birini"], "BIPM, centi önekini 10 üzeri eksi 2 olarak tanımlar.", "prefixes"],
  ["tru020", "medium", "general_knowledge", "SI'da 'giga' öneki hangi büyüklüğü ifade eder?", ["Milyar katını", "Bin katını", "Milyon katını", "Trilyon katını"], "BIPM, giga önekini 10 üzeri 9 olarak listeler.", "prefixes"],
];

export const turkishBalanceEight: readonly Question[] = rows.map(([id, difficulty, category, question, options, explanation, source]) => ({
  id, difficulty, category, question,
  choices: options.map((text, index) => ({ id: `${id}-${index}`, text })) as unknown as Question["choices"],
  correctAnswer: `${id}-0`, explanation, sourceUrl: sources[source], reviewedAt: "2026-11-10",
}));
