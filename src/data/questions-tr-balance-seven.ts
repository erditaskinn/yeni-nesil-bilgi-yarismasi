import type { Difficulty } from "../lib/config";
import type { GameCategory } from "../lib/categories";
import type { Question } from "../lib/types";

const sources = {
  films: "https://www.bfi.org.uk/sight-and-sound/greatest-films-all-time",
  emmy: "https://www.televisionacademy.com/awards/nominees-winners",
  awards: "https://www.televisionacademy.com/awards",
  nature: "https://www.pbs.org/wnet/nature/about/",
  nova: "https://www.pbs.org/show/nova/",
  masterpiece: "https://www.pbs.org/franchise/masterpiece/",
  universe: "https://www.pbs.org/wgbh/nova/series/nova-universe-revealed/",
} as const;

type Category = Exclude<GameCategory, "mixed">;
type Row = readonly [string, Difficulty, Category, string, readonly [string, string, string, string], string, keyof typeof sources];

const rows: readonly Row[] = [
  ["trt001", "medium", "cinema_television", "2001: A Space Odyssey hangi sinema türünün örneğidir?", ["Bilim kurgu", "Western", "Müzikal", "Biyografi"], "BFI, filmi insanlığın uzay yolculuğunu anlatan bilim kurgu sinemasının önemli örneklerinden biri olarak tanımlar.", "films"],
  ["trt002", "medium", "cinema_television", "BFI listesine göre Citizen Kane filminin merkezindeki karakterin mesleği nedir?", ["Gazete patronu", "Doktor", "Pilot", "Dedektif"], "BFI, Charles Foster Kane'i gazete patronu olarak tanımlar.", "films"],
  ["trt003", "medium", "cinema_television", "BFI listesinde The Birds filmini yöneten kişi kimdir?", ["Alfred Hitchcock", "Orson Welles", "Akira Kurosawa", "George Miller"], "BFI film listesi The Birds'ün yönetmeni olarak Alfred Hitchcock'u gösterir.", "films"],
  ["trt004", "hard", "cinema_television", "BFI listesine göre 1975 yapımı Jeanne Dielman filminin yönetmeni kimdir?", ["Chantal Akerman", "Agnès Varda", "Claire Denis", "Sofia Coppola"], "BFI, Jeanne Dielman filminin yönetmenini Chantal Akerman olarak verir.", "films"],
  ["trt005", "hard", "cinema_television", "BFI listesinde Wong Kar Wai'nin yönettiği film hangisidir?", ["In the Mood for Love", "Tokyo Story", "Vertigo", "Citizen Kane"], "BFI listesi In the Mood for Love filmini Wong Kar Wai'nin yönettiğini belirtir.", "films"],
  ["trt006", "hard", "cinema_television", "BFI listesine göre Ikiru filminin yönetmeni kimdir?", ["Akira Kurosawa", "Yasujirō Ozu", "Sergio Leone", "Wim Wenders"], "BFI, Ikiru filminin yönetmenini Akira Kurosawa olarak verir.", "films"],
  ["trt007", "hard", "cinema_television", "BFI listesinde Paris, Texas filmini kim yönetti?", ["Wim Wenders", "Werner Herzog", "Jim Jarmusch", "David Lynch"], "BFI, Paris, Texas filminin yönetmenini Wim Wenders olarak listeler.", "films"],
  ["trt008", "easy", "cinema_television", "Televizyondaki bir komedi dizisinin Emmy'de yarıştığı ana dal hangisidir?", ["Komedi dizisi", "Belgesel film", "Animasyon filmi", "Haber fotoğrafı"], "Television Academy, Komedi Dizisi ödülünü ayrı bir dal olarak listeler.", "emmy"],
  ["trt009", "easy", "cinema_television", "Televizyonda gerçek olayları konu alan programlar için Emmy'de hangi dal bulunur?", ["Belgesel/kurgu dışı program", "Animasyon", "Komedi oyunculuğu", "Kostüm tasarımı"], "Television Academy ödül listesinde belgesel ve kurgu dışı program dalları yer alır.", "emmy"],
  ["trt010", "medium", "cinema_television", "Emmy ödüllerindeki 'Character Voice-Over Performance' dalı hangi işe verilir?", ["Karakter seslendirmesi", "Kamera yönetimi", "Dizi senaryosu", "Dekor tasarımı"], "Television Academy karakter seslendirme performansını ayrı dal olarak listeler.", "emmy"],
  ["trt011", "medium", "cinema_television", "Televizyon Akademisi'nde spor yayınlarıyla ilgili Emmy ödüllerini hangi kuruluş yönetir?", ["National Academy of Television Arts & Sciences", "Film Akademisi", "Amerikan Film Enstitüsü", "Pixar"], "Television Academy, spor Emmy ödüllerinden NATAS'ın sorumlu olduğunu açıklar.", "awards"],
  ["trt012", "medium", "cinema_television", "Emmy ödüllerindeki 'Reality Competition Program' dalı hangi tür yapımları kapsar?", ["Gerçek kişilerin yarıştığı programları", "Kurmaca dramaları", "Çizgi filmleri", "Haber bültenlerini"], "Television Academy, reality yarışma programları için ayrı ödül dalı listeler.", "emmy"],
  ["trt013", "medium", "cinema_television", "Emmy ödüllerinde 'Guest Actor' dalı hangi oyunculuk biçimini değerlendirir?", ["Konuk oyunculuğu", "Başrol oyunculuğunu", "Dublörlüğü", "Ses kurgusunu"], "Television Academy, konuk oyuncu performanslarını ayrı kategorilerde değerlendirir.", "emmy"],
  ["trt014", "medium", "cinema_television", "Emmy ödüllerinde 'Limited or Anthology Series' hangi tür dizileri kapsar?", ["Sınırlı veya antoloji dizilerini", "Yalnızca haber bültenlerini", "Yalnızca canlı spor yayınlarını", "Yalnızca reklamları"], "Television Academy ödül listesinde sınırlı veya antoloji dizisi dalı bulunur.", "emmy"],
  ["trt015", "easy", "cinema_television", "PBS'in NATURE dizisi en çok hangi konuyu anlatır?", ["Doğa ve yaban hayatı", "Otomobil yarışları", "Borsa haberleri", "Yemek tarifleri"], "PBS, NATURE dizisini doğal yaşam belgeselleri olarak tanıtır.", "nature"],
  ["trt016", "medium", "cinema_television", "PBS'in bilim belgeselleriyle tanınan dizisi hangisidir?", ["NOVA", "MASTERPIECE", "NATURE", "Pantomime Quiz"], "PBS, NOVA'yı bilim belgeselleri dizisi olarak sunar.", "nova"],
  ["trt017", "medium", "cinema_television", "PBS'in İngiliz dönem ve polisiye dramalarıyla tanınan dizi kuşağı hangisidir?", ["MASTERPIECE", "NOVA", "NATURE", "PBS NewsHour"], "PBS, MASTERPIECE'i İngiliz dönem dramaları ve polisiye yapımlarıyla tanıtır.", "masterpiece"],
  ["trt018", "medium", "cinema_television", "PBS'in NOVA Universe Revealed belgesel dizisinin bölümlerinden biri hangi konuyu işler?", ["Kara delikler", "Otomobil tarihi", "Klasik bale", "Olimpiyat oyunları"], "PBS, NOVA Universe Revealed bölümleri arasında kara delikleri listeler.", "universe"],
  ["trt019", "hard", "cinema_television", "BFI listesine göre Hiroshima mon amour filminin yönetmeni kimdir?", ["Alain Resnais", "Jean-Luc Godard", "François Truffaut", "Agnès Varda"], "BFI, Hiroshima mon amour filminin yönetmeni olarak Alain Resnais'yi listeler.", "films"],
];

export const turkishBalanceSeven: readonly Question[] = rows.map(([id, difficulty, category, question, options, explanation, source]) => ({
  id, difficulty, category, question,
  choices: options.map((text, index) => ({ id: `${id}-${index}`, text })) as unknown as Question["choices"],
  correctAnswer: `${id}-0`, explanation, sourceUrl: sources[source], reviewedAt: "2026-11-10",
}));
