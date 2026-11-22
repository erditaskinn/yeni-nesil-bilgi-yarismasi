import type { Difficulty } from "../lib/config";
import type { GameCategory } from "../lib/categories";
import type { Question } from "../lib/types";

const sources = {
  sait: "https://www.ktb.gov.tr/EN-118042/abasiyanik-sait-faik.html",
  garip: "https://ekitap.ktb.gov.tr/TR-80328/garip-hareketi.html",
  sabahattin: "https://www.ktb.gov.tr/EN-119659/sabahattin-ali.html",
  halide: "https://www.ktb.gov.tr/EN-118055/adivar-halide-edip.html",
  yasarkemal: "https://ekitap.ktb.gov.tr/TR-80341/toplumcu-gercekci-yazarlar-koy-roman-ve-hikayesi.html",
  resat: "https://ekitap.ktb.gov.tr/TR-80337/memleket-roman-ve-hikayesi.html",
} as const;

type Category = Exclude<GameCategory, "mixed">;
type Row = readonly [string, Difficulty, Category, string, readonly [string, string, string, string], string, keyof typeof sources];

const rows: readonly Row[] = [
  ["trab001", "easy", "language_literature", "Semaver adlı öykü kitabının yazarı kimdir?", ["Sait Faik Abasıyanık", "Orhan Veli Kanık", "Sabahattin Ali", "Reşat Nuri Güntekin"], "Kültür ve Turizm Bakanlığı, Semaver'i Sait Faik'in öyküleri arasında listeler.", "sait"],
  ["trab002", "medium", "language_literature", "Sait Faik'in 1952 tarihli öykü kitabı hangisidir?", ["Havuz Başı", "Garip", "Kuyucaklı Yusuf", "Çalıkuşu"], "Bakanlığın Sait Faik bibliyografyasında Havuz Başı 1952 yılıyla listelenir.", "sait"],
  ["trab003", "medium", "language_literature", "Sait Faik'in 1954 tarihli öykü kitabı hangisidir?", ["Alemdağda Var Bir Yılan", "İnce Memed", "Sinekli Bakkal", "Ateşten Gömlek"], "Bakanlık, Alemdağda Var Bir Yılan'ı Sait Faik'in 1954 kitabı olarak kaydeder.", "sait"],
  ["trab004", "hard", "language_literature", "Sait Faik Abasıyanık'ın kullandığı takma adlardan biri hangisidir?", ["Adalı", "Garip", "Kuyucaklı", "Çalıkuşu"], "Bakanlık, Sait Faik'in kullandığı takma adlar arasında Adalı'yı sayar.", "sait"],
  ["trab005", "easy", "language_literature", "Orhan Veli'nin öncülerinden olduğu şiir hareketinin adı nedir?", ["Garip", "Servet-i Fünun", "Fecriati", "Beş Hececiler"], "Bakanlık, Orhan Veli'yi Garip hareketinin önde gelen şairi olarak tanıtır.", "garip"],
  ["trab006", "medium", "language_literature", "1941'de Garip adlı ortak şiir kitabını çıkaran üç şairden biri hangisidir?", ["Oktay Rifat", "Sait Faik", "Reşat Nuri", "Sabahattin Ali"], "Bakanlık, Garip kitabının Orhan Veli, Oktay Rifat ve Melih Cevdet tarafından çıkarıldığını belirtir.", "garip"],
  ["trab007", "medium", "language_literature", "Garip şiirinde yalın dile ve konuşma diline yaklaşmasıyla öne çıkan şair kimdir?", ["Orhan Veli Kanık", "Ahmet Haşim", "Tevfik Fikret", "Yahya Kemal"], "Bakanlık, Orhan Veli'nin şiir dilini konuşma diline yaklaştırdığını açıklar.", "garip"],
  ["trab008", "hard", "language_literature", "Garip adlı ortak şiir kitabı hangi yılda yayımlandı?", ["1941", "1923", "1957", "1971"], "Bakanlık, üç şairin Garip kitabını 1941'de yayımladığını belirtir.", "garip"],
  ["trab009", "easy", "language_literature", "Kürk Mantolu Madonna romanının yazarı kimdir?", ["Sabahattin Ali", "Yaşar Kemal", "Halide Edip Adıvar", "Sait Faik"], "Bakanlık, Kürk Mantolu Madonna'yı Sabahattin Ali'nin romanları arasında listeler.", "sabahattin"],
  ["trab010", "medium", "language_literature", "Sabahattin Ali'nin 1937 tarihli romanı hangisidir?", ["Kuyucaklı Yusuf", "İnce Memed", "Çalıkuşu", "Sinekli Bakkal"], "Bakanlığın eser listesinde Kuyucaklı Yusuf 1937 yılıyla gösterilir.", "sabahattin"],
  ["trab011", "medium", "language_literature", "Sabahattin Ali'nin 1940 tarihli romanı hangisidir?", ["İçimizdeki Şeytan", "Semaver", "Garip", "Ateşten Gömlek"], "Bakanlık, İçimizdeki Şeytan romanını 1940 tarihli olarak listeler.", "sabahattin"],
  ["trab012", "hard", "language_literature", "Kürk Mantolu Madonna ilk olarak hangi yılda yayımlandı?", ["1943", "1913", "1933", "1963"], "Bakanlık, romanı Sabahattin Ali'nin 1943 tarihli eseri olarak listeler.", "sabahattin"],
  ["trab013", "easy", "language_literature", "Ateşten Gömlek romanının yazarı kimdir?", ["Halide Edip Adıvar", "Jane Austen", "Sait Faik", "Orhan Veli"], "Bakanlık, Ateşten Gömlek'i Halide Edip'in romanları arasında sayar.", "halide"],
  ["trab014", "medium", "language_literature", "Halide Edip Adıvar'ın Kurtuluş Savaşı'nı konu alan romanlarından biri hangisidir?", ["Vurun Kahpeye", "Emma", "Semaver", "Don Kişot"], "Bakanlık, Vurun Kahpeye'yi Halide Edip'in Kurtuluş Savaşı romanları arasında listeler.", "halide"],
  ["trab015", "medium", "language_literature", "Halide Edip Adıvar'ın 1936 tarihli romanı hangisidir?", ["Sinekli Bakkal", "Kuyucaklı Yusuf", "İnce Memed", "Hamlet"], "Bakanlık, Sinekli Bakkal'ı Halide Edip'in 1936 tarihli romanı olarak tanıtır.", "resat"],
  ["trab016", "easy", "language_literature", "İnce Memed romanının yazarı kimdir?", ["Yaşar Kemal", "Reşat Nuri Güntekin", "Sait Faik", "Sabahattin Ali"], "Bakanlık, İnce Memed'i Yaşar Kemal'in romanı olarak açıklar.", "yasarkemal"],
  ["trab017", "medium", "language_literature", "Yaşar Kemal romanlarında özellikle hangi bölgenin köylü yaşamını işler?", ["Çukurova", "Sibirya", "İskandinavya", "And Dağları"], "Bakanlık, Yaşar Kemal'in Çukurova köylüsünün yaşamını sıkça ele aldığını belirtir.", "yasarkemal"],
  ["trab018", "easy", "language_literature", "Çalıkuşu romanının yazarı kimdir?", ["Reşat Nuri Güntekin", "Halide Edip Adıvar", "Yaşar Kemal", "Orhan Veli"], "Bakanlık, Çalıkuşu'nu Reşat Nuri'nin romanı olarak tanıtır.", "resat"],
  ["trab019", "medium", "language_literature", "Çalıkuşu romanının merkezindeki genç kadın hangi mesleği yapar?", ["Öğretmenlik", "Doktorluk", "Gazetecilik", "Avukatlık"], "Bakanlık, romanın kahramanını Anadolu'ya giderek öğretmenlik yapan genç kadın olarak anlatır.", "resat"],
];

export const turkishBalanceFifteen: readonly Question[] = rows.map(([id, difficulty, category, question, options, explanation, source]) => ({
  id, difficulty, category, question,
  choices: options.map((text, index) => ({ id: `${id}-${index}`, text })) as unknown as Question["choices"],
  correctAnswer: `${id}-0`, explanation, sourceUrl: sources[source], reviewedAt: "2026-11-10",
}));
