import type { Difficulty } from "../lib/config";
import type { GameCategory } from "../lib/categories";
import type { Question } from "../lib/types";

const sources = {
  constellations: "https://www.iau.org/IAU/IAU/Astronomy-FAQs/Constellations.aspx?hkey=bb9dc841-0618-41b5-ac70-149741062141",
  magnitude: "https://www.usgs.gov/programs/earthquake-hazards/earthquake-magnitude-energy-release-and-shaking-intensity",
  grandCanyon: "https://www.nps.gov/grca/learn/nature/grca-geology.htm",
  gutenberg: "https://loc.gov/exhibits/bibles/the-gutenberg-bible.html",
  athens: "https://library.olympics.com/Default/basicfilesdownload.ashx?itemGuid=2ECE9BE9-EA5F-4F0F-97DF-84C75B6BC60A",
} as const;

function q(
  id: string,
  difficulty: Difficulty,
  category: Exclude<GameCategory, "mixed">,
  question: string,
  options: [string, string, string, string],
  explanation: string,
  source: keyof typeof sources,
): Question {
  const choices: Question["choices"] = [
    { id: `${id}-0`, text: options[0] },
    { id: `${id}-1`, text: options[1] },
    { id: `${id}-2`, text: options[2] },
    { id: `${id}-3`, text: options[3] },
  ];
  return {
    id, difficulty, category, question, choices,
    correctAnswer: `${id}-0`, explanation,
    sourceUrl: sources[source], reviewedAt: "2026-10-14",
  };
}

// Turkish-only batch. The English question bank remains unchanged until translation is requested.
export const turkishBatchOne: readonly Question[] = [
  q("trb001", "easy", "space", "Uluslararası Astronomi Birliği gökyüzünü kaç resmi takımyıldıza ayırır?",
    ["88", "12", "64", "100"],
    "Uluslararası Astronomi Birliği, tüm gökyüzünü kapsayan 88 takımyıldız tanımlar.", "constellations"),
  q("trb002", "medium", "science_nature", "Depremin büyüklüğü bir tam sayı arttığında açığa çıkan enerji yaklaşık kaç katına çıkar?",
    ["32", "2", "10", "100"],
    "USGS'ye göre büyüklükteki bir birim artış yaklaşık 32 kat enerji salımına karşılık gelir.", "magnitude"),
  q("trb003", "easy", "geography", "Büyük Kanyon'un oluşumunda başlıca hangi nehrin aşındırması etkili olmuştur?",
    ["Colorado Nehri", "Mississippi Nehri", "Nil Nehri", "Amazon Nehri"],
    "ABD Ulusal Park Servisi, Büyük Kanyon'u Colorado Nehri'nin milyonlarca yıldır aşındırdığını açıklar.", "grandCanyon"),
  q("trb004", "medium", "history", "Gutenberg İncili hangi dilde basılmıştır?",
    ["Latince", "Almanca", "Yunanca", "İbranice"],
    "Library of Congress, Gutenberg İncili'nin Latince Vulgata metni olduğunu belirtir.", "gutenberg"),
  q("trb005", "easy", "sports", "İlk modern Olimpiyat Oyunları 1896'da hangi kentte düzenlendi?",
    ["Atina", "Paris", "Londra", "Roma"],
    "Uluslararası Olimpiyat Komitesi arşivine göre ilk modern oyunlar 1896'da Atina'da yapıldı.", "athens"),
];

export const turkishBatchTwo: readonly Question[] = [
  q("trb006", "medium", "space", "Resmi takımyıldız sınırları hangi yılda onaylandı?",
    ["1928", "1896", "1938", "2000"],
    "Uluslararası Astronomi Birliği, 88 takımyıldızın gökyüzündeki resmi sınırlarını 1928'de onayladı.", "constellations"),
  q("trb007", "medium", "science_nature", "Deprem büyüklüğü bir birim arttığında ölçülen sismik dalga genliği yaklaşık kaç katına çıkar?",
    ["10", "2", "32", "100"],
    "USGS'ye göre bir birimlik büyüklük artışı ölçülen sismik dalga genliğinde yaklaşık 10 kat artış demektir; açığa çıkan enerji ise yaklaşık 32 kat artar.", "magnitude"),
  q("trb008", "medium", "geography", "Büyük Kanyon, Colorado Nehri tarafından yaklaşık ne kadar sürede oyuldu?",
    ["5-6 milyon yıl", "5-6 bin yıl", "50-60 milyon yıl", "1,8 milyar yıl"],
    "ABD Ulusal Park Servisi, Colorado Nehri'nin kanyonu son yaklaşık 5-6 milyon yılda oyduğunu belirtir.", "grandCanyon"),
  q("trb009", "medium", "history", "Gutenberg İncili'nin baskısı hangi Alman kentinde tamamlandı?",
    ["Mainz", "Berlin", "Hamburg", "Münih"],
    "Library of Congress'a göre Gutenberg İncili'nin baskısı yaklaşık 1455'te Mainz'da tamamlandı.", "gutenberg"),
  q("trb010", "medium", "sports", "1896 Atina Olimpiyatları'nın programında kaç spor dalı vardı?",
    ["9", "5", "18", "28"],
    "Uluslararası Olimpiyat Komitesi arşivine göre 1896 Atina oyunlarının programında 9 spor dalı vardı.", "athens"),
];
