import type { Difficulty } from "../lib/config";
import type { GameCategory } from "../lib/categories";
import type { Question } from "../lib/types";

const sources = {
  magna: "https://www.parliament.uk/magnacarta/",
  magnaSeal: "https://www.parliament.uk/about/living-heritage/evolutionofparliament/2015-parliament-in-the-making/2015-historic-anniversaries/magna-carta/the-making-of-magna-carta-/",
  declaration: "https://www.archives.gov/milestone-documents/declaration-of-independence",
  silk: "https://whc.unesco.org/en/list/1442",
  silkHistory: "https://www.unesco.org/en/silk-roads/about-silk-roads",
  rights: "https://www.un.org/en/about-us/universal-declaration-of-human-rights/",
  rightsHistory: "https://www.un.org/en/about-us/udhr/history-of-the-declaration",
} as const;

type Category = Exclude<GameCategory, "mixed">;
type Row = readonly [string, Difficulty, Category, string, readonly [string, string, string, string], string, keyof typeof sources];

const rows: readonly Row[] = [
  ["try001", "easy", "history", "Magna Carta hangi ülkenin tarihindeki bir belgedir?", ["İngiltere", "Japonya", "Mısır", "Brezilya"], "Birleşik Krallık Parlamentosu, Magna Carta'yı İngiltere'deki 1215 belgesi olarak tanıtır.", "magna"],
  ["try002", "medium", "history", "Magna Carta ilk kez hangi yılda çıkarıldı?", ["1215", "1066", "1453", "1789"], "Birleşik Krallık Parlamentosu, ilk Magna Carta'nın 1215'te çıkarıldığını belirtir.", "magna"],
  ["try003", "medium", "history", "Magna Carta ile ilişkili İngiliz hükümdarı kimdir?", ["Kral John", "VIII. Henry", "I. Elizabeth", "Kraliçe Victoria"], "Birleşik Krallık Parlamentosu, 1215 Magna Carta'sını Kral John ile ilişkilendirir.", "magna"],
  ["try004", "hard", "history", "Magna Carta'nın 1215'te kabul edildiği yer neresidir?", ["Runnymede", "Westminster", "Oxford", "Canterbury"], "Birleşik Krallık Parlamentosu, 1215 belgesinin Runnymede'de kabul edildiğini belirtir.", "magna"],
  ["try005", "easy", "history", "ABD Bağımsızlık Bildirgesi hangi yıl kabul edildi?", ["1776", "1492", "1815", "1918"], "ABD Ulusal Arşivi, bildirgenin 4 Temmuz 1776'da kabul edildiğini kaydeder.", "declaration"],
  ["try006", "medium", "history", "ABD Bağımsızlık Bildirgesi kolonilerin hangi devletten ayrıldığını duyurdu?", ["Büyük Britanya", "Fransa", "İspanya", "Hollanda"], "Bildirgede kolonilerin Britanya tacıyla siyasi bağlarını kopardıkları ilan edilir.", "declaration"],
  ["try007", "medium", "history", "ABD Bağımsızlık Bildirgesi'ni kabul eden kurum hangisiydi?", ["Kıta Kongresi", "Birleşmiş Milletler", "Avrupa Parlamentosu", "NATO"], "ABD Ulusal Arşivi, bildirgenin Kıta Kongresi tarafından kabul edildiğini açıklar.", "declaration"],
  ["try008", "hard", "history", "ABD Bağımsızlık Bildirgesi'nin asıl metnini hazırlamakla görevlendirilen kişi kimdi?", ["Thomas Jefferson", "George Washington", "Abraham Lincoln", "Benjamin Franklin"], "ABD Ulusal Arşivi, beş kişilik komitede yazma görevinin Jefferson'a verildiğini belirtir.", "declaration"],
  ["try009", "easy", "history", "Tarihî İpek Yolları en çok hangi iki bölge arasında alışverişi kolaylaştırdı?", ["Doğu Asya ve Batı Asya/Avrupa", "Antarktika ve Arktika", "Avustralya ve Grönland", "İzlanda ve Madagaskar"], "UNESCO, İpek Yolları'nı Asya ile batı bölgelerini bağlayan bir ağ olarak açıklar.", "silk"],
  ["try010", "medium", "history", "İpek Yolları adını özellikle hangi ticaret ürününden alır?", ["İpek", "Demir", "Kömür", "Kahve"], "UNESCO, Çin'den batıya yüksek değerli mallar, özellikle ipek ticaretinin büyüdüğünü belirtir.", "silk"],
  ["try011", "medium", "history", "UNESCO'ya göre İpek Yolları yalnız malları değil hangi alanı da taşıdı?", ["Dinî inanç ve kültürel fikirleri", "Sadece spor skorlarını", "Sadece hava raporlarını", "Sadece seçim sonuçlarını"], "UNESCO, ağın inanç, bilim, teknoloji ve sanatın yayılmasını sağladığını açıklar.", "silk"],
  ["try012", "hard", "history", "UNESCO'nun Chang'an-Tianshan İpek Yolu koridorunun doğu ucu hangi ülkedeydi?", ["Çin", "İspanya", "Mısır", "Brezilya"], "UNESCO, koridorun Çin'deki Chang'an/Luoyang kentlerinden başladığını belirtir.", "silk"],
  ["try013", "hard", "history", "Çin'den batıya ilk İpek Yolu güzergâhını açmakla ilişkilendirilen elçi kimdir?", ["Zhang Qian", "Marco Polo", "İbn Battuta", "Zheng He"], "UNESCO, Zhang Qian'ın batıya diplomatik göreve gönderildiğini ve ilk güzergâhın açılmasıyla anıldığını belirtir.", "silkHistory"],
  ["try014", "easy", "history", "İnsan Hakları Evrensel Bildirgesi hangi kuruluş tarafından ilan edildi?", ["Birleşmiş Milletler", "Olimpiyat Komitesi", "Dünya Bankası", "UNESCO"], "BM, bildirgenin Genel Kurul tarafından ilan edildiğini belirtir.", "rights"],
  ["try015", "medium", "history", "İnsan Hakları Evrensel Bildirgesi hangi yılda ilan edildi?", ["1948", "1919", "1972", "2001"], "BM, bildirgenin 10 Aralık 1948'de ilan edildiğini belirtir.", "rights"],
  ["try016", "medium", "history", "İnsan Hakları Evrensel Bildirgesi hangi şehirde kabul edildi?", ["Paris", "Roma", "Cenevre", "New York"], "BM, Genel Kurulun bildirgeyi Paris'te kabul ettiğini açıklar.", "rights"],
  ["try017", "hard", "history", "İnsan Hakları Evrensel Bildirgesi'ni hazırlama süreci hangi savaşın ardından hızlandı?", ["İkinci Dünya Savaşı", "Kırım Savaşı", "Yüz Yıl Savaşı", "Truva Savaşı"], "BM, bildirgenin İkinci Dünya Savaşı deneyiminin ardından hazırlandığını belirtir.", "rightsHistory"],
];

export const turkishBalanceTwelve: readonly Question[] = rows.map(([id, difficulty, category, question, options, explanation, source]) => ({
  id, difficulty, category, question,
  choices: options.map((text, index) => ({ id: `${id}-${index}`, text })) as unknown as Question["choices"],
  correctAnswer: `${id}-0`, explanation, sourceUrl: sources[source], reviewedAt: "2026-11-10",
}));
