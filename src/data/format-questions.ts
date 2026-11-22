import type { Question } from "../lib/types";

const nasa = "https://science.nasa.gov/solar-system/solar-system-facts/";
const gold = "https://periodic-table.rsc.org/element/79/gold";
const nasaHistory = "https://www.nasa.gov/history/explore-nasas-history/";
const reviewedAt = "2026-10-12";
const moonSource = "https://science.nasa.gov/resource/view-of-portion-of-relatively-fresh-crater-as-photographed-by-apollo-15/";
const mapSource = "https://www.naturalearthdata.com/downloads/50m-raster-data/50m-natural-earth-1/";
const moonMedia = { src: "/questions/moon.webp", alt: "Ay yüzeyinde kayalık zemin ve çukur bir oluşum.", width: 1000, height: 988, credit: "NASA/JSC", licenseUrl: "https://www.nasa.gov/nasa-brand-center/images-and-media/" };
const worldMap = { src: "/questions/map.webp", credit: "Natural Earth", licenseUrl: "https://www.naturalearthdata.com/about/terms-of-use/" };
const mapRegionsTurkish = [
  { id: "a", label: "A noktası", x: 294, y: 137, path: "M294 137" },
  { id: "b", label: "B noktası", x: 506, y: 114, path: "M506 114" },
  { id: "c", label: "C noktası", x: 888, y: 151, path: "M888 151" },
] as const;
const mapRegionsEnglish = mapRegionsTurkish.map((region, index) => ({ ...region, label: `Point ${String.fromCharCode(65 + index)}` }));

export const formatQuestionsTurkish: readonly Question[] = [
  {
    id: "fmt007", difficulty: "easy", category: "space",
    question: "Apollo 15 fotoğrafındaki belirgin yüzey oluşumu hangisidir?",
    choices: [{ id: "crater", text: "Krater" }, { id: "delta", text: "Nehir deltası" }, { id: "glacier", text: "Buzul" }],
    correctAnswer: "crater", image: moonMedia, format: { type: "image_question", media: moonMedia },
    explanation: "NASA, Apollo 15'in bu Ay yüzeyi fotoğrafını bir krater görüntüsü olarak tanımlar.",
    sourceUrl: moonSource, reviewedAt,
  },
  {
    id: "fmt008", difficulty: "easy", category: "geography",
    question: "Haritada Japonya'ya en yakın işaretli noktayı seç.",
    choices: [{ id: "a", text: "A noktası" }, { id: "b", text: "B noktası" }, { id: "c", text: "C noktası" }],
    correctAnswer: "c", format: { type: "map_selection", viewBox: "0 0 1000 500", media: worldMap, regions: mapRegionsTurkish },
    explanation: "C noktası Doğu Asya'da Japonya yakınındadır; A Kuzey Amerika, B Batı Avrupa yakınındadır.",
    sourceUrl: mapSource, reviewedAt,
  },
  {
    id: "fmt001", difficulty: "easy", category: "space",
    question: "Merkür ve Venüs'ün doğal uydusu yoktur.",
    choices: [{ id: "true", text: "Doğru" }, { id: "false", text: "Yanlış" }],
    correctAnswer: "true", format: { type: "true_false" },
    explanation: "NASA'ya göre sekiz gezegen arasında yalnızca Merkür ve Venüs'ün doğal uydusu yoktur.",
    sourceUrl: nasa, reviewedAt,
  },
  {
    id: "fmt002", difficulty: "easy", category: "space",
    question: "Hangisi diğerlerinden farklıdır: karasal gezegen olmayanı seç.",
    choices: [{ id: "jupiter", text: "Jüpiter" }, { id: "mercury", text: "Merkür" }, { id: "venus", text: "Venüs" }, { id: "mars", text: "Mars" }],
    correctAnswer: "jupiter", format: { type: "odd_one_out", commonFeature: "Diğer üçü karasal gezegendir.", difference: "Jüpiter bir gaz devidir." },
    explanation: "Merkür, Venüs ve Mars kayalık yüzeyli karasal gezegenlerdir; Jüpiter ise gaz devidir.",
    sourceUrl: nasa, reviewedAt,
  },
  {
    id: "fmt003", difficulty: "easy", category: "space",
    question: "Güneş'e en yakın dört gezegen Merkür, ___, Dünya ve Mars'tır. Eksik olanı seç.",
    choices: [{ id: "venus", text: "Venüs" }, { id: "jupiter", text: "Jüpiter" }, { id: "saturn", text: "Satürn" }],
    correctAnswer: "venus", format: { type: "fill_in_blank", mode: "choices", completedText: "Güneş'e en yakın dört gezegen Merkür, Venüs, Dünya ve Mars'tır." },
    explanation: "NASA, Güneş'e en yakın dört gezegeni Merkür, Venüs, Dünya ve Mars olarak sıralar.",
    sourceUrl: nasa, reviewedAt,
  },
  {
    id: "fmt004", difficulty: "easy", category: "science_nature",
    question: "Altının kimyasal simgesini kısa cevap olarak yaz.",
    choices: [{ id: "Au", text: "Au" }, { id: "Ag", text: "Ag" }],
    correctAnswer: "Au", format: { type: "fill_in_blank", mode: "text", acceptedAnswers: ["Au"], completedText: "Altının kimyasal simgesi Au'dur." },
    explanation: "Royal Society of Chemistry'nin periyodik tablosunda altın, Au simgesiyle gösterilir.",
    sourceUrl: gold, reviewedAt,
  },
  {
    id: "fmt005", difficulty: "easy", category: "space",
    question: "Uzay tarihindeki bu olayları eskiden yeniye sırala.",
    choices: [{ id: "apollo", text: "Apollo 11 Ay'a indi" }, { id: "sputnik", text: "Sputnik 1 fırlatıldı" }],
    correctAnswer: "sputnik,apollo,hubble",
    format: { type: "chronological_order", events: [
      { id: "apollo", text: "Apollo 11 Ay'a indi", date: "1969" },
      { id: "hubble", text: "Hubble Uzay Teleskobu fırlatıldı", date: "1990" },
      { id: "sputnik", text: "Sputnik 1 fırlatıldı", date: "1957" },
    ], order: ["sputnik", "apollo", "hubble"] },
    explanation: "NASA'nın tarih özetinde Sputnik 1'in 1957'de, Apollo 11'in 1969'da ve Hubble'ın 1990'da gerçekleştiği belirtilir.",
    sourceUrl: nasaHistory, reviewedAt,
  },
  {
    id: "fmt006", difficulty: "easy", category: "space",
    question: "İç gezegenleri Güneş'e yakınlık sırasıyla eşleştir.",
    choices: [{ id: "mercury", text: "Merkür" }, { id: "venus", text: "Venüs" }],
    correctAnswer: "mercury:1,venus:2,earth:3,mars:4",
    format: { type: "matching", left: [
      { id: "mercury", text: "Merkür" }, { id: "venus", text: "Venüs" },
      { id: "earth", text: "Dünya" }, { id: "mars", text: "Mars" },
    ], right: [
      { id: "3", text: "3. gezegen" }, { id: "1", text: "1. gezegen" },
      { id: "4", text: "4. gezegen" }, { id: "2", text: "2. gezegen" },
    ], pairs: { mercury: "1", venus: "2", earth: "3", mars: "4" } },
    explanation: "NASA'ya göre Güneş'e en yakın dört gezegen sırasıyla Merkür, Venüs, Dünya ve Mars'tır.",
    sourceUrl: nasa, reviewedAt,
  },
];

export const formatQuestionsEnglish: readonly Question[] = [
  {
    id: "fmt007", difficulty: "easy", category: "space",
    question: "What prominent surface feature appears in this Apollo 15 photograph?",
    choices: [{ id: "crater", text: "Crater" }, { id: "delta", text: "River delta" }, { id: "glacier", text: "Glacier" }],
    correctAnswer: "crater", image: { ...moonMedia, alt: "Rocky lunar surface with a sunken formation." }, format: { type: "image_question", media: moonMedia },
    explanation: "NASA identifies this Apollo 15 photograph of the lunar surface as a view of a crater.",
    sourceUrl: moonSource, reviewedAt,
  },
  {
    id: "fmt008", difficulty: "easy", category: "geography",
    question: "Select the marked point closest to Japan on the map.",
    choices: [{ id: "a", text: "Point A" }, { id: "b", text: "Point B" }, { id: "c", text: "Point C" }],
    correctAnswer: "c", format: { type: "map_selection", viewBox: "0 0 1000 500", media: worldMap, regions: mapRegionsEnglish },
    explanation: "Point C is near Japan in East Asia; A is near North America and B near Western Europe.",
    sourceUrl: mapSource, reviewedAt,
  },
  {
    id: "fmt001", difficulty: "easy", category: "space",
    question: "Mercury and Venus have no natural moons.",
    choices: [{ id: "true", text: "True" }, { id: "false", text: "False" }],
    correctAnswer: "true", format: { type: "true_false" },
    explanation: "According to NASA, Mercury and Venus are the only two planets without natural moons.",
    sourceUrl: nasa, reviewedAt,
  },
  {
    id: "fmt002", difficulty: "easy", category: "space",
    question: "Which one is different: select the planet that is not terrestrial.",
    choices: [{ id: "jupiter", text: "Jupiter" }, { id: "mercury", text: "Mercury" }, { id: "venus", text: "Venus" }, { id: "mars", text: "Mars" }],
    correctAnswer: "jupiter", format: { type: "odd_one_out", commonFeature: "The other three are terrestrial planets.", difference: "Jupiter is a gas giant." },
    explanation: "Mercury, Venus and Mars are rocky terrestrial planets; Jupiter is a gas giant.",
    sourceUrl: nasa, reviewedAt,
  },
  {
    id: "fmt003", difficulty: "easy", category: "space",
    question: "The four planets closest to the Sun are Mercury, ___, Earth and Mars. Choose the missing planet.",
    choices: [{ id: "venus", text: "Venus" }, { id: "jupiter", text: "Jupiter" }, { id: "saturn", text: "Saturn" }],
    correctAnswer: "venus", format: { type: "fill_in_blank", mode: "choices", completedText: "The four planets closest to the Sun are Mercury, Venus, Earth and Mars." },
    explanation: "NASA lists Mercury, Venus, Earth and Mars as the first four planets from the Sun.",
    sourceUrl: nasa, reviewedAt,
  },
  {
    id: "fmt004", difficulty: "easy", category: "science_nature",
    question: "Type the chemical symbol for gold.",
    choices: [{ id: "Au", text: "Au" }, { id: "Ag", text: "Ag" }],
    correctAnswer: "Au", format: { type: "fill_in_blank", mode: "text", acceptedAnswers: ["Au"], completedText: "The chemical symbol for gold is Au." },
    explanation: "The Royal Society of Chemistry lists Au as the symbol for gold.",
    sourceUrl: gold, reviewedAt,
  },
  {
    id: "fmt005", difficulty: "easy", category: "space",
    question: "Arrange these space-history events from oldest to newest.",
    choices: [{ id: "apollo", text: "Apollo 11 landed on the Moon" }, { id: "sputnik", text: "Sputnik 1 launched" }],
    correctAnswer: "sputnik,apollo,hubble",
    format: { type: "chronological_order", events: [
      { id: "apollo", text: "Apollo 11 landed on the Moon", date: "1969" },
      { id: "hubble", text: "Hubble Space Telescope launched", date: "1990" },
      { id: "sputnik", text: "Sputnik 1 launched", date: "1957" },
    ], order: ["sputnik", "apollo", "hubble"] },
    explanation: "NASA's history overview places Sputnik 1 in 1957, Apollo 11 in 1969 and Hubble's launch in 1990.",
    sourceUrl: nasaHistory, reviewedAt,
  },
  {
    id: "fmt006", difficulty: "easy", category: "space",
    question: "Match the inner planets to their order from the Sun.",
    choices: [{ id: "mercury", text: "Mercury" }, { id: "venus", text: "Venus" }],
    correctAnswer: "mercury:1,venus:2,earth:3,mars:4",
    format: { type: "matching", left: [
      { id: "mercury", text: "Mercury" }, { id: "venus", text: "Venus" },
      { id: "earth", text: "Earth" }, { id: "mars", text: "Mars" },
    ], right: [
      { id: "3", text: "3rd planet" }, { id: "1", text: "1st planet" },
      { id: "4", text: "4th planet" }, { id: "2", text: "2nd planet" },
    ], pairs: { mercury: "1", venus: "2", earth: "3", mars: "4" } },
    explanation: "NASA lists Mercury, Venus, Earth and Mars as the four planets closest to the Sun, in that order.",
    sourceUrl: nasa, reviewedAt,
  },
];
