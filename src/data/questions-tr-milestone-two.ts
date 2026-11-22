import type { Difficulty } from "../lib/config";
import type { GameCategory } from "../lib/categories";
import type { Question } from "../lib/types";

const sources = {
  field: "https://www.theifab.com/laws/latest/the-field-of-play/",
  players: "https://www.theifab.com/laws/latest/the-players/",
  baikal: "https://www.usgs.gov/media/images/lake-baikal-space-largest-oldest-and-deepest-lake",
  baikalRift: "https://pubs.usgs.gov/fs/baikal/",
  machu: "https://whc.unesco.org/en/list/274",
  memphis: "https://whc.unesco.org/en/list/86/",
  taj: "https://whc.unesco.org/en/list/252",
  pamukkale: "https://whc.unesco.org/en/list/485",
} as const;

function q(
  id: string, difficulty: Difficulty, category: Exclude<GameCategory, "mixed">,
  question: string, options: [string, string, string, string],
  explanation: string, source: keyof typeof sources,
): Question {
  return {
    id, difficulty, category, question,
    choices: [
      { id: `${id}-0`, text: options[0] },
      { id: `${id}-1`, text: options[1] },
      { id: `${id}-2`, text: options[2] },
      { id: `${id}-3`, text: options[3] },
    ],
    correctAnswer: `${id}-0`, explanation, sourceUrl: sources[source], reviewedAt: "2026-10-14",
  };
}

export const turkishMilestoneTwo: readonly Question[] = [
  q("tre001", "easy", "sports", "Futbolda bir takım sahaya en fazla kaç oyuncuyla çıkar?",
    ["11", "9", "12", "15"], "IFAB kurallarında bir takım en çok 11 oyuncudan oluşur; biri kalecidir.", "players"),
  q("tre002", "medium", "sports", "IFAB kurallarına göre bir futbol maçı takım başına kaç oyuncunun altına düşerse başlayamaz veya sürdürülemez?",
    ["7", "5", "8", "10"], "IFAB, takımlardan biri yediden az oyuncuya sahip olduğunda maçın başlayamayacağını veya süremeyeceğini belirtir.", "players"),
  q("tre003", "medium", "sports", "Futbolda penaltı noktası kale çizgisinin orta noktasından kaç metre uzaktadır?",
    ["11", "9,15", "16,5", "5,5"], "IFAB oyun alanı kuralında penaltı noktası kale direkleri arasındaki orta noktadan 11 metre uzaklıktadır.", "field"),
  q("tre004", "hard", "sports", "Uluslararası futbol maçlarında taç çizgisi uzunluğu en az kaç metredir?",
    ["100", "90", "110", "120"], "IFAB uluslararası maçlar için taç çizgisi uzunluğunun en az 100 metre olmasını şart koşar.", "field"),
  q("tre005", "hard", "sports", "Uluslararası futbol maçlarında kale çizgisi uzunluğu en fazla kaç metredir?",
    ["75", "64", "90", "110"], "IFAB uluslararası maçlarda kale çizgisi uzunluğunun 64-75 metre aralığında olmasını ister.", "field"),
  q("tre006", "expert", "sports", "Futbolda kale alanının sınır çizgileri kale direklerinin içinden kaç metre uzaklıkta başlar?",
    ["5,5", "7,32", "11", "16,5"], "IFAB'a göre kale alanının yan çizgileri direklerin iç tarafından 5,5 metre uzakta çizilir.", "field"),
  q("tre007", "easy", "geography", "Dünyanın en derin tatlı su gölü hangisidir?",
    ["Baykal Gölü", "Van Gölü", "Victoria Gölü", "Hazar Denizi"], "USGS, Baykal'ı dünyanın en derin tatlı su gölü olarak tanımlar.", "baikal"),
  q("tre008", "medium", "geography", "Baykal Gölü hangi bölgede yer alır?",
    ["Güneydoğu Sibirya", "Batı Avrupa", "Güney Afrika", "Kuzey Avustralya"], "USGS, Baykal'ı Moğolistan sınırının kuzeyinde, güneydoğu Sibirya'da konumlandırır.", "baikal"),
  q("tre009", "hard", "geography", "USGS'ye göre Baykal Gölü'nün tahmini yaşı hangi seçeneğe en yakındır?",
    ["25 milyon yıldan fazla", "10 bin yıl", "100 bin yıl", "1 milyon yıl"], "USGS Baykal'ın 25 milyon yıldan daha yaşlı olabileceğini belirtir.", "baikalRift"),
  q("tre010", "medium", "geography", "Machu Picchu, UNESCO'ya göre hangi iki coğrafi bölgenin buluştuğu alandadır?",
    ["Peru Andları ve Amazon Havzası", "Alpler ve Po Ovası", "Himalayalar ve Ganj Deltası", "Atlas Dağları ve Sahra"], "UNESCO Machu Picchu'yu Peru Andları ile Amazon Havzası'nın buluştuğu peyzajda tanımlar.", "machu"),
  q("tre011", "medium", "geography", "USGS'ye göre Baykal Gölü, Dünya yüzeyindeki tatlı suyun yaklaşık yüzde kaçını barındırır?",
    ["20", "2", "50", "80"], "USGS, Baykal'daki suyun Dünya yüzeyindeki tatlı suyun yaklaşık yüzde 20'si olduğunu belirtir.", "baikal"),
  q("tre012", "medium", "history", "Hierapolis'in antik kaplıca yerleşimini hangi hanedan kurdu?",
    ["Pergamon Attalosları", "Osmanlılar", "Ptolemaioslar", "Sasaniler"], "UNESCO, Hierapolis kaplıca yerleşiminin Pergamon'un Attalos hanedanınca kurulduğunu kaydeder.", "pamukkale"),
  q("tre013", "medium", "history", "Antik Mısır'ın başkenti Memphis'in nekropolü hangi piramit alanına kadar uzanır?",
    ["Dahşur", "Petra", "Palmira", "Persepolis"], "UNESCO, Memphis nekropolünü Gize'den güneyde Dahşur'a uzanan piramit alanı olarak kaydeder.", "memphis"),
  q("tre014", "hard", "history", "UNESCO'ya göre Mısır'daki ünlü basamaklı piramit hangi hükümdara aittir?",
    ["Coser", "Tutankhamon", "Ramses II", "Akhenaton"], "UNESCO, Sakkara'daki kireçtaşı basamaklı piramidi Coser'e (Djoser) atfeder.", "memphis"),
  q("tre015", "medium", "history", "Tac Mahal hangi hükümdarın emriyle inşa edildi?",
    ["Şah Cihan", "Ekber Şah", "Babür Şah", "Evrengzib"], "UNESCO, Tac Mahal'in Babür hükümdarı Şah Cihan'ın emriyle yaptırıldığını belirtir.", "taj"),
  q("tre016", "hard", "history", "UNESCO'ya göre Tac Mahal hangi kişi anısına yaptırıldı?",
    ["Mümtaz Mahal", "Nur Cihan", "Cihanara Begüm", "Raziye Sultan"], "UNESCO, Şah Cihan'ın yapıyı eşi Mümtaz Mahal'in anısına yaptırdığını kaydeder.", "taj"),
  q("tre017", "medium", "arts_culture", "Tac Mahal'in ana platformunun köşelerinde kaç bağımsız minare bulunur?",
    ["4", "2", "6", "8"], "UNESCO, ana platformun dört köşesinde dört bağımsız minare bulunduğunu belirtir.", "taj"),
  q("tre018", "hard", "arts_culture", "UNESCO'ya göre Tac Mahal'in ana mimarı kimdi?",
    ["Üstad Ahmed Lahori", "Mimar Sinan", "Antoni Gaudí", "Andrea Palladio"], "UNESCO'nun alan tanımında ana mimar Üstad Ahmed Lahori olarak belirtilir.", "taj"),
  q("tre019", "hard", "arts_culture", "Tac Mahal'in bahçesi ana yürüyüş yollarıyla kaç ana bölüme ayrılır?",
    ["4", "2", "6", "8"], "UNESCO, Tac Mahal'in bahçesinin ana yollarla dört bölüme ayrıldığını açıklar.", "taj"),
  q("tre020", "expert", "arts_culture", "Tac Mahal'de Mümtaz Mahal ile Şah Cihan'ın gerçek mezarları yapının neresindedir?",
    ["Alt mezar odasında", "Ana kubbenin üzerinde", "Giriş kapısının yanında", "Bahçenin ortasında"], "UNESCO, üst odadaki lahitlerin temsili olduğunu; gerçek mezarların alt mezar odasında bulunduğunu belirtir.", "taj"),
];
