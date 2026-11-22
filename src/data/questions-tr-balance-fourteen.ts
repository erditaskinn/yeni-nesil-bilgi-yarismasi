import type { Difficulty } from "../lib/config";
import type { GameCategory } from "../lib/categories";
import type { Question } from "../lib/types";

const sources = {
  shakespeare: "https://www.rsc.org.uk/shakespeares-plays/tragedies-comedies-histories",
  birthplace: "https://www.shakespeare.org.uk/visit/shakespeares-birthplace/",
  austen: "https://janeaustens.house/jane-austen/novels/",
  sense: "https://janeaustens.house/jane-austen/novels/sense-and-sensibility/",
  pride: "https://janeaustens.house/jane-austen/novels/pride-and-prejudice/",
  cervantes: "https://cvc.cervantes.es/literatura/clasicos/quijote/default.htm",
  punctuation: "https://tdk.gov.tr/icerik/yazim-kurallari/noktalama-isaretleri-aciklamalar/",
} as const;

type Category = Exclude<GameCategory, "mixed">;
type Row = readonly [string, Difficulty, Category, string, readonly [string, string, string, string], string, keyof typeof sources];

const rows: readonly Row[] = [
  ["traa001", "easy", "language_literature", "Hamlet oyununu yazan kişi kimdir?", ["William Shakespeare", "Charles Dickens", "Miguel de Cervantes", "Jane Austen"], "Royal Shakespeare Company, Hamlet'i Shakespeare'in oyunları arasında listeler.", "shakespeare"],
  ["traa002", "medium", "language_literature", "Shakespeare'in Hamlet oyunu hangi türde sınıflandırılır?", ["Trajedi", "Komedi", "Masal", "Destan"], "Royal Shakespeare Company, Hamlet'i trajediler arasında listeler.", "shakespeare"],
  ["traa003", "medium", "language_literature", "Bir Yaz Gecesi Rüyası, Shakespeare'in hangi türde oyunudur?", ["Komedi", "Trajedi", "Tarih oyunu", "Belgesel"], "Royal Shakespeare Company, A Midsummer Night's Dream'i komediler arasında listeler.", "shakespeare"],
  ["traa004", "medium", "language_literature", "V. Henry, Shakespeare'in hangi türde oyunları arasında sayılır?", ["Tarih oyunları", "Komediler", "Masallar", "Soneler"], "Royal Shakespeare Company, Henry V'i tarih oyunları altında listeler.", "shakespeare"],
  ["traa005", "hard", "language_literature", "Shakespeare oyunlarının İlk Folyo derlemesi hangi yılda yayımlandı?", ["1623", "1492", "1711", "1813"], "Royal Shakespeare Company, İlk Folyo'nun 1623'te yayımlandığını belirtir.", "shakespeare"],
  ["traa006", "hard", "language_literature", "Shakespeare'in 1623 İlk Folyo derlemesinde kaç oyun vardı?", ["36", "12", "24", "50"], "Royal Shakespeare Company, İlk Folyo'da 36 oyun bulunduğunu açıklar.", "shakespeare"],
  ["traa007", "easy", "language_literature", "Shakespeare hangi İngiliz kasabasında doğdu?", ["Stratford-upon-Avon", "Oxford", "York", "Canterbury"], "Shakespeare Birthplace Trust, doğum evini Stratford-upon-Avon'da tanıtır.", "birthplace"],
  ["traa008", "hard", "language_literature", "Shakespeare'in babası John Shakespeare hangi zanaatla uğraşıyordu?", ["Eldiven yapımı", "Saatçilik", "Ayakkabıcılık", "Matbaacılık"], "Shakespeare Birthplace Trust, John Shakespeare'in eldiven yapımcısı olduğunu anlatır.", "birthplace"],
  ["traa009", "easy", "language_literature", "Gurur ve Önyargı romanının yazarı kimdir?", ["Jane Austen", "Mary Shelley", "Virginia Woolf", "George Eliot"], "Jane Austen's House, Pride and Prejudice'ı Austen'ın romanları arasında listeler.", "austen"],
  ["traa010", "medium", "language_literature", "Gurur ve Önyargı romanının başkahramanı hangi Bennet kardeştir?", ["Elizabeth", "Lydia", "Mary", "Kitty"], "Jane Austen's House, romanın kahramanını Elizabeth Bennet olarak tanımlar.", "pride"],
  ["traa011", "medium", "language_literature", "Gurur ve Önyargı'da Elizabeth Bennet'in evlendiği kişi kimdir?", ["Mr Darcy", "Mr Collins", "Mr Wickham", "Mr Bingley"], "Jane Austen's House, Elizabeth'in Mr Darcy ile evlendiğini belirtir.", "pride"],
  ["traa012", "hard", "language_literature", "Gurur ve Önyargı romanının ilk taslak adı neydi?", ["First Impressions", "Emma", "Northanger Abbey", "Persuasion"], "Jane Austen's House, romanın önce First Impressions adıyla tasarlandığını anlatır.", "pride"],
  ["traa013", "medium", "language_literature", "Jane Austen'ın ilk yayımlanan romanı hangisidir?", ["Sense and Sensibility", "Emma", "Persuasion", "Mansfield Park"], "Jane Austen's House, Sense and Sensibility'yi ilk yayımlanan romanı olarak tanımlar.", "sense"],
  ["traa014", "hard", "language_literature", "Sense and Sensibility'deki iki kız kardeşin adları hangileridir?", ["Elinor ve Marianne", "Elizabeth ve Jane", "Emma ve Harriet", "Catherine ve Isabella"], "Jane Austen's House, romanın Elinor ve Marianne Dashwood'u anlattığını belirtir.", "sense"],
  ["traa015", "hard", "language_literature", "Sense and Sensibility hangi yılda yayımlandı?", ["1811", "1701", "1851", "1911"], "Jane Austen's House, romanın 1811'de yayımlandığını kaydeder.", "sense"],
  ["traa016", "hard", "language_literature", "Gurur ve Önyargı hangi yılda yayımlandı?", ["1813", "1763", "1863", "1913"], "Jane Austen's House, romanın Ocak 1813'te yayımlandığını belirtir.", "pride"],
  ["traa017", "easy", "language_literature", "Don Kişot'un yazarı kimdir?", ["Miguel de Cervantes", "William Shakespeare", "Jane Austen", "Victor Hugo"], "Instituto Cervantes, Don Quijote'nin yazarı olarak Miguel de Cervantes'i gösterir.", "cervantes"],
  ["traa018", "medium", "language_literature", "Don Kişot eseri aslen hangi dilde yazıldı?", ["İspanyolca", "Fransızca", "İtalyanca", "Latince"], "Instituto Cervantes'in eserin İspanyolca asıl metnini sunduğu kayıt Don Quijote'yi Cervantes'e atfeder.", "cervantes"],
  ["traa019", "medium", "language_literature", "TDK'ye göre bir cümlede eksik bırakılan sözü belirtmek için hangi işaret kullanılır?", ["Üç nokta", "Noktalı virgül", "İki nokta", "Kısa çizgi"], "TDK, tamamlanmamış cümlelerin sonunda üç nokta kullanıldığını açıklar.", "punctuation"],
  ["traa020", "medium", "language_literature", "TDK'ye göre ögeleri virgül içeren sıralı cümleleri ayırmada hangi işaret kullanılır?", ["Noktalı virgül", "Üç nokta", "Soru işareti", "Kesme işareti"], "TDK, ögelerinde virgül olan sıralı cümleleri noktalı virgülle ayırır.", "punctuation"],
];

export const turkishBalanceFourteen: readonly Question[] = rows.map(([id, difficulty, category, question, options, explanation, source]) => ({
  id, difficulty, category, question,
  choices: options.map((text, index) => ({ id: `${id}-${index}`, text })) as unknown as Question["choices"],
  correctAnswer: `${id}-0`, explanation, sourceUrl: sources[source], reviewedAt: "2026-11-10",
}));
