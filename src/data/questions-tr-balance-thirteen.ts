import type { Difficulty } from "../lib/config";
import type { GameCategory } from "../lib/categories";
import type { Question } from "../lib/types";

const sources = {
  berlin: "https://www.berlin.de/en/attractions-and-sights/3561866-3104052-berlin-wall.en.html",
  reunification: "https://www.bundesregierung.de/breg-de/themen/deutsche-einheit/3-10-1990-die-einheit-ist-wirklichkeit-432814",
  euEarly: "https://european-union.europa.eu/principles-countries-history/history-eu/1945-59_en",
  euTreaties: "https://european-union.europa.eu/principles-countries-history/principles-and-values/founding-agreements_en",
  southAfrica: "https://www.gov.za/issues/20years/milestones-20-years-freedom",
  southAfricaHistory: "https://www.gov.za/about-sa/history",
} as const;

type Category = Exclude<GameCategory, "mixed">;
type Row = readonly [string, Difficulty, Category, string, readonly [string, string, string, string], string, keyof typeof sources];

const rows: readonly Row[] = [
  ["trz001", "easy", "history", "Berlin Duvarı hangi şehrin doğu ve batı kesimlerini ayırdı?", ["Berlin", "Viyana", "Prag", "Varşova"], "Berlin şehir yönetimi, duvarın Doğu ve Batı Berlin'i ayırdığını anlatır.", "berlin"],
  ["trz002", "medium", "history", "Berlin Duvarı'nın inşası hangi yılda başladı?", ["1961", "1945", "1975", "1999"], "Berlin şehir yönetimi, duvar inşasının 1961'de başladığını belirtir.", "berlin"],
  ["trz003", "medium", "history", "Berlin Duvarı'nın açılması hangi yılda gerçekleşti?", ["1989", "1961", "1999", "2004"], "Berlin şehir yönetimi, duvarın 1989'da açıldığını belirtir.", "berlin"],
  ["trz004", "medium", "history", "Doğu ve Batı Almanya hangi yıl yeniden birleşti?", ["1990", "1980", "2000", "1961"], "Alman hükümeti, yeniden birleşmenin 3 Ekim 1990'da gerçekleştiğini kaydeder.", "reunification"],
  ["trz005", "easy", "history", "Schuman Bildirisi, Avrupa ülkelerinde hangi iki sanayi alanının ortak yönetimini önerdi?", ["Kömür ve çelik", "Sinema ve müzik", "Tarım ve turizm", "Tekstil ve otomotiv"], "AB tarih sayfası, Schuman planının kömür ve çelik sektörlerinin birleşmesini önerdiğini açıklar.", "euEarly"],
  ["trz006", "medium", "history", "Schuman Bildirisi hangi yıl açıklandı?", ["1950", "1918", "1970", "1993"], "AB tarih sayfası, Schuman Bildirisi'nin 9 Mayıs 1950'de sunulduğunu belirtir.", "euEarly"],
  ["trz007", "medium", "history", "Avrupa Ekonomik Topluluğu'nu kuran antlaşmalar hangi şehirde imzalandı?", ["Roma", "Paris", "Berlin", "Londra"], "AB tarih sayfası, 1957 Roma Antlaşmalarının AET'yi kurduğunu belirtir.", "euEarly"],
  ["trz008", "medium", "history", "Roma Antlaşmaları hangi yılda imzalandı?", ["1957", "1945", "1979", "1993"], "AB tarih sayfası, Roma Antlaşmalarının 25 Mart 1957'de imzalandığını kaydeder.", "euEarly"],
  ["trz009", "medium", "history", "Avrupa Kömür ve Çelik Topluluğu'na başlangıçta kaç ülke katıldı?", ["Altı", "İki", "On", "On beş"], "AB tarih sayfası, ilk kömür ve çelik iş birliğine altı ülkenin katıldığını belirtir.", "euEarly"],
  ["trz010", "hard", "history", "Avrupa Kömür ve Çelik Topluluğu'nun ilk altı ülkesinden biri hangisidir?", ["Lüksemburg", "Norveç", "İsviçre", "İspanya"], "AB, ilk altı ülke arasında Lüksemburg'u listeler.", "euEarly"],
  ["trz011", "medium", "history", "Avrupa Birliği'ni kuran Maastricht Antlaşması hangi yıl yürürlüğe girdi?", ["1993", "1957", "1973", "2007"], "AB'nin kurucu antlaşmalar sayfası Maastricht Antlaşması'nın 1993'te yürürlüğe girdiğini belirtir.", "euTreaties"],
  ["trz012", "hard", "history", "1957 Roma Antlaşmalarının AET dışında oluşturduğu diğer topluluk hangisidir?", ["Euratom", "NATO", "UNESCO", "Dünya Bankası"], "AB tarih sayfası, ikinci antlaşmanın Avrupa Atom Enerjisi Topluluğu'nu kurduğunu belirtir.", "euEarly"],
  ["trz013", "easy", "history", "Güney Afrika'nın tüm ırklardan yurttaşların katıldığı ilk demokratik seçimi hangi yılda yapıldı?", ["1994", "1960", "1976", "2010"], "Güney Afrika hükümeti, ilk demokratik seçimin 1994'te düzenlendiğini açıklar.", "southAfrica"],
  ["trz014", "medium", "history", "Güney Afrika Anayasa Mahkemesi'nin resmî açılışı hangi yılda yapıldı?", ["1995", "1961", "1982", "2010"], "Güney Afrika hükümeti, Anayasa Mahkemesi'nin 14 Şubat 1995'te açıldığını kaydeder.", "southAfrica"],
  ["trz015", "medium", "history", "1994 seçimlerinden sonra Güney Afrika'nın ilk demokratik devlet başkanı kim oldu?", ["Nelson Mandela", "Desmond Tutu", "F. W. de Klerk", "Thabo Mbeki"], "Güney Afrika hükümeti, Mandela'nın ilk demokratik başkan olduğunu açıklar.", "southAfrica"],
  ["trz016", "hard", "history", "Güney Afrika'nın 1994 seçimlerinden sonra kurduğu ilk hükümetin adı neydi?", ["Ulusal Birlik Hükümeti", "İmparatorluk Konseyi", "Askerî Cunta", "Geçici Krallık"], "Güney Afrika hükümeti, seçimlerin ardından Ulusal Birlik Hükümeti kurulduğunu açıklar.", "southAfricaHistory"],
  ["trz017", "hard", "history", "Güney Afrika'daki 1994 seçimleri hangi ayrımcı sistemin sona ermesiyle ilişkilidir?", ["Apartheid", "Feodalizm", "Merkantilizm", "Sömürge loncası"], "Güney Afrika hükümeti, seçimleri apartheid sonrası demokratik geçişin dönüm noktası olarak tanımlar.", "southAfrica"],
];

export const turkishBalanceThirteen: readonly Question[] = rows.map(([id, difficulty, category, question, options, explanation, source]) => ({
  id, difficulty, category, question,
  choices: options.map((text, index) => ({ id: `${id}-${index}`, text })) as unknown as Question["choices"],
  correctAnswer: `${id}-0`, explanation, sourceUrl: sources[source], reviewedAt: "2026-11-10",
}));
