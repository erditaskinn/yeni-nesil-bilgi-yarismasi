import type { Difficulty } from "../lib/config";
import type { GameCategory } from "../lib/categories";
import type { Question } from "../lib/types";

const sources = {
  olympics: "https://www.olympics.com/ioc/faq/history-and-origin-of-the-games/what-is-the-origin-of-the-olympic-games",
  nile: "https://whc.unesco.org/en/list/86",
  papyrus: "https://www.metmuseum.org/pt/essays/papyrus-making-in-egypt",
  hieroglyphs: "https://www.metmuseum.org/-/media/files/learn/for-educators/publications-for-educators/the-art-of-ancient-egypt.pdf",
  portrait: "https://www.nationalgallery.org.uk/paintings/glossary/the-genres",
  piano: "https://www.metmuseum.org/de/essays/the-piano-the-pianofortes-of-bartolomeo-cristofori-1655-1731",
  monaLisa: "https://www.louvre.fr/en/explore/the-palace/from-the-mona-lisa-to-the-wedding-feast-at-cana",
  ankara: "https://goturkiye.com/culturaljourneys/the-gateway-from-ankara-to-anatolia",
  bosphorus: "https://goturkiye.com/tr/istanbul/bogaz",
  lira: "https://tcmb.gov.tr/wps/wcm/connect/TR/TCMB%2BTR/Main%2BMenu/Banka%2BHakkinda/Sikca%2BSorulan%2BSorular/TL%2BSimgesi",
  cappadocia: "https://goturkiye.com/central/central-goturkiye",
  marmara: "https://goturkiye.com/seas/marmara-sea",
} as const;

type Category = Exclude<GameCategory, "mixed">;
type Row = readonly [string, Category, string, readonly [string, string, string, string], string, keyof typeof sources];

const rows: readonly Row[] = [
  ["trn051", "history", "Antik Olimpiyat Oyunları hangi ülkede başladı?", ["Yunanistan", "Mısır", "İtalya", "Hindistan"], "Antik Olimpiyat Oyunları, Antik Yunanistan'daki Olympia'da düzenlenirdi.", "olympics"],
  ["trn052", "history", "Antik Mısır'da yazı yazmak için kullanılan bitkisel malzeme hangisiydi?", ["Papirüs", "Bambu", "Pamuk", "Keten"], "Papirüs bitkisinden yapılan yüzey, Antik Mısır'da yazı malzemesi olarak kullanıldı.", "papyrus"],
  ["trn053", "history", "Hiyeroglifler en çok hangi eski uygarlığın yazısıyla ilişkilidir?", ["Antik Mısır", "Antik Roma", "İnka", "Vikingler"], "Hiyeroglif yazısı, Antik Mısır'ın anıtlarında ve yazılı eserlerinde kullanıldı.", "hieroglyphs"],
  ["trn054", "history", "Antik Mısır uygarlığının geliştiği ülkenin içinden hangi büyük nehir geçer?", ["Nil", "Ren", "Tuna", "Amazon"], "Nil Nehri, Antik Mısır'ın yerleşim ve tarım yaşamının merkezindeydi.", "nile"],
  ["trn055", "history", "Antik Mısır hükümdarları için kullanılan yaygın unvan hangisidir?", ["Firavun", "Konsül", "Şövalye", "Senatör"], "Firavun, Antik Mısır hükümdarları için kullanılan unvandır.", "hieroglyphs"],
  ["trn056", "arts_culture", "Bir portre resminde genellikle ne tasvir edilir?", ["Bir kişi", "Bir gezegen", "Bir yemek tarifi", "Bir bina planı"], "Portre, resimde insanı konu alan türlerden biridir.", "portrait"],
  ["trn057", "arts_culture", "Mona Lisa hangi müzede sergileniyor?", ["Louvre Müzesi", "Prado Müzesi", "British Museum", "Uffizi Galerisi"], "Mona Lisa, Paris'teki Louvre Müzesi'nde sergilenir.", "monaLisa"],
  ["trn058", "arts_culture", "Piyano çalarken notaları hangi bölümdeki tuşlarla seçersin?", ["Klavye", "Yay", "Ağızlık", "Zil"], "Piyano, klavyesindeki tuşlarla çalınan bir müzik aletidir.", "piano"],
  ["trn059", "arts_culture", "Mona Lisa bir resim mi, heykel mi, yoksa müzik eseri midir?", ["Resim", "Heykel", "Müzik eseri", "Dans gösterisi"], "Louvre, Mona Lisa'yı Leonardo da Vinci'nin yaptığı bir tablo olarak tanımlar.", "monaLisa"],
  ["trn060", "arts_culture", "Peyzaj resmi çoğunlukla hangi konuyu gösterir?", ["Doğal manzaraları", "Bir kişinin portresini", "Bir spor karşılaşmasını", "Bir müzik notasını"], "Peyzaj, doğa ve çevre manzaralarını konu alan resim türüdür.", "portrait"],
  ["trn061", "turkiye", "Türkiye'nin başkenti hangi şehirdir?", ["Ankara", "İstanbul", "İzmir", "Antalya"], "Ankara, Türkiye'nin başkentidir.", "ankara"],
  ["trn062", "turkiye", "İstanbul Boğazı hangi şehrimizdedir?", ["İstanbul", "Ankara", "Bursa", "Konya"], "İstanbul Boğazı, İstanbul'da Asya ile Avrupa yakalarını ayırır.", "bosphorus"],
  ["trn063", "turkiye", "Türk lirasının para birimi simgesi hangisidir?", ["₺", "€", "$", "£"], "Türkiye Cumhuriyet Merkez Bankasına göre Türk lirasının simgesi ₺ işaretidir.", "lira"],
  ["trn064", "turkiye", "Kapadokya hangi coğrafi bölgemizdedir?", ["İç Anadolu", "Marmara", "Ege", "Karadeniz"], "Kapadokya, İç Anadolu Bölgesi'nde yer alır.", "cappadocia"],
  ["trn065", "turkiye", "İstanbul Boğazı hangi iki denizi birbirine bağlar?", ["Karadeniz ve Marmara Denizi", "Ege Denizi ve Akdeniz", "Karadeniz ve Ege Denizi", "Marmara Denizi ve Akdeniz"], "İstanbul Boğazı, Marmara Denizi'ni Karadeniz'e bağlar.", "marmara"],
];

export const turkishEasyAdditions: readonly Question[] = rows.map(([id, category, question, options, explanation, source]) => ({
  id,
  difficulty: "easy" satisfies Difficulty,
  category,
  question,
  choices: options.map((text, index) => ({ id: `${id}-${index}`, text })) as unknown as Question["choices"],
  correctAnswer: `${id}-0`,
  explanation,
  sourceUrl: sources[source],
  reviewedAt: "2026-11-09",
}));
