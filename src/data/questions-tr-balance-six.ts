import type { Difficulty } from "../lib/config";
import type { GameCategory } from "../lib/categories";
import type { Question } from "../lib/types";

const sources = {
  genres: "https://www.bfi.org.uk/features/genres-where-draw-line",
  films: "https://www.bfi.org.uk/sight-and-sound/greatest-films-all-time",
  pixar: "https://www.pixar.com/feature-films/",
} as const;

type Category = Exclude<GameCategory, "mixed">;
type Row = readonly [string, Difficulty, Category, string, readonly [string, string, string, string], string, keyof typeof sources];

const rows: readonly Row[] = [
  ["trs001", "easy", "cinema_television", "Birbirinden bağımsız kısa öykülerin tek bir filmde bir araya gelmesine ne denir?", ["Antoloji film", "Belgesel", "Western", "Biyografi"], "BFI, antoloji filmleri kendi içinde tamamlanan bölümlerin bir araya geldiği yapımlar olarak tanımlar.", "genres"],
  ["trs002", "medium", "cinema_television", "Periler ve hayali yaratıklar gibi doğaüstü öğeler içeren filmler hangi türe girer?", ["Fantastik", "Belgesel", "Polisiye", "Biyografi"], "BFI'nin fantastik tür tanımı mitolojik ve doğaüstü varlıkları içerir.", "genres"],
  ["trs003", "medium", "cinema_television", "Yüksek karşıtlıklı ışık ve karamsar kent atmosferiyle tanınan sinema türü hangisidir?", ["Film noir", "Müzikal", "Western", "Animasyon"], "BFI, film noir için kent ortamı, belirgin ışık karşıtlığı ve karamsar havayı sayar.", "genres"],
  ["trs004", "medium", "cinema_television", "Gerçek bir olayı anlatmak yerine geçmiş bir çağda geçen kurmaca hikâyeye BFI sınıflamasında ne denir?", ["Kostümlü dönem filmi", "Haber filmi", "Belgesel", "Doğa filmi"], "BFI, kostümlü dönem filmlerini geçmişte geçen fakat gerçek olaylara dayanmayan yapımlar olarak açıklar.", "genres"],
  ["trs005", "medium", "cinema_television", "Sinema tarihindeki 'actuality' filmleri çoğunlukla neyi kaydederdi?", ["Günlük yaşamdan gerçek görüntüleri", "Uzay savaşlarını", "Sahne müzikallerini", "Çizgi romanları"], "BFI, erken actuality filmlerini gündelik hayatı veya olayları kaydeden sessiz filmler olarak tanımlar.", "genres"],
  ["trs006", "medium", "cinema_television", "BFI'nin film noir örnekleri arasında hangi film bulunur?", ["The Maltese Falcon", "The Sound of Music", "Finding Nemo", "The Wizard of Oz"], "BFI, The Maltese Falcon filmini film noir örnekleri arasında gösterir.", "genres"],
  ["trs007", "medium", "cinema_television", "Citizen Kane filminin yönetmeni kimdir?", ["Orson Welles", "Alfred Hitchcock", "Stanley Kubrick", "Akira Kurosawa"], "BFI film listesi Citizen Kane'in yönetmenini Orson Welles olarak verir.", "films"],
  ["trs008", "medium", "cinema_television", "Vertigo filmini kim yönetti?", ["Alfred Hitchcock", "Orson Welles", "Wong Kar Wai", "Yasujirō Ozu"], "BFI, Vertigo'nun yönetmenini Alfred Hitchcock olarak listeler.", "films"],
  ["trs009", "medium", "cinema_television", "2001: A Space Odyssey filminin yönetmeni kimdir?", ["Stanley Kubrick", "George Lucas", "Steven Spielberg", "Ridley Scott"], "BFI, filmin yönetmenini Stanley Kubrick olarak kaydeder.", "films"],
  ["trs010", "hard", "cinema_television", "BFI listesinde Japon yönetmen Yasujirō Ozu'nun kuşaklar arası ilişkileri anlattığı film hangisidir?", ["Tokyo Story", "Seven Samurai", "Rashomon", "Ikiru"], "BFI, Tokyo Story'yi Ozu'nun kuşaklar arası ilişkileri anlatan filmi olarak açıklar.", "films"],
  ["trs011", "hard", "cinema_television", "Akira Kurosawa'nın Kral Lear öyküsünü feodal Japonya'ya taşıyan filmi hangisidir?", ["Ran", "Ikiru", "Yojimbo", "Rashomon"], "BFI, Ran filminin Shakespeare'in King Lear eserini feodal Japonya'ya uyarladığını belirtir.", "films"],
  ["trs012", "hard", "cinema_television", "Wim Wenders'ın bir meleğin insan olmayı arzuladığı filmi hangisidir?", ["Wings of Desire", "Paris, Texas", "Ran", "The Birds"], "BFI, Wings of Desire filminin başındaki meleğin insan olma isteğini anlatır.", "films"],
  ["trs013", "hard", "cinema_television", "The Good, the Bad and the Ugly filminin yönetmeni kimdir?", ["Sergio Leone", "Federico Fellini", "Michelangelo Antonioni", "Roberto Rossellini"], "BFI film listesi yönetmen olarak Sergio Leone'yi gösterir.", "films"],
  ["trs014", "hard", "cinema_television", "Mad Max: Fury Road filminin yönetmeni kimdir?", ["George Miller", "Peter Jackson", "James Cameron", "Ridley Scott"], "BFI film listesi Mad Max: Fury Road'un yönetmenini George Miller olarak verir.", "films"],
  ["trs015", "hard", "cinema_television", "The Birds filmindeki kuş saldırılarının yaşandığı yerleşimin adı nedir?", ["Bodega Bay", "Twin Peaks", "Amity Island", "Hill Valley"], "BFI, The Birds filminin Bodega Bay adlı kasabada geçtiğini belirtir.", "films"],
  ["trs016", "easy", "cinema_television", "Pixar'ın 1995 yapımı uzun metraj filminin adı nedir?", ["Toy Story", "Cars", "Coco", "Luca"], "Pixar'ın uzun metraj film listesinde Toy Story, 1995 yapımı olarak yer alır.", "pixar"],
  ["trs017", "medium", "cinema_television", "Pixar'ın uzun metraj film listesinde hangi yapım 2008 yılına aittir?", ["WALL-E", "Coco", "Soul", "Luca"], "Pixar, WALL-E filmini 2008 yapımı olarak listeler.", "pixar"],
  ["trs018", "medium", "cinema_television", "Pixar'ın uzun metraj filmleri arasında 2017 yapımı olan hangisidir?", ["Coco", "Soul", "Luca", "Up"], "Pixar, Coco filmini 2017 yılıyla listeler.", "pixar"],
  ["trs019", "medium", "cinema_television", "Pixar'ın 2009 yapımı uzun metraj filmi hangisidir?", ["Up", "Brave", "Onward", "Elemental"], "Pixar'ın film listesinde Up, 2009 yılına aittir.", "pixar"],
  ["trs020", "medium", "cinema_television", "Pixar'ın uzun metraj film listesinde 2020 yılına ait yapımlardan biri hangisidir?", ["Soul", "Luca", "Coco", "Finding Dory"], "Pixar'ın film listesinde Soul 2020, diğer seçenekler farklı yıllardadır.", "pixar"],
];

export const turkishBalanceSix: readonly Question[] = rows.map(([id, difficulty, category, question, options, explanation, source]) => ({
  id, difficulty, category, question,
  choices: options.map((text, index) => ({ id: `${id}-${index}`, text })) as unknown as Question["choices"],
  correctAnswer: `${id}-0`, explanation, sourceUrl: sources[source], reviewedAt: "2026-11-10",
}));
