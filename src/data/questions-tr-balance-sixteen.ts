import type { Difficulty } from "../lib/config";
import type { GameCategory } from "../lib/categories";
import type { Question } from "../lib/types";

const sources = {
  volleyball: "https://www.fivb.com/volleyball/the-game/basic-rules/",
  swimming: "https://www.worldaquatics.com/news/1980866/swimming-history-and-presentation",
  handball: "https://www.ihf.info/competitions/women/307/olympic-games-tokyo-2020---womens-tournament/20353/news/63743",
  rings: "https://www.olympics.com/ioc/olympic-rings",
} as const;

type Category = Exclude<GameCategory, "mixed">;
type Row = readonly [string, Difficulty, Category, string, readonly [string, string, string, string], string, keyof typeof sources];

const rows: readonly Row[] = [
  ["trac001", "easy", "sports", "Salon voleybolunda bir takım sahada kaç oyuncu bulundurur?", ["Altı", "Dört", "Beş", "Yedi"], "FIVB, salon voleybolunda sahada takım başına altı oyuncu bulunduğunu belirtir.", "volleyball"],
  ["trac002", "medium", "sports", "Salon voleybolunda bir takım topu rakip alana göndermeden önce en fazla kaç kez oynayabilir?", ["Üç", "Bir", "Beş", "Yedi"], "FIVB, blok temasına ek olarak takıma üç vuruş hakkı tanındığını açıklar.", "volleyball"],
  ["trac003", "medium", "sports", "Voleybolda servis hakkı rakipten kazanılınca oyuncular hangi yönde döner?", ["Saat yönünde", "Saat yönünün tersine", "Yalnızca ileri", "Yer değiştirmezler"], "FIVB, servis hakkı kazanılınca oyuncuların bir konum saat yönünde döndüğünü belirtir.", "volleyball"],
  ["trac004", "medium", "sports", "Salon voleybolunda ilk dört set normalde kaç sayıda biter?", ["25", "15", "21", "30"], "FIVB, ilk dört set için 25 sayılık hedef verir; iki sayı fark da gerekir.", "volleyball"],
  ["trac005", "medium", "sports", "Salon voleybolunda karar setinin normal hedef sayısı kaçtır?", ["15", "21", "25", "30"], "FIVB, beşinci setin 15 sayıya oynandığını belirtir.", "volleyball"],
  ["trac006", "medium", "sports", "Voleybolda bir seti kazanmak için en az kaç sayı fark gerekir?", ["İki", "Bir", "Üç", "Beş"], "FIVB, setin en az iki sayılık farkla kazanıldığını açıklar.", "volleyball"],
  ["trac007", "medium", "sports", "Voleybolda farklı renkte forma giyen savunma uzmanı oyuncuya ne denir?", ["Libero", "Pasör çaprazı", "Smaçör", "Orta oyuncu"], "FIVB, libero rolünü farklı renkli formasıyla tanımlar.", "volleyball"],
  ["trac008", "hard", "sports", "Voleybolda arka alan oyuncusunun ön tarafta topa saldırmak için gerisinden sıçraması gereken çizgiye ne denir?", ["Hücum çizgisi", "Orta çizgi", "Servis çizgisi", "Saha dışı çizgisi"], "FIVB, arka alan oyuncusunun hücum çizgisinin gerisinden sıçraması gerektiğini belirtir.", "volleyball"],
  ["trac009", "easy", "sports", "Sırtüstü yüzme stilinde sporcu vücudunun hangi yüzüyle suya bakar?", ["Sırtıyla", "Karnıyla", "Yanıyla", "Dizleriyle"], "World Aquatics, sırtüstü stili sporcunun sırtı üstünde yüzmesi olarak tanımlar.", "swimming"],
  ["trac010", "medium", "sports", "Kelebek yüzme stilinde iki kol genellikle nasıl hareket eder?", ["Aynı anda", "Sırayla", "Hiç hareket etmez", "Yalnızca su altında"], "World Aquatics, kelebekte iki kolun eşzamanlı öne atıldığını açıklar.", "swimming"],
  ["trac011", "medium", "sports", "Olimpik uzun kulvar yüzme havuzu kaç metredir?", ["50", "25", "75", "100"], "World Aquatics, olimpik uzun kulvar havuzunu 50 metre olarak tanımlar.", "swimming"],
  ["trac012", "medium", "sports", "Serbest stil yüzmede sporcu hangi yüzme stilini seçebilir?", ["İstediği stili", "Yalnız sırtüstünü", "Yalnız kurbağalamayı", "Yalnız kelebeği"], "World Aquatics, serbest stilde yüzücünün istediği stili kullanabileceğini açıklar.", "swimming"],
  ["trac013", "hard", "sports", "Kelebek yüzme stili hangi yılda ayrı bir stil olarak resmen tanındı?", ["1952", "1896", "1912", "2000"], "World Aquatics, kelebeğin 1952'de ayrı stil olarak tanındığını belirtir.", "swimming"],
  ["trac014", "easy", "sports", "Salon hentbolunda bir takım sahada kaç oyuncuyla oynar?", ["Yedi", "Beş", "Altı", "Dokuz"], "IHF, hentbolda bir takımda kaleciyle birlikte yedi oyuncu olduğunu belirtir.", "handball"],
  ["trac015", "medium", "sports", "Yetişkin salon hentbolunda normal maç kaç devreden oluşur?", ["İki", "Bir", "Üç", "Dört"], "IHF, normal maç süresini iki devre olarak açıklar.", "handball"],
  ["trac016", "medium", "sports", "Yetişkin salon hentbolunda bir devre kaç dakikadır?", ["30", "20", "40", "45"], "IHF, normal hentbol maçında her devrenin 30 dakika olduğunu belirtir.", "handball"],
  ["trac017", "medium", "sports", "Hentbolda kaleci dışındaki bir oyuncunun ağır ihlalde aldığı kısa süreli uzaklaştırma kaç dakikadır?", ["İki", "Bir", "Beş", "On"], "IHF, iki dakikalık uzaklaştırma cezasını oyun yaptırımı olarak tanımlar.", "handball"],
  ["trac018", "medium", "sports", "Olimpiyat halkaları hangi fikri simgeler?", ["Beş kıtanın birlikteliğini", "Beş spor dalını", "Beş madalyayı", "Beş ev sahibi kenti"], "IOC, halkaların beş kıtanın birliğini temsil ettiğini açıklar.", "rings"],
  ["trac019", "hard", "sports", "Olimpiyat halkalarını ilk tasarlayan kişi kimdir?", ["Pierre de Coubertin", "James Connolly", "Jesse Owens", "Juan Antonio Samaranch"], "IOC, halka simgesinin Pierre de Coubertin tarafından tasarlandığını belirtir.", "rings"],
  ["trac020", "hard", "sports", "Olimpiyat halkaları oyunlarda ilk kez hangi yıl kullanıldı?", ["1920", "1896", "1913", "1957"], "IOC, halkaların olimpiyatlardaki ilk kullanımını 1920 Antwerp Oyunları olarak verir.", "rings"],
];

export const turkishBalanceSixteen: readonly Question[] = rows.map(([id, difficulty, category, question, options, explanation, source]) => ({
  id, difficulty, category, question,
  choices: options.map((text, index) => ({ id: `${id}-${index}`, text })) as unknown as Question["choices"],
  correctAnswer: `${id}-0`, explanation, sourceUrl: sources[source], reviewedAt: "2026-11-10",
}));
