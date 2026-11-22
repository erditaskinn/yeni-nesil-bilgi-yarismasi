import type { Difficulty } from "../lib/config";
import type { GameCategory } from "../lib/categories";
import type { Question } from "../lib/types";

const sources = {
  vermeer: "https://www.rijksmuseum.nl/en/collection/node/Johannes-Vermeer--5eb6c8bfe50817180452a6fcfb20510d",
  vermeerFacts: "https://www.rijksmuseum.nl/en/stories/dutch-masters/story/10-things-about-johannes-vermeer",
  rembrandt: "https://www.rijksmuseum.nl/en/collection/node/Rembrandt-van-Rijn--ba2dc062acd137ffeac364321b7b10df",
  heritage: "https://ich.unesco.org/en/state/turkiye-TR?info=elements-on-the-lists",
  meddah: "https://ich.unesco.org/en/RL/arts-of-the-meddah-public-storytellers-00037",
  asik: "https://ich.unesco.org/en/RL/aklk-minstrelsy-tradition-00179",
  cini: "https://ich.unesco.org/en/RL/traditional-craftsmanship-of-cini-making-01058",
  keskek: "https://ich.unesco.org/en/RL/ceremonial-keskek-tradition-00388",
  hat: "https://ich.unesco.org/en/RL/husn-i-hat-traditional-calligraphy-in-islamic-art-in-turkey-01684",
  whistle: "https://ich.unesco.org/en/RL/whistled-language-00658",
  miniature: "https://ich.unesco.org/en/RL/art-of-miniature-01598",
} as const;

type Category = Exclude<GameCategory, "mixed">;
type Row = readonly [string, Difficulty, Category, string, readonly [string, string, string, string], string, keyof typeof sources];

const rows: readonly Row[] = [
  ["trq001", "easy", "arts_culture", "Vermeer'in Sütçü Kız tablosundaki kişinin elinde tuttuğu kap ne içerir?", ["Süt", "Kum", "Mürekkep", "Çiçek"], "Rijksmuseum, tablodaki kadının kaptan süt döktüğünü anlatır.", "vermeerFacts"],
  ["trq002", "easy", "arts_culture", "Vermeer'in Küçük Sokak tablosu hangi tür şehir görüntüsünü konu alır?", ["Bir sokak görünümünü", "Bir deniz savaşını", "Bir dağ zirvesini", "Bir saray törenini"], "Rijksmuseum, yapıtı Delft'teki evleri ve sokağı gösteren bir kent manzarası olarak tanıtır.", "vermeerFacts"],
  ["trq003", "medium", "arts_culture", "Johannes Vermeer'in yaşamı ve resimleriyle ilişkilendirilen Hollanda kenti hangisidir?", ["Delft", "Rotterdam", "Utrecht", "Eindhoven"], "Rijksmuseum, Vermeer'in Delft'te yaşayıp çalıştığını açıklar.", "vermeer"],
  ["trq004", "medium", "arts_culture", "Vermeer ressamlığın yanında hangi işle de uğraştı?", ["Sanat eserleri ticareti", "Deniz kaptanlığı", "Tıp eğitimi", "Mimarlık"], "Rijksmuseum Vermeer'i sanat eseri satıcısı olarak da tanımlar.", "vermeer"],
  ["trq005", "medium", "arts_culture", "Vermeer'in birçok tablosunda öne çıkan gündelik ortam hangisidir?", ["Ev içi sahneler", "Savaş meydanları", "Okyanus gemileri", "Fabrika atölyeleri"], "Rijksmuseum, Vermeer'in dingin ev içi sahnelerine yoğunlaştığını anlatır.", "vermeer"],
  ["trq006", "medium", "arts_culture", "Rembrandt'ın resimlerindeki dramatik etkiyi artıran görsel karşıtlık hangisidir?", ["Işık ve gölge", "Yazı ve sayı", "Harita ve cetvel", "Ses ve sessizlik"], "Rijksmuseum, Rembrandt'ın güçlü aydınlık-karanlık karşıtlıkları kullandığını belirtir.", "rembrandt"],
  ["trq007", "hard", "arts_culture", "Vermeer'in mavi boya için kullandığı değerli taş kökenli pigment hangisidir?", ["Lacivert taşı (lapis lazuli)", "Kuvars kumu", "Mermer tozu", "Kömür"], "Rijksmuseum, Vermeer'in maviyi lapis lazuliden elde ettiğini anlatır.", "vermeerFacts"],
  ["trq008", "hard", "arts_culture", "Rembrandt ilk çıraklığını hangi Hollanda kentinde yaptı?", ["Leiden", "Delft", "Groningen", "Eindhoven"], "Rijksmuseum, Rembrandt'ın ilk eğitimini memleketi Leiden'de aldığını yazar.", "rembrandt"],
  ["trq009", "hard", "arts_culture", "Rijksmuseum'a göre Vermeer'in yapıtları ölümünden sonra hangi yüzyılda yeniden ilgi gördü?", ["19. yüzyıl", "16. yüzyıl", "18. yüzyıl", "21. yüzyıl"], "Rijksmuseum, Vermeer'in 19. yüzyıl ortalarında yeniden keşfedildiğini belirtir.", "vermeer"],
  ["trq010", "expert", "arts_culture", "Rijksmuseum'un Rembrandt koleksiyonunda yaklaşık kaç desen bulunur?", ["64", "6", "640", "6.400"], "Rijksmuseum, koleksiyonunda Rembrandt'a ait 64 desen bulunduğunu kaydeder.", "rembrandt"],

  ["trq011", "easy", "turkiye", "Meddah geleneğinde hikâyeyi çoğunlukla kaç anlatıcı sahneler?", ["Bir", "İki", "Beş", "On"], "UNESCO meddahlığı tek anlatıcının gerçekleştirdiği bir gösteri olarak açıklar.", "meddah"],
  ["trq012", "easy", "turkiye", "Âşıklık geleneğinde şair-şarkıcıların çaldığı telli çalgı hangisidir?", ["Saz", "Piyano", "Trompet", "Timpani"], "UNESCO, âşıkların saz çalarak şiir ve türkü söylediklerini belirtir.", "asik"],
  ["trq013", "easy", "turkiye", "Hüsn-i hat hangi sanat dalıyla ilgilidir?", ["Güzel yazı", "Heykel", "Dans", "Dokuma"], "UNESCO hüsn-i hattı estetik yazı geleneği olarak tanımlar.", "hat"],
  ["trq014", "easy", "turkiye", "Geleneksel Türk çinisi en çok hangi nesne türüyle ilişkilidir?", ["Sırlı seramik ve karo", "Bakır tel", "Yün halat", "Cam mercek"], "UNESCO çiniyi sırlı karo ve seramik geleneği olarak açıklar.", "cini"],
  ["trq015", "medium", "turkiye", "Keşkek geleneğinde pişirilen yemeğin iki ana malzemesi hangisidir?", ["Buğday ve et", "Pirinç ve balık", "Mısır ve süt", "Mercimek ve meyve"], "UNESCO keşkekte buğday ve etin birlikte pişirildiğini anlatır.", "keskek"],
  ["trq016", "medium", "turkiye", "Anadolu'daki ıslık dili hangi ihtiyaca yanıt olarak gelişti?", ["Uzak mesafeden iletişim", "Resim çizme", "Su ölçme", "Yemek saklama"], "UNESCO, dağlık arazide uzak mesafeden iletişimin bu geleneği geliştirdiğini belirtir.", "whistle"],
  ["trq017", "medium", "turkiye", "Minyatür sanatında görüntüler tarihsel olarak özellikle hangi nesnede metne eşlik etti?", ["Kitaplarda", "Spor toplarında", "Motorlarda", "Saat kadranlarında"], "UNESCO, minyatürün tarihsel olarak kitap metnini görselleştirdiğini açıklar.", "miniature"],
  ["trq018", "medium", "turkiye", "Âşıkların şiir ve müzik geleneği çoğunlukla hangi yolla aktarılır?", ["Usta-çırak ilişkisiyle", "Yalnız matbu resmî sınavla", "Yalnız televizyonla", "Yalnız müze vitriniyle"], "UNESCO, âşıklıkta uzun çıraklık ve sözlü aktarımı anlatır.", "asik"],
  ["trq019", "medium", "turkiye", "Çini motiflerinde aşağıdaki hangi desen grubu yaygındır?", ["Bitki ve geometrik biçimler", "Yalnız elektrik devreleri", "Yalnız trafik levhaları", "Yalnız uydu görüntüleri"], "UNESCO çinilerde bitki, hayvan ve geometrik motifleri sayar.", "cini"],
  ["trq020", "hard", "turkiye", "UNESCO'nun Türk çini yapımını Somut Olmayan Miras listesine aldığı yıl hangisidir?", ["2016", "2006", "1996", "2026"], "UNESCO, geleneksel çini yapımını 2016'da listeye kaydetti.", "cini"],
  ["trq021", "hard", "turkiye", "Islık dili UNESCO'nun hangi koruma listesinde yer alır?", ["Acil koruma gerektiren miras", "Yalnız dünya doğal mirası", "Yalnız su altı mirası", "Yalnız belgesel mirası"], "UNESCO, ıslık dilini acil koruma gerektiren somut olmayan miras listesinde tutar.", "whistle"],
  ["trq022", "medium", "turkiye", "Hüsn-i hat geleneğinde kullanılan geleneksel yazı aracı hangisidir?", ["Kamış kalem", "Baskı merdanesi", "Daktilo", "Fırın maşası"], "UNESCO, kamış kalemi hattatların geleneksel araçları arasında sayar.", "hat"],
  ["trq023", "medium", "turkiye", "Meddahların tarihsel gösteri mekânlarından biri hangisidir?", ["Kahvehane", "Uzay istasyonu", "Buz pisti", "Denizaltı"], "UNESCO, meddahların kahvehane ve pazaryeri gibi kamusal alanlarda gösteri yaptığını anlatır.", "meddah"],
];

export const turkishBalanceFour: readonly Question[] = rows.map(([id, difficulty, category, question, options, explanation, source]) => ({
  id, difficulty, category, question,
  choices: options.map((text, index) => ({ id: `${id}-${index}`, text })) as unknown as Question["choices"],
  correctAnswer: `${id}-0`, explanation, sourceUrl: sources[source], reviewedAt: "2026-11-10",
}));
