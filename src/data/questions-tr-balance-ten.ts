import type { Difficulty } from "../lib/config";
import type { GameCategory } from "../lib/categories";
import type { Question } from "../lib/types";

const sources = {
  kilimanjaro: "https://whc.unesco.org/en/list/403/",
  victoria: "https://whc.unesco.org/en/list/509",
  halong: "https://whc.unesco.org/en/list/672/",
  malawi: "https://whc.unesco.org/en/list/289",
  glossary: "https://water.usgs.gov/water-basics_glossary.html",
} as const;

type Category = Exclude<GameCategory, "mixed">;
type Row = readonly [string, Difficulty, Category, string, readonly [string, string, string, string], string, keyof typeof sources];

const rows: readonly Row[] = [
  ["trw001", "easy", "geography", "Kilimanjaro Dağı hangi Afrika ülkesindedir?", ["Tanzanya", "Kenya", "Mısır", "Fas"], "UNESCO, Kilimanjaro Milli Parkı'nı Tanzanya'da listeler.", "kilimanjaro"],
  ["trw002", "medium", "geography", "Kilimanjaro Dağı Afrika'nın hangi rekorunu taşır?", ["En yüksek noktasıdır", "En büyük gölüdür", "En uzun nehridir", "En derin çukurudur"], "UNESCO, 5.895 metrelik Kilimanjaro'yu Afrika'nın en yüksek noktası olarak tanımlar.", "kilimanjaro"],
  ["trw003", "medium", "geography", "Kilimanjaro'nun yüksekliği yaklaşık kaç metredir?", ["5.895", "2.500", "4.100", "8.848"], "UNESCO, Kilimanjaro'nun yüksekliğini 5.895 metre olarak verir.", "kilimanjaro"],
  ["trw004", "hard", "geography", "Kilimanjaro'nun üç ana volkanik zirvesinden biri hangisidir?", ["Kibo", "Everest", "Fuji", "Denali"], "UNESCO, Kibo, Mawenzi ve Shira'yı Kilimanjaro'nun üç ana volkanik zirvesi olarak sayar.", "kilimanjaro"],
  ["trw005", "medium", "geography", "Kilimanjaro'nun karla kaplı zirvesi hangi doğal yapının üstündedir?", ["Volkanik kütle", "Mercan adası", "Buzdağı", "Kumul"], "UNESCO, Kilimanjaro'yu volkanik kütle olarak tanımlar.", "kilimanjaro"],
  ["trw006", "easy", "geography", "Victoria Şelaleleri hangi iki ülkenin sınırındadır?", ["Zambiya ve Zimbabve", "Kenya ve Uganda", "Mısır ve Sudan", "Fas ve Cezayir"], "UNESCO, şelale alanını Zambiya ile Zimbabve arasında sınır aşan alan olarak listeler.", "victoria"],
  ["trw007", "medium", "geography", "Victoria Şelaleleri hangi nehrin üzerindedir?", ["Zambezi", "Nil", "Kongo", "Nijer"], "UNESCO, Victoria Şelaleleri'nin Zambezi Nehri üzerinde olduğunu açıklar.", "victoria"],
  ["trw008", "medium", "geography", "Victoria Şelaleleri'nin yerel adlarından biri hangisidir?", ["Mosi-oa-Tunya", "Iguazú", "Angel Falls", "Niagara"], "UNESCO, alanı Mosi-oa-Tunya/Victoria Falls adıyla listeler.", "victoria"],
  ["trw009", "hard", "geography", "Victoria Şelaleleri'nin döküldüğü vadiler hangi kaya türü içindedir?", ["Bazalt", "Mermer", "Kömür", "Tebeşir"], "UNESCO, Zambezi'nin şelalede bazalt boğazlardan aşağı döküldüğünü anlatır.", "victoria"],
  ["trw010", "easy", "geography", "Ha Long Körfezi hangi ülkededir?", ["Vietnam", "Tayland", "Japonya", "Hindistan"], "UNESCO, Ha Long Körfezi-Cat Ba alanını Vietnam'da listeler.", "halong"],
  ["trw011", "medium", "geography", "Ha Long Körfezi'nde denizden yükselen adalar ağırlıkla hangi kayaçtan oluşur?", ["Kireç taşı", "Granit", "Bazalt", "Kum taşı"], "UNESCO, Ha Long-Cat Ba alanını çok sayıda kireç taşı adasıyla tanımlar.", "halong"],
  ["trw012", "hard", "geography", "Ha Long Körfezi-Cat Ba Takımadaları Vietnam'ın hangi bölümündedir?", ["Kuzeydoğusunda", "Güneybatısında", "Ortasında", "Güneyinde"], "UNESCO, alanın Vietnam'ın kuzeydoğusunda bulunduğunu belirtir.", "halong"],
  ["trw013", "hard", "geography", "Ha Long Körfezi-Cat Ba UNESCO alanı yaklaşık kaç ada ve adacık içerir?", ["1.133", "120", "420", "5.000"], "UNESCO, alanın 1.133 ada ve adacık içerdiğini açıklar.", "halong"],
  ["trw014", "easy", "geography", "Malavi Gölü Milli Parkı hangi kıtadadır?", ["Afrika", "Avrupa", "Asya", "Güney Amerika"], "UNESCO, Malavi Gölü Milli Parkı'nı Afrika'daki Malavi'de listeler.", "malawi"],
  ["trw015", "medium", "geography", "Malavi Gölü Milli Parkı hangi yer şekli boyunca yer alır?", ["Batı Rift Vadisi", "And Dağları", "Himalayalar", "Alpler"], "UNESCO, Malavi Gölü'nün Batı Rift Vadisi içinde olduğunu belirtir.", "malawi"],
  ["trw016", "medium", "geography", "Malavi Gölü Milli Parkı özellikle hangi canlı çeşitliliğiyle tanınır?", ["Balıklar", "Penguenler", "Develer", "Kutup ayıları"], "UNESCO, parkın yüzlerce balık türüne ev sahipliği yaptığını belirtir.", "malawi"],
  ["trw017", "medium", "geography", "USGS'ye göre bir akarsuyun taşıdığı tortunun denize döküldüğü yerde birikmesiyle oluşan yer şekli nedir?", ["Delta", "Fiyort", "Volkan", "Vadi"], "USGS, deltayı akarsu ağzında tortu birikmesiyle oluşan alçak alan olarak tanımlar.", "glossary"],
  ["trw018", "medium", "geography", "Bir akarsuya su taşıyan çevre alanın tamamına ne denir?", ["Havza", "Ada", "Koy", "Boğaz"], "USGS, havzayı belirli bir akarsuya veya göle suyun aktığı kara alanı olarak tanımlar.", "glossary"],
  ["trw019", "medium", "geography", "USGS'ye göre yer altına sızan suyun yeryüzüne çıktığı doğal noktaya ne denir?", ["Kaynak", "Delta", "Kumul", "Fiyort"], "USGS su sözlüğünde kaynak, yer altı suyunun yüzeye çıktığı yer olarak açıklanır.", "glossary"],
  ["trw020", "medium", "geography", "Akarsuyun denize veya göle ulaştığı son bölümüne ne denir?", ["Akarsu ağzı", "Su bölümü çizgisi", "Dağ geçidi", "Buzul dili"], "USGS su sözlüğü akarsu ağzını akarsuyun başka bir su kütlesine ulaştığı yer olarak tanımlar.", "glossary"],
];

export const turkishBalanceTen: readonly Question[] = rows.map(([id, difficulty, category, question, options, explanation, source]) => ({
  id, difficulty, category, question,
  choices: options.map((text, index) => ({ id: `${id}-${index}`, text })) as unknown as Question["choices"],
  correctAnswer: `${id}-0`, explanation, sourceUrl: sources[source], reviewedAt: "2026-11-10",
}));
